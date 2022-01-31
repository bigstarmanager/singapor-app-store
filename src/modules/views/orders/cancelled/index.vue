<template>
  <ion-page>
    <ion-content class="order_cancelled_container" :scroll-events="true" @ionScroll="getScrollEvent($event)">
      <div v-if="Object.keys(cancelled_order).length > 0">
        <div class="you_will_receive">
          <ion-icon :icon="informationCircleOutline" />
          <span>{{ $t('order.you_will_receive') }}</span>
        </div>
        <div class="back-to-top" :class="showBackToTop ? 'show' : ''" @click="clickBackToTop">
          <span>{{ $t('back_to_top') }}</span>
        </div>
        <OrderItem
          :orders="cancelled_order"
          :currencySymbol="currencySymbol"
          :currencyCode="currencyCode"
          :showProgress="false"
          :showTotalPrice="false"
          @show-refund-modal="showRefundModal"
          @show-Cancel-modal="showCancelModal()"
        />
        <ion-infinite-scroll
          @ionInfinite="loadData($event)"
          threshold="100px"
          id="infinite-scroll"
          :disabled="isDisabled"
        >
          <ion-infinite-scroll-content
            loading-spinner="bubbles"
            loading-text="Loading more data..."
            class="order_infinite"
          >
          </ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </div>
      <ion-grid v-else class="empty-content">
        <ion-img src="/assets/images/empty_orders.png" />
        <ion-label> {{ $t('order.have_no_cancelled') }} </ion-label>
        <ion-label>
          <span class="browse" @click="gotoCategory()">{{ $t('order.browse') }}</span>
          {{ $t('order.our_food') }}
        </ion-label>
      </ion-grid>
      <div v-show="isLoading">
        <ion-item class="padding-0 order-item" v-for="index in 3" v-bind:key="index">
          <SkeletonOrderItem />
        </ion-item>
      </div>
      <ion-modal :is-open="isOpenRef" css-class="refund-breakdown-modal" @didDismiss="setOpen(false)">
        <refund-breakdown-modal
          :currencySymbol="currencySymbol"
          :refundBreakdown="refundBreakdown"
          @close-modal="setOpen(false)"
        >
        </refund-breakdown-modal>
      </ion-modal>
    </ion-content>
  </ion-page>
</template>

<script>
import { informationCircleOutline } from 'ionicons/icons';
import OrderItem from '../../../../components/OrderItem';
import SkeletonOrderItem from '../../../../components/OrderItem/skeletonOrderItem.vue';
import RefundBreakdownModal from '../../../../components/RefundBreakdownModal';
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonContent,
  IonPage,
  IonLabel,
  IonIcon,
  IonModal,
  IonImg,
  IonGrid,
  toastController
} from '@ionic/vue';
import { defineComponent, ref, inject } from 'vue';
import {
  getAllOrdersPaginate,
  cancelB2cOrderItem,
  updatePreOrderItemCancelledReadStatus
} from '../../../../services/shared/graphql/allOrdersPaginate';
import { ORDER_STATUS } from '../../../../services/shared/helper/constants';
import { useMutation } from '@vue/apollo-composable';
import { alertController } from '@ionic/core';

export default defineComponent({
  name: 'OrderCancelled',
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonContent,
    IonPage,
    IonLabel,
    IonModal,
    IonIcon,
    IonImg,
    IonGrid,
    OrderItem,
    SkeletonOrderItem,
    RefundBreakdownModal
  },
  async setup() {
    let cancelled_order = ref({});
    let isLoading = ref(true);
    let cancelled_count = 0;
    let isOpenRef = ref(false);
    let isDisabled = ref(false);
    const { mutate: fetchAllOrdersPaginate } = useMutation(getAllOrdersPaginate);
    const { mutate: fetchCancelB2cOrderItem } = useMutation(cancelB2cOrderItem);
    const { mutate: _updatePreOrderItemCancelledReadStatus } = useMutation(
      updatePreOrderItemCancelledReadStatus
    );
    const currentUser = await inject('$storage').getUser();
    let showBackToTop = ref(false);
    let refundBreakdown = ref({});
    let clickToTop = true;
    let prevScrollPos = 0;
    let nextScrollPos = 0;
    const setOpen = (state) => (isOpenRef.value = state);

    const updateOrderItemCollectedReadStatus = () => {
      _updatePreOrderItemCancelledReadStatus({ user_id: currentUser.id })
        .then(() => {})
        .catch((error) => {
          console.error(error);
        });
    };

    const getOverViewData = (pageOffset) => {
      fetchAllOrdersPaginate({
        status_id: ORDER_STATUS.CANCELLED,
        user_id: currentUser.id,
        limit: 5,
        offset: pageOffset
      })
        .then((res) => {
          const response = res.data.allOrdersPaginate.items;
          const orders = Object.keys(cancelled_order.value).length > 0 ? cancelled_order.value : {};
          response.map((item) => {
            const order = item;
            let currentOrder;
            if (orders[`P_${order.payment_b2c_id}`]) {
              currentOrder = orders[`P_${order.payment_b2c_id}`];
            } else {
              currentOrder = orders[`Pre_${order.id}`];
            }
            if (!currentOrder) {
              const key = order.payment_b2c_id ? `P_${order.payment_b2c_id}` : `Pre_${order.id}`;
              orders[key] = {
                id: order.payment_b2c_id ? order.payment_b2c_id : order.id,
                hub: order.pre_order_item[0].hub,
                totalOrder: order.payment_b2c_id ? order.paymentB2c.order_total : order.total_charged,
                totalDiscount: order.payment_b2c_id
                  ? order.paymentB2c.discount_amount
                  : order.voucher_discount,
                suppliers: {
                  [order.supplier ? order.supplier.name : 'supplier']: {
                    info: order.supplier,
                    orders: [order]
                  }
                }
              };
            } else if (currentOrder.suppliers[order.supplier.name]) {
              currentOrder.totalOrder += order.payment_b2c_id ? 0 : order.total_charged;
              currentOrder.totalDiscount += order.payment_b2c_id ? 0 : order.voucher_discount;
              currentOrder.suppliers[order.supplier.name].orders.push(order);
            } else {
              currentOrder.totalOrder += order.payment_b2c_id ? 0 : order.total_charged;
              currentOrder.totalDiscount += order.payment_b2c_id ? 0 : order.voucher_discount;
              currentOrder.suppliers[order.supplier.name] = {
                info: order.supplier,
                orders: [order]
              };
            }
          });
          cancelled_order.value = orders;
          if (res.data.allOrdersPaginate.total_count < 5) isDisabled.value = true;
          isLoading.value = false;
        })
        .catch((error) => {
          console.error(error);
          isLoading.value = false;
        });
    };
    if (currentUser.id) {
      updateOrderItemCollectedReadStatus();
      getOverViewData(cancelled_count);
      cancelled_count += 5;
    }
    const loadData = (ev) => {
      setTimeout(() => {
        isLoading.value = true;
        getOverViewData(cancelled_count);
        cancelled_count += 5;
        ev.target.complete();
      }, 500);
    };
    return {
      cancelled_count,
      currencySymbol: currentUser.country.currency_symbol,
      currencyCode: currentUser.country.currency_code,
      cancelled_order,
      isLoading,
      informationCircleOutline,
      fetchCancelB2cOrderItem,
      getOverViewData,
      prevScrollPos,
      nextScrollPos,
      showBackToTop,
      isOpenRef,
      setOpen,
      refundBreakdown,
      clickToTop,
      isDisabled,
      loadData
    };
  },
  methods: {
    showCancelModal() {
      return alertController
        .create({
          cssClass: 'cancel_modal',
          message: this.$t('order.cancel_modal_text'),
          buttons: [
            {
              text: this.$t('order.back'),
              role: 'cancel',
              cssClass: 'secondary'
            },
            {
              text: this.$t('order.cancel_Item_modal'),
              handler: () => {
                let cancel_id = this.$store.getters['b2c/getSelectedCancelProductID'];
                document.querySelector('.order_item_' + cancel_id).style.display = 'none';
                document.querySelector('.skeleton_item_' + cancel_id).style.display = 'flex';
                this.fetchCancelB2cOrderItem({ id: cancel_id })
                  .then(() => {
                    this.openToast('success');
                    setTimeout(() => {
                      this.isLoading = true;
                      this.cancelled_count = 0;
                      this.cancelled_order = {};
                      this.getOverViewData(this.cancelled_count);
                      this.cancelled_count += 5;
                    }, 2500);
                  })
                  .catch((error) => {
                    this.openToast('failed');
                    document.querySelector('.order_item_' + cancel_id).style.display = 'flex';
                    document.querySelector('.skeleton_item_' + cancel_id).style.display = 'none';
                    console.error(error);
                  });
              }
            }
          ]
        })
        .then((a) => a.present());
    },
    async openToast(msg) {
      const toast = await toastController.create({
        message: msg == 'success' ? this.$t('cancelled_item') : this.$t('failed_cancel'),
        duration: 2000,
        cssClass: 'cancel_toast',
        color: msg == 'success' ? '' : 'danger',
        position: 'bottom'
      });
      return toast.present();
    },
    getScrollEvent: function (event) {
      this.nextScrollPos = event.detail.scrollTop;
      if (this.nextScrollPos < this.prevScrollPos && this.nextScrollPos > 1500) {
        if (this.clickToTop) this.showBackToTop = true;
      } else {
        this.showBackToTop = false;
      }
      this.prevScrollPos = this.nextScrollPos;
      if (this.nextScrollPos == 0) {
        this.clickToTop = true;
        this.showBackToTop = false;
      }
    },
    clickBackToTop() {
      this.showBackToTop = false;
      this.clickToTop = false;
      document.querySelector('ion-content.order_cancelled_container').scrollToTop(1500);
    },
    gotoCategory() {
      this.$router.push('/main/category');
    },
    showRefundModal(refundInfo) {
      this.refundBreakdown = refundInfo;
      this.setOpen(true);
    }
  }
});
</script>

<style scoped lang="scss">
.order_cancelled_container {
  .you_will_receive {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
    span {
      font-size: 3.382vw;
      line-height: 3.382vw;
      letter-spacing: 0.5px;
      margin-left: 5px;
    }
  }
  .back-to-top {
    z-index: 1000;
    position: fixed;
    top: -40px;
    left: 36%;
    padding: 10px;
    background: #04565a;
    border-radius: 20px;
    font-size: 3.382vw;
    color: white;
    transition: all 0.5s ease-in-out;
  }
  .back-to-top.show {
    top: calc(115px + var(--ion-safe-area-top));
    transition: all 0.5s ease-in-out;
  }
  .order-item {
    --padding-start: 3.865vw;
    --inner-padding-end: 3.865vw;
  }
  .empty-content {
    display: grid;
    padding: 0;
    position: absolute;
    top: 30%;
    left: 20%;
    ion-img {
      height: 48.309vw;
      margin-bottom: 4.831vw;
    }
    ion-label {
      text-align: center;
      font-size: 3.382vw;
      line-height: 4.831vw;
      color: #66717c;
      .browse {
        font-weight: 500;
        color: #04565a;
      }
    }
  }
  .order_infinite {
    min-height: 5px;
  }
}
:global(.refund-breakdown-modal) {
  --height: 19rem;
  --width: 100%;
}
:global(.refund-breakdown-modal > div) {
  position: fixed;
  overflow: hidden;
  overflow-y: hidden;
  bottom: 0%;
  left: 0;
  --border-radius: 12px 12px 0 0;
}
</style>

<template>
  <ion-page>
    <ion-content class="order_overview_container" :scroll-events="true" @ionScroll="getScrollEvent($event)">
      <div v-if="Object.keys(overview_order).length > 0">
        <div class="back-to-top" :class="showBackToTop ? 'show' : ''" @click="clickBackToTop">
          <span>{{ $t('back_to_top') }}</span>
        </div>
        <OrderItem
          :orders="overview_order"
          :currencySymbol="currencySymbol"
          :currencyCode="currencyCode"
          :showProgress="true"
          :showTotalPrice="true"
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
        <ion-label> {{ $t('order.have_no_overview') }} </ion-label>
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
      <ion-modal :is-open="isOpenNPS" css-class="nps-feedback" @didDismiss="isOpenNPS = false">
        <NPSFeedback @close="isOpenNPS = false" />
      </ion-modal>
    </ion-content>
    <ion-modal :is-open="isOpenRef" css-class="refund-breakdown-modal" @didDismiss="setOpen(false)">
      <refund-breakdown-modal
        :currencySymbol="currencySymbol"
        :refundBreakdown="refundBreakdown"
        @close-modal="setOpen(false)"
      >
      </refund-breakdown-modal>
    </ion-modal>
  </ion-page>
</template>

<script>
import OrderItem from '../../../../components/OrderItem';
import SkeletonOrderItem from '../../../../components/OrderItem/skeletonOrderItem.vue';
import NPSFeedback from '../../../../components/NPSfeedback';
import RefundBreakdownModal from '../../../../components/RefundBreakdownModal';

import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonItem,
  IonContent,
  IonPage,
  IonLabel,
  IonImg,
  IonModal,
  IonGrid,
  toastController
} from '@ionic/vue';
import { defineComponent, ref, inject } from 'vue';
import {
  getAllOrdersPaginate,
  cancelB2cOrderItem
} from '../../../../services/shared/graphql/allOrdersPaginate';
import { getCurrentUser, setRefundToEwallet } from '@/services/shared/graphql';
import { getNpsByUserId } from '../../../../services/shared/graphql/NPS';
import { useMutation } from '@vue/apollo-composable';
import { alertController } from '@ionic/core';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import Intercom from '@/services/shared/helper/intercom';

export default defineComponent({
  name: 'OrderOverview',
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonItem,
    IonContent,
    IonPage,
    IonLabel,
    IonImg,
    IonModal,
    IonGrid,
    NPSFeedback,
    OrderItem,
    SkeletonOrderItem,
    RefundBreakdownModal
  },
  async setup() {
    const store = useStore();
    let overview_order = ref({});
    let overview_count = 0;
    let isLoading = ref(true);
    let isDisabled = ref(false);
    let stars = 0;
    let isOpenRef = ref(false);
    let isOpenNPS = ref(false);
    let refundBreakdown = ref({});

    let isOpenRefundDefaultModal = ref(false);
    const { mutate: fetchAllOrdersPaginate } = useMutation(getAllOrdersPaginate);
    const { mutate: fetchCancelB2cOrderItem } = useMutation(cancelB2cOrderItem);
    const { mutate: fetchGetNpsByUserId } = useMutation(getNpsByUserId);
    const { mutate: fetchGetCurrentUser } = useMutation(getCurrentUser);
    const { mutate: fetchSetRefundToEwallet } = useMutation(setRefundToEwallet);
    const currentUser = await inject('$storage').getUser();
    let showBackToTop = ref(false);
    let clickToTop = true;
    let prevScrollPos = 0;
    let nextScrollPos = 0;

    const allowRefundDefaultTreedots = () => {
      closeRefundDefaultModal();
      fetchSetRefundToEwallet({ refundToEwallet: true })
        .then()
        .catch((err) => {
          console.error(err);
        });
    };

    const setOpen = (state) => (isOpenRef.value = state);

    const closeRefundDefaultModal = () => {
      isOpenRefundDefaultModal.value = false;
    };

    const getOverViewData = (pageOffset) => {
      fetchAllOrdersPaginate({
        status_id: [],
        user_id: currentUser.id,
        limit: 5,
        offset: pageOffset
      })
        .then((res) => {
          const response = res.data.allOrdersPaginate.items;
          const orders = Object.keys(overview_order.value).length > 0 ? overview_order.value : {};
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
          overview_order.value = orders;
          if (res.data.allOrdersPaginate.total_count < 5) isDisabled.value = true;
          isLoading.value = false;

          if (res.data.allOrdersPaginate.total_count > 0 && stars == 0) {
            fetchGetNpsByUserId({ user_id: currentUser.id })
              .then((res) => {
                stars = res.data.getNpsByUserId[0] ? res.data.getNpsByUserId[0].stars : 0;
                if (stars == 0) {
                  setTimeout(() => {
                    isOpenNPS.value = true;
                  }, 5000);
                }
              })
              .catch((error) => {
                console.error(error);
              });
          }
        })
        .catch((error) => {
          console.error(error);
          isLoading.value = false;
        });
    };
    /** & not from checkout */
    if (currentUser.id && !store.getters['b2c/getUpdateOrdersPage']) {
      getOverViewData(overview_count);
      overview_count += 5;
    }
    const loadData = (ev) => {
      setTimeout(() => {
        isLoading.value = true;
        getOverViewData(overview_count);
        overview_count += 5;
        ev.target.complete();
      }, 500);
    };
    return {
      overview_count,
      currentUser,
      currencySymbol: currentUser.country.currency_symbol,
      currencyCode: currentUser.country.currency_code,
      overview_order,
      isDisabled,
      prevScrollPos,
      nextScrollPos,
      showBackToTop,
      fetchCancelB2cOrderItem,
      fetchGetCurrentUser,
      fetchSetRefundToEwallet,
      getOverViewData,
      clickToTop,
      isOpenNPS,
      isOpenRef,
      refundBreakdown,
      isOpenRefundDefaultModal,
      allowRefundDefaultTreedots,
      closeRefundDefaultModal,
      stars,
      isLoading,
      loadData,
      setOpen
    };
  },
  ionViewWillEnter() {
    if (this.$store.getters['b2c/getUpdateOrdersPage']) {
      this.isLoading = true;
      this.overview_count = 0;
      this.overview_order = {};
      this.getOverViewData(this.overview_count);
      this.overview_count += 5;
      this.$store.dispatch('b2c/setUpdateOrdersPage', { status: false });
    }
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
                this.fetchCancelB2cOrderItem({ id: Number.parseInt(cancel_id) })
                  .then((res) => {
                    this.openToast('success');
                    this.trackCancelItemEvent(res.data.cancelB2cOrderItem, cancel_id);
                    setTimeout(() => {
                      this.isLoading = true;
                      this.overview_count = 0;
                      this.overview_order = {};
                      this.getOverViewData(this.overview_count);
                      this.overview_count += 5;

                      if (this.currentUser.country.id === 193) {
                        this.fetchGetCurrentUser().then((res) => {
                          this.isOpenRefundDefaultModal = !res.data?.me?.eWallet?.is_refund_to_e_wallet;
                        });
                      }
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
      document.querySelector('ion-content.order_overview_container').scrollToTop(1500);
    },
    gotoCategory() {
      this.$router.push('/main/category');
    },
    showRefundModal(refundInfo) {
      this.refundBreakdown = refundInfo;
      this.setOpen(true);
    },
    trackCancelItemEvent(preOrder, canceledItemid) {
      const item = preOrder?.pre_order_item.find((v) => v.id === canceledItemid);
      if (!item) return;

      const stripePaymentUrl =
        process.env.VUE_APP_ENV === 'production'
          ? 'https://dashboard.stripe.com/payments/'
          : 'https://dashboard.stripe.com/test/payments/';
      Intercom.trackEvent(Intercom.events.CANCEL_ITEM, {
        order_number: preOrder?.payment_b2c_id ? `${preOrder?.payment_b2c_id}-GB` : '-',
        stripe_transaction_id: preOrder?.paymentB2c?.stripe_transaction_id
          ? `${stripePaymentUrl}${preOrder.paymentB2c.stripe_transaction_id}`
          : null,
        collection_point: item.hub.alias_name,
        delivery_date: preOrder?.delivery_date ? dayjs(preOrder.delivery_date).format('YYYY-MM-DD') : null,
        order_status: preOrder?.order_status?.name || '-'
      });
    }
  }
});
</script>

<style scoped lang="scss">
.order_overview_container {
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
    top: calc(120px + var(--ion-safe-area-top));
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

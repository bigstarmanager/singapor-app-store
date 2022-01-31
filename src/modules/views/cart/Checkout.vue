<template>
  <loader-checkout-vue
    v-if="isPlacingOrder"
    @close-loader="onCloseLoader"
    :status="orderStatus"
    :error="errorMessage"
  ></loader-checkout-vue>
  <ion-page v-else>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/cart"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding">{{ $t('checkout') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list class="ion-no-padding" lines="none">
        <ion-item class="address-info">
          <ion-row class="ion-nowrap">
            <div class="marker">
              <ion-img src="/assets/images/mdi-map-marker-radius.svg"></ion-img>
            </div>
            <ion-row class="collection-point">
              <span class="name">{{ collectionPoint.name }}</span>
              <ion-text class="description">{{ displayCollectionPointAddress }}</ion-text>
            </ion-row>
          </ion-row>
        </ion-item>
        <div class="line-separator-2"></div>
        <supplier-checkout
          v-for="(cartItem, i) in cartItems"
          :key="cartItem.id"
          :ref="
            (el) => {
              if (el) suppliersRef[i] = el;
            }
          "
          :cartItem="cartItem"
          :products="cartItem.products"
        >
        </supplier-checkout>

        <div class="subfooter">
          <ion-item class="m-b-20" v-if="voucher">
            <ion-button
              class="ion-no-margin ion-no-padding"
              expand="full"
              fill="flat"
              @click="openVoucherPage"
            >
              <ion-img src="/assets/images/voucher.svg"></ion-img>
              <span class="payment-subheading margin-between-icons-2 text-theme-color"
                ><strong>{{ voucher.code }}</strong></span
              >
            </ion-button>
          </ion-item>
          <ion-item class="m-b-20">
            <ion-button
              class="ion-no-margin ion-no-padding"
              expand="full"
              fill="flat"
              @click="openPaymentOptionPage"
            >
              <ion-img src="/assets/images/dashicons-money-alt.svg"></ion-img>
              <span class="payment-subheading margin-between-icons-2 text-theme-color"
                ><strong>{{ $t('payment_option') }}</strong></span
              >
            </ion-button>
            <ion-button
              class="ion-no-margin ion-no-padding card-number"
              expand="full"
              fill="flat"
              @click="openPaymentOptionPage"
              slot="end"
            >
              <div
                class="ewallet"
                v-if="user?.country?.id !== 127 && !selectedCardPayment && selectedGrabpayAndFpx === null"
              >
                <ion-img src="/assets/images/paymentoption-treedots.svg"></ion-img>
                <span class="ewallet-amount">
                  {{ user?.country?.currency_symbol }}{{ ewalletAmount.toFixed(2) }}
                </span>
              </div>
              <div class="grab-fpx" v-else-if="selectedGrabpayAndFpx !== null && !selectedCardPayment">
                <!-- If want to add grab or fpx icon -->
                <!-- <ion-img :src="selectedGrabpayAndFpx === 'grabpay' ? '/assets/images/grab.svg' : '/assets/images/fpx.svg"/> -->
                <span class="payment-subheading">{{
                  selectedGrabpayAndFpx === 'grabpay' ? $t('grabpay') : $t('fpx')
                }}</span>
              </div>
              <div v-else>
                <span class="payment-subheading">{{
                  card ? displayCardNumber : $t('card_not_selected')
                }}</span>
              </div>
              <ion-img
                class="change-payment"
                v-if="card || selectedCardPayment || selectedGrabpayAndFpx"
                src="/assets/images/edit.svg"
              ></ion-img>
            </ion-button>
          </ion-item>
          <ion-item v-if="voucher">
            <ion-text class="payment-subheading">{{ $t('voucher_applied') }}</ion-text>
            <ion-text v-if="voucher" class="payment-subheading" slot="end"
              >-{{ user?.country?.currency_symbol }}{{ totalDiscountDisplay }}
            </ion-text>
          </ion-item>
          <ion-item>
            <ion-text class="payment-subheading">{{ $t('merchandise_subtotal') }}</ion-text>
            <ion-text class="payment-subheading" slot="end"
              >{{ user?.country?.currency_symbol }}{{ totalPriceDisplay }}
            </ion-text>
          </ion-item>
          <ion-item>
            <ion-text class="payment-heading">{{ $t('total_payment') }}</ion-text>
            <ion-text class="payment-heading f-s-18" slot="end"
              >{{ user?.country?.currency_symbol }}{{ overallPriceDisplay }}
            </ion-text>
          </ion-item>
          <ion-item>
            <ion-text class="payment-subheading f-s-14" slot="end">{{ $t('gst_included') }}</ion-text>
          </ion-item>
        </div>
      </ion-list>
      <ion-modal
        :is-open="isTreedotsOpen"
        css-class="cart__treedots-balance-modal"
        @didDismiss="isTreedotsOpen = false"
      >
        <treedots-balance-modal
          @close-modal="changePaymentMethod()"
          @top-up="isTreedotsOpen = false"
          :currencySymbol="user?.country?.currency_symbol"
        ></treedots-balance-modal>
      </ion-modal>
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-list lines="none">
          <ion-item>
            <ion-text class="f-s-16" slot="end">{{ $t('total_payment') }}</ion-text>
          </ion-item>
          <ion-item>
            <ion-text class="payment-heading text-theme-color" slot="end"
              >{{ user?.country?.currency_symbol }}{{ overallPriceDisplay }}</ion-text
            >
          </ion-item>
          <span v-if="checkoutButtonText !== ''" class="checkout-error-message">{{
            checkoutButtonText
          }}</span>
          <ion-button class="checkout-btn" expand="block" @click="onCheckout" :disabled="allowCheckout">
            <span>
              {{
                card || (!card && user.country.id === 193) || selectedGrabpayAndFpx !== null
                  ? $t('checkout')
                  : $t('select_payment_method')
              }}
            </span>
          </ion-button>
        </ion-list>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import SupplierCheckout from '@/components/Cart/Checkout/SupplierCheckout.vue';
import {
  getDefault,
  groupBuyCheckout,
  stripeCheckoutSuccessful,
  stripeCheckoutFailed,
  getEwalletBalance
} from '@/services/shared/graphql';
import {
  buildCartMinimumSpree,
  buildCheckoutCartItems,
  isCheckoutNotAllowed
} from '@/services/shared/helper/cart';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonBackButton,
  IonFooter,
  IonItem,
  IonList,
  IonImg,
  IonText,
  IonRow,
  IonModal
} from '@ionic/vue';
import { useMutation } from '@vue/apollo-composable';
import { computed, defineComponent, inject, provide, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import LoaderCheckoutVue, { CHECKOUT_STATUS } from '@/components/Cart/Checkout/LoaderCheckout.vue';
import Branch from '@/services/shared/helper/branch';
import Intercom from '@/services/shared/helper/intercom';
import TreedotsBalanceModal from '@/components/Cart/Checkout/PaymentOption/TreedotsBalanceModal.vue';
import { Browser } from '@capacitor/browser';

export default defineComponent({
  name: 'Checkout',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
    IonButtons,
    IonBackButton,
    IonFooter,
    IonItem,
    IonList,
    IonImg,
    IonText,
    IonRow,
    IonModal,
    SupplierCheckout,
    LoaderCheckoutVue,
    TreedotsBalanceModal
  },
  async setup() {
    const router = useRouter();
    const store = useStore();
    const storage = inject('$storage');
    const collectionPoint = store.getters['b2c/getSelectedHub'];
    const cartItems = store.getters['b2c/getCartSelectedProducts'];
    const { mutate: groupBuyCheckoutFn } = useMutation(groupBuyCheckout);
    const { mutate: stripeCheckoutSuccessfulFn } = useMutation(stripeCheckoutSuccessful);
    const { mutate: stripeCheckoutFailedFn } = useMutation(stripeCheckoutFailed);
    const orderStatus = ref(CHECKOUT_STATUS.IDLE);
    const isPlacingOrder = computed(() => {
      return orderStatus.value !== CHECKOUT_STATUS.IDLE;
    });
    const suppliersRef = ref([]);
    const getDefaultCard = ref({});
    const errorMessage = ref('general');
    const { mutate: fetchGetDefaultCard } = useMutation(getDefault);
    const { mutate: fetchGetEwalletBalance } = useMutation(getEwalletBalance);
    const ewalletAmount = ref(0);
    const isTreedotsOpen = ref(false);
    fetchGetDefaultCard()
      .then((res) => {
        // Append fields to honor listCustomerCard's return value
        let transformedData = {
          id: res.data.getDefaultCard.paymentMethodId,
          customer: res.data.getDefaultCard.stripeCustomerId
        };
        Object.assign(transformedData, res.data.getDefaultCard);
        getDefaultCard.value = transformedData;
      })
      .catch((error) => {
        console.error(error);
      });
    buildCartMinimumSpree;
    provide('user', user);
    const user = await storage.getUser();
    if (user.country.id !== 127) {
      fetchGetEwalletBalance()
        .then((res) => {
          ewalletAmount.value = res.data.getEwalletBalance.available;
          store.dispatch('b2c/setEwalletAmount', ewalletAmount.value);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    const onCloseLoader = () => {
      orderStatus.value = CHECKOUT_STATUS.IDLE;
    };

    return {
      router,
      user,
      collectionPoint,
      cartItems,
      store,
      storage,
      suppliersRef,
      groupBuyCheckoutFn,
      stripeCheckoutSuccessfulFn,
      stripeCheckoutFailedFn,
      orderStatus,
      isPlacingOrder,
      getDefaultCard,
      errorMessage,
      ewalletAmount,
      onCloseLoader,
      isTreedotsOpen
    };
  },
  computed: {
    voucher() {
      return this.store.getters['b2c/getVoucher'];
    },
    card() {
      let card = this.store.getters['b2c/getCard'];
      if (card) {
        return card;
      }
      if (this.getDefaultCard.card) {
        return this.getDefaultCard;
      }
      return undefined;
    },
    displayCardNumber() {
      return '**** **** **** ' + this.card.card?.last4;
    },
    selectedCardPayment() {
      return this.store.getters['b2c/getSelectedCardPayment'];
    },
    selectedGrabpayAndFpx() {
      return this.store.getters['b2c/getSelectedGrabpayAndFpx'];
    },
    displayCollectionPointAddress() {
      const aliasName = this.collectionPoint.alias_name ? `${this.collectionPoint.alias_name}` : '';
      const road = this.collectionPoint.road ? `, ${this.collectionPoint.road}` : '';
      const street_number = this.collectionPoint.defaultAddress?.street_number
        ? `, ${this.collectionPoint.defaultAddress?.street_number}`
        : '';
      const city = this.collectionPoint.city ? `, ${this.collectionPoint.city}` : '';
      const postal = this.collectionPoint.postal_code ? ` (${this.collectionPoint.postal_code})` : '';
      return `${aliasName}${road}${street_number}${city}${postal}`;
    },
    totalDiscount() {
      let discount = this.store.getters['b2c/calculateDiscount'];
      return discount;
    },
    totalDiscountDisplay() {
      return this.totalDiscount.toFixed(2);
    },
    totalPrice() {
      let totalPrice = 0;
      this.suppliersRef.map((supplier) => {
        totalPrice += supplier.getTotalPrice();
      });
      return totalPrice;
    },
    totalPriceDisplay() {
      return this.totalPrice.toFixed(2);
    },
    overallPriceDisplay() {
      const price = this.totalPrice - this.totalDiscount;
      return (price < 0 ? 0 : price).toFixed(2);
    },
    allowCheckout() {
      const finalPrice = +this.overallPriceDisplay;
      const checkoutNotAllowed =
        isCheckoutNotAllowed(this.user?.country?.name, this.selectedCardPayment, finalPrice) === '';
      return !checkoutNotAllowed;
    },
    checkoutButtonText() {
      const finalPrice = +this.overallPriceDisplay;
      const checkoutNotAllowed = isCheckoutNotAllowed(
        this.user?.country?.name,
        this.selectedCardPayment,
        finalPrice
      );
      return checkoutNotAllowed ? this.$t(checkoutNotAllowed) : '';
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name != 'Cart' && from.name != 'PaymentOption' && from.name != 'Voucher') {
      next({
        name: 'Cart'
      });
      return;
    }

    next();
  },
  methods: {
    openPaymentOptionPage() {
      this.store.dispatch('b2c/setPreviousRouteParams', { defaultCard: this.getDefaultCard });
      this.store.dispatch('b2c/setOrderTotalAmount', Number.parseFloat(this.overallPriceDisplay));
      this.router.push({
        name: 'PaymentOption'
      });
    },

    changePaymentMethod() {
      this.isTreedotsOpen = false;
      this.openPaymentOptionPage();
    },

    async onCheckout() {
      if (!this.card && this.user?.country?.id === 127 && this.selectedGrabpayAndFpx === null) {
        this.openPaymentOptionPage();
        return;
      } else if (
        this.user?.country?.id !== 127 &&
        !this.selectedCardPayment &&
        this.selectedGrabpayAndFpx === null &&
        this.ewalletAmount < this.overallPriceDisplay
      ) {
        this.isTreedotsOpen = true;
        return;
      }

      const checkoutCartItems = buildCheckoutCartItems(this.cartItems, this.collectionPoint.id);
      const voucherDiscount = this.voucher
        ? this.voucher.discount.type === 'AMOUNT'
          ? this.voucher.order.total_discount_amount / 100
          : this.voucher.discount.percent_off
        : null;
      const voucherDiscountUpperLimit = this.voucher?.discount?.amount_limit
        ? this.voucher.discount.amount_limit / 100
        : undefined;

      let userState = 'Singapore';
      if (this.user.country.id !== 193) {
        const state = await this.storage.getSelectedState();
        userState = state?.state || '';
      }

      const placeOrderObject = {
        payment_method:
          this.selectedCardPayment || this.selectedGrabpayAndFpx !== null ? 'STRIPE' : 'EWALLET',
        stripePaymentType: this.selectedGrabpayAndFpx !== null ? this.selectedGrabpayAndFpx : null,
        stripe_customer_id:
          this.selectedCardPayment || this.selectedGrabpayAndFpx !== null ? this.card.customer : '',
        stripe_card_id:
          !this.selectedCardPayment || this.selectedGrabpayAndFpx !== null ? null : this.card.id,
        voucherDiscount: voucherDiscount ? `${voucherDiscount}` : null,
        voucherDiscountType: this.voucher ? this.voucher.discount.type : null,
        voucherDiscountUpperLimit: voucherDiscountUpperLimit ? `${voucherDiscountUpperLimit}` : null,
        vouchercode: this.voucher ? this.voucher.code : null,
        voucherMinimumAmount:
          this.voucher && this.voucher.applicable_to.total
            ? (this.voucher.applicable_to.total / 100).toFixed(2)
            : null,
        userState: userState,
        cartItems: checkoutCartItems
      };

      this.orderStatus = CHECKOUT_STATUS.LOADING;

      this.groupBuyCheckoutFn(placeOrderObject).then(
        async (res) => {
          if (res.data.groupBuyCheckout && res.data.groupBuyCheckout[0].payment_status_id == 3) {
            this.trackPurchaseEvent(res.data.groupBuyCheckout);
            this.store.dispatch('b2c/setVoucher', null);
            this.store.dispatch('b2c/addApplicationState', { refetchCart: true });
            this.orderStatus = CHECKOUT_STATUS.SUCCESS;
            // this.sendPurchaseEvent(checkoutCartItems, res.data.groupBuyCheckout);
          } else if (res.data.groupBuyCheckout && res.data.groupBuyCheckout[0].payment_status_id == 2) {
            this.store.dispatch('b2c/setCheckoutGrabPayFpx', res.data.groupBuyCheckout[0]);
            this.store.dispatch('b2c/setItemsCheckoutGrabPayFpx', checkoutCartItems);
            this.trackPurchaseEvent(res.data.groupBuyCheckout);
            this.store.dispatch('b2c/setVoucher', null);
            this.store.dispatch('b2c/addApplicationState', { refetchCart: true });
            // open Stripe URL of GrabPay or FPX
            await Browser.open({
              toolbarColor: '#ffffff',
              presentationStyle: 'fullscreen',
              url: res.data.groupBuyCheckout[0].stripe_session?.url
            });
            this.onCloseLoader();
          } else {
            this.errorMessage = 'general';
            this.orderStatus = CHECKOUT_STATUS.FAIL;
            // payment_status_id: 10 == price - voucher <= 0?
            // alert('An error has occured with placing order!');
          }
        },
        (err) => {
          this.errorMessage = err.message;
          this.orderStatus = CHECKOUT_STATUS.FAIL;
          // alert('An error has occured with placing order!');
        }
      );
    },
    openVoucherPage() {
      this.router.push({
        name: 'Voucher'
      });
    },
    trackPurchaseEvent(orders) {
      try {
        let revenue = 0;
        let tax = 0;
        const items = [];

        orders.forEach((o) => {
          o.items.forEach((i) => {
            revenue += i.total_price;
            tax += i.tax;

            items.push({
              product: i.sku.product.name,
              sku: i.sku.name,
              price: i.sku.b2c_unit_price * i.sku.b2c_unit_per_oom,
              quantity: i.total_qty,
              is_order_by_weight: false, // Always false for now
              weight: i.sku.b2c_weight * i.total_qty,
              tenant: i.sku.product.tenant.tenant.name,
              order_item_id: i.id
            });
          });
        });

        Branch.trackPurchase({
          order_id: orders.length ? `${orders[0].payment_b2c_id}-GB` : '-',
          revenue,
          tax,
          payment_method: 'Credit Card', // Only Credit Card for now
          voucher_code: this.voucher ? this.voucher.code : '',
          items
        });

        const firstPreOrder = orders.length ? orders[0] : null;
        const stripePaymentUrl =
          process.env.VUE_APP_ENV === 'production'
            ? 'https://dashboard.stripe.com/payments/'
            : 'https://dashboard.stripe.com/test/payments/';
        Intercom.trackEvent(Intercom.events.ORDER_PLACED, {
          order_number: firstPreOrder?.payment_b2c_id ? `${firstPreOrder?.payment_b2c_id}-GB` : '-',
          stripe_transaction_id: firstPreOrder?.stripe_transaction_id
            ? `${stripePaymentUrl}${firstPreOrder?.stripe_transaction_id}`
            : null,
          collection_point: firstPreOrder.items[0].hub.alias_name,
          delivery_date: firstPreOrder?.delivery_date || null,
          order_status: firstPreOrder.items[0].order_item_status.name
        });
      } catch (error) {
        console.error('Checkout:trackPurchaseEvent', error.message);
      }
    }
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'Checkout.scss';
</style>

<style lang="scss">
.cart__treedots-balance-modal {
  --height: 382px;
  --width: 90%;

  div[role='dialog'] {
    position: absolute;
    --border-radius: 8px;
  }
}
</style>

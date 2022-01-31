<template>
  <ion-page>
    <ion-header> </ion-header>
    <ion-content fullscreen="true" class="content">
      <div class="flex">
        <lottie-vue :isOpen="true" :height="height" :width="width" :options="defaultOptions" />
        <template v-if="status === CHECKOUT_STATUS.SUCCESS">
          <p v-html="$t('checkout_loader.success')"></p>
        </template>
      </div>
    </ion-content>
    <ion-footer v-if="buttonText !== ''">
      <ion-toolbar>
        <ion-button class="checkout-btn" expand="block" @click="onNext">
          <span>
            {{ buttonText }}
          </span>
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import { defineComponent, ref, watchEffect } from 'vue';
import LottieVue from '@/components/Shared/Lottie.vue';
import * as successData from '@/assets/lottie/checkout/success.json';
import { IonContent, IonPage, IonButton, IonFooter, IonToolbar, IonHeader } from '@ionic/vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useMutation } from '@vue/apollo-composable';
import { stripeCheckoutSuccessful, stripeCheckoutFailed } from '@/services/shared/graphql';
export const CHECKOUT_STATUS = 'SUCCESS';

const CHECKOUT_DATA = {
  SUCCESS: {
    loop: false,
    animationData: successData.default,
    width: 350,
    height: 350,
    buttonText: 'checkout_loader.continue'
  }
};

export default defineComponent({
  name: 'CheckoutSuccess',
  components: { LottieVue, IonContent, IonPage, IonButton, IonFooter, IonToolbar, IonHeader },
  props: {
    status: Number
  },
  async setup(props) {
    const buttonText = ref('');
    const defaultOptions = ref({
      animationData: null
    });
    const width = ref(300);
    const height = ref(300);
    const { t } = useI18n();
    const router = useRouter();
    const store = useStore();
    const { mutate: stripeCheckoutSuccessfulFn } = useMutation(stripeCheckoutSuccessful);
    const { mutate: stripeCheckoutFailedFn } = useMutation(stripeCheckoutFailed);
    const checkoutGrabPayAndFpxData = store.getters['b2c/getCheckoutGrabPayFpx'];
    const itemsCheckoutGrabAndFpx = store.getters['b2c/getItemsCheckoutGrabPayFpx'];
    if (checkoutGrabPayAndFpxData !== null) {
      stripeCheckoutSuccessfulFn({
        paymentId: checkoutGrabPayAndFpxData.stripe_session?.payment_intent,
        paymentTxId: checkoutGrabPayAndFpxData.stripe_transaction_id,
        paymentB2cId: checkoutGrabPayAndFpxData.payment_b2c_id,
        cartItems: itemsCheckoutGrabAndFpx
      })
        .then((res) => {
          console.log(res.data.stripeCheckoutSuccessful);
        })
        .catch((e) => {
          console.error(e);
          stripeCheckoutFailedFn({
            paymentB2cId: checkoutGrabPayAndFpxData.payment_b2c_id,
            errorMessage: 'payment error'
          })
            .then((res) => {
              console.log(res.data.stripeCheckoutFailed);
            })
            .catch((e) => {
              console.error(e);
            });
          router.replace({
            name: 'CheckoutFailed'
          });
        });
    }
    watchEffect(() => {
      switch (props.status) {
        case CHECKOUT_STATUS.SUCCESS:
          defaultOptions.value.loop = CHECKOUT_DATA.SUCCESS.loop;
          defaultOptions.value.animationData = CHECKOUT_DATA.SUCCESS.animationData;
          width.value = CHECKOUT_DATA.SUCCESS.width;
          height.value = CHECKOUT_DATA.SUCCESS.height;
          buttonText.value = t(CHECKOUT_DATA.SUCCESS.buttonText);
          break;
      }
    });
    const onNext = () => {
      store.dispatch('b2c/setCheckoutGrabPayFpx', null);
      store.dispatch('b2c/setItemsCheckoutGrabPayFpx', null);
      router.replace({
        path: '/main/orders/overview'
      });
    };

    return {
      defaultOptions,
      width,
      height,
      buttonText,
      CHECKOUT_STATUS,
      onNext,
      store,
      stripeCheckoutSuccessfulFn,
      stripeCheckoutFailedFn,
      checkoutGrabPayAndFpxData,
      itemsCheckoutGrabAndFpx
    };
  }
});
</script>

<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import '@/components/Cart/Checkout/LoaderCheckout.scss';
</style>

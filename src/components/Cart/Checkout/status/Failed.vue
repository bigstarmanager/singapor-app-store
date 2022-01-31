<template>
  <ion-page>
    <ion-header> </ion-header>
    <ion-content fullscreen="true" class="content">
      <div class="flex">
        <lottie-vue :isOpen="true" :height="height" :width="width" :options="defaultOptions" />
        <p v-if="status === CHECKOUT_STATUS.FAIL" class="payment-failed">
          {{ $t('checkout_loader.payment_failed') }}
        </p>

        <template v-if="status === CHECKOUT_STATUS.FAIL">
          <p>
            {{ $t('checkout_loader.not_you_1') }}
            <br />
            {{ $t('checkout_loader.not_you_2') }}
            <strong
              @click="
                $router.replace({
                  name: 'Help'
                })
              "
              >{{ $t('checkout_loader.not_you_3') }}</strong
            >
            {{ $t('checkout_loader.not_you_4') }}
          </p>
        </template>
        <ion-toolbar>
          <ion-button class="checkout-btn" expand="block" @click="onNext">
            <span>
              {{ buttonText }}
            </span>
          </ion-button>
          <ion-button class="try-back-btn" color="primary" fill="outline" expand="block" @click="tryAgain">
            <span>
              {{ $t('back_try_again') }}
            </span>
          </ion-button>
        </ion-toolbar>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref, watchEffect } from 'vue';
import LottieVue from '@/components/Shared/Lottie.vue';
import * as failData from '@/assets/lottie/checkout/fail.json';
import { IonContent, IonPage, IonButton, IonToolbar, IonHeader } from '@ionic/vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useMutation } from '@vue/apollo-composable';
import { stripeCheckoutFailed } from '@/services/shared/graphql';
export const CHECKOUT_STATUS = 'FAIL';

const CHECKOUT_DATA = {
  FAIL: {
    loop: false,
    animationData: failData.default,
    width: 160,
    height: 160,
    buttonText: 'checkout_loader.contact_support'
  }
};

export default defineComponent({
  name: 'CheckoutError',
  components: { LottieVue, IonContent, IonPage, IonButton, IonToolbar, IonHeader },
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
    const { mutate: stripeCheckoutFailedFn } = useMutation(stripeCheckoutFailed);
    const checkoutGrabPayAndFpxData = store.getters['b2c/getCheckoutGrabPayFpx'];
    if (checkoutGrabPayAndFpxData !== null) {
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
    }
    watchEffect(() => {
      switch (props.status) {
        case CHECKOUT_STATUS.FAIL:
          defaultOptions.value.loop = CHECKOUT_DATA.FAIL.loop;
          defaultOptions.value.animationData = CHECKOUT_DATA.FAIL.animationData;
          width.value = CHECKOUT_DATA.FAIL.width;
          height.value = CHECKOUT_DATA.FAIL.height;
          buttonText.value = t(CHECKOUT_DATA.FAIL.buttonText);
          break;
      }
    });
    const onNext = () => {
      store.dispatch('b2c/setCheckoutGrabPayFpx', null);
      store.dispatch('b2c/setItemsCheckoutGrabPayFpx', null);
      router.replace({
        name: 'Help'
      });
    };
    const tryAgain = () => {
      store.dispatch('b2c/setCheckoutGrabPayFpx', null);
      store.dispatch('b2c/setItemsCheckoutGrabPayFpx', null);
      router.replace({
        name: 'Checkout'
      });
    };

    return {
      defaultOptions,
      width,
      height,
      buttonText,
      CHECKOUT_STATUS,
      onNext,
      tryAgain,
      stripeCheckoutFailedFn,
      checkoutGrabPayAndFpxData
    };
  }
});
</script>

<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import '@/components/Cart/Checkout/LoaderCheckout.scss';
</style>

<template>
  <ion-page>
    <ion-header> </ion-header>
    <ion-content fullscreen="true" class="content">
      <div class="flex">
        <lottie-vue :isOpen="true" :height="height" :width="width" :options="defaultOptions" />
        <p v-if="status === CHECKOUT_STATUS.FAIL" class="payment-failed">
          {{ $t('checkout_loader.payment_canceled') }}
        </p>

        <template v-if="status === CHECKOUT_STATUS.FAIL">
          <p>
            {{ $t('checkout_loader.cancel_transaction') }}
          </p>
        </template>
        <ion-toolbar>
          <ion-button class="checkout-btn" expand="block" @click="onNext">
            <span>
              {{ buttonText }}
            </span>
          </ion-button>
          <ion-button
            class="try-back-btn"
            color="primary"
            fill="clear"
            expand="block"
            @click="contactSupport"
          >
            <span>
              {{ $t('checkout_loader.contact_support') }}
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
export const CHECKOUT_STATUS = 'FAIL';

const CHECKOUT_DATA = {
  FAIL: {
    loop: false,
    animationData: failData.default,
    width: 160,
    height: 160,
    buttonText: 'checkout_loader.back_to_checkout'
  }
};

export default defineComponent({
  name: 'CheckoutFailed',
  components: { LottieVue, IonContent, IonPage, IonButton, IonToolbar, IonHeader },
  props: {
    status: Number
  },
  setup(props) {
    const buttonText = ref('');
    const defaultOptions = ref({
      animationData: null
    });
    const width = ref(300);
    const height = ref(300);
    const { t } = useI18n();
    const router = useRouter();
    const store = useStore();
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
        name: 'Checkout'
      });
    };
    const contactSupport = () => {
      store.dispatch('b2c/setCheckoutGrabPayFpx', null);
      store.dispatch('b2c/setItemsCheckoutGrabPayFpx', null);
      router.replace({
        name: 'Help'
      });
    };

    return {
      defaultOptions,
      width,
      height,
      buttonText,
      CHECKOUT_STATUS,
      onNext,
      contactSupport
    };
  }
});
</script>

<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import '@/components/Cart/Checkout/LoaderCheckout.scss';
</style>

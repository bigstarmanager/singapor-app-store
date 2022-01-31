<template>
  <ion-page>
    <ion-header> </ion-header>
    <ion-content fullscreen="true" class="content">
      <img
        v-if="status !== CHECKOUT_STATUS.LOADING"
        @click="$emit('close-loader')"
        src="/assets/images/SWM-icons-outline-cross.svg"
        alt="close"
      />
      <div class="flex">
        <lottie-vue :isOpen="true" :height="height" :width="width" :options="defaultOptions" />
        <p v-if="status === CHECKOUT_STATUS.FAIL" class="payment-failed">
          {{ $t('checkout_loader.payment_failed') }}
        </p>
        <template v-if="status === CHECKOUT_STATUS.LOADING">
          <p v-html="$t('checkout_loader.loading')"></p>
        </template>
        <template v-else-if="status === CHECKOUT_STATUS.SUCCESS">
          <p v-html="$t('checkout_loader.success')"></p>
        </template>
        <template v-else-if="status === CHECKOUT_STATUS.FAIL">
          <span class="error_message">
            {{ errorMessage }}
          </span>
        </template>
      </div>
    </ion-content>
    <ion-footer v-if="buttonText !== ''">
      <ion-button class="checkout-btn" expand="block" @click="onNext">
        {{ buttonText }}
      </ion-button>
      <ion-button
        v-if="status === CHECKOUT_STATUS.FAIL"
        class="checkout-btn"
        fill="outline"
        expand="block"
        @click="$emit('close-loader')"
      >
        <span>
          {{ $t('back_to_try_again') }}
        </span>
      </ion-button>

      <div
        v-if="status === CHECKOUT_STATUS.FAIL"
        class="contact_support"
        @click="$router.replace({ name: 'Help' })"
      >
        {{ $t('checkout_loader.contact_support') }}
      </div>
    </ion-footer>
  </ion-page>
</template>

<script>
import { defineComponent, ref, watchEffect } from 'vue';
import LottieVue from '@/components/Shared/Lottie.vue';
import * as loadingData from '@/assets/lottie/main-loader.json';
import * as successData from '@/assets/lottie/checkout/success.json';
import * as failData from '@/assets/lottie/checkout/fail.json';
import { IonContent, IonPage, IonButton, IonFooter, IonHeader } from '@ionic/vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export const CHECKOUT_STATUS = {
  IDLE: 0,
  LOADING: 1,
  SUCCESS: 2,
  FAIL: 3
};

const CHECKOUT_DATA = {
  LOADING: {
    loop: true,
    animationData: loadingData.default,
    width: 300,
    height: 300
  },
  SUCCESS: {
    loop: false,
    animationData: successData.default,
    width: 350,
    height: 350,
    buttonText: 'checkout_loader.continue'
  },
  FAIL: {
    loop: false,
    animationData: failData.default,
    width: 160,
    height: 160,
    buttonText: 'checkout_loader.change_payment'
  }
};

export default defineComponent({
  name: 'LoaderCheckout',
  components: { LottieVue, IonContent, IonPage, IonButton, IonFooter, IonHeader },
  props: {
    error: String,
    status: Number
  },
  setup(props, { emit }) {
    const buttonText = ref('');
    const defaultOptions = ref({
      animationData: null
    });
    const width = ref(300);
    const height = ref(300);
    const { t } = useI18n();
    const store = useStore();
    const router = useRouter();
    const errorMessage = ref(t('checkout_loader.failure.general'));
    watchEffect(() => {
      switch (props.status) {
        case CHECKOUT_STATUS.LOADING:
          defaultOptions.value.loop = CHECKOUT_DATA.LOADING.loop;
          defaultOptions.value.animationData = CHECKOUT_DATA.LOADING.animationData;
          width.value = CHECKOUT_DATA.LOADING.width;
          height.value = CHECKOUT_DATA.LOADING.height;
          buttonText.value = '';
          break;
        case CHECKOUT_STATUS.SUCCESS:
          defaultOptions.value.loop = CHECKOUT_DATA.SUCCESS.loop;
          defaultOptions.value.animationData = CHECKOUT_DATA.SUCCESS.animationData;
          width.value = CHECKOUT_DATA.SUCCESS.width;
          height.value = CHECKOUT_DATA.SUCCESS.height;
          buttonText.value = t(CHECKOUT_DATA.SUCCESS.buttonText);
          break;
        case CHECKOUT_STATUS.FAIL:
          defaultOptions.value.loop = CHECKOUT_DATA.FAIL.loop;
          defaultOptions.value.animationData = CHECKOUT_DATA.FAIL.animationData;
          width.value = CHECKOUT_DATA.FAIL.width;
          height.value = CHECKOUT_DATA.FAIL.height;
          buttonText.value = t(CHECKOUT_DATA.FAIL.buttonText);
          break;
      }
      switch (props.error) {
        case 'card_not_supported':
          errorMessage.value = t('checkout_loader.failure.card_not_supported');
          break;
        case 'insufficient_funds':
          errorMessage.value = t('checkout_loader.failure.insufficient_funds');
          break;
        case 'card_velocity_exceeded':
          errorMessage.value = t('checkout_loader.failure.card_velocity_exceeded');
          break;
        case 'expired_card':
          errorMessage.value = t('checkout_loader.failure.expired_card');
          break;
        case 'invalid_account':
          errorMessage.value = t('checkout_loader.failure.invalid_account');
          break;
        case 'processing_error':
          errorMessage.value = t('checkout_loader.failure.processing_error');
          break;
        case 'insufficient_e_wallet_balance':
          errorMessage.value = t('checkout_loader.failure.insufficient_e_wallet_balance');
          break;
        default:
          errorMessage.value = t('checkout_loader.failure.general');
          break;
      }
    });
    const onNext = () => {
      switch (props.status) {
        case CHECKOUT_STATUS.SUCCESS:
          store.dispatch('b2c/setUpdateNotificationPage', { status: true });
          store.dispatch('b2c/setUpdateOrdersPage', { status: true });
          store.dispatch('b2c/setNewNotification', { status: true });
          store.dispatch('b2c/setNewCart', { status: true });
          router.replace({
            path: '/main/orders/overview'
          });
          break;
        case CHECKOUT_STATUS.FAIL:
          emit('close-loader');
          break;
      }
    };

    return {
      defaultOptions,
      width,
      height,
      buttonText,
      errorMessage,
      CHECKOUT_STATUS,
      onNext
    };
  }
});
</script>

<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'LoaderCheckout.scss';
</style>

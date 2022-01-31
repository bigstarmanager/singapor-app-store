<template>
  <ion-page>
    <ion-header> </ion-header>
    <ion-content fullscreen="true" class="content">
      <!-- <img
        v-if="status !== ADD_NEW_BANK_STATUS.LOADING"
        @click="$emit('close-loader')"
        src="/assets/images/SWM-icons-outline-cross.svg"
        alt="close"
      /> -->
      <div class="flex">
        <lottie-vue :isOpen="true" :height="height" :width="width" :options="defaultOptions" />
        <!-- <p v-if="status === ADD_NEW_BANK_STATUS.FAIL" class="payment-failed">
          {{ $t('checkout_loader.payment_failed') }}
        </p> -->
        <template v-if="status === ADD_NEW_BANK_STATUS.LOADING">
          <p v-html="$t('checkout_loader.loading')"></p>
        </template>
        <template v-else-if="status === ADD_NEW_BANK_STATUS.SUCCESS">
          <p v-html="$t('wallet.top_up_page.bank_transfer_page.success')"></p>
        </template>
        <template v-else-if="status === ADD_NEW_BANK_STATUS.FAIL">
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
      </div>
    </ion-content>
    <ion-footer v-if="buttonText !== ''">
      <ion-toolbar>
        <ion-button class="checkout-btn" expand="block" @click="onNext">
          <span>
            {{ buttonText }}
          </span>
        </ion-button>
        <ion-button
          v-if="status === ADD_NEW_BANK_STATUS.FAIL"
          class="checkout-btn"
          fill="outline"
          expand="block"
          @click="$emit('close-loader')"
        >
          <span>
            {{ $t('back_to_try_again') }}
          </span>
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import { defineComponent, ref, watchEffect } from 'vue';
import LottieVue from '@/components/Shared/Lottie.vue';
import * as loadingData from '@/assets/lottie/main-loader.json';
import * as successData from '@/assets/lottie/checkout/success.json';
import * as failData from '@/assets/lottie/checkout/fail.json';
import { IonContent, IonPage, IonButton, IonFooter, IonToolbar, IonHeader } from '@ionic/vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
export const ADD_NEW_BANK_STATUS = {
  IDLE: 0,
  LOADING: 1,
  SUCCESS: 2,
  FAIL: 3
};

const ADD_NEW_BANK_DATA = {
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
    buttonText: 'next'
  },
  FAIL: {
    loop: false,
    animationData: failData.default,
    width: 160,
    height: 160,
    buttonText: 'checkout_loader.contact_support'
  }
};

export default defineComponent({
  name: 'LoaderAddNewBank',
  components: { LottieVue, IonContent, IonPage, IonButton, IonFooter, IonToolbar, IonHeader },
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
    const store = useStore();
    const router = useRouter();
    watchEffect(() => {
      switch (props.status) {
        case ADD_NEW_BANK_STATUS.LOADING:
          defaultOptions.value.loop = ADD_NEW_BANK_DATA.LOADING.loop;
          defaultOptions.value.animationData = ADD_NEW_BANK_DATA.LOADING.animationData;
          width.value = ADD_NEW_BANK_DATA.LOADING.width;
          height.value = ADD_NEW_BANK_DATA.LOADING.height;
          buttonText.value = '';
          break;
        case ADD_NEW_BANK_STATUS.SUCCESS:
          defaultOptions.value.loop = ADD_NEW_BANK_DATA.SUCCESS.loop;
          defaultOptions.value.animationData = ADD_NEW_BANK_DATA.SUCCESS.animationData;
          width.value = ADD_NEW_BANK_DATA.SUCCESS.width;
          height.value = ADD_NEW_BANK_DATA.SUCCESS.height;
          buttonText.value = t(ADD_NEW_BANK_DATA.SUCCESS.buttonText);
          break;
        case ADD_NEW_BANK_STATUS.FAIL:
          defaultOptions.value.loop = ADD_NEW_BANK_DATA.FAIL.loop;
          defaultOptions.value.animationData = ADD_NEW_BANK_DATA.FAIL.animationData;
          width.value = ADD_NEW_BANK_DATA.FAIL.width;
          height.value = ADD_NEW_BANK_DATA.FAIL.height;
          buttonText.value = t(ADD_NEW_BANK_DATA.FAIL.buttonText);
          break;
      }
    });
    const onNext = () => {
      switch (props.status) {
        case ADD_NEW_BANK_STATUS.SUCCESS:
          store.dispatch('b2c/setUpdateNotification', { status: true });
          store.dispatch('b2c/setUpdateOrders', { status: true });
          router.replace({
            path: '/main/orders/overview'
          });
          break;
        case ADD_NEW_BANK_STATUS.FAIL:
          router.replace({
            name: 'Help'
          });
          break;
      }
    };

    return {
      defaultOptions,
      width,
      height,
      buttonText,
      ADD_NEW_BANK_STATUS,
      onNext
    };
  }
});
</script>

<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'LoaderAddNewBank.scss';
</style>

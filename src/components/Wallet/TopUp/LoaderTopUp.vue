<template>
  <ion-page>
    <ion-header> </ion-header>
    <ion-content fullscreen="true" class="content">
      <div class="flex">
        <lottie-vue :isOpen="true" :height="height" :width="width" :options="defaultOptions" />
        <template v-if="status === TOPUP_STATUS.LOADING">
          <p v-html="$t('checkout_loader.loading')"></p>
        </template>
        <template v-else-if="status === TOPUP_STATUS.SUCCESS">
          <div class="header">
            <p>{{ $t('wallet.top_up_page.complete_page.title') }}</p>
            <p>
              {{ $t('wallet.top_up_page.complete_page.paid_total') }} {{ user?.country?.currency_symbol
              }}{{ topUpAmount }}
            </p>
          </div>
          <p>{{ $t('wallet.top_up_page.complete_page.the_top_up_amount') }}</p>
        </template>
      </div>
    </ion-content>
    <ion-footer v-if="buttonText !== ''">
      <ion-toolbar>
        <ion-button class="checkout-btn" expand="block" fill="outline" @click="onNext">
          <span>
            {{ buttonText }}
          </span>
        </ion-button>
        <ion-button
          v-if="status === TOPUP_STATUS.FAIL"
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
import { TOPUP_STATUS } from './ModalTopUp.vue';

const TOPUP_DATA = {
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
    buttonText: 'done'
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
  name: 'LoaderTopUp',
  components: { LottieVue, IonContent, IonPage, IonButton, IonFooter, IonToolbar, IonHeader },
  props: {
    status: Number,
    user: Object,
    topUpAmount: Number
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
        case TOPUP_STATUS.LOADING:
          defaultOptions.value.loop = TOPUP_DATA.LOADING.loop;
          defaultOptions.value.animationData = TOPUP_DATA.LOADING.animationData;
          width.value = TOPUP_DATA.LOADING.width;
          height.value = TOPUP_DATA.LOADING.height;
          buttonText.value = '';
          break;
        case TOPUP_STATUS.SUCCESS:
          defaultOptions.value.loop = TOPUP_DATA.SUCCESS.loop;
          defaultOptions.value.animationData = TOPUP_DATA.SUCCESS.animationData;
          width.value = TOPUP_DATA.SUCCESS.width;
          height.value = TOPUP_DATA.SUCCESS.height;
          buttonText.value = t(TOPUP_DATA.SUCCESS.buttonText);
          break;
        case TOPUP_STATUS.FAIL:
          defaultOptions.value.loop = TOPUP_DATA.FAIL.loop;
          defaultOptions.value.animationData = TOPUP_DATA.FAIL.animationData;
          width.value = TOPUP_DATA.FAIL.width;
          height.value = TOPUP_DATA.FAIL.height;
          buttonText.value = t(TOPUP_DATA.FAIL.buttonText);
          break;
      }
    });
    const onNext = () => {
      // Remember to parse topUpAmount to 2 decimal places due to 'toFixed(2)' calls.
      switch (props.status) {
        case TOPUP_STATUS.SUCCESS:
          store;
          router.replace({
            name: 'Wallet'
          });
          break;
      }
    };

    return {
      defaultOptions,
      width,
      height,
      buttonText,
      TOPUP_STATUS,
      onNext
    };
  }
});
</script>

<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'LoaderTopUp.scss';
</style>

<template>
  <ion-page>
    <ion-content>
      <div class="top-up" v-if="topUpStatus === TOPUP_STATUS.IDLE || topUpStatus === TOPUP_STATUS.LOADING">
        <div class="header">
          <ion-item lines="none">
            <ion-label class="title">{{ $t('wallet.top_up_page.modal_page.review_and_confirm') }}</ion-label>
            <ion-buttons slot="end">
              <ion-button @click="dismissModal">
                <img src="/assets/images/SWM-icons-outline-cross.svg" alt="close" />
              </ion-button>
            </ion-buttons>
          </ion-item>
        </div>
        <ion-list>
          <ion-item class="payment-method">
            <ion-label>{{ $t('wallet.top_up_page.modal_page.payment_method') }}</ion-label>
            <p slot="end">{{ paymentMethodString }}</p>
          </ion-item>
          <ion-item lines="none">
            <ion-label>{{ $t('wallet.top_up_page.modal_page.top_up_amount') }}</ion-label>
            <p slot="end">{{ user?.country?.currency_symbol }}{{ topUpAmount }}</p>
          </ion-item>
          <ion-item class="fee">
            <ion-label>{{ $t('wallet.top_up_page.modal_page.fee') }}</ion-label>
            <p slot="end">{{ $t('wallet.top_up_page.modal_page.no_fee') }}</p>
          </ion-item>
          <ion-item lines="none" class="total">
            <ion-label>{{ $t('wallet.top_up_page.modal_page.total') }}</ion-label>
            <p slot="end">{{ user?.country?.currency_symbol }}{{ topUpAmount }}</p>
          </ion-item>
          <ion-spinner class="replace-button" v-if="topUpStatus === TOPUP_STATUS.LOADING"></ion-spinner>
          <ion-button v-else @click="topUp(topUpAmount)" class="checkout-btn" expand="block" type="submit">{{
            $t('wallet.top_up')
          }}</ion-button>
        </ion-list>
      </div>
      <div
        :class="{
          'top-up-complete': true,
          'top-up-fail': topUpStatus === TOPUP_STATUS.FAIL
        }"
        v-else
      >
        <lottie-vue
          :isOpen="true"
          :height="topUpData.height"
          :width="topUpData.width"
          :options="defaultOptions"
        />
        <template v-if="topUpStatus === TOPUP_STATUS.SUCCESS">
          <p class="title">{{ $t('wallet.top_up_page.modal_page.top_up_successful') }}</p>
          <p class="title">
            {{ $t('wallet.top_up_page.modal_page.total') }} {{ user?.country?.currency_symbol
            }}{{ topUpAmount }}
          </p>
          <br />
          <p>{{ $t('wallet.top_up_page.modal_page.your_balance') }}</p>
          <ion-button
            @click="
              dismissModal();
              topUpDone();
            "
            class="checkout-btn"
            expand="block"
            fill="outline"
            >{{ $t('done') }}
          </ion-button>
        </template>
        <template v-else-if="topUpStatus === TOPUP_STATUS.FAIL">
          <p class="title">{{ $t('wallet.top_up_page.modal_page.top_up_failed') }}</p>
          <br />
          <p>{{ $t('wallet.top_up_page.modal_page.please_make_sure') }}</p>
          <ion-button
            @click="
              dismissModal();
              $emit('top-up-complete');
            "
            class="checkout-btn"
            expand="block"
            fill="outline"
            >{{ $t('wallet.top_up_page.modal_page.ok') }}
          </ion-button>
        </template>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonButton,
  IonButtons,
  IonItem,
  IonList,
  IonLabel,
  IonSpinner
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from 'vue-i18n';
import { useMutation } from '@vue/apollo-composable';
import { topUpEwallet } from '@/services/shared/graphql';
import LottieVue from '@/components/Shared/Lottie.vue';
import * as successData from '@/assets/lottie/checkout/success.json';
import * as failData from '@/assets/lottie/checkout/fail.json';
import { showToast } from '@/services/shared/helper/wallet';

export const TOPUP_STATUS = {
  IDLE: 0,
  LOADING: 1,
  SUCCESS: 2,
  FAIL: 3
};

const TOPUP_DATA = {
  SUCCESS: {
    loop: false,
    animationData: successData.default,
    width: 160,
    height: 160,
    buttonText: 'checkout_loader.continue'
  },
  FAIL: {
    loop: false,
    animationData: failData.default,
    width: 80,
    height: 80,
    buttonText: 'checkout_loader.contact_support'
  }
};

export default defineComponent({
  name: 'ModalTopUp',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonButtons,
    IonItem,
    IonList,
    IonLabel,
    IonSpinner,
    LottieVue
  },
  props: {
    paymentMethod: String,
    card: Object,
    user: Object,
    topUpAmount: Number
  },
  setup(props, { emit }) {
    const router = useRouter();
    const store = useStore();
    const { t } = useI18n();
    const { mutate: topUpEwalletFn } = useMutation(topUpEwallet);
    const topUpStatus = ref(TOPUP_STATUS.IDLE);
    const topUpData = ref({});
    const defaultOptions = ref({});

    const dismissModal = () => {
      emit('close-modal');
    };

    const topUpDone = () => {
      emit('top-up-complete');
    };

    const topUp = async (amount) => {
      const mutatedState = store.getters['b2c/getApplicationState'];
      mutatedState.topUp.data = {
        topUpAmount: props.topUpAmount
      };
      store.dispatch('b2c/setApplicationState', mutatedState);

      switch (props.paymentMethod) {
        case 'card':
          topUpEwalletFn, amount;
          topUpStatus.value = TOPUP_STATUS.LOADING;

          setTimeout(() => {
            topUpStatus.value = TOPUP_STATUS.FAIL;
            topUpData.value = TOPUP_DATA.FAIL;
            defaultOptions.value = {
              loop: topUpData.value.loop,
              animationData: topUpData.value.animationData
            };
          }, 1000);

          // bankShortCode;
          // let result = await topUpEwalletFn({
          //   amount,
          //   bankShortCode: 'cimb'
          // });
          // console.log(result);
          break;
        case 'banktransfer':
          topUpBankTransfer();
          break;
        case 'paynow':
          topUpWithPaynow();
          break;
        case 'grabpay':
          console.log('grabpay');
          break;
        case 'netslink':
          console.log('netslink');
          break;
      }
    };

    const topUpBankTransfer = async () => {
      try {
        topUpStatus.value = TOPUP_STATUS.LOADING;
        const result = await topUpEwalletFn({
          method: 'bank',
          amount: props.topUpAmount,
          bankShortCode: 'cimb'
        });
        if (result?.data?.topUpEwallet?.paymentMethod) {
          store.dispatch('b2c/addApplicationState', { refetchWallet: true });
          router.replace({
            name: 'BankTransferInstructions',
            params: {
              bankShortCode: `${result?.data?.topUpEwallet?.paymentMethod.instructions.bankShortCode}`,
              accountNo: `${result?.data?.topUpEwallet?.paymentMethod.instructions.accountNo}`
            }
          });
          dismissModal();
        }
      } catch (error) {
        showToast(error.message);
      } finally {
        topUpStatus.value = TOPUP_STATUS.IDLE;
      }
    };

    const topUpWithPaynow = async () => {
      try {
        topUpStatus.value = TOPUP_STATUS.LOADING;
        const result = await topUpEwalletFn({
          method: 'paynow',
          amount: props.topUpAmount
        });
        if (result?.data?.topUpEwallet?.paymentMethod?.qrCodeDisplayImage) {
          store.dispatch('b2c/addApplicationState', { refetchWallet: true });
          router.replace({
            name: 'PaynowInstructions',
            params: {
              qrCode: `data:image/jpeg;base64,${result.data.topUpEwallet.paymentMethod.qrCodeDisplayImage}`
            }
          });
          dismissModal();
        }
      } catch (error) {
        showToast(error.message);
      } finally {
        topUpStatus.value = TOPUP_STATUS.IDLE;
      }
    };

    return {
      router,
      store,
      t,
      topUp,
      topUpDone,
      topUpStatus,
      TOPUP_STATUS,
      topUpData,
      defaultOptions,
      dismissModal
    };
  },
  computed: {
    paymentMethodString() {
      switch (this.paymentMethod) {
        case 'card':
          return `${this.card.card.brand.toUpperCase()} ${this.card.card.last4}`;
        case 'banktransfer':
          return this.t(`wallet.top_up_page.modal_page.bank_transfer`);
        case 'paynow':
          return this.t(`wallet.top_up_page.modal_page.paynow`);
        case 'grabpay':
          return this.t(`wallet.top_up_page.modal_page.grabpay`);
        case 'netslink':
          return this.t(`wallet.top_up_page.modal_page.netslink`);
        default:
          return this.t(`no`);
      }
    }
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'ModalTopUp.scss';
</style>

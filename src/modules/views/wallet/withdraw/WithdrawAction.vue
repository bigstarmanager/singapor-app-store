<template>
  <ion-page>
    <template v-if="withdrawStatus === WITHDRAW_STATUS.IDLE || withdrawStatus === WITHDRAW_STATUS.LOADING">
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button text=""></ion-back-button>
          </ion-buttons>
          <ion-title class="ion-no-padding title-toolbar">{{ $t('wallet.transfer_bank') }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <div class="content">
          <div class="text-grey">
            <!-- <ion-img class="d-inline" :src="getBankImageSrc"></ion-img> -->
            <span>{{ banks.bankName }} {{ $t('wallet.savings') }} {{ banks.bankAccountNumber }}</span>
          </div>
          <p class="text-black">{{ $t('wallet.withdraw_amount') }}</p>

          <ion-item :class="withdrawAmountCheckout > maxWithdraw ? 'input-error' : 'voucher-container'">
            <span
              :class="withdrawAmountCheckout > maxWithdraw ? 'grey-currency' : 'black-currency'"
              v-if="
                withdrawAmountCheckout !== null &&
                withdrawAmountCheckout !== '' &&
                withdrawAmountCheckout >= 0
              "
              >{{ user?.country?.currency_symbol }}</span
            >
            <ion-input
              type="number"
              inputmode="decimal"
              pattern="\\d*"
              v-model="withdrawAmountCheckout"
              :placeholder="`${user?.country?.currency_symbol}${minWithdraw.toFixed(2)}`"
              @ionChange="setTwoNumberDecimal"
            >
            </ion-input>
          </ion-item>

          <div v-if="parseFloat(withdrawAmountCheckout) < 0.11" class="error" as="div">
            {{ $t('wallet.minimum_withdraw') }}
          </div>

          <div v-if="withdrawAmountCheckout > maxWithdraw" class="error" as="div">
            {{ $t('wallet.amount_exceeds') }} {{ user?.country?.currency_symbol }}{{ maxWithdraw.toFixed(2) }}
          </div>
        </div>
      </ion-content>
      <ion-footer class="ion-no-border">
        <ion-toolbar>
          <ion-button
            class="confirm-btn"
            expand="block"
            :disabled="
              withdrawStatus === WITHDRAW_STATUS.LOADING ||
              withdrawAmountCheckout > maxWithdraw ||
              withdrawAmountCheckout === null ||
              withdrawAmountCheckout < 0.11
            "
            @click="confirmWithdraw"
          >
            <ion-spinner
              v-if="withdrawStatus === WITHDRAW_STATUS.LOADING"
              color="primary"
              name="crescent"
            ></ion-spinner>
            <span v-else>{{ $t('confirm') }}</span>
          </ion-button>
        </ion-toolbar>
      </ion-footer>
    </template>

    <template v-else>
      <ion-content scroll-y="false" class="status-content" :fullscreen="true">
        <lottie-vue
          :class="withdrawStatus === WITHDRAW_STATUS.SUCCESS ? 'lottie-vue-sucess' : 'lottie-vue-fail'"
          :isOpen="true"
          :height="withdrawData.height"
          :width="withdrawData.width"
          :options="defaultOptions"
        />

        <template v-if="withdrawStatus === WITHDRAW_STATUS.SUCCESS">
          <div class="withdraw-status">
            <p class="title">{{ $t('wallet.completed_withdraw') }}</p>
            <p class="title">
              {{ $t('wallet.top_up_page.modal_page.total') }} {{ user?.country?.currency_symbol
              }}{{ parseFloat(withdrawAmountCheckout).toFixed(2) }}
            </p>
            <br />
            <p class="status-text">{{ $t('wallet.withdraw_appear') }}</p>
          </div>
        </template>

        <template v-if="withdrawStatus === WITHDRAW_STATUS.FAIL">
          <div class="withdraw-status">
            <p class="title-fail">{{ $t('wallet.withdrawal_failed') }}</p>
            <br />
            <p class="status-text">
              {{ $t('wallet.something_wrong') }}
            </p>
          </div>
        </template>
      </ion-content>
      <ion-footer v-if="withdrawStatus === WITHDRAW_STATUS.SUCCESS" class="ion-no-border">
        <ion-toolbar>
          <ion-button @click="withdrawComplete()" class="status-btn" expand="block" fill="outline"
            >{{ $t('done') }}
          </ion-button>
        </ion-toolbar>
      </ion-footer>
      <ion-footer v-if="withdrawStatus === WITHDRAW_STATUS.FAIL" class="ion-no-border">
        <ion-toolbar>
          <ion-button @click="withdrawFailed()" class="status-btn" expand="block" fill="outline">
            {{ $t('wallet.top_up_page.modal_page.ok') }}
          </ion-button>
        </ion-toolbar>
      </ion-footer>
    </template>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonFooter,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonInput,
  IonItem,
  IonSpinner
} from '@ionic/vue';
import { arrowBackOutline, chevronBackOutline } from 'ionicons/icons';
import { defineComponent, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getEwalletBalance, withdrawEwallet } from '@/services/shared/graphql';
import { useQuery } from '@vue/apollo-composable';
import { useMutation } from '@vue/apollo-composable';
import LottieVue from '@/components/Shared/Lottie.vue';
import * as successData from '@/assets/lottie/checkout/success.json';
import * as failData from '@/assets/lottie/checkout/fail.json';

export const WITHDRAW_STATUS = {
  IDLE: 0,
  LOADING: 1,
  SUCCESS: 2,
  FAIL: 3
};

const WITHDRAW_DATA = {
  SUCCESS: {
    loop: false,
    animationData: successData.default,
    width: 300,
    height: 300,
    buttonText: 'done'
  },
  FAIL: {
    loop: false,
    animationData: failData.default,
    width: 160,
    height: 160,
    buttonText: 'wallet._top_up._modal.ok'
  }
};

export default defineComponent({
  name: 'WithdrawAction',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonFooter,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonInput,
    IonItem,
    IonSpinner,
    LottieVue
  },

  props: ['bankId', 'bankAccountNumber', 'bankName'],

  data: () => {
    return {
      isLoading: false
    };
  },

  setup(props) {
    const router = useRouter();
    const storage = inject('$storage');
    const user = ref();
    const banks = props;
    const minWithdraw = 0;
    const maxWithdraw = ref();
    const withdrawAmountCheckout = ref(null);
    const withdrawStatus = ref(WITHDRAW_STATUS.IDLE);
    const withdrawData = ref({});
    const defaultOptions = ref({});
    const { onResult: getEwalletBalanceResult } = useQuery(getEwalletBalance);
    getEwalletBalanceResult((res) => {
      maxWithdraw.value = res.data.getEwalletBalance?.available - res.data.getEwalletBalance?.locked;
    });
    const { mutate: withdrawAmountFn } = useMutation(withdrawEwallet);

    (async () => {
      user.value = await storage.getUser();
    })();

    const withdrawComplete = () => {
      withdrawStatus.value = WITHDRAW_STATUS.IDLE;
      router.replace({
        name: 'Wallet'
      });
      withdrawAmountCheckout.value = null;
    };

    const withdrawFailed = () => {
      withdrawStatus.value = WITHDRAW_STATUS.IDLE;
      router.go(-1);
      withdrawAmountCheckout.value = null;
    };

    const setTwoNumberDecimal = (event) => {
      let value = event.target.value;
      let pattern = /(\d+\.\d\d)/g;
      let regex = pattern.exec(value);
      if (regex) {
        event.target.value = parseFloat(regex[1]);
      }
    };

    return {
      arrowBackOutline,
      chevronBackOutline,
      router,
      minWithdraw,
      maxWithdraw,
      user,
      banks,
      withdrawAmountFn,
      withdrawStatus,
      withdrawData,
      withdrawAmountCheckout,
      withdrawComplete,
      withdrawFailed,
      defaultOptions,
      WITHDRAW_STATUS,
      setTwoNumberDecimal
    };
  },

  methods: {
    async confirmWithdraw() {
      this.isLoading = true;
      this.withdrawStatus = WITHDRAW_STATUS.LOADING;
      this.withdrawAmountFn({
        bankDetailId: parseInt(this.banks.bankId),
        amount: parseFloat(this.withdrawAmountCheckout)
      })
        .then(() => {
          this.$store.dispatch('b2c/addApplicationState', { refetchWallet: true });
          this.withdrawStatus = WITHDRAW_STATUS.SUCCESS;
          this.withdrawData = WITHDRAW_DATA.SUCCESS;
          this.defaultOptions = {
            loop: this.withdrawData.loop,
            animationData: this.withdrawData.animationData
          };
        })
        .catch((e) => {
          console.error(e);
          this.withdrawStatus = WITHDRAW_STATUS.FAIL;
          this.withdrawData = WITHDRAW_DATA.FAIL;
          this.defaultOptions = {
            loop: this.withdrawData.loop,
            animationData: this.withdrawData.animationData
          };
        });
      this.isLoading = false;
    }
  }
  //   computed: {
  //     getBankImageSrc() {
  //       const bankType = this.props.name;
  //       const imageFolderPath = '/assets/images/';
  //       if (bankType == 'DBS') {
  //         return imageFolderPath + 'cib-cc-visa.svg';
  //       }

  //       return imageFolderPath + 'mastercard.svg';
  //     }
  //   }
});
</script>
<style scoped lang="scss">
@import 'WithdrawAction.scss';
</style>

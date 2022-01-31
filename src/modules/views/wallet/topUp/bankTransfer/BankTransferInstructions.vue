<template>
  <loader-top-up
    v-if="isToppingUp"
    :user="user"
    :topUpAmount="topUpState.data.topUpAmount"
    :status="topUpStatus"
  ></loader-top-up>
  <ion-page v-else>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text=""></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding">{{
          $t('wallet.top_up_page.bank_transfer_page.top_up_via')
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div>
        <div class="instructions">
          <p class="title">{{ $t('wallet.top_up_page.bank_transfer_page.instruction_title') }}</p>
          <div class="instruction">
            <span>1</span>
            <div>{{ $t('wallet.top_up_page.bank_transfer_page.instruction_1') }}</div>
          </div>
          <div class="instruction">
            <span>2</span>
            <div>{{ $t('wallet.top_up_page.bank_transfer_page.instruction_2') }}</div>
          </div>
          <div class="instruction">
            <span>3</span>
            <div>{{ $t('wallet.top_up_page.bank_transfer_page.instruction_3') }}</div>
          </div>
        </div>
        <form>
          <div>
            <div class="label">{{ $t('wallet.top_up_page.bank_transfer_page.recipient_name') }}</div>
            <ion-item class="voucher-container">
              <ion-input
                type="text"
                disabled
                :placeholder="$t('wallet.top_up_page.bank_transfer_page.recipient_name_placeholder')"
              ></ion-input>
              <div
                class="copy"
                @click="
                  copyToClipboard($t('wallet.top_up_page.bank_transfer_page.recipient_name_placeholder'))
                "
              >
                {{ $t('wallet.top_up_page.bank_transfer_page.copy') }}
              </div>
            </ion-item>
          </div>
          <div>
            <div class="label">{{ $t('wallet.top_up_page.bank_transfer_page.recipient_bank') }}</div>
            <ion-item class="voucher-container">
              <ion-input type="text" disabled :placeholder="bankShortCode"></ion-input>
            </ion-item>
          </div>
          <div>
            <div class="label">
              {{ $t('wallet.top_up_page.bank_transfer_page.recipient_account_number') }}
            </div>
            <ion-item class="voucher-container">
              <ion-input type="number" disabled :placeholder="accountNo"></ion-input>
              <div class="copy" @click="copyToClipboard(accountNo)">
                {{ $t('wallet.top_up_page.bank_transfer_page.copy') }}
              </div>
            </ion-item>
            <p class="tip">{{ $t('wallet.top_up_page.bank_transfer_page.recipient_account_number_tip') }}</p>
          </div>
          <div>
            <div class="label">{{ $t('wallet.top_up_page.bank_transfer_page.amount') }}</div>
            <ion-item class="voucher-container">
              <div class="amount">{{ user?.country?.currency_symbol }}</div>
              <ion-input type="number" disabled :placeholder="topUpState.data.topUpAmount"></ion-input>
            </ion-item>
            <p class="tip">{{ $t('wallet.top_up_page.bank_transfer_page.amount_tip') }}</p>
          </div>
        </form>
        <ion-button
          :disabled="topUpStatus === TOPUP_STATUS.LOADING"
          class="checkout-btn"
          expand="block"
          @click="onNext"
        >
          <ion-spinner v-if="topUpStatus === TOPUP_STATUS.LOADING"></ion-spinner>
          <span v-else>{{ $t('confirm') }}</span></ion-button
        >
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import LoaderTopUp from '@/components/Wallet/TopUp/LoaderTopUp.vue';
import { TOPUP_STATUS } from '@/components/Wallet/TopUp/ModalTopUp.vue';
import { copyToClipboard } from '@/services/shared/helper/wallet';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonButton,
  IonItem,
  IonInput,
  IonSpinner
} from '@ionic/vue';
import { defineComponent, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'BankTransferInstructions',
  props: ['bankShortCode', 'accountNo'],
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButtons,
    IonBackButton,
    IonButton,
    IonItem,
    IonInput,
    IonSpinner,
    LoaderTopUp
  },
  beforeRouteEnter(to, from, next) {
    if (from.name !== 'TopUp') {
      next({
        name: 'TopUp'
      });
      return;
    }

    next();
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const storage = inject('$storage');
    const user = ref();
    const topUpStatus = ref(TOPUP_STATUS.IDLE);
    const isToppingUp = ref(false);
    const onNext = async () => {
      isToppingUp.value = true;
      topUpStatus.value = TOPUP_STATUS.SUCCESS;
    };
    const topUpState = store.getters['b2c/getApplicationState'].topUp;

    (async () => {
      user.value = await storage.getUser();
    })();

    return {
      router,
      store,
      onNext,
      copyToClipboard,
      user,
      isToppingUp,
      topUpStatus,
      topUpState,
      TOPUP_STATUS
    };
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/wallet/Wallet.scss';
@import 'BankTransferInstructions.scss';
</style>

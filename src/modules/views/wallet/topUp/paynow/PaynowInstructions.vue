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
        <ion-title class="ion-no-padding">{{ $t('wallet.top_up_page.paynow_page.top_up_via') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div>
        <div class="instructions">
          <p class="title">{{ $t('wallet.top_up_page.paynow_page.instruction_title') }}</p>
          <div class="instruction">
            <div>
              <span>{{ $t('wallet.top_up_page.paynow_page.instruction_1_1') }}</span>
              <span class="theme-color">{{ $t('wallet.top_up_page.paynow_page.instruction_1_2') }}</span>
              <span>{{ $t('wallet.top_up_page.paynow_page.instruction_1_3') }}</span>
            </div>
          </div>
        </div>
        <div class="qr-code">
          <p class="title">
            <a @click="downloadQr(qrCode)">{{ $t('wallet.top_up_page.paynow_page.click_to_download') }}</a>
          </p>
          <ion-img @click="downloadQr(qrCode)" :src="qrCode"></ion-img>
          <p>{{ $t('wallet.top_up_page.paynow_page.the_qr_code') }}</p>
        </div>
        <form>
          <div>
            <div class="label">{{ $t('wallet.top_up_page.paynow_page.uen') }}</div>
            <ion-item class="voucher-container">
              <ion-input
                type="text"
                disabled
                :placeholder="$t('wallet.top_up_page.paynow_page.uen_placeholder')"
              ></ion-input>
              <div
                class="copy"
                @click="copyToClipboard($t('wallet.top_up_page.paynow_page.uen_placeholder'))"
              >
                {{ $t('wallet.top_up_page.paynow_page.copy') }}
              </div>
            </ion-item>
          </div>
          <div>
            <div class="label">{{ $t('wallet.top_up_page.paynow_page.account_name') }}</div>
            <ion-item class="voucher-container">
              <ion-input
                type="text"
                disabled
                :placeholder="$t('wallet.top_up_page.paynow_page.account_name_placeholder')"
              ></ion-input>
            </ion-item>
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
import { copyToClipboard, showToast } from '@/services/shared/helper/wallet';
import { Directory, Filesystem } from '@capacitor/filesystem';
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
  IonImg,
  IonSpinner
} from '@ionic/vue';
import { defineComponent, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'PaynowInstructions',
  props: ['qrCode'],
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
    IonImg,
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
    const topUpStatus = ref(TOPUP_STATUS.IDLE);
    const isToppingUp = ref(false);
    const user = ref();
    const onNext = async () => {
      isToppingUp.value = true;
      topUpStatus.value = TOPUP_STATUS.SUCCESS;
    };
    const downloadQr = async (path) => {
      const resp = await fetch(path);
      const blob = await resp.blob();
      const reader = new FileReader();
      reader.readAsDataURL(blob);

      reader.onload = async () => {
        const b64 = reader.result;
        const b64Data = b64.split(',')[1];

        try {
          await Filesystem.writeFile({
            path: 'qrcode.png',
            data: b64Data,
            directory: Directory.Documents
          });

          showToast('QR Code sucessfully downloaded.');
        } catch (e) {
          showToast('Failed to download QR Code.');
        }
      };
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
      downloadQr,
      topUpStatus,
      isToppingUp,
      topUpState,
      TOPUP_STATUS
    };
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/wallet/Wallet.scss';
@import 'PaynowInstructions.scss';
</style>

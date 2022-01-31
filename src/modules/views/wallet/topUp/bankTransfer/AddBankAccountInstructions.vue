<template>
  <ion-page>
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
      <ion-list>
        <ion-item lines="none">
          <div>1</div>
          <span v-html="$t('wallet.top_up_page.bank_transfer_page.instruction_1')"></span>
        </ion-item>
        <div class="line-separator-4"></div>
        <ion-item lines="none">
          <div>2</div>
          <span v-html="$t('wallet.top_up_page.bank_transfer_page.instruction_2')"></span>
        </ion-item>
        <div class="line-separator-4"></div>
        <ion-item lines="none">
          <div>3</div>
          <span v-html="$t('wallet.top_up_page.bank_transfer_page.instruction_3')"></span>
        </ion-item>
        <div class="line-separator-4"></div>
        <ion-item lines="none">
          <div>4</div>
          <span v-html="$t('wallet.top_up_page.bank_transfer_page.instruction_4')"></span>
        </ion-item>
        <div class="line-separator-4"></div>
        <ion-item lines="none">
          <div>5</div>
          <div>
            <span v-html="$t('wallet.top_up_page.bank_transfer_page.instruction_5')"></span>
            <div class="inner">
              <span>{{ $t('wallet.top_up_page.bank_transfer_page.instruction_5_1') }}</span>
              <span
                class="copy"
                @click="copyToClipboard($t('wallet.top_up_page.bank_transfer_page.instruction_5_1'))"
                v-html="$t('wallet.top_up_page.bank_transfer_page.instruction_5_2')"
              ></span>
              <ion-img class="d-inline" src="/assets/images/wallet-copy.svg"></ion-img>
            </div>
          </div>
        </ion-item>
        <div class="line-separator-4"></div>
        <ion-item lines="none">
          <div>6</div>
          <span v-html="$t('wallet.top_up_page.bank_transfer_page.instruction_6')"></span>
        </ion-item>
        <div class="line-separator-4"></div>
        <ion-item lines="none">
          <div>7</div>
          <span v-html="$t('wallet.top_up_page.bank_transfer_page.instruction_7')"></span>
        </ion-item>
        <div class="line-separator-4"></div>
        <ion-item lines="none">
          <div>8</div>
          <span v-html="$t('wallet.top_up_page.bank_transfer_page.instruction_8')"></span>
        </ion-item>
        <div class="line-separator-4"></div>
        <ion-item lines="none">
          <div>9</div>
          <span v-html="$t('wallet.top_up_page.bank_transfer_page.instruction_9')"></span>
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-button class="checkout-btn" expand="block" @click="$router.push({ name: 'AddBankAccountForm' })">
          <span>
            {{ $t('next') }}
          </span>
        </ion-button>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
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
  IonList,
  IonImg,
  IonFooter
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'AddBankAccountInstructions',
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
    IonList,
    IonImg,
    IonFooter
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    return {
      router,
      store,
      copyToClipboard
    };
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/wallet/Wallet.scss';
@import 'AddBankAccountInstructions.scss';
</style>

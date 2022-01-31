<template>
  <ion-page>
    <ion-header translucent="false">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text=""></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding">{{ $t('wallet.withdraw') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="top-div">
        <ion-row class="ion-align-items-center">
          <div :class="isOpenWithdrawInfo ? 'text-black' : 'text-grey'">
            {{ $t('wallet.available_withdraw') }}
          </div>
          <ion-img
            @click="openWithdrawInfo"
            class="info text-primary"
            :src="isOpenWithdrawInfo ? '/assets/images/info-on.svg' : '/assets/images/info_withdraw.svg'"
          >
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </ion-img>
        </ion-row>
        <div v-if="isLoading" class="e-wallet-load">
          <ion-skeleton-text animated></ion-skeleton-text>
        </div>
        <div v-else class="withdraw-balance">
          <span v-if="ewallet !== null"> {{ user?.country?.currency_symbol }}{{ ewallet?.toFixed(2) }}</span>
          <span v-else> {{ user?.country?.currency_symbol }}0.00</span>
        </div>
        <ion-row class="ion-align-items-center">
          <div class="text-grey">{{ $t('wallet.total_treedotspay') }}</div>
          <div v-if="isLoading" class="e-wallet-load-small info">
            <ion-skeleton-text animated></ion-skeleton-text>
          </div>
          <div v-else class="text-black info">
            <span v-if="treedotsPay?.available !== null"
              >{{ user?.country?.currency_symbol }}{{ treedotsPay?.available.toFixed(2) }}</span
            >
            <span v-else>{{ user?.country?.currency_symbol }}{{ treedotsPay?.available.toFixed(2) }}</span>
          </div>
        </ion-row>
      </div>
      <div class="space-top padding-x">{{ $t('wallet.transfer_to') }}</div>
      <ion-item
        detail="false"
        class="margin-y"
        lines="none"
        @click="$router.push('/main/wallet/withdraw/transfer-to-bank')"
        button
      >
        <ion-img src="/assets/images/wallet-bank-transfer.svg"></ion-img>
        <ion-label class="bank-label">
          <p class="bank-tf">{{ $t('wallet.top_up_page.bank_transfer') }}</p>
          <p class="link-bank">{{ $t('wallet.link_bank') }}</p>
        </ion-label>
        <ion-img slot="end" class="chevron" src="/assets/images/ic_chevron_right_24px.svg"></ion-img>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonRippleEffect,
  IonRow,
  IonSkeletonText,
  IonLabel,
  IonImg,
  IonItem,
  onIonViewWillEnter,
  popoverController
} from '@ionic/vue';
import { defineComponent, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import WithdrawInfo from './popoverInfo.vue';
import { getEwalletBalance } from '@/services/shared/graphql';
import { useMutation } from '@vue/apollo-composable';

export default defineComponent({
  components: {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonPage,
    IonRippleEffect,
    IonRow,
    IonSkeletonText,
    IonLabel,
    IonImg,
    IonItem
  },

  setup() {
    const router = useRouter();
    const isOpenWithdrawInfo = ref(false);
    const storage = inject('$storage');
    const isLoading = ref(true);
    const user = ref();
    const ewallet = ref();
    const treedotsPay = ref();
    const { mutate: fetchTreedotsPay } = useMutation(getEwalletBalance);

    onIonViewWillEnter(async () => {
      if (!user.value) user.value = await storage.getUser();
      if (user.value?.country?.id === 193) {
        fetchTreedotsPay().then((res) => {
          ewallet.value = res.data.getEwalletBalance?.available - res.data.getEwalletBalance?.locked;
          treedotsPay.value = res.data.getEwalletBalance;
          isLoading.value = false;
        });
      }
    });
    return { isOpenWithdrawInfo, router, isLoading, ewallet, treedotsPay, user };
  },

  methods: {
    async openWithdrawInfo(ev) {
      this.isOpenWithdrawInfo = true;
      const popover = await popoverController.create({
        component: WithdrawInfo,
        cssClass: 'withdraw-info',
        event: ev,
        backdropDismiss: true,
        showBackdrop: false,
        translucent: false
      });
      await popover.present();
      await popover.onDidDismiss();
      this.isOpenWithdrawInfo = false;
    }
  }
});
</script>

<style scoped lang="scss">
@import 'index';
</style>

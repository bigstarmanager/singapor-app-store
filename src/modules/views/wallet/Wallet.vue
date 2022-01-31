<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="" @click="router.replace('/main/account')"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding">{{ $t('wallet.tree_wallet') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div>
        <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <div class="overview">
          <div ref="overlayRef" class="overlay">
            <span>
              {{ $t('wallet.your_wallet_is_protected') }}
              <ion-img src="/assets/images/wallet-protected.svg"></ion-img>
            </span>
            <!-- <ion-img class="close" @click="removeOverlay" src="/assets/images/wallet-close.svg"></ion-img> -->
          </div>
          <div v-if="isLoading" class="e-wallet-load">
            <ion-skeleton-text animated></ion-skeleton-text>
          </div>
          <div v-else class="balance">
            <p v-if="wallet?.available !== null">
              {{ user?.country?.currency_symbol }}{{ wallet?.available.toFixed(2) }}
            </p>
            <p v-else>{{ user?.country?.currency_symbol }}0.00</p>
          </div>
          <p class="balance-text">{{ $t('wallet.balance') }}</p>
          <div class="buttons">
            <ion-button
              class="top-up ion-no-padding"
              @click="$router.push({ name: 'TopUpList' })"
              fill="flat"
            >
              <ion-img src="/assets/images/wallet-topup.svg"></ion-img>
              <ion-label>
                <span>{{ $t('wallet.top_up') }}</span>
              </ion-label>
            </ion-button>
            <ion-button class="top-up ion-no-padding" @click="$router.push({ name: 'Withdraw' })" fill="flat">
              <ion-img src="/assets/images/wallet-withdraw.svg"></ion-img>
              <ion-label>
                <span>{{ $t('wallet.withdraw') }}</span>
              </ion-label>
            </ion-button>
          </div>
          <div class="space"></div>
          <div class="refunds">
            <ion-item lines="none" detail="false" class="ion-align-items-center">
              <p class="set-refunds" slot="start">{{ $t('wallet.primary_refunds') }}</p>
              <ion-toggle
                class="refunds"
                slot="end"
                @ionChange="openPrimaryRefundsModal"
                :checked="isPrimaryRefunds === true"
                v-model="checkedPrimaryRefunds"
              >
              </ion-toggle>
            </ion-item>
          </div>
        </div>
        <ion-list>
          <ion-item class="transaction-history" lines="none" detail="false">
            <p class="ion-activatable">
              <span
                ><ion-img src="/assets/images/wallet-history.svg"></ion-img
                >{{ $t('wallet.transaction_history') }}</span
              >
              <ion-ripple-effect></ion-ripple-effect>
            </p>
            <!-- <p class="ion-activatable" slot="end">
              <span>{{ $t('wallet.view_all') }}</span>
              <ion-ripple-effect></ion-ripple-effect>
            </p> -->
          </ion-item>
          <template v-if="isLoadingTransaction">
            <transaction v-for="index in 3" :key="index"> </transaction>
          </template>
          <template v-else-if="transactions.length <= 0">
            <ion-row class="ion-align-items-center ion-justify-content-center">
              <ion-img class="no-transaction-img" src="/assets/images/no-transaction.svg" />
              <p class="text-no-transaction">{{ $t('wallet.no_transaction') }}</p>
            </ion-row>
          </template>
          <template v-else>
            <transaction v-for="transaction in transactions" :key="transaction" :transaction="transaction">
            </transaction>
          </template>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import Transaction from '@/components/Wallet/Transaction.vue';
import { getEwalletBalance, getEwalletTransactions, getCurrentUser } from '@/services/shared/graphql';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonButtons,
  IonBackButton,
  IonItem,
  IonList,
  IonRow,
  IonImg,
  IonSkeletonText,
  IonButton,
  IonToggle,
  IonRippleEffect,
  onIonViewDidEnter,
  IonRefresher,
  IonRefresherContent,
  modalController
} from '@ionic/vue';
import { useMutation } from '@vue/apollo-composable';
import { defineComponent, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import PrimaryRefunds from './PrimaryRefunds.vue';

export default defineComponent({
  name: 'Wallet',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonLabel,
    IonButtons,
    IonBackButton,
    IonItem,
    IonList,
    IonRow,
    IonImg,
    IonSkeletonText,
    IonButton,
    IonToggle,
    IonRippleEffect,
    Transaction,
    IonRefresher,
    IonRefresherContent
  },

  setup() {
    const router = useRouter();
    const store = useStore();
    const transactions = ref([]);
    const isLoadingTransaction = ref(true);
    const isLoading = ref(true);
    const storage = inject('$storage');
    const user = ref();
    const { mutate: getEwalletTransactionsFn, onDone: getEwalletTransactionsResult } = useMutation(
      getEwalletTransactions
    );
    const { mutate: getEwalletBalanceFn, onDone: getEwalletBalanceResult } = useMutation(getEwalletBalance);
    const { mutate: getPrimaryRefunds, onDone: primaryRefundsResult } = useMutation(getCurrentUser);
    const overlayRef = ref();
    const wallet = ref();
    const isPrimaryRefunds = ref();
    const checkedPrimaryRefunds = ref();

    onIonViewDidEnter(() => {
      if (store.getters['b2c/getApplicationState']?.refetchWallet) {
        store.dispatch('b2c/removeApplicationState', ['refetchWallet']);
        getEwalletBalanceFn();
        refreshWallet();
        getPrimaryRefunds();
      }
    });

    const refreshWallet = () => {
      isLoadingTransaction.value = true;
      getEwalletTransactionsFn({
        page: 1,
        perPage: 10
      });
    };

    getEwalletTransactionsResult((res) => {
      transactions.value = res.data.getEwalletTransactions;
      isLoadingTransaction.value = false;
    });

    getEwalletBalanceResult((res) => {
      wallet.value = res.data.getEwalletBalance;
      isLoading.value = false;
    });

    refreshWallet();
    getEwalletBalanceFn();

    // //get primary refunds data
    getPrimaryRefunds()
      .then((res) => {
        isPrimaryRefunds.value = res.data?.me?.eWallet?.is_refund_to_e_wallet;
      })
      .catch((error) => {
        console.error(error);
      });

    primaryRefundsResult((res) => {
      isPrimaryRefunds.value = res.data?.me?.eWallet?.is_refund_to_e_wallet;
      checkedPrimaryRefunds.value = isPrimaryRefunds.value;
    });

    (async () => {
      user.value = await storage.getUser();
    })();

    const removeOverlay = () => {
      overlayRef.value.remove();
    };

    return {
      router,
      store,
      user,
      transactions,
      isLoadingTransaction,
      isLoading,
      removeOverlay,
      refreshWallet,
      getEwalletBalanceFn,
      getPrimaryRefunds,
      primaryRefundsResult,
      overlayRef,
      wallet,
      isPrimaryRefunds,
      checkedPrimaryRefunds
    };
  },
  methods: {
    doRefresh(event) {
      this.isLoading = true;
      this.isLoadingTransaction = true;
      this.getEwalletBalanceFn();
      this.refreshWallet();
      this.getPrimaryRefunds();
      event.target.complete();
    },

    async openPrimaryRefundsModal() {
      if (this.isPrimaryRefunds === true && this.checkedPrimaryRefunds === false) {
        const modal = await modalController.create({
          component: PrimaryRefunds,
          cssClass: 'primary-refunds-off',
          backdropDismiss: false,
          componentProps: {
            title: `${this.$t('wallet.turn_off_refunds_title')}`,
            text1: `${this.$t('wallet.turn_off_refunds_top')}`,
            text2: `${this.$t('wallet.turn_off_refunds_bottom')}`,
            primaryRefundsStatus: this.isPrimaryRefunds
          }
        });
        await modal.present();
        const updatePrimaryRefunds = await modal.onDidDismiss();
        if (updatePrimaryRefunds) {
          this.getPrimaryRefunds();
          this.primaryRefundsResult();
        }
      } else if (this.isPrimaryRefunds === false && this.checkedPrimaryRefunds === true) {
        const modal = await modalController.create({
          component: PrimaryRefunds,
          cssClass: 'primary-refunds-on',
          backdropDismiss: false,
          componentProps: {
            title: `${this.$t('wallet.turn_on_refunds_title')}`,
            text1: `${this.$t('wallet.turn_on_refunds')}`,
            text2: '',
            primaryRefundsStatus: this.isPrimaryRefunds
          }
        });
        await modal.present();
        const updatePrimaryRefunds = await modal.onDidDismiss();
        if (updatePrimaryRefunds) {
          this.getPrimaryRefunds();
          this.primaryRefundsResult();
        }
      }
    }
  }
});
</script>
<style scoped lang="scss">
@import 'Wallet.scss';
</style>

<template>
  <ion-page>
    <ion-content>
      <div class="header">
        <span>{{ $t('payment_option_page.treedots_balance_modal_page.oops') }}</span>
      </div>
      <p class="m-b-20">{{ $t('payment_option_page.treedots_balance_modal_page.to_complete') }}</p>
      <div class="line-separator-3"></div>
      <ion-item class="ion-no-padding" lines="none">
        <ion-col class="col-balance" slot="start">
          <ion-row class="ion-align-items-center">
            <ion-img class="wallet-icon" src="/assets/images/paymentoption-treedots.svg"></ion-img>
            <div class="e-wallet-balance">{{ currencySymbol }}{{ ewalletAmount.toFixed(2) }}</div>
            <ion-img class="info-icon" src="/assets/images/info-fail.svg"></ion-img>
          </ion-row>
        </ion-col>
        <ion-col class="order-amount" slot="end">
          <span class="amount">{{ $t('payment_option_page.treedots_balance_modal_page.amount') }}</span>
          <br />
          <span class="order-total">{{ currencySymbol }}{{ orderTotalAmount.toFixed(2) }}</span>
        </ion-col>
      </ion-item>
      <div class="line-separator-3"></div>
      <ion-button @click="openWallet" class="checkout-btn" expand="block">{{
        $t('payment_option_page.treedots_balance_modal_page.top_up_treedots')
      }}</ion-button>
      <ion-button @click="$emit('close-modal')" class="checkout-btn m-t-16" expand="block" fill="outline">{{
        $t('payment_option_page.treedots_balance_modal_page.change_payment_method')
      }}</ion-button>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonPage, IonContent, IonButton, IonItem, IonImg, IonCol, IonRow } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'AddCard',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonItem,
    IonImg,
    IonCol,
    IonRow
  },
  props: ['currencySymbol'],
  setup(props, { emit }) {
    const router = useRouter();
    const store = useStore();
    const openWallet = () => {
      router.push({
        name: 'TopUpList'
      });
      emit('top-up');
    };

    return {
      router,
      store,
      openWallet
    };
  },
  computed: {
    ewalletAmount() {
      return this.$store.getters['b2c/getEwalletAmount'];
    },
    orderTotalAmount() {
      return this.$store.getters['b2c/getOrderTotalAmount'];
    }
  },
  methods: {
    dismissModal() {
      this.$emit('close-modal');
    }
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'TreedotsBalanceModal.scss';
</style>

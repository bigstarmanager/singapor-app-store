<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text=""></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding">{{ $t(topUpData.title) }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="container">
        <template v-if="topUpType === 'card'">
          <div>
            <ion-img class="d-inline" :src="getCardImageSrc"></ion-img>
            <span>{{ card.card.brand.toUpperCase() }} {{ card.card.last4 }}</span>
          </div>
        </template>
        <template v-else>
          <div></div>
        </template>
        <p>{{ $t('wallet.top_up_page.card_page.top_up_amount') }}</p>
        <ion-item
          :class="
            topUpAmount > maximumTopUp || (topUpAmount < minimumTopUp && topUpAmount !== null)
              ? 'input-error'
              : 'voucher-container'
          "
        >
          <span
            :class="
              topUpAmount > maximumTopUp || topUpAmount < minimumTopUp ? 'grey-currency' : 'black-currency'
            "
            v-if="topUpAmount !== null && topUpAmount !== '' && topUpAmount >= 0"
            >{{ user?.country?.currency_symbol }}</span
          >
          <ion-input
            type="number"
            inputmode="numeric"
            pattern="\\d*"
            v-model="topUpAmount"
            :placeholder="`${user?.country?.currency_symbol}${minimumTopUp}`"
            @ionChange="setTwoNumberDecimal"
          >
          </ion-input>
        </ion-item>
        <div v-if="topUpAmount > maximumTopUp" class="error" as="div">
          {{ $t('wallet.top_up_page.card_page.maximum_top_up') }} {{ user?.country?.currency_symbol
          }}{{ maximumTopUp }}
        </div>
        <div v-else-if="topUpAmount !== null && topUpAmount < minimumTopUp" class="error" as="div">
          {{ $t('wallet.top_up_page.card_page.minimum_top_up') }} {{ user?.country?.currency_symbol
          }}{{ minimumTopUp }}
        </div>
        <div v-else>{{}}</div>
        <ion-modal
          :is-open="isReviewCardOpen"
          css-class="cart__review-card-modal"
          @didDismiss="isReviewCardOpen = false"
        >
          <modal-top-up
            :card="card"
            :paymentMethod="topUpType"
            :user="user"
            :topUpAmount="parseInt(topUpAmount)"
            @close-modal="isReviewCardOpen = false"
            @top-up-complete="topUpCompleteHook()"
          >
          </modal-top-up>
        </ion-modal>
      </div>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-button
          class="checkout-btn"
          expand="block"
          :disabled="topUpAmount > maximumTopUp || topUpAmount === null || topUpAmount < minimumTopUp"
          @click="isReviewCardOpen = true"
          ><span>{{ $t('next') }}</span></ion-button
        >
      </ion-toolbar>
    </ion-footer>
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
  IonImg,
  IonButton,
  IonInput,
  IonItem,
  IonModal
} from '@ionic/vue';
import { defineComponent, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import ModalTopUp from '@/components/Wallet/TopUp/ModalTopUp.vue';

const TOPUP_DATA = {
  card: {
    title: 'wallet.top_up_page.card_page.top_up_via'
  },
  banktransfer: {
    title: 'wallet.top_up_page.bank_transfer_page.top_up_via'
  },
  paynow: {
    title: 'wallet.top_up_page.paynow_page.top_up_via'
  },
  grabpay: {
    title: 'wallet.top_up_page.grabpay_page.top_up_via'
  },
  netslink: {
    title: 'wallet.top_up_page.netslink_page.top_up_via'
  }
};

export default defineComponent({
  name: 'TopUpCard',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonFooter,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonImg,
    IonButton,
    IonInput,
    IonItem,
    IonModal,
    ModalTopUp
  },
  beforeRouteEnter(to, from, next) {
    if (
      from.name !== 'TopUpList' &&
      from.name !== 'PaynowInstructions' &&
      from.name !== 'BankTransferInstructions' &&
      from.name !== 'Wallet'
    ) {
      next({
        name: 'TopUpList'
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
    const card = ref();
    const isLoadingPage = ref(true);
    const maximumTopUp = 20000;
    const minimumTopUp = 10;
    const topUpAmount = ref(null);
    const isReviewCardOpen = ref(false);

    (async () => {
      user.value = await storage.getUser();
    })();

    const topUpCompleteHook = () => {
      topUpAmount.value = null;
      router.push({
        name: 'Wallet'
      });
    };

    let topUpData;
    let topUpType = store.getters['b2c/getApplicationState'].topUp.type;
    for (let prop in TOPUP_DATA) {
      if (prop === topUpType) {
        topUpData = TOPUP_DATA[prop];
      }
    }

    if (topUpType === 'card') {
      card.value = store.getters['b2c/getApplicationState'].topUp.data;
    }

    const setTwoNumberDecimal = (event) => {
      let value = event.target.value;
      let pattern = /(\d+\.)/g;
      let regex = pattern.exec(value);

      if (regex) {
        event.target.value = parseFloat(regex[1]);
      }
    };

    return {
      router,
      store,
      card,
      isLoadingPage,
      topUpAmount,
      minimumTopUp,
      user,
      maximumTopUp,
      isReviewCardOpen,
      topUpCompleteHook,
      topUpType,
      topUpData,
      setTwoNumberDecimal
    };
  },
  computed: {
    getCardImageSrc() {
      const cardType = this.card.card.brand;
      const imageFolderPath = '/assets/images/';
      if (cardType == 'visa') {
        return imageFolderPath + 'cib-cc-visa.svg';
      }

      return imageFolderPath + 'mastercard.svg';
    }
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/wallet/Wallet.scss';
@import 'bankTransfer/AddBankAccount.scss';
</style>
<style lang="scss">
.cart__review-card-modal {
  --height: 326px;
  --width: 100%;

  > div {
    position: absolute;
    bottom: 0%;
    left: 0;
    --border-radius: 8px 8px 0 0;
  }
}
</style>

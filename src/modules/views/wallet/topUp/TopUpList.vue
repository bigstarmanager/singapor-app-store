<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text=""></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding">{{ $t('wallet.top_up') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <!-- <ion-item lines="none" @click="showCard = !showCard" button>
          <ion-img src="/assets/images/wallet-card.svg"></ion-img>
          <ion-label>{{ $t('wallet.top_up_page.credit_card_debit_card') }}</ion-label>
          <ion-img
            slot="end"
            class="chevron"
            :class="{
              open: showCard
            }"
            src="/assets/images/ic_chevron_right_24px.svg"
          ></ion-img>
        </ion-item>

        <ion-list inset v-if="showCard && !isFetchingCard">
          <top-up-card
            v-for="card in cards"
            @click="topUpCard(card)"
            :key="card.id"
            :card="card"
          ></top-up-card>
          <ion-button expand="block" class="add-card" @click="addCardModalOpen = true" button>
            <ion-img src="/assets/images/wallet-plus-icon.svg"></ion-img>
            <ion-label>
              <span>{{ $t('cc_add_card') }}</span>
            </ion-label>
          </ion-button>
          <ion-modal
            :is-open="addCardModalOpen"
            css-class="cart__add-card-modal"
            @didDismiss="addCardModalOpen = false"
          >
            <add-card @save-card="saveCard" @close-modal="addCardModalOpen = false"> </add-card>
          </ion-modal>
        </ion-list> -->

        <ion-item mode="md" lines="none" @click="topUpBankTransfer()" button>
          <ion-img src="/assets/images/wallet-bank-transfer.svg"></ion-img>
          <ion-label>{{ $t('wallet.top_up_page.bank_transfer') }}</ion-label>
          <ion-img slot="end" class="chevron" src="/assets/images/ic_chevron_right_24px.svg"></ion-img>
        </ion-item>

        <template v-if="topUpOptions || true">
          <ion-item mode="md" lines="none" @click="topUpPaynow()" button>
            <ion-img src="/assets/images/wallet-paynow.svg"></ion-img>
            <ion-label>{{ $t('wallet.top_up_page.paynow') }}</ion-label>
            <ion-img slot="end" class="chevron" src="/assets/images/ic_chevron_right_24px.svg"></ion-img>
          </ion-item>

          <!-- <ion-item lines="none" @click="topUpGrabpay()" button>
            <ion-img src="/assets/images/wallet-grabpay.svg"></ion-img>
            <ion-label>{{ $t('wallet.top_up_page.grabpay') }}</ion-label>
            <ion-img slot="end" class="chevron" src="/assets/images/ic_chevron_right_24px.svg"></ion-img>
          </ion-item>

          <ion-item lines="none" @click="topUpNetslink()" button>
            <ion-img src="/assets/images/wallet-nets.png"></ion-img>
            <ion-label>{{ $t('wallet.top_up_page.nets') }}</ion-label>
            <ion-img slot="end" class="chevron" src="/assets/images/ic_chevron_right_24px.svg"></ion-img>
          </ion-item> -->
        </template>

        <template v-if="false">
          <ion-button></ion-button>
          <ion-modal></ion-modal>
          <top-up-card></top-up-card>
          <add-card></add-card>
        </template>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import AddCard from '@/components/Cart/Checkout/PaymentOption/AddCard.vue';
import TopUpCard from '@/components/Wallet/TopUp/Card/TopUpCard.vue';
import { listCustomerCard } from '@/services/shared/graphql';
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
  IonImg,
  IonButton,
  IonModal
} from '@ionic/vue';
import { useQuery } from '@vue/apollo-composable';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'TopUpList',
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
    IonImg,
    IonButton,
    IonModal,
    TopUpCard,
    AddCard
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const showCard = ref(false);
    const cards = ref([]);
    const { refetch: cardsRefetch, onResult: cardsResult } = useQuery(listCustomerCard);
    const isFetchingCard = ref(true);
    const addCardModalOpen = ref(false);
    const topUpOptions = store.getters['b2c/getPreviousRouteState'].from.name === 'Wallet';

    cardsResult((result) => {
      cards.value = result.data.listCustomerCard.data;
      isFetchingCard.value = false;
      console.log('ONRESULT');
    });

    return {
      router,
      store,
      showCard,
      cards,
      cardsRefetch,
      cardsResult,
      addCardModalOpen,
      topUpOptions,
      isFetchingCard
    };
  },
  methods: {
    addCard() {
      this.cardsRefetch();
    },
    topUpCard(card) {
      this.store.dispatch('b2c/addApplicationState', {
        topUp: {
          type: 'card',
          data: card
        }
      });
      this.router.push({ name: 'TopUp' });
    },
    topUpBankTransfer() {
      this.store.dispatch('b2c/addApplicationState', {
        topUp: {
          type: 'banktransfer',
          data: true
        }
      });
      this.router.push({ name: 'TopUp' });
    },
    topUpPaynow() {
      this.store.dispatch('b2c/addApplicationState', {
        topUp: {
          type: 'paynow',
          data: true
        }
      });
      this.router.push({ name: 'TopUp' });
    },
    topUpGrabpay() {
      this.store.dispatch('b2c/addApplicationState', {
        topUp: {
          type: 'grabpay',
          data: true
        }
      });
      this.router.push({ name: 'TopUp' });
    },
    topUpNetslink() {
      this.store.dispatch('b2c/addApplicationState', {
        topUp: {
          type: 'netslink',
          data: true
        }
      });
      this.router.push({ name: 'TopUp' });
    },
    saveCard(card) {
      console.log(card);

      this.cardsRefetch();
    }
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/wallet/Wallet.scss';
@import 'TopUpList.scss';
</style>
<style lang="scss">
.cart__add-card-modal {
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

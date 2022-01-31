<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text=""></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding">{{ $t('select_payment_method') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-list>
        <template v-if="isLoadingPage">
          <card v-for="card in [0, 1, 2, 3, 4]" :key="card"></card>
          <ion-item class="treedots" @click="isAddCardOpen = true" button>
            <ion-skeleton-text class="img"></ion-skeleton-text>
            <ion-label>
              <span><ion-skeleton-text style="width: 5em"></ion-skeleton-text></span>
            </ion-label>
          </ion-item>
        </template>
        <template v-else>
          <ion-item
            class="treedots"
            @click="selectEwallet()"
            lines="none"
            button
            v-if="currentUser?.country?.id !== 127"
          >
            <ion-img src="/assets/images/paymentoption-treedots.svg"></ion-img>
            <ion-label>
              <span>{{ $t('payment_option_page.treedots_pay') }}</span>
            </ion-label>
            <div class="amount">
              <span> {{ currencySymbol }}{{ ewalletAmount.toFixed(2) }} </span>
              <ion-img
                v-if="!selectedCardPayment && selectedGrabpayAndFpx === null"
                class="tick"
                src="/assets/images/subway-tick.svg"
              ></ion-img>
            </div>
          </ion-item>
          <div class="line-separator" v-if="currentUser?.country?.id !== 127"></div>
          <ion-item lines="none">
            <ion-label>
              <span
                ><strong>{{ $t('payment_option_page.other_payment_method') }}</strong></span
              >
            </ion-label>
          </ion-item>
          <card
            v-for="card in cards"
            :key="card.id"
            :selected="!selectGrabPayAndFpx ? selectedCard(card) : false"
            :card="card"
            @click="setGrabFpxAsNull"
          ></card>
          <ion-item @click="selectGrabpayAndFpxPayment('grabpay')" detail="false">
            <ion-img class="grab-fpx" src="/assets/images/grab.svg" />
            <ion-label class="grab-fpx-label"> {{ $t('grabpay') }} </ion-label>
            <ion-img
              v-if="
                (selectGrabPayMethod === true && !selectedCardPayment) || selectedGrabpayAndFpx === 'grabpay'
              "
              class="tick"
              slot="end"
              src="/assets/images/subway-tick.svg"
            ></ion-img>
          </ion-item>
          <!-- Only show this if user from Malaysia -->
          <ion-item
            v-if="currentUser?.country?.id === 127"
            @click="selectGrabpayAndFpxPayment('fpx')"
            detail="false"
          >
            <ion-img class="grab-fpx" src="/assets/images/fpx.svg" />
            <ion-label class="grab-fpx-label"> {{ $t('fpx') }} </ion-label>
            <ion-img
              v-if="(selectFpxMethod === true && !selectedCardPayment) || selectedGrabpayAndFpx === 'fpx'"
              class="tick"
              slot="end"
              src="/assets/images/subway-tick.svg"
            ></ion-img>
          </ion-item>
          <ion-item class="add-card" @click="isAddCardOpen = true" button>
            <ion-img src="/assets/images/add-circle-outline.svg"></ion-img>
            <ion-label>
              <span>{{ $t('cc_add_card') }}</span>
            </ion-label>
          </ion-item>
          <ion-modal
            :is-open="isTreedotsOpen"
            css-class="cart__treedots-balance-modal"
            @didDismiss="isTreedotsOpen = false"
          >
            <treedots-balance-modal
              @close-modal="isTreedotsOpen = false"
              @top-up="isTreedotsOpen = false"
              :currencySymbol="currencySymbol"
            ></treedots-balance-modal>
          </ion-modal>
          <ion-modal
            :is-open="isAddCardOpen"
            css-class="cart__add-card-modal"
            @didDismiss="isAddCardOpen = false"
          >
            <add-card @save-card="saveCard" @close-modal="isAddCardOpen = false"> </add-card>
          </ion-modal>
        </template>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import Card from '@/components/Cart/Checkout/PaymentOption/Card.vue';
import TreedotsBalanceModal from '@/components/Cart/Checkout/PaymentOption/TreedotsBalanceModal.vue';
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
  IonModal,
  IonSkeletonText
} from '@ionic/vue';
import { useQuery } from '@vue/apollo-composable';
import { defineComponent, ref, computed, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import AddCard from '../../../../components/Cart/Checkout/PaymentOption/AddCard.vue';

export default defineComponent({
  name: 'PaymentOption',
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
    IonModal,
    IonSkeletonText,
    Card,
    AddCard,
    TreedotsBalanceModal
  },
  async setup() {
    const router = useRouter();
    const store = useStore();
    const cards = ref([]);
    const { refetch: cardsRefetch, onResult: cardsResult } = useQuery(listCustomerCard);
    const isAddCardOpen = ref(false);
    const isTreedotsOpen = ref(false);
    const isLoadingPage = ref(true);
    const collectionPoint = computed(() => {
      return store.getters['b2c/getSelectedHub'];
    });

    const ewalletSelect = ref(true);
    const currentUser = await inject('$storage').getUser();
    cardsResult((result) => {
      cards.value = result.data.listCustomerCard.data;
      isLoadingPage.value = false;
    });
    const selectGrabPayAndFpx = ref(false);
    const selectGrabPayMethod = ref(false);
    const selectFpxMethod = ref(false);

    return {
      router,
      store,
      cards,
      isAddCardOpen,
      isTreedotsOpen,
      cardsRefetch,
      isLoadingPage,
      selectGrabPayAndFpx,
      selectGrabPayMethod,
      selectFpxMethod,
      collectionPoint,
      currentUser,
      currencySymbol: currentUser.country.currency_symbol,
      ewalletSelect
    };
  },
  computed: {
    card() {
      return this.store.getters['b2c/getCard'] ?? this.store.getters['b2c/getPreviousRouteState'].defaultCard;
    },
    selectedCardPayment() {
      return this.store.getters['b2c/getSelectedCardPayment'];
    },
    selectedGrabpayAndFpx() {
      return this.store.getters['b2c/getSelectedGrabpayAndFpx'];
    },
    ewalletAmount() {
      return this.store.getters['b2c/getEwalletAmount'];
    },
    getOrderTotalAmount() {
      return this.store.getters['b2c/getOrderTotalAmount'];
    }
  },
  beforeRouteEnter(to, from, next) {
    if (from.name != 'Checkout' && from.name != 'TopUpList') {
      next({
        name: 'Checkout'
      });
      return;
    }

    next();
  },
  methods: {
    selectedCard(card) {
      return card.id === this.card?.id;
    },
    saveCard() {
      this.cardsRefetch().then((result) => {
        // cardsResult runs first.
        const newCard = result.data.listCustomerCard.data[0];
        this.store.dispatch('b2c/setCard', newCard);
        this.router.back();
      });
    },
    selectEwallet() {
      this.setGrabFpxAsNull();
      this.$store.dispatch('b2c/setSelectedCardPayment', false);
      if (this.getOrderTotalAmount > this.ewalletAmount) {
        this.isTreedotsOpen = true;
      } else {
        this.$router.back();
      }
    },

    selectGrabpayAndFpxPayment(grabpayorfpx) {
      this.$store.dispatch('b2c/setSelectedGrabpayAndFpx', grabpayorfpx);
      this.$store.dispatch('b2c/setSelectedCardPayment', false);
      this.selectGrabPayAndFpx = true;
      if (grabpayorfpx === 'grabpay') {
        this.selectGrabPayMethod = true;
      } else {
        this.selectFpxMethod = true;
      }
      this.$router.back();
    },

    setGrabFpxAsNull() {
      this.$store.dispatch('b2c/setSelectedGrabpayAndFpx', null);
    }
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'PaymentOption.scss';
</style>
<style lang="scss">
.cart__add-card-modal {
  --height: 24.2rem;
  --width: 100%;

  > div {
    position: fixed;
    overflow: hidden;
    overflow-y: hidden;
    bottom: 0%;
    left: 0;
    --border-radius: 12px 12px 0 0;
  }
}
.cart__treedots-balance-modal {
  --height: 382px;
  --width: 90%;

  div[role='dialog'] {
    position: absolute;
    --border-radius: 8px;
  }
}
</style>

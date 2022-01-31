<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding">{{ $t('wallet.top_up_page._top_up_via.top_up_via') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content> </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonLabel,
  IonButtons,
  IonBackButton,
  IonButton
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

const DRAWER_OPEN = '/assets/images/select-dropdown-arrow.svg';
const DRAWER_CLOSE = '/assets/images/ic_chevron_right_24px.svg';

export default defineComponent({
  name: 'BankTransfer',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonLabel,
    IonButtons,
    IonBackButton,
    IonButton
  },
  setup() {
    const router = useRouter();
    const store = useStore();

    return {
      router,
      store
    };
  },
  methods: {
    addCard() {
      this.cardsRefetch();
    },
    drawerOpen(open) {
      return open ? DRAWER_OPEN : DRAWER_CLOSE;
    }
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'BankTransfer.scss';
</style>

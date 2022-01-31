<template>
  <loader-add-new-bank-vue
    v-if="isAddingBankAccount"
    @close-loader="onCloseLoader"
    :status="addingBankStatus"
  ></loader-add-new-bank-vue>
  <ion-page v-else>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text=""></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding">{{
          $t('wallet.top_up_page.bank_transfer_page.add_dbs_ocbc')
        }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="container">
        <div>
          <ion-img class="d-inline" :src="getCardImageSrc"></ion-img>
          <span>+{{ user?.mobile }}</span>
        </div>
        <p>{{ $t('wallet.top_up_page.bank_transfer_page.we_have_transferred') }}</p>
        <Field name="topUpAmount" v-slot="{ field, errorMessage }">
          <ion-item
            class="voucher-container"
            :class="{
              error: errorMessage !== undefined
            }"
          >
            <ion-input
              v-bind="field"
              type="number"
              :placeholder="`${user?.country?.currency_symbol}${minimumTopUp}`"
            ></ion-input>
          </ion-item>
        </Field>
        <Error-Message name="topUpAmount" class="error" as="div">
          {{ $t('wallet.top_up_page.card_page.minimum_top_up') }} {{ user?.country?.currency_symbol
          }}{{ minimumTopUp }}
        </Error-Message>
      </div>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <!-- {{ meta }}
        {{ values }} -->
        <ion-button class="checkout-btn" expand="block" :disabled="!meta.valid" @click="onNext"
          ><span>{{ $t('confirm') }}</span></ion-button
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
  IonItem
} from '@ionic/vue';
import { computed, defineComponent, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Field, ErrorMessage, useForm } from 'vee-validate';
import store from '@/store';
import LoaderAddNewBankVue, {
  ADD_NEW_BANK_STATUS
} from '@/components/Wallet/TopUp/BankTransfer/LoaderAddNewBank.vue';

export default defineComponent({
  name: 'AddBankAccount',
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
    Field,
    ErrorMessage,
    LoaderAddNewBankVue
  },
  beforeRouteEnter(to, from, next) {
    const previousRouteState = store.getters['b2c/getPreviousRouteState'];

    if (!previousRouteState.bank) {
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
    const minimumTopUp = 10;
    const topUpAmount = ref();
    const schema = {
      topUpAmount(val) {
        if (!val || parseInt(val) < minimumTopUp) {
          return false;
        }
        return true;
      }
    };
    const { meta, values } = useForm({
      validationSchema: schema
    });
    const addingBankStatus = ref(ADD_NEW_BANK_STATUS.IDLE);
    const isAddingBankAccount = computed(() => {
      return addingBankStatus.value !== ADD_NEW_BANK_STATUS.IDLE;
    });
    const onCloseLoader = () => {
      addingBankStatus.value = ADD_NEW_BANK_STATUS.IDLE;
    };
    const onNext = () => {
      addingBankStatus.value = ADD_NEW_BANK_STATUS.LOADING;

      setTimeout(() => {
        addingBankStatus.value = ADD_NEW_BANK_STATUS.SUCCESS;
      }, 5000);
    };

    (async () => {
      user.value = await storage.getUser();
    })();

    return {
      router,
      store,
      isAddingBankAccount,
      topUpAmount,
      minimumTopUp,
      meta,
      values,
      schema,
      user,
      onCloseLoader,
      addingBankStatus,
      onNext
    };
  },
  computed: {
    getCardImageSrc() {
      const imageFolderPath = '/assets/images/';
      return imageFolderPath + 'mastercard.svg';
    }
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/wallet/Wallet.scss';
@import 'AddBankAccount.scss';
</style>

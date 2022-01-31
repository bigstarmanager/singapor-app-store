<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text=""></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding text-black">{{ $t('wallet.transfer_bank') }}</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list class="bank-list" v-if="showbank && !isFetchingBank">
        <bank-account v-for="bank in banks" :key="bank.id" :bank="bank"> </bank-account>
      </ion-list>
      <ion-list v-else>
        <ion-item lines="none" detail="false">
          <ion-skeleton-text
            slot="start"
            animated
            style="width: 28px; height: 24px; margin-right: 14px"
          ></ion-skeleton-text>
          <ion-skeleton-text animated style="width: 25%; height: 24px"></ion-skeleton-text>
        </ion-item>
        <ion-item lines="none" detail="false">
          <ion-skeleton-text
            slot="start"
            animated
            style="width: 28px; height: 24px; margin-right: 14px"
          ></ion-skeleton-text>
          <ion-skeleton-text animated style="width: 50%; height: 24px"></ion-skeleton-text>
        </ion-item>
        <ion-item lines="none" detail="false">
          <ion-skeleton-text
            slot="start"
            animated
            style="width: 28px; height: 24px; margin-right: 14px"
          ></ion-skeleton-text>
          <ion-skeleton-text animated style="width: 50%; height: 24px"></ion-skeleton-text>
        </ion-item>
      </ion-list>
      <ion-item class="add-bank" lines="none" detail="true" @click="$router.push({ name: 'AddNewBank' })">
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img src="/assets/images/plus-circle.svg"></ion-img>
          <ion-label class="tf-label"> {{ $t('wallet.add_bank_account') }} </ion-label>
        </ion-row>
      </ion-item>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonPage,
  IonRow,
  IonButtons,
  IonBackButton,
  IonItem,
  IonImg,
  IonLabel,
  IonList,
  IonSkeletonText,
  onIonViewWillEnter
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { chevronForward } from 'ionicons/icons';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import BankAccount from '@/components/Wallet/Withdraw/BankAccount.vue';
import { getBankDetailUser } from '@/services/shared/graphql';

export default defineComponent({
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonPage,
    IonRow,
    IonButtons,
    IonBackButton,
    IonItem,
    IonImg,
    IonLabel,
    IonList,
    IonSkeletonText,
    BankAccount
  },

  setup() {
    const router = useRouter();
    const store = useStore();
    const showbank = ref(false);
    const banks = ref([]);
    const { mutate: fetchBankDetailUser } = useMutation(getBankDetailUser);
    const isFetchingBank = ref(true);

    onIonViewWillEnter(async () => {
      fetchBankDetailUser().then((res) => {
        showbank.value = true;
        banks.value = res.data.getBankDetailUser;
        isFetchingBank.value = false;
      });
    });

    return {
      chevronForward,
      router,
      store,
      showbank,
      banks,
      isFetchingBank
    };
  }
});
</script>

<style scoped lang="scss">
@import 'index';
</style>

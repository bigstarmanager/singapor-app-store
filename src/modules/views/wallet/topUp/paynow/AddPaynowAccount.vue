<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text=""></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding">{{ $t('wallet.top_up_page.paynow_page.top_up_via') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div class="container">
        <!-- <div>
          <ion-img class="d-inline" :src="getCardImageSrc"></ion-img>
          <span>{{ card.card.brand.toUpperCase() }} {{ card.card.last4 }}</span>
        </div> -->
        <div class="paynow"></div>
        <p>{{ $t('wallet.top_up_page.paynow_page.add_your') }}</p>
        <Field
          name="mobileNumber"
          :rules="{
            required: true,
            phoneValidator: true,
            max: 11
          }"
          :label="$t('mobile_number')"
          v-slot="{ field, errorMessage }"
        >
          <ion-item
            class="voucher-container"
            :class="{
              error: errorMessage !== undefined
            }"
          >
            <ion-input v-bind="field" type="number" placeholder="+65"></ion-input>
          </ion-item>
        </Field>
        <Error-Message name="mobileNumber" class="error" as="div"></Error-Message>
      </div>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <!-- {{ meta }}
        {{ values }} -->
        <ion-button class="checkout-btn" expand="block" :disabled="!meta.valid" @click="true"
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
  IonButton,
  IonInput,
  IonItem
} from '@ionic/vue';
import { defineComponent, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Field, ErrorMessage, useForm } from 'vee-validate';

export default defineComponent({
  name: 'AddPaynowAccount',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonFooter,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonButton,
    IonInput,
    IonItem,
    Field,
    ErrorMessage
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const storage = inject('$storage');
    const user = ref();
    const isLoadingPage = ref(true);
    const minimumTopUp = 10;
    const { meta, values } = useForm();

    (async () => {
      user.value = await storage.getUser();
    })();

    return {
      router,
      store,
      isLoadingPage,
      minimumTopUp,
      meta,
      values,
      user
    };
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/wallet/Wallet.scss';
@import '../bankTransfer/AddBankAccount.scss';
</style>

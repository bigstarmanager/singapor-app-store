<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text=""></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding title-toolbar">{{ $t('wallet.add_new_bank_account') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <form>
        <Field name="bankName" :rules="{ required: true }" v-slot="{ field, errorMessage }">
          <ion-item
            class="voucher-container"
            :class="{
              error: errorMessage !== undefined
            }"
            lines="none"
          >
            <ion-label position="floating">{{ $t('wallet.select_bank') }}*</ion-label>
            <ion-select interface="action-sheet" cancel-text="Close" v-bind="field">
              <ion-select-option v-for="code in banks" v-bind:key="code" :value="code?.id">
                <ion-row class="ion-align-items-start">
                  <!-- if need to add bank symbol/acronym or image later -->
                  <!-- <p class="nameSymbol">{{ code?.acronym }}</p> -->
                  <p class="bankName">{{ code?.bank_name }}</p>
                </ion-row>
              </ion-select-option>
            </ion-select>
          </ion-item>
        </Field>
        <Error-Message name="bankName" class="error" as="div"
          >{{ $t('wallet.select_bank') }} {{ $t('wallet.is_required') }}</Error-Message
        >
        <Field name="accountName" :rules="{ required: true }" v-slot="{ field, errorMessage }">
          <ion-item
            class="voucher-container"
            :class="{
              error: errorMessage !== undefined
            }"
          >
            <ion-label position="floating"
              >{{ $t('wallet.top_up_page.bank_transfer_page.add_bank_page.account_name') }}*</ion-label
            >
            <ion-input
              v-bind="field"
              type="text"
              :placeholder="$t('wallet.top_up_page.bank_transfer_page.add_bank_page.account_name')"
            ></ion-input>
          </ion-item>
        </Field>
        <Error-Message name="accountName" class="error" as="div"
          >{{ $t('wallet.top_up_page.bank_transfer_page.add_bank_page.account_name') }}
          {{ $t('wallet.is_required') }}</Error-Message
        >

        <!-- ION RADIO DOES NOT WORK WITH VEEVALIDATE -->
        <!-- hide it in this momment because don't need it in Withdraw flow -->
        <!-- <div class="radio-input-group">
          <p>{{ $t('wallet._top_up._bank_transfer.account_type') }}</p>
          <Field
            name="accountType"
            :label="$t('wallet._top_up._bank_transfer.account_type')"
            :rules="{ required: true }"
            type="radio"
            value=""
            v-slot="{ field }"
          >
            <ion-item
              class="ion-activatable __add-bank-account"
              lines="none"
              @click="onRadio('saving')"
              button
            >
              <input type="radio" v-bind="field" slot="start" id="saving" value="saving" />
              <label>{{ $t('wallet.top_up_page.bank_transfer_page.add_bank_page.saving_account') }}</label>
            </ion-item>
          </Field>
          <Field
            name="accountType"
            :label="$t('wallet.top_up_page.bank_transfer_page.add_bank_page.account_type')"
            :rules="{ required: true }"
            type="radio"
            value=""
            v-slot="{ field }"
          >
            <ion-item
              class="ion-activatable __add-bank-account"
              lines="none"
              @click="onRadio('current')"
              button
            >
              <input type="radio" v-bind="field" slot="start" id="current" value="current" />
              <label>{{ $t('wallet.top_up_page.bank_transfer_page.add_bank_page.current_account') }}</label>
            </ion-item>
          </Field>
        </div>
        <Error-Message name="accountType" class="error" as="div"></Error-Message>

        -->

        <Field
          name="accountNumber"
          :label="$t('wallet.top_up_page.bank_transfer_page.add_bank_page.account_number')"
          :rules="{ required: true }"
          v-slot="{ field, errorMessage }"
        >
          <ion-item
            class="voucher-container"
            :class="{
              error: errorMessage !== undefined
            }"
          >
            <ion-label position="floating"
              >{{ $t('wallet.top_up_page.bank_transfer_page.add_bank_page.account_number') }}*</ion-label
            >
            <ion-input
              v-bind="field"
              type="number"
              :placeholder="$t('wallet.top_up_page.bank_transfer_page.add_bank_page.account_number')"
            ></ion-input>
          </ion-item>
        </Field>
        <Error-Message name="accountNumber" class="error" as="div"
          >{{ $t('wallet.top_up_page.bank_transfer_page.add_bank_page.account_number') }}
          {{ $t('wallet.is_required') }}</Error-Message
        >

        <!-- <Field
          name="bankCode"
          :label="$t('wallet._top_up._bank_transfer.bank_code')"
          :rules="{ required: true }"
          v-slot="{ field, errorMessage }"
        >
          <ion-item
            class="voucher-container"
            :class="{
              error: errorMessage !== undefined
            }"
            lines="none"
          >
            <ion-label>{{ $t('wallet.top_up_page.bank_transfer_page.add_bank_page.bank_code') }}</ion-label>
            <ion-select v-bind="field">
              <ion-select-option v-for="code in bankCodes" v-bind:key="code" :value="code">{{
                code
              }}</ion-select-option>
            </ion-select>
          </ion-item>
        </Field>
        <Error-Message name="bankCode" class="error" as="div" />

        <Field
          name="branchCode"
          :label="$t('wallet.top_up_page.bank_transfer_page.add_bank_page.branch_code')"
          :rules="{ required: true }"
          v-slot="{ field, errorMessage }"
        >
          <ion-item
            class="voucher-container"
            :class="{
              error: errorMessage !== undefined
            }"
            lines="none"
          >
            <ion-label>{{ $t('wallet.top_up_page.bank_transfer_page.add_bank_page.branch_code') }}</ion-label>
            <ion-select v-bind="field">
              <ion-select-option v-for="code in branchCodes" v-bind:key="code" :value="code">{{
                code
              }}</ion-select-option>
            </ion-select>
          </ion-item>
        </Field>
        <Error-Message name="branchCode" class="error" as="div" /> -->
      </form>
    </ion-content>
    <ion-footer class="ion-no-border">
      <ion-toolbar>
        <ion-button
          class="checkout-btn"
          expand="block"
          :disabled="!meta.valid || isLoading"
          @click="addNewBank()"
        >
          <ion-spinner v-if="isLoading" color="primary" name="crescent"></ion-spinner>
          <span v-else>{{ $t('next') }}</span>
        </ion-button>
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
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonLabel,
  IonSpinner,
  IonRow,
  toastController
} from '@ionic/vue';
import { arrowBackOutline, chevronBackOutline } from 'ionicons/icons';
import { ErrorMessage, Field, useForm } from 'vee-validate';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useQuery } from '@vue/apollo-composable';
import { useMutation } from '@vue/apollo-composable';
import { getBanks, addBankDetail } from '@/services/shared/graphql';

export default defineComponent({
  name: 'AddBankAccountForm',
  components: {
    IonHeader,
    IonToolbar,
    IonFooter,
    IonTitle,
    IonContent,
    IonButtons,
    IonBackButton,
    IonPage,
    IonButton,
    IonItem,
    IonInput,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonSpinner,
    IonRow,
    Field,
    ErrorMessage
  },

  data: () => {
    return {
      isLoading: false
    };
  },

  setup() {
    const router = useRouter();
    const store = useStore();
    const banks = ref([]);
    const { meta, values } = useForm();
    const { onResult: banksResult } = useQuery(getBanks);
    banksResult((result) => {
      banks.value = result.data.getBanks;
    });
    const { mutate: addNewBankAccount } = useMutation(addBankDetail);

    // const onNext = handleSubmit((values) => {
    //   console.log(values);
    //   store.dispatch('b2c/setPreviousRouteParams', {
    //     bank: values
    //   });
    //   router.push({
    //     name: 'AddBankAccount'
    //   });
    // });
    // const onRadio = (name) => {
    //   document.getElementById(name).click();
    // };
    // const bankCodes = ['9123', '1234'];
    // const branchCodes = ['001', '234'];

    return {
      arrowBackOutline,
      chevronBackOutline,
      router,
      store,
      // onNext,
      // onRadio,
      values,
      meta,
      banks,
      addNewBankAccount

      // bankCodes,
      // branchCodes
    };
  },

  methods: {
    async addNewBank() {
      this.isLoading = true;
      this.addNewBankAccount({
        bankId: parseInt(this.values.bankName),
        accountNumber: this.values.accountNumber,
        accountHolderName: this.values.accountName
      })
        .then((res) => {
          console.log(res);
          this.openSuccessToast();
          this.isLoading = false;
          this.router.go(-1);
        })
        .catch((e) => {
          console.error(e);
          this.openFailedToast();
          this.isLoading = false;
        });
    },

    async openSuccessToast() {
      const toast = await toastController.create({
        message: `${this.$t('wallet.add_bank_success')}`,
        duration: 2500,
        cssClass: 'success-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    async openFailedToast() {
      const toast = await toastController.create({
        message: `${this.$t('wallet.add_bank_fail')}`,
        duration: 2500,
        cssClass: 'failed-toast',
        position: 'bottom'
      });
      return toast.present();
    }
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/wallet/Wallet.scss';
@import 'AddBankAccountForm.scss';
</style>

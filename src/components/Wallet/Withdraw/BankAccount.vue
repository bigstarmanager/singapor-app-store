<template>
  <div>
    <ion-item @click="openBankWithdrawAction()" class="item" lines="none" detail="false">
      <span class="bank-name">{{ bank.bank.acronym }}</span>
      <!-- <ion-img class="bank-img" :src="getBankImageSrc"></ion-img> -->
      <span class="bank-number">{{ bank.account_number }}</span>
    </ion-item>
  </div>
</template>

<script>
import { IonItem } from '@ionic/vue';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'BankAccount',
  components: { IonItem },
  props: {
    bank: Object
  },
  setup(props) {
    const router = useRouter();
    const openBankWithdrawAction = () => {
      if (props.bank) {
        router.push({
          name: 'WithdrawAction',
          params: {
            bankId: props.bank.id,
            bankAccountNumber: props.bank.account_number,
            bankName: props.bank.bank.acronym
          }
        });
      }
    };
    return {
      router,
      openBankWithdrawAction
    };
  },
  computed: {
    getBankImageSrc() {
      const bankType = this.bank.bank.acronym;
      const imageFolderPath = '/assets/images/';
      if (bankType == 'DBS') {
        return imageFolderPath + 'cib-cc-visa.svg';
      }

      return imageFolderPath + 'mastercard.svg';
    }
  }
});
</script>

<style scoped lang="scss">
@import 'BankAccount.scss';
</style>

<template>
  <ion-page>
    <ion-content>
      <div class="header">
        <ion-item lines="none">
          <ion-label class="title">{{ $t('cc_add_card') }}</ion-label>
          <ion-buttons slot="end">
            <ion-button @click="dismissModal">
              <img src="/assets/images/SWM-icons-outline-cross.svg" alt="close" />
            </ion-button>
          </ion-buttons>
        </ion-item>
      </div>
      <div class="information">
        <ion-label class="ion-text-wrap">{{ $t('your_information_is_protected') }}</ion-label>
        <img src="/assets/images/SWM-icons-duotone-shield-cross.svg" />
      </div>
      <Form @submit="onSave">
        <ion-grid class="margin-x">
          <ion-row>
            <ion-col size="8">
              <ion-item>
                <ion-label position="stacked">{{ $t('cc_card_number') }}</ion-label>
                <Field
                  v-model="cardNumber"
                  name="cardNumber"
                  :label="$t('cc_card_number')"
                  :rules="{ cardValidator: true }"
                  v-slot="{ field }"
                >
                  <ion-input
                    v-model="cardNumber"
                    maxlength="19"
                    class="card"
                    :class="getCardType"
                  ></ion-input>
                  <input v-bind="field" v-mask="'#### #### #### ####'" />
                </Field>
              </ion-item>
              <Error-Message name="cardNumber" class="error" />
            </ion-col>
            <ion-col size="4">
              <ion-item>
                <ion-label position="stacked">{{ $t('cc_expiry_date') }}</ion-label>
                <Field
                  v-model="expiryDate"
                  name="expiryDate"
                  :label="$t('cc_expiry_date')"
                  :rules="{ expiryDateValidator: true }"
                  v-slot="{ field }"
                >
                  <ion-input v-model="expiryDate" maxlength="7"></ion-input>
                  <input v-bind="field" v-mask="'## / ##'" />
                </Field>
              </ion-item>
              <Error-Message name="expiryDate" class="error" />
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col size="8">
              <ion-item>
                <ion-label position="stacked">{{ $t('cc_name_on_card') }}</ion-label>
                <Field
                  v-model="nameOnCard"
                  name="nameOnCard"
                  :label="$t('cc_name_on_card')"
                  rules="required"
                  v-slot="{ field }"
                >
                  <ion-input v-bind="field" v-model="nameOnCard"></ion-input>
                </Field>
              </ion-item>
              <Error-Message name="nameOnCard" class="error" />
            </ion-col>
            <ion-col size="4">
              <ion-item>
                <ion-label position="stacked">{{ $t('cc_cvv') }}</ion-label>
                <Field
                  v-model="cvv"
                  name="cvv"
                  :label="$t('cc_cvv')"
                  rules="required|min:3"
                  v-slot="{ field }"
                >
                  <ion-input v-model="cvv" maxlength="3"></ion-input>
                  <input v-bind="field" v-mask="'###'" />
                </Field>
              </ion-item>
              <Error-Message name="cvv" class="error">
                <span class="error">{{ $t('add_card_validation.cvv') }}</span>
              </Error-Message>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-button :disabled="disableBtn" class="checkout-btn" expand="block" type="submit">
          <span v-if="!disableBtn">{{ $t('save') }}</span>
          <ion-spinner color="primary" name="crescent" v-else></ion-spinner>
        </ion-button>
      </Form>
    </ion-content>
  </ion-page>
</template>

<script>
import { addStripeCard } from '@/services/shared/graphql';
import {
  IonPage,
  IonContent,
  IonButton,
  IonButtons,
  IonItem,
  IonInput,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonSpinner,
  toastController
} from '@ionic/vue';
import { useMutation } from '@vue/apollo-composable';
import { defineComponent } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { Field, Form, ErrorMessage, defineRule } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import Branch from '@/services/shared/helper/branch';
import Intercom from '@/services/shared/helper/intercom';

// configure({
//   generateMessage: localize("en", {
//     cardNumber: {
//       required: 'Please enter a valid 16-digits card number'
//     },
//     cvv: {
//       required: 'Please enter a valid 3-digits CVV'
//     }
//   })
// });

export default defineComponent({
  name: 'AddCard',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonButtons,
    IonItem,
    IonInput,
    IonLabel,
    IonGrid,
    IonRow,
    IonCol,
    Field,
    Form,
    ErrorMessage,
    IonSpinner
  },
  data: () => {
    return {
      cardNumber: '',
      nameOnCard: '',
      expiryDate: '',
      cvv: '',
      disableBtn: false
    };
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const { mutate: addStripeCardFn } = useMutation(addStripeCard);
    const { t } = useI18n();

    const creditCardType = (cc) => {
      // credits: https://locastic.com/blog/how-to-check-credit-card-type-with-javascript/
      cc = cc.replaceAll(' ', '');

      let amex = new RegExp('^3[47][0-9]{13}$');
      let visa = new RegExp('^4[0-9]{12}(?:[0-9]{3})?$');
      let cup1 = new RegExp('^62[0-9]{14}[0-9]*$');
      let cup2 = new RegExp('^81[0-9]{14}[0-9]*$');

      let mastercard = new RegExp('^5[1-5][0-9]{14}$');
      let mastercard2 = new RegExp('^2[2-7][0-9]{14}$');

      let disco1 = new RegExp('^6011[0-9]{12}[0-9]*$');
      let disco2 = new RegExp('^62[24568][0-9]{13}[0-9]*$');
      let disco3 = new RegExp('^6[45][0-9]{14}[0-9]*$');

      let diners = new RegExp('^3[0689][0-9]{12}[0-9]*$');
      let jcb = new RegExp('^35[0-9]{14}[0-9]*$');

      if (visa.test(cc)) {
        return 'VISA';
      }
      if (amex.test(cc)) {
        return 'AMEX';
      }
      if (mastercard.test(cc) || mastercard2.test(cc)) {
        return 'MASTERCARD';
      }
      if (disco1.test(cc) || disco2.test(cc) || disco3.test(cc)) {
        return 'DISCOVER';
      }
      if (diners.test(cc)) {
        return 'DINERS';
      }
      if (jcb.test(cc)) {
        return 'JCB';
      }
      if (cup1.test(cc) || cup2.test(cc)) {
        return 'CHINA_UNION_PAY';
      }
      return undefined;
    };

    defineRule('cardValidator', (value) => {
      return creditCardType(value) ? true : t('add_card_validation.card_number');
    });

    const validateExpiryDate = (value) => {
      const re = /(\d\d) \/ (\d\d)/;
      const match = value.match(re);
      if (match === null) {
        return false;
      }
      if (parseInt(match[1]) < 1 || parseInt(match[1]) > 12) {
        return t('add_card_validation.invalid_month');
      }
      return true;
    };

    defineRule('expiryDateValidator', (value) => {
      const returnVal = validateExpiryDate(value);
      return returnVal ? returnVal : t('add_card_validation.expiry_date');
    });

    return {
      router,
      store,
      addStripeCardFn,
      creditCardType
    };
  },
  computed: {
    getCardType() {
      const cardType = this.creditCardType(this.cardNumber);
      return cardType?.toLowerCase();
    }
  },
  methods: {
    dismissModal() {
      this.$emit('close-modal');
    },
    async onSave(actions) {
      this.disableBtn = true;
      const expMonth = parseInt(this.expiryDate.split('/')[0]);
      const expYear = parseInt(this.expiryDate.split('/')[1]);
      const res = await this.addStripeCardFn({
        cardNumber: this.cardNumber,
        expMonth,
        expYear,
        cvc: this.cvv
      });
      if (res.data.addStripeCard.error === 'invalid_number') {
        actions.setFieldError('cardNumber', res.data.addStripeCard.message);
        // } else if (res.data.addStripeCard.error === 'incorrect_number') {
        //   this.openFailedToast(`${this.$t('incorrect_card_number')}`);
        //   this.disableBtn = false;
      } else if (res.data.addStripeCard.error) {
        this.openCardFailed(res.data.addStripeCard.error);
        this.dismissModal();
      } else if (!res.data.addStripeCard.error) {
        // Card is added.
        const { brand, country, funding } = res.data.addStripeCard.card;
        Branch.trackAddPaymentInfo(brand, country, funding);
        Intercom.trackEvent(Intercom.events.ADD_CARD);
        this.$emit('save-card', res.data.addStripeCard);
        this.openSuccessToast();
        this.dismissModal();
        this.disableBtn = false;
      } else {
        this.openFailedToast();
        this.disableBtn = false;
      }
    },
    formatCardNumber(event) {
      let number = event.target.value;
      number = number.toString().replace(/[^0-9]/g, '');

      if (number.length > 16) {
        number = number.substring(0, 16);
      }

      number = number.replace(/(.{4})/g, '$1 ').trim();

      event.target.value = number;
      return number;
    },
    async openSuccessToast() {
      const toast = await toastController.create({
        message: `${this.$t('add_card_success')}`,
        duration: 2000,
        cssClass: 'success-toast',
        position: 'bottom'
      });
      return toast.present();
    },
    async openFailedToast(message) {
      const toast = await toastController.create({
        message: message,
        duration: 3000,
        cssClass: 'failed-toast',
        position: 'bottom'
      });
      return toast.present();
    },
    openCardFailed(message) {
      this.$emit('openCardFailed', message);
    }
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'AddCard.scss';
</style>

<template>
  <ion-page>
    <ion-content>
      <div class="padding-x padding-y">
        <ion-row>
          <ion-col></ion-col>
          <ion-col
            ><p class="title-modal">{{ $t('edit_card') }}</p></ion-col
          >
          <ion-col class="close-icon">
            <ion-icon @click="dismissModal" class="close-icon" :icon="closeOutline" />
          </ion-col>
        </ion-row>
        <ion-row class="ion-align-items-center cc_type_number">
          <ion-img v-if="brand == 'visa'" class="ion-image" src="assets/images/cib-cc-visa.svg"> </ion-img>
          <ion-img v-else class="ion-image" src="assets/images/mastercard.svg"> </ion-img>
          <p class="card-label">{{ brand }} {{ last4 }}</p>
        </ion-row>

        <ion-row>
          <ion-col class="ion-align-self-start">
            <p class="set_default">{{ $t('set_default') }}</p>
          </ion-col>
          <ion-col class="ion-align-self-end" style="text-align: end">
            <ion-toggle
              color="success"
              @ionChange="setCardAsDefault"
              :checked="isDefault === true"
              v-model="isDefault"
              :disabled="cardList"
            >
            </ion-toggle>
          </ion-col>
        </ion-row>

        <ion-button @click="presentAlertPrompt" class="removeBtn" expand="block" fill="outline">
          <p>{{ $t('remove_card') }}</p>
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonRow,
  IonCol,
  IonIcon,
  IonButton,
  IonImg,
  IonToggle,
  alertController,
  toastController,
  modalController
} from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { defineComponent, ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { removeStripeCard, setDefault, listCustomerCard } from '@/services/shared/graphql';
import { useStore } from 'vuex';
import { useQuery } from '@vue/apollo-composable';

export default defineComponent({
  name: 'EditCard',

  setup() {
    const store = useStore();
    let isDefault = ref(false);
    const { mutate: deleteCard } = useMutation(removeStripeCard);
    const { mutate: defaultCard } = useMutation(setDefault);
    const { refetch: cardsRefetch, onResult: cardsResult } = useQuery(listCustomerCard);
    const cardList = ref([]);
    cardsResult((res) => {
      cardList.value = res.data.listCustomerCard.data.length == 1;
      if (cardList.value) {
        isDefault.value = true;
      }
    });

    return {
      closeOutline,
      store,
      deleteCard,
      defaultCard,
      cardsRefetch,
      cardsResult,
      cardList,
      isDefault
    };
  },
  props: {
    id: {},
    brand: { type: String },
    last4: { type: String },
    defaultCardId: { type: String }
  },

  components: { IonPage, IonContent, IonRow, IonCol, IonIcon, IonButton, IonImg, IonToggle },

  async created() {
    if (this.defaultCardId == this.id) {
      this.isDefault = true;
    }
  },

  methods: {
    removeCard() {
      this.deleteCard({
        cardNumber: this.id
      })
        .then((res) => {
          this.store.dispatch('b2c/setSelectedCard', res.data.removeStripeCard);
          this.store.commit('b2c/setSelectedCard', this.id);
          this.dismissModal();
        })
        .catch((e) => console.error(e));
    },

    setCardAsDefault() {
      if (this.isDefault === true) {
        this.defaultCard({
          cardNumber: this.id
        })
          .then(() => {
            this.openSuccessToast();
          })
          .catch((e) => {
            console.error(e);
            this.openFailedToast();
          });
      } else {
        this.defaultCard({
          cardNumber: ''
        })
          .then(() => {
            this.openSuccessUnsetDefaultCardToast();
          })
          .catch((e) => {
            console.error(e);
            this.openFailedUnsetDefaultCardToast();
          });
      }
    },

    async dismissModal() {
      await modalController.dismiss();
    },

    async presentAlertPrompt() {
      const alert = await alertController.create({
        cssClass: 'remove-card-confirm .alert-wrapper',
        message: `${this.$t('remove_confirm')}`,
        buttons: [
          {
            text: 'BACK',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Cancel');
            }
          },
          {
            text: 'DELETE',
            handler: () => {
              this.removeCard();
            }
          }
        ]
      });
      return alert.present();
    },

    async openSuccessToast() {
      const toast = await toastController.create({
        message: `${this.$t('card_default_success')}`,
        duration: 2500,
        cssClass: 'success-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    async openFailedToast() {
      const toast = await toastController.create({
        message: `${this.$t('card_default_failed')}`,
        duration: 2500,
        cssClass: 'failed-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    async openSuccessUnsetDefaultCardToast() {
      const toast = await toastController.create({
        message: `${this.$t('card_unset_default_success')}`,
        duration: 2500,
        cssClass: 'success-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    async openFailedUnsetDefaultCardToast() {
      const toast = await toastController.create({
        message: `${this.$t('card_unset_default_failed')}`,
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
@import 'EditCard.module';
</style>

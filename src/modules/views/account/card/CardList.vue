<template>
  <div>
    <ion-item lines="none" detail="false" @click="openModal" button>
      <ion-img slot="start" class="cc_image" :src="getCardImageSrc"></ion-img>
      <ion-label>
        <span class="text-lable">{{ card.card.last4 }}</span>
      </ion-label>
      <div v-if="getDefaultCard == card.id" class="default-card-symbol">{{ $t('default') }}</div>
      <ion-icon slot="end" class="chevronBtn" :icon="chevronForward" />
    </ion-item>
  </div>
</template>

<script>
import { IonImg, IonItem, IonLabel, IonIcon, modalController } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { chevronForward } from 'ionicons/icons';
import EditCard from './EditCard.vue';
import { useMutation } from '@vue/apollo-composable';
import { getDefault, listCustomerCard } from '../../../../services/shared/graphql';
import { useQuery } from '@vue/apollo-composable';

export default defineComponent({
  name: 'CardList',
  components: { IonImg, IonItem, IonLabel, IonIcon },
  props: {
    card: Object
  },

  async setup() {
    let getDefaultCard = ref({});
    const { mutate: fetchGetDefaultCard } = useMutation(getDefault);
    fetchGetDefaultCard()
      .then((res) => {
        getDefaultCard.value = res.data.getDefaultCard.paymentMethodId;
      })
      .catch((error) => {
        console.error(error);
      });

    const { refetch: cardsRefetch, onResult: cardsResult } = useQuery(listCustomerCard);
    cardsResult((res) => {
      if (res.data.listCustomerCard.data.length === 1) {
        getDefaultCard.value = res.data.listCustomerCard.data[0].id;
      }
    });
    return {
      chevronForward,
      getDefaultCard,
      fetchGetDefaultCard,
      cardsRefetch,
      cardsResult
    };
  },

  computed: {
    getCardImageSrc() {
      const cardType = this.card.card.brand;
      const imageFolderPath = '/assets/images/';
      if (cardType == 'visa') {
        return imageFolderPath + 'cib-cc-visa.svg';
      }
      return imageFolderPath + 'mastercard.svg';
    }
  },
  methods: {
    async openModal() {
      const modal = await modalController.create({
        component: EditCard,
        cssClass: 'edit-card-modal-dialog',
        componentProps: {
          id: this.card.id,
          brand: this.card.card.brand,
          last4: this.card.card.last4,
          defaultCardId: this.getDefaultCard
        }
      });
      await modal.present();
      const updateCard = await modal.onDidDismiss();
      if (updateCard) {
        this.getDefaultCard = null;
        this.fetchGetDefaultCard().then((res) => {
          this.getDefaultCard = res.data.getDefaultCard.paymentMethodId;
        });
        this.$emit('remove-card');
        this.$emit('reload-card');
      }
    }
  }
});
</script>

<style scoped lang="scss">
@import 'CardList.module';
</style>

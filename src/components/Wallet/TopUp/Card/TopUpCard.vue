<template>
  <template v-if="!card">
    <ion-item button>
      <ion-skeleton-text class="img card"></ion-skeleton-text>
      <ion-label class="margin-between-icons-2">
        <span><ion-skeleton-text style="width: 4em"></ion-skeleton-text></span>
      </ion-label>
    </ion-item>
  </template>
  <template v-else>
    <ion-item @click="selectCard" button>
      <ion-img class="card" :src="getCardImageSrc"></ion-img>
      <ion-label class="margin-between-icons-2">
        <span>*{{ card.card.last4 }}</span>
      </ion-label>
      <ion-img class="tick" slot="end" src="/assets/images/subway-tick.svg"></ion-img>
    </ion-item>
  </template>
</template>

<script>
import { IonImg, IonItem, IonLabel, IonSkeletonText } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'TopUpCard',
  components: { IonImg, IonItem, IonLabel, IonSkeletonText },
  props: {
    card: Object
  },
  setup() {
    return {};
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
    selectCard() {}
  }
});
</script>

<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'TopUpCard.scss';
</style>

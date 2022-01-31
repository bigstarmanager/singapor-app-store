<template>
  <ion-page>
    <ion-header class="nps-feedback-header">
      <ion-toolbar class="title">
        <ion-img class="icon-close" slot="end" :src="close" @click="closeModal()" />
      </ion-toolbar>
    </ion-header>
    <ion-content forceOverscroll="false" class="nps-feedback-content" :class="{ showRate: 'thankyou' }">
      <div v-if="!showRate">
        <ion-label>
          {{ $t('NPS_text') }}
        </ion-label>
        <div class="view-star">
          <ion-img
            class="star"
            v-for="index in 5"
            :key="index"
            :src="index <= setValue ? star_fill : star_outline"
            @click="setRateFunction(index)"
          />
        </div>
      </div>
      <div v-if="showRate">
        <ion-img src="/assets/images/recommendations.svg" class="recommendation_img" />
        <ion-label class="thankyou_text">
          {{ $t('NPS_thank_you') }}
        </ion-label>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { IonHeader, IonContent, IonToolbar, IonLabel, IonPage, IonImg } from '@ionic/vue';
import { addNps } from '../../services/shared/graphql/NPS';
import { useMutation } from '@vue/apollo-composable';
import star_fill from '/src/assets/icons/shared/star_fill.svg';
import star_outline from '/src/assets/icons/shared/star_outline.svg';
import close from '/src/assets/icons/shared/close.svg';

export default defineComponent({
  name: 'NPSFeedback',
  components: { IonHeader, IonContent, IonToolbar, IonLabel, IonPage, IonImg },
  setup() {
    let showRate = ref(false);
    let setValue = ref(0);
    const { mutate: fetchAddNps } = useMutation(addNps);
    return {
      showRate,
      fetchAddNps,
      setValue,
      close,
      star_fill,
      star_outline
    };
  },
  methods: {
    setRateFunction(index) {
      if (this.setValue == 0) {
        this.setValue = index;
        this.fetchAddNps({ stars: index })
          .then(() => {
            this.showRate = true;
            document.querySelector('ion-modal.nps-feedback').classList.add('thanks-height');
          })
          .catch((error) => {
            console.error(error);
          });
      }
    },
    closeModal() {
      this.$emit('close');
    }
  }
});
</script>

<style scoped lang="scss">
@import 'npsfeedback';
</style>

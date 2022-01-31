<template>
  <ion-page>
    <ion-header>
      <ion-label class="view-history-title">{{ $t('order.supplier_rejection_reason') }}</ion-label>
      <img @click="onClose" src="/assets/images/SWM-icons-outline-cross.svg" alt="close" />
    </ion-header>
    <ion-content>
      <ion-label class="description-label">{{ $t('description') }}</ion-label>
      <p class="description-text">{{ history.description }}</p>
      <div class="attachment-container">
        <p class="attachment-label">{{ $t('order.attachment') }}</p>
        <ion-row v-for="(attachment, index) in history.history_attachments" :key="index">
          <ion-img @ionError="setImageDefault($event)" :src="attachment.imageSrc" class="attachment-image" />
        </ion-row>
        <p class="attachment-date">{{ history.created_at }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonPage, IonHeader, IonImg, IonLabel, IonRow } from '@ionic/vue';
import { noImage } from '@/utils/getImage';
import copy_svg from '@/assets/icons/shared/copy.svg';
import arrow_top_right from '@/assets/icons/shared/arrow_top_right.svg';

export default defineComponent({
  name: 'DisputeViewDetail',
  components: { IonContent, IonPage, IonHeader, IonImg, IonLabel, IonRow },
  props: {
    history: Object
  },
  methods: {
    setImageDefault(event) {
      event.target.src = noImage;
    }
  },
  setup(props, { emit }) {
    const onClose = () => {
      emit('close-view-detail');
    };

    return {
      onClose,
      arrow_top_right,
      copy_svg
    };
  }
});
</script>

<style scoped lang="scss">
@import 'DisputeViewDetail.scss';
</style>

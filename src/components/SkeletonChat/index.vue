<template>
  <ion-list id="skeleton-chat">
    <ion-item class="skeleton-container" v-for="n in count" :key="n">
      <ion-thumbnail class="skeleton-avatar" slot="start">
        <ion-skeleton-text class="skeleton-avatar" />
      </ion-thumbnail>
      <ion-label>
        <h3>
          <ion-skeleton-text animated />
        </h3>
        <p>
          <ion-skeleton-text animated />
        </p>
      </ion-label>
    </ion-item>
  </ion-list>
</template>

<script>
import { IonItem, IonLabel, IonList, IonSkeletonText, IonThumbnail } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Skeleton',
  components: {
    IonItem,
    IonLabel,
    IonList,
    IonSkeletonText,
    IonThumbnail
  },
  props: {
    count: Number
  }
});
</script>
<style scoped lang="scss">
@import 'skeleton.chat.module';
</style>

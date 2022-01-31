<template>
  <ion-list id="map-skeleton">
    <ion-item v-for="n in count" :key="n">
      <ion-thumbnail slot="start">
        <ion-skeleton-text></ion-skeleton-text>
      </ion-thumbnail>
      <ion-label>
        <h3>
          <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
        </h3>
        <p>
          <ion-skeleton-text animated style="width: 60%"></ion-skeleton-text>
        </p>
        <p>
          <ion-skeleton-text animated style="width: 30%"></ion-skeleton-text>
        </p>
      </ion-label>
    </ion-item>
  </ion-list>
</template>

<script>
import { IonItem, IonLabel, IonList, IonSkeletonText, IonThumbnail } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'MapSkeleton',
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
ion-thumbnail {
  --border-radius: 50%;
}
</style>

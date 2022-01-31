<template>
  <ion-list id="skeleton">
    <ion-list-header>
      <ion-skeleton-text animated style="width: 80px"></ion-skeleton-text>
    </ion-list-header>
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
import { IonItem, IonLabel, IonList, IonListHeader, IonSkeletonText, IonThumbnail } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'Skeleton',
  components: {
    IonItem,
    IonLabel,
    IonList,
    IonListHeader,
    IonSkeletonText,
    IonThumbnail
  },
  props: {
    count: Number
  }
});
</script>
<style scoped lang="scss"></style>

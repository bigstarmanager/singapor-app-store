<template>
  <ion-grid class="pa-0 order-content skeleton">
    <ion-row class="order-no" align-items-center>
      <ion-col size="6" offset="3" class="order-number">
        <ion-skeleton-text animated></ion-skeleton-text>
      </ion-col>
    </ion-row>
    <ion-row class="pa-0 location">
      <ion-col class="pa-0" align-self-center>
        <ion-row class="alias-name" justify-content-center align-items-center>
          <ion-col class="pa-0 hub_alias_name">
            <ion-skeleton-text animated style="width: 80%; margin: 0 auto"></ion-skeleton-text>
          </ion-col>
        </ion-row>
        <ion-row class="address">
          <ion-col class="pa-0">
            <ion-skeleton-text animated style="width: 60%; margin: 0 auto"></ion-skeleton-text>
          </ion-col>
        </ion-row>
      </ion-col>
    </ion-row>

    <ion-row class="package-header">
      <ion-col class="package-no pa-0" size="12">
        <div class="text"><ion-skeleton-text animated style="width: 80%"></ion-skeleton-text></div>
        <div><ion-skeleton-text animated style="width: 40%"></ion-skeleton-text></div>
      </ion-col>
    </ion-row>

    <ion-list class="item-list">
      <ion-item lines="none">
        <ion-grid class="pre-order pa-0">
          <ion-thumbnail class="product-image">
            <ion-skeleton-text></ion-skeleton-text>
          </ion-thumbnail>
          <ion-row class="product-info">
            <div class="product-name">
              <ion-skeleton-text animated style="width: 80%"></ion-skeleton-text>
            </div>
            <ion-label class="amount"
              ><ion-skeleton-text animated style="width: 20px"></ion-skeleton-text
            ></ion-label>
            <ion-label class="price"
              ><ion-skeleton-text animated style="width: 30px"></ion-skeleton-text
            ></ion-label>
          </ion-row>
        </ion-grid>
      </ion-item>
    </ion-list>
  </ion-grid>
</template>

<script>
import {
  IonList,
  IonItem,
  IonLabel,
  IonGrid,
  IonThumbnail,
  IonSkeletonText,
  IonRow,
  IonCol
} from '@ionic/vue';
export default {
  name: 'SkeletonOrderItem',
  components: { IonList, IonItem, IonThumbnail, IonSkeletonText, IonGrid, IonRow, IonCol, IonLabel },
  setup() {
    return {};
  }
};
</script>

<style scoped lang="scss">
@import 'orderitem.module';
</style>

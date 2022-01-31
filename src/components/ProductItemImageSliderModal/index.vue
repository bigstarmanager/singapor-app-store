<template>
  <ion-header>
    <ion-toolbar class="imageModal">
      <ion-icon @click="goBack()" slot="start" :src="arrowBackOutline" class="backBtn"></ion-icon>
    </ion-toolbar>
  </ion-header>
  <ion-content class="productImageList">
    <ion-slides pager="true" :options="slideOpts" v-if="skus.length > 1">
      <ion-slide v-for="(sku, index) in skus" v-bind:key="index">
        <ProductItemImage :producItemImage="sku" />
      </ion-slide>
    </ion-slides>
    <ProductItemImage v-else :producItemImage="skus[0]" />
  </ion-content>
</template>

<script>
import { IonSlides, IonSlide, modalController, IonIcon, IonHeader, IonContent, IonToolbar } from '@ionic/vue';
import ProductItemImage from '../ProductItemImage';
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';
import { arrowBackOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'ProductItemImageSliderModal',
  components: { IonSlides, IonSlide, ProductItemImage, IonIcon, IonHeader, IonContent, IonToolbar },
  setup() {
    const slideOpts = {
      initialSlide: 0,
      speed: 400,
      slidesPerView: 1
    };
    const store = useStore();
    const skus = computed(() => {
      const productItem = store.getters['b2c/getProduct'];
      return productItem.skus ? productItem.skus : [];
    });
    return {
      slideOpts,
      skus,
      arrowBackOutline
    };
  },
  methods: {
    goBack() {
      modalController.dismiss();
    }
  }
});
</script>

<style scoped lang="scss">
@import 'product.item.image.slider.modal.module';
</style>

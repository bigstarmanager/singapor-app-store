<template>
  <div class="productImageList">
    <!-- <ion-slides pager="true" :options="slideOpts" v-if="skus.length > 1">
      <ion-slide v-for="(sku, index) in skus" v-bind:key="index">
        <ProductItemImage :producItemImage="sku" />
      </ion-slide>
    </ion-slides>
    <ProductItemImage v-else :producItemImage="skus[0]" /> -->
    <ProductItemImage :producItemImage="product" />
  </div>
</template>

<script>
// import { IonSlides, IonSlide } from '@ionic/vue';
import ProductItemImage from '../ProductItemImage';
import { defineComponent, computed } from 'vue';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'ProductItemImageSlider',
  components: { /* IonSlides, IonSlide, */ ProductItemImage },
  setup() {
    const slideOpts = {
      initialSlide: 0,
      speed: 400,
      slidesPerView: 1
    };
    const store = useStore();
    // const skus = computed(() => {
    //   const productItem = store.getters['b2c/getProduct'];
    //   console.log(JSON.stringify(productItem))
    //   return productItem.skus ? productItem.skus : [];
    // });
    const product = computed(() => {
      return store.getters['b2c/getProduct'];
    });
    return {
      slideOpts,
      // skus,
      product
    };
  }
});
</script>

<style scoped lang="scss">
@import 'product.item.image.slider.module';
</style>

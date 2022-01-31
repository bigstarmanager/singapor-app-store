<template>
  <section @click="gotoProductDetail(sku.product_id)">
    <ion-skeleton-text animated class="product-image preLoading" v-show="loadingImg"></ion-skeleton-text>
    <ion-img
      :src="imageData"
      @ionError="errorIMG"
      @ionImgDidLoad="loadingImg = false"
      :style="{ opacity: loadingImg ? 0 : 1 }"
      class="product-image"
    />
  </section>
</template>

<script>
import { IonImg, IonSkeletonText } from '@ionic/vue';
import { getImage, noImage } from '../../utils/getImage';
import { useRouter } from 'vue-router';
import { ref } from 'vue';

export default {
  name: 'OrderItemImage',
  components: { IonImg, IonSkeletonText },
  props: ['sku'],
  setup(props) {
    const router = useRouter();
    const imageData = ref(undefined);

    getImage(props.sku.product?.image ? `${props.sku.product.image}.png` : null, 'products').then((obj) => {
      imageData.value = obj;
    });

    return {
      imageData,
      router
    };
  },

  data() {
    return {
      loadingImg: true
    };
  },

  methods: {
    errorIMG(event) {
      event.target.src = noImage;
    },
    gotoProductDetail(product_id) {
      this.router.push({ name: 'product-detail', params: { product_id: product_id } });
    }
  }
};
</script>

<style scoped lang="scss">
@import 'orderitem.module';
</style>

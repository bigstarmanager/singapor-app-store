<template>
  <div class="productImageItem">
    <ion-skeleton-text animated class="preLoading" v-show="loadingImg"></ion-skeleton-text>
    <ion-img
      :src="imageData"
      @ionError="errorIMG"
      @ionImgDidLoad="loadingImg = false"
      :style="{ opacity: loadingImg ? 0 : 1 }"
    />
  </div>
</template>

<script>
import { IonImg, IonSkeletonText } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { getImage, noImage } from '../../utils/getImage';

export default defineComponent({
  name: 'ProductItemImage',
  props: ['producItemImage'],
  components: { IonImg, IonSkeletonText },
  data() {
    return {
      loadingImg: true
    };
  },
  setup(props) {
    const imageData = ref(undefined);

    getImage(props.producItemImage.image ? `${props.producItemImage.image}.png` : null, 'products').then(
      (obj) => {
        imageData.value = obj;
      }
    );

    return {
      imageData
    };
  },
  methods: {
    errorIMG(event) {
      event.target.src = noImage;
    }
  }
});
</script>

<style scoped lang="scss">
@import 'product.item.image.module';
</style>

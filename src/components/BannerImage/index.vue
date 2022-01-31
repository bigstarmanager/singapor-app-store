<template>
  <ion-skeleton-text animated class="product-image preLoading" v-show="loadingImg"></ion-skeleton-text>
  <ion-img
    :src="imageData"
    @ionError="errorIMG"
    @ionImgDidLoad="loadingImg = false"
    :style="{ opacity: loadingImg ? 0 : 1 }"
  />
</template>

<script>
import { IonImg, IonSkeletonText } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { getImage } from '../../utils/getImage';

export default defineComponent({
  name: 'BannerItem',
  props: ['banner'],
  components: { IonImg, IonSkeletonText },
  setup(props) {
    const imageData = ref(undefined);
    const imageName = `${props.banner.image[0]?.hash}${props.banner.image[0]?.ext}`;
    getImage(imageName, 'uploads', process.env.VUE_APP_STRAPI_IMAGE_URL).then((obj) => {
      imageData.value = obj;
    });

    return {
      imageData
    };
  },
  data() {
    return {
      loadingImg: true
    };
  },
  methods: {
    errorIMG(event) {
      event.target.src = '/assets/images/no_image_banner.png';
    }
  }
});
</script>

<style scoped lang="scss">
ion-img {
  width: 100%;
}
ion-skeleton-text {
  position: absolute;
  margin: 0 auto;
  width: 100%;
}
</style>

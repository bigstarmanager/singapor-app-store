<template>
  <div class="category-item">
    <div class="category ion-activatable" :style="{ background: category.background }">
      <ion-ripple-effect></ion-ripple-effect>
      <ion-skeleton-text name="crescent" class="preLoading" v-show="loadingImg"></ion-skeleton-text>
      <ion-img
        class="image"
        :src="'assets/images/category_image/' + category.image"
        @ionError="errorIMG"
        @ionImgDidLoad="loadingImg = false"
        :style="{ opacity: loadingImg ? 0 : 1 }"
      ></ion-img>
      <span class="category-name">{{ category.name }}</span>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { IonImg, IonSkeletonText, IonRippleEffect } from '@ionic/vue';
import { getImage } from '../../utils/getImage';

export default defineComponent({
  name: 'CategoryPageItem',
  props: ['category'],
  components: { IonImg, IonSkeletonText, IonRippleEffect },
  setup() {
    return {
      getImage
    };
  },
  data() {
    return {
      imageData: null,
      loadingImg: true
    };
  },
  methods: {
    errorIMG(event) {
      event.target.src = '/assets/images/no_image.png';
    },
    showImage(imageName) {
      //image name and image path
      getImage(imageName, 'category-images/new').then((obj) => {
        this.imageData = obj;
      });
      return this.imageData;
    }
  }
});
</script>

<style scoped lang="scss">
@import 'category.page.item.module';
</style>

<template>
  <div class="category-item" :class="selected ? 'selected_category' : ''">
    <div class="icon">
      <ion-skeleton-text animated class="preLoading" v-show="loadingImg"></ion-skeleton-text>
      <ion-img
        :src="'assets/images/category_icons/' + category.name + '.svg'"
        @ionImgDidLoad="loadingImg = false"
        :style="{ opacity: loadingImg ? 0 : 1 }"
        @ionError="errorIMG"
      ></ion-img>
    </div>
    <div class="title">{{ category.name }}</div>
  </div>
</template>

<script>
import { IonImg, IonSkeletonText } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'CategoryItem',
  props: ['category', 'selected'],
  components: { IonImg, IonSkeletonText },
  data() {
    return {
      imageData: null,
      loadingImg: true
    };
  },
  methods: {
    errorIMG(event) {
      event.target.src = '/assets/images/no_image.png';
    }
  }
});
</script>

<style scoped lang="scss">
@import 'category.module';
</style>

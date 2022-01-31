<template>
  <ion-skeleton-text animated class="supplier-logo preLoading" v-show="loadingImg"></ion-skeleton-text>
  <ion-img
    :src="imageData"
    class="supplier-logo"
    @ionError="errorIMG"
    @ionImgDidLoad="loadingImg = false"
    :style="{ opacity: loadingImg ? 0 : 1 }"
  />
</template>

<script>
import { defineComponent, ref } from 'vue';
import { IonImg, IonSkeletonText } from '@ionic/vue';
import { getImage, noImage } from '../../../utils/getImage';

export default defineComponent({
  name: 'SupplierImg',
  components: { IonImg, IonSkeletonText },
  props: ['supplierLogo'],
  setup(props) {
    const imageData = ref(undefined);
    getImage(props.supplierLogo || null, 'supplier-logos').then((obj) => {
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
      event.target.src = noImage;
    }
  }
});
</script>

<style scoped lang="scss">
.supplier-logo {
  height: 12.077vw;
  width: 12.077vw;
  margin-right: 5.797vw;
}
.preLoading {
  position: absolute;
}
</style>

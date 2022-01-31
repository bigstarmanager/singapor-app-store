<template>
  <div class="supplier-item">
    <ion-skeleton-text animated class="preLoading supplier-logo" v-show="loadingImg"></ion-skeleton-text>
    <ion-img
      class="supplier-logo"
      :src="imageData"
      @ionError="errorIMG"
      @ionImgDidLoad="loadingImg = false"
      :style="{ opacity: loadingImg ? 0 : 1 }"
    />
    <div class="supplier_text">
      <span class="supplier_name">{{ supplier.tenant.name }}</span>
    </div>
  </div>
</template>

<script>
import { IonImg, IonSkeletonText } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { getImage, noImage } from '../../utils/getImage';

export default defineComponent({
  name: 'SupplierItem',
  props: ['supplier'],
  components: { IonImg, IonSkeletonText },
  setup(props) {
    const imageData = ref(undefined);
    getImage(props.supplier?.logo || null, 'supplier-logos').then((obj) => {
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
@import 'supplier.module';
</style>

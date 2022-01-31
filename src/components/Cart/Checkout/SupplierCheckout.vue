<template>
  <ion-item class="supplier">
    <ion-img src="/assets/images/store-icon.svg"></ion-img>
    <ion-label class="margin-between-icons-2"
      ><strong>{{ cartItem.supplier.tenant.name }}</strong></ion-label
    >
  </ion-item>
  <product-checkout v-for="product in products" :key="product.id" :product="product"> </product-checkout>
</template>

<script>
import { getProductsTaxedPrice } from '@/services/shared/helper/cart';
import { IonImg, IonItem, IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';
import ProductCheckout from './ProductCheckout.vue';

export default defineComponent({
  name: 'SupplierCheckout',
  components: { IonImg, IonItem, IonLabel, ProductCheckout },
  props: {
    products: Array,
    cartItem: Object
  },
  setup() {
    return {};
  },
  computed: {
    totalPriceDisplay() {
      return this.getTotalPrice().toFixed(2);
    }
  },
  methods: {
    getTotalPrice() {
      return getProductsTaxedPrice(this.products);
    }
  }
});
</script>

<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'SupplierCheckout.scss';
</style>

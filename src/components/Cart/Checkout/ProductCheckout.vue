<template>
  <ion-item class="product">
    <ion-img @ionError="setImageDefault($event)" :src="imageSrc"></ion-img>
    <ion-grid class="product description ion-no-padding">
      <ion-row>
        <ion-col class="ion-no-padding name" size="12"
          ><div>{{ product.item.sku.name }}</div></ion-col
        >
        <ion-col class="ion-no-padding" size="12"
          ><div v-if="product.item.sku.is_b2c_pooling" class="pooling">
            <ion-img src="/assets/images/cart-pooling.svg"></ion-img>
            <span>{{ product.item.sku.b2c_pooling_qty }}</span>
          </div></ion-col
        >
        <ion-col class="ion-no-padding price ion-align-self-end" size="10"
          >{{ `${user?.country?.currency_symbol}${taxedPrice.toFixed(2)}` }} /
          {{ product.item.sku.b2c_uom.name }}</ion-col
        >
        <ion-col class="ion-no-padding quantity ion-align-self-end ion-text-right" size="2"
          >x{{ product.item.order_quantity }}</ion-col
        >
      </ion-row>
    </ion-grid>
  </ion-item>
</template>

<script>
import { getTaxedPrice } from '@/services/shared/helper/cart';
import { getImage, noImage } from '@/utils/getImage';
import { IonImg, IonItem, IonGrid, IonRow, IonCol } from '@ionic/vue';
import { defineComponent, inject, ref } from 'vue';

export default defineComponent({
  name: 'ProductCheckout',
  components: { IonImg, IonItem, IonGrid, IonRow, IonCol },
  props: {
    product: Object
  },
  data() {
    return {
      user: null
    };
  },
  async created() {
    this.user = inject('$storage')
      .getUser()
      .then((res) => {
        this.user = res;
      });
  },
  setup(props) {
    const imageSrc = ref();

    if (props.product) {
      getImage(`${props.product.item.sku.product.image}.png`, 'products').then((data) => {
        imageSrc.value = data;
      });
    }

    return {
      imageSrc
    };
  },
  computed: {
    taxedPrice() {
      return getTaxedPrice(this.product);
    }
  },
  methods: {
    setImageDefault(event) {
      event.target.src = noImage;
    }
  }
});
</script>

<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'ProductCheckout.scss';
</style>

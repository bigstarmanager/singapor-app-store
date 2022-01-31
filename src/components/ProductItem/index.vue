<template>
  <div class="ion-activatable ripple-parent" :class="checkAvailableInStock() ? '' : 'out_of_stock'">
    <ion-ripple-effect></ion-ripple-effect>
    <div class="volume-deal" v-if="containVolumeDeal">
      <span>+{{ $t('volume_deal_s') }}!</span>
    </div>
    <div class="bg-white wrapper" @click="openProductDetail()">
      <div
        class="product-image header row justify-between"
        :class="checkAvailableInStock() ? '' : 'out_of_stock'"
      >
        <ion-skeleton-text animated class="image preLoading" v-show="loadingImg"></ion-skeleton-text>
        <ion-img
          class="image"
          :src="imageData"
          @ionImgDidLoad="loadingImg = false"
          :style="{ opacity: loadingImg ? 0 : checkAvailableInStock() ? 1 : 0.6 }"
          @ionError="errorIMG"
        ></ion-img>
        <div class="top-badge" v-if="product.top_rank && product.top_rank < 4">
          <ion-img class="top_badgeimage" :src="topBadgeIMG" />
          <div class="crown-badge" v-if="product.top_rank && product.top_rank === 1">
            <ion-img class="crownimage" :src="crownIMG" />
          </div>
          <div class="rank-badge" v-if="product.top_rank && product.top_rank < 4 && product.top_rank > 1">
            <span>{{ product.top_rank }}</span>
          </div>
        </div>
        <div class="other-rank-badge" v-if="product.top_rank && product.top_rank > 3">
          <span>{{ $t('top') }}</span>
        </div>
        <div class="discount" v-if="product.discount && product.discount !== 0">
          <span>{{ `${product.discount.toFixed(0)}% OFF` }}</span>
        </div>
        <div class="halal" v-if="product.skus[0].halal">
          <span>{{ $t('halal') }}</span>
        </div>
        <ion-img
          v-if="product.skus[0].is_b2c_pooling"
          class="pooling-badge"
          :src="checkAvailableInStock() ? poolingIMG : poolingOutIMG"
        />
      </div>
      <div class="product-info">
        <div class="product-title-container">
          <div class="title">
            <span class="ellipsis-2-lines">{{ product.name }}</span>
          </div>
          <div class="supplier">
            <span class="ellipsis-2-lines">{{ product.supplier }}</span>
          </div>
        </div>
        <div class="marketPrice" v-show="checkAvailableInStock()">
          <span class="ellipsis-2-lines">
            {{ getMarketPrice() }}
          </span>
        </div>
        <div class="price" v-show="checkAvailableInStock()">
          <span>
            {{ getPrice() }}
          </span>
        </div>
        <div class="out_price" v-if="!checkAvailableInStock()">
          <span>
            {{ $t('out_of_stock') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent, inject, ref } from 'vue';
import { IonImg, IonSkeletonText, IonRippleEffect } from '@ionic/vue';
import { getImage, noImage } from '../../utils/getImage';
import { useRouter } from 'vue-router';
import poolingIMG from '@/assets/icons/shared/product_pooling.svg';
import poolingOutIMG from '@/assets/icons/shared/product_pooling_out.svg';
import topBadgeIMG from '@/assets/images/top_badge.png';
import crownIMG from '@/assets/images/crown.png';

export default defineComponent({
  name: 'ProductItem',
  components: { IonImg, IonSkeletonText, IonRippleEffect },
  props: ['product'],

  async setup(props) {
    const router = useRouter();
    let loadingImg = ref(true);
    const imageData = ref(undefined);
    const storage = inject('$storage');
    const containVolumeDeal = ref(false);
    const checkAvailableInStock = () => {
      let isAvailable = false;
      props.product.skus.map((s) => {
        s.inventories.map((i) => {
          if (i.quantity === -1 || i.quantity > 0) isAvailable = true;
        });
      });
      return isAvailable;
    };

    const openProductDetail = () => {
      if (props.product) {
        router.push({ name: 'product-detail', params: { product_id: props.product.id } });
      }
    };

    getImage(`${props.product.image}.png`, 'products').then((obj) => {
      imageData.value = obj;
    });

    const skuWithVolumeDeal = props.product.skus.find((v) => v.sku_deals && v.sku_deals.length);
    containVolumeDeal.value = skuWithVolumeDeal ? true : false;

    let currentUser = await storage.getUser();
    let getCurrentLocation = await storage.getCurrentLocation();
    return {
      checkAvailableInStock,
      imageData,
      containVolumeDeal,
      currencySymbol: currentUser?.id
        ? currentUser.country.currency_symbol
        : getCurrentLocation.country === 'Singapore'
        ? 'S$'
        : 'RM',
      currencyCode: currentUser?.id
        ? currentUser.country.currency_code
        : getCurrentLocation.country === 'Singapore'
        ? 'SGD'
        : 'MYR',
      openProductDetail,
      poolingIMG,
      poolingOutIMG,
      loadingImg,
      crownIMG,
      topBadgeIMG
    };
  },
  methods: {
    getMarketPrice() {
      if (this.product.min_market_price == null || this.product.max_market_price == null) {
        return '';
      }
      if (this.product.min_market_price == 0 || this.product.max_market_price == 0) {
        return ' ';
      }
      if (this.product.min_market_price === this.product.max_market_price) {
        return `${this.currencySymbol}${(
          this.product.min_market_price +
          this.product.min_market_price * (this.product.taxRateVal / 100)
        ).toFixed(2)}`;
      } else {
        return `${this.currencySymbol}${(
          this.product.min_market_price +
          this.product.min_market_price * (this.product.taxRateVal / 100)
        ).toFixed(2)}-${this.currencySymbol}${(
          this.product.max_market_price +
          this.product.max_market_price * (this.product.taxRateVal / 100)
        ).toFixed(2)}`;
      }
    },
    getPrice() {
      if (this.product.min_price === this.product.max_price) {
        return `${this.currencySymbol}${(
          this.product.min_price +
          this.product.min_price * (this.product.taxRateVal / 100)
        ).toFixed(2)}`;
      } else {
        return `${this.currencySymbol}${(
          this.product.min_price +
          this.product.min_price * (this.product.taxRateVal / 100)
        ).toFixed(2)}-${this.currencySymbol}${(
          this.product.max_price +
          this.product.max_price * (this.product.taxRateVal / 100)
        ).toFixed(2)}`;
      }
    },
    errorIMG(event) {
      event.target.src = noImage;
    }
  }
});
</script>

<style scoped lang="scss">
@import 'product.item.module';
</style>

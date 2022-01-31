<template>
  <ion-grid class="hot-deals">
    <div class="title">
      <span style="text-transform: uppercase">{{ $t('hot_deals') }}</span>
      <span role="button" class="see_more" @click="seeMore()">
        {{ $t('see_more') }}
      </span>
    </div>
    <ion-row class="product-list" v-if="hotDeals.length > 0">
      <ion-col v-for="item in hotDeals" v-bind:key="item.id" class="hotDeals_item relative-position">
        <ProductItem :product="item" />
      </ion-col>
    </ion-row>
    <ion-row class="skeleton_hotDeals" v-else>
      <ion-col v-for="index in 6" v-bind:key="index" class="hotDeals_item relative-position">
        <div class="bg-white wrapper relative-position">
          <div class="header row justify-between">
            <ion-thumbnail class="image" slot="start">
              <ion-skeleton-text></ion-skeleton-text>
            </ion-thumbnail>
          </div>
          <div>
            <ion-skeleton-text animated style="height: 4.6vw"></ion-skeleton-text>
            <ion-skeleton-text
              animated
              style="width: 70%; marign-top: 1.6vw; height: 4.6vw"
            ></ion-skeleton-text>
            <ion-skeleton-text
              animated
              style="width: 50%; margin-top: 1.6vw; height: 3.623vw"
            ></ion-skeleton-text>
            <ion-skeleton-text
              animated
              style="width: 60%; margin-top: 1.6vw; height: 4.831vw"
            ></ion-skeleton-text>
          </div>
        </div>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
import { useStore } from 'vuex';
import ProductItem from '../ProductItem/index';
import { defineComponent, computed } from 'vue';
import { IonCol, IonGrid, IonSkeletonText, IonThumbnail, IonRow } from '@ionic/vue';

export default defineComponent({
  name: 'HotDeals',
  components: {
    ProductItem,
    IonGrid,
    IonRow,
    IonSkeletonText,
    IonThumbnail,
    IonCol
  },
  setup() {
    const store = useStore();
    let hotDeals = computed(() => {
      let allProducts = store.getters['b2c/getAllProducts'];
      let hotDealsList = [];

      if (allProducts && allProducts.discounts) {
        allProducts.discounts.map((item) => {
          const prices = [];
          item.skus.forEach((sku) => prices.push(Number(sku.b2c_unit_price) * Number(sku.b2c_unit_per_oom)));
          const maxPrice = Math.max(...prices);
          const minPrice = Math.min(...prices);
          const market_prices = [];
          item.skus.forEach((sku) =>
            market_prices.push(Number(sku.b2c_market_unit_price) * Number(sku.b2c_unit_per_oom))
          );
          const maxMarketPrice = Math.max(...market_prices);
          const minMarketPrice = Math.min(...market_prices);

          let obj = {
            ...item,
            supplier: item.tenant.tenant.name,
            groupLength: item.skus !== null ? item.skus[0].is_b2c_pooling !== false : '',
            max_price: maxPrice,
            min_price: minPrice,
            halal: item.skus !== null ? item.skus[0].halal === true : '',
            max_market_price: maxMarketPrice,
            min_market_price: minMarketPrice,
            oumName: item.skus !== null ? item.skus[0].uom.name : '',
            pkt:
              item.skus !== null
                ? item.skus[0].b2c_unit_price +
                  item.skus[0].b2c_unit_price *
                    (item.skus[0].tax_rate > 0 ? item.skus[0].tax_rate : item.tenant.tax_rate / 100)
                : '',
            taxRateVal:
              item.skus !== null
                ? item.skus[0].tax_rate > 0
                  ? item.skus[0].tax_rate
                  : item.tenant.tax_rate
                : '',
            pktPrice: item.skus !== null ? item.skus[0].b2c_unit_per_oom : ''
          };
          hotDealsList.push(obj);
        });
      }
      return hotDealsList;
    });

    return {
      hotDeals
    };
  },
  methods: {
    seeMore() {
      this.$router.push('HotDeals');
    }
  }
});
</script>

<style scoped lang="scss">
@import 'hotdeals.module';
</style>

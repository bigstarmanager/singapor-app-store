<template>
  <div class="supplier-product-list" :class="!visibility ? 'subCat_content_sticky' : ''">
    <div class="category" v-if="!isLoading">
      <span class="category-header">{{ selectedCategories.toUpperCase() }}</span>
      <span v-if="selectedCategories" class="more" @click="gotoCategory()">{{ $t('see_more') }}</span>
    </div>
    <div v-if="!isLoading">
      <div v-if="filteredProducts.length > 0">
        <ion-grid class="product-list">
          <ion-row>
            <ion-col size="6" v-for="item in filteredProducts" v-bind:key="item.id">
              <div class="supplier_product">
                <ProductItem :product="item" />
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
        <div class="divider" />
        <div @click="gotoCategory()" class="browse-more">
          {{ $t('browse_more') }} {{ selectedCategories }}
          <ion-img :src="leftCircleArrow" />
        </div>
      </div>
      <div v-else class="noProduct">
        <ion-img :src="no_subcategory" />
        <ion-label> {{ $t('no_supcategory') }} </ion-label>
        <ion-label> {{ $t('no_subcategory2') }} </ion-label>
      </div>
    </div>
    <ion-grid v-else class="skeleton_list">
      <ion-row class="product_list">
        <ion-col v-for="index in 4" v-bind:key="index" class="skeleton_item">
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
  </div>
</template>

<script>
import { useStore } from 'vuex';
import { IonGrid, IonRow, IonCol, IonThumbnail, IonSkeletonText, IonImg, IonLabel } from '@ionic/vue';
import { chevronForwardCircle } from 'ionicons/icons';
import { ref, defineComponent, inject, computed, watch } from 'vue';
import ProductItem from '../ProductItem';
import { products } from '../../services/shared/graphql/products';
import { useMutation } from '@vue/apollo-composable';
import no_subcategory from '@/assets/images/no_subcategory.svg';
import leftCircleArrow from '@/assets/icons/shared/left-circle-arrow.svg';
import Branch from '@/services/shared/helper/branch';

export default defineComponent({
  name: 'SupplierSearchProductList',
  components: {
    ProductItem,
    IonGrid,
    IonRow,
    IonCol,
    IonThumbnail,
    IonSkeletonText,
    IonImg,
    IonLabel
  },
  data: () => ({
    scrollTop: null,
    isScrollTop: false
  }),
  props: ['id', 'visibility', 'categories', 'supplier_id'],
  async setup(props) {
    const storage = inject('$storage');
    const isDisabled = ref(false);
    let selectedCategories = ref('');
    const store = useStore();
    let isLoading = ref(true);
    const { mutate: getProducts } = useMutation(products);
    let filteredProducts = ref([]);

    const selectedHub = computed(() => {
      return store.getters['b2c/getSelectedHub'];
    });

    watch(
      () => props.id,
      (val) => {
        if (val != null && val >= 0) {
          filteredProducts.value = [];
          updateItem();
        }
      }
    );

    const currentUser = await storage.getUser();
    const selectedState = await storage.getSelectedState();
    const updateItem = async () => {
      if (props.categories.length == 0) {
        isLoading.value = false;
        return;
      }
      selectedCategories.value = props.categories[props.id].name;
      isLoading.value = true;

      getProducts({
        active: true,
        mainCategory: props.categories[props.id].id,
        tenantCustomerId: Number.parseInt(props.supplier_id),
        hubId: selectedHub.value?.id || undefined,
        page: 1,
        perPage: 4,
        state: currentUser.country.id === 127 ? selectedState.state : undefined
      }).then((res) => {
        res.data.products.map((item) => {
          const prices = [];
          const market_prices = [];
          item.skus.forEach((sku) => {
            prices.push(Number(sku.b2c_unit_price) * Number(sku.b2c_unit_per_oom));
            market_prices.push(Number(sku.b2c_market_unit_price) * Number(sku.b2c_unit_per_oom));
          });
          const maxPrice = Math.max(...prices);
          const minPrice = Math.min(...prices);
          const maxMarketPrice = Math.max(...market_prices);
          const minMarketPrice = Math.min(...market_prices);
          let obj = {
            ...item,
            supplier: item.tenant.tenant.name,
            groupLength: item.skus !== null ? item.skus[0].is_b2c_pooling !== false : '',
            max_price: maxPrice,
            min_price: minPrice,
            discount:
              item.skus !== null
                ? item.skus[0].b2c_market_unit_price > item.skus[0].b2c_unit_price
                  ? ((item.skus[0].b2c_market_unit_price - item.skus[0].b2c_unit_price) /
                      item.skus[0].b2c_market_unit_price) *
                    100
                  : 0
                : '',
            max_market_price: maxMarketPrice,
            min_market_price: minMarketPrice,
            oumName: item.skus !== null ? item.skus[0].oom.name : '',
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
          filteredProducts.value.push(obj);
        });
        isLoading.value = false;
        isDisabled.value = res.data.products.length ? false : true;

        Branch.trackViewItems('', props.categories[props.id].name);
      });
    };

    return {
      selectedCategories,
      updateItem,
      filteredProducts,
      leftCircleArrow,
      no_subcategory,
      isLoading,
      isDisabled,
      chevronForwardCircle
    };
  },

  methods: {
    gotoCategory() {
      this.$store.dispatch('b2c/setSelectedMainCatID', { id: this.id });
      this.$store.dispatch('b2c/setCategories', { allCategories: this.categories });
      this.$router.push({
        name: 'Category_Product',
        params: {
          availbleSupplier: 'true',
          supplier_id: this.supplier_id
        }
      });
    }
  }
});
</script>

<style scoped lang="scss">
@import 'category.product.list.module';
</style>

<template>
  <div class="subCategory_content" :class="!visibility ? 'subCategory_sticky' : ''">
    <div class="subCategory_list">
      <div class="subCategory_slide" v-if="subCategories.length > 0">
        <div
          :class="`subCategory_slide_item ${selected_subCategory == -1 ? 'selected' : ''}`"
          @click="updateItem(-1)"
        >
          <span class="subCategory_slide_title">{{ $t('all') }}</span>
        </div>
        <div
          v-for="(item, index) in subCategories"
          v-bind:key="item.id"
          :class="`subCategory_slide_item ${selected_subCategory == index ? 'selected' : ''}`"
          @click="updateItem(index)"
        >
          <span class="subCategory_slide_title">{{ item.name }}</span>
        </div>
      </div>
      <div class="subCategory_slide" v-else>
        <div v-for="index in 5" v-bind:key="index">
          <ion-skeleton-text animated class="skeleton-subcategory"></ion-skeleton-text>
        </div>
      </div>
    </div>
    <ion-grid class="subProduct_list" v-if="filteredProducts.length > 0">
      <ion-row>
        <ion-col size="6" v-for="item in filteredProducts" v-bind:key="item.id">
          <div class="product_item">
            <ProductItem :product="item" />
          </div>
        </ion-col>
      </ion-row>
    </ion-grid>
    <ion-grid class="subProduct_list" v-if="filteredProducts.length == 0 && !skeleton_flag">
      <ion-row class="noSubcategory">
        <ion-img :src="no_subcategory" />
        <ion-label> {{ $t('no_subcategory1') }} </ion-label>
        <ion-label> {{ $t('no_subcategory2') }} </ion-label>
      </ion-row>
    </ion-grid>

    <ion-grid class="skeleton_list" v-show="skeleton_flag">
      <ion-row class="product_list">
        <ion-col v-for="index in product_per_page" v-bind:key="index" class="skeleton_item">
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
    <ion-grid v-if="filteredProducts.length > 0">
      <ion-infinite-scroll
        @ionInfinite="loadData($event)"
        threshold="10px"
        id="infinite-scroll"
        :disabled="isDisabled"
      >
        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-grid>
  </div>
</template>

<script>
import {
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonThumbnail,
  IonSkeletonText,
  IonRow,
  IonCol,
  IonLabel,
  IonImg,
  IonGrid,
  onIonViewWillEnter
} from '@ionic/vue';
import { useStore } from 'vuex';
import { ref, defineComponent, inject, watch } from 'vue';
import ProductItem from '../ProductItem/index';
import { products } from '../../services/shared/graphql/products';
import { useMutation } from '@vue/apollo-composable';
import no_subcategory from '@/assets/images/no_subcategory.svg';
import Branch from '@/services/shared/helper/branch';

export default defineComponent({
  name: 'CategoryProductList',
  components: {
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonThumbnail,
    IonRow,
    IonCol,
    IonGrid,
    IonSkeletonText,
    IonLabel,
    IonImg,
    ProductItem
  },
  data: () => ({
    scrollTop: null,
    isScrollTop: false
  }),
  props: ['id', 'visibility', 'supplierId', 'availbleSupplier', 'categories'],
  async setup(props) {
    const isDisabled = ref(false);
    const store = useStore();
    const storage = inject('$storage');
    const selectedHub = ref(store.getters['b2c/getSelectedHub']);
    const { mutate: getProducts } = useMutation(products);
    let getCurrentLocation = null;
    let selectedState = null;
    let user = null;
    let filteredProducts = ref([]);
    let subCategories = ref([]);
    let skeleton_flag = ref(true);
    let page_num = 1;
    let product_per_page = 6;
    const update_flag = ref(false);
    let selected_subCategory = ref(-1);

    watch(
      () => store.getters['b2c/getSelectedHub'],
      (val) => {
        selectedHub.value = val;
        filteredProducts.value = [];
        page_num = 1;
        updateItem(selected_subCategory.value);
      }
    );
    watch(
      () => props.id,
      () => {
        document.querySelector('div.subCategory_slide').scrollLeft = 0;
      }
    );
    watch(
      () => props.categories,
      () => {
        skeleton_flag.value = true;
      }
    );

    onIonViewWillEnter(() => {
      skeleton_flag.value = true;
    });

    const updateItem = async (index) => {
      if (getCurrentLocation === null) getCurrentLocation = await storage.getCurrentLocation();
      if (selectedState === null) selectedState = await storage.getSelectedState();
      if (user === null) user = await storage.getUser();
      skeleton_flag.value = true;
      let productsList = [];
      subCategories = props.categories[props.id].subCategory;
      filteredProducts.value = selected_subCategory.value == index ? filteredProducts.value : [];
      page_num = selected_subCategory.value == index ? page_num : 1;
      filteredProducts.value = !update_flag.value ? filteredProducts.value : [];
      page_num = !update_flag.value ? page_num : 1;
      update_flag.value = update_flag.value ? false : false;
      selected_subCategory.value = index;
      if (selected_subCategory.value == -1) {
        getProducts({
          active: true,
          mainCategory: props.categories[props.id].id,
          page: page_num,
          perPage: product_per_page,
          tenantCustomerId: props.availbleSupplier === 'true' ? Number(props.supplierId) : undefined,
          hubId: user?.id ? selectedHub.value?.id || undefined : undefined,
          state: user?.id
            ? user.country.description === 'Malaysia'
              ? selectedState.state
              : undefined
            : getCurrentLocation.country === 'Malaysia'
            ? selectedState.state
            : undefined,
          country: user?.id ? undefined : getCurrentLocation.country
        }).then((res) => {
          res.data.products.map((item) => {
            productsList.push(item);
          });
          productsList.map((item) => {
            const prices = [];
            item.skus.forEach((sku) =>
              prices.push(Number(sku.b2c_unit_price) * Number(sku.b2c_unit_per_oom))
            );
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
          isDisabled.value = res.data.products.length < product_per_page ? true : false;
          skeleton_flag.value = false;

          if (page_num === 1) {
            Branch.trackViewItems('', props.categories[props.id].name);
          }
        });
      } else {
        getProducts({
          active: true,
          mainCategory: props.categories[props.id].id,
          subCategory: subCategories[selected_subCategory.value]
            ? subCategories[selected_subCategory.value].id
            : 0,
          page: page_num,
          perPage: product_per_page,
          tenantCustomerId: props.availbleSupplier === 'true' ? Number(props.supplierId) : undefined,
          hubId: user?.id ? selectedHub.value?.id || undefined : undefined,
          state: user?.id
            ? user.country.description === 'Malaysia'
              ? selectedState.state
              : undefined
            : getCurrentLocation.country === 'Malaysia'
            ? selectedState.state
            : undefined,
          country: user?.id ? undefined : getCurrentLocation.country
        }).then((res) => {
          res.data.products.map((item) => {
            productsList.push(item);
          });

          productsList.map((item) => {
            const prices = [];
            item.skus.forEach((sku) =>
              prices.push(Number(sku.b2c_unit_price) * Number(sku.b2c_unit_per_oom))
            );
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
          isDisabled.value = res.data.products.length < product_per_page ? true : false;
          skeleton_flag.value = false;

          if (page_num === 1) {
            Branch.trackViewItems('', props.categories[props.id].name);
          }
        });
      }
    };

    if (props.categories.length > 0) {
      skeleton_flag.value = true;
      updateItem(-1);
    }
    const loadData = (ev) => {
      setTimeout(() => {
        page_num++;
        updateItem(selected_subCategory.value);
        ev.target.complete();
        skeleton_flag.value = true;
      }, 500);
    };

    return {
      subCategories,
      product_per_page,
      updateItem,
      filteredProducts,
      selected_subCategory,
      page_num,
      update_flag,
      no_subcategory,
      skeleton_flag,
      loadData,
      isDisabled
    };
  },
  beforeUpdate() {
    if (this.categories.length > 0) {
      if (this.subCategories !== this.categories[this.id].subCategory) {
        this.subCategories = this.categories[this.id].subCategory;
        this.selected_subCategory = 0;
        this.update_flag = true;
        this.filteredProducts = [];
        this.updateItem(-1);
      }
    }
  }
});
</script>

<style scoped lang="scss">
@import 'category.product.list.module';
</style>

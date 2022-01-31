<template>
  <div class="home-categories" :class="!sticky_home_category ? 'sticky_home_category' : ''">
    <div class="home-category-list sticky-category" v-if="categories && categories.length > 0">
      <div
        v-for="(item, index) in categories"
        v-bind:key="item.id"
        :class="`category-item ${selectedItem && item.id === selectedItem.id ? 'selected' : ''}`"
        @click="scrollToSelectedItem(index)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="home-category-list" v-else>
      <div v-for="index in 10" v-bind:key="index" class="category-item">
        <ion-skeleton-text animated class="skeleton-category"></ion-skeleton-text>
      </div>
    </div>

    <div v-if="categories && data.filteredProducts && data.filteredProducts.length > 0">
      <div v-for="(categoryProduct, index) in data.filteredProducts" v-bind:key="index">
        <ion-grid
          class="home_category"
          :class="index != 0 ? 'noPadding' : ''"
          :id="'categoryProduct-' + index"
        >
          <div class="title">
            <span v-bind:id="categories[index].name" style="text-transform: uppercase">{{
              categories[index].name
            }}</span>
            <span role="button" class="see_more" @click="gotoCategory(index)">
              {{ $t('see_more') }}
            </span>
          </div>
          <ion-row class="product-list">
            <ion-col
              v-for="item in categoryProduct"
              v-bind:key="item.id"
              class="product_item relative-position"
            >
              <ProductItem :product="item" />
            </ion-col>
          </ion-row>

          <div class="divider" />
          <div class="browse-more" @click="gotoCategory(index)">
            {{ $t('browse_more') }}{{ categories[index].name }}
            <ion-img :src="leftCircleArrow" />
          </div>
        </ion-grid>
      </div>
      <ion-infinite-scroll
        @ionInfinite="loadData($event)"
        threshold="10px"
        id="infinite-scroll"
        :disabled="isDisabled"
      >
        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </div>

    <ion-grid class="skeleton_list" v-show="isLoading">
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
import { ref, reactive, defineComponent, inject, watch } from 'vue';
import ProductItem from '../ProductItem/index';
import {
  IonImg,
  IonRow,
  IonThumbnail,
  IonSkeletonText,
  IonGrid,
  IonCol,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/vue';
import { products } from '../../services/shared/graphql/products';
import { isInViewport } from '../../services/shared/helper/helper';
import { useMutation } from '@vue/apollo-composable';
import leftCircleArrow from '@/assets/icons/shared/left-circle-arrow.svg';

export default defineComponent({
  name: 'HomeCategory',
  components: {
    ProductItem,
    IonImg,
    IonRow,
    IonThumbnail,
    IonSkeletonText,
    IonGrid,
    IonCol,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  },
  props: ['sticky_home_category', 'categories'],
  setup(props) {
    const store = useStore();
    const storage = inject('$storage');
    let data = reactive({ filteredProducts: [] });
    let selectedItem = ref(null);
    let isLoading = ref(true);
    const isDisabled = ref(false);
    let selectedID = ref(0);

    watch(
      () => props.categories,
      (val) => {
        selectedItem.value = null;
        if (val && val.length > 0) {
          updateItem(selectedID.value);
        } else {
          handleReset();
        }
      }
    );

    const { mutate: getProducts } = useMutation(products);
    let getCurrentLocation = null;
    let selectedState = null;
    let user = null;
    let page_num = 1;

    const handleReset = () => {
      data.filteredProducts = [];
      selectedItem.value = null;
      isLoading.value = true;
      isDisabled.value = false;
      selectedID.value = 0;
    };

    const getItem = async (index) => {
      if (getCurrentLocation === null) getCurrentLocation = await storage.getCurrentLocation();
      if (selectedState === null) selectedState = await storage.getSelectedState();
      if (user === null) user = await storage.getUser();
      const selectedHub = store.getters['b2c/getSelectedHub'];
      let item = props.categories[index];
      page_num = selectedItem.value == item ? page_num : 1;
      selectedItem.value = item;
      try {
        const res = await getProducts({
          active: true,
          mainCategory: item.id,
          page: page_num,
          perPage: 4,
          hubId: user?.id ? selectedHub?.id || undefined : undefined,
          state: user?.id
            ? user.country.description === 'Malaysia'
              ? selectedState.state
              : undefined
            : getCurrentLocation.country === 'Malaysia'
            ? selectedState.state
            : undefined,
          country: user?.id ? undefined : getCurrentLocation.country
        });
        const products = res?.data?.products ?? [];
        return products.map((item) => {
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
            taxRateVal:
              item.skus !== null
                ? item.skus[0].tax_rate > 0
                  ? item.skus[0].tax_rate
                  : item.tenant.tax_rate
                : ''
          };
          return obj;
        });
      } catch (error) {
        console.log('ERROR:', error.message);
        return [];
      }
    };
    const updateItem = async (index) => {
      let item = props.categories[index];
      page_num = selectedItem.value == item ? page_num : 1;
      selectedItem.value = item;
      isLoading.value = true;
      const products = await getItem(index);
      data.filteredProducts.push(products);
      isDisabled.value = selectedID.value === props.categories.length - 1;
      setTimeout(() => {
        isLoading.value = false;
      }, 500);
    };
    const loadData = (ev) => {
      setTimeout(() => {
        if (selectedID.value < props.categories.length - 1) {
          selectedID.value++;
          updateItem(selectedID.value);
          isLoading.value = true;
        }
        ev.target.complete();
      }, 500);
    };
    const setIsLoading = (value) => {
      isLoading.value = value;
    };
    const setFilteredProducts = (newValue) => {
      data.filteredProducts = [...newValue];
    };
    const updateSelectedID = (value) => {
      selectedID.value = value;
      isDisabled.value = value === props.categories.length - 1;
    };
    return {
      selectedItem,
      selectedID,
      data,
      leftCircleArrow,
      isLoading,
      isDisabled,
      loadData,
      getItem,
      setFilteredProducts,
      updateSelectedID,
      setIsLoading
    };
  },
  mounted() {
    window.addEventListener('transitionend', this.handleTranisition);
    window.addEventListener('transitioncancel', this.handleTranisition);
  },
  unmounted() {
    window.removeEventListener('transitionend', this.handleTranisition);
    window.removeEventListener('transitioncancel', this.handleTranisition);
  },
  methods: {
    gotoCategory(id) {
      this.$store.dispatch('b2c/setSelectedMainCatID', { id: id });
      this.$store.dispatch('b2c/setCategories', { allCategories: this.categories });
      this.$router.push('/main/category_product');
    },
    async scrollToSelectedItem(index) {
      this.updateSelectedID(index);
      if (!this.data.filteredProducts[index]?.length) {
        this.setIsLoading(true);
        const newValue = await Promise.all(
          Array.from({ length: index + 1 }).map(async (_, i) => {
            return await new Promise((resolve) => {
              if (this.data.filteredProducts[i]) {
                resolve(this.data.filteredProducts[i]);
              } else {
                resolve(this.getItem(i));
              }
            });
          })
        );
        this.setFilteredProducts(newValue);
        this.scrollIntoView(this.categories[index].name, new Date());
      } else {
        this.scrollTo(index);
      }
    },
    scrollIntoView(name, startDate) {
      setTimeout(() => {
        const ele = document.getElementById(name);
        if (!ele) startDate = new Date();
        ele.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'start'
        });
        let date = new Date();
        let dif = date.getTime() - startDate.getTime();
        if (dif < 1500) {
          this.scrollIntoView(name, startDate);
        } else {
          this.setIsLoading(false);
        }
      }, 5);
    },
    scrollTo(index) {
      try {
        let item = this.categories[index];
        this.selectedItem = item;
        this.$emit('scrollTo', index);
      } catch (error) {
        console.log('ERROR:', error.message);
      }
    },
    handleTranisition() {
      if (this.categories?.length && !this.isLoading) {
        for (let i = 0; i < this.categories.length; i++) {
          const ele = document.getElementById(this.categories[i].name);
          const inViewPort = isInViewport(ele);
          if (inViewPort && this.selectedItem.name !== this.categories[i].name) {
            this.selectedItem = this.categories[i];
            break;
          }
        }
      }
    }
  }
});
</script>

<style scoped lang="scss">
@import 'home.category.module';
</style>

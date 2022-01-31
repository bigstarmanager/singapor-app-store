<template>
  <ion-page>
    <ion-content :fullscreen="true" class="searchContainer">
      <search-header @handleSearch="handleSearch"></search-header>
      <div class="supplier" v-if="showSupplier == 'show'">
        <ion-thumbnail class="supplier-logo" v-if="isSupplierLoading">
          <ion-skeleton-text animated></ion-skeleton-text>
        </ion-thumbnail>
        <ion-skeleton-text
          animated
          class="preLoading supplier-logo"
          v-show="!isSupplierLoading && loadingImg"
        ></ion-skeleton-text>
        <ion-img
          class="supplier-logo"
          :src="imageData"
          v-if="!isSupplierLoading"
          @ionError="errorIMG"
          @ionImgDidLoad="loadingImg = false"
          :style="{ opacity: loadingImg ? 0 : 1 }"
        />
        <ion-label v-if="!isSupplierLoading" class="supplier-name">
          {{ getText(supplierName) }}
        </ion-label>
        <ion-skeleton-text animated v-else class="supplier-skeleton"></ion-skeleton-text>
        <ion-icon class="share-icon" :icon="shareSocialOutline" @click="share()"></ion-icon>
      </div>
      <div>
        <ion-list v-if="showRecentSearch">
          <ion-item class="recent-header" lines="full">
            <ion-label>{{ $t('recent_searches') }}</ion-label>
          </ion-item>
          <ion-item
            v-for="(recentSearch, index) in last5Searches"
            :key="index"
            lines="none"
            class="recent-search"
            @click="handleSearch(recentSearch)"
          >
            <ion-label>{{ recentSearch }}</ion-label>
          </ion-item>
        </ion-list>
        <div v-if="!showRecentSearch">
          <ion-label class="user-input">
            {{ $t('search_results_for') }} <br />
            "{{ getText(searchKeyword) }}"
            <br />
          </ion-label>
          <ion-label class="product-length" v-if="!skeleton_flag || total_count > 0">
            {{ total_count > 0 ? total_count : '' }}
            {{
              total_count > 0
                ? total_count > 1
                  ? $t('products_found')
                  : $t('product_found')
                : $t('no_product_found')
            }}
          </ion-label>
          <div class="no-search-container" v-if="!skeleton_flag && total_count === 0">
            <ion-img :src="no_search" class="no-search-icon" />
            <ion-label class="no-search-text1">
              {{ $t('no_search_text1') }}<br />{{ $t('no_search_text2') }}
            </ion-label>
          </div>
        </div>

        <ion-grid class="product-list-container" v-if="!showRecentSearch && productList.length > 0">
          <ion-row>
            <ion-col size="6" v-for="item in productList" v-bind:key="item.id">
              <div class="topPicks_item">
                <ProductItem :product="item" />
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>

        <ion-grid class="product-list-container" v-show="!showRecentSearch && skeleton_flag">
          <ion-row class="product_list">
            <ion-col v-for="index in 6" v-bind:key="index" class="skeleton_item">
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
        <ion-grid v-if="!showRecentSearch && productList.length > 0">
          <ion-infinite-scroll
            @ionInfinite="loadData($event)"
            threshold="100px"
            id="infinite-scroll"
            :disabled="isDisabled"
          >
            <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading more data...">
            </ion-infinite-scroll-content>
          </ion-infinite-scroll>
        </ion-grid>
      </div>
    </ion-content>
    <ion-footer v-if="!isLoggedIn" class="login-sticky">
      <ion-label>{{ $t('login_sticky') }}</ion-label>
      <ion-button @click="gotoLogin()">{{ $t('login_now') }}</ion-button>
    </ion-footer>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonFooter,
  IonButton,
  IonImg,
  IonList,
  IonItem,
  IonRow,
  IonCol,
  IonGrid,
  IonLabel,
  IonThumbnail,
  IonSkeletonText,
  IonIcon,
  onIonViewDidEnter,
  onIonViewWillEnter,
  IonInfiniteScroll,
  IonInfiniteScrollContent
} from '@ionic/vue';
import ProductItem from '../../../components/ProductItem';
import SearchHeader from '../../../components/SearchHeader';
import { defineComponent, inject, ref, computed, watch } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { searchProductsPaginate } from '../../../services/shared/graphql/search';
import { getSupplierByCusId } from '../../../services/shared/graphql/supplier';
import { useStore } from 'vuex';
import { shareSocialOutline } from 'ionicons/icons';
import { getImage, noImage } from '../../../utils/getImage';
import no_search from '/src/assets/images/no_search.svg';
import { Share } from '@capacitor/share';
import Branch from '@/services/shared/helper/branch';

export default defineComponent({
  name: 'Search',
  components: {
    IonContent,
    IonFooter,
    IonButton,
    IonImg,
    IonPage,
    IonRow,
    IonCol,
    IonGrid,
    IonIcon,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    IonSkeletonText,
    ProductItem,
    SearchHeader,
    IonInfiniteScroll,
    IonInfiniteScrollContent
  },
  data() {
    return {
      last5Searches: [],
      searchKeyword: '',
      searchResult: '',
      onSearch: 0,
      recentSearches: [],
      loadingImg: true,
      products_offset: 0,
      isDisabled: false,
      skeleton_flag: false
    };
  },
  props: ['showSupplier', 'supplier_id'],
  async setup(props) {
    const store = useStore();
    const selectedHub = computed(() => {
      return store.getters['b2c/getSelectedHub'];
    });
    const storage = inject('$storage');
    let imageData = ref(undefined);
    let isSupplierLoading = ref(true);
    let supplierName = ref('');
    let productList = ref([]);
    let total_count = ref(0);
    let showRecentSearch = ref(true);
    let currentUser = null;
    const isLoggedIn = ref(false);
    watch(
      () => props.showSupplier,
      () => {
        getSupplierData();
      }
    );

    const { mutate: searchResults } = useMutation(searchProductsPaginate);
    const { mutate: supplierDetails } = useMutation(getSupplierByCusId);
    const getSupplierData = () => {
      props.supplier_id &&
        supplierDetails({
          customerId: Number.parseInt(props.supplier_id)
        }).then((res) => {
          getImage(res.data.getSupplierByCusId[0].tenant.logo, 'supplier-logos').then((obj) => {
            imageData.value = obj;
          });

          supplierName.value = res.data.getSupplierByCusId[0].name;
          isSupplierLoading.value = false;
        });
    };
    if (props.showSupplier && props.supplier_id) {
      getSupplierData();
    }
    onIonViewDidEnter(() => {
      document.querySelector('ion-searchbar.searchInput').value = '';
      setTimeout(() => {
        document.querySelector('ion-searchbar.searchInput').setFocus();
      }, 100);
    });
    onIonViewWillEnter(async () => {
      currentUser = await storage.getUser();
      if (currentUser?.id) {
        isLoggedIn.value = true;
      } else {
        isLoggedIn.value = false;
      }
      productList.value = [];
      total_count.value = 0;
      showRecentSearch.value = true;
    });
    currentUser = await storage.getUser();
    if (currentUser?.id) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
    const selectedState = await storage.getSelectedState();
    const getCurrentLocation = await storage.getCurrentLocation();
    return {
      storage,
      searchResults,
      selectedHub,
      imageData,
      productList,
      total_count,
      showRecentSearch,
      isLoggedIn,
      supplierName,
      shareSocialOutline,
      isSupplierLoading,
      no_search,
      currentUser,
      selectedState,
      getCurrentLocation
    };
  },
  methods: {
    async setLocalStorage(index, value) {
      await this.storage.set(index, value);
    },
    async getLocalStorage(index) {
      const response = await this.storage.get(index);
      return response;
    },
    errorIMG(event) {
      event.target.src = noImage;
    },
    async handleSearch(input) {
      this.searchKeyword = input;
      this.total_count = 0;
      if (input && input.length > 2) {
        this.getLocalStorage('recentSearch')
          .then((res) => {
            this.recentSearches = res || [];
            if (this.last5Searches.length > 0 && this.last5Searches[0] === input) {
              return this.recentSearches;
            }
            this.recentSearches.push(input);
            return this.recentSearches;
          })
          .then((res) => {
            this.recentSearches = [...res];
            this.last5Searches = this.recentSearches.reverse().slice(0, 5);
            this.setLocalStorage('recentSearch', res.reverse().slice(0, 5).reverse());
          });
        this.products_offset = 0;
        this.showRecentSearch = false;
        this.productList = [];
        this.updateItem();
      } else {
        this.productList = [];
        this.showRecentSearch = true;
      }
    },
    async updateItem() {
      this.skeleton_flag = true;
      this.searchResults({
        keyword: this.searchKeyword,
        supplierId: this.showSupplier === 'show' ? Number.parseInt(this.supplier_id) : null,
        hubId: this.selectedHub ? this.selectedHub.id : null,
        limit: 10,
        offset: this.products_offset,
        state: this.getCurrentLocation.country === 'Malaysia' ? this.selectedState.state : undefined,
        country: this.isLoggedIn ? undefined : this.getCurrentLocation.country
      })
        .then((res) => {
          this.total_count =
            this.total_count > 0 ? this.total_count : res.data.searchProductsPaginate.total_count;
          this.searchResult = res.data.searchProductsPaginate.items;
          if (this.searchResult) {
            this.searchResult.map((item) => {
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
              this.productList.push(obj);
            });
          }

          if (this.products_offset === 0) {
            Branch.trackViewItems(this.searchKeyword.trim(), 'All');
          }

          this.products_offset += 10;
          this.isDisabled = this.searchResult.length < 10;
        })
        .finally(() => {
          this.skeleton_flag = false;
        });
    },
    loadData(ev) {
      setTimeout(() => {
        ev.target.complete();
        this.updateItem();
      }, 500);
    },
    routeToPath(path) {
      this.$router.push({
        path: path
      });
    },
    async share() {
      await Share.share({
        title: this.supplierName,
        text: this.supplierName,
        url: process.env.VUE_APP_WEB_APP_URL + this.$route.fullPath,
        dialogTitle: 'Share this supplier with friends !'
      });
    },
    getText(name) {
      if (name && name.length > 30) return name.substring(0, 30) + '...';
      else return name;
    },
    async gotoLogin() {
      await this.storage.setRedirectPath('/main/search');
      this.$router.push('/home');
    }
  },
  async mounted() {
    this.getLocalStorage('recentSearch').then((res) => {
      this.recentSearches = res || [];
      this.last5Searches = this.recentSearches.reverse().slice(0, 5);
    });
  }
});
</script>
<style scoped lang="scss">
@import 'search.module';
</style>

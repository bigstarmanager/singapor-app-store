<template>
  <ion-page>
    <ion-header class="volumeDeals_page_header">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/home"></ion-back-button>
        </ion-buttons>
        <p class="header_title">{{ $t('volume_deal_s') }}</p>
        <ion-buttons slot="end">
          <ion-button @click="router.push('chat')">
            <ion-img :src="isNewMessage ? chat_fill_svg : chat_svg" />
          </ion-button>
          <ion-button @click="router.push('map')">
            <ion-img :src="selectedHub ? location_click_svg : location_svg" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid class="volumeDeal_list">
        <ion-row class="product_list">
          <ion-col class="volumeDeal_item" v-for="item in allVolumeDeals" v-bind:key="item.id">
            <ProductItem :product="item" />
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-grid class="skeleton_list" v-show="skeleton_flag">
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
    </ion-content>
  </ion-page>
</template>
<script>
import {
  IonPage,
  IonContent,
  IonToolbar,
  IonHeader,
  IonRow,
  IonThumbnail,
  IonSkeletonText,
  IonGrid,
  IonCol,
  IonBackButton,
  IonButton,
  IonImg,
  IonButtons
} from '@ionic/vue';
import { ref, defineComponent, inject, computed } from 'vue';
import { volumeDeals } from '../../../services/shared/graphql/typesOfProducts';
import { useMutation } from '@vue/apollo-composable';
import ProductItem from '../../../components/ProductItem';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import chat_svg from '@/assets/icons/shared/chat.svg';
import chat_fill_svg from '@/assets/icons/shared/chat_fill.svg';
import location_svg from '@/assets/icons/shared/place.svg';
import location_click_svg from '@/assets/icons/shared/place_click.svg';

export default defineComponent({
  name: 'VolumeDeals',
  data: () => ({
    CP_clicked: false
  }),
  components: {
    IonContent,
    IonPage,
    IonGrid,
    IonCol,
    IonToolbar,
    IonThumbnail,
    IonSkeletonText,
    IonHeader,
    IonRow,
    ProductItem,
    IonImg,
    IonButton,
    IonBackButton,
    IonButtons
  },
  async setup() {
    const filterText = ref('');
    const router = useRouter();
    const store = useStore();
    const storage = inject('$storage');
    let currentUser = null;
    const { mutate: fetchAllVolumeDeals } = useMutation(volumeDeals);
    const isNewMessage = computed(() => {
      return store.getters['b2c/getIsNewMessage'];
    });
    const selectedHub = computed(() => {
      return store.getters['b2c/getSelectedHub'];
    });
    let skeleton_flag = ref(false);
    let selectedState = await storage.getSelectedState();
    const allVolumeDeals = ref([]);
    storage
      .getUser()
      .then((res) => {
        currentUser = res;
        skeleton_flag.value = true;
        fetchAllVolumeDeals({
          countryId: currentUser.country.id,
          hubId: selectedHub.value?.id || undefined,
          state: currentUser.country.id === 127 ? selectedState.state : undefined
        })
          .then((res) => {
            res.data.getVolumeDealProducts.map((item) => {
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
              skeleton_flag.value = false;
              allVolumeDeals.value.push(obj);
            });
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {
        console.error(error);
      });
    return {
      filterText,
      skeleton_flag,
      router,
      allVolumeDeals,
      chat_svg,
      location_svg,
      isNewMessage,
      selectedHub,
      chat_fill_svg,
      location_click_svg
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
});
</script>

<style scoped lang="scss">
@import 'volumeDeal.module';
</style>

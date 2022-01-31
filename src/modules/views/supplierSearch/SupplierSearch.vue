<template>
  <ion-page>
    <ion-header class="supplier_search_header">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/supplier-list"></ion-back-button>
        </ion-buttons>
        <ion-searchbar
          class="header_searchbar"
          color="tertiary"
          show-cancel-button="never"
          :placeholder="$t('search_in') + getHubName(supplierName)"
          @ion-focus="gotoSearch()"
        ></ion-searchbar>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="searchContainer">
      <div class="supplier">
        <ion-thumbnail class="supplier-logo" v-if="isLoading">
          <ion-skeleton-text animated></ion-skeleton-text>
        </ion-thumbnail>
        <ion-skeleton-text
          animated
          class="preLoading supplier-logo"
          v-show="!isLoading && loadingImg"
        ></ion-skeleton-text>
        <ion-img
          class="supplier-logo"
          :src="supplierLogo"
          v-if="!isLoading"
          @ionError="errorIMG"
          @ionImgDidLoad="loadingImg = false"
          :style="{ opacity: loadingImg ? 0 : 1 }"
        />
        <ion-label v-if="!isLoading" class="supplier-name">
          {{ getText(supplierName) }}
        </ion-label>
        <ion-skeleton-text animated v-else class="supplier-skeleton"></ion-skeleton-text>
        <ion-buttons class="shareBtn" slot="end" @click="share()">
          <ion-icon class="share-icon" :icon="shareSocialOutline"></ion-icon>
        </ion-buttons>
      </div>
      <CategoryList
        :id="category_id"
        @update:id="category_id = $event"
        :visibility="show_categorySlider"
        :categories="categories"
      />
      <SupplierSearchProductList
        :id="category_id"
        :visibility="show_categorySlider"
        :categories="categories"
        :supplier_id="supplier_id"
      />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonBackButton,
  IonButtons,
  IonIcon,
  IonImg,
  IonLabel,
  IonSearchbar,
  IonSkeletonText,
  IonThumbnail,
  onIonViewWillEnter
} from '@ionic/vue';
import { chatboxOutline, locationOutline, searchOutline, shareSocialOutline } from 'ionicons/icons';
import { defineComponent, ref, watch, inject } from 'vue';
import { useStore } from 'vuex';
import { useMutation } from '@vue/apollo-composable';
import { getSupplierByCusId } from '../../../services/shared/graphql/supplier';
import { queryAllCategories } from '../../../services/shared/graphql/category';
import { useRouter, useRoute } from 'vue-router';
import CategoryList from '../../../components/SupplierSearchSlider';
import SupplierSearchProductList from '../../../components/SupplierSearchProductList';
import { getImage, noImage } from '../../../utils/getImage';
import { Share } from '@capacitor/share';

export default defineComponent({
  name: 'SupplierSearch',
  data: () => ({
    searchInput: '',
    CP_clicked: false,
    show_categorySlider: true,
    imageData: null,
    loadingImg: true
  }),
  props: ['supplier_id'],
  components: {
    IonPage,
    IonContent,
    IonHeader,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonIcon,
    IonImg,
    IonLabel,
    IonSearchbar,
    CategoryList,
    SupplierSearchProductList,
    IonSkeletonText,
    IonThumbnail
  },
  async setup(props) {
    const store = useStore();
    const router = useRouter();
    const route = useRoute();
    const selectedHub = ref(store.getters['b2c/getSelectedHub']);
    const categories = ref(null);
    const category_id = ref(null);
    const storage = inject('$storage');
    const supplierName = ref('');
    const supplierLogo = ref(undefined);
    const isLoading = ref(true);
    const supplierId = Number.parseInt(props.supplier_id || route.params.supplier_id);

    const { mutate: fetchAllCategory } = useMutation(queryAllCategories);

    onIonViewWillEnter(() => {
      const prevHubId = selectedHub.value?.id || null;
      selectedHub.value = store.getters['b2c/getSelectedHub'];

      if (prevHubId !== (selectedHub.value?.id || null)) {
        getCategories();
      }
    });

    watch(
      () => supplierId,
      () => {
        isLoading.value = true;
        getCategories();
        getSupplier();
      }
    );

    const getCategories = async () => {
      const currentUser = await storage.getUser();
      const selectedState = await storage.getSelectedState();
      categories.value = [];
      supplierId &&
        fetchAllCategory({
          active: true,
          supplierId: supplierId,
          hubId: selectedHub.value?.id || undefined,
          state: currentUser.country.id === 127 ? selectedState.state : undefined
        })
          .then((res) => {
            const newCategories = res.data.categories;

            categories.value = newCategories;
            category_id.value = 0;
          })
          .catch((error) => {
            console.error(error);
          });
    };

    const { mutate: getSupplierInfo } = useMutation(getSupplierByCusId);
    const getSupplier = () => {
      supplierId &&
        getSupplierInfo({
          customerId: supplierId
        }).then((res) => {
          getImage(res.data.getSupplierByCusId[0]?.tenant?.logo || null, 'supplier-logos').then((obj) => {
            supplierLogo.value = obj;
          });
          supplierName.value = res.data.getSupplierByCusId[0]?.name;
          isLoading.value = false;
        });
    };
    getSupplier();
    await getCategories();

    return {
      chatboxOutline,
      locationOutline,
      searchOutline,
      shareSocialOutline,
      isLoading,
      supplierName,
      supplierLogo,
      categories,
      category_id,
      router
    };
  },
  methods: {
    getHubName(data) {
      let hubName = '';
      if (data && data.length > 0) {
        hubName =
          data.length > 14 ? `${data.substring(0, Math.min(data.length, data.lastIndexOf(' ')))}...` : data;
      }
      return hubName;
    },
    errorIMG(event) {
      event.target.src = noImage;
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
    gotoSearch() {
      this.router.push({
        name: 'search',
        params: { showSupplier: 'show', supplier_id: this.supplier_id }
      });
    }
  }
});
</script>
<style scoped lang="scss">
@import 'supplierSearch.module';
</style>

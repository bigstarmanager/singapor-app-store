<template>
  <ion-page>
    <ion-header class="category_product_header">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/category"></ion-back-button>
        </ion-buttons>
        <ion-searchbar
          class="header_searchbar"
          color="tertiary"
          show-cancel-button="never"
          :placeholder="
            selectedHub && selectedHub.alias_name && isLoggedIn
              ? $t('search_in') + getHubName(selectedHub.alias_name)
              : $t('search_for_food')
          "
          @ion-focus="gotoSearch()"
        ></ion-searchbar>
        <ion-buttons slot="end">
          <ion-button @click="gotoRouter('/main/chat')">
            <ion-img :src="isLoggedIn && isNewMessage ? chat_fill_svg : chat_svg" />
          </ion-button>
          <ion-button @click="gotoRouter('/main/map')">
            <ion-img :src="isLoggedIn && selectedHub ? location_click_svg : location_svg" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content
      :fullscreen="true"
      class="category-product"
      :scroll-events="true"
      @ionScroll="logScrolling($event)"
    >
      <div class="back-to-top" :class="showBackToTop ? 'show' : ''" @click="clickBackToTop">
        <span>{{ $t('back_to_top') }}</span>
      </div>
      <CategorySlider
        :id="selected_categoryID"
        :goto="true"
        @update:id="selected_categoryID = $event"
        :visibility="show_categorySlider"
        :availbleSupplier="availbleSupplier"
        :supplier_id="supplier_id"
        :categories="allcategories"
      />
      <CategoryProductList
        :id="selected_categoryID"
        :visibility="show_categorySlider"
        :availbleSupplier="availbleSupplier"
        :supplierId="supplier_id"
        :categories="allcategories"
      />
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
  IonImg,
  IonToolbar,
  IonHeader,
  IonSearchbar,
  IonLabel,
  IonButtons,
  IonBackButton,
  IonButton
} from '@ionic/vue';
import { ref, defineComponent, computed, watch, inject } from 'vue';
import CategorySlider from '../../../components/CategorySlider';
import CategoryProductList from '../../../components/CategoryProductList';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import chat_svg from '@/assets/icons/shared/chat.svg';
import chat_fill_svg from '@/assets/icons/shared/chat_fill.svg';
import location_svg from '@/assets/icons/shared/place.svg';
import location_click_svg from '@/assets/icons/shared/place_click.svg';
import { arrowBackOutline } from 'ionicons/icons';
import { queryAllCategories } from '@/services/shared/graphql/category';
import { useMutation } from '@vue/apollo-composable';
export default defineComponent({
  name: 'Category_Product',
  data: () => ({
    click_location: false,
    show_categorySlider: true
  }),
  props: ['availbleSupplier', 'supplier_id'],
  components: {
    IonContent,
    IonFooter,
    IonPage,
    IonToolbar,
    IonHeader,
    IonSearchbar,
    IonButtons,
    IonLabel,
    IonButton,
    IonImg,
    IonBackButton,
    CategorySlider,
    CategoryProductList
  },
  async setup(props) {
    const store = useStore();
    const router = useRouter();
    const storage = inject('$storage');
    let prevScrollPos = 0;
    let nextScrollPos = 0;
    let showBackToTop = ref(false);
    let clickToTop = true;
    let activeScroll = false;
    let offsetTop_categoryList = 0;
    let allcategories = ref([]);
    let selected_categoryID = ref(0);
    const isNewMessage = computed(() => {
      return store.getters['b2c/getIsNewMessage'];
    });
    const selectedHub = computed(() => {
      return store.getters['b2c/getSelectedHub'];
    });
    const { mutate: fetchAllCategory } = useMutation(queryAllCategories);
    const isLoggedIn = computed(() => {
      return store.getters['shared/getUserLoggedIn'];
    });
    watch(
      () => props.availbleSupplier,
      () => {
        allcategories.value = [];
        selected_categoryID.value = 0;
        getCategory();
      }
    );
    let category_id = ref(store.getters['b2c/getSelectedMainCatID']);
    let getCurrentLocation = await storage.getCurrentLocation();
    let selectedState = await storage.getSelectedState();
    const getCategory = async () => {
      fetchAllCategory({
        active: true,
        supplierId: props.availbleSupplier === 'true' ? Number.parseInt(props.supplier_id) : undefined,
        hubId: selectedHub.value?.id || undefined,
        state: getCurrentLocation.country === 'Malaysia' ? selectedState.state : undefined,
        country: getCurrentLocation.country
      })
        .then((res) => {
          allcategories.value = res.data.categories;
        })
        .catch((error) => {
          console.error(error);
        });
    };
    getCategory();
    return {
      showBackToTop,
      clickToTop,
      router,
      storage,
      prevScrollPos,
      nextScrollPos,
      allcategories,
      chat_svg,
      location_svg,
      isNewMessage,
      selectedHub,
      isLoggedIn,
      chat_fill_svg,
      location_click_svg,
      selected_categoryID,
      arrowBackOutline,
      category_id,
      activeScroll,
      offsetTop_categoryList
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    logScrolling: function (event) {
      if (!this.activeScroll) {
        this.offsetTop_categoryList =
          document.querySelector('div.subCategory_list').offsetTop -
          document.querySelector('ion-header.category_product_header').offsetHeight;
        this.activeScroll = true;
      }
      if (event.detail.scrollTop > this.offsetTop_categoryList) {
        this.show_categorySlider = false;
      } else {
        this.show_categorySlider = true;
      }
      this.nextScrollPos = event.detail.scrollTop;
      if (this.nextScrollPos < this.prevScrollPos && this.nextScrollPos > 1200) {
        if (this.clickToTop) this.showBackToTop = true;
      } else {
        this.showBackToTop = false;
      }
      this.prevScrollPos = this.nextScrollPos;
      if (this.nextScrollPos == 0) {
        this.clickToTop = true;
        this.showBackToTop = false;
      }
    },
    clickBackToTop() {
      this.showBackToTop = false;
      this.clickToTop = false;
      document.querySelector('ion-content.category-product').scrollToTop(1500);
    },
    getHubName(data) {
      const hubName = data.substring(0, 14);
      return data.length > 14
        ? `${hubName.substring(0, Math.min(hubName.length, hubName.lastIndexOf(' ')))}...`
        : data;
    },
    gotoSearch() {
      this.router.push({ name: 'search', params: { showSupplier: 'hidden' } });
    },
    gotoRouter(path) {
      this.$router.push(path);
    },
    async gotoLogin() {
      await this.storage.setRedirectPath('/main/category_product');
      this.$router.push('/home');
    }
  },
  created() {
    this.selected_categoryID = this.category_id;
  }
});
</script>
<style scoped lang="scss">
@import 'category_product.module';
</style>

<template #default>
  <ion-page id="disable-swipe-back">
    <template v-if="isSelectedState">
      <ion-header class="homepageHeader">
        <ion-toolbar color="transparent">
          <ion-searchbar
            color="tertiary"
            show-cancel-button="never"
            :placeholder="
              selectedHub && selectedHub.alias_name && isLoggedIn
                ? $t('search_in') + getHubName(selectedHub.alias_name)
                : $t('search_items')
            "
            @ion-focus="gotoSearch()"
          >
          </ion-searchbar>
          <ion-buttons slot="end">
            <ion-button @click="gotoRouter('/main/chat')">
              <ion-img :src="isLoggedIn && isNewMessage ? chat_fill_svg : chat_svg" />
            </ion-button>
            <ion-button @click="gotoRouter('/main/map')">
              <ion-img :src="isLoggedIn && selectedHub ? location_click_svg : location_svg" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
        <div
          v-if="getCurrentLocation && getCurrentLocation.country !== 'Singapore'"
          class="select-delivery-container"
        >
          <ion-img :src="location_direction" />
          <ion-label @click="openSelectStateModal" class="delivery-text"
            >Delivery:&emsp;{{ selectedState?.state }}&ensp;</ion-label
          >
          <ion-img :src="chevron_down" />
        </div>
      </ion-header>
      <ion-content
        :fullscreen="true"
        class="homeContainer"
        :scroll-events="true"
        @ionScroll="getScrollEvent($event)"
      >
        <ion-refresher slot="fixed" @ionRefresh="doRefresh($event)">
          <ion-refresher-content></ion-refresher-content>
        </ion-refresher>
        <div class="background-container" :class="!isProducts || isServerDown ? 'background-white' : ''">
          <div class="back-to-top" :class="showBackToTop ? 'show' : ''" @click="clickBackToTop">
            <span>{{ $t('back_to_top') }}</span>
          </div>
          <div class="slide-background"></div>
          <div class="homeImageSlideContainer">
            <ion-slides
              pager="true"
              :options="slideOpts"
              v-if="bannerArray.length > 0"
              class="slider-container"
            >
              <ion-slide
                v-for="banner in bannerArray"
                v-bind:key="banner.id"
                v-on:click="clickSlide(banner)"
                class="ion-activatable"
              >
                <ion-ripple-effect type="bounded"></ion-ripple-effect>
                <BannerItem :banner="banner" />
              </ion-slide>
            </ion-slides>
            <ion-img class="no-image-banner" src="/assets/images/App Banners 1.png" v-else />
          </div>
          <SystemOutage v-if="isServerDown" />
          <div v-if="isProducts && !isServerDown">
            <CategorySlider :visibility="true" :goto="false" :categories="categories" />
            <TopPicks v-if="showTopPicks" />
            <HotDeals v-if="showHotDeals" />
            <VolumeDeals v-if="showVolumeDeal" />
            <SupplierList />
            <HomeCategory
              :sticky_home_category="sticky_home_category"
              :categories="categories"
              @scrollTo="scrollTo"
            />
          </div>
          <div v-if="!isProducts && !isServerDown" class="home-no-supplier">
            <ion-Img :src="home_supplier_png" class="no-supplier-img" />
            <ion-label class="no-supplier-desc">
              {{ $t('no_supplier_text1') }}
            </ion-label>
            <ion-label>
              {{ $t('no_supplier_text2') }}
            </ion-label>
            <ion-label>
              {{ $t('no_supplier_text3') }}
              <router-link class="router-link" to="/main/account/contact-us">{{
                $t('no_supplier_text4')
              }}</router-link>
            </ion-label>
          </div>
        </div>
      </ion-content>
      <ion-footer v-if="!isLoggedIn" class="login-sticky">
        <ion-label>{{ $t('login_sticky') }}</ion-label>
        <ion-button @click="gotoLogin()">{{ $t('login_now') }}</ion-button>
      </ion-footer>
      <ion-modal
        :is-open="isOpenSelectStateModal"
        css-class="select-state-modal"
        @didDismiss="isOpenSelectStateModal = false"
        backdrop-dismiss="false"
      >
        <select-state-modal
          @select-state="selectState"
          @close-modal="isOpenSelectStateModal = false"
          :isCountryShow="false"
          :isCountryDisable="isCountryDisable"
          :initialCountry="getCurrentLocation.country"
          :initialState="selectedState?.state"
        >
        </select-state-modal>
      </ion-modal>
    </template>
    <template v-else>
      <div class="empty">
        <ion-modal :is-open="isOpenRef" css-class="select-state-modal" backdrop-dismiss="false">
          <select-state-modal
            @select-state="selectState"
            @close-modal="setOpen(false)"
            :isCountryShow="true"
            :isCountryDisable="isCountryDisable"
          >
          </select-state-modal>
        </ion-modal>
      </div>
    </template>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonImg,
  IonToolbar,
  IonSearchbar,
  IonHeader,
  IonSlides,
  IonSlide,
  IonButtons,
  IonButton,
  IonLabel,
  IonModal,
  onIonViewWillEnter,
  toastController,
  IonRippleEffect,
  // createGesture,
  alertController,
  modalController,
  isPlatform,
  IonRefresher,
  IonRefresherContent,
  IonFooter
} from '@ionic/vue';
import { closeCircleOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { ref, defineComponent, inject, computed } from 'vue';
import { Deploy } from 'cordova-plugin-ionic';
import { Capacitor } from '@capacitor/core';
import CategorySlider from '@/components/CategorySlider';
import TopPicks from '@/components/TopPicks';
import HotDeals from '@/components/HotDeals';
import SupplierList from '@/components/SupplierList';
import waIcon from '@/assets/icons/account/wa.png';
import VolumeDeals from '@/components/VolumeDeals';
import HomeCategory from '@/components/HomeCategory';
import ProgressBarModal from '@/components/ProgressBarModal';
import BannerItem from '../../../components/BannerImage';
import { getAllProducts } from '@/services/shared/graphql/allProducts';
import { getOpenSpreeByHubId } from '@/services/shared/graphql/spree';
import { getBanners } from '../../../services/shared/graphql/banner';
import { getAppVersion } from '../../../services/shared/graphql/getAppVersion';
import { useMutation } from '@vue/apollo-composable';
import { useStore } from 'vuex';
import chat_svg from '@/assets/icons/shared/chat.svg';
import chat_fill_svg from '@/assets/icons/shared/chat_fill.svg';
import location_svg from '@/assets/icons/shared/place.svg';
import location_click_svg from '@/assets/icons/shared/place_click.svg';
import location_direction from '@/assets/icons/shared/location_direction.svg';
import home_supplier_png from '@/assets/images/home_no_supplier.png';
import chevron_down from '@/assets/icons/shared/chevron_down.svg';
import { useI18n } from 'vue-i18n';
import Branch from '@/services/shared/helper/branch';
import meta from '../../../../package.json';
import { isExternalBannerUrl } from '@/services/shared/helper/helper';
import SelectStateModal from '@/components/SelectStateModal';
import { Geolocation } from '@capacitor/geolocation';
import clevertap from '@/services/shared/helper/clevertap';
import Intercom from '@/services/shared/helper/intercom';
import SystemOutage from '@/components/SystemOutage/SystemOutage.vue';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonImg,
    IonSlides,
    IonSlide,
    IonToolbar,
    IonHeader,
    IonSearchbar,
    IonButtons,
    IonButton,
    IonLabel,
    IonModal,
    TopPicks,
    CategorySlider,
    HotDeals,
    SupplierList,
    VolumeDeals,
    HomeCategory,
    BannerItem,
    SelectStateModal,
    IonRippleEffect,
    IonRefresher,
    IonRefresherContent,
    IonFooter,
    SystemOutage
  },
  async setup() {
    const { t } = useI18n();
    const router = useRouter();
    const filterText = ref('');
    const store = useStore();
    const storage = inject('$storage');
    let prevScrollPos = 0;
    let nextScrollPos = 0;
    let showBackToTop = ref(false);
    let clickToTop = true;
    let click_location = ref(false);
    let bannerArray = ref([]);
    let activeScroll = false;
    let sticky_home_category = ref(true);
    let showTopPicks = ref(true);
    let showHotDeals = ref(true);
    let showVolumeDeal = ref(true);
    let categories = ref(null);
    let offsetTop_mainCategoryList = 0;
    const isNewMessage = computed(() => {
      return store.getters['b2c/getIsNewMessage'];
    });
    const { mutate: fetchAllProducts } = useMutation(getAllProducts);
    const { mutate: fetchBanners } = useMutation(getBanners, { clientId: 'clientBanner' });
    const { mutate: fetchOpenSpreeByHubId } = useMutation(getOpenSpreeByHubId);
    const { mutate: fetchAppVersion } = useMutation(getAppVersion);
    const selectedHub = ref(store.getters['b2c/getSelectedHub']);
    const isProducts = ref(true);
    const isSelectedState = ref(false);
    const isCountryDisable = ref(false);
    const isLoggedIn = ref(false);
    const isOpenRef = ref(false);
    const isOpenSelectStateModal = ref(false);
    let selectedState = ref({});
    let getCurrentLocation = ref({});
    let user = {};
    const setOpen = (state) => (isOpenRef.value = state);
    const setOpenSelectStateModal = (state) => (isOpenSelectStateModal.value = state);
    const isServerDown = ref(false);
    const slideOpts = {
      initialSlide: 0,
      slidesPerView: 1,
      autoplay: true
    };
    onIonViewWillEnter(async () => {
      user = await storage.getUser();
      if (user?.id) {
        isLoggedIn.value = true;
      } else {
        isLoggedIn.value = false;
      }
      const prevHubId = selectedHub.value?.id || null;
      selectedHub.value = store.getters['b2c/getSelectedHub'];

      // https://treedots.atlassian.net/browse/TREE-2185
      // credits: https://stackoverflow.com/a/67734200
      // const gesture = createGesture({
      //   el: document.getElementById('disable-swipe-back'),
      //   threshold: 0,
      //   gestureName: 'goback-swipe',
      //   gesturePriority: 40.5 // priority of swipe to go back is 40
      // });
      // gesture.enable(true);

      if (prevHubId !== (selectedHub.value?.id || null)) {
        getProducts();
        if (selectedHub.value) checkThereIsOpenSpree();
      }
      if (store.getters['b2c/getUpdateSignAction']) {
        user = await storage.getUser();
        getCurrentLocation.value = await storage.getCurrentLocation();
        selectedState.value = await storage.getSelectedState();
        if (user?.country) {
          //after login
          getCurrentLocation.value = { country: user.country.description };
          await storage.setCurrentLocation(getCurrentLocation.value);
          if (user.country.id === 193) {
            // Singapore user after login
            isSelectedState.value = true;
            getProducts();
            getBannerImages();
          } else {
            // Malaysian user after login
            setOpenSelectStateModal(true);
          }
        } else {
          //after logout
          if (getCurrentLocation.value === null) {
            if (geoPermission.location === 'granted') {
              //geolocation access after logout
              await getLocationCountry();
              if (getCurrentLocation.value?.country === 'Singapore') {
                //geolocation Singapore guest after logout
                isSelectedState.value = true;
                getProducts();
                getBannerImages();
              } else {
                //geolocation Malaysian guest after logout
                isSelectedState.value = false;
                isCountryDisable.value = false;
                setOpen(true);
              }
            } else {
              //goelocation block after logout
              isSelectedState.value = false;
              isCountryDisable.value = false;
              setOpen(true);
            }
          }
        }
        store.dispatch('b2c/setUpdateSignAction', false);
      }
      const isNative = Capacitor.isNativePlatform();
      if (isNative) {
        checkForUpdate();
        checkAvailableUpdate();
      }
    });
    user = await storage.getUser();
    if (user?.id) {
      isLoggedIn.value = true;

      // Register logged in user to Intercom
      // Handler for user that already logged in before Intercom is integrated
      Intercom.registerUser();
    } else {
      isLoggedIn.value = false;
    }
    getCurrentLocation.value = await storage.getCurrentLocation();
    selectedState.value = await storage.getSelectedState();
    const checkThereIsOpenSpree = async () => {
      const response = await fetchOpenSpreeByHubId({
        status: 0,
        active: true,
        hub_id: selectedHub.value?.id || undefined
      })
        .then((res) => res)
        .catch((err) => err);
      if (response?.data?.getAllSprees?.length === 0) {
        const toast = await toastController.create({
          message: t('notif_no_spree_open'),
          cssClass: 'toast-close-spree',
          position: 'bottom',
          color: 'primary',
          duration: 2000
        });
        await toast.present();
      }
    };

    const getProducts = async () => {
      store.dispatch('b2c/setAllProducts', {
        allProducts: null
      });
      categories.value = null;

      fetchAllProducts({
        hubId: user?.id ? selectedHub.value?.id : undefined,
        state: user?.id
          ? user.country.description === 'Malaysia'
            ? selectedState.value.state
            : undefined
          : getCurrentLocation.value.country === 'Malaysia'
          ? selectedState.value.state
          : undefined,
        country: user?.id ? undefined : getCurrentLocation.value.country
      })
        .then((res) => {
          const newProducts = res.data.getAllProducts;

          store.dispatch('b2c/setAllProducts', {
            allProducts: newProducts
          });

          categories.value = newProducts.categories;
          if (newProducts.categories.length === 0) {
            isProducts.value = false;
          } else {
            isProducts.value = true;
          }

          if (newProducts.top_picks.length === 0) {
            showTopPicks.value = false;
          } else {
            showTopPicks.value = true;
          }
          if (newProducts.discounts.length === 0) {
            showHotDeals.value = false;
          } else {
            showHotDeals.value = true;
          }
          if (newProducts.volume_deals.length === 0) {
            showVolumeDeal.value = false;
          } else {
            showVolumeDeal.value = true;
          }
          Branch.trackViewItems('', 'Home');
          if (isServerDown.value) isServerDown.value = false;
        })
        .catch((error) => {
          if (error?.networkError?.statusCode >= 500) isServerDown.value = true;
          console.error(error);
        });
    };

    const getBannerImages = async () => {
      let countryName = user?.id ? user.country.description : getCurrentLocation.value.country;
      fetchBanners({
        publicationState: 'LIVE',
        where: { country: { name: countryName } },
        sort: 'country.name:asc,state.name:asc,banner_sequence:asc'
      })
        .then((res) => {
          if (countryName === 'Malaysia') {
            let filtered = res.data.banners.filter((banner) => {
              return banner.state.name === selectedState.value.state;
            });
            bannerArray.value = filtered;
          } else {
            bannerArray.value = res.data.banners;
          }
        })
        .catch((error) => {
          console.log(error);
        });
    };

    const checkForUpdate = () => {
      fetchAppVersion({ appType: 3 })
        .then(async (res) => {
          const appVersion = res?.data?.getAppVersion?.length ? res.data.getAppVersion[0] : undefined;
          if (appVersion) {
            let iosVersion = appVersion.ios;
            let androidVersion = appVersion.android;
            let hasUpdates = false;
            let storeURL = '';

            if (iosVersion !== meta.version && isPlatform('ios')) {
              hasUpdates = true;
              storeURL = 'https://apps.apple.com/us/app/treedots-group-buy/id1584629668';
            } else if (androidVersion !== meta.version && isPlatform('android')) {
              hasUpdates = true;
              storeURL = 'https://play.google.com/store/apps/details?id=com.thetreedots.social';
            }
            if (hasUpdates && storeURL) {
              const alert = await alertController.create({
                cssClass: 'alert-update-style',
                subHeader: 'New updates available!',
                message: 'We improved our GroupBuy app. Please update to continue',
                buttons: [
                  {
                    text: 'UPDATE',
                    handler: () => {
                      window.open(storeURL, '_system');
                    }
                  }
                ],
                backdropDismiss: false,
                animated: true
              });
              alert.present();
            }
          }
        })
        .catch((error) => console.error('Error - checkForUpdate', error));
    };

    const checkAvailableUpdate = async () => {
      try {
        const update = await Deploy.checkForUpdate();
        if (update.available) {
          const isProduction = process.env.VUE_APP_ENV === 'production';
          if (isProduction) {
            fetchAppVersion({ appType: 3 })
              .then(async (res) => {
                const appVersion = res?.data?.getAppVersion?.length ? res.data.getAppVersion[0] : undefined;
                if (appVersion) {
                  const targetVersion = appVersion.version;
                  if (targetVersion > meta.htmlVersion) {
                    showUpdateModal();
                  }
                }
              })
              .catch((error) => console.error('error - checkAvailableUpdate', error));
          } else {
            showUpdateModal();
          }
        }
      } catch (e) {
        console.log(e);
      }
    };

    const showUpdateModal = async () => {
      const alert = await alertController.create({
        header: t('update_modal_header'),
        message: t('update_modal_message'),
        backdropDismiss: false,
        buttons: [
          {
            text: 'UPDATE',
            handler: async () => {
              let name = 'Downloading';
              let percent = 0;
              const modal = await modalController.create({
                component: ProgressBarModal,
                componentProps: {
                  name,
                  percent
                }
              });
              modal.present();
              await Deploy.downloadUpdate((progress) => {
                percent = progress;
              });
              await Deploy.extractUpdate((progress) => {
                name = 'Install';
                percent = progress;
                if (process == 100) modal.dismiss();
              });
              await Deploy.reloadApp();
            }
          }
        ]
      });
      await alert.present();
    };

    const selectState = async (val) => {
      await storage.setCurrentLocation({ country: val.country });
      getCurrentLocation.value = { country: val.country };
      if (user?.country) {
        getCurrentLocation.value = { country: user.country.description };
        await storage.setCurrentLocation(getCurrentLocation.value);
      }
      await storage.setSelectedState({ state: val.state });
      selectedState.value = { state: val.state };
      setOpenSelectStateModal(false);
      isSelectedState.value = true;
      isCountryDisable.value = false;
      getProducts();
      getBannerImages();
      clevertap.recordEventWithNameAndProps('select_country', {
        country_name: val.country
      });
      clevertap.recordEventWithNameAndProps('select_state', {
        state_name: val.state
      });
    };

    let country = '';
    const key = process.env.VUE_APP_GOOGLEMAPS_KEY;
    const getLocationCountry = async () => {
      const coordinates = await Geolocation.getCurrentPosition();
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${key}&latlng=${coordinates.coords.latitude},${coordinates.coords.longitude}`;
      const geocodeResult = await fetch(geocodeUrl);
      const geocodeResultJson = await geocodeResult.json();
      if (geocodeResultJson.results[0]) {
        geocodeResultJson.results[0].address_components.forEach((item) => {
          if (item.types.includes('country')) {
            country = item.long_name;
          }
        });
      }
      const currentLocation = {
        country: country
      };
      getCurrentLocation.value = currentLocation;
      await storage.setCurrentLocation(currentLocation);
    };

    // Use try-catch to check permission because Geolocation API will throw an error if user turn off Location Service
    let geoPermission;
    try {
      geoPermission = await Geolocation.checkPermissions();
    } catch (error) {
      geoPermission = {};
    }
    if (user?.country) {
      // login user
      if (user.country.id === 193) {
        // Singapore login user
        isSelectedState.value = true;
        getProducts();
        getBannerImages();
      } else {
        // Malaysia login user
        if (user.country.id === 127 && selectedState.value?.state !== '') {
          isSelectedState.value = true;
          isProducts.value = true;
          getProducts();
          getBannerImages();
        } else {
          setOpenSelectStateModal(true);
        }
      }
    } else {
      // guest
      if (getCurrentLocation.value === null) {
        // guest first loading
        if (geoPermission.location === 'granted') {
          // geolocation access
          await getLocationCountry();
          if (getCurrentLocation.value?.country === 'Singapore') {
            // geolocation Singapore guest
            isSelectedState.value = true;
            getProducts();
            getBannerImages();
          } else {
            // geolocation Malaysia guest
            isSelectedState.value = false;
            isCountryDisable.value = false;
            setOpen(true);
          }
        } else {
          // geolocation blocked
          isSelectedState.value = false;
          isCountryDisable.value = false;
          setOpen(true);
        }
      } else if (getCurrentLocation.value.country === 'Malaysia') {
        // Malaysia guest
        if (selectedState.value === null) {
          isSelectedState.value = false;
          isCountryDisable.value = true;
          setOpen(true);
        } else {
          isSelectedState.value = true;
          getProducts();
          getBannerImages();
        }
      } else {
        // Singapore guest
        isSelectedState.value = true;
        getProducts();
        getBannerImages();
      }
    }

    return {
      storage,
      filterText,
      showBackToTop,
      clickToTop,
      getProducts,
      getBannerImages,
      chat_svg,
      location_svg,
      chat_fill_svg,
      location_click_svg,
      location_direction,
      getCurrentLocation,
      selectedState,
      click_location,
      offsetTop_mainCategoryList,
      activeScroll,
      sticky_home_category,
      categories,
      waIcon,
      router,
      prevScrollPos,
      isLoggedIn,
      nextScrollPos,
      isProducts,
      home_supplier_png,
      chevron_down,
      isNewMessage,
      closeCircleOutline,
      isCountryDisable,
      bannerArray,
      BannerItem,
      slideOpts,
      selectedHub,
      isOpenRef,
      isOpenSelectStateModal,
      isSelectedState,
      selectState,
      showTopPicks,
      showHotDeals,
      showVolumeDeal,
      setOpen,
      setOpenSelectStateModal,
      isServerDown
    };
  },
  methods: {
    openSelectStateModal() {
      this.setOpenSelectStateModal(true);
    },
    routeToPath(path) {
      this.$router.push({
        path: path
      });
    },
    clickSlide(data) {
      if (!data.DeepLink) return;
      if (isExternalBannerUrl(data.DeepLink)) {
        window.open(data.DeepLink, '_blank');
      } else {
        this.$router.push({ path: data.DeepLink });
      }
    },
    doRefresh(event) {
      this.showTopPicks = true;
      this.showHotDeals = true;
      this.showVolumeDeal = true;
      this.getProducts();
      this.getBannerImages();
      event.target.complete();
    },
    getScrollEvent: function (event) {
      if (!this.activeScroll) {
        this.offsetTop_mainCategoryList =
          document.querySelector('div.home-categories').offsetTop -
          document.querySelector('ion-header.homepageHeader').offsetTop;
        this.activeScroll = true;
      }
      if (this.offsetTop_mainCategoryList !== document.querySelector('div.home-categories').offsetTop)
        this.offsetTop_mainCategoryList =
          document.querySelector('div.home-categories').offsetTop -
          document.querySelector('ion-header.homepageHeader').offsetTop;
      if (event.detail.scrollTop > this.offsetTop_mainCategoryList) {
        this.sticky_home_category = false;
      } else {
        this.sticky_home_category = true;
      }
      this.nextScrollPos = event.detail.scrollTop;
      if (this.nextScrollPos < this.prevScrollPos && this.nextScrollPos > 1500) {
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
      document.querySelector('ion-content.homeContainer').scrollToTop(1500);
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
    scrollTo(index) {
      if (index > 0) {
        document
          .querySelector('ion-content.homeContainer')
          .scrollToPoint(0, document.querySelector('#categoryProduct-' + index).offsetTop - 80, 300);
      } else {
        document
          .querySelector('ion-content.homeContainer')
          .scrollToPoint(0, document.querySelector('#categoryProduct-' + index).offsetTop, 300);
      }
    },
    async gotoLogin() {
      await this.storage.setRedirectPath('/main/home');
      this.$router.push('/home');
    }
  }
});
</script>
<style scoped lang="scss">
@import 'home.module';
</style>

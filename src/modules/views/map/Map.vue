<template>
  <ion-page>
    <ion-header mode="md" class="map-header">
      <ion-toolbar mode="md">
        <ion-buttons slot="start">
          <ion-back-button mode="md" default-href="/main/home"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding">{{ $t('map.find_a_collection_point') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-no-padding map" scroll-y="false">
      <div class="hub-map ion-no-padding">
        <GMapMap
          ref="mapRef"
          :class="showHubList ? 'half-map' : 'full-map'"
          :center="center"
          :zoom="16.5"
          :options="{
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false
          }"
        >
          <GMapMarker
            :options="{
              position: customCenter,
              icon: pinIcon
            }"
          />
          <GMapMarker
            :options="{
              position: userLocation,
              icon: userLocationMarker
            }"
          />
          <GMapMarker
            v-for="(item, key) in items"
            :key="key"
            :options="{
              position: item.latlng,
              icon: getIcon(item.marker)
            }"
            @click="goToConfirmPage(item)"
          />
        </GMapMap>
        <div class="toogle">
          <div class="ion-float-left toogle-with-label ion-margin-end">
            <ion-label class="ion-padding-end">{{ $t('map.show_inactive') }}</ion-label>
            <ion-toggle mode="ios" v-model="toogleInactive"></ion-toggle>
          </div>
          <div class="ion-float-right toogle-with-label">
            <ion-label class="ion-padding-end">{{ $t('map.halal_only') }}</ion-label>
            <ion-toggle mode="ios" v-model="toogleHalal"></ion-toggle>
          </div>
        </div>
        <div class="bottom-drawer" ref="bottomDrawerRef">
          <div class="recenter">
            <div class="ion-float-left search-area" @click="searchThisArea" v-if="showSearchThisAreaControl">
              <ion-icon size="large" mode="ios" :icon="refresh"></ion-icon>
              <ion-label>{{ $t('map.search_this_area') }}</ion-label>
            </div>
            <div class="ion-float-right" @click="reCenter" v-if="showLocateMeControl">
              <ion-img :src="locateMe" class="locate-me"></ion-img>
            </div>
          </div>
          <div ref="swipeDrawerRef">
            <div class="btn-container">
              <div class="btn-swipe"></div>
            </div>
            <div class="ion-padding-start ion-padding-end ion-padding-bottom border-bottom">
              <div
                class="search-input"
                :placeholder="$t('map.enter_an_address_to_view_collection_points')"
                clear-input
                @click="isOpenSearchModal = true"
              >
                <p>{{ $t('map.enter_an_address_to_view_collection_points') }}</p>
                <ion-icon size="large" mode="ios" :icon="searchOutline"></ion-icon>
              </div>
            </div>
          </div>
          <p v-if="!isLoading && showHubList && items.length === 0" class="no-cp hub-list">
            {{ $t('map.no_collection_point_nearby') }}
          </p>
          <MapSkeleton :count="10" v-if="isLoading" />
          <ion-content :fullscreen="false" class="hub-list content-list">
            <ion-list v-if="items.length > 0">
              <ion-item v-for="(item, index) in items" v-bind:key="index" @click="goToConfirmPage(item)">
                <div slot="start" class="ion-no-margin ion-margin-end">
                  <ion-thumbnail class="ion-margin-start ion-margin-end">
                    <ion-img :src="item.advocateImage"></ion-img>
                  </ion-thumbnail>
                </div>
                <ion-label class="ion-text-wrap">
                  <p>
                    <span :class="item.spreeClosed ? 'closed' : ''" class="nametext">{{
                      item.advocateName
                    }}</span>
                    <span class="ion-float-right" v-if="item.is_private"
                      ><span class="sub-text">{{ $t('map.friends_only') + ' ' }}</span
                      ><ion-icon :icon="lockClosed"></ion-icon
                    ></span>
                  </p>
                  <h2 :class="item.spreeClosed ? 'closed' : ''">
                    {{ item.road.trim() }}, {{ item.city }}
                    {{ item.postal_code }}
                  </h2>
                  <p :class="item.spreeClosed ? 'closed' : 'open'">
                    {{ item.distance }} {{ $t('map.km') }}
                    <span v-if="item.halal_products" class="halal ion-float-right">{{
                      $t('map.halal')
                    }}</span>
                  </p>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-content>
        </div>
      </div>
      <ion-modal
        :is-open="isOpenConfirmModal"
        @didDismiss="isOpenConfirmModal = false"
        css-class="cp-confirm"
      >
        <MapConfirm @close="isOpenConfirmModal = false" :selectedCP="selectedItem" />
      </ion-modal>
      <ion-modal
        :is-open="isOpenSearchModal"
        @didDismiss="isOpenSearchModal = false"
        css-class="cp-search"
        :swipe-to-close="true"
      >
        <MapSearch @close="isOpenSearchModal = false" />
      </ion-modal>
    </ion-content>
    <ion-modal
      :is-open="isOpenLocationPermissionModal"
      css-class="location-permission-modal"
      @didDismiss="isOpenLocationPermissionModal = false"
      backdrop-dismiss="false"
    >
      <location-permission-modal @allow-location="allowLocationPermission" @use-postal-code="usePostalCode" />
    </ion-modal>
  </ion-page>
</template>

<script>
/* eslint-disable no-undef */
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import {
  IonPage,
  IonContent,
  IonBackButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonList,
  IonItem,
  IonToggle,
  IonImg,
  IonThumbnail,
  IonIcon,
  IonModal,
  onIonViewWillEnter,
  onIonViewDidEnter,
  createGesture
} from '@ionic/vue';
import { refresh, searchOutline } from 'ionicons/icons';
import { defineComponent, ref, inject, watch } from 'vue';
import { Geolocation } from '@capacitor/geolocation';
import { useMutation } from '@vue/apollo-composable';
import { getCPByDistance } from '@/services/shared/graphql/chooseHub';
import LocationPermissionModal from '@/components/LocationPermission';
import MapConfirm from './MapConfirm.vue';
import MapSearch from './MapSearch.vue';
import MapSkeleton from './mapSkeleton.vue';
import locateMe from '@/assets/icons/map/locate.png';
import inactiveHubOnList from '@/assets/icons/map/inactiveHubOnList.png';
import pinIcon from '@/assets/icons/map/pinIcon.png';
import mapMarkerActive from '@/assets/icons/map/cp-active.png';
import mapMarker from '@/assets/icons/map/cp-inactive.png';
import mapMarkerActivePrivate from '@/assets/icons/map/cp-active-private.png';
import mapMarkerPrivate from '@/assets/icons/map/cp-inactive-private.png';
import defaultUserAvatar from '@/assets/icons/map/defaultPIC.png';
import myLocIcon from '@/assets/icons/map/my-loc.png';
import userLocationMarker from '@/assets/icons/map/userLocationMarker.png';
import { lockClosed } from 'ionicons/icons';

export default defineComponent({
  name: 'Map',
  components: {
    IonPage,
    IonContent,
    IonBackButton,
    IonButtons,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonLabel,
    IonList,
    IonItem,
    IonToggle,
    IonImg,
    IonThumbnail,
    IonIcon,
    IonModal,
    MapConfirm,
    MapSearch,
    MapSkeleton,
    LocationPermissionModal
  },
  data() {
    return {
      centerOfMap: null
    };
  },
  setup() {
    const storage = inject('$storage');
    const user = ref();
    const store = useStore();
    const router = useRouter();
    const showHubList = ref(true);
    const center = ref(store.getters['b2c/getOrigin'] || { lat: 0, lng: 0 });
    const customCenter = ref(store.getters['b2c/getCustomOrigin']);
    const userLocation = ref(store.getters['b2c/getOrigin']);
    const pinHubLocation = null;
    const origin = '';
    const items = ref([]);
    const isOpenConfirmModal = ref(false);
    const isOpenSearchModal = ref(false);
    const isOpenLocationPermissionModal = ref(false);
    watch(isOpenSearchModal, () => {
      if (!isOpenSearchModal.value) {
        bottomDrawerRef.value.style.transform = `translateY(0px)`;
        customCenter.value = store.getters['b2c/getCustomOrigin'];
        center.value = customCenter.value ? customCenter.value : center.value;
        getData();
      } else {
        setTimeout(() => {
          const ionInputEl = document.querySelector('ion-input');
          ionInputEl.setFocus();
        }, 1000);
      }
    });
    const selectedItem = ref(null);
    const isLoading = ref(false);
    const showLocateMeControl = ref(false);
    const showSearchThisAreaControl = ref(false);

    onIonViewWillEnter(async () => {
      store.dispatch('b2c/setCustomOrigin', null);
      user.value = await storage.getUser();
      const locationPermissionResult = await Geolocation.requestPermissions();
      if (locationPermissionResult.location === 'granted') {
        getCurrentPosition();
      } else {
        const postalCode = await storage.getPostalCode();
        if (postalCode === null) {
          isOpenLocationPermissionModal.value = true;
        }
      }
      getData();
    });

    const allowLocationPermission = async () => {
      try {
        const locationPermissionResult = await Geolocation.requestPermissions();
        if (locationPermissionResult.location === 'granted') {
          isOpenLocationPermissionModal.value = false;
          await getCurrentPosition();
          getData();
        }
      } catch (error) {
        console.error(error);
      }
    };

    const getMarkers = (item) => {
      let iconUrl = item.spreeClosed ? mapMarker : mapMarkerActive;
      if (item.is_private) {
        iconUrl = item.spreeClosed ? mapMarkerPrivate : mapMarkerActivePrivate;
      }
      return iconUrl;
    };

    const { mutate: searchHubResults } = useMutation(getCPByDistance);

    const getData = async (latlng = null) => {
      bottomDrawerRef.value.style.top = '60%';
      isLoading.value = true;
      user.value = await storage.getUser();
      const postalCode = await storage.getPostalCode();
      const location = latlng ? latlng : center.value;
      searchHubResults({
        countryId: user.value.country.id,
        onlyOpen: !toogleInactive.value,
        onlyHalal: toogleHalal.value,
        lat: location.lat,
        lng: location.lng,
        postalCode,
        distance: user.value.country.id == '127' ? 10 : 3 // in Km
      }).then((res) => {
        if (res && res.data.getCPByDistance) {
          items.value = [];
          const hubs = res.data.getCPByDistance;
          hubs.forEach((hub) => {
            hub.distance = `${Number(!isNaN(hub.distance) ? hub.distance : 0).toFixed(1)}`;

            hub.spreeClosed = hub.hubSpreeData ? hub.hubSpreeData.Status !== 0 : true;
            hub.marker = getMarkers(hub);
            let newHub = {
              advocateName: 'Host',
              advocateImage: defaultUserAvatar
            };
            if (hub.advocateList.length > 0) {
              hub.advocateList.forEach((advocate) => {
                newHub.advocateName = advocate.first_name.split(' ')[0];
                newHub.advocateImage = defaultUserAvatar;
                items.value.push({ ...hub, ...newHub });
              });
            } else {
              hub.advocateName = 'Host';
              hub.advocateImage = defaultUserAvatar;
              items.value.push(hub);
            }
          });
        } else {
          items.value = [];
        }
        isLoading.value = false;
      });
    };

    const getCurrentPosition = async () => {
      const coordinates = await Geolocation.getCurrentPosition();
      userLocation.value = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };
      center.value = userLocation.value;
      store.dispatch('b2c/setOrigin', center.value);
      return coordinates;
    };

    const goToConfirmPage = (item) => {
      selectedItem.value = item;
      isOpenConfirmModal.value = true;
    };

    const toogleInactive = ref(false);
    watch(toogleInactive, () => {
      showHubList.value = true;
      getData();
    });

    const toogleHalal = ref(false);
    watch(toogleHalal, () => {
      showHubList.value = true;
      getData();
    });

    const mapRef = ref();
    watch(mapRef, (googleMap) => {
      if (googleMap) {
        googleMap.$mapPromise.then((map) => {
          google.maps.event.addListener(map, 'dragstart', () => {
            showHubList.value = false;
            showLocateMeControl.value = true;
            showSearchThisAreaControl.value = true;
            bottomDrawerRef.value.style.transition = '.3s ease-out';
            bottomDrawerRef.value.style.top = `${windowHeight - 90 - getheaderHeight()}px`;
          });
          google.maps.event.addListener(map, 'click', (e) => {
            showHubList.value = true;
            const latlng = { lat: e.latLng.lat(), lng: e.latLng.lng() };
            customCenter.value = latlng;
            store.dispatch('b2c/setCustomOrigin', latlng);
            getData(latlng);
            center.value = latlng;
          });
        });
      }
    });
    const getheaderHeight = () => document.querySelector('.map-header').offsetHeight;
    const windowHeight = window.innerHeight;
    const bottomDrawerRef = ref();
    const swipeDrawerRef = ref();
    let state = 'middle';
    onIonViewDidEnter(() => {
      const gesture = createGesture({
        el: swipeDrawerRef.value,
        gestureName: 'hub-list-swipe',
        direction: 'y',
        onStart: () => {
          bottomDrawerRef.value.style.transition = 'none';
        },
        onMove: (ev) => {
          const hubListEl = document.querySelector('.content-list');
          const drawerTop = bottomDrawerRef.value.offsetTop;
          if (ev.deltaY <= -drawerTop || ev.deltaY > drawerTop) return;
          if (ev.deltaY < 0 && state === 'middle') {
            bottomDrawerRef.value.style.transform = `translateY(${ev.deltaY}px)`;
            hubListEl.style.height = `${windowHeight - 90 - getheaderHeight()}px`;
          } else if (state === 'top') {
            if (ev.deltaY < 0) return;
            bottomDrawerRef.value.style.transform = `translateY(calc(${ev.deltaY}px - ${drawerTop}px))`;
          }
        },
        onEnd: (ev) => {
          const hubListEl = document.querySelector('.content-list');
          const drawerTop = bottomDrawerRef.value.offsetTop;
          bottomDrawerRef.value.style.transition = '.3s ease-out';
          if (ev.deltaY < -(drawerTop / 20) && state === 'middle') {
            bottomDrawerRef.value.style.transform = `translateY(-${drawerTop}px)`;
            state = 'top';
          } else if (ev.deltaY < drawerTop / 20 && state === 'top') {
            bottomDrawerRef.value.style.transform = `translateY(-${drawerTop}px)`;
            hubListEl.style.height = `${windowHeight - drawerTop - 90 - getheaderHeight()}px`;
            state = 'top';
          } else if (ev.deltaY > drawerTop / 20 && state === 'top') {
            bottomDrawerRef.value.style.transform = `translateY(0px)`;
            hubListEl.style.height = `${windowHeight - drawerTop - 90 - getheaderHeight()}px`;
            state = 'middle';
          } else {
            bottomDrawerRef.value.style.transform = `translateY(0px)`;
            state = 'middle';
          }
        }
      });

      gesture.enable();
    });

    return {
      storage,
      bottomDrawerRef,
      swipeDrawerRef,
      mapRef,
      getCurrentPosition,
      goToConfirmPage,
      store,
      router,
      showHubList,
      toogleInactive,
      toogleHalal,
      center,
      customCenter,
      inactiveHubOnList,
      pinIcon,
      mapMarkerActive,
      mapMarker,
      mapMarkerActivePrivate,
      mapMarkerPrivate,
      defaultUserAvatar,
      myLocIcon,
      userLocationMarker,
      userLocation,
      pinHubLocation,
      origin,
      items,
      getMarkers,
      refresh,
      searchOutline,
      getData,
      isOpenConfirmModal,
      isOpenSearchModal,
      selectedItem,
      isOpenLocationPermissionModal,
      allowLocationPermission,
      isLoading,
      showLocateMeControl,
      showSearchThisAreaControl,
      lockClosed,
      locateMe
    };
  },
  methods: {
    getIcon(iconUrl) {
      return {
        url: iconUrl,
        scaledSize: new google.maps.Size(28, 28),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 0)
      };
    },
    setCenterOfMap() {
      this.$refs.mapRef.$mapPromise.then((map) => {
        this.center = {
          lat: map.getCenter().lat(),
          lng: map.getCenter().lng()
        };
        this.customCenter = this.center;
        this.store.dispatch('b2c/setCustomOrigin', this.center);
      });
    },
    usePostalCode(postalCode) {
      this.storage.setPostalCode(postalCode);
      this.isOpenLocationPermissionModal = false;
      const key = process.env.VUE_APP_GOOGLEMAPS_KEY;
      fetch('https://maps.googleapis.com/maps/api/geocode/json?address=' + postalCode + '&key=' + key)
        .then((response) => response.json())
        .then(async (data) => {
          if (data.results.length > 0) {
            const lat = data.results[0].geometry.location.lat;
            const lng = data.results[0].geometry.location.lng;
            const userLocation = { lat, lng };
            await this.$store.dispatch('b2c/setOrigin', userLocation);
            const bounds = new google.maps.LatLngBounds();
            const userLoc = new google.maps.LatLng(userLocation.lat, userLocation.lng);
            bounds.extend(userLoc);
            this.$refs.mapRef.$mapPromise.then((map) => {
              map.fitBounds(bounds);
              map.panToBounds(bounds);
              map.setZoom(16.5);
            });
            this.getData(userLocation);
            this.showLocateMeControl = false;
            this.showSearchThisAreaControl = false;
          }
        });
    },
    reCenter() {
      this.showHubList = true;
      this.getCurrentPosition();
      const userLocation = this.store.getters['b2c/getOrigin'];
      const bounds = new google.maps.LatLngBounds();
      const userLoc = new google.maps.LatLng(userLocation.lat, userLocation.lng);
      bounds.extend(userLoc);
      this.$refs.mapRef.$mapPromise.then((map) => {
        map.fitBounds(bounds);
        map.panToBounds(bounds);
        map.setZoom(16.5);
      });
      this.getData(userLocation);
      this.showLocateMeControl = false;
      this.showSearchThisAreaControl = false;
    },
    searchThisArea() {
      this.showHubList = true;
      this.setCenterOfMap();
      this.getData(this.center);
      this.showSearchThisAreaControl = false;
    }
  }
});
</script>
<style scoped lang="scss">
@import 'map.module';
</style>

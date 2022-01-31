<template>
  <ion-page>
    <ion-header mode="md" class="ion-no-border">
      <ion-toolbar mode="md">
        <ion-input
          class="search-input ion-margin type-padding"
          :placeholder="$t('map.enter_an_address_to_view_collection_points')"
          v-model="inputValue"
          @ionInput="search($event.target.value)"
        >
          <ion-button expand="block" mode="md" fill="clear" @click="closeSearchModal()">
            <ion-icon slot="icon-only" :icon="arrowBack"></ion-icon>
          </ion-button>
          <div class="right-btn">
            <ion-icon v-if="!isTyping" size="large" mode="ios" :icon="searchOutline"></ion-icon>
          </div>
          <ion-button expand="block" mode="md" fill="clear" class="right-btn" @click="clearInput()">
            <ion-icon v-if="isTyping" size="large" mode="ios" :icon="closeCircleOutline"></ion-icon>
          </ion-button>
        </ion-input>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen scroll-y="false">
      <div class="deselect" v-if="lastSelectedCP">
        <ion-img class="pin-deselect" :src="pinDeselect"></ion-img>
        <ion-label class="hub-name"
          >{{ lastSelectedCP.road.trim() }}, {{ lastSelectedCP.city }}
          {{ lastSelectedCP.postal_code }}</ion-label
        >
        <ion-label class="button-deselect" @click="deselect">{{ $t('map.delelect') }}</ion-label>
      </div>
      <div @click="selectCurrentLocation" class="my-location-btn">
        <ion-img :src="locateMe" class="collection-point-near-me"></ion-img>
        <ion-label>{{ $t('map.collection_point_near_me') }}</ion-label>
      </div>
      <div class="map-search-result">
        <ion-label>{{ $t('map.search_results') }}</ion-label>
      </div>

      <ion-content :fullscreen="false">
        <ion-list>
          <ion-item
            v-for="(item, index) in filterData"
            v-bind:key="index"
            @click="selectLocation(item.description)"
          >
            <div slot="start" class="ion-no-margin ion-margin">
              <ion-img class="pin-deselect" :src="cpLocation"></ion-img>
            </div>
            <ion-label class="ion-text-wrap">
              <h2 class="description">{{ item.description }}</h2>
              <p v-if="item.distance_meters">
                {{ Number(Number(item.distance_meters) / 1000).toFixed(1) }} {{ $t('map.km') }}
              </p>
            </ion-label>
            <div slot="end" class="ion-no-margin ion-margin">
              <ion-img class="pin-deselect" :src="customArrow"></ion-img>
            </div>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-content>
  </ion-page>
</template>

<script>
/* eslint-disable no-undef */
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonButton,
  IonContent,
  IonLabel,
  IonIcon,
  IonList,
  IonItem,
  toastController,
  IonImg,
  IonInput
} from '@ionic/vue';
import { location, locationOutline, searchOutline, closeCircleOutline } from 'ionicons/icons';
import { defineComponent, ref, inject } from 'vue';
import { Geolocation } from '@capacitor/geolocation';
import { useStore } from 'vuex';
import { arrowBack } from 'ionicons/icons';
import pinDeselect from '@/assets/icons/map/deselect.png';
import locateMe from '@/assets/icons/map/locate.png';
import customArrow from '@/assets/icons/map/select-cp-arrow.png';
import cpLocation from '@/assets/icons/map/select-cp-location.png';

export default defineComponent({
  name: 'MapSearch',
  components: {
    IonPage,
    IonHeader,
    IonToolbar,
    IonButton,
    IonContent,
    IonLabel,
    IonIcon,
    IonList,
    IonItem,
    IonImg,
    IonInput
  },
  data() {
    return {
      inputValue: ''
    };
  },
  setup(props, { emit }) {
    const storage = inject('$storage');
    const store = useStore();
    const user = ref();
    const mapRef = ref();
    const key = process.env.VUE_APP_GOOGLEMAPS_KEY;
    const center = ref(null);
    const filterData = ref([]);
    const lastSelectedCP = ref(null);
    const isTyping = ref(false);

    (async () => {
      user.value = await storage.getUser();
    })();

    const selectCurrentLocation = async () => {
      const coordinates = await Geolocation.getCurrentPosition();
      center.value = {
        lat: coordinates.coords.latitude,
        lng: coordinates.coords.longitude
      };
      store.dispatch('b2c/setCustomOrigin', center.value);
      emit('close');
    };

    /**
     * getting lat and lng from address
     * using geocode service API
     */
    const selectLocation = async (address) => {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?key=${key}&address=${address}`;
      const geocodeResult = await fetch(geocodeUrl);
      const geocodeResultJson = await geocodeResult.json();
      if (geocodeResultJson.status === 'OK') {
        const lat = await geocodeResultJson.results[0].geometry.location.lat;
        const lng = await geocodeResultJson.results[0].geometry.location.lng;
        store.dispatch('b2c/setCustomOrigin', { lat, lng });
        emit('close');
      }
    };

    const search = (val) => {
      if (val) {
        isTyping.value = true;
        const displaySuggestions = (predictions, status) => {
          if (status != google.maps.places.PlacesServiceStatus.OK || !predictions) {
            filterData.value = [];
            return;
          }
          filterData.value = [];
          let i = 1;
          predictions.forEach((prediction) => {
            prediction.id = i;
            filterData.value.push(prediction);
            i++;
          });
        };

        const origin = store.getters['b2c/getOrigin'];
        const sessionToken = new google.maps.places.AutocompleteSessionToken();
        const autocompleteService = new google.maps.places.AutocompleteService();
        autocompleteService.getPlacePredictions(
          {
            input: val,
            componentRestrictions: {
              country: user.value.country.name
            },
            origin: origin,
            sessionToken: sessionToken
          },
          displaySuggestions
        );
      } else {
        isTyping.value = false;
        filterData.value = [];
      }
    };

    lastSelectedCP.value = store.getters['b2c/getSelectedHub'];

    return {
      store,
      lastSelectedCP,
      mapRef,
      search,
      filterData,
      location,
      locationOutline,
      selectCurrentLocation,
      selectLocation,
      arrowBack,
      searchOutline,
      closeCircleOutline,
      isTyping,
      pinDeselect,
      locateMe,
      customArrow,
      cpLocation
    };
  },
  methods: {
    async deselect() {
      this.lastSelectedCP = null;
      const toast = await toastController.create({
        message: this.$t('map.not_connected_to_cp'),
        cssClass: 'toast-deselect',
        position: 'bottom',
        color: 'primary',
        duration: 2000,
        buttons: [
          {
            text: this.$t('map.dismiss'),
            role: 'cancel'
          }
        ]
      });
      await toast.present();

      this.store.dispatch('b2c/setSelectedHub', null);
      this.store.dispatch('b2c/setActiveAllProduct', true);
    },
    closeSearchModal() {
      this.$emit('close');
    },
    clearInput() {
      this.inputValue = '';
      this.isTyping = false;
    }
  }
});
</script>
<style scoped lang="scss">
@import 'mapSearch.module';
</style>

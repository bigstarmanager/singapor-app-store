<template>
  <ion-app ref="ionApp">
    <Suspense>
      <template #default>
        <ion-router-outlet />
      </template>
      <template #fallback> </template>
    </Suspense>
  </ion-app>
</template>

<script>
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent, provide, ref, inject, onMounted, onBeforeUnmount } from 'vue';
import { Geolocation } from '@capacitor/geolocation';
import clevertap from '@/services/shared/helper/clevertap';
import logrocket from '@/services/shared/helper/logrocket';
export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet
  },
  setup() {
    onMounted(() => {
      clevertap.initialize();
      (async () => {
        const user = await storage.getUser();
        user &&
          logrocket.identifyUser({
            id: user.id,
            name: user.first_name + ' ' + user.last_name,
            phone: user.mobile,
            signInMethod: 'SYNC',
            user_type_id: user.user_type_id
          });
      })();
    });
    onBeforeUnmount(() => {
      clevertap.uninitialize();
    });
    // This is added to allow overlays to be appended
    // under the current ion-app.
    const storage = inject('$storage');

    let country = '';
    const key = process.env.VUE_APP_GOOGLEMAPS_KEY;
    let storeLocation = {};
    const getLocationFromStorage = async () => {
      if (!storeLocation) {
        getLocationState();
      }
    };

    const getLocationState = async () => {
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
      storage.setCurrentLocation(currentLocation);
    };
    if (storeLocation === null) {
      getLocationFromStorage();
    }

    const ionApp = ref(null);
    provide('$ionApp', ionApp);

    return {
      ionApp
    };
  }
});
</script>

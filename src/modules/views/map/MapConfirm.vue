<template>
  <ion-page>
    <ion-content class="ion-no-padding map" scroll-y="false">
      <ion-fab vertical="top" horizontal="start" slot="fixed" @click="closeConfirmModal()">
        <ion-fab-button color="light">
          <ion-icon :icon="arrowBack"></ion-icon>
        </ion-fab-button>
      </ion-fab>
      <div class="hub-map ion-no-padding">
        <GMapMap
          class="map-confirm"
          :center="center"
          :zoom="20"
          :options="{
            zoomControl: false,
            mapTypeControl: false,
            scaleControl: false,
            streetViewControl: false,
            rotateControl: false,
            fullscreenControl: false,
            gestureHandling: 'none'
          }"
        >
          <GMapMarker :options="{ position: center, icon: selectedCP.marker }" />
          <GMapMarker :options="{ position: center, icon: getPinIcon(pinIcon) }" />
        </GMapMap>
        <section class="confirm-section">
          <div class="header-details">
            <div class="header-image">
              <ion-img class="img-host" :src="selectedCP.advocateImage"></ion-img>
            </div>
            <div class="header-name">
              <span class="cp-name">{{ selectedCP.advocateName }}</span>
              <div class="friends-only-container" v-if="selectedCP.is_private">
                <ion-icon :icon="lockClosed"></ion-icon>
                <span class="sub-text">{{ $t('map.friends_only') }}</span>
              </div>
              <span class="contact-body">
                {{ selectedCP.road.trim() }}, {{ selectedCP.city }}
                {{ selectedCP.postal_code }}
              </span>
              <span class="sub-text"> {{ selectedCP.distance }} {{ $t('map.km') }} </span>
              <span v-if="selectedCP.halal_products" class="ion-text-end sub-text">
                {{ $t('map.halal') }}
              </span>
            </div>
          </div>

          <p v-if="selectedCP.spreeClosed" class="ion-text-center fz-14">
            {{ $t('map.not_open_for_orders_right_now') }}
          </p>
          <div class="private-form" v-if="selectedCP.is_private">
            <div class="private-warning">
              <ion-row>
                <ion-col size="1">
                  <ion-img :src="infoIcon" />
                </ion-col>
                <ion-col size="11">
                  <span class="private-warning-text">{{ $t('map.prefer_buyers_know') }}</span>
                </ion-col>
              </ion-row>
            </div>
            <ion-input
              v-model="password"
              class="private-input"
              type="password"
              :placeholder="$t('map.enter_password')"
            ></ion-input>
            <span class="fail-login" v-if="error_message === true && password !== ''">{{ message }}</span>
          </div>
          <ion-button
            :disabled="selectedCP.is_private && password === '' ? true : false"
            class="ion-no-margin"
            expand="block"
            mode="ios"
            @click="!selectedCP.is_private ? confrimCP(selectedCP) : confirmPrivateCP(selectedCP)"
            ><span v-if="!isLoading">{{ $t('map.confirm') }}</span>
            <ion-spinner v-if="isLoading"></ion-spinner
          ></ion-button>
        </section>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
/* eslint-disable no-undef */
import { useRouter, useRoute } from 'vue-router';
import { useStore } from 'vuex';
import {
  IonPage,
  IonContent,
  IonFab,
  IonFabButton,
  IonIcon,
  IonImg,
  IonInput,
  IonButton,
  modalController,
  IonSpinner
} from '@ionic/vue';
import { defineComponent, watch } from 'vue';
import { alertController } from '@ionic/core';
import { arrowBack } from 'ionicons/icons';
import { lockClosed, informationCircleOutline } from 'ionicons/icons';
import { useMutation } from '@vue/apollo-composable';
import { mutationChooseHub, signInPrivateHub } from '@/services/shared/graphql/chooseHub';
import MapWelcome from './MapWelcome';
import Branch from '@/services/shared/helper/branch';
import Intercom from '@/services/shared/helper/intercom';
import clevertap from '@/services/shared/helper/clevertap';
import pinIcon from '@/assets/icons/map/pinIcon.png';
import infoIcon from '@/assets/icons/map/info.svg';

export default defineComponent({
  name: 'MapConfirm',
  components: {
    IonPage,
    IonContent,
    IonFab,
    IonFabButton,
    IonIcon,
    IonImg,
    IonInput,
    IonButton,
    IonSpinner
  },
  props: {
    selectedCP: { type: Object }
  },
  data() {
    return {
      password: '',
      error_message: false,
      message: '',
      isLoading: false
    };
  },
  setup(props) {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const center = {
      lat: props.selectedCP.latlng.lat,
      lng: props.selectedCP.latlng.lng
    };
    const { mutate: chooseHub } = useMutation(mutationChooseHub);
    const { mutate: signInPrivateCP } = useMutation(signInPrivateHub);

    return {
      watch,
      store,
      router,
      route,
      center,
      arrowBack,
      chooseHub,
      signInPrivateCP,
      pinIcon,
      lockClosed,
      informationCircleOutline,
      infoIcon
    };
  },
  watch: {
    password(password) {
      if (password === '') this.message = '';
    }
  },
  methods: {
    getPinIcon(iconUrl) {
      return {
        url: iconUrl,
        scaledSize: new google.maps.Size(25, 50),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(12, 100)
      };
    },
    confirmPrivateCP(item) {
      this.isLoading = true;
      this.signInPrivateCP({
        identity: item.id,
        password: this.password
      })
        .then(async (res) => {
          if (res.data.signInPrivateHub === true) {
            this.confrimCP(item);
          }
        })
        .catch((err) => {
          this.isLoading = false;
          const { graphQLErrors } = err;
          this.error_message = true;
          this.message = graphQLErrors.length > 0 ? graphQLErrors[0].message : err.message;
        });
    },
    confrimCP(item) {
      this.isLoading = true;
      if (item.spreeClosed) {
        return alertController
          .create({
            cssClass: 'confirm-cp-modal',
            header: this.$t('map.collection_point_is_inactive'),
            message: this.$t('map.popup_message'),
            buttons: [
              {
                text: this.$t('map.cancel'),
                role: 'cancel',
                handler: () => {
                  this.isLoading = false;
                }
              },
              {
                text: this.$t('map.continue'),
                handler: () => {
                  this.activeCP(item);
                }
              }
            ]
          })
          .then((a) => a.present());
      } else {
        this.activeCP(item);
      }
    },
    async activeCP(item) {
      const info = {
        title: this.$t('map.welcome_title', { cp_name: item.road }),
        message: this.$t('map.welcome_message'),
        close: this.$t('map.welcome_close'),
        join: this.$t('map.welcome_join_now'),
        waLink: item.whatsapp_link
      };
      this.chooseHub({
        hubId: item.id
      })
        .then(async (res) => {
          const { joinHub = {} } = res.data;
          if (joinHub.success) {
            const selectedHub = this.store.getters['b2c/getSelectedHub'];
            this.store.dispatch('b2c/setPreviousHub', selectedHub);
            this.store.dispatch('b2c/setSelectedHub', item);
            this.store.dispatch('b2c/setActiveAllProduct', false);
            this.store.dispatch('b2c/setApplicationState', { refetchCart: true });
            /** track last joined hub */
            clevertap.setLastJoinedHub(item);
          }
          this.router.back();
          this.$emit('close');
          setTimeout(() => {
            this.showWelcomeMessage(info);
            Branch.sendBranchEvent(Branch.events.JOIN_HUB);
            Intercom.trackEvent(Intercom.events.JOIN_COLLECTION_POINT, { collection_point: item.alias_name });
          }, 2000);
        })
        .catch()
        .finally(() => {});
    },
    closeConfirmModal() {
      this.$emit('close');
    },
    async showWelcomeMessage(info) {
      const modal = await modalController.create({
        component: MapWelcome,
        cssClass: 'map-welcome',
        componentProps: info,
        mode: 'ios'
      });
      return modal.present();
    }
  }
});
</script>
<style scoped lang="scss">
@import 'mapConfirm.module';
</style>

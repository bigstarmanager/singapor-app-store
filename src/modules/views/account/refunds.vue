<template>
  <ion-page>
    <ion-header class="header padding-x ion-no-border">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/account"></ion-back-button>
        </ion-buttons>
        <p class="appbar-title">{{ $t('refunds') }}</p>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row class="margin-y ion-align-items-center ion-justify-content-center">
        <ion-img :src="logo" style="height: 27px" />
        <p class="titleRefunds">{{ $t('refunds_policy.title') }}</p>
      </ion-row>
      <div class="content-padding space-bottom">
        <div class="text-item space-content">{{ $t('refunds_policy.p1') }}</div>
        <div class="text-item space-content">{{ $t('refunds_policy.p2') }}</div>
        <div class="text-item space-content">
          {{ $t('refunds_policy.p3') }}
          <br />
          <br />
          <ion-row class="text-item">
            <ion-col class="space-left"><div>•</div></ion-col>
            <ion-col
              ><div>{{ $t('refunds_policy.p3_1') }}</div></ion-col
            >
          </ion-row>
          <ion-row class="text-item">
            <ion-col class="space-left"><div>•</div></ion-col>
            <ion-col
              ><div>{{ $t('refunds_policy.p3_2') }}</div></ion-col
            >
          </ion-row>
          <ion-row class="text-item">
            <ion-col class="space-left"><div>•</div></ion-col>
            <ion-col
              ><div>{{ $t('refunds_policy.p3_3') }}</div></ion-col
            >
          </ion-row>
          <ion-row class="text-item">
            <ion-col class="space-left"><div>•</div></ion-col>
            <ion-col
              ><div>{{ $t('refunds_policy.p3_4') }}</div></ion-col
            >
          </ion-row>
        </div>
        <div class="space-content">
          <ion-router-link class="text-item">{{ $t('refunds_policy.p4a') }}</ion-router-link>
          <ion-router-link class="text-item-bold">{{ $t('refunds_policy.refunds_take') }}</ion-router-link>
          <ion-router-link class="text-item">{{ $t('refunds_policy.p4b') }}</ion-router-link>
        </div>
        <p class="text-item space-content">{{ $t('refunds_policy.p5') }}</p>
        <ion-router-link class="text-item">{{ $t('refunds_policy.p6') }}</ion-router-link>
        <ion-router-link
          v-if="country == 193"
          class="text-item-clicked"
          href="tel:+65 3138 4846"
          target="_blank"
          >{{ $t('refunds_policy.tech_call') }}</ion-router-link
        >
        <ion-router-link v-if="country == 193" class="text-item">{{
          $t('refunds_policy.or')
        }}</ion-router-link>
        <ion-router-link
          class="text-item-clicked"
          :href="country == 193 ? 'https://wa.me/6531384846' : 'https://wa.me/6589145600'"
          target="_blank"
          >{{
            country == 193 ? $t('refunds_policy.whatsapp_sg') : $t('refunds_policy.whatsapp_my')
          }}</ion-router-link
        >
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonImg,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonToolbar,
  IonPage,
  IonRow,
  IonCol
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { defineComponent, inject } from 'vue';
import logo from '@/assets/icons/account/logo.jpg';

export default defineComponent({
  name: 'privacy-policy',
  components: {
    IonImg,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonToolbar,
    IonPage,
    IonRow,
    IonCol
  },

  data() {
    return {
      user: null,
      country: null
    };
  },

  setup() {
    return {
      arrowBackOutline,
      logo
    };
  },

  async created() {
    this.user = inject('$storage')
      .getUser()
      .then((res) => {
        this.user = res;
        this.country = this.user.country.id;
      });
  }
});
</script>

<style scoped lang="scss">
@import 'refunds.module';
</style>

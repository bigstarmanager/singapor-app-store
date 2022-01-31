<template>
  <ion-page>
    <ion-header class="header padding-x ion-no-border">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/account"></ion-back-button>
        </ion-buttons>
        <p class="appbar-title">{{ $t('privacy') }}</p>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row class="ion-align-items-center ion-justify-content-center">
        <ion-img :src="logo" style="height: 27px" />
        <p class="text-item-black titlePrivacy">{{ $t('privacy_policy.title') }}</p>
      </ion-row>
      <div class="text-item padding-x margin-y">
        {{ $t('privacy_policy.effective') }}
      </div>
      <div class="space"></div>
      <div>
        <p class="text-item-black padding-x">{{ $t('privacy_policy.intro') }}</p>
        <p class="text-item column-left">
          {{ $t('privacy_policy.p1') }}
          <br />
          <br />
          {{ $t('privacy_policy.p1_1') }}
          <br />
          <br />
          {{ $t('privacy_policy.p1_2') }}
          <br />
          <br />
          {{ $t('privacy_policy.p1_3') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('privacy_policy.collection') }}</p>
        <p class="text-item column-left">
          {{ $t('privacy_policy.p2_1') }}<br />
          {{ $t('privacy_policy.p2_1a') }}<br />
          {{ $t('privacy_policy.p2_1b') }}<br />
          {{ $t('privacy_policy.p2_1c') }}<br />
          {{ $t('privacy_policy.p2_1d') }}<br />
          {{ $t('privacy_policy.p2_1e') }}<br />
          {{ $t('privacy_policy.p2_1f') }}<br />
          {{ $t('privacy_policy.p2_1g') }}<br />
          {{ $t('privacy_policy.p2_1h') }}<br />
          {{ $t('privacy_policy.p2_1i') }}
          <br />
          <br />
          {{ $t('privacy_policy.p2_2') }}<br />
          {{ $t('privacy_policy.p2_2a') }}<br />
          {{ $t('privacy_policy.p2_2b') }}<br />
          {{ $t('privacy_policy.p2_2c') }}<br />
          {{ $t('privacy_policy.p2_2d') }}<br />
          {{ $t('privacy_policy.p2_2e') }}<br />
          {{ $t('privacy_policy.p2_2f') }}<br />
          {{ $t('privacy_policy.p2_2g') }}<br />
          {{ $t('privacy_policy.p2_2h') }}
          <br />
          <br />
          {{ $t('privacy_policy.p2_2i') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('privacy_policy.children') }}</p>
        <p class="text-item column-left">
          {{ $t('privacy_policy.p3_1') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('privacy_policy.sharing') }}</p>
        <p class="text-item column-left">
          {{ $t('privacy_policy.p4_1') }}
          <br />
          <br />
          {{ $t('privacy_policy.p4_2') }}}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('privacy_policy.protecting') }}</p>
        <p class="text-item column-left">
          {{ $t('privacy_policy.p5_1') }}
          <br />
          <br />
          {{ $t('privacy_policy.p5_2') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('privacy_policy.cookies') }}</p>
        <p class="text-item column-left">
          {{ $t('privacy_policy.p6_1') }}
          <br />
          <br />
          {{ $t('privacy_policy.p6_1a') }}
          <br />
          <br />
          {{ $t('privacy_policy.p6_2') }}
          <br />
          <br />
          {{ $t('privacy_policy.p6_3') }}
          <br />
          <br />
          {{ $t('privacy_policy.p6_4') }}
          <br />
          <br />
          {{ $t('privacy_policy.p6_5') }}
          <br />
          <br />
          {{ $t('privacy_policy.p6_6') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('privacy_policy.change_privacy') }}</p>
        <p class="text-item column-left space-bottom">
          {{ $t('privacy_policy.p7_1') }}
          <br />
          <br />
          {{ $t('privacy_policy.p7_2') }}
        </p>
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
  IonRow
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { defineComponent } from 'vue';
import logo from '@/assets/icons/account/logo.jpg';

export default defineComponent({
  name: 'privacy-policy',
  components: { IonImg, IonBackButton, IonButtons, IonContent, IonHeader, IonToolbar, IonPage, IonRow },
  setup() {
    return {
      arrowBackOutline,
      logo
    };
  }
});
</script>

<style scoped lang="scss">
@import 'privacy-policy.module';
</style>

<template>
  <ion-page>
    <ion-header class="header padding-x ion-no-border">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/account"></ion-back-button>
        </ion-buttons>
        <p class="appbar-title">{{ $t('terms') }}</p>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row class="ion-align-items-center ion-justify-content-center">
        <ion-img :src="logo" style="height: 27px" />
        <p class="text-item-black titleTerms">{{ $t('terms_of_use.title') }}</p>
      </ion-row>
      <div class="text-item padding-x margin-y">
        {{ $t('terms_of_use.effective') }}
      </div>
      <div class="space"></div>
      <div>
        <p class="text-item padding-x">
          {{ $t('terms_of_use.intro_1') }}
          <br />
          <br />
          {{ $t('terms_of_use.intro_2') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('terms_of_use.intro') }}</p>
        <p class="text-item column-left">
          {{ $t('terms_of_use.p1_1') }}
          <br />
          <br />
          {{ $t('terms_of_use.p1_2') }}
          <br />
          <br />
          {{ $t('terms_of_use.p1_3') }}
          <br />
          <br />
          {{ $t('terms_of_use.p1_4') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('terms_of_use.intelectual') }}</p>
        <p class="text-item column-left">
          {{ $t('terms_of_use.p2_1') }}
          <br />
          <br />
          {{ $t('terms_of_use.p2_2') }}
          <br />
          {{ $t('terms_of_use.p2_2a') }}
          <br />
          {{ $t('terms_of_use.p2_2b') }}
          <br />
          {{ $t('terms_of_use.p2_2c') }}
          <br />
          {{ $t('terms_of_use.p2_2d') }}
          <br />
          {{ $t('terms_of_use.p2_2e') }}
          <br />
          {{ $t('terms_of_use.p2_2f') }}
          <br />
          {{ $t('terms_of_use.p2_2g') }}
          <br />
          {{ $t('terms_of_use.p2_2h') }}
          <br />
          {{ $t('terms_of_use.p2_2i') }}
          <br />
          {{ $t('terms_of_use.p2_2j') }}
          <br />
          {{ $t('terms_of_use.p2_2k') }}
          <br />
          {{ $t('terms_of_use.p2_2l') }}
          <br />
          <br />
          {{ $t('terms_of_use.p2_3') }}
          <br />
          <br />
          {{ $t('terms_of_use.p2_4') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('terms_of_use.eligibility') }}</p>
        <p class="text-item column-left">
          {{ $t('terms_of_use.p3_1') }}
          <br />
          <br />
          {{ $t('terms_of_use.p3_2') }}
          <br />
          <br />
          {{ $t('terms_of_use.p3_3') }}
          <br />
          <br />
          {{ $t('terms_of_use.p3_4') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('terms_of_use.product') }}</p>
        <p class="text-item column-left">
          {{ $t('terms_of_use.p4_1') }}
          <br />
          <br />
          {{ $t('terms_of_use.p4_2') }}
          <br />
          <br />
          {{ $t('terms_of_use.p4_3') }}
          <br />
          <br />
          {{ $t('terms_of_use.p4_4') }}
          <br />
          <br />
          {{ $t('terms_of_use.p4_5') }}
          <br />
          <br />
          {{ $t('terms_of_use.p4_6') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('terms_of_use.collection') }}</p>
        <p class="text-item column-left">
          {{ $t('terms_of_use.p5_1') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('terms_of_use.inability') }}</p>
        <p class="text-item column-left">
          {{ $t('terms_of_use.p6_1') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('terms_of_use.refunds') }}</p>
        <p class="text-item column-left">
          {{ $t('terms_of_use.p7_1') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('terms_of_use.your_account') }}</p>
        <p class="text-item column-left">
          {{ $t('terms_of_use.p8_1') }}
          <br />
          <br />
          {{ $t('terms_of_use.p8_2') }}
          <br />
          <br />
          {{ $t('terms_of_use.p8_3') }}
          <br />
          <br />
          {{ $t('terms_of_use.p8_4') }}
          <br />
          <br />
          {{ $t('terms_of_use.p8_5') }}
          <br />
          <br />
          {{ $t('terms_of_use.p8_6') }}
          <br />
          <br />
          {{ $t('terms_of_use.p8_7') }}
          <br />
          <br />
          {{ $t('terms_of_use.p8_8') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('terms_of_use.limitations') }}</p>
        <p class="text-item column-left">
          {{ $t('terms_of_use.p9_1') }}
          <br />
          <br />
          {{ $t('terms_of_use.p9_2') }}
          <br />
          <br />
          {{ $t('terms_of_use.p9_3') }}
          <br />
          <br />
          {{ $t('terms_of_use.p9_4') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('terms_of_use.governing') }}</p>
        <p class="text-item column-left">
          {{ $t('terms_of_use.p10_1') }}
        </p>
        <div class="space"></div>
        <p class="text-item-black padding-x">{{ $t('terms_of_use.miscell') }}</p>
        <p class="text-item column-left space-bottom">
          {{ $t('terms_of_use.p11_1') }}
          <br />
          <br />
          {{ $t('terms_of_use.p11_2') }}
          <br />
          <br />
          {{ $t('terms_of_use.p11_3') }}
          <br />
          <br />
          {{ $t('terms_of_use.p11_4') }}
          <br />
          <br />
          {{ $t('terms_of_use.p11_5') }}
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
  name: 'terms-of-use',
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
@import 'terms-of-use.module';
</style>

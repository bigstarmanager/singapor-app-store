<template>
  <ion-page>
    <ion-header class="header padding-x ion-no-border">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/account/faq"></ion-back-button>
        </ion-buttons>
        <p class="appbar-title">{{ $t('faq') }}</p>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row class="padding-x ion-align-items-center">
        <p class="title">{{ $t('faq_page.q3') }}</p>
      </ion-row>

      <div class="line-grey"></div>

      <div class="padding-x padding-y text-item-black">
        <p>
          {{ $t('faq_page.p3_1') }}
          <br />
          <br />
          {{ $t('faq_page.p3_2') }}
        </p>
      </div>

      <div class="space"></div>
      <div class="padding-x">
        <ion-row class="ion-align-items-center ion-justify-content-start">
          <ion-img :src="faq" class="faq_icon" />
          <p class="text-item">{{ $t('faq_page.related') }}</p>
        </ion-row>
      </div>
      <ion-item detail="false" lines="none" @click="routeToPath('/main/account/faq/how-to-order')">
        <ion-row slot="start" class="ion-align-items-center ion-row">
          <p class="text-item-black">{{ $t('faq_page.q1') }}</p>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
      </ion-item>

      <ion-item detail="false" lines="none" @click="routeToPath('/main/account/faq/group-buy')">
        <ion-row slot="start" class="ion-align-items-center ion-row">
          <p class="text-item-black">{{ $t('faq_page.q2') }}</p>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
      </ion-item>

      <ion-item detail="false" lines="none" @click="routeToPath('/main/account/faq/collect-my-order')">
        <ion-row slot="start" class="ion-align-items-center ion-row">
          <p class="text-item-black">{{ $t('faq_page.q4') }}</p>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
      </ion-item>
      <div class="space-bottom"></div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonIcon,
  IonImg,
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonToolbar,
  IonPage,
  IonItem,
  IonRow
} from '@ionic/vue';
import { arrowBackOutline, chevronForward, ellipsisHorizontal } from 'ionicons/icons';
import { defineComponent } from 'vue';
import faq from '@/assets/icons/account/help_outline.svg';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'collection-point',
  components: {
    IonIcon,
    IonImg,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonToolbar,
    IonPage,
    IonItem,
    IonRow
  },
  setup() {
    const router = useRouter();
    return {
      arrowBackOutline,
      chevronForward,
      ellipsisHorizontal,
      faq,
      router
    };
  },
  methods: {
    routeToPath(path) {
      this.router.push({
        path: path
      });
    }
  }
});
</script>

<style scoped lang="scss">
@import 'questions.module';
</style>

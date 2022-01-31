<template>
  <ion-page>
    <ion-header class="header padding-x ion-no-border">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/account"></ion-back-button>
        </ion-buttons>
        <p class="appbar-title">{{ $t('faq') }}</p>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="padding-x">
        <ion-row class="ion-align-items-center ion-justify-content-start">
          <ion-img :src="faq" class="faq_icon" />
          <p class="text-item">{{ $t('faq_page.top_qustions') }}</p>
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

      <ion-item detail="false" lines="none" @click="routeToPath('/main/account/faq/collection-point')">
        <ion-row slot="start" class="ion-align-items-center ion-row">
          <p class="text-item-black">{{ $t('faq_page.q3') }}</p>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
      </ion-item>

      <ion-item detail="false" lines="none" @click="routeToPath('/main/account/faq/collect-my-order')">
        <ion-row slot="start" class="ion-align-items-center ion-row">
          <p class="text-item-black">{{ $t('faq_page.q4') }}</p>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
      </ion-item>

      <ion-item detail="false" lines="none" @click="routeToPath('/main/account/faq/cancel-order')">
        <ion-row slot="start" class="ion-align-items-center ion-row">
          <p class="text-item-black">{{ $t('faq_page.q5') }}</p>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
      </ion-item>

      <ion-item detail="false" lines="none" @click="routeToPath('/main/account/faq/order-not-achieved')">
        <ion-row slot="start" class="ion-align-items-center ion-row">
          <p class="text-item-black">{{ $t('faq_page.q6') }}</p>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
      </ion-item>

      <ion-item detail="false" lines="none" @click="routeToPath('/main/account/faq/faulty-product')">
        <ion-row slot="start" class="ion-align-items-center ion-row">
          <p class="text-item-black">{{ $t('faq_page.q7') }}</p>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
      </ion-item>

      <ion-item detail="false" lines="none" @click="routeToPath('/main/account/faq/products-unavailable')">
        <ion-row slot="start" class="ion-align-items-center ion-row">
          <p class="text-item-black">{{ $t('faq_page.q8') }}</p>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
      </ion-item>

      <ion-item detail="false" lines="none" @click="routeToPath('/main/account/faq/home-delivery')">
        <ion-row slot="start" class="ion-align-items-center ion-row">
          <p class="text-item-black">{{ $t('faq_page.q9') }}</p>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
      </ion-item>

      <div class="space"></div>

      <div>
        <ion-row class="more ion-align-items-center ion-justify-content-start padding-x">
          <p class="more-text">{{ $t('faq_page.more') }}</p>
        </ion-row>
        <ion-grid>
          <ion-row class="ion-align-items-center ion-justify-content-center">
            <ion-button class="ion-btn" fill="clear" @click="routeToPath('/main/account/about')">
              <ion-col>
                <ion-img :src="treedots" class="ion-icon" />
                <p>{{ $t('faq_page.treedots') }}</p>
              </ion-col>
            </ion-button>
            <ion-button class="ion-btn" fill="clear" @click="routeToPath('/main/account/ordering')">
              <ion-col>
                <ion-img :src="ordering" class="ion-icon" />
                <p>{{ $t('faq_page.orders') }}</p>
              </ion-col>
            </ion-button>
            <ion-button class="ion-btn" fill="clear" @click="routeToPath('/main/account/refunds')">
              <ion-col>
                <ion-img :src="refunds" class="ion-icon" />
                <p>{{ $t('faq_page.refunds') }}</p>
              </ion-col>
            </ion-button>
            <ion-button class="ion-btn" fill="clear" @click="routeToPath('/main/account/privacy-policy')">
              <ion-col>
                <ion-img :src="privacy" class="ion-icon" />
                <p>{{ $t('faq_page.privacy') }}</p>
              </ion-col>
            </ion-button>
          </ion-row>
        </ion-grid>
      </div>
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
  IonGrid,
  IonRow,
  IonCol,
  IonButton
} from '@ionic/vue';
import { arrowBackOutline, chevronForward, ellipsisHorizontal } from 'ionicons/icons';
import { defineComponent } from 'vue';
import faq from '@/assets/icons/account/help_outline.svg';
import treedots from '@/assets/icons/account/treedots.svg';
import ordering from '@/assets/icons/account/collect.svg';
import collected from '@/assets/icons/account/collected.svg';
import refunds from '@/assets/icons/account/refundss.svg';
import privacy from '@/assets/icons/account/lock_outline.svg';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'faq',
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
    IonGrid,
    IonRow,
    IonCol,
    IonButton
  },
  setup() {
    const router = useRouter();
    return {
      arrowBackOutline,
      chevronForward,
      ellipsisHorizontal,
      faq,
      treedots,
      ordering,
      collected,
      refunds,
      privacy,
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
@import 'index-faq.module';
</style>

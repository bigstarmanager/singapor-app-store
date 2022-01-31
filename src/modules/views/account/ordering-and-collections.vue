<template>
  <ion-page>
    <ion-header class="header padding-x ion-no-border">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/account"></ion-back-button>
        </ion-buttons>
        <p class="appbar-title">{{ $t('ordering') }}</p>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-row class="ion-align-items-center ion-justify-content-center">
        <div class="circle-number">1</div>
      </ion-row>
      <ion-row class="padding-x">
        <ion-col class="ion-align-self-center">
          <ion-img class="ion-image" :src="oc1" />
        </ion-col>
        <ion-col class="ion-align-self-center">
          <p class="title text-center">{{ $t('ordering_collection.p1') }}</p>
        </ion-col>
      </ion-row>
      <ion-row class="ion-justify-content-end">
        <div class="line-grey"></div>
      </ion-row>

      <ion-row class="ion-align-items-center ion-justify-content-center">
        <div class="circle-number">2</div>
      </ion-row>
      <ion-row class="padding-x">
        <ion-col class="ion-align-self-center">
          <p class="title text-center">{{ $t('ordering_collection.p2') }}</p>
        </ion-col>
        <ion-col class="ion-align-self-center">
          <ion-img class="ion-image" :src="oc2" />
        </ion-col>
      </ion-row>
      <ion-row class="ion-justify-content-start">
        <div class="line-grey"></div>
      </ion-row>

      <ion-row class="ion-align-items-center ion-justify-content-center">
        <div class="circle-number">3</div>
      </ion-row>
      <ion-row class="padding-x">
        <ion-col class="ion-align-self-center">
          <ion-img class="ion-image" :src="oc3" />
        </ion-col>
        <ion-col class="ion-align-self-center">
          <p class="title text-center">{{ $t('ordering_collection.p3') }}</p>
        </ion-col>
      </ion-row>
      <ion-row class="ion-justify-content-end">
        <div class="line-grey"></div>
      </ion-row>

      <ion-row class="ion-align-items-center ion-justify-content-center">
        <div class="circle-number">4</div>
      </ion-row>
      <ion-row class="padding-x">
        <ion-col class="ion-align-self-center">
          <p class="title text-center">{{ $t('ordering_collection.p4') }}</p>
        </ion-col>
        <ion-col class="ion-align-self-center">
          <ion-img class="ion-image" :src="oc4" />
        </ion-col>
      </ion-row>
      <ion-row class="ion-justify-content-start">
        <div class="line-grey"></div>
      </ion-row>

      <ion-row class="ion-align-items-center ion-justify-content-center">
        <div class="circle-number">5</div>
      </ion-row>
      <ion-row class="padding-x">
        <ion-col class="ion-align-self-center">
          <ion-img class="ion-image" :src="oc5" />
        </ion-col>
        <ion-col class="ion-align-self-center">
          <p class="title text-center">{{ $t('ordering_collection.p5') }}</p>
        </ion-col>
      </ion-row>
      <ion-row class="ion-justify-content-end">
        <div class="line-grey"></div>
      </ion-row>
      <ion-row class="ion-justify-content-center padding-x">
        <p class="title text-center">{{ $t('ordering_collection.take_step') }}</p>
        <ion-button @click="routeToPath('/main/how-group-buy-works')" class="tour-btn" color="primary">{{
          $t('ordering_collection.take_a_tour')
        }}</ion-button>
        <div class="line-grey"></div>
        <p class="title text-center">{{ $t('ordering_collection.find_out_more') }}</p>
      </ion-row>
      <ion-row class="padding-x ion-align-items-center ion-justify-content-center space-bottom">
        <ion-button class="ion-btn" fill="clear" @click="routeToPath('/main/account/refunds')">
          <ion-col>
            <ion-img :src="refunds" class="ion-icon" />
            <p>{{ $t('refunds') }}</p>
          </ion-col>
        </ion-button>
        <ion-button class="ion-btn" fill="clear" @click="routeToPath('/main/account/faq')">
          <ion-col>
            <ion-img :src="faq" class="ion-icon" />
            <p>{{ $t('faq') }}</p>
          </ion-col>
        </ion-button>
        <ion-button class="ion-btn" fill="clear" @click="routeToPath('/main/account/contact-us')">
          <ion-col>
            <ion-img :src="contact" class="ion-icon" />
            <p>{{ $t('contact_us') }}</p>
          </ion-col>
        </ion-button>
      </ion-row>
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
  IonCol,
  IonButton
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { defineComponent } from 'vue';
import oc1 from '@/assets/images/oc1.png';
import oc2 from '@/assets/images/oc2.png';
import oc3 from '@/assets/images/oc3.png';
import oc4 from '@/assets/images/oc4.png';
import oc5 from '@/assets/images/oc5.png';
import contact from '@/assets/icons/account/call.svg';
import refunds from '@/assets/icons/account/refundss.svg';
import faq from '@/assets/icons/account/help_outline.svg';
import { useRouter } from 'vue-router';

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
    IonCol,
    IonButton
  },
  setup() {
    const router = useRouter();
    return {
      arrowBackOutline,
      oc1,
      oc2,
      oc3,
      oc4,
      oc5,
      refunds,
      faq,
      contact,
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
@import 'ordering-and-collections.module';
</style>

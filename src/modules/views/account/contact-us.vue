<template>
  <ion-page>
    <ion-header class="header padding-x ion-no-border">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/account"></ion-back-button>
        </ion-buttons>
        <p class="appbar-title">{{ $t('contact_us') }}</p>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="false" scroll-y="false">
      <div class="text-item-black padding-x inquiries">{{ $t('inquiries') }}</div>
      <ion-item detail="false" lines="none" button @click="openLiveChatSupport">
        <ion-row slot="start" class="ion-align-items-center">
          <div class="inquiries-icon-container" style="background-color: #e6eeee">
            <ion-img :src="liveChatIcon" class="inquiries-icon" />
          </div>
          <ion-label class="text-item"> {{ $t('live_chat') }} </ion-label>
        </ion-row>
      </ion-item>

      <ion-item detail="false" lines="none" button @click="sendEmailSupport">
        <ion-row slot="start" class="ion-align-items-center">
          <div class="inquiries-icon-container" style="background-color: rgba(203, 60, 60, 0.1)">
            <ion-img :src="emailRedIcon" class="inquiries-icon" />
          </div>
          <ion-label class="text-item"> {{ $t('email') }} </ion-label>
        </ion-row>
      </ion-item>

      <div class="space"></div>
      <div class="text-item-black padding-x followUs">{{ $t('follow_us') }}</div>
      <ion-item detail="false" lines="none" href="https://www.facebook.com/thetreedots/" target="_blank">
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img :src="fbIcon" class="ionImg" />
          <ion-label class="text-item"> {{ $t('facebook') }} </ion-label>
        </ion-row>
      </ion-item>
      <ion-item detail="false" lines="none" href="https://www.instagram.com/thetreedots/" target="_blank">
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img :src="igIcon" class="ionImg" />
          <ion-label class="text-item"> {{ $t('instagram') }} </ion-label>
        </ion-row>
      </ion-item>
      <ion-item detail="false" lines="none" href="https://sg.linkedin.com/company/treedots" target="_blank">
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img :src="inIcon" class="ionImg" />
          <ion-label class="text-item"> {{ $t('linkedin') }} </ion-label>
        </ion-row>
      </ion-item>
      <div class="contact-page"></div>
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
  IonItem,
  IonRow,
  IonLabel,
  toastController
} from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { Capacitor } from '@capacitor/core';
import liveChatIcon from '@/assets/icons/account/live_chat.svg';
import emailRedIcon from '@/assets/icons/account/email_red.svg';
import fbIcon from '@/assets/icons/account/fb.png';
import igIcon from '@/assets/icons/account/ig.png';
import inIcon from '@/assets/icons/account/in.png';
import { Intercom as IntercomPlugin } from '@capacitor-community/intercom';

export default defineComponent({
  name: 'contact-us',
  components: {
    IonImg,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonToolbar,
    IonPage,
    IonItem,
    IonRow,
    IonLabel
  },

  setup() {
    return {
      arrowBackOutline,
      liveChatIcon,
      emailRedIcon,
      fbIcon,
      igIcon,
      inIcon
    };
  },

  methods: {
    openLiveChatSupport() {
      if (Capacitor.isNativePlatform()) return IntercomPlugin.displayMessenger();

      toastController
        .create({
          message: this.$t('live_chat_support_only_available_in_android_and_ios_app'),
          duration: 3000
        })
        .then((t) => t.present());
    },
    sendEmailSupport() {
      window.open('mailto:help.social@thetreedots.com');
    }
  }
});
</script>

<style scoped lang="scss">
@import 'contact-us.module';
</style>

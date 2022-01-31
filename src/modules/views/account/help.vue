<template>
  <ion-page>
    <ion-header class="header padding-x ion-no-border">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/account"></ion-back-button>
        </ion-buttons>
        <p class="appbar-title">{{ $t('help') }}</p>
      </ion-toolbar>
      <ion-toolbar color="transparent">
        <ion-row class="ion-align-items-center ion-justify-content-center">
          <p class="text-name-black">{{ $t('hello') }} {{ user.first_name }},</p>
        </ion-row>
      </ion-toolbar>
      <div class="header-div">
        <ion-row class="ion-align-items-center ion-justify-content-center">
          <p class="text-item-black">{{ $t('how_help') }}</p>
        </ion-row>
      </div>
    </ion-header>

    <ion-content scroll-y="false" :fullscreen="true">
      <div class="space"></div>
      <div class="padding-x padding-y">
        <div class="support-container" @click="openLiveChatSupport">
          <ion-ripple-effect></ion-ripple-effect>
          <ion-grid>
            <ion-row class="support-container-row">
              <div class="support-item-icon-container" style="background-color: #e6eeee">
                <ion-img :src="liveChatIcon" class="support-item-icon" />
              </div>
              <ion-grid>
                <ion-row class="support-item-title">{{ $t('live_chat') }}</ion-row>
                <ion-row class="support-item-description"
                  >{{ $t('facing_an_issue_chat_with_us_for_real_time_support') }}
                </ion-row>
              </ion-grid>
            </ion-row>
          </ion-grid>
        </div>

        <div class="support-container" @click="sendEmailSupport">
          <ion-ripple-effect></ion-ripple-effect>
          <ion-grid>
            <ion-row class="support-container-row">
              <div class="support-item-icon-container" style="background-color: rgba(203, 60, 60, 0.1)">
                <ion-img :src="emailRedIcon" class="support-item-icon" />
              </div>
              <ion-grid>
                <ion-row class="support-item-title">{{ $t('email') }}</ion-row>
                <ion-row class="support-item-description"
                  >{{ $t('our_team_will_reply_to_your_inquires_in_2_3_working_days') }}
                </ion-row>
              </ion-grid>
            </ion-row>
          </ion-grid>
        </div>
      </div>

      <div class="space-2"></div>
      <div class="text-item-black padding-x findOut">
        {{ $t('find_out') }}
      </div>
      <ion-item detail="false" lines="none" @click="$router.push('/main/account/faq')">
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img :src="faqIcon" class="ionListIcon" />
          <ion-label class="text-item"> {{ $t('faq') }} </ion-label>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
      </ion-item>
      <ion-item detail="false" lines="none" @click="$router.push('/main/account/ordering')">
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img :src="orderingIcon" class="ionListIcon" />
          <ion-label class="text-item"> {{ $t('ordering') }} </ion-label>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
      </ion-item>
      <ion-item detail="false" lines="none" @click="$router.push('/main/account/refunds')">
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img :src="refundsIcon" class="ionListIcon" />
          <ion-label class="text-item"> {{ $t('refunds') }} </ion-label>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
      </ion-item>
      <div class="help-page"></div>
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
  IonRow,
  IonLabel,
  toastController
} from '@ionic/vue';
import { arrowBackOutline, chevronForward } from 'ionicons/icons';
import { defineComponent, inject } from 'vue';
import { Capacitor } from '@capacitor/core';
import liveChatIcon from '@/assets/icons/account/live_chat.svg';
import emailRedIcon from '@/assets/icons/account/email_red.svg';
import faqIcon from '@/assets/icons/account/help_outline.svg';
import orderingIcon from '@/assets/icons/account/ordering.svg';
import refundsIcon from '@/assets/icons/account/refundss.svg';
import { Intercom as IntercomPlugin } from '@capacitor-community/intercom';

export default defineComponent({
  name: 'help',
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
    IonRow,
    IonLabel
  },

  data() {
    return {
      user: null
    };
  },

  setup() {
    return {
      arrowBackOutline,
      chevronForward,
      liveChatIcon,
      emailRedIcon,
      faqIcon,
      orderingIcon,
      refundsIcon
    };
  },

  created() {
    this.user = inject('$storage')
      .getUser()
      .then((res) => {
        this.user = res;
      });
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
@import 'help.module.scss';
</style>

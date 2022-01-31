<template>
  <ion-page>
    <ion-header class="header padding-x ion-no-border">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/account"></ion-back-button>
        </ion-buttons>
        <p class="appbar-title">{{ $t('about_treedots') }}</p>
      </ion-toolbar>
    </ion-header>

    <ion-content class="text-center" :fullscreen="true">
      <div class="text-center">
        <ion-img :src="logo" style="height: 27px" class="margin-y" />
        <p class="title">{{ $t('our_mission') }}</p>
      </div>
      <div class="padding-x">
        <p class="text-item">{{ $t('mission') }}</p>
        <p class="text-item">{{ $t('vision') }}</p>
      </div>
      <div class="space"></div>
      <div class="padding-x space-bottom">
        <p class="title">{{ $t('treedots_story') }}</p>
        <p class="text-small">{{ $t('began') }}</p>
        <br />
        <ion-img :src="avocados" class="margin-y" />
        <br />
        <p class="subtitle">{{ $t('started_with_avocados.title') }}</p>
        <p class="text-item">{{ $t('started_with_avocados.content_1') }}</p>
        <p class="text-item">{{ $t('started_with_avocados.content_2') }}</p>
        <br />
        <br />
        <p class="subtitle">{{ $t('our_research.title') }}</p>
        <p class="text-item">{{ $t('our_research.content_1') }}</p>
        <p class="text-item">{{ $t('our_research.content_2') }}</p>
        <br />
        <ion-img :src="iphone" class="margin-y" />
        <br />
        <p class="subtitle">{{ $t('our_solution.title') }}</p>
        <p class="text-item">{{ $t('our_solution.content_1') }}</p>
        <p class="text-item">{{ $t('our_solution.content_2') }}</p>
        <br />
        <p class="subtitle">{{ $t('providing.title') }}</p>
        <div>
          <ion-router-link class="text-item">
            {{ $t('providing.content_1') }}
          </ion-router-link>
          <ion-router-link class="text-item-bold">{{ $t('providing.groupbuy_app') }}</ion-router-link>
          <ion-router-link class="text-item">{{ $t('providing.content_1a') }} </ion-router-link>
        </div>
        <p class="text-item">{{ $t('our_solution.content_2') }}</p>
        <br />
        <p class="subtitle">{{ $t('encouraging.title') }}</p>
        <p class="text-item">{{ $t('encouraging.content_1') }}</p>
        <div>
          <ion-router-link class="text-item">
            {{ $t('encouraging.content_2') }}
          </ion-router-link>
          <ion-router-link class="text-item-bold">{{ $t('encouraging.seller_app') }}</ion-router-link>
          <ion-router-link class="text-item">{{ $t('encouraging.content_2a') }} </ion-router-link>
        </div>
        <br />
        <p class="subtitle">{{ $t('whatis_next.title') }}</p>
        <p class="text-item">{{ $t('whatis_next.content') }}</p>
        <br />
        <ion-img :src="logo" style="height: 27px" class="margin-y" />
        <p class="title">{{ $t('stay_tuned') }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonImg, IonBackButton, IonButtons, IonContent, IonHeader, IonToolbar, IonPage } from '@ionic/vue';
import { arrowBackOutline } from 'ionicons/icons';
import { defineComponent } from 'vue';
import logo from '@/assets/icons/account/logo.jpg';
import avocados from '@/assets/images/avocados.jpg';
import iphone from '@/assets/images/iphone.png';

export default defineComponent({
  name: 'about-treedots',
  components: {
    IonImg,
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonToolbar,
    IonPage
  },
  setup() {
    return {
      arrowBackOutline,
      logo,
      avocados,
      iphone
    };
  }
});
</script>

<style scoped lang="scss">
@import 'about-treedots.module';
</style>

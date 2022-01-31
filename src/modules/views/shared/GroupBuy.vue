<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="" class="back-btn"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding">{{ $t('group_buy.how_group_buy_works') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-slides class="group-buy" pager @ionSlidesDidLoad="playVideo" @ionSlideDidChange="playVideo">
        <ion-slide>
          <video loop playsinline preload="none">
            <source src="/assets/medias/group_buy_1.mp4" type="video/mp4" />
          </video>
          <p>{{ $t('group_buy.slide_1') }}</p>
        </ion-slide>

        <ion-slide>
          <video loop playsinline preload="none">
            <source src="/assets/medias/group_buy_2.mp4" type="video/mp4" />
          </video>
          <p>{{ $t('group_buy.slide_2') }}</p>
        </ion-slide>

        <ion-slide>
          <video loop playsinline preload="none">
            <source src="/assets/medias/group_buy_3.mp4" type="video/mp4" />
          </video>
          <p>{{ $t('group_buy.slide_3') }}</p>
        </ion-slide>

        <ion-slide>
          <video loop playsinline preload="none">
            <source src="/assets/medias/group_buy_4.mp4" type="video/mp4" />
          </video>
          <p>{{ $t('group_buy.slide_4') }}</p>
        </ion-slide>
      </ion-slides>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonSlides,
  IonSlide
} from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GroupBuy',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButtons,
    IonBackButton,
    IonSlides,
    IonSlide
  },
  setup() {
    let previousActive;
    const playVideo = (e) => {
      // https://stackoverflow.com/q/59084659
      if (previousActive) {
        previousActive.querySelector('video').pause();
        previousActive.querySelector('video').currentTime = 0;
      }
      const active = e.target.querySelector('.swiper-slide-active');
      active.querySelector('video').play();

      previousActive = active;
    };

    return {
      playVideo
    };
  }
});
</script>
<style scoped lang="scss">
@import 'GroupBuy.scss';
</style>
<style lang="scss">
ion-slides.group-buy .swiper-pagination {
  bottom: 12px;
}
</style>

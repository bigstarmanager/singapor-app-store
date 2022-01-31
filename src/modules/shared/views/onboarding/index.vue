<template #default>
  <ion-page>
    <ion-content :fullscreen="true" class="onboardingContainer">
      <ion-slides pager="true" :options="slideOpts" class="onboardingSlider text-center">
        <ion-slide>
          <ion-grid class="onboardingItem">
            <ion-row>
              <ion-img class="onboardingImg mx-auto" src="/assets/images/oc1.png" />
            </ion-row>
            <ion-row class="onboardingTitlePart">
              <ion-label class="onboardingTitle mx-auto">{{ $t('onboarding1_title') }}</ion-label>
            </ion-row>
            <ion-row>
              <div class="onboardingText mx-auto">{{ $t('onboarding1_text') }}</div>
            </ion-row>
            <ion-row>
              <ion-button class="mx-auto onboardingButton" @click="goHome()">
                {{ $t('onboarding_button') }}</ion-button
              >
            </ion-row>
          </ion-grid>
        </ion-slide>
        <ion-slide>
          <ion-grid class="onboardingItem">
            <ion-row>
              <ion-img class="onboardingImg mx-auto" src="/assets/images/oc2.png" />
            </ion-row>
            <ion-row class="onboardingTitlePart d-grid">
              <ion-label class="onboardingTitle mx-auto">{{ $t('onboarding2_title_1') }}</ion-label>
              <ion-label class="onboardingTitle mx-auto">{{ $t('onboarding2_title_2') }}</ion-label>
            </ion-row>
            <ion-row>
              <div class="onboardingText mx-auto">{{ $t('onboarding2_text') }}</div>
            </ion-row>
            <ion-row>
              <ion-button class="mx-auto onboardingButton" @click="goHome()">
                {{ $t('onboarding_button') }}</ion-button
              >
            </ion-row>
          </ion-grid>
        </ion-slide>
        <ion-slide>
          <ion-grid class="onboardingItem">
            <ion-row>
              <ion-img class="onboardingImg mx-auto" src="/assets/images/oc3.png" />
            </ion-row>
            <ion-row class="onboardingTitlePart">
              <ion-label class="onboardingTitle mx-auto">{{ $t('onboarding3_title') }}</ion-label>
            </ion-row>
            <ion-row>
              <div class="onboardingText mx-auto">{{ $t('onboarding3_text') }}</div>
            </ion-row>
            <ion-row>
              <ion-button class="mx-auto onboardingButton" @click="goHome()">
                {{ $t('onboarding_button') }}</ion-button
              >
            </ion-row>
          </ion-grid>
        </ion-slide>
        <ion-slide>
          <ion-grid class="onboardingItem">
            <ion-row>
              <ion-img class="onboardingImg mx-auto" src="/assets/images/oc4.png" />
            </ion-row>
            <ion-row class="onboardingTitlePart">
              <ion-label class="onboardingTitle mx-auto">{{ $t('onboarding4_title') }}</ion-label>
            </ion-row>
            <ion-row>
              <div class="onboardingText mx-auto">{{ $t('onboarding4_text') }}</div>
            </ion-row>
            <ion-row>
              <ion-button class="mx-auto onboardingButton" @click="goHome()">
                {{ $t('onboarding_button') }}</ion-button
              >
            </ion-row>
          </ion-grid>
        </ion-slide>
      </ion-slides>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonImg,
  IonButton,
  IonGrid,
  IonRow,
  IonSlides,
  IonSlide,
  IonLabel
} from '@ionic/vue';
import { useRouter } from 'vue-router';
import { defineComponent, inject } from 'vue';

export default defineComponent({
  name: 'Onboarding',
  props: ['userType'],
  components: {
    IonContent,
    IonPage,
    IonImg,
    IonButton,
    IonGrid,
    IonRow,
    IonSlides,
    IonSlide,
    IonLabel
  },
  async setup() {
    const router = useRouter();
    await inject('$storage').setIsNew({ isNew: false });
    const slideOpts = {
      initialSlide: 0,
      slidesPerView: 1
    };
    return {
      router,
      slideOpts
    };
  },
  methods: {
    goHome() {
      if (this.userType === 1) {
        this.router.push('/b2b');
      } else {
        this.router.push('/main/home');
      }
    }
  }
});
</script>
<style scoped lang="scss">
@import 'onboarding';
</style>

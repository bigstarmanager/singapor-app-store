<template>
  <ion-page>
    <ion-header no-border class="bar-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true" class="content">
      <div id="home-container">
        <div class="logo-container">
          <div class="logo">
            <ion-img src="/assets/images/splash_logo.png" alt="Treedots logo" />
          </div>
        </div>
        <div class="button-groups">
          <ion-button class="home-btn" expand="block" router-link="/shared/auth/mobile"
            >{{ $t('login_with_mobile') }}
          </ion-button>
          <ion-button class="home-btn" expand="block" fill="outline" router-link="/shared/auth/email"
            >{{ $t('login_with_email') }}
          </ion-button>
          <ion-label class="signup-link">
            {{ $t('dont_have_an_account') }}
            <router-link to="/shared/auth/signup-access">
              <strong>{{ $t('sign_up') }}</strong>
            </router-link>
          </ion-label>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonButton,
  IonBackButton,
  IonHeader,
  IonToolbar,
  IonButtons,
  IonContent,
  IonPage,
  IonLabel,
  IonImg,
  onIonViewWillEnter
} from '@ionic/vue';
import { defineComponent } from 'vue';
import Branch from '@/services/shared/helper/branch';
import Intercom from '@/services/shared/helper/intercom';
import PushNotification from '@/services/shared/helper/pushNotification';
import clevertap from '@/services/shared/helper/clevertap';

export default defineComponent({
  name: 'Home',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonBackButton,
    IonHeader,
    IonToolbar,
    IonButtons,
    IonLabel,
    IonImg
  },
  setup() {
    onIonViewWillEnter(() => {
      Branch.logout();
      Intercom.logout();
      PushNotification.deleteInstanceId();
      clevertap.clearUserProfile();
    });
  }
});
</script>

<style scoped lang="scss">
$login-background: '/assets/images/home-bg.svg';
@import '@/views/Home/home.scss';

#home-container .logo-container {
  height: 65vh;
}
</style>

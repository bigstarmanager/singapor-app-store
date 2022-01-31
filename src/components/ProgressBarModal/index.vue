<template>
  <ion-page class="downloading-modal">
    <ion-header>
      <ion-toolbar>
        <ion-title>{{ name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <ion-progress-bar type="indeterminate" value="{{percent}}"></ion-progress-bar>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonProgressBar, IonContent, IonHeader, IonTitle, IonToolbar, IonPage } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ProgressBarModal',
  components: {
    IonProgressBar,
    IonContent,
    IonHeader,
    IonTitle,
    IonPage,
    IonToolbar
  },
  props: {
    name: String,
    percent: Number
  }
});
</script>

<style>
.download-modal-css .modal-wrapper {
  height: 100px;
  width: 80%;
}
</style>

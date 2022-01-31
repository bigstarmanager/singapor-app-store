<template>
  <ion-page>
    <ion-content forceOverscroll="false" class="map-welcome-content">
      <ion-label class="map-welcome-title"> {{ title }} </ion-label>
      <ion-label> {{ message }} </ion-label>
      <ion-row class="map-welcome-buttons">
        <ion-item detail="false" lines="none" @click="closeWelcomeModal()" class="ion-no-padding">
          <ion-label> {{ close }} </ion-label>
        </ion-item>
        <ion-item
          detail="false"
          lines="none"
          @click="openWA(waLink)"
          class="ion-no-padding waIcon"
          v-if="waLink"
        >
          <ion-label> {{ join }} </ion-label>
          <ion-img :src="waIcon" />
        </ion-item>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonLabel, IonPage, IonImg, IonItem, IonRow, modalController } from '@ionic/vue';
import waIcon from '@/assets/icons/account/wa.png';
import Branch from '@/services/shared/helper/branch';

export default defineComponent({
  name: 'MapWelcome',
  components: {
    IonContent,
    IonLabel,
    IonPage,
    IonImg,
    IonItem,
    IonRow
  },
  props: {
    title: { type: String },
    message: { type: String },
    close: { type: String },
    join: { type: String },
    waLink: { type: String }
  },
  setup() {
    return {
      waIcon
    };
  },
  methods: {
    closeWelcomeModal() {
      modalController.dismiss();
    },
    openWA(waLink) {
      modalController.dismiss();
      window.open(waLink, '_blank');
      Branch.sendBranchEvent(Branch.events.JOIN_HUB_WHATSAPP);
    }
  }
});
</script>

<style scoped lang="scss">
@import 'mapWelcome.module';
</style>

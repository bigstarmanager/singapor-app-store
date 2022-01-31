<template>
  <ion-page>
    <ion-header class="cp-welcome-header">
      <ion-toolbar class="title">
        <ion-label class="cp-welcome-title"> {{ $t('confirm_CP_title') }} </ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content forceOverscroll="false" class="cp-welcome-content">
      <ion-label> {{ $t('confirm_CP_modal') }} </ion-label>
      <ion-row class="cp-welcome-buttons">
        <ion-label @click="closeModal()"> {{ $t('order.cancel') }} </ion-label>
        <ion-label @click="gotoHubs()"> {{ $t('join_now') }} </ion-label>
        <ion-item class="waIcon" detail="false" lines="none" href="https://wa.me/6531384846" target="_blank">
          <ion-img :src="waIcon" />
        </ion-item>
      </ion-row>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonHeader, IonContent, IonToolbar, IonLabel, IonPage, IonImg, IonItem, IonRow } from '@ionic/vue';
import waIcon from '@/assets/icons/account/wa.png';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'CPWelcomeModal',
  components: {
    IonHeader,
    IonContent,
    IonToolbar,
    IonLabel,
    IonPage,
    IonImg,
    IonItem,
    IonRow
  },
  setup() {
    const router = useRouter();
    return {
      waIcon,
      router
    };
  },
  methods: {
    gotoHubs() {
      this.$emit('close');
      this.router.push('map');
    },
    closeModal() {
      this.$emit('close');
    }
  }
});
</script>

<style scoped lang="scss">
@import 'cpWelcomeModal';
</style>

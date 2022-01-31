<template>
  <ion-page>
    <ion-content forceOverscroll="false" class="muteToastContainer">
      <div class="delete_body">
        <ion-img class="iconMute" :src="isMute ? mute_white : unmute_white" />
        <ion-label class="deleteText">
          {{ isMute ? $t('chat_muted') : $t('chat_unmuted') }}
        </ion-label>
        <ion-button class="undoBtn" @click="undoButton()"> {{ $t('undo') }} </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonLabel, IonPage, IonImg, IonButton } from '@ionic/vue';
import mute_white from '@/assets/icons/shared/mute_white.svg';
import unmute_white from '@/assets/icons/shared/unmute_white.svg';

export default defineComponent({
  name: 'MuteChatToast',
  components: { IonButton, IonContent, IonLabel, IonPage, IonImg },
  props: {
    isMute: Boolean
  },
  setup() {
    return {
      mute_white,
      unmute_white
    };
  },
  methods: {
    undoButton() {
      this.$emit('undo');
    }
  }
});
</script>

<style scoped lang="scss">
@import 'muteChatToast';
</style>

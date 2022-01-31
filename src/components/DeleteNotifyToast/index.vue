<template>
  <ion-page>
    <ion-content forceOverscroll="false" class="deleteToastContainer">
      <div class="delete_body">
        <ion-img class="iconTrash" :src="trashIcon" />
        <ion-label class="deleteText">
          {{ $t('msg_delete') }}
        </ion-label>
        <ion-button class="undoBtn" @click="undoButton()"> {{ $t('undo') }} </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import { IonContent, IonLabel, IonPage, IonImg, IonButton } from '@ionic/vue';
import trashIcon from '@/assets/icons/shared/trash.svg';

export default defineComponent({
  name: 'DeleteNotifyToast',
  components: { IonButton, IonContent, IonLabel, IonPage, IonImg },
  setup() {
    return {
      trashIcon
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
@import 'deleteNotifyToast';
</style>

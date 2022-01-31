<template>
  <ion-content class="modal-container">
    <div class="modal-title">{{ $t('delete_account_text1') }}</div>
    <div class="modal-contents">
      <br />
      {{ $t('delete_account_text2') }}
      <br />
      <br />
      {{ $t('delete_account_text3') }}
      <br />
      <br />
      <span>&#8226; {{ $t('delete_account_text4') }}</span>
      <br />
      <br />
      <span>&#8226; {{ $t('delete_account_text5') }}</span>
    </div>
    <div class="button-container">
      <ion-button expand="block" @click="onCancel()">
        {{ $t('nevermind_keep_my_account') }}
      </ion-button>
      <ion-button expand="block" color="danger" fill="outline" @click="onDelete()">
        {{ $t('understood_delete_account') }}
      </ion-button>
    </div>
  </ion-content>
</template>
<script>
import { IonContent, IonButton } from '@ionic/vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'DeleteAccount',
  components: {
    IonContent,
    IonButton
  },
  data: () => {
    return {};
  },
  setup() {
    return {};
  },
  methods: {
    onCancel() {
      this.$emit('closeModal');
    },
    onDelete() {
      this.$emit('deleteAccount');
    }
  }
});
</script>
<style scoped lang="scss">
@import 'deleteAccountModal.scss';
</style>

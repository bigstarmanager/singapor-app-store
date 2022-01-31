<template>
  <ion-content class="modal-container">
    <div class="modal-title">{{ $t('order.refund_modal_header') }}</div>
    <div class="modal-contents">
      {{ $t('order.refund_modal_text')
      }}<span class="bold-text">{{ $t('order.refund_modal_bold_text') }}</span>
    </div>
    <div class="confirmButton">
      <ion-button expand="block" @click="onAllowRefundDefault()">
        {{ $t('order.allow_refund_default') }}
      </ion-button>
      <ion-button expand="block" fill="outline" @click="onCloseModal()">
        {{ $t('order.cancel_refund_default') }}
      </ion-button>
    </div>
  </ion-content>
</template>
<script>
import { IonContent, IonButton } from '@ionic/vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'RefundDefaultModal',
  components: {
    IonContent,
    IonButton
  },
  methods: {
    onAllowRefundDefault() {
      this.$emit('allowRefundTreedots');
    },
    onCloseModal() {
      this.$emit('closeModal');
    }
  }
});
</script>
<style scoped lang="scss">
@import 'refundDefaultModal.scss';
</style>

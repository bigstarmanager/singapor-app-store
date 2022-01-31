<template>
  <div class="inner-content px-5 py-5 text-center">
    <div class="fs-4 fw-normal mt-2">{{ title }}</div>
    <div class="py-2 fs-3 my-3 alert-msg">{{ content }}</div>
    <ion-button fill="outline" size="small" color="primary" expand="block" @click="$emit('close-modal')">
      {{ $t('close').toUpperCase() }}
    </ion-button>
  </div>
</template>

<script>
import { IonButton } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'ModalContentInfo',
  components: { IonButton },
  props: ['title', 'content'],
  emits: ['close-modal'],
  methods: {
    closeModal() {
      this.$emit('close-modal');
    }
  }
});
</script>

<style scoped>
.alert-msg {
  line-height: 1.5;
  color: #616161;
}
</style>

<template>
  <ion-content class="popover">
    <ion-label>
      {{ $t('refund_tooltip2') }}
    </ion-label>
  </ion-content>
</template>

<script>
import { IonContent, IonLabel } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'PopoverVoucher',
  components: { IonContent, IonLabel }
});
</script>

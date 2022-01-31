<template>
  <div class="popover">
    <ion-row>
      <ion-col>
        <p class="info-content">{{ $t('wallet.withdraw_fail_info') }}</p>
      </ion-col>
      <ion-img @click="closeInfo" class="close-icon" src="/assets/images/close-circle-white.svg"> </ion-img>
    </ion-row>
  </div>
</template>

<script>
import { IonImg, IonRow, IonCol } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WithdrawFailInfo',
  components: { IonImg, IonRow, IonCol },

  methods: {
    closeInfo() {
      this.$emit('close-info');
    }
  }
});
</script>

<style scoped lang="scss">
@import 'FailTransaction';
</style>

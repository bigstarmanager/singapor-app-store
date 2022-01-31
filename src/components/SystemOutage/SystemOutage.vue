<template>
  <ion-page class="system-outage-page">
    <div class="ion-padding">
      <div>
        <ion-img :src="unpluggedIcon" />
      </div>
      <ion-text color="dark">
        <h6>{{ $t('system_outage_head_text') }}</h6>
        <p>{{ $t('system_outage_sub_text') }}</p>
      </ion-text>
    </div>
  </ion-page>
</template>

<script>
import { IonPage, IonText, IonImg } from '@ionic/vue';
import { defineComponent } from 'vue';
import unpluggedIcon from '@/assets/icons/shared/unplugged.png';

export default defineComponent({
  name: 'SystemOutage',
  components: { IonPage, IonText, IonImg },
  setup() {
    return {
      unpluggedIcon
    };
  }
});
</script>
<style scoped lang="scss">
@import 'SystemOutage.module.scss';
</style>

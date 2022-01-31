<template>
  <ion-content class="modal-container">
    <div class="modal-title">{{ $t('location_permission_text1') }}</div>
    <div class="modal-contents">
      <br />
      {{ $t('location_permission_text2') }}
      <br />
      <br />
    </div>
    <div>
      <span class="postal-code-text">{{ $t('postal_code') }}</span>
      <ion-input
        type="text"
        pattern="\d*"
        v-model="postalCode"
        class="postal-code-input"
        maxlength="6"
        placeholder="e.g 456123"
      />
      <br />
      <span class="postal-code-comment">{{ $t('location_permission_text3') }}</span>
      <br />
      <br />
      <span class="postal-code-comment">{{
        isPlatform('ios') ? $t('location_permission_text4') : $t('location_permission_text5')
      }}</span>
    </div>
    <div class="confirmButton">
      <ion-button expand="block" @click="onAllowLocation()">
        {{ $t('allow_location_access') }}
      </ion-button>
      <ion-button :disabled="postalCode === ''" expand="block" fill="outline" @click="onUsePostalCode()">
        {{ $t('use_this_postal_code') }}
      </ion-button>
    </div>
  </ion-content>
</template>
<script>
import { IonContent, IonButton, IonInput, isPlatform } from '@ionic/vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'LocationPermission',
  components: {
    IonContent,
    IonButton,
    IonInput
  },
  data: () => {
    return {
      postalCode: ''
    };
  },
  setup() {
    return {
      isPlatform
    };
  },
  methods: {
    onAllowLocation() {
      this.$emit('allowLocation');
    },
    onUsePostalCode() {
      this.$emit('usePostalCode', this.postalCode);
    }
  }
});
</script>
<style scoped lang="scss">
@import 'locationPermissionModal.scss';
</style>

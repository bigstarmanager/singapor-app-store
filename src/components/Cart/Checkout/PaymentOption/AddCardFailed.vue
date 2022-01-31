<template>
  <ion-page>
    <ion-header />
    <ion-content fullscreen="true" class="content" scroll-y="false">
      <img @click="$emit('close-loader')" src="/assets/images/SWM-icons-outline-cross.svg" alt="close" />
      <div class="flex">
        <lottie-vue :isOpen="true" :height="height" :width="width" :options="defaultOptions" />
        <p class="add-card-failed">{{ $t('adding_card_failed') }}</p>
        <span class="error_message">{{ errorMessage }}</span>
      </div>
    </ion-content>
    <ion-footer>
      <ion-button class="addcard-btn" expand="block" @click="$emit('close-loader')">
        {{ $t('add_another_card') }}
      </ion-button>
      <div class="contact_support" @click="$router.replace({ name: 'Help' })">
        {{ $t('checkout_loader.contact_support') }}
      </div>
    </ion-footer>
  </ion-page>
</template>

<script>
import { defineComponent, ref, watchEffect } from 'vue';
import LottieVue from '@/components/Shared/Lottie.vue';
import * as failData from '@/assets/lottie/checkout/fail.json';
import { IonContent, IonPage, IonButton, IonFooter, IonHeader } from '@ionic/vue';
import { useI18n } from 'vue-i18n';

export default defineComponent({
  name: 'AddCardFailed',
  components: { LottieVue, IonContent, IonPage, IonButton, IonFooter, IonHeader },
  props: {
    error: String
  },
  setup(props, { emit }) {
    const defaultOptions = ref({
      animationData: failData.default,
      loop: false
    });
    const width = ref(160);
    const height = ref(160);
    const { t } = useI18n();
    const errorMessage = ref(t('add_card_failed.general'));
    watchEffect(() => {
      switch (props.error) {
        case 'stolen_card':
        case 'pickup_card':
        case 'restricted_card':
          errorMessage.value = t('add_card_failed.stolen_card');
          break;
        case 'incorrect_cvc':
        case 'incorrect_number':
        case 'invalid_account':
          errorMessage.value = t('add_card_failed.invalid_account');
          break;
        case 'invalid_expiry_month':
        case 'invalid_expiry_year':
        case 'expired_card':
          errorMessage.value = t('add_card_failed.expired_card');
          break;
        default:
          errorMessage.value = t('add_card_failed.general');
          break;
      }
    });
    const onNext = () => {
      emit('close-loader');
    };

    return {
      defaultOptions,
      errorMessage,
      width,
      height,
      onNext
    };
  }
});
</script>

<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'AddCardFailed.scss';
</style>

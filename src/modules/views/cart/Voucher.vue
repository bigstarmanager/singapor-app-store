<template>
  <ion-page>
    <lottie-vue :isOpen="isLoading" :options="defaultOptions" :overlay="{ opacity: 1 }" />
    <ion-header>
      <ion-toolbar>
        <div class="voucher-model-header">
          <ion-text class="ion-no-padding">{{ $t('apply_treedots_voucher') }} </ion-text>
          <ion-img :src="closeIcon" @click="handleClose"></ion-img>
        </div>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item class="voucher-container" :class="error != '' ? 'error' : ''">
        <ion-input type="text" :placeholder="$t('enter_voucher_code')" v-model="voucherCode"></ion-input>
      </ion-item>
      <span class="error ion-margin" v-if="error != ''">
        {{ error }}
      </span>
      <VoucherList :handleClose="handleClose" :resetVoucherCode="resetVoucherCode" />
    </ion-content>
    <ion-footer>
      <ion-toolbar>
        <ion-list>
          <ion-button
            class="checkout-btn"
            expand="block"
            :disabled="voucherCode.length == 0"
            @click="applyVoucher"
            ><span>{{ $t('apply') }}</span></ion-button
          >
        </ion-list>
      </ion-toolbar>
    </ion-footer>
  </ion-page>
</template>

<script>
import { voucherValidation } from '@/services/shared/graphql';
import { buildOrderItems } from '@/services/shared/helper/cart';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonButton,
  IonFooter,
  IonItem,
  IonInput,
  IonList,
  IonText,
  IonImg
} from '@ionic/vue';
import { useMutation } from '@vue/apollo-composable';
import { defineComponent, ref, inject } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import LottieVue from '@/components/Shared/Lottie.vue';
import VoucherList from '@/components/VoucherList';
import * as animationData from '@/assets/lottie/main-loader.json';
import clevertap from '@/services/shared/helper/clevertap';
import closeIcon from '@/assets/images/shape.svg';

export default defineComponent({
  name: 'Voucher',
  props: ['closeModal'],
  components: {
    IonHeader,
    IonToolbar,
    IonContent,
    IonPage,
    IonButton,
    IonFooter,
    IonItem,
    IonInput,
    IonList,
    IonText,
    LottieVue,
    VoucherList,
    IonImg
  },
  setup(props) {
    const storage = inject('$storage');
    const store = useStore();
    const voucher_code = store.getters['b2c/currentVoucherCode'];
    const voucherCode = ref(voucher_code || '');
    const error = ref('');
    const router = useRouter();
    const { mutate: voucherValidationFn } = useMutation(voucherValidation);
    const cart = store.getters['b2c/getCart'];
    const isLoading = ref(false);

    const handleClose = () => props?.closeModal();

    const resetVoucherCode = () => {
      voucherCode.value = '';
    };

    return {
      voucherCode,
      error,
      router,
      cart,
      voucherValidationFn,
      defaultOptions: { animationData: animationData.default },
      isLoading,
      storage,
      closeIcon,
      handleClose,
      resetVoucherCode
    };
  },
  beforeRouteEnter(to, from, next) {
    if (from.name != 'Cart' && from.name != 'Checkout') {
      next({
        name: 'Cart'
      });
      return;
    }

    next();
  },
  methods: {
    async applyVoucher() {
      if (this.voucherCode == '') {
        return;
      }

      const orderItems = buildOrderItems(this.cart);
      this.isLoading = true;

      let stateName = 'Singapore';
      const user = await this.storage.getUser();
      if (user.country.id !== 193) {
        const state = await this.storage.getSelectedState();
        stateName = state?.state || '';
      }

      this.voucherValidationFn({
        vouchercode: this.voucherCode,
        metadataB2b: false,
        metadataB2c: true,
        metadataState: stateName,
        totalAmount: orderItems.totalAmount,
        orderItems: orderItems.items
      }).then((res) => {
        this.isLoading = false;
        if (res.data.voucherValidation == null) {
          this.error = 'Error with voucherify! Please try again later.';
          return;
        }

        const voucherResult = res.data.voucherValidation;
        if (!voucherResult.valid) {
          const isVoucherNotFound = voucherResult.error && voucherResult.error.code === 404;
          this.error =
            !isVoucherNotFound && voucherResult.error.message
              ? voucherResult.error.message
              : voucherResult.reason;
          return;
        }

        this.$store.dispatch('b2c/setVoucher', voucherResult);
        this.handleClose();
        (async () => {
          const user = await this.storage.getUser();
          clevertap.recordEventWithNameAndProps('Voucher Applied', {
            'voucher code': this.voucherCode,
            'voucher amount': voucherResult?.discount?.amount_off
              ? (voucherResult?.discount?.amount_off / 100).toFixed(2)
              : 0,
            'currency symbol': user.country.currency_symbol
          });
        })();
      });
    }
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'Voucher.scss';
</style>

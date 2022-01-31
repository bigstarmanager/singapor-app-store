<template>
  <ion-list v-if="allVouchers?.vouchers?.length !== 0">
    <div class="voucher-list">
      <span>{{ $t('available_vouchers_for_you') }}</span>
      <ion-radio-group
        v-for="voucher in allVouchers.vouchers"
        :key="voucher.id"
        class="voucher-block"
        allowEmptySelection="true"
        :value="selectedVoucherId"
        @ionChange="handleChange"
      >
        <h1 :style="`background-image: url(${voucherImage})`">
          {{
            `${user?.country?.currency_symbol ?? ''}$${getTotalDiscountAmount(
              voucher.order.total_discount_amount ?? 0
            )}`
          }}
        </h1>
        <div class="voucher-info-wrapper">
          <div @click="onClick(voucher.id)" class="voucher-info">
            <span class="bold">{{ $t('voucher') }}</span>
            <span>{{
              $t('discount_voucher') +
              ' ' +
              `S$ ${getTotalDiscountAmount(voucher.order.total_discount_amount ?? 0)}`
            }}</span>
            <span v-if="voucher.expiration_date" class="small">{{
              $t('valid_till') + ' ' + `${voucher.expiration_date}`
            }}</span>
            <span v-if="checkIsExpiring(voucher.expiration_date)" class="small error">{{
              $t('expire_soon')
            }}</span>
          </div>
          <ion-radio mode="ios" color="light" :modelValue="voucher.id"> color="primary"></ion-radio>
        </div>
      </ion-radio-group>
    </div>
  </ion-list>
</template>

<script>
import { IonList, IonRadio, IonRadioGroup } from '@ionic/vue';
import { defineComponent, ref, computed, inject } from 'vue';
import { useStore } from 'vuex';
import clevertap from '@/services/shared/helper/clevertap';
import moment from 'moment';
import voucherImage from '@/assets/images/Rectangle.svg';

export default defineComponent({
  name: 'VoucherList',
  components: {
    IonList,
    IonRadio,
    IonRadioGroup
  },
  props: ['handleClose', 'resetVoucherCode'],
  setup(props) {
    const store = useStore();
    const storage = inject('$storage');
    const allVouchers = computed(() => {
      return store.getters['b2c/getAllVouchers'];
    });
    const selectedVoucher = store.getters['b2c/getVoucher'];
    const selectedVoucherId = ref(selectedVoucher?.id);
    const user = ref(
      (async () => {
        return await storage.getUser();
      })()
    );

    const handleApplyVoucher = async (voucherResult) => {
      if (props.handleClose) {
        props.handleClose();
      }
      const user = await storage.getUser();
      const voucherCode = voucherResult.voucher_code;
      clevertap.recordEventWithNameAndProps('Voucher Applied', {
        'voucher code': voucherCode,
        'voucher amount': ((voucherResult?.order?.total_discount_amount ?? 0) / 100).toFixed(2),
        'currency symbol': user.country.currency_symbol
      });
      store.dispatch('b2c/setVoucher', JSON.parse(JSON.stringify(voucherResult)));
    };

    const clearSelectedVoucher = () => {
      props?.resetVoucherCode && props.resetVoucherCode();
      store.dispatch('b2c/setVoucher', null);
    };

    return { allVouchers, clearSelectedVoucher, handleApplyVoucher, selectedVoucherId, user, voucherImage };
  },
  methods: {
    onClick(id) {
      if (this.selectedVoucherId === id) {
        this.selectedVoucherId = undefined;
        this.clearSelectedVoucher();
      } else {
        this.selectedVoucherId = id;
        const voucher = this.allVouchers.vouchers.find((voucher) => voucher.id === this.selectedVoucherId);
        if (voucher) {
          this.handleApplyVoucher(voucher);
        }
      }
    },
    checkIsExpiring(expiryDate) {
      if (expiryDate) {
        return moment().diff(moment(expiryDate), 'days') < 7;
      } else {
        return false;
      }
    },
    getTotalDiscountAmount(totalDiscountAmount) {
      return ((totalDiscountAmount ?? 0) / 100).toFixed(2);
    },
    handleChange(event) {
      if (event.target.value !== this.selectedVoucherId) {
        this.selectedVoucherId = event.target.value;
        const voucher = this.allVouchers.vouchers.find((voucher) => voucher.id === this.selectedVoucherId);
        if (voucher) {
          this.handleApplyVoucher(voucher);
        }
      }
    }
  }
});
</script>
<style scoped lang="scss">
@import 'voucherlist.module';
</style>

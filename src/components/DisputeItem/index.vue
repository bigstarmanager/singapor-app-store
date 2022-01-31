<template>
  <div class="dispute-container">
    <ion-row class="cancelled-notice-container">
      <ion-label class="cancelled-notice">{{ dispute.status.name }}</ion-label>
    </ion-row>
    <ion-row class="dispute-title-section">
      <ion-label class="dispute-title1">{{ dispute.issue.name }}</ion-label>
      <ion-label class="dispute-title2">{{ dispute.preOrderItem.sku.product.name }}</ion-label>
    </ion-row>
    <div class="dispute-section1">
      <ion-row class="dispute-title-container">
        <ion-label class="dispute-id-text">{{ $t('order.dispute_id') }}</ion-label>
        <ion-row class="dispute-id-container">
          <ion-label class="dispute-id-number">{{ dispute.issue_id }}</ion-label>
          <ion-img :src="copy_svg" />
        </ion-row>
      </ion-row>
      <ion-row class="dispute-title-container dispute-second-part">
        <ion-label class="dispute-date-text">{{ $t('order.date_of_request') }}</ion-label>
        <ion-label class="dispute-date-text">{{ dispute.created_at }}</ion-label>
      </ion-row>
    </div>
    <div v-if="disputeType === 1" class="dispute-section2">
      <ion-row class="dispute-title-container">
        <ion-label class="dispute-id-text">{{ $t('order.resolution') }}</ion-label>
        <ion-label class="refund-price">{{ $t('order.refund') }} ${{ dispute.refunded_amount }}</ion-label>
      </ion-row>
      <ion-row class="dispute-title-container dispute-second-part2">
        <ion-label class="dispute-date-text">{{ $t('order.date_resolved') }}</ion-label>
        <ion-label class="dispute-date-text">{{ dispute.date_resolved }}</ion-label>
      </ion-row>
    </div>
    <ion-row class="dispute-product">
      <ion-img @ionError="setImageDefault($event)" :src="dispute.product_image" class="product-image" />
      <div class="product-info">
        <ion-label class="product-title">{{ dispute.preOrderItem.sku.name }}</ion-label>
        <ion-label class="product-quantity">{{ $t('order.qty') }} {{ dispute.quantity }}</ion-label>
        <ion-label class="product-price"
          >{{ currencySymbol }}{{ dispute.real_price }}/{{ dispute.preOrderItem.sku.oom.name }}</ion-label
        >
      </div>
    </ion-row>
    <ion-row v-if="disputeType === 0">
      <ion-button expand="block" fill="outline" @click="onCancelHistory(dispute)">
        {{ $t('order.cancel') }}
      </ion-button>
      <ion-button expand="block" @click="onViewHistory(dispute)">
        {{ $t('order.dispute_detail') }}
      </ion-button>
    </ion-row>
    <ion-button v-else-if="disputeType === 1" expand="block" fill="outline" @click="onViewHistory(dispute)">
      {{ $t('order.view_history') }}
    </ion-button>
  </div>
</template>

<script>
import { IonButton, IonImg, IonLabel, IonRow } from '@ionic/vue';
import { inject, ref } from 'vue';
import { noImage } from '@/utils/getImage';
import copy_svg from '@/assets/icons/shared/copy.svg';

export default {
  name: 'OrderItem',
  components: {
    IonButton,
    IonImg,
    IonLabel,
    IonRow
  },
  props: {
    dispute: Object,
    disputeType: Number,
    resolutions: Array
  },
  data: () => {
    return {
      selectedDispute: {},
      isOpenViewHistory: false
    };
  },
  methods: {
    setImageDefault(event) {
      event.target.src = noImage;
    },
    onCancelHistory() {
      this.$emit('cancel-history', this.dispute);
    },
    onViewHistory() {
      this.$emit('view-history', this.dispute);
    }
  },
  async setup() {
    const user = await inject('$storage').getUser();
    const currencySymbol = ref(user.country.currency_symbol);

    return {
      currencySymbol,
      copy_svg
    };
  }
};
</script>

<style scoped lang="scss">
@import 'disputeitem.module';
</style>

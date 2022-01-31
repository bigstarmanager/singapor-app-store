<template>
  <ion-page>
    <ion-content :scrollY="false">
      <ion-grid>
        <ion-row class="modalHeader">
          <img src="/assets/images/SWM-icons-outline-cross.svg" alt="close" @click="dismissModal" />
        </ion-row>
        <ion-row class="refundTitle">
          <ion-label>{{ $t('refund_breakdown') }}</ion-label>
        </ion-row>
        <ion-row class="refundDescription">
          <ion-label> {{ $t('refund_description1') }} </ion-label>
          <ion-label> {{ $t('refund_description2') }} </ion-label>
        </ion-row>
        <ion-row class="refundInfo">
          <div class="infoTitle">
            <ion-label> {{ $t('voucher_deduction') }} </ion-label>
            <ion-img :src="info_on" @click="show1" />
          </div>
          <div class="amount">
            <ion-label> {{ currencySymbol }} {{ refundBreakdown?.voucher?.toFixed(2) || '0.00' }} </ion-label>
          </div>
        </ion-row>
        <ion-row class="refundInfo">
          <div class="infoTitle">
            <ion-label> {{ $t('refunded_qty') }} </ion-label>
            <ion-img :src="info_on" @click="show2" />
          </div>
          <div class="amount">
            <ion-label>
              {{ refundBreakdown?.qty || 0 }}
            </ion-label>
          </div>
        </ion-row>
        <ion-row class="refundInfo">
          <div class="infoTitle">
            <ion-label> {{ $t('refunded_amount') }} </ion-label>
          </div>
          <div class="amount">
            <ion-label> {{ currencySymbol }} {{ refundBreakdown?.total?.toFixed(2) || '0.00' }} </ion-label>
          </div>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script>
import { IonPage, IonContent, IonLabel, IonImg, IonGrid, IonRow, popoverController } from '@ionic/vue';
import info_on from '/src/assets/images/info-refund.svg';
import PopoverQty from './PopoverQty.vue';
import PopoverVoucher from './PopoverVoucher.vue';
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'RefundBreakdownModal',
  components: {
    IonContent,
    IonPage,
    IonImg,
    IonLabel,
    IonGrid,
    IonRow
  },
  props: ['currencySymbol', 'refundBreakdown'],
  data: () => {
    return {
      showTooltip1: false,
      showTooltip2: false
    };
  },
  setup() {
    return {
      info_on
    };
  },
  methods: {
    dismissModal() {
      this.$emit('close-modal');
    },
    async show1(ev) {
      if (this.showTooltip2) {
        this.showTooltip2 = false;
      }
      this.showTooltip1 = true;
      const popover = await popoverController.create({
        component: PopoverQty,
        cssClass: 'refundReview-info',
        event: ev,
        backdropDismiss: true,
        showBackdrop: false,
        translucent: false
      });
      await popover.present();
      await popover.onDidDismiss();
      this.showTooltip1 = false;
    },
    async show2(ev) {
      if (this.showTooltip1) {
        this.showTooltip1 = false;
      }
      this.showTooltip2 = true;
      const popover = await popoverController.create({
        component: PopoverVoucher,
        cssClass: 'refundReview-info',
        event: ev,
        backdropDismiss: true,
        showBackdrop: false,
        translucent: false
      });
      await popover.present();
      await popover.onDidDismiss();
      this.showTooltip2 = false;
    }
  }
});
</script>
<style scoped lang="scss">
@import 'RefundBreakdownModal.scss';
</style>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/orders/dispute" />
        </ion-buttons>
        <ion-label class="view-history-title">{{ $t('order.dispute_detail') }}</ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div v-if="dispute.status_id === 6" class="alert-message-container">
        <ion-label class="alert-message-text">
          {{ $t('order.supplier_rejection_description1') }}{{ currencySymbol }}{{ dispute.real_price
          }}{{ $t('order.supplier_rejection_description2') }}
        </ion-label>
      </div>
      <div class="resolution-container">
        <ion-row class="history-row">
          <ion-label class="resolution-left-text">{{ $t('order.resolution') }}</ion-label>
          <ion-label class="resolution-right-text"
            >{{ $t('order.refund') }} ${{ dispute.refunded_amount }}</ion-label
          >
        </ion-row>
        <ion-row class="history-row history-margin">
          <ion-label class="resolution-text">{{ $t('order.date_resolved') }}</ion-label>
          <ion-label class="datetime-text">{{ dispute.date_resolved }}</ion-label>
        </ion-row>
      </div>
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
              <ion-label class="dispute-id-number">{{ dispute.id }}</ion-label>
              <ion-img :src="copy_svg" />
            </ion-row>
          </ion-row>
          <ion-row class="dispute-title-container dispute-second-part">
            <ion-label class="dispute-date-text">{{ $t('order.date_of_request') }}</ion-label>
            <ion-label class="dispute-date-text">{{ dispute.created_at }}</ion-label>
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
        <div v-if="dispute.histories.length > 0" class="dispute-history">
          {{ $t('order.dispute_history') }}
        </div>
        <div v-if="dispute.histories.length > 0" class="dispute-history dispute-history-list">
          <div v-for="(history, index) in dispute.histories" :key="index" class="history-item-container">
            <div>
              <div class="history-dots" />
              <div class="history-line" :class="index === dispute.histories.length - 1 ? 'last' : ''" />
            </div>
            <div class="history-content-container">
              <ion-label class="history-description">{{ history.description || ' ' }}</ion-label>
              <div class="history-date">{{ history.created_at }}</div>
              <ion-row
                v-if="history.status_id === 6"
                class="view-detail-container"
                @click="onOpenViewDetail(history)"
              >
                <ion-label class="history-view-detail">{{ $t('order.view_detail') }}</ion-label>
                <ion-img :src="arrow_top_right" />
              </ion-row>
            </div>
          </div>
        </div>
      </div>
      <div class="dispute-container">
        <ion-row @click="isOpenDetail = !isOpenDetail" class="dispute-title-container">
          <ion-label class="dispute-title1">{{ $t('order.dispute_detail') }}</ion-label>
          <ion-icon :src="isOpenDetail ? chevronUpOutline : chevronDownOutline" />
        </ion-row>
        <div v-if="isOpenDetail" class="dispute-detail-description">
          <p class="resolution-left-text">{{ $t('description') }}</p>
          <ion-label class="resolution-left-text">{{ dispute.description }}</ion-label>
        </div>
        <div v-if="isOpenDetail">
          <p>{{ $t('order.dispute_attach_photo_video') }}</p>
          <ion-row v-for="(dispute_attach, index) in dispute.dispute_attachments" :key="index">
            <ion-img
              @ionError="setImageDefault($event)"
              :src="dispute_attach.imageSrc"
              class="dispute-detail-attach-image"
            />
          </ion-row>
          <p class="dispute-detail-attach-description">{{ $t('order.dispute_attach_description') }}</p>
          <p>Desired solution</p>
          <ion-row v-for="(resolution, index) in resolutions" :key="index">
            <ion-label
              :class="
                resolution.id === dispute.resolution_id
                  ? 'category-button-selected'
                  : 'category-button-deselect'
              "
            >
              {{ resolution.name }}
            </ion-label>
          </ion-row>
        </div>
      </div>
    </ion-content>
    <ion-footer>
      <ion-button
        v-if="dispute.status_id === 2 || dispute.status_id === 4"
        expand="block"
        fill="outline"
        @click="onCancelDispute(dispute)"
      >
        {{ $t('order.cancel') }}
      </ion-button>
      <div v-else-if="dispute.status_id === 5">
        <ion-button expand="block" @click="onResolveDispute(dispute)">
          {{ $t('order.resolve_dispute') }}
        </ion-button>
        <ion-label class="resolve-description-text">{{ $t('order.resolve_dispute_description') }}</ion-label>
      </div>
      <div v-else-if="dispute.status_id === 6">
        <ion-button expand="block" @click="onAcceptRejection(dispute)">
          {{ $t('order.accept_rejection') }}
        </ion-button>
        <ion-button
          expand="block"
          fill="outline"
          class="appeal-to-treedots-button"
          @click="onAppealToTreeDots"
        >
          {{ $t('order.appeal_to_treedots') }}
        </ion-button>
      </div>
    </ion-footer>
    <ion-modal
      :is-open="isOpenViewDetail"
      css-class="view-detail-modal"
      @didDismiss="isOpenViewDetail = false"
    >
      <dispute-view-detail :history="selectedHistory" @close-view-detail="isOpenViewDetail = false" />
    </ion-modal>
    <ion-modal
      :is-open="isOpenAppealTreedots"
      css-class="appeal-treedots-modal"
      @didDismiss="isOpenAppealTreedots = false"
    >
      <dispute-appeal-treedots
        :dispute="dispute"
        @submit-appeal="appealToTreeDots"
        @close-appeal-treedots="isOpenAppealTreedots = false"
      />
    </ion-modal>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import {
  IonButton,
  IonButtons,
  IonBackButton,
  IonContent,
  IonFooter,
  IonPage,
  IonHeader,
  IonLabel,
  IonModal,
  IonIcon,
  IonImg,
  IonRow,
  IonToolbar,
  alertController
} from '@ionic/vue';
import { chevronUpOutline, chevronDownOutline } from 'ionicons/icons';
import { useMutation } from '@vue/apollo-composable';
import moment from 'moment';
import DisputeViewDetail from '@/components/DisputeViewDetail';
import DisputeAppealTreedots from '@/components/DisputeAppealTreedots';
import {
  cancelB2cDispute,
  resolveB2cDispute,
  acceptRejectedB2cDispute,
  appealRejectedB2cDispute
} from '@/services/shared/graphql';
import { getImage, noImage } from '@/utils/getImage';
import copy_svg from '@/assets/icons/shared/copy.svg';
import arrow_top_right from '@/assets/icons/shared/arrow_top_right.svg';
import exclamation_circle from '@/assets/icons/shared/exclamation_circle.svg';

export default defineComponent({
  name: 'DisputeDetails',
  components: {
    IonButton,
    IonButtons,
    IonBackButton,
    IonContent,
    IonFooter,
    IonPage,
    IonHeader,
    IonLabel,
    IonModal,
    IonIcon,
    IonImg,
    IonRow,
    IonToolbar,
    DisputeViewDetail,
    DisputeAppealTreedots
  },
  data: () => {
    return {
      selectedHistory: {},
      isOpenViewDetail: false,
      isOpenAppealTreedots: false,
      isOpenAppealSubmitted: false
    };
  },
  props: {
    dispute: Object,
    disputeType: Number,
    resolutions: Array,
    currencySymbol: String
  },
  methods: {
    async onOpenViewDetail(history) {
      this.selectedHistory = history;
      this.selectedHistory.created_at = moment(history.created_at).format('DD MMM YYYY, hh:mm A');
      this.selectedHistory.history_attachments = [];
      const { attachments = [] } = this.selectedHistory;
      for (let i = 0; i < attachments.length; i++) {
        const imageSrc = await getImage(`${attachments[i].file_name}`, 'b2c-disputes');
        this.selectedHistory.history_attachments.push({ imageSrc });
      }
      this.isOpenViewDetail = true;
    },
    async onAcceptRejection(dispute) {
      const alert = await alertController.create({
        cssClass: 'cancel-issue-confirm .alert-wrapper',
        header: this.$t('order.accept_rejection_confirm_title'),
        message:
          '<div class="alert-message-container"><ion-img class="exclamation-mark" src="' +
          this.exclamation_circle +
          '"></ion-img>' +
          '<ion-label class="alert-message-text">' +
          this.$t('order.accept_rejection_confirm_description') +
          '</ion-label></div>',
        buttons: [
          {
            text: 'CANCEL',
            role: 'cancel'
          },
          {
            text: 'ACCEPT',
            handler: () => {
              this.fetchAcceptRejectedB2cDispute({ id: dispute.id })
                .then()
                .catch((error) => {
                  console.error(error);
                });
            }
          }
        ]
      });
      return alert.present();
    },
    onAppealToTreeDots() {
      this.isOpenAppealTreedots = true;
    },
    appealToTreeDots(item) {
      this.fetchAppealRejectedB2cDispute(item)
        .then(() => {
          this.isOpenAppealSubmitted = true;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    onResolveDispute(dispute) {
      this.fetchResolveB2cDispute({ id: dispute.id })
        .then()
        .catch((error) => {
          console.error(error);
        });
    },
    async onCancelDispute(dispute) {
      const alert = await alertController.create({
        cssClass: 'cancel-issue-confirm .alert-wrapper',
        header: this.$t('order.want_to_cancel_issue'),
        buttons: [
          {
            text: 'NO',
            role: 'cancel'
          },
          {
            text: 'YES, CANCEL',
            handler: () => {
              this.fetchCancelB2cDispute({ id: dispute.id })
                .then((res) => {
                  const { cancelB2cDispute } = res.data;
                  if (cancelB2cDispute) {
                    this.isOpenViewDetail = true;
                  }
                })
                .catch((error) => {
                  console.error(error);
                });
            }
          }
        ]
      });
      return alert.present();
    },
    setImageDefault(event) {
      event.target.src = noImage;
    }
  },
  setup() {
    const isOpenDetail = ref(false);
    const { mutate: fetchCancelB2cDispute } = useMutation(cancelB2cDispute);
    const { mutate: fetchResolveB2cDispute } = useMutation(resolveB2cDispute);
    const { mutate: fetchAcceptRejectedB2cDispute } = useMutation(acceptRejectedB2cDispute);
    const { mutate: fetchAppealRejectedB2cDispute } = useMutation(appealRejectedB2cDispute);

    return {
      isOpenDetail,
      fetchCancelB2cDispute,
      fetchResolveB2cDispute,
      fetchAcceptRejectedB2cDispute,
      fetchAppealRejectedB2cDispute,
      arrow_top_right,
      copy_svg,
      exclamation_circle,
      chevronUpOutline,
      chevronDownOutline
    };
  }
});
</script>

<style scoped lang="scss">
@import 'dispute.details.module';
</style>

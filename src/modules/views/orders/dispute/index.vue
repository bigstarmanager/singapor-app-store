<template>
  <ion-page>
    <ion-content class="order_overview_container" :scroll-events="true">
      <ion-row class="category-container">
        <ion-label
          :class="selectedCategory === 0 ? 'category-button-selected' : 'category-button-deselect'"
          @click="onSelectCategory(0)"
        >
          {{ $t('order.ongoing') }}
        </ion-label>
        <ion-label
          :class="selectedCategory === 1 ? 'category-button-selected' : 'category-button-deselect'"
          @click="onSelectCategory(1)"
        >
          {{ $t('order.completed') }}
        </ion-label>
        <ion-label
          :class="selectedCategory === 2 ? 'category-button-selected' : 'category-button-deselect'"
          @click="onSelectCategory(2)"
        >
          {{ $t('order.draft') }}
        </ion-label>
      </ion-row>
      <div v-if="Object.keys(disputedOrders).length > 0">
        <ion-grid class="pa-0" v-for="(dispute, index) in disputedOrders" :key="index">
          <DisputeItem
            :dispute="dispute"
            :disputeType="selectedCategory"
            :resolutions="resolutions"
            @cancel-history="onCancelHistory"
            @view-history="onViewHistory"
          />
        </ion-grid>
      </div>
      <ion-grid v-else class="empty-content">
        <ion-img src="/assets/images/empty_orders.png" />
        <ion-label> {{ $t('order.have_no_overview') }} </ion-label>
        <ion-label>
          <span class="browse" @click="gotoCategory()">{{ $t('order.browse') }}</span>
          {{ $t('order.our_food') }}
        </ion-label>
      </ion-grid>
      <div v-show="isLoading">
        <ion-item class="padding-0 order-item" v-for="index in 3" v-bind:key="index">
          <SkeletonOrderItem />
        </ion-item>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { IonItem, IonContent, IonPage, IonLabel, IonImg, IonGrid, IonRow, alertController } from '@ionic/vue';
import { defineComponent, ref, inject } from 'vue';
import {
  getAllOngoingDisputes,
  getAllCompletedDisputes,
  getB2cDisputeIssuesAndResolutions,
  cancelB2cDispute
} from '@/services/shared/graphql';
import { useMutation } from '@vue/apollo-composable';
import { useStore } from 'vuex';
import moment from 'moment';
import DisputeItem from '@/components/DisputeItem';
import SkeletonOrderItem from '@/components/OrderItem/skeletonOrderItem.vue';
import { getImage } from '@/utils/getImage';
import copy_svg from '@/assets/icons/shared/copy.svg';

export default defineComponent({
  name: 'OrderOverview',
  components: {
    IonItem,
    IonContent,
    IonPage,
    IonLabel,
    IonImg,
    IonGrid,
    IonRow,
    DisputeItem,
    SkeletonOrderItem
  },
  async setup() {
    const store = useStore();
    let isLoading = ref(true);
    const selectedCategory = ref(0);
    const disputedOrders = ref([]);
    const resolutions = ref([]);
    const { mutate: fetchAllOngoingDisputes } = useMutation(getAllOngoingDisputes);
    const { mutate: fetchAllCompletedDisputes } = useMutation(getAllCompletedDisputes);
    const { mutate: fetchB2cDisputeIssuesAndResolutions } = useMutation(getB2cDisputeIssuesAndResolutions);
    const { mutate: fetchCancelB2cDispute } = useMutation(cancelB2cDispute);

    const currentUser = await inject('$storage').getUser();
    const currencySymbol = ref(currentUser.country.currency_symbol);

    fetchB2cDisputeIssuesAndResolutions()
      .then((res) => {
        resolutions.value = res.data.getB2cDisputeIssuesAndResolutions.resolutions;
      })
      .catch((error) => {
        console.error(error);
      });

    const getOverViewData = () => {
      if (selectedCategory.value === 0) {
        fetchAllOngoingDisputes({ userId: currentUser.id })
          .then(async (res) => {
            let response = res.data.getAllOngoingDisputes;
            for (let i = 0; i < response.length; i++) {
              response[i].dispute_attachments = [];
              response[i].created_at = moment(response[i].created_at).format('DD MMM YYYY, hh:mm A');
              const histories = response[i].histories.filter((e) => e.status_id === 14);
              if (Object.keys(histories).length > 0) {
                response[i].date_resolved = moment(histories[0].created_at).format('DD MMM YYYY, hh:mm A');
              } else {
                response[i].date_resolved = 'N/A';
              }
              response[i].real_price = (
                (response[i].preOrderItem.total_price + response[i].preOrderItem.tax) /
                response[i].preOrderItem.total_qty
              ).toFixed(2);
              response[i].product_image = await getImage(
                `${response[i].preOrderItem.sku.product.image}.png`,
                'products'
              );
              for (let j = 0; j < response[i].histories.length; j++) {
                response[i].histories[j].created_at = moment(response[i].histories[j].created_at).format(
                  'DD MMM YYYY, hh:mm A'
                );
                const { attachments = [] } = response[i].histories[j];
                for (let k = 0; k < attachments.length; k++) {
                  const imageSrc = await getImage(`${attachments[k].file_name}`, 'b2c-disputes');
                  response[i].dispute_attachments.push({ imageSrc });
                }
              }
            }
            disputedOrders.value = response;
            isLoading.value = false;
          })
          .catch((error) => {
            console.error(error);
            isLoading.value = false;
          });
      } else if (selectedCategory.value === 1) {
        fetchAllCompletedDisputes({ userId: currentUser.id })
          .then(async (res) => {
            let response = res.data.getAllCompletedDisputes;
            for (let i = 0; i < response.length; i++) {
              response[i].dispute_attachments = [];
              response[i].created_at = moment(response[i].created_at).format('DD MMM YYYY, hh:mm A');
              const histories = response[i].histories.filter((e) => e.status_id === 14);
              if (Object.keys(histories).length > 0) {
                response[i].date_resolved = moment(histories[0].created_at).format('DD MMM YYYY, hh:mm A');
              } else {
                response[i].date_resolved = 'N/A';
              }
              response[i].real_price = (
                (response[i].preOrderItem.total_price + response[i].preOrderItem.tax) /
                response[i].preOrderItem.total_qty
              ).toFixed(2);
              response[i].product_image = await getImage(
                `${response[i].preOrderItem.sku.product.image}.png`,
                'products'
              );
              for (let j = 0; j < response[i].histories.length; j++) {
                response[i].histories[j].created_at = moment(response[i].histories[j].created_at).format(
                  'DD MMM YYYY, hh:mm A'
                );
                const { attachments = [] } = response[i].histories[j];
                for (let k = 0; k < attachments.length; k++) {
                  const imageSrc = await getImage(`${attachments[k].file_name}`, 'b2c-disputes');
                  response[i].dispute_attachments.push({ imageSrc });
                }
              }
            }
            disputedOrders.value = response;
            isLoading.value = false;
          })
          .catch((error) => {
            console.error(error);
            isLoading.value = false;
          });
      }
    };

    /** & not from checkout */
    if (currentUser.id && !store.getters['b2c/getUpdateOrdersPage']) {
      getOverViewData();
    }

    const loadData = (ev) => {
      isLoading.value = true;
      getOverViewData();
      ev.target.complete();
    };

    return {
      selectedCategory,
      disputedOrders,
      resolutions,
      currencySymbol,
      fetchCancelB2cDispute,
      getOverViewData,
      isLoading,
      loadData,
      copy_svg
    };
  },
  ionViewWillEnter() {
    if (this.$store.getters['b2c/getUpdateOrdersPage']) {
      this.isLoading = true;
      this.getOverViewData();
      this.$store.dispatch('b2c/setUpdateOrdersPage', { status: false });
    }
  },
  methods: {
    onSelectCategory(categoryIndex) {
      if (this.selectedCategory !== categoryIndex) {
        this.selectedCategory = categoryIndex;
        this.isLoading = true;
        this.getOverViewData();
      }
    },
    gotoCategory() {
      this.$router.push('/main/category');
    },
    async onCancelHistory(dispute) {
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
                    this.disputedOrders = this.disputedOrders.filter((e) => e.id !== dispute.id);
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
    onViewHistory(dispute) {
      this.$router.push({
        name: 'dispute-details',
        params: {
          dispute: JSON.stringify(dispute),
          disputeType: this.selectedCategory,
          currencySymbol: this.currencySymbol,
          resolutions: JSON.stringify(this.resolutions)
        }
      });
    }
  }
});
</script>

<style scoped lang="scss">
@import 'dispute.module';
</style>

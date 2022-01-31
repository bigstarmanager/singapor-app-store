<template>
  <div class="order-content" v-if="Object.keys(orders).length > 0">
    <ion-grid class="pa-0 order-item" v-for="(key, index) in Object.keys(orders)" :key="index">
      <ion-row class="order-no" align-items-center>
        <ion-col class="order-number">
          <ion-label>{{ $t('order.order_No') }} {{ orders[key].id }}</ion-label>
        </ion-col>
      </ion-row>
      <ion-row class="location">
        <ion-col class="pa-0" align-self-center>
          <ion-img :src="gmarker" />
          <ion-row class="address" align-items-center v-if="!!orders[key].hub.address.length">
            <ion-col class="pa-0">
              <div>
                {{ getDeliveryAddress(orders[key].hub.address) }}
              </div>
            </ion-col>
          </ion-row>
          <ion-row class="chat">
            <ion-col class="pa-0">
              <div @click="gotoChat(orders[key].hub)">
                <span>
                  {{ $t('order.chart_with_hub') }} &nbsp;
                  <ion-img :src="chat_orders" />
                </span>
              </div>
            </ion-col>
          </ion-row>
        </ion-col>
      </ion-row>

      <ion-row class="order-content-part" :class="showTotalPrice ? 'showTotal' : ''">
        <ion-grid
          v-for="(supplierKey, index_sup) in Object.keys(orders[key].suppliers)"
          :key="index_sup"
          class="pa-0 supplier-part"
        >
          <ion-row class="group-by">
            <ion-col class="pa-0 name">
              <ion-img src="/assets/images/store-icon.svg" class="store-icon" style="width: 18px" />
              <ion-label v-if="orders[key].suppliers[supplierKey].info">
                {{ getSupplierName(orders[key].suppliers[supplierKey].info.name) }}
              </ion-label>
              <ion-label v-else> </ion-label>
            </ion-col>
            <ion-col class="pa-0 group-text" v-show="showProgress">
              <ion-label>
                {{ $t('order.group_buy_progress') }}
              </ion-label>
            </ion-col>
          </ion-row>
          <ion-row class="progress-bar" v-show="showProgress">
            <div class="progress-back">
              <div class="progress-text back">
                {{ currencyCode == 'MYR' ? '' : `$`
                }}{{
                  orders[key].suppliers[supplierKey].info
                    ? orders[key].suppliers[supplierKey].info.current_order.toFixed(2)
                    : '0.00'
                }}/{{
                  orders[key].suppliers[supplierKey].info
                    ? orders[key].suppliers[supplierKey].info.minimum_order.toFixed(2)
                    : '0.00'
                }}&nbsp;<span class="currency">{{ currencyCode }}</span>
              </div>
              <div
                class="progress-text front"
                :style="
                  'clip-path: inset( 0 0 0 ' + getprogresswidth(orders[key].suppliers[supplierKey]) + '%)'
                "
              >
                {{ currencyCode == 'MYR' ? '' : `$`
                }}{{
                  orders[key].suppliers[supplierKey].info
                    ? orders[key].suppliers[supplierKey].info.current_order.toFixed(2)
                    : '0.00'
                }}/{{
                  orders[key].suppliers[supplierKey].info
                    ? orders[key].suppliers[supplierKey].info.minimum_order.toFixed(2)
                    : '0.00'
                }}&nbsp;<span class="currency">{{ currencyCode }}</span>
              </div>
            </div>
          </ion-row>

          <ion-list
            class="bg-white package-part"
            v-for="(orderItem, index_item) in orders[key].suppliers[supplierKey].orders"
            :key="index_item"
          >
            <ion-row class="package-header">
              <ion-col class="package-no pa-0" size="4">
                <div class="text">{{ $t('order.package_no') }}:</div>
                <div>{{ orderItem.id }}</div>
              </ion-col>
              <ion-col class="estimate-date pa-0">
                <div>
                  {{
                    ORDER_STATUS.PREPARING.includes(orderItem.order_status_id)
                      ? $t('order.estimated_collection_date')
                      : $t('order.collection_date')
                  }}
                </div>
                <div class="text">
                  {{ dayjs(orderItem.delivery_date).format('ddd, D/M/YY') }}
                </div>
              </ion-col>
            </ion-row>

            <ion-list class="item-list">
              <ion-item v-for="(item, index_item) in orderItem.pre_order_item" :key="index_item" lines="none">
                <ion-grid
                  class="pre-order original_item"
                  :class="
                    (item.order_item_status_id == ORDER_STATUS.COLLECTED && item.voucher_discount) ||
                    ORDER_STATUS.CANCELLED.includes(item.order_item_status_id)
                      ? `extraMargin order_item_` + item.id
                      : `order_item_` + item.id
                  "
                >
                  <OrderItemImage :sku="item.sku" />
                  <ion-row class="product-info">
                    <div class="product-name" @click="gotoProductDetail(item.sku.product_id)">
                      {{ item.sku.name }}
                    </div>
                    <ion-label class="amount" @click="gotoProductDetail(item.sku.product_id)">
                      Qty: {{ item.total_qty }}
                    </ion-label>
                    <ion-label class="price" @click="gotoProductDetail(item.sku.product_id)">
                      {{ currencySymbol
                      }}{{ displayPrice(item.sale_unit_price, item.original_tax).toFixed(2) }} /{{
                        item.sku.oom.name
                      }}
                    </ion-label>
                    <ion-button
                      v-if="[11, 12, 13, 14].includes(item.order_item_status_id)"
                      size="default"
                      class="action-btn buy-agian-btn"
                      @click="gotoProductDetail(item.sku.product_id)"
                      >{{ $t('order.buy_again') }}
                    </ion-button>
                    <ion-button
                      v-if="[-1, -2].includes(item.order_item_status_id)"
                      fill="outline"
                      class="action-btn"
                      size="default"
                      @click="showCancelModal(item.id)"
                    >
                      {{ $t('order.cancel') }}
                    </ion-button>
                  </ion-row>
                  <div
                    class="order_extra_tag"
                    v-if="item.order_item_status_id == ORDER_STATUS.COLLECTED && item.discount"
                  >
                    <span>{{ currencySymbol }}{{ item.discount.toFixed(2) }}{{ $t('order.cashback') }}</span>
                  </div>
                  <div
                    class="order_extra_tag"
                    v-else-if="ORDER_STATUS.CANCELLED.includes(item.order_item_status_id)"
                  >
                    <span
                      >{{ currencySymbol
                      }}{{
                        calculateLastTotalPrice(orderItem.paymentB2c, item.total_price + item.tax).toFixed(2)
                      }}
                      {{ $t('order.refunded') }}</span
                    >
                    <ion-img
                      :src="info_on"
                      @click="
                        openRefund(
                          getVoucherAmount(orderItem),
                          item.total_qty,
                          calculateLastTotalPrice(orderItem.paymentB2c, item.total_price + item.tax)
                        )
                      "
                    />
                  </div>
                  <div class="order_status volume_deal" v-if="item.sku && item.sku.sku_deals.length !== 0">
                    <span>+&nbsp;{{ $t('volume_deal_s') }} <ion-icon :icon="checkmark"></ion-icon></span>
                  </div>
                  <div class="pooling_status" v-if="item.sku && item.sku.is_b2c_pooling">
                    <span> <ion-img :src="order_pooling_svg" />{{ getPoolingStatus(item.pool_item) }} </span>
                  </div>
                </ion-grid>
                <ion-grid class="pre-order pa-0 skeleton_item" :class="`skeleton_item_` + item.id">
                  <ion-thumbnail class="product-image">
                    <ion-skeleton-text></ion-skeleton-text>
                  </ion-thumbnail>
                  <ion-row class="product-info">
                    <div class="product-name">
                      <ion-skeleton-text animated style="width: 80%; height: 30px"></ion-skeleton-text>
                    </div>
                    <ion-label class="amount">
                      <ion-skeleton-text animated style="width: 30px; height: 18px"></ion-skeleton-text>
                    </ion-label>
                    <ion-label class="price">
                      <ion-skeleton-text animated style="width: 50px; height: 18px"></ion-skeleton-text>
                    </ion-label>
                  </ion-row>
                </ion-grid>
              </ion-item>
            </ion-list>

            <div class="separator"></div>
          </ion-list>
        </ion-grid>
      </ion-row>
      <ion-list class="totalPrice" v-if="showTotalPrice">
        <ion-row>
          <ion-col class="title"> {{ $t('order.order_amount') }} </ion-col>
          <ion-col class="price">
            {{ currencySymbol
            }}{{ orders[key].totalOrder ? orders[key].totalOrder.toFixed(2) : 0.0 }}</ion-col
          >
        </ion-row>
        <ion-row>
          <ion-col class="title"> {{ $t('order.voucher_savings') }} </ion-col>
          <ion-col class="price">
            {{ currencySymbol
            }}{{ orders[key].totalDiscount ? orders[key].totalDiscount.toFixed(2) : '0.00' }}
          </ion-col>
        </ion-row>
        <ion-row class="total">
          <ion-col class="title"> {{ $t('order.total_paid') }} </ion-col>
          <ion-col class="price">
            {{ currencySymbol
            }}{{ getTotalPaid(orders[key].totalOrder - orders[key].totalDiscount).toFixed(2) }}
          </ion-col>
        </ion-row>
      </ion-list>
    </ion-grid>
  </div>
</template>

<script>
import gmarker from '/src/assets/images/gmarker.svg';
import chat_orders from '/src/assets/images/chat_orders.svg';
import info_on from '/src/assets/images/info-refund.svg';
import {
  IonIcon,
  IonImg,
  IonList,
  IonItem,
  IonLabel,
  IonGrid,
  IonRow,
  IonCol,
  IonButton,
  alertController,
  IonThumbnail,
  IonSkeletonText,
  loadingController
} from '@ionic/vue';
import { checkmark } from 'ionicons/icons';
import dayjs from 'dayjs';
import { ORDER_STATUS } from '../../services/shared/helper/constants';
import { useRouter } from 'vue-router';
import SendBirdService from '@/services/shared/helper/sendbird';
import { inject } from 'vue';
import order_pooling_svg from '@/assets/icons/shared/order_pooling.svg';
import OrderItemImage from './orderItemImage';
export default {
  name: 'OrderItem',
  components: {
    IonItem,
    IonGrid,
    IonIcon,
    IonList,
    IonImg,
    IonRow,
    IonCol,
    IonLabel,
    OrderItemImage,
    IonButton,
    IonThumbnail,
    IonSkeletonText
  },
  props: {
    orders: {
      type: Object,
      required: true
    },
    currencySymbol: {
      type: String,
      required: true
    },
    currencyCode: {
      type: String,
      required: true
    },
    showProgress: {
      type: Boolean,
      required: true
    },
    showTotalPrice: {
      type: Boolean,
      required: true
    }
  },
  methods: {
    getDeliveryAddress(addresses) {
      let address = addresses.find((v) => v.address_type_id === 1); // find delivery address
      if (!address) address = addresses[0];
      const road = address.road ? `${address.road}` : '';
      const street_number =
        address.street_number && address.street_number !== 'null' ? `, ${address.street_number}` : '';
      const city = address.city ? `, ${address.city}` : '';
      const postal = address.postal_code ? ` (${address.postal_code})` : '';
      return `${road}${street_number}${city}${postal}`;
    },
    getPrice(item) {
      const taxPerItem = item.tax / item.total_qty;
      const pricePerItem = item.sale_unit_price + taxPerItem;
      return pricePerItem;
    },
    getprogresswidth(supplier) {
      if (supplier.info)
        return supplier.info.current_order > supplier.info.minimum_order
          ? 100
          : (supplier.info.current_order / supplier.info.minimum_order) * 100;
      else return 0;
    },
    async showCancelModal(index) {
      await this.$store.dispatch('b2c/setSelectedCancelProductID', { id: index });
      this.$emit('showCancelModal');
    },
    async gotoChat(hub) {
      this.presentLoading();
      const { id: userId } = this.user;
      const sbUserId = `TD${userId}`;
      let userDataSendbird = await SendBirdService.getUserToken(sbUserId);
      if (userDataSendbird) {
        SendBirdService.connect(userDataSendbird.user_id, userDataSendbird.access_token)
          .then(async () => {
            const metaData = {
              hubId: hub.id
            };
            const checkIfGroupExist = await SendBirdService.findCommunityChat(metaData);
            const checkIfGroupExistChannels = checkIfGroupExist.channels || [];
            if (checkIfGroupExistChannels.length > 0) {
              const channelURL = checkIfGroupExistChannels[0].channel_url;
              const { is_member } = await SendBirdService.findCommunityChatMember(channelURL, sbUserId);
              if (is_member) {
                this.router.push({
                  path: '/main/chat/details',
                  query: { channel: channelURL }
                });
                this.loading.dismiss();
              } else {
                this.loading.dismiss();
                this.onRejoinCommunityChat(channelURL, sbUserId);
              }
            } else {
              this.loading.dismiss();
              this.presentAlert(this.$t('order.chat_not_ready'));
            }
          })
          .catch((err) => {
            this.loading.dismiss();
            this.presentAlert(err);
          });
      } else {
        this.presentLoading();
      }
    },
    getSupplierName(data) {
      const supplierName = data.substring(0, 16);
      return data.length > 16
        ? `${supplierName.substring(0, Math.min(supplierName.length, supplierName.lastIndexOf(' ')))}...`
        : data;
    },
    gotoProductDetail(product_id) {
      this.router.push({ name: 'product-detail', params: { product_id: product_id } });
    },
    displayPrice(price, tax_rate) {
      tax_rate = parseFloat(tax_rate);
      let p = parseFloat(price);
      p += p * tax_rate;
      return p;
    },
    getVoucherAmount(orderItem) {
      if (orderItem.voucher_discount) {
        return orderItem.voucher_discount;
      } else {
        if (orderItem.paymentB2c) {
          return orderItem.paymentB2c.discount_amount;
        } else {
          return 0;
        }
      }
    },
    calculateLastTotalPrice(paymentB2c, totalItemAmount) {
      if (paymentB2c) {
        if (!paymentB2c.stripe_transaction_id && !paymentB2c.payment_transaction_id) return 0;
        const voucherPercentage = paymentB2c.discount_amount / paymentB2c.order_total;
        const totalVoucherAmount = totalItemAmount * voucherPercentage;
        return totalItemAmount - totalVoucherAmount;
      } else return totalItemAmount;
    },
    getPoolingStatus(poolItems) {
      if (!poolItems || poolItems.length == 0) return '0/0';

      const poolQty = poolItems[0].pool?.pool_qty || 0;
      const remainQty = poolItems[0].pool?.remaining_qty || 0;

      return `${Math.abs(remainQty - poolQty)} / ${poolQty}`;
    },
    getTotalPaid(totalOrder, totalDiscount) {
      const totalPaid = Number(totalOrder || 0) - Number(totalDiscount || 0);
      return totalPaid >= 0 ? totalPaid : 0;
    },
    async presentAlert(message) {
      const alert = await alertController.create({
        message: message,
        buttons: ['OK']
      });
      await alert.present();
    },
    async presentLoading() {
      this.loading = await loadingController.create({
        message: this.$t('order.opening_chat'),
        mode: 'ios'
      });
      await this.loading.present();
    },
    async onRejoinCommunityChat(channelURL, sbUserId) {
      const alert = await alertController.create({
        cssClass: 'rejoin-channel-confirm .alert-wrapper',
        header: this.$t('order.rejoin_chat_title'),
        message: this.$t('order.rejoin_chat_message'),
        buttons: [
          {
            text: this.$t('order.rejoin_chat_no'),
            role: 'cancel'
          },
          {
            text: this.$t('order.rejoin_chat_yes'),
            handler: async () => {
              this.presentLoading();
              SendBirdService.joinGroupChannel(channelURL, sbUserId).then(() => {
                this.router.push({
                  path: '/main/chat/details',
                  query: { channel: channelURL }
                });
                this.loading.dismiss();
              });
            }
          }
        ]
      });
      return alert.present();
    },
    openRefund(voucher, qty, totalAmount) {
      this.$emit('showRefundModal', {
        voucher: voucher,
        qty: qty,
        total: totalAmount
      });
    }
  },
  async setup() {
    const router = useRouter();
    const user = await inject('$storage').getUser();
    const loading = false;
    return {
      gmarker,
      checkmark,
      router,
      chat_orders,
      info_on,
      dayjs,
      order_pooling_svg,
      ORDER_STATUS,
      user,
      loading
    };
  }
};
</script>

<style scoped lang="scss">
@import 'orderitem.module';
</style>

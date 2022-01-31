<template>
  <ion-page>
    <ion-header class="productDetailPageHeader">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/home"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="share()">
            <ion-img class="shareSocialIcon" :src="shareIcon" />
          </ion-button>
          <ion-button @click="gotoCart()">
            <ion-img class="cartIcon" :src="countCart > 0 ? cartFillIcon : cartIcon" />
            <ion-badge v-show="countCart > 0" color="danger" class="countCart">{{ countCart }} </ion-badge>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content
      :fullscreen="true"
      class="productDetailContainer"
      :scroll-events="true"
      @ionScroll="getScrollEvent()"
    >
      <div v-if="isLoading" class="isLoaded">
        <ProductItemImageSlider @click="openModal()" />
        <ion-grid class="productDetailDescription">
          <ion-row class="productTitle">
            <ion-label>{{ productItem.name }}</ion-label>
          </ion-row>
          <ion-row class="productPrice">
            <ion-label class="discountPrice" v-if="selectedItem.b2c_unit_price < 0">
              {{
                productItem.min_price === productItem.max_price
                  ? `${currencySymbol}${(
                      productItem.min_price +
                      productItem.min_price * (productItem.tax_rate / 100)
                    ).toFixed(2)}`
                  : `${currencySymbol}${(
                      productItem.min_price +
                      productItem.min_price * (productItem.tax_rate / 100)
                    ).toFixed(2)}-${currencySymbol}${(
                      productItem.max_price +
                      productItem.max_price * (productItem.tax_rate / 100)
                    ).toFixed(2)}`
              }}</ion-label
            >
            <ion-label class="discountPrice" v-else>
              {{ currencySymbol }}{{ getPrice(selectedItem.b2c_unit_price * selectedItem.b2c_unit_per_oom) }}
            </ion-label>
            <ion-label class="originalPrice" v-if="selectedItem.b2c_market_unit_price < 0">
              {{ getMarketPrice() }}
            </ion-label>
          </ion-row>
        </ion-grid>
        <ion-grid
          class="productTag"
          v-if="
            skuData.length > 0 ||
            selectedItem.halal ||
            productItem.discount > 0 ||
            selectedItem.is_b2c_pooling
          "
        >
          <ion-item class="pa-0 productTagItem">
            <ion-row class="productTagRow">
              <ion-col size="8" class="pa-0">
                <ion-label class="productItemTag volume_deal" v-if="skuData.length > 0">{{
                  $t('product_detail.volume_deal')
                }}</ion-label>
                <ion-label class="productItemTag volume_deal" v-if="productItem.discount > 0">{{
                  `${productItem.discount.toFixed(0)}% OFF!`
                }}</ion-label>
                <ion-label
                  class="productItemTag pooling"
                  v-if="selectedItem.is_b2c_pooling && selectedItem.b2c_pooling_qty > 0"
                >
                  <ion-img :src="poolingIMG" /> {{ selectedItem.b2c_pooling_qty }}
                  {{ $t('product_detail.pooling') }}
                </ion-label>
              </ion-col>
              <ion-col size="4" class="pa-0 productTagColHala" v-if="selectedItem.halal">
                <ion-label class="productItemTag halal">{{ $t('product_detail.halal') }}</ion-label>
              </ion-col>
            </ion-row>
          </ion-item>
        </ion-grid>
        <ion-grid class="groupBuy">
          <ion-row class="groupBuyPart" @click="onHowToGroupBuy()">
            <ion-label class="groupBuyText">{{ $t('product_detail.how_group_buy_works') }}</ion-label>
            <ion-icon :icon="chevronForwardOutline" class="groupActionBtn" />
          </ion-row>
          <ion-row class="collectionGroup">
            <ion-col size="4" class="collectionItem pa-0">
              <ion-label class="collectionItemNo">1.</ion-label>
              <ion-label class="collectionItemContent">{{
                $t('product_detail.join_collection_point')
              }}</ion-label>
            </ion-col>
            <ion-col size="3" class="collectionItem pa-0">
              <ion-label class="collectionItemNo">2.</ion-label>
              <ion-label class="collectionItemContent">{{ $t('product_detail.buy_with_others') }}</ion-label>
            </ion-col>
            <ion-col size="5" class="collectionItem pa-0">
              <ion-label class="collectionItemNo">3.</ion-label>
              <ion-label class="collectionItemContent">{{ $t('product_detail.achieve_min') }}</ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-grid class="volumeDeal" v-show="skuData.length > 0">
          <ion-row class="volumeDealHeader text-center" @click="showVolumeDeal = !showVolumeDeal">
            <ion-col class="text-center volumeDealTitle">
              <ion-label>
                {{ $t('product_detail.volume_deal_details') }}&nbsp;
                <ion-img class="info-icon" :src="!showVolumeDeal ? info_btn : info_btn_filled" />
              </ion-label>
            </ion-col>
          </ion-row>
          <ion-row class="volumeDealDescription" v-show="showVolumeDeal">
            <div class="descriptionText">{{ $t('product_detail.volume_deal_description') }}</div>
          </ion-row>
          <ion-row class="volumeDealRow text-center">
            <div class="volumeDealItem">
              <div class="volumeDealField">{{ $t('product_detail.buy_together') }}</div>
              <div class="volumeDealField">{{ $t('product_detail.discounted_price') }}</div>
            </div>
            <div class="volumeDealItem" v-for="sku in skuData" v-bind:key="sku.id">
              <div class="volumeDealField">>{{ sku.quantity }}</div>
              <div class="volumeDealField price">
                {{ currencySymbol }}{{ getDiscountValue(sku) }}&nbsp;{{ productItem.skus[0].uom.name }}
              </div>
            </div>
          </ion-row>
        </ion-grid>
        <ion-item class="marketingGroup">
          <ion-skeleton-text
            animated
            class="preLoading supplierImage"
            v-show="loadingImg"
          ></ion-skeleton-text>
          <ion-img
            :src="supplierImage"
            @ionError="errorIMG"
            class="supplierImage"
            @ionImgDidLoad="loadingImg = false"
            :style="{ opacity: loadingImg ? 0 : 1 }"
          />
          <ion-label class="marketingTitle">{{ productItem.skus[0].product.tenant.tenant.name }}</ion-label>
          <ion-button
            class="supplierButton"
            slot="end"
            expand="full"
            fill="clear"
            @click="onViewSupplier(productItem.skus[0].product.tenant.tenant.id)"
            >{{ $t('product_detail.view_supplier') }}</ion-button
          >
        </ion-item>
        <ion-grid class="weightGroup">
          <!-- Hide packaging for this time -->
          <!-- <ion-col class="weightItem pa-0" size="4" v-if="selectedItem.b2c_weight > 0">
            <ion-label class="weightItemTitle">
              {{ $t('product_detail.packaging') }}
            </ion-label>
            <ion-label class="weightItemContent">
              {{
                `${currencySymbol}${getPrice(selectedItem.b2c_unit_price * selectedItem.b2c_unit_per_oom)}`
              }}/{{ selectedItem.uom.name }}
            </ion-label>
          </ion-col> -->
          <ion-col class="weightItem pa-0" size="3" v-if="selectedItem.b2c_weight > 0">
            <ion-label class="weightItemTitle">{{ $t('product_detail.item_weight') }}</ion-label>
            <ion-label class="weightItemContent">
              {{ selectedItem.b2c_weight }}{{ selectedItem.uom.name }}
            </ion-label>
          </ion-col>
          <ion-col class="weightItem" size="5" v-if="selectedItem.country_of_origin">
            <ion-label class="weightItemTitle">{{ $t('product_detail.country_of_origin') }}</ion-label>
            <ion-label class="weightItemContent">{{ selectedItem.country_of_origin }}</ion-label>
          </ion-col>
        </ion-grid>
        <ion-grid class="productDescription">
          <ion-label class="productDescriptionTitle">{{
            $t('product_detail.product_description')
          }}</ion-label>
          <div class="productDescriptionContent">
            <p class="productDescriptionText" :class="{ hideText: isHide, showText: isShow }">
              {{ selectedSkuDescription || getSelectedSkuDescription() }}
            </p>
            <div
              v-show="isSeeMore"
              :class="showExtra ? 'showReadMore' : 'showReadLess'"
              @click="clickSeeMore()"
            >
              {{ showExtra ? $t('product_detail.see_less') : $t('product_detail.see_more') }}
              <ion-icon :icon="showExtra ? chevronUpOutline : chevronDownOutline"></ion-icon>
            </div>
          </div>
        </ion-grid>
        <ion-grid class="productActionButton">
          <ion-row class="variationTitle">
            <ion-label>{{ $t('product_detail.variation') }}</ion-label>
          </ion-row>
          <ion-list v-for="(valueArr, keyName) in productItem.all_specs" :key="keyName">
            <ion-row class="variationItemTitle">{{ keyName }} </ion-row>
            <div class="variationActionButton">
              <ion-buttons class="variationButtonGroup" v-for="v in valueArr" :key="v">
                <ion-button
                  v-if="productItem.skus.length === 1 && getIsOutOfStock()"
                  class="actionButton disabled"
                >
                  {{ v }}
                </ion-button>
                <ion-button
                  v-else-if="selectedSKUs[keyName] === v"
                  @click="deleteSpecBtn(keyName)"
                  class="actionButton active"
                >
                  {{ v }}
                </ion-button>
                <ion-button
                  v-else-if="selectedNASKUs[keyName] && !selectedNASKUs[keyName].includes(v)"
                  class="actionButton"
                  @click="setSpecSKUs(keyName, v)"
                >
                  {{ v }}
                </ion-button>
                <ion-button v-else @click="setSelectedSKUs(keyName, v)" class="actionButton">
                  {{ v }}
                </ion-button>
              </ion-buttons>
            </div>
          </ion-list>
          <ion-row class="quantityAction">
            <ion-col class="quantityItem">
              <ion-label class="quantityItemTitle">{{ $t('product_detail.quantity') }}</ion-label>
              <ion-item class="quantity">
                <ion-button
                  class="quantityButton"
                  :class="!quantityAvailable || order_quantity <= increaseQty ? 'noQuantity' : ''"
                  expand="block"
                  fill="solid"
                  :disabled="getIsOutOfStock() || order_quantity <= increaseQty"
                  @click="addQuantity($event, -increaseQty)"
                >
                  <span>-</span>
                </ion-button>
                <ion-input
                  :class="
                    selectedItem.b2c_unit_price < 0 || getIsOutOfStock() || order_quantity <= increaseQty
                      ? 'noQuantity'
                      : ''
                  "
                  class="quantityEdit"
                  type="number"
                  inputmode="decimal"
                  pattern="[0-9]*"
                  v-model="order_quantity"
                  disabled
                ></ion-input>
                <ion-button
                  :class="!quantityAvailable ? 'noQuantity' : ''"
                  class="quantityButton right"
                  expand="block"
                  fill="solid"
                  :disabled="selectedItem.b2c_unit_price < 0 || getIsOutOfStock() || isLimit"
                  @click="addQuantity($event, increaseQty)"
                >
                  <span>+</span>
                </ion-button>
              </ion-item>
              <ion-label class="almostOutOfStock" v-show="selectedItem.b2c_weight > 0 && getIsAOOS()">
                {{ $t('product_detail.almost_stock') }}
              </ion-label>
            </ion-col>
          </ion-row>
        </ion-grid>
        <ion-grid class="addToCartPart">
          <ion-row class="totalPricePart">
            <ion-col class="totalPriceTitle" size="4">
              <ion-label>
                {{ $t('product_detail.total_price') }}
              </ion-label>
            </ion-col>
            <ion-col class="totalPrice" v-if="getIsOutOfStock()">
              <ion-label>
                {{ $t('out_of_stock') }}
              </ion-label>
            </ion-col>
            <ion-col class="totalPrice" size="8" v-else>
              <ion-label class="discountPrice" v-if="selectedItem.b2c_unit_price < 0">
                {{
                  productItem.min_price === productItem.max_price
                    ? `${currencySymbol}${(
                        productItem.min_price +
                        productItem.min_price * (productItem.tax_rate / 100)
                      ).toFixed(2)}&nbsp;${currencyCode}`
                    : `${currencySymbol}${(
                        productItem.min_price +
                        productItem.min_price * (productItem.tax_rate / 100)
                      ).toFixed(2)}&nbsp;-&nbsp;${(
                        productItem.max_price +
                        productItem.max_price * (productItem.tax_rate / 100)
                      ).toFixed(2)}&nbsp;${currencyCode}`
                }}</ion-label
              >
              <ion-label v-else>
                {{
                  `${currencySymbol}${getTotalPrice(
                    selectedItem.b2c_unit_price * selectedItem.b2c_unit_per_oom,
                    order_quantity
                  )}
                  &nbsp;${currencyCode}`
                }}
              </ion-label>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="pa-0 addToCart">
              <ion-button
                class="addToCartBtn"
                :disabled="
                  selectedItem.b2c_unit_price < 0 ||
                  getIsOutOfStock() ||
                  isError ||
                  !Object.keys(selectedSKUs).length
                "
                @click="addToCart()"
              >
                <span v-if="!isAddToCartLoading">{{ $t('product_detail.add_to_cart') }}</span>
                <ion-spinner name="crescent" v-else></ion-spinner>
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
      <div v-else class="skeleton-product">
        <ion-grid class="product-image">
          <ion-row>
            <ion-thumbnail>
              <ion-skeleton-text animated></ion-skeleton-text>
            </ion-thumbnail>
          </ion-row>
        </ion-grid>
        <ion-grid class="productDetailDescription">
          <ion-row class="productTitle">
            <ion-skeleton-text animated style="width: 90%"></ion-skeleton-text>
          </ion-row>
          <ion-row class="productPrice">
            <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
            <ion-skeleton-text animated style="width: 40%"></ion-skeleton-text>
          </ion-row>
        </ion-grid>
        <ion-item class="marketingGroup">
          <ion-thumbnail class="supplierImage" slot="start">
            <ion-skeleton-text animated></ion-skeleton-text>
          </ion-thumbnail>
          <ion-skeleton-text animated class="marketingTitle"></ion-skeleton-text>
          <ion-skeleton-text animated class="supplierButton"></ion-skeleton-text>
        </ion-item>
        <ion-grid class="weightGroup">
          <ion-col class="weightItem pa-0" size="3">
            <ion-skeleton-text animated class="weightItemTitle"></ion-skeleton-text>
            <ion-skeleton-text animated class="weightItemContent"></ion-skeleton-text>
          </ion-col>
          <ion-col class="weightItem pa-0" size="4">
            <ion-skeleton-text animated class="weightItemTitle"></ion-skeleton-text>
            <ion-skeleton-text animated class="weightItemContent"></ion-skeleton-text>
          </ion-col>
          <ion-col class="weightItem pa-0" size="5">
            <ion-skeleton-text animated class="weightItemTitle"></ion-skeleton-text>
            <ion-skeleton-text animated class="weightItemContent"></ion-skeleton-text>
          </ion-col>
        </ion-grid>
        <ion-grid class="productDescription">
          <ion-skeleton-text animated class="productDescriptionTitle"></ion-skeleton-text>
          <div class="productDescriptionContent">
            <ion-skeleton-text animated></ion-skeleton-text>
          </div>
        </ion-grid>
        <ion-grid class="productActionButton">
          <ion-row class="variationItemTitle">
            <ion-skeleton-text animated></ion-skeleton-text>
          </ion-row>
          <ion-row class="variationActionButton">
            <ion-skeleton-text animated class="variationButton"></ion-skeleton-text>
            <ion-skeleton-text animated class="variationButton"></ion-skeleton-text>
            <ion-skeleton-text animated class="variationButton"></ion-skeleton-text>
          </ion-row>
          <ion-row class="quantityAction">
            <ion-col class="quantityItem">
              <ion-skeleton-text animated class="quantityItemTitle"></ion-skeleton-text>
              <ion-item class="quantity">
                <ion-skeleton-text animated class="quantityButton"></ion-skeleton-text>
                <ion-skeleton-text animated class="quantityInput"></ion-skeleton-text>
                <ion-skeleton-text animated class="quantityButton"></ion-skeleton-text>
              </ion-item>
            </ion-col>
          </ion-row>
          <ion-row>
            <ion-col class="pa-0">
              <ion-skeleton-text animated class="addToCartBtn"></ion-skeleton-text>
            </ion-col>
          </ion-row>
        </ion-grid>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonContent,
  IonIcon,
  IonBackButton,
  IonItem,
  IonLabel,
  IonButton,
  IonToolbar,
  IonHeader,
  IonRow,
  IonGrid,
  IonList,
  IonButtons,
  IonCol,
  IonImg,
  IonBadge,
  IonThumbnail,
  IonSkeletonText,
  IonSpinner,
  IonInput,
  modalController,
  toastController
} from '@ionic/vue';
import { ref, defineComponent, inject, computed, watch } from 'vue';
import {
  locationOutline,
  searchOutline,
  arrowBackOutline,
  chevronForwardOutline,
  chevronDownOutline,
  chevronUpOutline
} from 'ionicons/icons';
import ProductItemImageSlider from '../../../components/ProductItemImageSlider';
import ProductItemImageSliderModal from '../../../components/ProductItemImageSliderModal';
import { getSkuDeals, getProductDetailB2c } from '../../../services/shared/graphql/product';
import { getAllCartByUserId } from '../../../services/shared/graphql/cart';
import { useMutation } from '@vue/apollo-composable';
import { useStore } from 'vuex';
import { getImage, noImage } from '../../../utils/getImage';
import { useRouter, useRoute } from 'vue-router';
import info_btn from '@/assets/icons/shared/info_btn.svg';
import info_btn_filled from '@/assets/icons/shared/info_btn_filled.svg';
import cartIcon from '@/assets/icons/shared/cart.svg';
import cartFillIcon from '@/assets/icons/shared/cart_fill.svg';
import shareIcon from '@/assets/icons/shared/share.svg';
import { b2c_addItemToCart } from '@/services/shared/graphql';
import { Share } from '@capacitor/share';
import poolingIMG from '@/assets/icons/shared/pooling.svg';
import Branch from '@/services/shared/helper/branch';

export default defineComponent({
  name: 'ProductDetailVariation',
  props: ['product_id'],
  data: () => ({
    showExtra: false,
    showVolumeDeal: false,
    quantityAvailable: true,
    order_quantity: 1,
    descriptionOffsetHeight: 0,
    selectedSKUs: {},
    increaseQty: 1,
    maxSKUs: -1,
    isAddToCartLoading: false,
    isLimit: false,
    isAlmostOutOfStock: true,
    imageData: null,
    loadingImg: true,
    skuData: [],
    selectedSkuDescription: ''
  }),
  methods: {
    getSelectedSkuDescription(specs = null) {
      if (!specs) {
        this.selectedSkuDescription = this.productItem?.skus[0]?.description;
      } else {
        let skus = this.productItem.skus;
        for (let key in specs) {
          skus = skus.filter((sku) => sku.specs[key] === specs[key]);
        }
        this.selectedSkuDescription = skus[0]?.description;
      }
    },
    errorIMG(event) {
      event.target.src = noImage;
    },
    onHowToGroupBuy() {
      this.router.push('/main/how-group-buy-works');
    },
    addQuantity(event, value) {
      if (value) {
        this.order_quantity += value;
        if (this.getIsAOOS() && this.order_quantity >= this.maxSKUs) {
          this.order_quantity = this.maxSKUs;
          this.isLimit = true;
        } else {
          this.isLimit = false;
        }
        this.order_quantity = this.order_quantity < this.increaseQty ? this.increaseQty : this.order_quantity;
      }
    },
    getDiscountValue(sku) {
      const taxRate =
        this.productItem.skus[0].tax_rate > 0
          ? this.productItem.skus[0].tax_rate
          : this.productItem.skus[0].product.tenant.tax_rate;
      const price = this.productItem.skus[0].b2c_unit_price * this.productItem.skus[0].b2c_unit_per_oom;
      const skuPrice = price + price * (taxRate / 100);
      const discountedPrice = (skuPrice * (100 - sku.discount)) / 100;
      return discountedPrice.toFixed(2);
    },
    getPrice(unit_price) {
      const taxRate =
        this.productItem.skus[0].tax_rate > 0
          ? this.productItem.skus[0].tax_rate
          : this.productItem.skus[0].product.tenant.tax_rate;
      const price = unit_price + unit_price * (taxRate / 100);
      return price.toFixed(2);
    },
    getTotalPrice(unit_price, quantity) {
      const taxRate =
        this.productItem.skus[0].tax_rate > 0
          ? this.productItem.skus[0].tax_rate
          : this.productItem.skus[0].product.tenant.tax_rate;
      const price = unit_price + unit_price * (taxRate / 100);
      const totalPrice = price * quantity;
      return totalPrice.toFixed(2);
    },
    async openModal() {
      const modal = await modalController.create({
        showBackdrop: true,
        component: ProductItemImageSliderModal,
        cssClass: 'productDetailModal'
      });
      return modal.present();
    },
    getIsOutOfStock() {
      let isAvailable = false;
      if (this.selectedItem.b2c_unit_price > 0) {
        if (this.selectedItem.inventories.length > 0) {
          if (this.selectedItem.inventories[0].quantity == 0) isAvailable = true;
        } else {
          isAvailable = true;
        }
      }
      return isAvailable;
    },
    getMarketPrice() {
      if (this.productItem.min_market_price == null || this.productItem.max_market_price == null) {
        return '';
      }
      if (this.productItem.min_market_price == 0 || this.productItem.max_market_price == 0) {
        return ' ';
      }
      if (this.productItem.min_market_price === this.productItem.max_market_price) {
        return `${this.currencySymbol}${(
          this.productItem.min_market_price +
          this.productItem.min_market_price * (this.productItem.taxRateVal / 100)
        ).toFixed(2)}`;
      } else {
        return `${this.currencySymbol}${(
          this.productItem.min_market_price +
          this.productItem.min_market_price * (this.productItem.taxRateVal / 100)
        ).toFixed(2)}-${this.currencySymbol}${(
          this.productItem.max_market_price +
          this.productItem.max_market_price * (this.productItem.taxRateVal / 100)
        ).toFixed(2)}`;
      }
    },
    getIsAOOS() {
      let isAvailable = false;
      if (this.selectedItem.b2c_unit_price > 0) {
        if (this.selectedItem.inventories.length > 0) {
          if (
            this.selectedItem.inventories[0].quantity > 0 &&
            this.selectedItem.inventories[0].quantity < 10
          ) {
            isAvailable = true;
            this.maxSKUs = this.selectedItem.inventories[0].quantity;
          }
        } else {
          this.maxSkUS = -1;
        }
      }
      return isAvailable;
    },
    getScrollEvent() {
      if (
        !this.showExtra &&
        this.descriptionOffsetHeight < document.querySelector('p.productDescriptionText').offsetHeight
      ) {
        this.descriptionOffsetHeight = document.querySelector('p.productDescriptionText').offsetHeight;
        if (this.descriptionOffsetHeight > (120 * window.innerWidth) / 414) {
          this.isSeeMore = true;
          this.isHide = true;
        } else {
          this.isSeeMore = false;
          this.isHide = false;
        }
      }
    },
    clickSeeMore() {
      if (this.isHide) {
        this.isShow = true;
        this.isHide = false;
        this.showExtra = true;
      } else {
        this.isShow = false;
        this.isHide = true;
        this.showExtra = false;
      }
    },
    setSelectedSKUs(key, v) {
      const obj = Object.fromEntries([[key, v]]);
      this.selectedSKUs = { ...this.selectedSKUs, ...obj }; // to avoid mutating original Value
      // We execute this code when the DOM is updated (when all of computed property is done computing)
      this.$nextTick(function () {
        if (this.selectedItem.specs) {
          this.selectedSKUs = {
            ...this.selectedSKUs,
            ...this.selectedItem.specs
          };
          this.order_qty =
            this.isSample && this.selectedItem.last_order_qty
              ? this.selectedItem.last_order_qty
              : this.selectedItem.increment_qty;
          this.selectedItem.order_weight = Number(this.selectedItem.weight).toFixed(4);
        }
      });
      this.getSelectedSkuDescription(this.selectedSKUs);
    },
    async openToast(msg) {
      const toast = await toastController.create({
        message:
          msg == 'success'
            ? this.$t('product_detail.add_to_cart_success')
            : this.$t('product_detail.add_to_cart_failed'),
        duration: 2000,
        color: msg == 'success' ? 'success' : 'danger',
        position: 'top',
        cssClass: 'toast-custom-class'
      });
      return toast.present();
    },
    async addToCart() {
      let user = await this.storage.getUser();
      if (user?.id) {
        this.isAddToCartLoading = true;
        const selectedHubID = this.hubID ? this.hubID.id : null;
        this.fetchB2CAddItemToCart({
          item: {
            customer_id: selectedHubID || undefined,
            order_quantity: this.order_quantity,
            order_weight: this.order_quantity * this.selectedItem.b2c_weight,
            price: this.selectedItem.b2c_unit_price,
            sku_id: this.selectedItem.id
          }
        })
          .then(() => {
            this.isAddToCartLoading = false;
            this.$store.dispatch('b2c/addApplicationState', { refetchCart: true });
            this.$store.dispatch('b2c/setNewCart', { status: true });
            this.openToast('success');
            this.getCartItemNumber();
            this.trackAddToCartEvent();
          })
          .catch((error) => {
            console.error(error);
            this.isAddToCartLoading = false;
            this.openToast('error');
          });
      } else {
        this.storage.setRedirectPath('/main/product-detail/' + this.product_id);
        this.$router.push('/shared/auth/signup-access');
      }
    },
    async share() {
      await Share.share({
        title: this.productItem.name,
        text: this.productItem.name,
        url: process.env.VUE_APP_WEB_APP_URL + this.$route.fullPath,
        dialogTitle: 'Share this product with friends !'
      });
    },
    deleteSpecBtn(keyName) {
      if (this.productItem.skus.length === 1) {
        let skuObject = this.selectedSKUs;
        Object.keys(this.selectedSKUs).forEach(function (key) {
          delete skuObject[key];
        });
        this.selectedSKUs = skuObject;
      } else {
        delete this.selectedSKUs[keyName];
      }
    },
    setSpecSKUs(keyName, value) {
      this.deleteSpecBtn(keyName);
      this.setSelectedSKUs(keyName, value);
    },
    updateQuantity(sku) {
      this.increaseQty = sku.b2c_increment_qty;
      this.order_quantity = sku.b2c_increment_qty;
    },
    getSkuData(sku) {
      this.fetchSkuDeals({
        active: true,
        skuId: sku.id
      })
        .then((res) => {
          this.skuData = res.data.getSkuDeals;
        })
        .catch((error) => {
          console.error(error);
        });
    },
    trackAddToCartEvent() {
      Branch.trackAddToCart({
        tenant: this.selectedItem.product.tenant.tenant.name,
        product: this.productItem.name,
        sku: this.selectedItem.name,
        price: this.getPrice(this.selectedItem.b2c_unit_price * this.selectedItem.b2c_unit_per_oom),
        quantity: this.order_quantity,
        is_order_by_weight: 0, // There is no order by weight
        total_weight: Number(this.selectedItem.b2c_weight) * Number(this.order_quantity)
      });
    },
    gotoCart() {
      this.$store.dispatch('b2c/setPreviousRouteParams', { showBack: true });
      this.router.push('/main/cart');
    }
  },
  computed: {
    selectedNASKUs() {
      let res = {};
      for (let key in this.productItem.all_specs) {
        res[key] =
          this.filteredSKUs.length > 0
            ? this.filteredSKUs.filter((x) => x.specs[key]).map((x) => x.specs[key])
            : this.productItem.skus.filter((x) => x.specs[key]).map((x) => x.specs[key]);
      }
      return res;
    },
    filteredSKUs() {
      const skus = Object.values(this.selectedSKUs);
      // Filter inventories where every choosen specs ("variations" const) is inside "specs" array
      return this.productItem.skus.filter((x) => {
        const specs = Object.values(x.specs);
        return skus.every((y) => specs.includes(y));
      });
    },
    selectedItem() {
      if (this.productItem.skus.length === 1) {
        //Assign images properties from item to inventories
        let sku = this.productItem.skus[0];
        sku.image = this.productItem.image;
        this.getSkuData(sku);
        this.updateQuantity(sku);

        return sku;
      }
      if (this.filteredSKUs.length === 1) {
        this.getSkuData(this.filteredSKUs[0]);
        this.updateQuantity(this.filteredSKUs[0]);
        return this.filteredSKUs[0];
      }
      return {
        b2c_unit_price: -1,
        discount_price: -1,
        b2c_unit_per_oom: 0,
        b2c_market_unit_price: -1,
        b2c_weight: 0,
        is_b2c_pooling: false,
        uom: null,
        oom: null,
        weight: 0,
        unit_amount: 0,
        halal: false,
        sub_category: null,
        sku: null,
        sku_id: null
      };
    }
  },
  components: {
    IonContent,
    IonPage,
    IonIcon,
    IonLabel,
    IonToolbar,
    IonBackButton,
    IonHeader,
    IonRow,
    IonGrid,
    IonItem,
    IonList,
    IonButtons,
    IonImg,
    IonThumbnail,
    IonSkeletonText,
    IonInput,
    IonCol,
    IonSpinner,
    IonBadge,
    IonButton,
    ProductItemImageSlider
  },
  watch: {
    isLoading() {
      if (this.productItem.skus.length === 1) {
        if (Object.keys(this.productItem.skus[0].specs).length > 0) {
          let keyName = Object.keys(this.productItem.skus[0].specs)[0];
          this.setSelectedSKUs(keyName, this.productItem.skus[0].specs);
        }
      }
    }
  },
  async setup(props) {
    const filterText = ref('');
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    let productItem = ref([]);
    let isLoading = ref(false);
    let countCart = ref(0);
    let isSeeMore = ref(false);
    let isError = ref(false);
    let isShow = ref(false);
    let isHide = ref(false);
    let storage = inject('$storage');
    const supplierImage = ref(undefined);
    const hubID = computed(() => {
      return store.getters['b2c/getSelectedHub'];
    });
    const productId = Number.parseInt(props.product_id || route.params.product_id);
    const { mutate: fetchProduct } = useMutation(getProductDetailB2c);
    const { mutate: fetchSkuDeals } = useMutation(getSkuDeals);
    const { mutate: fetchAllCartByUserId } = useMutation(getAllCartByUserId);
    const { mutate: fetchB2CAddItemToCart } = useMutation(b2c_addItemToCart);
    const collectionPoint = computed(() => {
      return store.getters['b2c/getSelectedCP'];
    });

    const getProductDetail = () => {
      productId &&
        fetchProduct({
          product_id: productId,
          product_type_id: 1
        })
          .then((res) => {
            productItem.value = res.data.getProductDetailB2c;
            store.dispatch('b2c/setProduct', {
              product: productItem.value
            });

            if (productItem.value.skus.length) {
              getImage(productItem.value.skus[0].product.tenant.logo, 'supplier-logos').then((obj) => {
                supplierImage.value = obj;
              });
            } else {
              supplierImage.value = noImage;
            }

            const all_specs = {};
            for (let i of productItem.value.skus) {
              const parsedSpec = JSON.parse(i.specs);
              i.specs = parsedSpec;
              // also populate all_specs object
              for (let spec in parsedSpec) {
                if (!all_specs[spec]) all_specs[spec] = [];
                if (!all_specs[spec].includes(parsedSpec[spec])) all_specs[spec].push(parsedSpec[spec]);
              }
            }
            productItem.value = {
              ...productItem.value,
              all_specs
            };
            isLoading.value = true;
            isError.value = false;

            Branch.trackViewItem(
              productItem.value.skus.length ? productItem.value.skus[0].product.tenant.tenant.name : '',
              productItem.value.name
            );
          })
          .catch((error) => {
            isLoading.value = true;
            isError.value = true;
            console.error(error);
          });
    };

    watch(
      () => productId,
      () => {
        isLoading.value = false;
        getProductDetail();
        getCartItemNumber();
      }
    );
    let currentUser = await storage.getUser();
    let getCurrentLocation = await storage.getCurrentLocation();

    getProductDetail();
    const getCartItemNumber = () => {
      countCart.value = 0;
      fetchAllCartByUserId({
        hubId: collectionPoint.value?.id ?? null
      })
        .then((res) => {
          res.data.getAllCartByUserId.cart_items.forEach((item) => {
            countCart.value += item.items.length;
          });
        })
        .catch((error) => {
          console.error(error);
        });
    };
    if (currentUser?.id) {
      getCartItemNumber();
    }
    const onViewSupplier = (supplier_id) => {
      router.push({ name: 'viewsupplier', params: { supplier_id: supplier_id } });
    };
    return {
      filterText,
      searchOutline,
      locationOutline,
      arrowBackOutline,
      info_btn_filled,
      info_btn,
      supplierImage,
      shareIcon,
      cartIcon,
      cartFillIcon,
      chevronForwardOutline,
      currencySymbol: currentUser?.id
        ? currentUser.country.currency_symbol
        : getCurrentLocation.country === 'Singapore'
        ? 'S$'
        : 'RM',
      currencyCode: currentUser?.id
        ? currentUser.country.currency_code
        : getCurrentLocation.country === 'Singapore'
        ? 'SGD'
        : 'MYR',
      countCart,
      chevronDownOutline,
      chevronUpOutline,
      productItem,
      getCartItemNumber,
      router,
      isShow,
      poolingIMG,
      isHide,
      onViewSupplier,
      fetchB2CAddItemToCart,
      fetchSkuDeals,
      hubID,
      storage,
      isSeeMore,
      isLoading,
      isError
    };
  }
});
</script>
<style scoped lang="scss">
@import 'productdetailvariation.module';
</style>

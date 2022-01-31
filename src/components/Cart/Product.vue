<template>
  <template v-if="!product || isChangingQuantity">
    <ion-item class="product" :class="isEditing ? 'edit' : ''">
      <ion-skeleton-text animated class="checkbox"></ion-skeleton-text>
      <ion-grid class="product">
        <ion-row class="ion-nowrap">
          <ion-skeleton-text animated class="img"></ion-skeleton-text>
          <div class="description" style="width: unset">
            <span class="name">
              <ion-skeleton-text animated style="width: 8em"></ion-skeleton-text>
            </span>
            <div class="discounted-price">
              <ion-skeleton-text animated style="width: 4em"></ion-skeleton-text>
            </div>
            <div :class="true ? 'price' : 'discounted-price'">
              <ion-skeleton-text animated style="width: 4em"></ion-skeleton-text>
            </div>
            <ion-row :class="`ion-justify-content-end quantity-container ${isEditing ? 'edit-open' : ''}`">
              <ion-item ref="quantityButtonContainer" class="quantity">
                <ion-skeleton-text animated style="height: 30px; width: 100%"></ion-skeleton-text>
              </ion-item>
            </ion-row>
          </div>
        </ion-row>
      </ion-grid>
    </ion-item>
  </template>
  <template v-else>
    <div>
      <ion-item
        class="product"
        :class="{
          edit: isEditing,
          'out-of-stock': !isInStock,
          'has-specification': Object.keys(product.specs).length > 0
        }"
      >
        <ion-checkbox
          v-if="!isEditing"
          :disabled="!isCheckable"
          :checked="product.isChecked"
          @click.capture.prevent.stop="clickProduct($event)"
          @ionChange="checkProduct($event)"
        ></ion-checkbox>
        <ion-grid class="product">
          <ion-row class="ion-nowrap">
            <ion-img
              @ionError="setImageDefault($event)"
              :src="imageSrc"
              @click="
                $router.push({
                  name: 'product-detail',
                  params: {
                    product_id: product.item.sku.product.id
                  }
                })
              "
            ></ion-img>
            <div class="description">
              <span class="name">
                {{ b2cSkuNameConstructor }}
              </span>
              <ion-img
                v-if="!quantityAvailable && isInStock && !isEditing"
                class="clickable-image"
                src="/assets/images/error.svg"
                @click="displayQuantityMsg"
              ></ion-img>
              <div v-if="Object.keys(product.specs).length > 0" class="specification">
                <p v-for="(value, name) in product.specs" :key="name">{{ name }}: {{ value }}</p>
              </div>
              <template v-if="product.marketPrice">
                <div class="discounted-price">
                  {{ `${user.country.currency_symbol}${taxedPrice.toFixed(2)}` }}/{{
                    product.item.sku.b2c_uom.name
                  }}
                </div>
                <div class="price">
                  {{ `${user.country.currency_symbol}${product.marketPrice.toFixed(2)}` }}/{{
                    product.item.sku.b2c_uom.name
                  }}
                </div>
              </template>
              <template v-else>
                <div class="discounted-price">
                  {{ `${user.country.currency_symbol}${taxedPrice.toFixed(2)}` }}/{{
                    product.item.sku.b2c_uom.name
                  }}
                </div>
              </template>
              <ion-row :class="`ion-justify-content-end quantity-container ${isEditing ? 'edit-open' : ''}`">
                <template v-if="isInStock">
                  <ion-item ref="quantityButtonContainer" class="quantity">
                    <ion-button
                      expand="block"
                      fill="solid"
                      :disabled="isChangingQuantity || isUpdatingVoucher || product.item.order_quantity <= 0"
                      @click="addQuantity($event, -product.item.sku.b2c_increment_qty)"
                    >
                      <span>-</span>
                    </ion-button>
                    <ion-input
                      class="cart__quantity-input"
                      :class="{
                        loading: isChangingQuantity || isUpdatingVoucher,
                        'no-quantity': !quantityAvailable
                      }"
                      type="text"
                      inputmode="decimal"
                      size="2"
                      disabled
                      :value="product.item.order_quantity"
                      @change="addQuantity($event)"
                    ></ion-input>
                    <ion-button
                      expand="block"
                      fill="solid"
                      :disabled="isChangingQuantity || !quantityAvailable || isUpdatingVoucher"
                      @click="addQuantity($event, product.item.sku.b2c_increment_qty)"
                    >
                      <span>+</span>
                    </ion-button>
                  </ion-item>
                </template>
                <template v-else>
                  <ion-text>{{ $t('out_of_stock') }}</ion-text>
                </template>
              </ion-row>
            </div>
            <div class="delete-btn-container" v-if="isEditing">
              <ion-button class="delete-btn ion-no-margin" expand="full" fill="solid" @click="deleteProduct"
                ><span>{{ $t('delete') }}</span>
              </ion-button>
            </div>
          </ion-row>
        </ion-grid>
      </ion-item>
      <div
        v-if="product.item.sku.is_b2c_pooling"
        class="pooling"
        :class="{
          edit: isEditing,
          'out-of-stock': !isInStock,
          'has-specification': Object.keys(product.specs).length > 0
        }"
      >
        <ion-img src="/assets/images/cart-pooling.svg"></ion-img>
        <span>{{ product.item.sku.b2c_pooling_qty }}</span>
      </div>
    </div>
  </template>
</template>

<script>
import { removeCartItem } from '@/services/shared/graphql';
import { getTaxedPrice } from '@/services/shared/helper/cart';
import { getImage, noImage } from '@/utils/getImage';
import {
  IonImg,
  IonItem,
  IonCheckbox,
  IonInput,
  IonGrid,
  IonRow,
  IonButton,
  IonText,
  alertController,
  IonSkeletonText
} from '@ionic/vue';
import { useMutation } from '@vue/apollo-composable';
import { defineComponent, inject, ref, watch } from 'vue';

export default defineComponent({
  name: 'Product',
  components: {
    IonImg,
    IonItem,
    IonCheckbox,
    IonInput,
    IonGrid,
    IonRow,
    IonButton,
    IonText,
    IonSkeletonText
  },
  props: {
    product: Object,
    isEditing: Boolean
  },
  setup(props) {
    const { mutate: removeCartItemFn } = useMutation(removeCartItem);
    const user = inject('user');
    const isUpdatingVoucher = inject('isUpdatingVoucher');
    const isChangingQuantity = ref(false);
    const validateVoucher = inject('validateVoucher');
    const imageSrc = ref();

    watch(
      () => props.product,
      () => loadImage()
    );

    const loadImage = () => {
      if (props.product)
        getImage(`${props.product.item.sku.product.image}.png`, 'products').then((data) => {
          imageSrc.value = data;
        });
    };

    loadImage();

    return {
      user,
      removeCartItemFn,
      isChangingQuantity,
      validateVoucher,
      isUpdatingVoucher,
      imageSrc
    };
  },
  computed: {
    taxedPrice() {
      return getTaxedPrice(this.product);
    },
    isInStock() {
      return this.product.item.item_quantity === -1 || this.product.item.item_quantity > 0;
    },
    quantityAvailable() {
      return (
        this.product.item.item_quantity === -1 ||
        this.product.item.item_quantity >= this.product.item.order_quantity
      );
    },
    isCheckable() {
      return this.product.isAvailable(this.product.item) && !this.isUpdatingVoucher;
    },
    b2cSkuNameConstructor() {
      const name = this.product.item.sku.name;
      const packaging = this.product.item.sku.b2c_packaging;
      return packaging ? name.replace(/(\(.*?\))/gi, packaging) : name;
    }
  },
  methods: {
    setImageDefault(event) {
      event.target.src = noImage;
    },
    addQuantity(event, value) {
      if (!value) {
        value = parseInt(event.target.value);
      } else {
        value += this.product.item.order_quantity;
      }

      this.$emit('set-quantity', this.product, value, this);
    },

    clickProduct(event) {
      // This is needed because the default behaviour of checking it manually
      // modifies event.target.checked AFTER check-product event is emitted.
      // As a side note: checkProduct runs before this function.
      event.target.checked = !event.target.checked;
      this.$emit('check-product', this.product, event, this.validateVoucher);
    },

    checkProduct(event) {
      this.$emit('check-product', this.product, event);
    },

    deleteProduct() {
      if (this.$store.getters['b2c/isVoucherActive'] && this.product.isChecked) {
        this.isUpdatingVoucher = true;
      }

      this.removeCartItemFn({
        id: this.product.item.id
      }).then(
        (result) => {
          if (result.data?.removeCartItem) {
            this.$store.dispatch('b2c/removeProductFromCart', this.product);
            this.$store.dispatch('b2c/setNewCart', { status: true });

            this.validateVoucher();
          } else {
            console.log(result);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
    async displayQuantityMsg() {
      const alert = await alertController.create({
        cssClass: 'cart__alert-msg',
        header: this.$t('we_are_sorry'),
        // subHeader: 'Subtitle',
        message: this.$t('no_quantity'),
        buttons: ['OK']
      });
      await alert.present();

      const { role } = await alert.onDidDismiss();
      console.log('onDidDismiss resolved with role', role);
    }
  }
});
</script>

<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'Product.scss';
</style>
<style lang="scss">
ion-input.cart__quantity-input {
  input.native-input {
    padding: 0;
  }

  input.native-input[disabled] {
    opacity: 1 !important;
  }
}
.cart__alert-msg {
  // Setting this makes the content blurry.
  // --min-height: 144px;
  --min-width: 90vw;

  .alert-title {
    font-size: 18px;
    font-weight: bold;
  }
  .alert-message {
    font-size: 16px;
    color: black;
    line-height: 20px;
  }
  .alert-button {
    font-size: 16px;
    font-weight: bold;
  }
}
</style>

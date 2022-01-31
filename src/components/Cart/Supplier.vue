<template>
  <template v-if="!products">
    <ion-item class="supplier">
      <ion-skeleton-text animated class="checkbox"></ion-skeleton-text>
      <div>
        <div class="supplier-btn">
          <span><ion-skeleton-text animated style="width: 50%"></ion-skeleton-text></span>
        </div>
        <!-- <p><ion-skeleton-text animated style="width:50%;"></ion-skeleton-text></p> -->
      </div>
      <div class="edit" slot="end">
        <div>
          <ion-button expand="full" fill="flat">
            <span @click="edit"><ion-skeleton-text animated style="width: 2em"></ion-skeleton-text></span>
          </ion-button>
        </div>
        <!-- <p>&nbsp;</p> -->
      </div>
    </ion-item>
    <product-vue v-for="product in [0, 1]" :key="product"> </product-vue>
    <div class="line-separator-3"></div>
    <ion-item class="footnote">
      <ion-text class="subtotal"
        ><ion-skeleton-text animated style="width: 4em"></ion-skeleton-text
        ><span
          ><strong><ion-skeleton-text animated style="width: 5em"></ion-skeleton-text></strong></span
      ></ion-text>
      <ion-text class="collection-date" slot="end">
        <ion-skeleton-text animated style="width: 10em"></ion-skeleton-text>
        <span>
          <strong><ion-skeleton-text animated style="width: 10em"></ion-skeleton-text></strong>
        </span>
      </ion-text>
    </ion-item>
    <div class="line-separator"></div>
  </template>
  <template v-else>
    <ion-item class="supplier">
      <ion-checkbox
        :checked="allProductsChecked"
        :disabled="!allProductsCheckable"
        @click.capture.stop.prevent="checkAllProducts"
      ></ion-checkbox>
      <div>
        <div
          class="supplier-btn"
          @click="onViewSupplier(cartItem.products[0].item.sku.product.tenant.tenant.id)"
        >
          <span class="supplier-name">{{ cartItem.supplier.tenant.name }}</span>
          <ion-img class="chevron" src="/assets/images/ic-chevron-right-24px.png"></ion-img>
        </div>
        <div v-if="cartItem.spree?.end_datetime">
          &nbsp;
          <p class="last-order">{{ $t('last_order') }}: {{ buyBeforeDate }}</p>
        </div>
      </div>
      <div class="edit" slot="end">
        <div>
          <ion-button expand="full" fill="flat">
            <span class="spend-information" @click="edit">{{ $t(editState) }}</span>
          </ion-button>
        </div>
        <span v-if="cartItem.spree?.end_datetime">&nbsp;</span>
      </div>
    </ion-item>
    <ion-item class="progress-bar" :class="{ 'not-supported': !cartItem.spree?.minimum_order }">
      <div class="progress-back">
        <div class="progress-text back">
          {{ user.country.currency_code == 'MYR' ? '' : `$`
          }}{{ cartItem.spree?.current_order ? cartItem.spree.current_order.toFixed(2) : '0.00' }}/{{
            cartItem.spree?.minimum_order ? cartItem.spree?.minimum_order.toFixed(2) : '0.00'
          }}&nbsp;<span class="currency">{{ user.country.currency_code }}</span>
        </div>
        <div
          class="progress-text front"
          :style="'clip-path: inset( 0 0 0 ' + getprogresswidth(cartItem.spree) + '%)'"
        >
          {{ user.country.currency_code == 'MYR' ? '' : `$`
          }}{{ cartItem.spree?.current_order ? cartItem.spree.current_order.toFixed(2) : '0.00' }}/{{
            cartItem.spree?.minimum_order ? cartItem.spree?.minimum_order.toFixed(2) : '0.00'
          }}&nbsp;<span class="currency">{{ user.country.currency_code }}</span>
        </div>
      </div>
    </ion-item>
    <ion-item
      class="information"
      :class="{
        'not-supported': !cartItem.spree?.minimum_order
      }"
    >
      <ion-img class="wh20" src="/assets/images/grommet-icons-circle-information.svg"></ion-img>
      <ion-label
        v-if="cartItem.spree?.minimum_order"
        class="ion-text-wrap spend-information"
        v-html="
          $t('group_spend_total', {
            currencyCode: user.country.currency_symbol,
            minimum_order: cartItem.spree.minimum_order
          })
        "
      ></ion-label>
      <ion-label v-else class="ion-text-wrap spend-information">{{
        !cartItem.spree ? $t('collection_point_not_supported') : $t('inactive_supplier')
      }}</ion-label>
    </ion-item>
    <product-vue
      v-for="(product, i) in products"
      :key="product.id"
      :product="product"
      :isEditing="editState === 'done'"
      :ref="
        (el) => {
          if (el) productRefs[i] = el;
        }
      "
      @set-quantity="setQuantity"
      @check-product="checkProduct"
    >
    </product-vue>
    <div class="line-separator-3"></div>
    <ion-item class="footnote">
      <ion-text class="subtotal"
        >{{ $t('sub_total') }}:<span
          ><strong>{{ `${user.country.currency_symbol}${totalPriceDisplay}` }}</strong></span
        ></ion-text
      >
      <ion-text class="collection-date" slot="end">
        {{ $t('estimated_collection_date') }}:
        <span>
          <strong>{{
            cartItem.spree?.delivery_date ? estimatedCollectionDate : 'Collection Point not supported'
          }}</strong>
        </span>
      </ion-text>
    </ion-item>
    <div class="line-separator"></div>
  </template>
</template>

<script>
import { changeCartItemQuantity } from '@/services/shared/graphql';
import { IonImg, IonButton, IonItem, IonCheckbox, IonLabel, IonText, IonSkeletonText } from '@ionic/vue';
import { useMutation } from '@vue/apollo-composable';
import { defineComponent, inject, onBeforeUpdate, ref } from 'vue';
import ProductVue from '../Cart/Product.vue';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import { getProductsTaxedPrice } from '@/services/shared/helper/cart';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'Supplier',
  components: { IonImg, IonButton, IonItem, IonCheckbox, IonLabel, IonText, IonSkeletonText, ProductVue },
  props: {
    products: Array,
    cartItem: Object
  },
  setup() {
    const editState = ref('edit');
    const { mutate: changeCartItemQuantityFn } = useMutation(changeCartItemQuantity);
    const user = inject('user');
    const isUpdatingVoucher = inject('isUpdatingVoucher');
    const validateVoucher = inject('validateVoucher');
    const productRefs = ref([]);
    const router = useRouter();

    const onViewSupplier = (supplierId) => {
      router.push({ name: 'viewsupplier', params: { supplier_id: supplierId } });
    };

    onBeforeUpdate(() => {
      productRefs.value = [];
    });

    return {
      user,
      editState,
      changeCartItemQuantityFn,
      validateVoucher,
      productRefs,
      isUpdatingVoucher,
      onViewSupplier
    };
  },
  computed: {
    buyBeforeDate() {
      // Wednesday, 30/6/21 | 11:59 PM
      dayjs.extend(utc);
      let djs = dayjs(new Date(this.cartItem.spree.end_datetime));
      djs = djs.utc().format('ddd, D/M/YYYY | hh:mm A');

      return djs;
    },
    estimatedCollectionDate() {
      let djs = dayjs(new Date(this.cartItem.spree.delivery_date));
      djs = djs.format('ddd, D/M/YYYY');

      return djs;
    },
    allProductsChecked() {
      for (const product of this.products) {
        if (!product.isChecked) {
          return false;
        }
      }
      return true;
    },
    allProductsCheckable() {
      for (const productRef of this.productRefs) {
        if (!productRef.isCheckable) {
          return false;
        }
      }
      return true;
    },
    totalPriceDisplay() {
      return this.getTotalPrice().toFixed(2);
    }
  },
  methods: {
    setQuantity(product, value, productRef) {
      value = value <= 0 ? 0 : value;
      if (value <= 0) {
        productRef.deleteProduct();
        return;
      }
      productRef.isChangingQuantity = true;

      if (this.$store.getters['b2c/isVoucherActive'] && product.isChecked) {
        this.isUpdatingVoucher = true;
      }

      this.changeCartItemQuantityFn({
        id: product.item.id,
        order_quantity: value,
        order_weight: product.item.sku.b2c_weight * value
      }).then(
        (result) => {
          if (result.data.changeCartItemQuantity !== null) {
            const previousValue = product.item.order_quantity;
            product.item.order_quantity = value;

            if (!product.isChecked) {
              // https://treedots.atlassian.net/browse/TREE-1963
              if (value <= product.item.item_quantity && previousValue > product.item.item_quantity) {
                product.isChecked = true;
              } else {
                productRef.isChangingQuantity = false;
                return;
              }
            }

            if (!product.isAvailable(product.item)) {
              product.isChecked = false;
            }

            this.validateVoucher().then(() => {
              productRef.isChangingQuantity = false;
            });
          }
        },
        (error) => {
          console.dir(error);
          productRef.isChangingQuantity = false;
        }
      );
    },
    checkProduct(product, event, callback) {
      if (!product.isAvailable(product.item)) {
        return;
      }

      product.isChecked = event.target.checked;

      if (callback instanceof Function) {
        callback();
      }
    },
    getprogresswidth(spree) {
      if (spree)
        return spree.current_order > spree.minimum_order
          ? 100
          : (spree.current_order / spree.minimum_order) * 100;
      else return 0;
    },
    getTotalPrice() {
      return getProductsTaxedPrice(this.products);
    },
    checkAllProducts() {
      const selectAll = !this.allProductsChecked;
      this.products.map((product) => (product.isChecked = selectAll));
      this.validateVoucher();
    },
    edit() {
      if (this.editState == 'edit') {
        this.editState = 'done';
      } else {
        this.editState = 'edit';
      }
    }
  }
});
</script>

<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'Supplier.scss';
</style>

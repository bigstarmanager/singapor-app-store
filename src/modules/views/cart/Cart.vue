<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ $t('cart') }}</ion-title>
        <ion-buttons slot="primary">
          <ion-button @click="routeToPath('/main/chat')">
            <ion-img :src="isNewMessage ? chat_blue_fill : chat_blue" />
          </ion-button>
          <ion-button @click="router.push('map')">
            <ion-img :src="collectionPoint?.name ? location_blue_fill : location_blue_outline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-refresher ref="refresher" slot="fixed" @ionRefresh="doRefresh($event)">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <ion-list lines="none">
        <ion-item>
          <ion-button @click="router.push('map')" class="ion-no-margin marker" expand="full" fill="flat">
            <ion-img
              :src="
                collectionPoint?.name ? '/assets/images/mdi-map-marker-radius.svg' : location_blue_outline
              "
            ></ion-img>
            <span class="select-collection-point" :class="collectionPoint?.name ? 'selected' : ''">
              {{ collectionPoint?.name ? collectionPoint.name : $t('select_collection_point') }}
            </span>
          </ion-button>
        </ion-item>
        <div class="line-separator"></div>
        <template v-if="isLoadingPage">
          <supplier-vue v-for="cartItem in [0, 1, 2]" :key="cartItem"> </supplier-vue>
        </template>
        <template v-else>
          <supplier-vue
            v-for="(cartItem, i) in cartItems"
            :key="cartItem.supplier.id"
            :ref="(ele) => setSupplierRef(ele, i)"
            :cartItem="cartItem"
            :products="cartItem.products"
          >
          </supplier-vue>
        </template>
      </ion-list>
      <template v-if="cartItems.length === 0 && !isLoadingPage">
        <div class="empty-cart">
          <div>
            <ion-img src="/assets/images/nocart.svg" />
            <p>
              {{ $t('empty_cart_1') }}
              <br />
              <strong @click="routeToPage('Category')">{{ $t('empty_cart_2') }}</strong>
              {{ $t('empty_cart_3') }}
            </p>
          </div>
        </div>
      </template>
    </ion-content>
    <ion-footer v-if="cartItems.length > 0 && !isLoadingPage" class="checkout-footer">
      <ion-toolbar>
        <ion-list lines="none">
          <ion-item class="n-m-h m-b-22">
            <div class="voucher-code-wrapper">
              <ion-button
                v-if="!voucherCode"
                class="ion-no-margin ion-no-padding"
                expand="full"
                fill="flat"
                @click="handleVoucherClick"
                ><ion-img class="wh20" src="/assets/images/voucher.svg"></ion-img>
                <span class="margin-between-icons-2 text-theme-color"
                  ><strong>{{ $t('got_a_voucher') }}</strong></span
                >
                <span v-if="!voucherCode && allVouchers.number_of_vouchers" class="available-vouchers">{{
                  allVouchers.number_of_vouchers + ' ' + $t('available_vouchers')
                }}</span>
              </ion-button>
              <div v-if="voucherCode" class="voucher-code">
                <ion-img class="wh20" src="/assets/images/voucher.svg"></ion-img>
                <span class="margin-between-icons-2 text-theme-color"
                  ><strong>{{
                    `${user?.country.currency_symbol} ${totalDiscountDisplay?.toFixed(2)}`
                  }}</strong></span
                >
                <ion-icon @click="handleRemoveVoucher" color="primary" :icon="closeCircleOutline"></ion-icon>
              </div>
              <div v-if="voucherCode" @click="openModal" class="text-theme-color voucher-discount" slot="end">
                <span>{{ $t('change') }}</span>
                <ion-img v-if="voucherCode" class="m-l-10" src="/assets/images/edit.svg"></ion-img>
              </div>
            </div>
          </ion-item>
          <ion-item class="n-m-h">
            <ion-checkbox
              class="ion-no-margin"
              :checked="allSuppliersChecked"
              :disabled="!allSuppliersCheckable"
              @click.capture.stop.prevent="selectAllProducts"
            ></ion-checkbox>
            <ion-label class="margin-between-icons-2 order-total">{{ $t('select_all') }}</ion-label>
            <div class="order-total">
              {{ $t('order_total') }}:
              <strong>{{ `${user?.country.currency_symbol}${overallPriceDisplay}` }}</strong>
            </div>
          </ion-item>
          <ion-button
            class="checkout-btn"
            expand="block"
            :disabled="collectionPoint?.name ? !hasAnyProductsChecked : false"
            @click="checkout"
          >
            <span>{{
              collectionPoint?.name ? $t('checkout') + cartSummary : $t('select_collection_point')
            }}</span>
          </ion-button>
        </ion-list>
      </ion-toolbar>
    </ion-footer>
    <ion-modal :is-open="open">
      <Voucher :closeModal="toggleModal" />
    </ion-modal>
  </ion-page>
</template>

<script>
import SupplierVue from '@/components/Cart/Supplier.vue';
import { getAllVouchers, getAllCartByUserId, voucherValidation } from '@/services/shared/graphql';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
  IonImg,
  IonItem,
  IonList,
  IonCheckbox,
  IonFooter,
  IonLabel,
  IonBackButton,
  IonRefresher,
  IonRefresherContent,
  toastController,
  onIonViewDidEnter,
  IonModal,
  IonIcon
} from '@ionic/vue';
import { useMutation, useLazyQuery } from '@vue/apollo-composable';
import { defineComponent, inject, provide, ref, computed, onBeforeUpdate } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import chat_blue from '@/assets/icons/shared/chat_blue.svg';
import chat_blue_fill from '@/assets/icons/shared/chat_blue_fill.svg';
import location_blue_outline from '@/assets/icons/shared/location_blue_outline.svg';
import location_blue_fill from '@/assets/icons/shared/location_blue_fill.svg';
import {
  buildCartMinimumSpree,
  buildOrderItems,
  getTaxedMarketPrice,
  hasAnyProductsChecked,
  hasSpree
} from '@/services/shared/helper/cart';
import Voucher from './Voucher.vue';
import { closeCircleOutline } from 'ionicons/icons';

export default defineComponent({
  name: 'Cart',
  components: {
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonPage,
    IonButton,
    IonButtons,
    IonImg,
    IonItem,
    IonList,
    IonCheckbox,
    IonFooter,
    IonLabel,
    IonBackButton,
    IonRefresher,
    IonRefresherContent,
    SupplierVue,
    IonModal,
    IonIcon,
    Voucher
  },
  beforeRouteEnter(to, from, next) {
    if (from.path === '/main/orders/overview') {
      next({
        name: 'Account'
      });
      return;
    }

    next();
  },
  setup() {
    const store = useStore();
    const storage = inject('$storage');
    const user = ref();
    const router = useRouter();
    const suppliersRef = ref([]);
    const cartItems = ref([]);
    const isUpdatingVoucher = ref(false);
    const isLoadingPage = ref(true);
    const isNewMessage = computed(() => {
      return store.getters['b2c/getIsNewMessage'];
    });
    const { mutate: userCartQuery } = useMutation(getAllCartByUserId);
    const { mutate: voucherValidationFn } = useMutation(voucherValidation);
    const { load: getAllVoucherFn, onResult: getAllVoucherResult } = useLazyQuery();
    const allVouchers = computed(() => {
      return store.getters['b2c/getAllVouchers'];
    });
    let currentStateName = null;
    const open = ref(false);

    const validateVoucher = () => {
      return new Promise((resolve) => {
        if (!store.getters['b2c/isVoucherActive']) {
          return resolve();
        }

        const voucherCode = store.getters['b2c/currentVoucherCode'];
        const orderItems = buildOrderItems(cartItems.value);
        isUpdatingVoucher.value = true;

        voucherValidationFn({
          vouchercode: voucherCode,
          metadataB2b: false,
          metadataB2c: true,
          metadataState: currentStateName,
          totalAmount: orderItems.totalAmount,
          orderItems: orderItems.items
        }).then((res) => {
          isUpdatingVoucher.value = false;
          let voucherResult = res.data.voucherValidation;
          voucherResult = voucherResult && voucherResult.valid ? voucherResult : null;

          store.dispatch('b2c/setVoucher', voucherResult);
          return resolve();
        });
      });
    };

    const refresher = ref(null);
    const doRefresh = () => {
      refreshCart();
    };

    provide('user', user);
    provide('validateVoucher', validateVoucher);
    provide('isUpdatingVoucher', isUpdatingVoucher);

    (async () => {
      user.value = await storage.getUser();
    })();

    const collectionPoint = computed(() => {
      return store.getters['b2c/getSelectedHub'];
    });

    const setSupplierRef = (el, i) => {
      if (el) suppliersRef.value[i] = el;
      else suppliersRef.value[i] = undefined;
    };
    onBeforeUpdate(() => {
      suppliersRef.value = [];
    });

    const refreshCart = () => {
      isLoadingPage.value = true;
      // Only sends query if variable is different.
      userCartQuery({
        hubId: collectionPoint.value?.id ?? null //Math.floor(Math.random() * 10000)
      })
        .then((result) => {
          refresher.value.$el.complete();
          const userCart = result.data.getAllCartByUserId;
          cartItems.value.length = 0;
          const activeSprees = userCart.active_sprees;
          const hubId = store.getters['b2c/getSelectedHub']?.id;
          for (const cartItem of userCart.cart_items) {
            let products = [];
            let spree = activeSprees.find((o) => o.tenant_id === cartItem.supplier.id);

            for (const item of cartItem.items) {
              // item.item_quantity = 17;
              let isAvailable = (item) => {
                return (
                  spree &&
                  (hubId === undefined || spree.hub_id === hubId) &&
                  item.sku.active &&
                  item.sku.b2c_unit_price > 0 &&
                  (item.item_quantity === -1 || item.item_quantity >= item.order_quantity)
                );
              };

              // returns false if value is nullish
              // isAvailable = isAvailable ?? false;

              let selectItem = {
                item: item,
                isAvailable: isAvailable,
                isChecked: isAvailable(item),
                // specs: JSON.parse(item.sku.specs)
                specs: {}
              };

              const marketPrice = getTaxedMarketPrice({ item });
              if (marketPrice > 0) {
                selectItem.marketPrice = marketPrice;
              }

              products.push(selectItem);
            }

            let supp = {
              products: products,
              // Assuming all products in cart_items[x] are grouped by same supplier...
              spree: spree,
              supplier: cartItem.supplier
            };

            cartItems.value.push(supp);
          }

          if (cartItems.value.length > 0) {
            store.dispatch('b2c/setCart', cartItems);
            validateVoucher().then(() => {
              isLoadingPage.value = false;
              const orderItems = buildOrderItems(cartItems.value);
              fetchAllVouchers(orderItems);
            });
          } else {
            isLoadingPage.value = false;
          }
        })
        .catch((error) => {
          console.log(error);
          isLoadingPage.value = false;
        });
    };

    refreshCart();

    onIonViewDidEnter(async () => {
      let newStateName = 'Singapore';
      const user = await storage.getUser();
      if (user.country.id !== 193) {
        const newState = await storage.getSelectedState();
        newStateName = newState?.state || '';
      }

      if (currentStateName === null) currentStateName = newStateName;

      if (store.getters['b2c/getApplicationState']?.refetchCart) {
        store.dispatch('b2c/removeApplicationState', ['refetchCart']);
        refreshCart();
      } else if (currentStateName !== newStateName) {
        currentStateName = newStateName;
        validateVoucher();
      }
    });

    const openToast = async (toastOptions) => {
      const toast = await toastController.create(toastOptions);
      return toast.present();
    };

    getAllVoucherResult((result) => {
      const { data } = result || {};
      const { number_of_vouchers, vouchers } = data.getAllVouchers;
      store.dispatch('b2c/setAllVouchers', { number_of_vouchers, vouchers });
      isLoadingPage.value = false;
    });

    const fetchAllVouchers = async (orderItems) => {
      getAllVoucherFn(getAllVouchers, {
        metadataB2b: false,
        metadataB2c: true,
        totalAmount: orderItems.totalAmount,
        orderItems: orderItems.items
      });
    };

    const toggleModal = (value = false) => {
      open.value = value;
    };

    return {
      cartItems,
      closeCircleOutline,
      setSupplierRef,
      suppliersRef,
      router,
      store,
      validateVoucher,
      isLoadingPage,
      openToast,
      user,
      collectionPoint,
      isNewMessage,
      allVouchers,
      fetchAllVouchers,
      chat_blue,
      chat_blue_fill,
      location_blue_outline,
      location_blue_fill,
      refresher,
      doRefresh,
      open,
      toggleModal
    };
  },
  computed: {
    totalDiscount() {
      let discount = this.store.getters['b2c/calculateDiscount'];
      return discount;
    },
    totalDiscountDisplay() {
      return this.totalDiscount ? this.totalDiscount : 0;
    },
    voucherCode() {
      const voucherCode = this.store.getters['b2c/currentVoucherCode'];
      return voucherCode;
    },
    allSuppliersChecked() {
      let checked = true;
      for (const supplier of this.suppliersRef) {
        if (supplier?.allProductsChecked === false) {
          checked = false;
          break;
        }
      }
      return checked;
    },
    allSuppliersCheckable() {
      let checkable = true;
      for (const supplier of this.suppliersRef) {
        if (supplier?.allProductsCheckable === false) {
          checkable = false;
          break;
        }
      }
      return checkable;
    },
    hasAnyProductsChecked() {
      return hasAnyProductsChecked(this.cartItems);
    },
    hasAnySupplierMetMinimumSpree() {
      return buildCartMinimumSpree(this.cartItems).length > 0;
    },
    totalPrice() {
      let totalPrice = 0;
      this.suppliersRef.map((supplier) => {
        if (supplier?.getTotalPrice) {
          totalPrice += supplier.getTotalPrice();
        }
      });
      return totalPrice;
    },
    overallPriceDisplay() {
      const price = this.totalPrice - this.totalDiscount;
      return (price < 0 ? 0 : price).toFixed(2);
    },
    showBackButton() {
      return this.store.getters['b2c/getPreviousRouteState']?.showBack ?? false;
    },
    cartSummary() {
      let totalItems = 0;
      let checkedItems = 0;
      this.cartItems.forEach((item) => {
        if (item?.spree) {
          item.products.forEach((product) => {
            if (product.isChecked) checkedItems += 1;
            totalItems += 1;
          });
        }
      });
      return totalItems ? ` (${checkedItems}/${totalItems})` : '';
    }
  },
  methods: {
    selectAllProducts() {
      const selectAll = !this.allSuppliersChecked;
      const suppliers = [...this.suppliersRef].filter(
        (supplier) => supplier !== null || supplier !== undefined
      );
      for (const supplierRef of suppliers) {
        supplierRef.products.map((product) => (product.isChecked = selectAll));
      }
      this.validateVoucher();
    },
    routeToPage(path) {
      this.router.push({
        name: path
      });
    },
    routeToPath(path) {
      this.router.push({
        path: path
      });
    },
    checkout() {
      if (!this.collectionPoint?.name) {
        this.routeToPath('map');
        return;
      }

      if (!hasSpree(this.cartItems)) {
        const o = {
          message: this.$t('notif_no_spree_open'),
          duration: 2000,
          cssClass: 'cart__my-toast'
        };

        this.openToast(o);
        return;
      }

      this.router.push({
        name: 'Checkout'
      });
    },
    openModal() {
      this.toggleModal(true);
    },
    handleVoucherClick() {
      if (!this.voucherCode) {
        this.openModal();
      }
    },
    handleRemoveVoucher() {
      this.store.dispatch('b2c/setVoucher', null);
    }
  }
});
</script>
<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';

.marker {
  --padding-start: 0;
  margin-left: -2px;
}

// ion-toast.cart__my-toast {

//   &::part(container) {
//     outline: 1px solid pink;
//   }
// }
</style>

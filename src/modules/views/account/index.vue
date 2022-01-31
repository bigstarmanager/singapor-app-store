<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-header class="accountPageHeader ion-no-border">
        <ion-toolbar color="transparent">
          <ion-title class="headerTitle">
            {{ $t('my_account') }}
          </ion-title>
          <ion-buttons slot="end">
            <ion-button @click="routeToPath('/main/chat')">
              <ion-icon class="chat-lock" :src="isNewMessage ? chat_fill_svg : chat_svg" />
            </ion-button>
            <ion-button @click="routeToPath('/main/map')">
              <ion-icon class="chat-lock" :src="selectedHub?.name ? location_click_svg : location_svg" />
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>
      <div class="header-avatar">
        <ion-row class="ion-align-items-center padding-x padding-y">
          <ion-avatar class="avatar">
            <ion-img :src="avatarImage"> </ion-img>
          </ion-avatar>
          <h5>{{ user.first_name }} {{ user.last_name }}</h5>
        </ion-row>
        <div class="space-top"></div>
        <ion-button
          color="white"
          class="manageBtn ion-activatable"
          expand="block"
          fill="solid"
          @click="routeToPath('/main/account/manage-account')"
        >
          <div class="image-icon">
            <ion-img :src="manageIcon" />
          </div>
          <p class="text-item menu-text">{{ $t('manage_account') }}</p>
          <ion-ripple-effect type="bounded"></ion-ripple-effect>
        </ion-button>
      </div>
      <ion-grid class="padding-y">
        <ion-item
          detail="false"
          lines="none"
          class="margin-y ion-activatable"
          button
          @click="routeToPath('/main/orders/overview')"
        >
          <ion-row slot="start" class="ion-align-items-center">
            <ion-img :src="orders" />
            <ion-label class="text-item menu-text"> {{ $t('my_orders') }} </ion-label>
          </ion-row>
          <ion-row slot="end" class="ion-align-items-center ion-justify-content-end">
            <ion-label class="text-item menu-text" style="margin-right: 12px">
              {{ $t('overview') }}
            </ion-label>
            <ion-icon class="ionIcon" :icon="chevronForward" />
          </ion-row>
          <ion-ripple-effect type="bounded"></ion-ripple-effect>
        </ion-item>
        <ion-row class="padding-x">
          <ion-col
            class="my-order submenu-text ion-activatable"
            button
            @click="routeToPath('/main/orders/preparing')"
          >
            <span
              v-if="showNotif.preparing && badge_order_notif.preparing > 0"
              :class="badge_order_notif.preparing < 10 ? 'order-badge-2' : 'order-badge'"
              >{{ badge_order_notif.preparing > 99 ? '99' : badge_order_notif.preparing }}</span
            >
            <span v-else class="order-badge-transparent"></span>
            <ion-img :src="preparing" style="height: 29px" />
            <p>{{ $t('order.preparing') }}</p>
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </ion-col>
          <ion-col
            class="my-order submenu-text ion-activatable"
            button
            @click="routeToPath('/main/orders/tocollect')"
          >
            <span
              v-if="showNotif.to_collect && badge_order_notif.to_collect > 0"
              :class="badge_order_notif.to_collect < 10 ? 'order-badge-2' : 'order-badge'"
              >{{ badge_order_notif.to_collect > 99 ? '99' : badge_order_notif.to_collect }}</span
            >
            <span v-else class="order-badge-transparent"></span>
            <ion-img :src="toCollect" style="height: 29px" />
            <p>{{ $t('order.to_collect') }}</p>
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </ion-col>
          <ion-col
            class="my-order submenu-text ion-activatable"
            button
            @click="routeToPath('/main/orders/collected')"
          >
            <!-- <span
              v-if="showNotif.collected && badge_order_notif.collected > 0"
              :class="badge_order_notif.collected < 10 ? 'order-badge-2' : 'order-badge'"
              >{{ badge_order_notif.collected > 99 ? '99' : badge_order_notif.collected }}</span
            > -->
            <span class="order-badge-transparent"></span>
            <ion-img :src="collected" style="height: 32px" />
            <p style="margin-top: 9px">{{ $t('order.collected') }}</p>
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </ion-col>
          <ion-col
            class="my-order submenu-text ion-activatable"
            button
            @click="routeToPath('/main/orders/cancelled')"
          >
            <!-- <span
              v-if="showNotif.cancelled && badge_order_notif.cancelled > 0"
              :class="badge_order_notif.cancelled < 10 ? 'order-badge-2' : 'order-badge'"
              >{{ badge_order_notif.cancelled > 99 ? '99' : badge_order_notif.cancelled }}</span
            > -->
            <span class="order-badge-transparent"></span>
            <ion-img :src="cancelled" style="height: 29px" />
            <p>{{ $t('order.cancelled') }}</p>
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </ion-col>
          <ion-col
            class="my-order submenu-text ion-activatable"
            button
            @click="routeToPath('/main/orders/dispute')"
          >
            <span class="order-badge-transparent"></span>
            <ion-img :src="dispute" style="height: 32px" />
            <p style="margin-top: 9px">{{ $t('order.dispute') }}</p>
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </ion-col>
        </ion-row>
      </ion-grid>
      <div v-if="user?.country?.id === 193" class="e-wallet-space"></div>
      <ion-grid v-if="user?.country?.id === 193" class="padding-y">
        <ion-item detail="false" lines="none" class="margin-y">
          <ion-button
            class="e-wallet-btn"
            slot="start"
            @click="$router.push({ name: 'Wallet' })"
            fill="clear"
            expand="block"
          >
            <ion-row class="ion-align-items-center">
              <ion-img :src="e_wallet" style="height: 24px" />
              <ion-label class="text-item menu-text"> {{ $t('e_wallet') }} </ion-label>
              <ion-ripple-effect type="bounded"></ion-ripple-effect>
            </ion-row>
          </ion-button>

          <ion-button
            class="topup-btn"
            slot="end"
            @click="$router.push({ name: 'TopUp' })"
            fill="clear"
            expand="block"
          >
            <ion-row class="ion-align-items-center ion-justify-content-end">
              <ion-label class="text-item menu-text" style="margin-right: 12px">
                {{ $t('topup') }}
              </ion-label>
              <ion-icon class="ionIcon" :icon="chevronForward" />
              <ion-ripple-effect type="bounded"></ion-ripple-effect>
            </ion-row>
          </ion-button>
        </ion-item>
        <ion-row class="padding-x ion-align-items-start">
          <ion-col size="4" class="ion-activatable e-wallet" button @click="$router.push({ name: 'Wallet' })">
            <ion-img v-if="isPrimaryRefunds" class="refunds-icon" src="/assets/images/primary-refunds.png" />
            <ion-img :src="tree_wallet" style="height: 22px" />
            <div class="treedotspay">{{ $t('treedotspay') }}</div>
            <div v-if="isLoading" class="e-wallet-load">
              <ion-skeleton-text animated></ion-skeleton-text>
            </div>
            <div v-else class="e-wallet-balance">
              <span v-if="treedotsPay?.available !== null">
                {{ user?.country?.currency_symbol }}{{ treedotsPay?.available.toFixed(2) }}</span
              >
              <span v-else> {{ user?.country?.currency_symbol }}0.00</span>
            </div>
            <ion-ripple-effect type="bounded"></ion-ripple-effect>
          </ion-col>
        </ion-row>
      </ion-grid>

      <div class="space padding-x">
        <p slot="start">{{ $t('support') }}</p>
      </div>
      <ion-item
        class="ion-activatable"
        detail="false"
        lines="none"
        button
        @click="routeToPath('/main/account/help')"
      >
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img :src="help" />
          <ion-label class="text-item menu-text"> {{ $t('help') }} </ion-label>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
        <ion-ripple-effect type="bounded"></ion-ripple-effect>
      </ion-item>
      <ion-item
        class="ion-activatable"
        detail="false"
        lines="none"
        button
        @click="routeToPath('/main/account/faq')"
      >
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img :src="faq" />
          <ion-label class="text-item menu-text"> {{ $t('faq') }} </ion-label>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
        <ion-ripple-effect type="bounded"></ion-ripple-effect>
      </ion-item>
      <ion-item
        class="ion-activatable"
        detail="false"
        lines="none"
        button
        @click="routeToPath('/main/account/contact-us')"
      >
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img :src="call" />
          <ion-label class="text-item menu-text"> {{ $t('contact_us') }} </ion-label>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
        <ion-ripple-effect type="bounded"></ion-ripple-effect>
      </ion-item>
      <div class="space padding-x">
        <p slot="start">{{ $t('about_us') }}</p>
      </div>
      <ion-item
        class="ion-activatable"
        detail="false"
        lines="none"
        button
        @click="routeToPath('/main/account/about')"
      >
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img :src="about" class="treedotsIcon" />
          <ion-label class="text-item menu-text"> {{ $t('about_treedots') }} </ion-label>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
        <ion-ripple-effect type="bounded"></ion-ripple-effect>
      </ion-item>
      <ion-item
        class="ion-activatable"
        detail="false"
        lines="none"
        button
        @click="routeToPath('/main/account/ordering')"
      >
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img :src="ordering" style="width: 24px" />
          <ion-label class="text-item menu-text"> {{ $t('ordering') }} </ion-label>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
        <ion-ripple-effect type="bounded"></ion-ripple-effect>
      </ion-item>
      <ion-item
        class="ion-activatable"
        detail="false"
        lines="none"
        button
        @click="routeToPath('/main/account/refunds')"
      >
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img :src="refunds" style="width: 24px" />
          <ion-label class="text-item menu-text"> {{ $t('refunds') }} </ion-label>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
        <ion-ripple-effect type="bounded"></ion-ripple-effect>
      </ion-item>
      <ion-item
        class="ion-activatable"
        detail="false"
        lines="none"
        button
        @click="routeToPath('/main/account/privacy-policy')"
      >
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img :src="privacy" style="width: 24px" />
          <ion-label class="text-item menu-text"> {{ $t('privacy') }} </ion-label>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
        <ion-ripple-effect type="bounded"></ion-ripple-effect>
      </ion-item>
      <ion-item
        class="ion-activatable"
        detail="false"
        lines="none"
        button
        @click="routeToPath('/main/account/terms-of-use')"
      >
        <ion-row slot="start" class="ion-align-items-center">
          <ion-img :src="terms" style="width: 24px" />
          <ion-label class="text-item menu-text"> {{ $t('terms') }} </ion-label>
        </ion-row>
        <ion-icon slot="end" class="ionIcon" :icon="chevronForward" />
        <ion-ripple-effect type="bounded"></ion-ripple-effect>
      </ion-item>
      <div class="space padding-x">
        <p slot="start">{{ $t('other') }}</p>
      </div>
      <ion-item
        class="ion-activatable"
        detail="false"
        lines="none"
        button
        @click="routeToPath('/main/account/settings')"
      >
        <ion-row class="ion-align-items-center">
          <ion-img :src="manageIcon" />
          <ion-label class="text-item menu-text">{{ $t('settings') }}</ion-label>
        </ion-row>
        <ion-ripple-effect type="bounded"></ion-ripple-effect>
      </ion-item>
      <div class="e-wallet-space" />
      <ion-item class="ion-activatable" detail="false" lines="none" button @click="presentAlertPrompt">
        <ion-row class="ion-align-items-center">
          <ion-img :src="logout" style="width: 24px" />
          <ion-label class="logout"> {{ $t('logout') }} </ion-label>
        </ion-row>
        <ion-ripple-effect type="bounded"></ion-ripple-effect>
      </ion-item>
      <div class="e-wallet-space" />
      <ion-item lines="none">
        <ion-col class="my-order" style="margin-top: 4px">
          <ion-img :src="logo" style="height: 27px" />
          <p class="version submenu-text">v{{ version }}/{{ htmlVersion }}</p>
        </ion-col>
      </ion-item>
      <div class="space-line"></div>
      <div class="text-center">
        <ion-button class="chace ion-activatable" @click="clearCache" shape="round" fill="clear"
          >{{ $t('clear_cache') }}
          <ion-ripple-effect type="bounded"></ion-ripple-effect>
        </ion-button>
      </div>
      <div class="bottom-space"></div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonIcon,
  IonButton,
  IonButtons,
  IonImg,
  IonAvatar,
  IonPage,
  IonToolbar,
  IonHeader,
  IonContent,
  IonItem,
  IonLabel,
  IonCol,
  IonRow,
  IonGrid,
  IonTitle,
  IonSkeletonText,
  alertController,
  toastController,
  IonRippleEffect,
  onIonViewWillEnter
} from '@ionic/vue';
import { chevronForward } from 'ionicons/icons';
import { defineComponent, inject, ref, computed } from 'vue';
import store from '../../../store';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
const { useActions } = createNamespacedHelpers(store, 'shared');
import avatarImage from '@/assets/icons/account/avatar.png';
import chat_svg from '@/assets/icons/shared/chat.svg';
import chat_fill_svg from '@/assets/icons/shared/chat_fill.svg';
import location_svg from '@/assets/icons/shared/place.svg';
import location_click_svg from '@/assets/icons/shared/place_click.svg';
import manageIcon from '@/assets/icons/account/shape.svg';
import orders from '@/assets/icons/account/orders.svg';
import preparing from '@/assets/icons/account/preparing.svg';
import toCollect from '@/assets/icons/account/ordering.svg';
import collected from '@/assets/icons/account/collected.svg';
import cancelled from '@/assets/icons/account/refunds.svg';
import dispute from '@/assets/icons/account/dispute.svg';
import help from '@/assets/icons/account/support_agent.svg';
import faq from '@/assets/icons/account/help_outline.svg';
import call from '@/assets/icons/account/call.svg';
import about from '@/assets/icons/account/treedots.svg';
import ordering from '@/assets/icons/account/collect.svg';
import refunds from '@/assets/icons/account/refundss.svg';
import privacy from '@/assets/icons/account/lock_outline.svg';
import terms from '@/assets/icons/account/list_alt.svg';
import logout from '@/assets/icons/account/logout.svg';
import logo from '@/assets/icons/account/logo.jpg';
import e_wallet from '@/assets/icons/account/e-wallet.svg';
import tree_wallet from '@/assets/icons/account/tree-wallet.svg';
import { useRouter } from 'vue-router';
import { getGenderName } from '@/services/shared/helper/helper';
import meta from '../../../../package.json';
import { getB2cBadgeOrderMenu } from '../../../services/shared/graphql/allOrdersPaginate';
import { useMutation } from '@vue/apollo-composable';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { getEwalletBalance, getCurrentUser } from '@/services/shared/graphql';
import Branch from '@/services/shared/helper/branch';
import Intercom from '@/services/shared/helper/intercom';
import PushNotification from '@/services/shared/helper/pushNotification';
import clevertap from '@/services/shared/helper/clevertap';

export default defineComponent({
  name: 'AccountPage',
  components: {
    IonIcon,
    IonButton,
    IonButtons,
    IonImg,
    IonToolbar,
    IonHeader,
    IonAvatar,
    IonPage,
    IonContent,
    IonItem,
    IonLabel,
    IonCol,
    IonRow,
    IonGrid,
    IonTitle,
    IonSkeletonText,
    IonRippleEffect
  },

  setup() {
    const router = useRouter();
    const storage = inject('$storage');
    const isNewMessage = computed(() => {
      return store.getters['b2c/getIsNewMessage'];
    });
    const selectedHub = computed(() => {
      return store.getters['b2c/getSelectedHub'];
    });
    let user;
    const badge_order_notif = ref({});
    const treedotsPay = ref();
    const isLoading = ref(true);
    const isPrimaryRefunds = ref();
    const showNotif = ref({ preparing: true, collected: false, to_collect: true, cancelled: false });
    const { mutate: fetchGetB2cBadgeOrderMenu } = useMutation(getB2cBadgeOrderMenu);
    const { mutate: fetchTreedotsPay } = useMutation(getEwalletBalance);
    const { mutate: getPrimaryRefunds } = useMutation(getCurrentUser);

    fetchGetB2cBadgeOrderMenu()
      .then((res) => {
        badge_order_notif.value = res.data.getB2cBadgeOrderMenu;
      })
      .catch((error) => {
        console.error(error);
      });

    onIonViewWillEnter(async () => {
      if (!user) user = await storage.getUser();
      if (user?.country?.id === 193) {
        fetchTreedotsPay().then((res) => {
          treedotsPay.value = res.data.getEwalletBalance;
          isLoading.value = false;
        });
        getPrimaryRefunds().then((res) => {
          isPrimaryRefunds.value = res.data?.me?.eWallet?.is_refund_to_e_wallet;
        });
      }
    });

    return {
      chevronForward,
      avatarImage,
      chat_svg,
      chat_fill_svg,
      location_svg,
      location_click_svg,
      manageIcon,
      orders,
      preparing,
      toCollect,
      collected,
      cancelled,
      dispute,
      help,
      faq,
      call,
      about,
      ordering,
      refunds,
      privacy,
      terms,
      logout,
      logo,
      e_wallet,
      tree_wallet,
      router,
      storage,
      getGenderName,
      isNewMessage,
      selectedHub,
      badge_order_notif,
      showNotif,
      treedotsPay,
      isLoading,
      isPrimaryRefunds
    };
  },
  data() {
    return {
      user: null,
      version: '0.0.0',
      htmlVersion: '0'
    };
  },
  async created() {
    this.user = inject('$storage')
      .getUser()
      .then((res) => {
        this.user = res;
      });
    this.version = meta.version;
    this.htmlVersion = meta.htmlVersion;
  },
  methods: {
    routeToPath(path) {
      this.router.push({
        path: path
      });
    },

    async clearCache() {
      const alert = await alertController.create({
        cssClass: 'logout-confirm .alert-wrapper',
        message: `${this.$t('clear_cache_confirm')}`,
        buttons: [
          {
            text: 'CANCEL',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Cancel');
            }
          },
          {
            text: 'CLEAR',
            handler: () => {
              this.clearCacheFolder();
              this.openSuccessToast();
            }
          }
        ]
      });
      return alert.present();
    },
    async clearCacheFolder() {
      try {
        return await Filesystem.rmdir({
          path: `cache-image`,
          directory: Directory.Cache,
          recursive: true
        });
      } catch (e) {
        console.log(e);
      }
    },
    async openSuccessToast() {
      const toast = await toastController.create({
        message: `${this.$t('cache_cleared')}`,
        duration: 2000,
        cssClass: 'success-toast',
        position: 'bottom'
      });
      return toast.present();
    },
    async presentAlertPrompt() {
      const alert = await alertController.create({
        cssClass: 'logout-confirm .alert-wrapper',
        message: `${this.$t('logout_confirm')}`,
        buttons: [
          {
            text: 'CANCEL',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Cancel');
            }
          },
          {
            text: 'LOGOUT',
            handler: () => {
              this.confirmLogout();
            }
          }
        ]
      });
      return alert.present();
    },
    async confirmLogout() {
      const { clearStore } = useActions(['clearStore']);
      clearStore();
      Branch.logout();
      Intercom.logout();
      PushNotification.deleteInstanceId();
      clevertap.clearUserProfile();
      this.storage.clearStorage();
      await this.$store.dispatch('shared/setUserLoggedIn', { userLoggedIn: false });
      await this.$store.dispatch('b2c/setUpdateSignAction', true);
      this.$store.dispatch('b2c/setSelectedHub', null);
      this.$store.dispatch('b2c/setActiveAllProduct', true);
      this.$router.replace('/main/home');
    }
  }
});
</script>

<style scoped lang="scss">
@import 'index.module';
</style>

<template>
  <ion-page>
    <ion-tabs @ionTabsWillChange="change($event)">
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="home" href="/main/home">
          <ion-icon :icon="selectedTab === 'home' ? home : homeOutline"></ion-icon>
          <ion-label>{{ $t('tabs.home') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="category" href="/main/category">
          <ion-icon :icon="selectedTab === 'category' ? grid : gridOutline"></ion-icon>
          <ion-label>{{ $t('tabs.categories') }}</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="cart" href="/main/cart">
          <ion-icon :icon="selectedTab === 'cart' ? cart : cartOutline"></ion-icon>
          <ion-label>{{ $t('tabs.cart') }}</ion-label>
          <ion-badge v-if="$store.getters['shared/getUserLoggedIn'] && cartCount > 0">{{
            cartCount > 99 ? '99+' : cartCount
          }}</ion-badge>
        </ion-tab-button>

        <ion-tab-button tab="notifications" href="/main/notifications">
          <ion-icon :icon="selectedTab === 'notifications' ? notifications : notificationsOutline"></ion-icon>
          <ion-label>{{ $t('menu_items.notifications') }}</ion-label>
          <ion-badge v-if="$store.getters['shared/getUserLoggedIn'] && notifyCount > 0">{{
            notifyCount > 99 ? '99+' : notifyCount
          }}</ion-badge>
        </ion-tab-button>

        <ion-tab-button tab="account" href="/main/account">
          <ion-icon :icon="selectedTab === 'account' ? person : personOutline"></ion-icon>
          <ion-label>{{ $t('tabs.account') }}</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script>
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonBadge } from '@ionic/vue';
import { useStore } from 'vuex';
import { ref, inject, watch } from 'vue';
import { getUnreadNotificationCount } from '../../services/shared/graphql/allNotifications';
import { getAllCartByUserId } from '../../services/shared/graphql/cart';
import {
  homeOutline,
  gridOutline,
  grid,
  cart,
  cartOutline,
  home,
  notificationsOutline,
  notifications,
  personOutline,
  person
} from 'ionicons/icons';
import SendBirdService from '../../services/shared/helper/sendbird';
import { useMutation } from '@vue/apollo-composable';

export default {
  name: 'tabs',
  components: { IonLabel, IonTabs, IonTabBar, IonTabButton, IonIcon, IonPage, IonBadge },
  async setup() {
    let selectedTab = ref('home');
    let notifyCount = ref(0);
    let cartCount = ref(0);
    const storage = inject('$storage');
    const store = useStore();
    const { mutate: fetchGetUnreadNotificationCount } = useMutation(getUnreadNotificationCount);
    const { mutate: fetchAllCartByUserId } = useMutation(getAllCartByUserId);
    const selectedHub = ref(store.getters['b2c/getSelectedHub']);
    const getNotifyCount = () => {
      fetchGetUnreadNotificationCount().then((res) => {
        notifyCount.value = res.data.getUnreadNotificationCount;
      });
    };
    const getCartItemNumber = () => {
      cartCount.value = 0;
      fetchAllCartByUserId({
        hubId: selectedHub.value?.id || undefined
      })
        .then((res) => {
          res.data.getAllCartByUserId.cart_items.forEach((item) => {
            cartCount.value += item.items.length;
          });
        })
        .catch((error) => {
          console.error(error);
        });
    };
    watch(
      () => store.getters['b2c/getNewNotification'],
      (val) => {
        if (val) {
          getNotifyCount();
          store.dispatch('b2c/setNewNotification', { status: false });
        }
      }
    );
    watch(
      () => store.getters['b2c/getNewCart'],
      (val) => {
        if (val) {
          getCartItemNumber();
          store.dispatch('b2c/setNewCart', { status: false });
        }
      }
    );
    watch(
      () => store.getters['shared/getUserLoggedIn'],
      (val) => {
        if (val) {
          getNotifyCount();
          getCartItemNumber();
          getTotalUnreadChannelCount();
        }
      }
    );
    let user = await storage.getUser();

    const getTotalUnreadChannelCount = async () => {
      if (user === null) user = await storage.getUser();
      const sendBirdUserDetails = await SendBirdService.getUserToken(`TD${user.id}`);
      await store.dispatch('b2c/setSendBirdDetails', sendBirdUserDetails);
      const { user_id, access_token } = store.getters['b2c/getSendBirdDetails'];
      if (user_id && access_token) {
        SendBirdService.connect(user_id, access_token)
          .then(async () => {
            const count = await SendBirdService.getTotalUnreadChannelCount();
            await store.dispatch('b2c/setIsNewMessage', count > 0);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    };
    if (user?.id) {
      getNotifyCount();
      getCartItemNumber();
      getTotalUnreadChannelCount();
    }
    return {
      selectedTab,
      homeOutline,
      gridOutline,
      grid,
      cart,
      cartOutline,
      home,
      notificationsOutline,
      notifications,
      personOutline,
      person,
      notifyCount,
      cartCount
    };
  },
  methods: {
    change(event) {
      this.selectedTab = event.tab;
    }
  }
};
</script>

<style scoped lang="scss">
@media (min-width: 700px) {
  ion-tab-bar {
    padding-top: 2.174vw;
    padding-bottom: 2.174vw;
  }
  ion-tab-bar {
    height: 60px;
  }
  ion-label {
    padding-top: 1vw;
    padding-bottom: 1vw;
  }
}
ion-tab-button {
  ion-icon {
    font-size: 5.072vw;
    margin-top: 0;
  }
  ion-label {
    font-size: 2.899vw;
    font-weight: 500;
    font-family: 'Roboto';
    margin-bottom: 0;
  }
  ion-badge {
    left: 50%;
    font-size: 2.899vw;
    font-weight: 500;
    background: #cb3c3c;
    border-radius: 8px;
    padding: 1px 3px;
    line-height: 12px;
  }
}
</style>

<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/main/home"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="markAllAsRead"> mark all as read </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="page-content">
      <ion-tabs @ionTabsWillChange="handleTabWillChange">
        <ion-tab-bar slot="top">
          <ion-tab-button tab="notifications" href="/main/messages/notifications">
            <ion-item lines="none">
              <ion-label>Notifications</ion-label>
              <ion-badge v-if="unreadNotificationsCount > 0" slot="end">{{
                unreadNotificationsCount
              }}</ion-badge>
            </ion-item>
          </ion-tab-button>

          <ion-tab-button tab="chats" href="/main/messages/chats">
            <ion-item lines="none">
              <ion-label>Chats</ion-label>
              <ion-badge v-if="unreadChatsCount > 0" slot="end">{{ unreadChatsCount }}</ion-badge>
            </ion-item>
          </ion-tab-button>
        </ion-tab-bar>
      </ion-tabs>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonPage,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonToolbar
} from '@ionic/vue';
import { defineComponent, inject, ref } from 'vue';
import { notificationsOutline, chatboxEllipsesOutline } from 'ionicons/icons';
import {
  getAllUserNotifications,
  readAllUserNotifications
} from '../../../services/shared/graphql/allNotifications';
import { useMutation } from '@vue/apollo-composable';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import { reduce } from 'lodash';
import SendBirdService from '../../../services/shared/helper/sendbird';

// import TopPicks from '../../../components/TopPicks';

export default defineComponent({
  name: 'Messages',
  components: {
    IonBackButton,
    IonBadge,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonPage,
    IonTabBar,
    IonTabButton,
    IonTabs,
    IonToolbar
  },
  async setup() {
    const store = useStore();
    const router = useRouter();
    const selectedTab = ref('notifications');
    const unreadNotificationsCount = ref(0);
    const unreadChatsCount = ref(0);
    const { mutate: fetchUserNotifications } = useMutation(getAllUserNotifications);
    const { mutate: readAllNotifications } = useMutation(readAllUserNotifications);

    const user = await inject('$storage').getUser();
    const { user_id, access_token } = await SendBirdService.getUserToken(`TD${user.id}`);
    if (user_id && access_token) {
      SendBirdService.connect(user_id, access_token)
        .then(async () => {
          const list = await SendBirdService.getChatList();
          store.dispatch('b2c/setUserChatList', list);

          unreadChatsCount.value = reduce(list, (acc, channel) => (acc += channel.unreadMessageCount), 0);
        })
        .catch((err) => {
          console.error(err);
        });
    }

    fetchUserNotifications()
      .then((res) => {
        const userNotifications = res.data.getUserNotifications;

        store.dispatch('b2c/setUserNotifications', Object.values(userNotifications));
      })
      .catch((error) => {
        console.error(error);
      });
    const markAllAsRead = () => {
      readAllNotifications().then((res) => {
        if (res.data.readAllUserNotifications > 0) {
          store.dispatch('b2c/readAllUserNotifications', { read: true });
          router.go();
        }
      });
    };
    const handleTabWillChange = (ev) => {
      selectedTab.value = ev.tab;
    };
    const userNotifications = store.state.b2c.userNotifications;
    const unreadNotifications = userNotifications.filter((notification) => !notification.read);
    unreadNotificationsCount.value = unreadNotifications.length;
    return {
      chatboxEllipsesOutline,
      notificationsOutline,
      unreadNotificationsCount,
      unreadChatsCount,
      handleTabWillChange,
      markAllAsRead
    };
  }
});
</script>
<style scoped lang="scss">
@import 'messages.module';
</style>

<template>
  <ion-page>
    <ion-header class="notifyPageHeader">
      <ion-toolbar color="transparent">
        <ion-title class="headerTitle">
          {{ $t('menu_items.notifications') }}
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="$router.push('/main/chat')">
            <ion-icon class="chat-lock" :src="isNewMessage ? chat_fill_svg : chat_svg" />
          </ion-button>
          <ion-button @click="$router.push('/main/map')">
            <ion-icon class="chat-lock" :src="selectedHub?.name ? location_click_svg : location_svg" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="notify-page-content">
      <ion-refresher
        ref="refresher"
        slot="fixed"
        @ionRefresh="doRefresh($event)"
        v-if="!isLoading && notifications.length !== 0"
      >
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>
      <Skeleton :count="5" v-if="isLoading" />
      <ion-list v-else>
        <div class="no-notification-container" v-if="notifications.length === 0">
          <ion-img :src="no_notification" class="no-notification-icon" />
          <ion-label class="no-notification-text1">
            {{ $t('no_notification_text1') }}
          </ion-label>
          <ion-label class="no-notification-text1">
            {{ $t('no_notification_text2') }}
          </ion-label>
          <ion-label class="no-notification-text2">
            {{ $t('no_notification_text3') }}
          </ion-label>
        </div>
        <ion-item-sliding v-for="notification in notifications" :key="notification.id">
          <ion-item
            @click="read(notification)"
            class="notificationItem"
            :class="!notification.read ? 'unread' : ''"
          >
            <ion-icon
              size="small"
              slot="start"
              class="notificationIcon"
              :icon="getIcon(notification.type)"
            ></ion-icon>
            <ion-label class="ion-text-wrap notificationText">
              <ion-text>
                <p class="notifyType">
                  {{ notification.type === 2 ? $t('orders') : $t('promos') }}
                  <span class="timestamp">
                    {{ formatNotificationDateTime(notification.created_at) }}
                  </span>
                </p>
              </ion-text>
              <ion-label class="subtitle">{{ notification.title }}</ion-label>
              <ion-text class="detail">
                <p v-if="notification.message.length > 110">
                  {{ notification.message.substring(0, 110) }}..
                  <span class="readMore" @click="read(notification)">{{ $t('read_more') }}</span>
                </p>
                <p v-else>{{ notification.message }}</p>
              </ion-text>
            </ion-label>
          </ion-item>
          <ion-item-options>
            <ion-item-option color="danger" @click="handleDelete(notification)">
              <ion-img :src="trashIcon" slot="top" />
              <span class="notificationDeleteText">{{ $t('delete') }}</span>
            </ion-item-option>
          </ion-item-options>
        </ion-item-sliding>
      </ion-list>

      <ion-infinite-scroll
        :disabled="!listHasMore"
        :translucent="true"
        @ionInfinite="loadMore($event)"
        threshold="100px"
        id="notifications-scroll"
      >
        <ion-infinite-scroll-content loading-spinner="bubbles" loading-text="Loading...">
        </ion-infinite-scroll-content>
      </ion-infinite-scroll>
      <ion-modal :is-open="showNotification" css-class="deleteToast" @didDismiss="deleteNotification()">
        <DeleteNotifyToast @undo="undoDelete()" />
      </ion-modal>
      <ion-fab
        v-if="showMarkAll && notifications.length > 0"
        horizontal="center"
        vertical="bottom"
        slot="fixed"
      >
        <ion-fab-button @click="markAllAsRead" size="extra-large">{{ $t('mark_all') }}</ion-fab-button>
      </ion-fab>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, computed, ref } from 'vue';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonFab,
  IonFabButton,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonImg,
  IonButton,
  IonButtons,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonModal,
  IonLabel,
  IonList,
  IonPage,
  IonText,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent
} from '@ionic/vue';
import { chatboxOutline, bagHandleSharp, locationOutline, trashOutline } from 'ionicons/icons';
import ticketPercent from '@/assets/icons/shared/ticket-percent.svg';
import trashIcon from '@/assets/icons/shared/trash.svg';
import { useMutation } from '@vue/apollo-composable';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import { filter, remove } from 'lodash';
import Skeleton from '../../../components/Skeleton';
import DeleteNotifyToast from '../../../components/DeleteNotifyToast';
import {
  getAllUserNotifications,
  readAllUserNotifications,
  deleteUserNotification
} from '../../../services/shared/graphql/allNotifications';
import no_notification from '/src/assets/images/no_notification.svg';
import chat_svg from '@/assets/icons/shared/chat.svg';
import chat_fill_svg from '@/assets/icons/shared/chat_fill.svg';
import location_svg from '@/assets/icons/shared/place.svg';
import location_click_svg from '@/assets/icons/shared/place_click.svg';
export default defineComponent({
  name: 'Notifications',
  components: {
    IonContent,
    IonFab,
    IonFabButton,
    IonHeader,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonImg,
    IonButton,
    IonButtons,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding,
    IonModal,
    IonLabel,
    IonList,
    IonPage,
    IonText,
    IonTitle,
    IonToolbar,
    DeleteNotifyToast,
    Skeleton,
    IonRefresher,
    IonRefresherContent
  },
  computed: {
    currentTime: () => dayjs()
  },
  data() {
    return {
      isLoading: true,
      listHasMore: true,
      notifications: [],
      selectedNotification: null,
      showNotification: false,
      showMarkAll: false
    };
  },
  methods: {
    deleteNotification() {
      this.showNotification = false;
      if (!this.selectedNotification) {
        return;
      }

      this.removeNotification({
        notificationId: Number.parseInt(this.selectedNotification.id)
      })
        .then((res) => {
          if (res) {
            remove(
              this.userNotifications,
              (notification) => notification.id === this.selectedNotification.id
            );
            this.$store.dispatch('b2c/deleteUserNotification', {
              id: this.selectedNotification.id
            });
          }
        })
        .catch((e) => {
          console.error(e);
        })
        .finally(() => {
          this.selectedNotification = null;
        });
    },
    formatNotificationDateTime(notificationDateTime) {
      const notificationTime = dayjs(notificationDateTime);
      let timeSinceNotification = this.currentTime.diff(notificationTime, 'minutes');
      let formattedTime = '';

      if (timeSinceNotification <= 4) {
        formattedTime = notificationTime.format('HH:mm');
      } else if (timeSinceNotification > 4 && timeSinceNotification < 60) {
        formattedTime = `${timeSinceNotification} mins`;
      } else {
        timeSinceNotification = this.currentTime.diff(notificationTime, 'hours');

        if (timeSinceNotification < 24) {
          formattedTime = `${timeSinceNotification} ${timeSinceNotification > 1 ? 'hours' : 'hour'}`;
        } else {
          timeSinceNotification = this.currentTime.diff(notificationTime, 'days');
          formattedTime = `${timeSinceNotification} ${timeSinceNotification > 1 ? 'days' : 'day'} ago`;
        }
      }

      return formattedTime;
    },
    getIcon(type) {
      return type === 2 ? bagHandleSharp : ticketPercent;
    },
    handleDelete(notification) {
      this.selectedNotification = notification;
      this.notifications = filter(this.notifications, (n) => n.id !== notification.id);
      this.showNotification = true;
    },
    async loadNotifications(showloading) {
      try {
        this.isLoading = showloading;
        const res = await this.fetchUserNotifications();
        this.$store.dispatch('b2c/setUserNotifications', res.data.getUserNotifications);
        this.notifications = this.userNotifications.slice(0, 10);
        this.showMarkAll = false;
        this.notifications.map((item) => {
          if (!item.read) {
            this.showMarkAll = true;
            return;
          }
        });
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
    async loadMore(ev) {
      try {
        await new Promise((resolve) => {
          setTimeout(() => {
            const newNotifications = this.userNotifications.slice(
              this.notifications.length,
              10 + this.notifications.length
            );
            this.notifications = [...this.notifications, ...newNotifications];

            this.listHasMore = this.notifications.length !== this.userNotifications.length;

            resolve(true);
          }, 1500);
        });
      } catch (e) {
        console.error(e);
      } finally {
        ev.target.complete();
      }
    },
    markAllAsRead() {
      this.readAllNotifications().then(async (res) => {
        if (res.data.readAllUserNotifications > 0) {
          this.showMarkAll = false;
          this.$store.dispatch('b2c/readAllUserNotifications', { read: true });
          this.notifications = this.notifications.map((notification) => ({
            ...notification,
            read: true
          }));
          this.$store.dispatch('b2c/setNewNotification', { status: true });
        }
      });
    },
    read(notification) {
      if (notification.read) {
        this.router.push({
          name: 'NotificationDetails',
          params: { notificationId: notification.id, updateState: 0 }
        });
      } else {
        notification.read = true;
        this.$store.dispatch('b2c/updateUserNotification', notification);
        this.router.push({
          name: 'NotificationDetails',
          params: { notificationId: notification.id, updateState: 1 }
        });
      }
    },
    undoDelete() {
      const notificationIndex = this.userNotifications.findIndex(
        (notification) => notification.id === this.selectedNotification.id
      );
      this.notifications.splice(notificationIndex, 0, this.selectedNotification);
      this.selectedNotification = null;
      this.showNotification = false;
    },
    async doRefresh() {
      await this.loadNotifications(false);
      this.refresher.$el.complete();
    }
  },
  async mounted() {
    await this.loadNotifications(true);
  },
  async ionViewWillEnter() {
    this.showMarkAll = false;
    this.notifications.map((item) => {
      if (!item.read) {
        this.showMarkAll = true;
        return;
      }
    });
    if (this.$store.getters['b2c/getUpdateNotificationPage']) {
      this.$store.dispatch('b2c/setUpdateNotificationPage', { status: false });
      await this.loadNotifications(true);
    }
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const { mutate: removeNotification } = useMutation(deleteUserNotification);
    const { mutate: fetchUserNotifications } = useMutation(getAllUserNotifications);
    const { mutate: readAllNotifications } = useMutation(readAllUserNotifications);
    const isNewMessage = computed(() => {
      return store.getters['b2c/getIsNewMessage'];
    });
    const selectedHub = computed(() => {
      return store.getters['b2c/getSelectedHub'];
    });
    const userNotifications = computed(() => {
      return store.getters['b2c/getAllNotification'];
    });
    const refresher = ref(null);
    return {
      router,
      bagHandleSharp,
      chatboxOutline,
      locationOutline,
      isNewMessage,
      selectedHub,
      userNotifications,
      ticketPercent,
      trashIcon,
      trashOutline,
      chat_svg,
      chat_fill_svg,
      location_svg,
      location_click_svg,
      no_notification,
      fetchUserNotifications,
      readAllNotifications,
      removeNotification,
      refresher
    };
  }
});
</script>

<style scoped lang="scss">
@import 'notifications.module';
</style>

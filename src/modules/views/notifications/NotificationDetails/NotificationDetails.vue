<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/notifications"></ion-back-button>
        </ion-buttons>
        <p class="notification-type">{{ notification.type === 2 ? $t('orders') : $t('promos') }}</p>
      </ion-toolbar>
    </ion-header>
    <ion-content class="page-content">
      <Skeleton :count="5" v-if="isLoading" />
      <div v-else class="notification-container">
        <p class="notification-title">{{ notification ? notification.title : '' }}</p>
        <div class="notification-date">{{ getNotificationDate() }}</div>
        <p class="notification-contents">{{ notification ? notification.message : '' }}</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { IonBackButton, IonButtons, IonContent, IonHeader, IonPage, IonToolbar } from '@ionic/vue';
import { bagHandleOutline, ticketOutline, trashOutline } from 'ionicons/icons';
import { useMutation } from '@vue/apollo-composable';
import { getUserNotification, updateUserNotification } from '@/services/shared/graphql/allNotifications';
import { useStore } from 'vuex';
import dayjs from 'dayjs';
import { find } from 'lodash';
import { useRouter } from 'vue-router';
import Skeleton from '../../../../components/Skeleton';

export default defineComponent({
  name: 'NotificationDetails',
  components: {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    Skeleton
  },
  methods: {
    getNotificationDate() {
      return this.notification ? dayjs(this.notification.created_at).format('DD MMM YYYY HH:mm') : '';
    }
  },
  props: ['notificationId', 'updateState'],
  async setup(props) {
    const router = useRouter();
    const store = useStore();
    const { mutate: fetchNotification } = useMutation(getUserNotification);
    const { mutate: readNotification } = useMutation(updateUserNotification);
    const notification = ref({});
    const isLoading = ref(true);
    console.log(props.notificationId);
    console.log(props.updateState);

    if (props.notificationId) {
      try {
        const notificationId = Number.parseInt(props.notificationId);
        const updateState = Number.parseInt(props.updateState);

        const userNotifications = store.getters['b2c/getAllNotification'];
        notification.value = find(userNotifications, (notification) => notification.id === notificationId);
        if (!notification.value) {
          const fetchResult = await fetchNotification(props.notificationId);
          notification.value = fetchResult.data.getUserNotification;
        }
        if (updateState == 1) {
          readNotification({ notificationId: notificationId })
            .then(() => {
              store.dispatch('b2c/setNewNotification', { status: true });
            })
            .catch((e) => console.error(e));
        }
      } catch (e) {
        console.error('Fetch Notification Error: ', e);
        router.push('/main/notifications');
      } finally {
        isLoading.value = false;
      }
    }

    return {
      bagHandleOutline,
      isLoading,
      notification,
      ticketOutline,
      trashOutline
    };
  }
});
</script>

<style scoped lang="scss">
@import 'notification.details.module';
</style>

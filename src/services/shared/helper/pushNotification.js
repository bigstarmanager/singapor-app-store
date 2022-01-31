import { Capacitor } from '@capacitor/core';
import { PushNotifications } from '@capacitor/push-notifications';
import { FCM } from '@capacitor-community/fcm';
import { LocalNotifications } from '@capacitor/local-notifications';
import SendBirdService from './sendbird';
import clevertap from './clevertap';

const init = (router) => {
  if (Capacitor.isNativePlatform()) {
    registerForPushNotifications(router);
  }
};

const registerForPushNotifications = (router) => {
  PushNotifications.requestPermissions().then((result) => {
    if (result.receive === 'granted') {
      PushNotifications.register();
    } else {
      console.error('Notification Permission not granted');
    }
  });

  PushNotifications.addListener('registration', (token) => {
    console.log('FCM Token: ' + JSON.stringify(token));
    SendBirdService.setFcmToken(token.value);
    clevertap.setPushToken(token.value);
  });

  PushNotifications.addListener('registrationError', (error) => {
    console.log('FCM Registration Error: ' + JSON.stringify(error));
  });

  PushNotifications.addListener('pushNotificationReceived', async (notification) => {
    /* This will be triggered when notification is received on foreground */
    /* Show notification with LocalNotification for Android because Android don't show notification in Foreground */
    if (Capacitor.getPlatform() === 'android') {
      LocalNotifications.schedule({
        notifications: [
          {
            id: new Date().getTime(),
            title: notification.title,
            body: notification.body,
            extra: notification.data
          }
        ]
      });
    }
  });

  PushNotifications.addListener('pushNotificationActionPerformed', (notification) => {
    if (notification.actionId === 'tap') {
      if (notification.notification.data.notification_id) {
        router.push({
          path: '/main/notifications/details',
          query: { notificationId: notification.notification.data.notification_id }
        });
      } else if (notification.notification.data.deeplink) {
        router.push(notification.notification.data.deeplink);
      } else if (notification.notification.data.sendbird) {
        const sendbird = JSON.parse(notification.notification.data.sendbird);
        router.push({
          path: '/main/chat/details',
          query: { channel: sendbird.channel.channel_url }
        });
      } else {
        router.push('/main/notifications');
      }
    }
  });

  LocalNotifications.addListener('localNotificationActionPerformed', (notification) => {
    if (notification.actionId === 'tap') {
      if (notification.notification.extra.notification_id) {
        router.push({
          path: '/main/notifications/details',
          query: { notificationId: notification.notification.extra.notification_id }
        });
      } else if (notification.notification.extra.deeplink) {
        router.push(notification.notification.extra.deeplink);
      } else if (notification.notification.extra.sendbird) {
        const sendbird = JSON.parse(notification.notification.extra.sendbird);
        router.push({
          path: '/main/chat/details',
          query: { channel: sendbird.channel.channel_url }
        });
      } else {
        router.push('/main/notifications');
      }
    }
  });
};

const subscribeTopic = (topic) => {
  if (!Capacitor.isNativePlatform()) return;
  if (!topic) return console.log('Topic cannot be empty');

  const env = process.env.VUE_APP_ENV || 'development';
  const formatedTopic = `${topic}-${env}`;

  FCM.subscribeTo({ topic: formatedTopic })
    .then(() => console.log(`subscribed to topic ${formatedTopic}`))
    .catch((err) => console.log(err));
};

const deleteInstanceId = async () => {
  if (!Capacitor.isNativePlatform()) return;
  FCM.deleteInstance()
    .then(() => {
      console.log(`Token deleted`);
      getToken();
    })
    .catch((err) => console.log(err));
};

const getToken = async () => {
  FCM.getToken()
    .then((r) => {
      console.log(`FCM Token: ${r.token}`);
    })
    .catch((err) => console.log(err));
};

const PushNotification = {
  init,
  subscribeTopic,
  deleteInstanceId
};

export default PushNotification;

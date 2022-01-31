<template>
  <ion-item-sliding ref="chatItem">
    <ion-item button :detail="false" @click="openChat(chat)" class="item-container">
      <ion-avatar slot="start" class="avatar-container">
        <ion-img :src="!chat.data ? chat_group : chat_private" />
        <ion-img id="avatar-thumb" v-if="!chat.data" :src="chat_private" />
      </ion-avatar>
      <div class="item-text-container">
        <div id="item-top-container">
          <span id="channel-name">
            {{ renderChannelName(chat) }}
          </span>
          <span class="datetime-text"> {{ lastChannelMessage.timeString }} </span>
        </div>
        <div class="last-message-margin">
          <div id="channel-sub" class="last-message-container">
            <ion-icon
              v-if="chat.unreadMessageCount === 0"
              :icon="checkmarkDoneOutline"
              class="check-last-message"
            />
            <span class="last-message">
              {{ lastChannelMessage.message }}
            </span>
          </div>
          <div class="channel-stat-item">
            <ion-img :src="mute_green" v-if="chat.myPushTriggerOption === 'off'" class="mute-green" />
            <ion-badge v-if="chat.unreadMessageCount > 0" class="badge-number">
              {{ chat.unreadMessageCount }}
            </ion-badge>
          </div>
        </div>
      </div>
    </ion-item>

    <ion-item-options side="end">
      <ion-item-option class="leave-container">
        <div @click="onRemoveChannel(chat)" class="mute-button">
          <ion-img :src="chat_leave" />
          <span class="mute-text" slot="bottom"> Leave </span>
        </div>
      </ion-item-option>
      <ion-item-option class="mute-container">
        <div @click="onSlideMute(chat)" class="mute-button">
          <ion-img :src="chat.myPushTriggerOption !== 'off' ? mute_white : unmute_white" />
          <span class="mute-text" slot="bottom">
            {{ chat.myPushTriggerOption !== 'off' ? 'Mute' : 'Unmute' }}
          </span>
        </div>
      </ion-item-option>
    </ion-item-options>
  </ion-item-sliding>
</template>

<script>
import {
  IonAvatar,
  IonBadge,
  IonIcon,
  IonImg,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  alertController
} from '@ionic/vue';
import { defineComponent } from 'vue';
import {
  chatboxOutline,
  checkmarkDoneOutline,
  locationOutline,
  searchOutline,
  volumeMediumOutline,
  volumeMuteOutline
} from 'ionicons/icons';
import { startCase } from 'lodash';
import dayjs from 'dayjs';
import { useRouter } from 'vue-router';
import chat_group from '@/assets/icons/shared/chat_group.svg';
import chat_private from '@/assets/icons/shared/chat_private.svg';
import mute_green from '@/assets/icons/shared/mute_green.svg';
import mute_white from '@/assets/icons/shared/mute_white.svg';
import unmute_white from '@/assets/icons/shared/unmute_white.svg';
import chat_leave from '@/assets/icons/shared/chat_leave.svg';

export default defineComponent({
  name: 'ChatItem',
  components: {
    IonAvatar,
    IonBadge,
    IonIcon,
    IonImg,
    IonItem,
    IonItemOption,
    IonItemOptions,
    IonItemSliding
  },
  data() {
    return {
      lastChannelMessage: {}
    };
  },
  methods: {
    getLastMessage(chat) {
      const { lastMessage } = chat;
      if (lastMessage) {
        const createdAt = lastMessage.createdAt;
        const message = !lastMessage.message ? lastMessage.name : lastMessage.message;
        const nickname = lastMessage.sender ? lastMessage.sender.nickname : null;
        const formattedNickname = nickname ? `${startCase(nickname.toLowerCase())}: ` : '';
        const timestamp = new Date(createdAt).toLocaleTimeString();
        let timeString;
        if (dayjs().diff(createdAt, 'week') > 0) {
          timeString = dayjs(createdAt).format('DD/MM/YY');
        } else if (dayjs().isSame(createdAt, 'date')) {
          timeString = dayjs(createdAt).format('hh:mm A');
        } else if (dayjs().diff(createdAt, 'day' === 1)) {
          timeString = 'Yesterday';
        } else {
          timeString = dayjs(createdAt).format('dddd');
        }
        return {
          time: timestamp,
          message: `${formattedNickname}${message}`,
          timeString,
          dp: lastMessage.profileUrl
        };
      }
      return { time: null, message: null, timeString: null };
    },
    async onRemoveChannel(chat) {
      const alert = await alertController.create({
        cssClass: 'leave-channel-confirm .alert-wrapper',
        header: this.$t('leave_channel_confirm_header'),
        message: `${this.$t('leave_channel_confirm_message')}`,
        buttons: [
          {
            text: 'CANCEL',
            role: 'cancel',
            handler: () => {}
          },
          {
            text: 'YES, LEAVE',
            handler: () => {
              this.leaveChannel(chat);
            }
          }
        ]
      });
      return alert.present();
    },
    onSlideMute(chat) {
      const isMute = chat.myPushTriggerOption === 'off';
      chat.setMyPushTriggerOption(isMute ? 'all' : 'off');
      setTimeout(() => {
        this.$refs.chatItem.$el.closeOpened();
      }, 200);
      this.handleMute(chat);
    },
    renderChannelName(channel) {
      if (channel.data) {
        const channelData = JSON.parse(channel.data);
        if (this.$store.state.user_type_id === 11) {
          return channelData.userName || channel.name;
        } else {
          return channelData.advocateName || channel.name;
        }
      }
      return channel.name.replaceAll(' - B2C', '');
    }
  },
  mounted() {
    this.lastChannelMessage = this.getLastMessage(this.chat);
  },
  props: {
    chat: Object,
    handleMute: Function,
    leaveChannel: Function,
    openChat: Function,
    isPrivate: Boolean
  },
  setup() {
    const router = useRouter();
    // const app = getCurrentInstance();

    return {
      checkmarkDoneOutline,
      searchOutline,
      chatboxOutline,
      locationOutline,
      router,
      chat_group,
      chat_private,
      mute_green,
      mute_white,
      unmute_white,
      chat_leave,
      volumeMediumOutline,
      volumeMuteOutline
    };
  }
});
</script>
<style scoped lang="scss">
@import 'chat.item.module';
</style>

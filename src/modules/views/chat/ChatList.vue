<template>
  <ion-page>
    <ion-header class="page-header">
      <ion-toolbar v-if="!isSearching">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/home" />
          <span class="title-text">{{ $t('inbox') }}</span>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button @click="toggleSearch()">
            <ion-icon class="search-icon" slot="end" :icon="searchOutline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar v-if="isSearching">
        <ion-searchbar
          animated
          show-cancel-button="always"
          :clear-icon="closeCircleOutline"
          @ionCancel="toggleSearch()"
          @ionInput="filterChatList"
          placeholder="Search..."
        />
      </ion-toolbar>
    </ion-header>
    <ion-loading :is-open="loadingMessage" message="Loading Messages..." />
    <ion-content class="chatContainer">
      <SkeletonChat :count="5" v-if="isLoading" />
      <ion-list lines="none" v-if="!isLoading && userChats.length !== 0">
        <ion-item v-for="chat in userChats" :key="chat.url" class="chat-item">
          <ChatItem
            v-bind:isPrivate="false"
            v-bind:chat="chat"
            :openChat="openChat"
            :handleMute="handleMute"
            :leaveChannel="leaveChannel"
          />
        </ion-item>
      </ion-list>
      <div class="no-search-container" v-if="!isLoading && userChats.length === 0">
        <ion-img :src="no_chat" class="no-search-icon" />
        <div class="no-search-text-container">
          <ion-item class="join-collection-button" @click="joinCollectionPoint()">
            <ion-label class="no-search-text1">
              {{ $t('no_chat_text1') }}
            </ion-label>
          </ion-item>
          <ion-label class="no-search-text2">
            {{ $t('no_chat_text2') }}
          </ion-label>
        </div>
        <ion-label class="no-search-text2">
          {{ $t('no_chat_text3') }}
        </ion-label>
      </div>
      <ion-modal :is-open="showMuteToast" css-class="muteToast" @didDismiss="deleteNotification()">
        <MuteChatToast :isMute="isMute" @undo="undoAction()" />
      </ion-modal>
    </ion-content>
    <ion-toast
      :is-open="showToast"
      :message="$t('leave_channel_toast_message')"
      :duration="2000"
      css-class="toastMessage"
      @onDidDismiss="showToast = false"
    />
  </ion-page>
</template>

<script>
import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonLoading,
  IonList,
  IonModal,
  IonPage,
  IonSearchbar,
  IonToast,
  IonToolbar
} from '@ionic/vue';
import { defineComponent, inject, ref } from 'vue';
import {
  chatboxOutline,
  checkmarkDoneOutline,
  locationOutline,
  searchOutline,
  closeCircleOutline,
  volumeMuteOutline
} from 'ionicons/icons';
// import { useMutation } from '@vue/apollo-composable';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import SendBirdService, { sb } from '../../../services/shared/helper/sendbird';
import SkeletonChat from '../../../components/SkeletonChat';
import ChatItem from '../../../components/ChatItem';
import MuteChatToast from '../../../components/MuteChatToast';
import no_chat from '/src/assets/images/no_chat.svg';

export default defineComponent({
  name: 'ChatList',
  components: {
    ChatItem,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonLoading,
    IonList,
    IonModal,
    IonPage,
    IonSearchbar,
    IonToast,
    IonToolbar,
    SkeletonChat,
    MuteChatToast
  },
  computed: {
    userChats() {
      return this.filteredChats || this.chatList;
    }
  },
  data() {
    return {
      filteredChats: null,
      isSearching: false,
      isMute: false,
      selectedChat: null,
      showToast: false,
      showMuteToast: false,
      loadingMessage: false
    };
  },
  ionViewDidEnter() {
    this.fetchList();
  },
  unmounted() {
    this.getTotalUnreadChannelCount();
  },
  ionViewDidLeave() {
    this.loadingMessage = false;
  },
  async setup() {
    const router = useRouter();
    const store = useStore();
    const isLoading = ref(true);
    const chatList = ref([]);
    const user = await inject('$storage').getUser();

    const fetchList = async () => {
      isLoading.value = true;
      const sendBirdUserDetails = await SendBirdService.getUserToken(`TD${user.id}`);
      await store.dispatch('b2c/setSendBirdDetails', sendBirdUserDetails);
      const { user_id, access_token } = store.getters['b2c/getSendBirdDetails'];
      if (user_id && access_token) {
        SendBirdService.connect(user_id, access_token)
          .then(async () => {
            const list = await SendBirdService.getChatList();
            chatList.value = list;
            store.commit('b2c/setUserChatList', list);
            isLoading.value = false;
          })
          .catch((err) => {
            console.error(err);
            isLoading.value = false;
          });
      }
    };

    return {
      fetchList,
      isLoading,
      chatList,
      checkmarkDoneOutline,
      searchOutline,
      chatboxOutline,
      locationOutline,
      closeCircleOutline,
      router,
      volumeMuteOutline,
      no_chat
    };
  },
  methods: {
    getRecipient(chat) {
      const currentUser = sb.currentUser;
      const { members } = chat;
      const [recipient] = members.filter((user) => user.userId !== currentUser.userId);
      return {
        name: recipient.metaData.fullName,
        avatar: recipient.metaData.avatar || null // could have a default picture for every profile
      };
    },
    filterChatList(ev) {
      const keyword = ev.target.value;
      this.filteredChats = this.chatList.filter((a) => {
        const channelName = this.renderChannelName(a);
        return channelName.toLowerCase().includes(keyword.toLowerCase());
      });
    },
    openChat(channel) {
      channel.unreadMessageCount = 0;
      this.loadingMessage = true;
      this.router.push({ path: 'chat/details', query: { channel: channel.url } });
    },
    leaveChannel(channel) {
      let self = this;
      sb.GroupChannel.getChannel(channel.url, function (groupChannel, error) {
        if (error) {
          // Handle error.
          return;
        }

        groupChannel.leave(function (response, error) {
          if (error) {
            // Handle error.
            return;
          }
          const pos = self.chatList.indexOf(channel);
          if (pos > -1) {
            self.chatList.splice(pos, 1);
            self.showToast = true;
          }
        });
      });
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
    },
    deleteNotification() {
      this.showMuteToast = false;
    },
    handleMute(chat) {
      this.isMute = chat.myPushTriggerOption === 'off';
      this.selectedChat = chat;
      this.showMuteToast = true;
      setTimeout(() => {
        this.showMuteToast = false;
        this.selectedChat = null;
      }, 3000);
    },
    undoAction() {
      this.showMuteToast = false;
      if (this.selectedChat) {
        const isMute = this.selectedChat.myPushTriggerOption === 'off';
        this.selectedChat.setMyPushTriggerOption(isMute ? 'all' : 'off');
      }
    },
    toggleSearch() {
      this.isSearching = !this.isSearching;
    },
    joinCollectionPoint() {
      this.$router.push('map');
    },
    async getTotalUnreadChannelCount() {
      const user = await inject('$storage').getUser();
      const sendBirdUserDetails = await SendBirdService.getUserToken(`TD${user.id}`);
      await this.$store.dispatch('b2c/setSendBirdDetails', sendBirdUserDetails);
      const { user_id, access_token } = this.$store.getters['b2c/getSendBirdDetails'];
      if (user_id && access_token) {
        SendBirdService.connect(user_id, access_token)
          .then(async () => {
            const count = await SendBirdService.getTotalUnreadChannelCount();
            await this.$store.dispatch('b2c/setIsNewMessage', count > 0);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    }
  }
});
</script>
<style scoped lang="scss">
@import 'chat.list.module';
</style>

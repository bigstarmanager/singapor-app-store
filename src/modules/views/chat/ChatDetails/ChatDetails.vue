<template>
  <ion-page>
    <ion-header class="header">
      <ion-toolbar id="user-avatar" v-if="!isReply">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/chat"></ion-back-button>
        </ion-buttons>
        <ion-avatar slot="start" id="avatar-container">
          <ion-img :src="channel && !channel.data ? chat_group : chat_private" />
          <ion-avatar
            v-if="channel && !channel.data"
            slot="end"
            style="position: absolute; bottom: -12.5%; right: -12.5%"
          >
            <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
          </ion-avatar>
        </ion-avatar>
        <div id="chat-title" @click="onGroupDescriptionShow">
          <ion-label id="chat-channel-name">{{ channel ? renderChannelName(channel) : '' }}</ion-label>
          <ion-label v-if="channel && !channel.data" id="chat-sub">{{
            $t('tap_here_to_view_description')
          }}</ion-label>
        </div>
      </ion-toolbar>
      <ion-toolbar id="user-avatar" v-if="isReply">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/chat"></ion-back-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-icon id="reply-icon" :icon="arrowUndo"></ion-icon>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <div v-if="showCommunityDescription" class="chat-description-container">
      <div class="description-header">
        <ion-label class="description-title">{{ $t('group_description') }}</ion-label>
        <ion-img
          :src="chat_description_close"
          class="description-close"
          @click="showCommunityDescription = false"
        />
      </div>
      <ion-label
        v-if="isShowGroupDescriptionMore === false && groupDescription.length > 180"
        class="description-content"
      >
        {{ groupDescription.substring(0, 180) }}...
        <ion-label class="description-see-more" @click="isShowGroupDescriptionMore = true">{{
          $t('see_more')
        }}</ion-label>
      </ion-label>
      <ion-label v-else class="description-content">
        {{ groupDescription }}
        <br /><br />
        <ion-row>
          <ion-label class="description-see-more" @click="isShowGroupDescriptionMore = false">{{
            $t('product_detail.see_less')
          }}</ion-label>
          <ion-img class="description-see-less-arrow" :src="chevron_up_sharp" />
        </ion-row>
      </ion-label>
    </div>
    <ion-loading :is-open="loadingLoadMessage" message="Loading Messages..." />
    <ion-content :fullscreen="true" class="chatMessageContainer" ref="messageDetail">
      <ion-infinite-scroll
        @ionInfinite="loadMoreMessages($event)"
        id="messagesScroll"
        :disabled="isDisabled"
        position="top"
        threshold="100px"
      >
        <ion-infinite-scroll-content loading-spinner="circular" loading-text="Loading messages..." />
      </ion-infinite-scroll>
      <ion-list lines="none">
        <ion-item
          v-bind:class="!isCurrentUser(message) ? 'sentMessage' : 'replyMessage'"
          v-for="(message, index) in filteredMessages"
          :key="index"
        >
          <ChatMessage
            :isCurrentUser="isCurrentUser(message)"
            :message="message"
            :onImagePreview="previewImage"
            :onRemoveMessage="removeMessage"
            :onSelectMessage="selectMessage"
          />
        </ion-item>
      </ion-list>
    </ion-content>
    <ion-modal :is-open="attachmentModalOpen">
      <AttachmentPreview
        :attachmentFiles="attachments"
        :attachmentData="attachmentData"
        :handleMessageSend="sendMessage"
        :handleModalClose="closeModal"
        :isPreviewing="isPreviewMode"
        :onAttachmentDelete="deleteAttachment"
        :memberList="memberList"
        :currentUserId="currentUserId"
      />
    </ion-modal>
    <ion-toast
      :is-open="showToast"
      :message="toastMessage"
      :duration="2000"
      css-class="toastMessage"
      @onDidDismiss="showToast = false"
    />

    <ion-footer class="footer" v-if="selectedMessage !== null">
      <ion-item class="message-preview">
        {{ selecetedMessage }}
      </ion-item>
      <ion-toolbar class="toolbar-footer" v-if="showAttachmentOptions">
        <ion-buttons class="attachment-options">
          <div class="attachment-button-container">
            <ion-button
              class="attachment-button"
              expand="full"
              color="light"
              shape="round"
              size="large"
              @click="handleAttachmentSelect('document')"
            >
              <ion-icon slot="icon-only" :icon="documentTextOutline"></ion-icon>
            </ion-button>
            <ion-label class="attachment-label">Document</ion-label>
          </div>
          <div class="attachment-button-container">
            <ion-button
              class="attachment-button"
              expand="full"
              color="light"
              shape="round"
              size="large"
              @click="handleAttachmentSelect('image')"
            >
              <ion-icon slot="icon-only" :icon="imageOutline"></ion-icon>
            </ion-button>
            <ion-label class="attachment-label">Image</ion-label>
          </div>
        </ion-buttons>
        <ion-input hidden class="file-input" ref="attachmentInput" type="file" @input="onSelectFile" />
      </ion-toolbar>
      <div>
        <div v-if="mentionedList.length > 0" class="mentioned-users-container">
          <div
            v-for="(mentionedUser, index) in mentionedList"
            @click="onClickMentionedUsers(mentionedUser)"
            class="mentioned-user-item"
            :key="index"
          >
            {{ mentionedUser.nickname }}
          </div>
        </div>
      </div>
      <div class="footer-message">
        <ion-img id="attachment-icon" :src="paperclip_svg" @click="toggleAttachmentOptions()" />
        <div id="input-container" @click="onFocusMessage()">
          <ion-textarea
            v-model="newMessage"
            @ion-change="onChangeMessageText"
            rows="1"
            auto-grow="true"
            color="black"
            placeholder="Type message here"
            id="message-input"
          />
        </div>
        <ion-img id="send-message" :src="chat_send" @click="sendMessage()" slot="end" />
      </div>
    </ion-footer>

    <ion-footer class="footer" v-if="selectedMessage === null">
      <ion-toolbar class="toolbar-footer" v-if="showAttachmentOptions">
        <ion-buttons class="attachment-options">
          <div class="attachment-button-container">
            <ion-button
              class="attachment-button"
              expand="full"
              color="light"
              shape="round"
              size="large"
              @click="handleAttachmentSelect('document')"
            >
              <ion-icon slot="icon-only" :icon="documentTextOutline"></ion-icon>
            </ion-button>
            <ion-label class="attachment-label">Document</ion-label>
          </div>
          <div class="attachment-button-container">
            <ion-button
              class="attachment-button"
              expand="full"
              color="light"
              shape="round"
              size="large"
              @click="handleAttachmentSelect('image')"
            >
              <ion-icon slot="icon-only" :icon="imageOutline"></ion-icon>
            </ion-button>
            <ion-label class="attachment-label">Image</ion-label>
          </div>
        </ion-buttons>
        <ion-input hidden class="file-input" ref="attachmentInput" type="file" @input="onSelectFile" />
      </ion-toolbar>
      <div>
        <div v-if="mentionedList.length > 0" class="mentioned-users-container">
          <div
            v-for="(mentionedUser, index) in mentionedList"
            @click="onClickMentionedUsers(mentionedUser)"
            class="mentioned-user-item"
            :key="index"
          >
            {{ mentionedUser.nickname }}
          </div>
        </div>
      </div>
      <div class="footer-message">
        <ion-img id="attachment-icon" :src="paperclip_svg" @click="toggleAttachmentOptions()" />
        <div id="input-container" @click="onFocusMessage()">
          <ion-textarea
            v-model="newMessage"
            @ion-change="onChangeMessageText"
            rows="1"
            auto-grow="true"
            color="black"
            placeholder="Type message here"
            id="message-input"
          />
        </div>
        <ion-img id="send-message" :src="chat_send" @click="sendMessage()" slot="end" />
      </div>
    </ion-footer>
  </ion-page>
</template>

<script>
import {
  IonAvatar,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonFooter,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonInput,
  IonImg,
  // IonItem,
  IonLabel,
  IonList,
  IonLoading,
  IonModal,
  IonPage,
  IonRow,
  IonTextarea,
  IonToast,
  IonToolbar,
  alertController
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { documentTextOutline, imageOutline, sendSharp } from 'ionicons/icons';
// import { useMutation } from '@vue/apollo-composable';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import pdf from 'vue-pdf-embed';
import moment from 'moment';
import SendBirdSyncManager from 'sendbird-syncmanager';
import paperclip_svg from '@/assets/icons/shared/paperclip.svg';
import { arrowUndo } from 'ionicons/icons';
import AttachmentPreview from '../AttachmentPreview/AttachmentPreview.vue';
import ChatMessage from '../../../../components/ChatMessage';
import SendBirdService, { sb } from '../../../../services/shared/helper/sendbird';
import chat_group from '@/assets/icons/shared/chat_group.svg';
import chat_private from '@/assets/icons/shared/chat_private.svg';
import chat_send from '@/assets/icons/shared/chat_send.svg';
import chat_description_close from '@/assets/icons/shared/chat_description_close.svg';
import chevron_up_sharp from '@/assets/icons/shared/chevron_up_sharp.svg';

import clevertap from '@/services/shared/helper/clevertap';

export default defineComponent({
  name: 'ChatDetails',
  components: {
    AttachmentPreview,
    ChatMessage,
    IonAvatar,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonFooter,
    IonHeader,
    IonIcon,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonInput,
    IonImg,
    //IonItem,
    IonLabel,
    IonList,
    IonLoading,
    IonModal,
    IonPage,
    IonRow,
    IonTextarea,
    IonToast,
    IonToolbar
  },
  computed: {
    filteredMessages() {
      return this.messages;
    }
  },
  data() {
    return {
      isDisabled: true,
      isLoading: true,
      isSearching: false,
      isReply: false,
      channel: null,
      newMessage: '',
      messages: [],
      attachments: [],
      recipient: {},
      memberList: [],
      currentUserId: null,
      loadingLoadMessage: false,
      channelHandlerId: null,
      attachmentData: null,
      showToast: false,
      toastMessage: '',
      groupDescription: '',
      isShowGroupDescriptionMore: false,
      showCommunityDescription: false,
      showAttachmentOptions: false,
      attachmentModalOpen: false,
      mentionedList: [],
      arrowUndo,
      selectedMessage: { message: 'Test Message' }
    };
  },
  async setup() {
    const router = useRouter();
    const store = useStore();

    const { user_id, access_token } = store.getters['b2c/getSendBirdDetails'];

    if (user_id && access_token) {
      await SendBirdService.connect(user_id, access_token);
    }

    return {
      paperclip_svg,
      sendSharp,
      documentTextOutline,
      imageOutline,
      router,
      chat_group,
      chat_private,
      chat_send,
      chat_description_close,
      chevron_up_sharp
    };
  },
  methods: {
    closeModal() {
      this.attachments = [];
      this.attachmentData = null;
      this.attachmentModalOpen = false;
      this.showAttachmentOptions = false;
    },
    async removeMessage(message) {
      const alert = await alertController.create({
        cssClass: 'delete-message-confirm .alert-wrapper',
        message: `${this.$t('delete_message_confirm')}`,
        buttons: [
          {
            text: 'NO',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {}
          },
          {
            text: 'YES',
            handler: () => {
              this.deleteMessage(message);
            }
          }
        ]
      });
      return alert.present();
    },
    deleteMessage(message) {
      let self = this;
      this.channel.deleteMessage(message, function (response, error) {
        if (error) {
          // Handle error.
        }
        // The message is successfully deleted from the channel.
        self.showToast = true;
        self.toastMessage = self.$t('delete_message');
      });
    },
    async deleteAttachment(index) {
      this.attachments = this.attachments.filter((curr, idx) => idx !== index);
    },
    toggleAttachmentOptions() {
      this.showAttachmentOptions = !this.showAttachmentOptions;
    },
    toggleReply() {
      this.isReply = !this.isReply;
    },
    handleAttachmentSelect(attachmentType) {
      this.$refs.attachmentInput.$el
        .getInputElement()
        .then((input) => {
          input.accept = attachmentType === 'document' ? 'application/pdf' : 'image/*';
          input.click();
        })
        .catch((err) => console.error('Error Selecting Attachment', err));
    },
    async onSelectFile() {
      const input = await this.$refs.attachmentInput.$el.getInputElement();
      const files = input.files;
      if (files && Object.keys(files).length > 0) {
        for (let i = 0; i < Object.keys(files).length; i++) {
          if (files[i].size > 5 * 1024 * 1024) {
            this.showToast = true;
            this.toastMessage = this.$t('image_lager_than_5mb');
            this.closeModal();
            return;
          }
        }
      }
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const reader = new FileReader();
          reader.onload = (e) => {
            this.attachments.push({
              name: files[i].name,
              data: e.target.result,
              file: files[i]
            });
          };
          reader.readAsDataURL(files[i]);
        }
      }
      this.openModal({ type: files[0].type }, false);
    },
    async getChannel() {
      if (this.$route.query.channel) {
        const channelData = await SendBirdService.getChat(this.$route.query.channel);
        this.channel = channelData;
      } else {
        this.$router.go(-1);
      }
    },
    onGroupDescriptionShow() {
      if (this.showCommunityDescription) {
        this.showCommunityDescription = false;
      } else if (!this.channel.data) {
        this.showCommunityDescription = true;
        this.isShowGroupDescriptionMore = false;
      }
    },
    async getChannelMetadata() {
      const { groupDescription } = await SendBirdService.getChannelMetadata(this.channel.url);
      if (groupDescription) {
        this.groupDescription = groupDescription;
      } else {
        this.groupDescription = this.$t('default_group_description');
      }
    },
    async getMessages(isLoadMore = false, loadLimit = 10) {
      if (!this.loadingLoadMessage) {
        try {
          this.loadingLoadMessage = true;

          const history = await SendBirdService.getChatMessages(loadLimit);
          this.messages = [...history, ...this.messages];
        } catch (err) {
          console.error(err);
        } finally {
          setTimeout(() => {
            this.loadingLoadMessage = false;
          }, 700);
          if (!isLoadMore) {
            await this.scrollToBottom();
          }
        }
      }
    },
    async loadMoreMessages(event) {
      this.collection.fetchSucceededMessages('prev');
      setTimeout(() => {
        event.target.complete();
      }, 500);
    },
    getRecipient() {
      const currentUser = sb.currentUser;
      const { members } = this.channel;
      this.currentUserId = currentUser.userId;
      this.memberList = members;

      // If members length is one or two and distinct (used for 1-to-1)
      const isOneToOne = this.channel.isDistinct && members.length > 0 && members.length < 3;
      clevertap.recordEventWithNameAndProps('Open Chat', {
        'chat type': !isOneToOne ? 'community chat' : 'private chat',
        'chat name': this.channel.name
      });

      const [recipient] = members.filter((user) => user.userId !== currentUser.userId);
      this.recipient = { ...recipient.metaData, userId: recipient.userId };
    },
    isCurrentUser(message) {
      const { userId: senderUserId } = message.sender || {};
      // const { userId: recipientUserId } = this.recipient || {};
      return senderUserId === this.currentUserId;
    },
    renderFileData(data) {
      if (typeof data === 'string') {
        return { caption: data };
      }

      return data || '';
    },
    async onFocusMessage() {
      const textareaRef = await document.getElementById('message-input').getInputElement();
      textareaRef.focus();
    },
    onClickMentionedUsers(selectedMentionUser) {
      const reversedMessage = this.newMessage.split('').reverse().join('');
      let indexAt = reversedMessage.indexOf('@');
      if (indexAt > -1) {
        indexAt = reversedMessage.length - indexAt - 1;
        this.newMessage = this.newMessage.substring(0, indexAt + 1) + selectedMentionUser.nickname;
      }
    },
    onChangeMessageText(e) {
      const reversedMessage = e.target.value.split('').reverse().join('');
      let indexAt = reversedMessage.indexOf('@');
      if (indexAt > -1) {
        indexAt = reversedMessage.length - indexAt - 1;
        const lastString = e.target.value.substring(indexAt);
        this.mentionedList = this.memberList.filter((e) => e.userId !== this.currentUserId);
        this.mentionedList = this.mentionedList.filter((e) =>
          e.nickname.toLowerCase().startsWith(lastString.substring(1).toLowerCase())
        );
      } else {
        this.mentionedList = [];
      }
    },
    getMentionedMembers(message) {
      const mentionMembers = this.memberList.filter((e) => e.userId !== this.currentUserId);
      let mentionIds = [];
      for (let i = 0; i < mentionMembers.length; i++) {
        if (message.includes('@' + mentionMembers[i].nickname)) {
          mentionIds.push(mentionMembers[i].userId);
        }
      }
      return mentionIds;
    },
    sendMessage(msg = '', onSend = null) {
      if (msg || this.newMessage || this.attachments.length > 0) {
        const messageToSend = this.newMessage || msg;
        const mentionedMembers = this.getMentionedMembers(messageToSend);
        SendBirdService.sendMessage(
          this.collection,
          this.channel,
          messageToSend,
          this.attachments,
          mentionedMembers
        )
          .then(() => {
            this.newMessage = '';
            this.attachments = [];
            this.closeModal();
            setTimeout(() => {
              this.scrollToBottom();
            }, 300);
            // If members length is one or two and distinct (used for 1-to-1)
            const isOneToOne =
              this.channel.isDistinct && this.channel.members.length > 0 && this.channel.members.length < 3;
            clevertap.recordEventWithNameAndProps('Open Chat', {
              'chat type': !isOneToOne ? 'community chat' : 'private chat',
              'chat name': this.channel.name
            });
          })
          .then(() => {
            if (onSend) {
              onSend();
            }
          })
          .finally(() => {
            this.attachmentModalOpen = false;
            this.loadingLoadMessage = false;
          });
      }
    },
    getMemberList() {
      const normalizedArray = this.memberList.map((member) => {
        return member.nickname;
      });
      return normalizedArray.toString();
    },
    getDate(timestamp) {
      return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    },
    getTimeStamp(timestamp) {
      let timeString;
      if (moment().diff(timestamp, 'week') > 0) {
        timeString = moment(timestamp).format('DD-MM-YYYY hh:mm A');
      } else if (moment().isSame(timestamp, 'date')) {
        timeString = moment(timestamp).format('hh:mm A');
      } else if (moment().diff(timestamp, 'day' === 1)) {
        timeString = `Yesterday ${moment(timestamp).format('hh:mm A')}`;
      } else {
        timeString = moment(timestamp).format('dddd');
      }
      return timeString;
    },
    async scrollToBottom() {
      await this.$refs.messageDetail.$el.scrollToBottom(500);
    },
    back() {
      window.history.back();
      this.$emit('showMenu');
    },
    async addChannelmarkAsRead() {
      this.channel.markAsRead();
    },
    isAdvocate(message) {
      if (message.sender) {
        const sender = message.sender;
        if (sender.metaData && sender.metaData.advocate === 'true') return true;
      }
      return false;
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
    renderMsgType(msg) {
      const ifFile = msg.messageType === 'file';
      if (ifFile && msg.type === 'application/pdf') {
        return 'pdf';
      }
      if (ifFile) {
        return 'image';
      }
      return 'text';
    },
    renderMsg(msg) {
      const reg = new RegExp(/(?:(https?:\/\/[^\s]+))/);
      if (reg.test(msg.message)) {
        const strFix = msg.message.replace(
          new RegExp(/(?:(https?:\/\/[^\s]+))/, 'm'),
          '<a target="_blank" rel="noopener noreferrer" href="$1">$1</a>'
        );
        return strFix;
      }
      return msg.message;
    },
    openDialog(msg) {
      if (!msg) {
        this.FileImage = null;
        this.file = null;
        this.imagePopupURL = null;
        this.pdfPopupURL = null;
      }
      this.imagePopup = {
        show: !msg ? false : true,
        type: 'file',
        file: 'img',
        data: {
          name: !msg ? '' : msg.sender ? msg.sender.nickname : 'Channel Admin',
          date: !msg ? '' : this.getTimeStamp(msg.createdAt),
          caption: !msg ? '' : msg.data || ''
        }
      };
      this.imagePopupURL = !msg ? null : msg.type !== 'application/pdf' ? msg.url : null;
      this.pdfPopupURL = !msg ? null : msg.type === 'application/pdf' ? msg.url : null;
      this.pdfPopupURL &&
        pdf.createLoadingTask(this.pdfPopupURL).promise.then((pdf) => {
          this.numPages = pdf.numPages;
        });
    },
    async openModal(msg = null, isPreview) {
      this.attachmentData = {
        name: !msg ? '' : msg.sender ? msg.sender.nickname : 'Channel Admin',
        date: !msg ? '' : this.getTimeStamp(msg.createdAt),
        caption: !msg ? '' : this.renderFileData(msg.data).caption,
        isImage: msg.type !== 'application/pdf'
      };
      this.isPreviewMode = isPreview;
      this.attachmentModalOpen = true;
    },
    openUrl(url) {
      window.open(url, '_blank');
    },
    previewImage(image) {
      this.attachments = [{ data: image.url }];
      this.openModal(image, true);
    },
    selectMessage(message) {
      this.selecetedMessage = message;
      this.toggleReply();
      console.log(JSON.stringify(message.message));
    },
    removeFile() {
      this.file = null;
    },
    onRejected(entries) {
      const { failedPropValidation } = entries[0];
      this.$q.notify({
        type: 'negative',
        message: `${
          failedPropValidation === 'max-file-size'
            ? 'Maximum file size is 5mb'
            : 'File format allowed only .jpg, .png, .pdf and max size 5mb'
        }`
      });
    },
    _messageEventHandler(messages, action) {
      switch (action) {
        case 'insert': {
          this.messages = [...messages, ...this.messages];
          this.messages.sort((a, b) => a.createdAt - b.createdAt);
          break;
        }
        case 'remove': {
          for (let i in messages) {
            const message = messages[i];
            const pos = this.messages.indexOf(message);
            if (pos !== -1) {
              this.messages.splice(pos, 1);
            }
          }
          break;
        }
        default:
          break;
      }
    }
  },
  async mounted() {
    this.loadingLoadMessage = true;
    await this.getChannel();
    await this.getChannelMetadata();
    this.addChannelmarkAsRead();
    await SendBirdService.groupChannelCreatePreviousMessageListQuery(this.channel.url);
    this.getRecipient();

    this.limit = 10;
    if (this.collection) {
      this.collection.remove();
    }
    this.collection = new SendBirdSyncManager.MessageCollection(this.channel);
    this.collection.limit = this.limit;

    const collectionHandler = new SendBirdSyncManager.MessageCollection.CollectionHandler();
    collectionHandler.onSucceededMessageEvent = this._messageEventHandler.bind(this);
    this.collection.setCollectionHandler(collectionHandler);
    this.collection.fetchSucceededMessages('prev', () => {
      this.loadingLoadMessage = false;
      setTimeout(() => {
        this.scrollToBottom();
      }, 300);
      setTimeout(() => {
        this.isDisabled = false;
      }, 500);
    });
  }
});
</script>
<style scoped lang="scss">
@import 'chat.details.module';
</style>

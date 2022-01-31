<template>
  <ion-card id="message-container" v-bind:class="!isCurrentUser ? 'senderMessage' : 'responseMessage'">
    <ion-card-header v-if="!isCurrentUser" class="message-container">
      <div class="user-name-container">
        <span class="text-bold user-name-text">
          {{ message.sender ? message.sender.nickname : 'Channel Admin' }}
          <ion-badge v-if="isAdvocate(message)" color="primary" class="text-caption">
            Collection Point
          </ion-badge>
        </span>
      </div>
    </ion-card-header>
    <ion-card-content class="message-container">
      <template v-if="renderMsgType(message) === 'text'">
        <div @click="setSelectedMessage(message)" class="text-message-container">
          <span
            v-bind:class="[
              !isCurrentUser ? 'receiveMessageText' : 'sendMessageText',
              isSelected ? 'selected-message-container' : ''
            ]"
            v-html="renderMsg(message)"
          >
          </span>
        </div>
      </template>
      <template v-else-if="message.type === 'application/pdf'">
        <div @click="onImagePreview(message)" class="pdf-message-container">
          <div class="pdf-preview-container">
            <VuePdfEmbed :source="message.url" class="pdf-preview" :page="1" />
            <div class="pdf-info">
              <ion-img :src="pdfIcon" />
              <span class="pdf-title">{{ message.name }}</span>
              <ion-img class="pdf-download" :src="downloadIcon" @click="openUrl(message.url)" />
            </div>
          </div>
          <div class="pdf-info-container">
            <ion-label v-if="message.data" class="pdf-message-text">
              {{ renderFileData(message.data) }}
            </ion-label>
          </div>
        </div>
      </template>
      <template v-else-if="!!message.url">
        <ion-item v-bind:class="!isCurrentUser ? 'image-message-left-container' : 'image-message-container'">
          <img class="image-message" :src="message.url" @click="onImagePreview(message)" />
        </ion-item>
        <ion-label class="image-message-text">{{ renderFileData(message.data) }}</ion-label>
      </template>
    </ion-card-content>
    <ion-card-subtitle
      class="footer-sub"
      v-bind:class="!isCurrentUser ? 'receive-message-datetime-text' : 'send-message-datetime-text'"
    >
      {{ getTimeStamp(message.createdAt) }}
      <ion-icon v-if="isCurrentUser" :icon="checkmarkDoneOutline" class="check-message" />
    </ion-card-subtitle>
  </ion-card>
</template>

<script>
import {
  IonBadge,
  // IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel
} from '@ionic/vue';
import { defineComponent } from 'vue';
// import pdf from 'vue-pdf';
import VuePdfEmbed from 'vue-pdf-embed';
import {
  chatboxOutline,
  checkmarkDoneOutline,
  documentAttachOutline,
  locationOutline,
  searchOutline,
  volumeMuteOutline
} from 'ionicons/icons';
import moment from 'moment';
import pdfIcon from '@/assets/icons/shared/pdfIcon.svg';
import downloadIcon from '@/assets/images/download.svg';

export default defineComponent({
  name: 'ChatDetails',
  components: {
    IonBadge,
    // IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    VuePdfEmbed
  },
  computed: {},
  data() {
    return {
      longClickHandler: null,
      channel: null,
      isSelected: false
    };
  },
  props: {
    isCurrentUser: Boolean,
    message: Object,
    onRemoveMessage: Function,
    onImagePreview: Function,
    isSelectedMessage: Boolean,
    onSelectMessage: Function
  },
  setup() {
    return {
      checkmarkDoneOutline,
      documentAttachOutline,
      searchOutline,
      chatboxOutline,
      locationOutline,
      pdfIcon,
      downloadIcon,
      volumeMuteOutline
    };
  },
  methods: {
    longPressStart() {
      if (!this.isCurrentUser) {
        return;
      }
      if (moment().diff(this.message.createdAt, 'minute') > 30) {
        return;
      }
      this.longClickHandler = setTimeout(() => {
        this.longPressMessage();
      }, 400);
    },
    longPressEnd() {
      if (!this.isCurrentUser) {
        return;
      }
      if (moment().diff(this.message.createdAt, 'minute') > 30) {
        return;
      }
      clearTimeout(this.longClickHandler);
    },
    longPressMessage() {
      this.onRemoveMessage(this.message);
    },
    renderFileData(data) {
      return data || '';
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
    isAdvocate(message) {
      if (message.sender) {
        const sender = message.sender;
        if (sender.metaData && sender.metaData.advocate === 'true') return true;
      }
      return false;
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
      // this.pdfPopupURL &&
      //   pdf.createLoadingTask(this.pdfPopupURL).promise.then((pdf) => {
      //     this.numPages = pdf.numPages;
      //   });
    },
    openUrl(url) {
      window.open(url, '_blank');
    },
    setSelectedMessage(message) {
      this.onSelectMessage(message);
      this.isSelected = !this.isSelected;
    }
  },
  async mounted() {}
});
</script>
<style scoped lang="scss">
@import 'chat.message.module';
</style>

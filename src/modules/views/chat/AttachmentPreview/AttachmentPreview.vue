<template>
  <ion-loading :is-open="isSending" message="Please Wait..."> </ion-loading>
  <ion-page>
    <ion-header class="attachment-header">
      <ion-toolbar id="header-toolbar">
        <ion-buttons slot="start">
          <ion-back-button text="" @click="handleModalClose()" default-href="" />
        </ion-buttons>
        <div class="title-container">
          <div id="header-title">{{ attachmentData.name }}</div>
          <div id="header-date">{{ attachmentData.date }}</div>
        </div>
        <ion-buttons slot="end">
          <ion-button v-if="isPreviewing" @click="handleDownloadAttachment()">
            <ion-img :src="svg_download" />
          </ion-button>
          <ion-button v-else @click="handleDeleteAttachment()">
            <ion-img :src="trashIcon" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="attachment-container" ref="messageDetail">
      <ion-slides
        class="images-slider"
        pager="true"
        :options="slideOpts"
        ref="attachmentSlides"
        @ionSlideWillChange="handleSlideChange"
      >
        <ion-slide v-for="(attachmentFile, index) in attachments" :key="index">
          <VuePdfEmbed v-if="!attachmentData.isImage" :source="attachmentFile.data" :page="1" />
          <img v-else :src="attachmentFile.data" />
        </ion-slide>
      </ion-slides>
      <div class="attachment-text-container" v-if="isPreviewing">
        <p id="attachment-caption">
          {{ attachmentData.caption }}
        </p>
      </div>
      <div v-else class="send-container">
        <ion-item id="attachment-thumbnail">
          <ion-thumbnail
            class="image-thumbnail"
            v-for="(attachmentFile, index) in attachments"
            :key="index"
            @click="goToAttachment(index)"
          >
            <div v-if="!attachmentData.isImage" class="pdf-canvas-container">
              <VuePdfEmbed :source="attachmentFile.data" :page="1" />
              <div
                v-bind:class="currentActiveIndex === index ? 'pdf-active-border' : 'pdf-inactive-border'"
              />
            </div>
            <img
              v-else
              :src="attachmentFile.data"
              v-bind:class="currentActiveIndex === index ? 'image-active' : 'image-inactive'"
            />
          </ion-thumbnail>
        </ion-item>
        <div v-if="mentionedList.length > 0" class="mentioned-users-container">
          <ion-label
            v-for="(mentionedUser, index) in mentionedList"
            @click="onClickMentionedUsers(mentionedUser)"
            class="mentioned-user-item"
            :key="index"
          >
            {{ mentionedUser.nickname }}
          </ion-label>
        </div>
        <ion-item class="send-message-container">
          <ion-textarea
            id="attachedMessageInput"
            v-model="newMessage"
            @ion-change="onChangeMessageText"
            rows="1"
            color="black"
            placeholder="Type message here"
            class="message-attachment-input"
          />
          <ion-icon id="send-icon" @click="sendMessage()" slot="end" :icon="sendSharp" size="large" />
        </ion-item>
      </div>
    </ion-content>
    <ion-toast
      :is-open="showToast"
      :message="toastText"
      css-class="toastMessage"
      @onDidDismiss="showToast = false"
    />
  </ion-page>
</template>

<script>
import {
  IonButton,
  IonButtons,
  IonBackButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonLoading,
  IonPage,
  IonSlide,
  IonSlides,
  IonTextarea,
  IonThumbnail,
  IonToast,
  IonToolbar,
  isPlatform,
  useBackButton
} from '@ionic/vue';
import { sendSharp } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { arrowBackOutline, downloadOutline, trashOutline } from 'ionicons/icons';
import VuePdfEmbed from 'vue-pdf-embed';
import { Filesystem, Directory } from '@capacitor/filesystem';
import svg_download from '@/assets/images/download.svg';
import trashIcon from '@/assets/icons/shared/trash.svg';

export default defineComponent({
  name: 'AttachmentPreview',
  components: {
    IonButton,
    IonButtons,
    IonBackButton,
    IonContent,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonLoading,
    IonPage,
    IonSlide,
    IonSlides,
    IonTextarea,
    IonThumbnail,
    IonToast,
    IonToolbar,
    VuePdfEmbed
  },
  computed: {},
  data() {
    return {
      currentActiveIndex: 0,
      mentionedList: [],
      isSending: false,
      showToast: false,
      toastText: '',
      newMessage: ''
    };
  },
  methods: {
    closeModal() {
      this.newMessage = '';
      this.isSending = false;
      this.attachments = [];
      if (this.handleModalClose) {
        this.handleModalClose();
      }
    },
    goToAttachment(index = 0) {
      this.currentActiveIndex = index;
      this.$refs.attachmentSlides.$el.slideTo(index);
    },
    async handleDeleteAttachment() {
      if (this.onAttachmentDelete) {
        const slider = this.$refs.attachmentSlides.$el;
        const currentImageIndex = await slider.getActiveIndex();
        this.attachments = this.attachments.filter((curr, idx) => idx !== currentImageIndex);
        await this.onAttachmentDelete(currentImageIndex);

        if (this.attachments.length > 0) {
          await slider.update();
        } else {
          this.handleModalClose();
        }
      }
    },
    async handleDownloadAttachment() {
      if (this.showToast) {
        return;
      }
      let attachment = this.attachments[0];
      if (this.attachmentData.isImage) {
        const slider = this.$refs.attachmentSlides.$el;
        const currentImageIndex = await slider.getActiveIndex();
        attachment = this.attachments.find((src, idx) => (!src ? false : idx === currentImageIndex));
      }

      if (attachment !== null) {
        attachment = this.attachments[0];
      }
      if (attachment) {
        if (isPlatform('ios') || isPlatform('android')) {
          this.downloadImage(attachment.data);
        } else {
          window.open(attachment.data);
        }
      }
    },
    async downloadImage(url) {
      this.showToast = true;
      this.toastText = 'Downloading...';
      // helper function
      const convertBlobToBase64 = (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onerror = reject;
          reader.onload = () => {
            resolve(reader.result);
          };
          reader.readAsDataURL(blob);
        });

      let smartUrl = url.split('?')[0];
      const fileName = smartUrl.split('/').pop();
      // retrieve the image
      const response = await fetch(url);
      // convert to a Blob
      const blob = await response.blob();
      // convert to base64 data, which the Filesystem plugin requires
      const base64Data = await convertBlobToBase64(blob);

      try {
        this.showToast = false;
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data,
          directory: Directory.Documents
        });
        this.showToast = true;
        this.toastText = 'File Saved';
        setTimeout(() => {
          this.showToast = false;
        }, 2000);
      } catch (e) {
        console.error('Unable to write file', e);
        this.showToast = true;
        this.toastText = 'Failed';
        setTimeout(() => {
          this.showToast = false;
        }, 2000);
      }
    },
    async handleSlideChange() {
      this.currentActiveIndex = await this.$refs.attachmentSlides.$el.getActiveIndex();
    },
    async isThumbnailActive(index) {
      const slider = await this.$refs.attachmentSlides;
      return !slider ? false : slider.$el.getActiveIndex() === index;
    },
    async onClickMentionedUsers(selectedMentionUser) {
      const reversedMessage = this.newMessage.split('').reverse().join('');
      let indexAt = reversedMessage.indexOf('@');
      if (indexAt > -1) {
        indexAt = reversedMessage.length - indexAt - 1;
        this.newMessage = this.newMessage.substring(0, indexAt + 1) + selectedMentionUser.nickname;
      }
      const textareaRef = await document.getElementById('attachedMessageInput').getInputElement();
      textareaRef.focus();
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
    async sendMessage() {
      this.isSending = true;
      await this.handleMessageSend(this.newMessage, () => {
        this.newMessage = '';
        this.isSending = false;
      });
    }
  },
  props: {
    attachmentFiles: Array,
    currentUserId: String,
    memberList: Array,
    handleModalClose: Function,
    handleMessageSend: Function,
    isPreviewing: Boolean,
    attachmentData: Object,
    onAttachmentDelete: Function
  },
  setup(props) {
    useBackButton(100, (processNextHandler) => {
      props.handleModalClose();
      processNextHandler();
    });
    const slideOpts = {
      initialSlide: 0,
      speed: 400
    };

    return {
      attachments: props.attachmentFiles,
      arrowBackOutline,
      downloadOutline,
      sendSharp,
      slideOpts,
      trashOutline,
      trashIcon,
      svg_download
    };
  },
  mounted() {
    this.showToast = false;
  }
});
</script>
<style scoped lang="scss">
@import 'attachment.preview.module';
</style>

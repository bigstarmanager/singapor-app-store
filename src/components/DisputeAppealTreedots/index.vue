<template>
  <ion-page>
    <ion-header>
      <ion-label class="view-history-title">{{ $t('order.appeal_to_treedots') }}</ion-label>
      <img @click="onClose" src="/assets/images/SWM-icons-outline-cross.svg" alt="close" />
    </ion-header>
    <ion-content>
      <ion-label class="description-label">{{ $t('order.reason_for_appeal') }}</ion-label>
      <ion-textarea
        v-model="reasonText"
        rows="3"
        :placeholder="$t('order.appeal_reason_input_placeholder')"
        class="reason-text-input"
      />
      <p class="description-label">{{ $t('order.attachment') }}</p>
      <ion-row>
        <ion-thumbnail class="image-thumbnail" v-for="(attachmentFile, index) in attachments" :key="index">
          <ion-img :src="attachmentFile.data" class="attachment-image" />
        </ion-thumbnail>
        <div class="add-attachment-button" @click="onAddAttachment">
          <ion-label class="add-attachment-plus">+</ion-label>
        </div>
      </ion-row>
      <ion-input hidden ref="attachmentInput" type="file" @input="onSelectFile" />
      <div class="appeal-reason-alert-container">
        <ion-label class="appeal-reason-alert-text">
          {{ $t('order.appeal_description') }}
        </ion-label>
      </div>
    </ion-content>
    <ion-footer>
      <ion-button expand="block" :disabled="isDisabledSubmit" @click="onSubmitAppeal">
        {{ $t('order.submit_appeal') }}
      </ion-button>
    </ion-footer>
  </ion-page>
</template>

<script>
import { defineComponent } from 'vue';
import {
  IonButton,
  IonContent,
  IonFooter,
  IonInput,
  IonImg,
  IonThumbnail,
  IonPage,
  IonHeader,
  IonLabel,
  IonTextarea,
  IonRow,
  alertController,
  toastController
} from '@ionic/vue';
import { ref, watch } from 'vue';

export default defineComponent({
  name: 'DisputeAppealTreedots',
  components: {
    IonButton,
    IonContent,
    IonFooter,
    IonInput,
    IonImg,
    IonThumbnail,
    IonPage,
    IonHeader,
    IonLabel,
    IonTextarea,
    IonRow
  },
  props: {
    dispute: Object
  },
  methods: {
    async onAddAttachment() {
      this.$refs.attachmentInput.$el
        .getInputElement()
        .then((input) => {
          input.accept = 'image/*';
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
            const toast = await toastController.create({
              message: this.$t('image_lager_than_5mb'),
              duration: 2000,
              cssClass: 'toastMessage'
            });
            await toast.present();
            await toast.onDidDismiss();
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
    },
    async onSubmitAppeal() {
      const alert = await alertController.create({
        cssClass: 'cancel-issue-confirm .alert-wrapper',
        header: 'Are you sure want to submit this appeal?',
        buttons: [
          {
            text: 'CANCEL',
            role: 'cancel'
          },
          {
            text: 'SUBMIT',
            handler: () => {
              const item = {
                id: this.dispute.id,
                reason: this.reasonText,
                attachments: this.attachments
              };
              this.$emit('submit-appeal', { item });
            }
          }
        ]
      });
      return alert.present();
    }
  },
  setup(props, { emit }) {
    const attachments = ref([]);
    const reasonText = ref('');
    const isDisabledSubmit = ref(true);
    watch(
      () => reasonText.value === '' || attachments.value.length === 0,
      (val) => (isDisabledSubmit.value = val)
    );

    const onClose = () => {
      emit('close-appeal-treedots');
    };

    return {
      onClose,
      attachments,
      reasonText,
      isDisabledSubmit
    };
  }
});
</script>

<style scoped lang="scss">
@import 'DisputeAppealTreedots.scss';
</style>

<template>
  <ion-content>
    <div class="name-modal-dialog padding-x padding-y">
      <ion-row>
        <ion-col></ion-col>
        <ion-col size="8" class="title-modal"
          ><p>{{ $t('last_name') }}</p></ion-col
        >
        <ion-col class="close-icon">
          <ion-icon @click="dismissModal" class="close-icon" :icon="closeOutline" />
        </ion-col>
      </ion-row>
      <ion-item class="name-item">
        <ion-label position="floating">{{ $t('last_name') }}</ion-label>
        <ion-input name="lastName" :value="newLastName" type="text" v-model="newLastName"></ion-input>
      </ion-item>
      <!-- <ion-text>
        <p v-if="newLastName.length <= 2" class="error-text">{{ $t('validation.first_name') }}</p>
      </ion-text> -->
      <ion-button
        :disabled="newLastName.length < 1"
        type="submit"
        @click="onSave(newLastName)"
        class="manageBtn"
        expand="block"
        fill="solid"
      >
        <p>{{ $t('save') }}</p>
      </ion-button>
    </div>
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonInput,
  IonButton,
  IonItem,
  IonRow,
  IonCol,
  IonIcon,
  IonLabel,
  toastController
} from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { defineComponent, inject } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { updateProfile } from '@/services/shared/graphql';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { sb } from '@/services/shared/helper/sendbird';

export default defineComponent({
  name: 'FirstNameModal',

  data() {
    return {
      content: 'Content',
      isLoading: false,
      newLastName: '',
      user: null
    };
  },

  components: {
    IonContent,
    IonInput,
    IonButton,
    IonItem,
    IonRow,
    IonCol,
    IonIcon,
    IonLabel
  },

  setup() {
    const router = useRouter();
    const store = useStore();
    const storage = inject('$storage');
    const { mutate: updateLastNameUser } = useMutation(updateProfile);

    return {
      closeOutline,
      store,
      router,
      storage,
      updateLastNameUser
    };
  },

  async created() {
    this.user = inject('$storage')
      .getUser()
      .then((res) => {
        this.user = res;
      });
  },

  methods: {
    dismissModal(newLastName) {
      if (newLastName.length >= 0) {
        this.$emit('close-modal', newLastName);
      } else {
        this.$emit('close-modal', (newLastName = this.user.last_name));
      }
    },

    onSave(newLastName) {
      this.isLoading = true;
      this.updateLastNameUser({
        lastName: this.newLastName
      })
        .then((res) => {
          this.store.dispatch('b2c/setUpdateProfile', res.data.updateProfile);
          this.user = { ...this.user, last_name: newLastName };
          this.dismissModal(newLastName);
          const newNickName = this.user.first_name + ' ' + newLastName;
          sb.updateCurrentUserInfo(newNickName, null, (user, error) => {
            if (error) {
              console.error(error);
            }
          });
          this.openSuccessToast();
        })
        .catch((e) => {
          console.error(e);
          this.openFailedToast();
        });
      this.isLoading = false;
    },
    async openSuccessToast() {
      const toast = await toastController.create({
        message: `${this.$t('last_name_updated')}`,
        duration: 2500,
        cssClass: 'success-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    async openFailedToast() {
      const toast = await toastController.create({
        message: `${this.$t('last_name_failed')}`,
        duration: 2500,
        cssClass: 'failed-toast',
        position: 'bottom'
      });
      return toast.present();
    }
  }
});
</script>

<style scoped lang="scss">
@import 'modal-dialog.module';
</style>

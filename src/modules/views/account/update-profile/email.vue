<template>
  <ion-content>
    <div class="name-modal-dialog padding-x padding-y">
      <ion-row>
        <ion-col></ion-col>
        <ion-col size="8" class="title-modal"
          ><p>{{ $t('email') }}</p></ion-col
        >
        <ion-col class="close-icon">
          <ion-icon @click="dismissModal" class="close-icon" :icon="closeOutline" />
        </ion-col>
      </ion-row>
      <vee-form :validation-schema="userSchema">
        <ion-item class="email-item">
          <ion-label class="label-text" position="stacked">{{ $t('new_email') }}</ion-label>
          <ion-input
            v-model="newEmail"
            :value="newEmail"
            type="email"
            name="newEmail"
            @ionInput="onInputChange"
          ></ion-input>
        </ion-item>
        <ion-text>
          <p v-if="errors.newEmail" class="error-text">{{ $t('validation.email') }}</p>
          <div v-else class="hide-space"></div>
        </ion-text>
        <ion-item class="email-item-bottom">
          <ion-label class="label-text" position="stacked">{{ $t('confirm_email') }}</ion-label>
          <ion-input
            v-model="confirmNewEmail"
            :value="confirmNewEmail"
            type="email"
            name="confirmNewEmail"
          ></ion-input>
        </ion-item>
        <ion-text>
          <p v-if="errors.confirmNewEmail || confirmNewEmail !== newEmail" class="error-text">
            {{ $t('validation.email') }}
          </p>
          <div v-else class="hide-space"></div>
        </ion-text>
        <ion-button
          @click="onSave(confirmNewEmail)"
          :disabled="confirmNewEmail !== newEmail || errors.confirmNewEmail || newEmail == null"
          class="manageBtn"
          expand="block"
          fill="solid"
        >
          <p>{{ $t('save') }}</p>
        </ion-button>
      </vee-form>
    </div>
  </ion-content>
</template>

<script>
import {
  IonContent,
  IonInput,
  IonRow,
  IonCol,
  IonIcon,
  IonItem,
  IonLabel,
  IonButton,
  IonText,
  toastController
} from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { getRegexEmail } from '@/services/shared/helper/helper';
import { defineComponent, inject } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { updateProfile } from '@/services/shared/graphql';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useForm, useField, Form as VeeForm } from 'vee-validate';

export default defineComponent({
  name: 'EmailModal',

  data() {
    return {
      content: 'Content',
      validEmail: false,
      getRegexEmail,
      user: null,
      update: {
        newEmail: false,
        confirmNewEmail: false
      }
    };
  },
  components: {
    IonContent,
    IonInput,
    IonRow,
    IonCol,
    IonIcon,
    IonItem,
    IonLabel,
    IonButton,
    IonText,
    VeeForm
  },

  setup() {
    const router = useRouter();
    const store = useStore();
    const storage = inject('$storage');
    const { mutate: updateEmailUser } = useMutation(updateProfile);

    // Define a validation schema
    const userSchema = {
      newEmail(val) {
        if (!val) {
          return 'validation.email';
        }
        // if the field is not a valid email
        if (!getRegexEmail().test(val)) {
          return 'validation.email';
        }
        return true;
      },

      confirmNewEmail(val) {
        if (!val) {
          return 'validation.email';
        }
        return true;
      }
    };

    // Create a form context with the validation schema
    const { errors, validate } = useForm({
      validationSchema: userSchema
    });

    const { value: newEmail } = useField('newEmail');
    const { value: confirmNewEmail } = useField('confirmNewEmail');

    return {
      closeOutline,
      store,
      router,
      storage,
      updateEmailUser,
      errors,
      userSchema,
      validate,
      newEmail,
      confirmNewEmail
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
    dismissModal(confirmNewEmail) {
      if (confirmNewEmail.length > 0) {
        this.$emit('close-modal', confirmNewEmail);
      } else {
        this.$emit('close-modal', (confirmNewEmail = this.user.email));
      }
    },

    async onSave(confirmNewEmail) {
      this.isLoading = true;
      for (const key in this.update) {
        this.update[key] = true;
      }
      const { valid } = await this.validate();
      if (valid) {
        this.updateEmailUser({
          email: this.confirmNewEmail
        })
          .then((res) => {
            this.store.dispatch('b2c/setUpdateProfile', res.data.updateProfile);
            this.user = { ...this.user, email: confirmNewEmail };
            this.dismissModal(confirmNewEmail);
            this.openSuccessToast();
          })
          .catch((e) => {
            console.error(e);
            this.openFailedToast();
          });

        for (const key in this.update) {
          this.update[key] = false;
        }
      }
      this.isLoading = false;
    },

    onInputChange(event) {
      this.update[event.target.name] = true;
    },

    async openSuccessToast() {
      const toast = await toastController.create({
        message: `${this.$t('email_updated')}`,
        duration: 2500,
        cssClass: 'success-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    async openFailedToast() {
      const toast = await toastController.create({
        message: `${this.$t('email_failed')}`,
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

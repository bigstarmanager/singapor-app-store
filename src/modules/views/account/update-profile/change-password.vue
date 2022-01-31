<template>
  <ion-content>
    <div class="name-modal-dialog padding-x padding-y">
      <ion-row>
        <ion-col></ion-col>
        <ion-col size="8" class="title-modal"
          ><p>{{ $t('change_password') }}</p></ion-col
        >
        <ion-col class="close-icon">
          <ion-icon @click="dismissModal" class="close-icon" :icon="closeOutline" />
        </ion-col>
      </ion-row>
      <vee-form :validation-schema="userSchema">
        <ion-item class="name-item">
          <ion-label class="label-text" position="stacked">{{ $t('new_password') }}</ion-label>
          <ion-input
            name="newPassword"
            v-model="newPassword"
            :type="seePass == true ? 'text' : 'password'"
            @ionInput="onInputChange"
          ></ion-input>
          <ion-icon
            v-if="seePass !== true"
            slot="end"
            @click="seePassword()"
            class="close-icon"
            :icon="eyeOutline"
          />
          <ion-icon v-else slot="end" @click="hidePassword()" class="close-icon" :icon="eyeOffOutline" />
        </ion-item>
        <ion-text>
          <p v-if="errors.newPassword" class="error-text">{{ $t('validation.password') }}</p>
          <div v-else class="hide-space"></div>
        </ion-text>
        <ion-item class="name-item">
          <ion-label class="label-text" position="stacked">{{ $t('confirm_password') }}</ion-label>
          <ion-input
            name="confirmNewPassword"
            v-model="confirmNewPassword"
            :type="seeConfirmPass == true ? 'text' : 'password'"
            @ionInput="onInputChange"
          ></ion-input>
          <ion-icon
            v-if="seeConfirmPass !== true"
            slot="end"
            @click="seeConfirmPassword()"
            class="close-icon"
            :icon="eyeOutline"
          />
          <ion-icon
            v-else
            slot="end"
            @click="hideConfirmPassword()"
            class="close-icon"
            :icon="eyeOffOutline"
          />
        </ion-item>
        <ion-text>
          <p v-if="errors.confirmNewPassword || confirmNewPassword !== newPassword" class="error-text">
            {{ $t('validation.confirm_password') }}
          </p>
          <div v-else class="hide-space"></div>
        </ion-text>
        <ion-button
          :disabled="newPassword == null || errors.confirmNewPassword || confirmNewPassword !== newPassword"
          @click="onSave"
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
import { closeOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { defineComponent, inject } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { updatePassword } from '@/services/shared/graphql';
import { cipher } from '../../../../services/shared/helper/cipher';
import { useStore } from 'vuex';
import { useForm, useField, Form as VeeForm } from 'vee-validate';

export default defineComponent({
  name: 'PasswordModal',

  setup() {
    const store = useStore();
    const storage = inject('$storage');
    const { mutate: updatePasswordUser } = useMutation(updatePassword);

    const userSchema = {
      newPassword(val) {
        if (!val) {
          return 'validation.password';
        }
        if (val.length < 6) {
          return 'validation.password';
        }
        return true;
      },

      confirmNewPassword(val) {
        if (!val) {
          return 'validation.password';
        }
        return true;
      }
    };

    // Create a form context with the validation schema
    const { errors, validate } = useForm({
      validationSchema: userSchema
    });

    const { value: newPassword } = useField('newPassword');
    const { value: confirmNewPassword } = useField('confirmNewPassword');

    return {
      closeOutline,
      eyeOutline,
      eyeOffOutline,
      store,
      storage,
      updatePasswordUser,
      userSchema,
      errors,
      validate,
      newPassword,
      confirmNewPassword
    };
  },

  async created() {
    this.user = inject('$storage')
      .getUser()
      .then((res) => {
        this.user = res;
      });
  },

  data() {
    return {
      content: 'Content',
      update: {
        newPassword: false,
        confirmNewPassword: false
      },
      isLoading: false,
      user: null,
      seePass: false,
      hidePass: false,
      seeConfirmPass: false,
      hideConfirmPass: false,
      encrypt: cipher()
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
  methods: {
    dismissModal() {
      this.$emit('close-modal');
    },

    async onSave() {
      this.isLoading = true;
      for (const key in this.update) {
        this.update[key] = true;
      }
      const { valid } = await this.validate();
      if (valid) {
        this.updatePasswordUser({
          userId: this.user.id,
          password: this.encrypt(this.confirmNewPassword)
        })
          .then((res) => {
            if (this.newPassword === this.confirmNewPassword) {
              this.user = { ...this.user, password: this.encrypt(this.confirmNewPassword) };
              this.store.dispatch('b2c/setUser', res.data.updatePassword);
              this.store.commit('b2c/setUser', this.user);
              this.storage.setUser(this.user);
              this.dismissModal();
              this.openSuccessToast();
            }
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

    async getUserStorage() {
      const existingUser = await this.storage.getUser();
      this.user = existingUser;
    },

    onInputChange(event) {
      this.update[event.target.name] = true;
    },

    seePassword() {
      this.seePass = true;
      this.hidePass = false;
    },

    hidePassword() {
      this.hidePass = true;
      this.seePass = false;
    },

    seeConfirmPassword() {
      this.seeConfirmPass = true;
      this.hideConfirmPass = false;
    },

    hideConfirmPassword() {
      this.hideConfirmPass = true;
      this.seeConfirmPass = false;
    },

    async openFailedToast() {
      const toast = await toastController.create({
        message: `${this.$t('password_failed')}`,
        duration: 2500,
        cssClass: 'failed-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    async openSuccessToast() {
      const toast = await toastController.create({
        message: `${this.$t('password_updated')}`,
        duration: 2500,
        cssClass: 'success-toast',
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

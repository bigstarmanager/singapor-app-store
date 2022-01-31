<template>
  <ion-content>
    <div class="padding-x padding-y">
      <ion-row>
        <ion-col></ion-col>
        <ion-col class="title-modal"
          ><p>{{ $t('first_name') }}</p></ion-col
        >
        <ion-col class="close-icon">
          <ion-icon @click="dismissModal" class="close-icon" :icon="closeOutline" />
        </ion-col>
      </ion-row>
      <vee-form :validation-schema="userSchema">
        <ion-item class="name-item">
          <ion-label position="floating">{{ $t('first_name') }}</ion-label>
          <ion-input
            name="newFirstName"
            :value="newFirstName"
            type="text"
            v-model="newFirstName"
            @ionInput="onInputChange"
          ></ion-input>
        </ion-item>
        <ion-text>
          <p v-if="errors.newFirstName" class="error-text">{{ $t('validation.first_name') }}</p>
          <div v-else class="hide-space"></div>
        </ion-text>
        <ion-button
          type="submit"
          @click="onSave(newFirstName)"
          class="manageBtn"
          expand="block"
          fill="solid"
          :disabled="errors.newFirstName || update.newFirstName == false"
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
  IonButton,
  IonItem,
  IonRow,
  IonCol,
  IonIcon,
  IonText,
  IonLabel,
  toastController
} from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { defineComponent, inject } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { updateProfile } from '@/services/shared/graphql';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useForm, useField, Form as VeeForm } from 'vee-validate';
import { sb } from '@/services/shared/helper/sendbird';

export default defineComponent({
  name: 'FirstNameModal',

  data() {
    return {
      content: 'Content',
      isLoading: false,
      update: {
        newFirstName: false
      },
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
    IonText,
    IonLabel,
    VeeForm
  },

  setup() {
    const router = useRouter();
    const store = useStore();
    const storage = inject('$storage');
    const { mutate: updateFirstNameUser } = useMutation(updateProfile);

    const userSchema = {
      newFirstName(val) {
        if (!val) {
          return 'validation.first_name';
        }
        if (val.length <= 3) {
          return 'validation.first_name';
        }
        return true;
      }
    };

    // Create a form context with the validation schema
    const { errors, validate } = useForm({
      validationSchema: userSchema
    });

    const { value: newFirstName } = useField('newFirstName');

    return {
      closeOutline,
      store,
      router,
      storage,
      updateFirstNameUser,
      userSchema,
      errors,
      validate,
      newFirstName
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
    dismissModal(newFirstName) {
      if (newFirstName.length > 1) {
        this.$emit('close-modal', newFirstName);
      } else {
        this.$emit('close-modal', (newFirstName = this.user.first_name));
      }
    },

    async onSave(newFirstName) {
      this.isLoading = true;
      for (const key in this.update) {
        this.update[key] = true;
      }
      const { valid } = await this.validate();
      if (valid) {
        this.updateFirstNameUser({
          firstName: this.newFirstName
        })
          .then((res) => {
            this.store.dispatch('b2c/setUpdateProfile', res.data.updateProfile);
            this.user = { ...this.user, first_name: newFirstName };
            this.dismissModal(newFirstName);
            const newNickName = newFirstName + ' ' + this.user.last_name;
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
        message: `${this.$t('first_name_updated')}`,
        duration: 2500,
        cssClass: 'success-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    async openFailedToast() {
      const toast = await toastController.create({
        message: `${this.$t('first_name_failed')}`,
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

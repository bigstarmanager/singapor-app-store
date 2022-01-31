<template>
  <ion-content>
    <div class="name-modal-dialog padding-x padding-y">
      <ion-row>
        <ion-col></ion-col>
        <ion-col class="title-modal"
          ><p>{{ $t('phone') }}</p></ion-col
        >
        <ion-col class="close-icon">
          <ion-icon @click="dismissModal" class="close-icon" :icon="closeOutline" />
        </ion-col>
      </ion-row>
      <vee-form :validation-schema="userSchema">
        <ion-row>
          <ion-col size="5">
            <ion-item class="name-item">
              <ion-label class="label-text" position="stacked">{{ $t('country_code') }}</ion-label>
              <ion-select v-model="countryCode" placeholder="+65">
                <ion-select-option value="65">
                  <ion-row>
                    <!-- <ion-icon class="ionIcon" :icon="singaporeFlag" />
                  <div class="margin-x">Singapore </div> -->
                    <div>+65</div>
                  </ion-row>
                </ion-select-option>
                <ion-select-option value="60">
                  <ion-row>
                    <!-- <ion-icon class="ionIcon" :icon="malaysiaFlag" />
                  <div class="margin-x">Malaysia </div> -->
                    <div>+60</div>
                  </ion-row>
                </ion-select-option>
                <ion-select-option v-if="env !== 'production'" value="62">
                  <ion-row>
                    <!-- <ion-icon class="ionIcon" :icon="singaporeFlag" />
                  <div class="margin-x"> </div> -->
                    <div>+62</div>
                  </ion-row>
                </ion-select-option>
              </ion-select>
            </ion-item>
            <!-- <ion-text>
            <p v-if="countryCode.length < 1" class="error-text">{{ $t('validation.country_code') }}</p>
          </ion-text> -->
          </ion-col>
          <ion-col size="7">
            <ion-item class="name-item">
              <ion-label class="label-text" position="stacked">{{ $t('new_phone') }}</ion-label>
              <ion-input
                name="newPhone"
                v-model="newPhone"
                type="number"
                @ionInput="onInputChange"
              ></ion-input>
            </ion-item>
            <ion-text>
              <p v-if="errors.newPhone" class="error-text">{{ $t('validation.phone') }}</p>
              <div v-else class="hide-space"></div>
            </ion-text>
          </ion-col>
        </ion-row>

        <ion-button
          :disabled="errors.newPhone || update.newPhone == false"
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
  IonSelect,
  IonText,
  IonSelectOption,
  toastController
} from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { defineComponent, inject } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { updateProfile } from '@/services/shared/graphql';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import singaporeFlag from '@/assets/icons/shared/singapore_flag.png';
import malaysiaFlag from '@/assets/icons/shared/malaysia_flag.png';
import { useForm, useField, Form as VeeForm } from 'vee-validate';

export default defineComponent({
  name: 'PhoneModal',

  setup() {
    const router = useRouter();
    const store = useStore();
    const storage = inject('$storage');
    const { mutate: updatePhoneUser } = useMutation(updateProfile);
    const env = process.env.VUE_APP_ENV;

    const userSchema = {
      newPhone(val) {
        if (!val) {
          return 'validation.phone';
        }
        if (val.length < 5) {
          return 'validation.phone';
        }
        return true;
      }
    };

    const { errors, validate } = useForm({
      validationSchema: userSchema
    });

    const { value: newPhone } = useField('newPhone');

    return {
      closeOutline,
      singaporeFlag,
      malaysiaFlag,
      store,
      router,
      storage,
      updatePhoneUser,
      userSchema,
      errors,
      validate,
      newPhone,
      env
    };
  },
  data() {
    return {
      content: 'Content',
      fullNewPhone: '',
      countryCode: '65',
      update: {
        newPhone: false
      },
      user: null
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
    IonSelect,
    IonText,
    IonSelectOption,
    VeeForm
  },

  async created() {
    inject('$storage')
      .getUser()
      .then((res) => {
        this.user = res;
      });
  },

  methods: {
    dismissModal(fullNewPhone) {
      if (fullNewPhone?.length > 4) {
        this.$emit('close-modal', fullNewPhone);
      } else {
        this.$emit('close-modal', (fullNewPhone = this.user.mobile));
      }
    },

    async onSave() {
      this.isLoading = true;
      for (const key in this.update) {
        this.update[key] = true;
      }
      const { valid } = await this.validate();
      const fullPhone = this.countryCode + this.newPhone;
      if (valid) {
        this.updatePhoneUser({
          mobile: fullPhone
        })
          .then((res) => {
            this.store.dispatch('b2c/setUpdateProfile', res.data.updateProfile);
            this.user = { ...this.user, mobile: fullPhone };
            this.dismissModal(fullPhone);
            this.openSuccessToast();
          })
          .catch(() => {
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
        message: `${this.$t('phone_updated')}`,
        duration: 2500,
        cssClass: 'success-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    async openFailedToast() {
      const toast = await toastController.create({
        message: `${this.$t('phone_failed')}`,
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

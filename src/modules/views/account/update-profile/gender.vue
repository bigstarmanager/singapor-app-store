<template>
  <ion-content>
    <div class="name-modal-dialog padding-x padding-y">
      <ion-row>
        <ion-col></ion-col>
        <ion-col size="8" class="title-modal"
          ><p>{{ $t('gender') }}</p></ion-col
        >
        <ion-col class="close-icon">
          <ion-icon @click="dismissModal()" class="close-icon" :icon="closeOutline" />
        </ion-col>
      </ion-row>
      <ion-item class="name-item" @click="selectedFemale">
        <ion-input slot="start" readonly="true" :color="female_gender == true ? 'primary' : 'medium'">{{
          $t('female')
        }}</ion-input>
        <ion-icon
          slot="end"
          v-if="female_gender == true"
          color="primary"
          style="font-size: 22px"
          :icon="checkmarkOutline"
        />
      </ion-item>
      <ion-item class="name-item" @click="selectedMale">
        <ion-input slot="start" readonly="true" :color="male_gender == true ? 'primary' : 'medium'">{{
          $t('male')
        }}</ion-input>
        <ion-icon
          slot="end"
          v-if="male_gender == true"
          color="primary"
          style="font-size: 22px"
          :icon="checkmarkOutline"
        />
      </ion-item>
      <ion-item class="email-item-bottom" @click="selectedOther">
        <ion-input slot="start" readonly="true" :color="other == true ? 'primary' : 'medium'">{{
          $t('other')
        }}</ion-input>
        <ion-icon
          slot="end"
          v-if="other == true"
          color="primary"
          style="font-size: 22px"
          :icon="checkmarkOutline"
        />
      </ion-item>
      <ion-button
        :disabled="newGender == null && other !== true"
        @click="onSave(newGender)"
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
  IonRow,
  IonCol,
  IonIcon,
  IonItem,
  IonButton,
  toastController
} from '@ionic/vue';
import { closeOutline, checkmarkOutline } from 'ionicons/icons';
import { defineComponent, inject } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { updateProfile } from '@/services/shared/graphql';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'GenderModal',

  setup() {
    const router = useRouter();
    const store = useStore();
    const storage = inject('$storage');
    const { mutate: updateGenderUser } = useMutation(updateProfile);
    return {
      closeOutline,
      checkmarkOutline,
      store,
      router,
      storage,
      updateGenderUser
    };
  },
  data() {
    return {
      content: 'Content',
      newGender: null,
      male_gender: false,
      female_gender: false,
      other: false,
      user: null
    };
  },
  components: { IonContent, IonInput, IonRow, IonCol, IonIcon, IonItem, IonButton },

  async created() {
    this.user = inject('$storage')
      .getUser()
      .then((res) => {
        this.user = res;
      });
  },

  methods: {
    dismissModal(newGender) {
      if (newGender != null) {
        this.$emit('close-modal', newGender);
      } else {
        this.$emit('close-modal', (newGender = this.user.gender));
      }
    },

    onSave(newGender) {
      this.isLoading = true;
      this.updateGenderUser({
        gender: this.newGender
      })
        .then((res) => {
          this.store.dispatch('b2c/setUpdateProfile', res.data.updateProfile);
          this.user = { ...this.user, gender: newGender };
          this.dismissModal(newGender);
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
        message: `${this.$t('gender_updated')}`,
        duration: 2500,
        cssClass: 'success-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    async openFailedToast() {
      const toast = await toastController.create({
        message: `${this.$t('gender_failed')}`,
        duration: 2500,
        cssClass: 'failed-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    async selectedFemale() {
      this.newGender = 'f';
      this.female_gender = true;
      this.male_gender = false;
      this.other = false;
    },

    async selectedMale() {
      this.newGender = 'm';
      this.male_gender = true;
      this.female_gender = false;
      this.other = false;
    },

    async selectedOther() {
      this.newGender = null;
      this.other = true;
      this.male_gender = false;
      this.female_gender = false;
    }
  }
});
</script>

<style scoped lang="scss">
@import 'modal-dialog.module';
</style>

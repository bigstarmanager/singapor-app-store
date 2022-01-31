<template>
  <add-card-failed v-if="isAddCardFailed" @close-loader="onCloseAddCardFailed" :error="errorAddCardFailed" />
  <ion-page v-else>
    <ion-header class="header ion-no-border">
      <ion-toolbar color="transparent">
        <ion-buttons slot="start">
          <ion-back-button class="backBtn" text="" default-href="/main/account"></ion-back-button>
        </ion-buttons>
        <p class="appbar-title">{{ $t('manage_account') }}</p>
      </ion-toolbar>
      <ion-toolbar color="transparent" class="subheader">
        <ion-row class="ion-align-items-center ion-justify-content-center">
          <ion-avatar class="avatar">
            <ion-img :src="avatarImage"> </ion-img>
          </ion-avatar>
          <!-- Hide Edit Profile Image until API is ready
          <ion-avatar class="editImgProfile" @click="true">
            <ion-img :src="editIcon" class="editIcon"></ion-img>
          </ion-avatar> -->
        </ion-row>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-item lines="none" detail="false" @click="setOpenFirstName(true)" class="space-top">
        <p slot="start" class="items-text">{{ $t('first_name') }}</p>
        <ion-row class="ion-align-items-center ion-justify-content-end" slot="end">
          <p class="text-profile">{{ user.first_name }}</p>
          <ion-icon class="ionIcon" :icon="chevronForward" />
        </ion-row>
      </ion-item>
      <!-- Update first name dialog -->
      <ion-modal
        :is-open="isOpenFirstNameRef"
        css-class="first-name-modal-dialog"
        @didDismiss="setOpenFirstName(false)"
      >
        <first-name-dialog @close-modal="updateFirstNameAndCloseModal"> </first-name-dialog>
      </ion-modal>
      <ion-item lines="none" detail="false" @click="setOpenLastName(true)" class="space-top">
        <p slot="start" class="items-text">{{ $t('last_name') }}</p>
        <ion-row class="ion-align-items-center ion-justify-content-end" slot="end">
          <p class="text-profile">{{ user.last_name }}</p>
          <ion-icon class="ionIcon" :icon="chevronForward" />
        </ion-row>
      </ion-item>
      <!-- Update last name dialog -->
      <ion-modal
        :is-open="isOpenLastNameRef"
        css-class="last-name-modal-dialog"
        @didDismiss="setOpenLastName(false)"
      >
        <last-name-dialog @close-modal="updateLastNameAndCloseModal"> </last-name-dialog>
      </ion-modal>
      <ion-item lines="none" detail="false" @click="setOpenEmail(true)" class="space-top">
        <p slot="start" class="items-text">{{ $t('email') }}</p>
        <ion-row class="ion-align-items-center ion-justify-content-end" slot="end">
          <p class="text-profile">{{ user.email ? hideEmail(user.email) : '-' }}</p>
          <ion-icon class="ionIcon" :icon="chevronForward" />
        </ion-row>
      </ion-item>
      <!-- Update email dialog -->
      <ion-modal :is-open="isOpenEmailRef" css-class="email-modal-dialog" @didDismiss="setOpenEmail(false)">
        <email-dialog @close-modal="updateEmailAndCloseModal"> </email-dialog>
      </ion-modal>
      <ion-item lines="none" detail="false" @click="setOpenPhone(true)" class="space-top">
        <p slot="start" class="items-text">{{ $t('phone') }}</p>
        <ion-row class="ion-align-items-center ion-justify-content-end" slot="end">
          <p class="text-profile">{{ user.mobile ? hideMobile(user.mobile) : '-' }}</p>
          <ion-icon class="ionIcon" :icon="chevronForward" />
        </ion-row>
      </ion-item>
      <!-- Update phone dialog -->
      <ion-modal :is-open="isOpenPhoneRef" css-class="phone-modal-dialog" @didDismiss="setOpenPhone(false)">
        <phone-dialog @close-modal="updatePhoneAndCloseModal"> </phone-dialog>
      </ion-modal>

      <!-- Update gender using select-option (ionic component) -->

      <ion-item lines="none" class="space-top">
        <p slot="start" class="items-text">{{ $t('gender') }}</p>
        <ion-select
          @ionChange="onSaveGender(newGender)"
          class="hide-text"
          v-model="newGender"
          :value="user.gender ? getGenderName(user.gender) : 'Not Selected'"
          interface="action-sheet"
        >
          <ion-select-option value="f">Female</ion-select-option>
          <ion-select-option value="m">Male</ion-select-option>
          <ion-select-option value="">Other</ion-select-option>
        </ion-select>
        <ion-row class="ion-align-items-center ion-justify-content-end" slot="end">
          <p class="text-profile">{{ user.gender ? getGenderName(user.gender) : 'Not Selected' }}</p>
          <ion-icon class="ionIcon" :icon="chevronForward" />
        </ion-row>
      </ion-item>

      <!-- Update gender dialog like figma design, will use this in next development -->

      <!-- <ion-item lines="none" @click="setOpenGender(true)" class="space-top">
        <p slot="start" class="items-text">{{ $t('gender') }}</p>
        <ion-row class="ion-align-items-center ion-justify-content-end" slot="end">
          <p class="text-profile">{{ user.gender ? getGenderName(user.gender) : 'Not Selected' }}</p>
          <ion-icon class="ionIcon" :icon="chevronForward" />
        </ion-row>
      </ion-item>
      <ion-modal
        :is-open="isOpenGenderRef"
        css-class="gender-modal-dialog"
        @didDismiss="setOpenGender(false)"
      >
        <gender-dialog @close-modal="updateGenderAndCloseModal"> </gender-dialog>
      </ion-modal> -->

      <!-- Update Birth date -->
      <ion-item lines="none" class="space-top">
        <p slot="start" class="items-text">{{ $t('birth_date') }}</p>
        <ion-row class="ion-align-items-center ion-justify-content-end" slot="end">
          <ion-datetime
            v-model="newBirthDate"
            class="hide-text"
            display-format="MM/DD/YYYY"
            min="1900-12-31"
            max="2007-12-31"
            @ionChange="onSaveBirthDate(newBirthDate)"
          ></ion-datetime>
          <p class="text-profile">{{ user.birth_date ? getUserDate(user.birth_date) : 'Set Birth date' }}</p>
          <ion-icon class="ionIcon" :icon="chevronForward" />
        </ion-row>
      </ion-item>
      <ion-item lines="none" @click="setOpenPassword(true)" class="space-top">
        <p slot="start" class="items-text">{{ $t('change_password') }}</p>
        <ion-row class="ion-align-items-center ion-justify-content-end" slot="end">
          <p class="text-profile">••••••••</p>
          <ion-icon class="ionIcon" :icon="chevronForward" />
        </ion-row>
      </ion-item>
      <!-- Update password dialog -->
      <ion-modal
        :is-open="isOpenPasswordRef"
        css-class="password-modal-dialog"
        @didDismiss="setOpenPassword(false)"
      >
        <password-dialog @close-modal="updatePasswordAndCloseModal"> </password-dialog>
      </ion-modal>

      <!-- Update language using select-option (ionic component) -->

      <ion-item lines="none" class="space-top">
        <p slot="start" class="items-text">{{ $t('language') }}</p>
        <ion-select
          @ionChange="saveLanguage()"
          class="hide-text"
          v-model="lang"
          :value="lang"
          interface="action-sheet"
        >
          <ion-select-option value="en-us">English</ion-select-option>
          <ion-select-option value="zh-cn">Chinese (Simplified)</ion-select-option>
          <ion-select-option value="zh-tw">Chinese (Traditional)</ion-select-option>
        </ion-select>
        <ion-row class="ion-align-items-center ion-justify-content-end" slot="end">
          <p v-if="lang == 'zh-cn'" class="text-profile">Chinese (Simplified)</p>
          <p v-else-if="lang == 'zh-tw'" class="text-profile">Chinese (Traditional)</p>
          <p v-else class="text-profile">English</p>
          <ion-icon class="ionIcon" :icon="chevronForward" />
        </ion-row>
      </ion-item>

      <!-- will use this in next development -->

      <!-- <ion-item lines="none" detail="false" @click="setOpenLanguage(true)" class="space-top">
        <p slot="start" class="items-text">{{ $t('language') }}</p>
        <ion-row class="ion-align-items-center ion-justify-content-end" slot="end">
          <p v-if="selectedLanguage == 'zh-cn'" class="text-profile">Chinese (Simplified)</p>
          <p v-else-if="selectedLanguage == 'zh-tw'" class="text-profile">Chinese (Traditional)</p>
          <p v-else class="text-profile">English</p>
          <ion-icon class="ionIcon" :icon="chevronForward" />
        </ion-row>
      </ion-item>
      
      <ion-modal
        :is-open="isOpenLanguageRef"
        css-class="language-modal-dialog"
        @didDismiss="setOpenLanguage(false)"
      >
        <language-dialog @close-modal="updateLanguageAndCloseModal"> </language-dialog>
      </ion-modal> -->
      <div class="space padding-x">
        <p slot="start">{{ $t('my_cards') }}</p>
      </div>

      <!-- Card -->
      <div class="padding-y">
        <ion-list>
          <card-list
            @remove-card="removeCard"
            @reload-card="reloadCard"
            v-for="card in cards"
            :key="card.id"
            :card="card"
          ></card-list>
          <ion-item v-if="loadCardList == true" lines="none" detail="false">
            <ion-label slot="start">
              <ion-row>
                <ion-skeleton-text animated style="width: 20%; height: 24px"></ion-skeleton-text>
                <div class="hide-space"></div>
                <ion-skeleton-text animated style="width: 25%; height: 24px"></ion-skeleton-text>
              </ion-row>
            </ion-label>
            <ion-label slot="end">
              <ion-skeleton-text animated style="width: 100%; height: 18px"></ion-skeleton-text>
            </ion-label>
          </ion-item>
          <ion-button
            color="primary"
            class="addCardBtn"
            expand="block"
            fill="solid"
            @click="setOpenCard(true)"
          >
            <div class="image-icon">
              <ion-img :src="addCardIcon" style="height: 24px"></ion-img>
            </div>
            <p class="text-item">{{ $t('cc_add_card') }}</p>
          </ion-button>
          <ion-modal
            :is-open="isOpenCardRef"
            css-class="add-card-modal-dialog"
            @didDismiss="setOpenCard(false)"
          >
            <add-new-card
              @save-card="saveCard"
              @close-modal="setOpenCard(false)"
              @open-card-failed="onOpenAddCardFailed"
            >
            </add-new-card>
          </ion-modal>
        </ion-list>
      </div>
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonImg,
  IonBackButton,
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonToolbar,
  IonPage,
  IonRow,
  IonItem,
  IonIcon,
  IonAvatar,
  IonDatetime,
  IonList,
  IonModal,
  IonSelect,
  IonLabel,
  IonSkeletonText,
  IonSelectOption,
  toastController
} from '@ionic/vue';
import { arrowBackOutline, chevronForward, alertCircleOutline } from 'ionicons/icons';
import { defineComponent, inject, ref } from 'vue';
import avatarImage from '@/assets/icons/account/avatar.png';
import editIcon from '@/assets/icons/account/edit_image.png';
import addCardIcon from '@/assets/icons/account/add_cc.svg';
import { getGenderName, hideEmail, hideMobile } from '@/services/shared/helper/helper';
import CardList from './card/CardList.vue';
import { useQuery } from '@vue/apollo-composable';
import { listCustomerCard } from '@/services/shared/graphql';
import AddNewCard from '../../../components/Cart/Checkout/PaymentOption/AddCard.vue';
import AddCardFailed from '@/components/Cart/Checkout/PaymentOption/AddCardFailed.vue';
import FirstNameDialog from './update-profile/first-name.vue';
import LastNameDialog from './update-profile/last-name.vue';
import EmailDialog from './update-profile/email.vue';
import PhoneDialog from './update-profile/phone.vue';
// import GenderDialog from './update-profile/gender.vue';
import PasswordDialog from './update-profile/change-password.vue';
//import LanguageDialog from './update-profile/change-language.vue';
import { updateLanguage } from '@/services/shared/graphql';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useMutation } from '@vue/apollo-composable';
import { updateProfile } from '@/services/shared/graphql';
import dayjs from 'dayjs';
import clevertap from '@/services/shared/helper/clevertap';

export default defineComponent({
  name: 'manage-account',
  components: {
    IonImg,
    IonBackButton,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonToolbar,
    IonPage,
    IonRow,
    IonItem,
    IonIcon,
    IonAvatar,
    IonDatetime,
    IonList,
    CardList,
    IonModal,
    IonLabel,
    IonSkeletonText,
    AddNewCard,
    AddCardFailed,
    FirstNameDialog,
    LastNameDialog,
    EmailDialog,
    PhoneDialog,
    // GenderDialog,
    PasswordDialog,
    //LanguageDialog,
    IonSelect,
    IonSelectOption
  },

  data() {
    return {
      user: null,
      //selectedLanguage: null,
      isAddCardFailed: false,
      errorAddCardFailed: '',
      newBirthDate: '',
      newGender: '',
      lang: ''
    };
  },

  setup() {
    const cards = ref([]);
    let loadCardList = ref(true);
    const { refetch: cardsRefetch, onResult: cardsResult } = useQuery(listCustomerCard);
    cardsResult((result) => {
      cards.value = result.data.listCustomerCard.data;
      loadCardList.value = false;
    });
    const router = useRouter();
    const store = useStore();
    const storage = inject('$storage');

    //Open update first name
    const isOpenFirstNameRef = ref(false);
    const setOpenFirstName = (state) => (isOpenFirstNameRef.value = state);

    //Open update last name
    const isOpenLastNameRef = ref(false);
    const setOpenLastName = (state) => (isOpenLastNameRef.value = state);

    //Open update email
    const isOpenEmailRef = ref(false);
    const setOpenEmail = (state) => (isOpenEmailRef.value = state);

    //Open update phone
    const isOpenPhoneRef = ref(false);
    const setOpenPhone = (state) => (isOpenPhoneRef.value = state);

    //Open update gender
    // const isOpenGenderRef = ref(false);
    // const setOpenGender = (state) => (isOpenGenderRef.value = state);

    //Open update password
    const isOpenPasswordRef = ref(false);
    const setOpenPassword = (state) => (isOpenPasswordRef.value = state);

    //Open update language
    // const isOpenLanguageRef = ref(false);
    // const setOpenLanguage = state => (isOpenLanguageRef.value = state);

    const { mutate: changeLanguageApp } = useMutation(updateLanguage);

    //Open add new card
    const isOpenCardRef = ref(false);
    const setOpenCard = (state) => {
      isOpenCardRef.value = state;
      state && clevertap.recordEventWithName('Click add card');
    };
    const { mutate: updateBirtAndGenderUser } = useMutation(updateProfile);
    return {
      arrowBackOutline,
      chevronForward,
      alertCircleOutline,
      avatarImage,
      editIcon,
      addCardIcon,
      getGenderName,
      hideEmail,
      hideMobile,
      cards,
      loadCardList,
      cardsRefetch,
      cardsResult,
      router,
      store,
      storage,
      setOpenFirstName,
      isOpenFirstNameRef,
      setOpenLastName,
      isOpenLastNameRef,
      setOpenEmail,
      isOpenEmailRef,
      setOpenPhone,
      isOpenPhoneRef,
      // setOpenGender,
      // isOpenGenderRef,
      setOpenPassword,
      isOpenPasswordRef,
      // setOpenLanguage,
      // isOpenLanguageRef,
      setOpenCard,
      isOpenCardRef,
      updateBirtAndGenderUser,
      changeLanguageApp
    };
  },

  async created() {
    this.user = inject('$storage')
      .getUser()
      .then((res) => {
        this.user = res;
      });
  },

  watch: {
    lang(lang) {
      this.$i18n.locale = lang;
      this.store.commit('b2c/setLang', lang);
    }
  },

  methods: {
    onOpenAddCardFailed(error) {
      this.isAddCardFailed = true;
      this.errorAddCardFailed = error;
    },
    onCloseAddCardFailed() {
      this.isAddCardFailed = false;
    },
    saveCard() {
      this.cards = {};
      this.loadCardList = true;
      this.cardsRefetch().then((result) => {
        const newCard = result.data.listCustomerCard.data[0];
        this.store.dispatch('b2c/setCard', newCard);
        this.loadCardList = false;
      });
      clevertap.recordEventWithName('Add card detail');
    },

    removeCard() {
      this.cardsRefetch().then((result) => {
        this.cards = result.data.listCustomerCard.data;
      });
      if (this.cards.length <= 2) {
        this.store.dispatch('b2c/setCard', null);
      } else {
        this.store.dispatch('b2c/setCard', this.cards);
      }
    },

    reloadCard() {
      this.cards = {};
      this.loadCardList = true;
      this.cardsRefetch().then((result) => {
        this.cards = result.data.listCustomerCard.data;
        this.loadCardList = false;
      });
    },

    async updateFirstNameAndCloseModal(newFirstName) {
      const existingUser = await this.storage.getUser();
      const updatedUser = { ...existingUser, first_name: newFirstName };
      this.user = { ...this.user, first_name: newFirstName };
      this.store.commit('shared/setUser', this.user);
      this.storage.setUser(updatedUser);
      this.setOpenFirstName(false);
    },

    async updateLastNameAndCloseModal(newLastName) {
      const existingUser = await this.storage.getUser();
      const updatedUser = { ...existingUser, last_name: newLastName };
      this.user = { ...this.user, last_name: newLastName };
      this.store.commit('shared/setUser', this.user);
      this.storage.setUser(updatedUser);
      this.setOpenLastName(false);
    },

    async updateEmailAndCloseModal(confirmNewEmail) {
      const existingUser = await this.storage.getUser();
      const updatedUser = { ...existingUser, email: confirmNewEmail };
      this.user = { ...this.user, email: confirmNewEmail };
      this.store.commit('shared/setUser', this.user);
      this.storage.setUser(updatedUser);
      this.setOpenEmail(false);
    },

    async updatePhoneAndCloseModal(fullNewPhone) {
      const existingUser = await this.storage.getUser();
      const updatedUser = { ...existingUser, mobile: fullNewPhone };
      this.user = { ...this.user, mobile: fullNewPhone };
      this.store.commit('shared/setUser', this.user);
      this.storage.setUser(updatedUser);
      this.setOpenPhone(false);
    },

    async updatePasswordAndCloseModal(confirmNewPassword) {
      const existingUser = await this.storage.getUser();
      const updatedUser = { ...existingUser, password: confirmNewPassword };
      this.user = { ...this.user, password: confirmNewPassword };
      this.store.commit('shared/setUser', this.user);
      this.storage.setUser(updatedUser);
      this.setOpenPassword(false);
    },

    // will use this in next development

    // async updateGenderAndCloseModal(newGender) {
    //   const existingUser = await this.storage.getUser();
    //   const updatedUser = { ...existingUser, gender: newGender };
    //   this.user = { ...this.user, gender: newGender };
    //   this.storage.setUser(updatedUser);
    //   this.setOpenGender(false);
    // },

    async onSaveGender(newGender) {
      this.isLoading = true;
      const existingUser = await this.storage.getUser();
      const updatedUser = { ...existingUser, gender: newGender };
      this.updateBirtAndGenderUser({
        gender: this.newGender
      })
        .then((res) => {
          this.store.dispatch('b2c/setUpdateProfile', res.data.updateProfile);
          this.user = { ...this.user, gender: newGender };
          this.existingUser;
          this.user = { ...this.user, gender: newGender };
          this.store.commit('shared/setUser', this.user);
          this.storage.setUser(updatedUser);
          this.openSuccessGenderToast();
        })
        .catch((e) => {
          console.error(e);
          this.openFailedGenderToast();
        });
      this.isLoading = false;
    },

    async onSaveBirthDate(newBirthDate) {
      this.isLoading = true;
      const existingUser = await this.storage.getUser();
      const updatedUser = { ...existingUser, birth_date: newBirthDate };
      this.updateBirtAndGenderUser({
        birthDate: this.newBirthDate
      })
        .then((res) => {
          this.store.dispatch('b2c/setUpdateProfile', res.data.updateProfile);
          this.user = { ...this.user, birth_date: newBirthDate };
          this.existingUser;
          this.user = { ...this.user, birth_date: newBirthDate };
          this.store.commit('shared/setUser', this.user);
          this.storage.setUser(updatedUser);
          this.openSuccessBirthToast();
        })
        .catch((e) => {
          console.error(e);
          this.openFailedBirthToast();
        });
      this.isLoading = false;
    },

    //will use this in next development
    // async updateLanguageAndCloseModal(lang) {
    //   this.selectedLanguage = lang;
    //   this.setOpenLanguage(false);
    // },

    async saveLanguage() {
      this.changeLanguageApp({
        language: this.lang
      })
        .then((res) => {
          this.store.dispatch('b2c/setLang', res.data.updateLanguage);
          this.store.commit('b2c/setLang', res.data.updateLanguage);
        })
        .catch((e) => console.error(e));
    },

    async openSuccessGenderToast() {
      const toast = await toastController.create({
        message: `${this.$t('gender_updated')}`,
        duration: 2500,
        cssClass: 'success-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    async openSuccessBirthToast() {
      const toast = await toastController.create({
        message: `${this.$t('birth_date_updated')}`,
        duration: 2500,
        cssClass: 'success-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    async openFailedGenderToast() {
      const toast = await toastController.create({
        message: `${this.$t('gender_failed')}`,
        duration: 2500,
        cssClass: 'failed-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    async openFailedBirthToast() {
      const toast = await toastController.create({
        message: `${this.$t('birth_date_failed')}`,
        duration: 2500,
        cssClass: 'failed-toast',
        position: 'bottom'
      });
      return toast.present();
    },

    getUserDate(date) {
      return dayjs(date).format('MM/DD/YYYY');
    }
  }
});
</script>

<style scoped lang="scss">
@import 'manage-account.module';
</style>

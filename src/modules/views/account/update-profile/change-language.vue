<template>
  <ion-content>
    <div class="name-modal-dialog padding-x padding-y">
      <ion-row>
        <ion-col></ion-col>
        <ion-col size="8" class="title-modal"
          ><p>{{ $t('language') }}</p></ion-col
        >
        <ion-col class="close-icon">
          <ion-icon @click="dismissModal" class="close-icon" :icon="closeOutline" />
        </ion-col>
      </ion-row>
      <ion-item class="name-item" @click="selectEnglish">
        <ion-input readonly="true" :color="english == true ? 'primary' : 'medium'">English</ion-input>
        <ion-icon
          slot="end"
          v-if="english == true"
          color="primary"
          style="font-size: 22px"
          :icon="checkmarkOutline"
        />
      </ion-item>
      <ion-item class="name-item" @click="selectSimplified">
        <ion-input readonly="true" :color="simplified == true ? 'primary' : 'medium'"
          >Chinese (Simplified)</ion-input
        >
        <ion-icon
          slot="end"
          v-if="simplified == true"
          color="primary"
          style="font-size: 22px"
          :icon="checkmarkOutline"
        />
      </ion-item>
      <ion-item class="name-item" @click="selectTraditional">
        <ion-input readonly="true" :color="traditional == true ? 'primary' : 'medium'"
          >Chinese (Traditional)</ion-input
        >
        <ion-icon
          slot="end"
          v-if="traditional == true"
          color="primary"
          style="font-size: 22px"
          :icon="checkmarkOutline"
        />
      </ion-item>
      <ion-button
        @click="saveLanguage"
        :disabled="lang == null"
        color="primary"
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
import { IonContent, IonInput, IonRow, IonCol, IonIcon, IonItem, IonButton } from '@ionic/vue';
import { closeOutline, checkmarkOutline } from 'ionicons/icons';
import { defineComponent, inject } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { updateLanguage } from '@/services/shared/graphql';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'LanguageModal',

  data() {
    return {
      content: 'Content',
      lang: null,
      english: false,
      traditional: false,
      simplified: false
    };
  },
  components: { IonContent, IonInput, IonRow, IonCol, IonIcon, IonItem, IonButton },

  setup() {
    const store = useStore();
    const storage = inject('$storage');
    const { mutate: changeLanguageApp } = useMutation(updateLanguage);
    return {
      closeOutline,
      checkmarkOutline,
      store,
      storage,
      changeLanguageApp
    };
  },

  watch: {
    lang(lang) {
      this.$i18n.locale = lang;
      this.store.commit('b2c/setLang', lang);
    }
  },

  methods: {
    dismissModal(lang) {
      if (lang !== null) {
        this.$emit('close-modal', (lang = this.lang));
      } else {
        this.$emit('close-modal', (lang = null));
      }
    },

    async saveLanguage(lang) {
      this.changeLanguageApp({
        language: this.lang
      })
        .then((res) => {
          this.store.dispatch('b2c/setLang', (lang = res.data.updateLanguage));
          this.store.commit('b2c/setLang', (lang = res.data.updateLanguage));
          this.dismissModal(lang);
        })
        .catch((e) => console.error(e));
    },

    async selectEnglish() {
      this.lang = 'en-us';
      this.english = true;
      this.traditional = false;
      this.simplified = false;
    },

    async selectTraditional() {
      this.lang = 'zh-tw';
      this.traditional = true;
      this.english = false;
      this.simplified = false;
    },

    async selectSimplified() {
      this.lang = 'zh-cn';
      this.simplified = true;
      this.english = false;
      this.traditional = false;
    }
  }
});
</script>

<style scoped lang="scss">
@import 'modal-dialog.module';
</style>

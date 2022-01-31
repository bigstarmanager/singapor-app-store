<template>
  <ion-page>
    <ion-header class="category_page_header">
      <ion-toolbar color="transparent">
        <ion-searchbar
          class="header_searchbar"
          color="tertiary"
          show-cancel-button="never"
          :placeholder="
            selectedHub && selectedHub.alias_name && isLoggedIn
              ? $t('search_in') + getHubName(selectedHub.alias_name)
              : $t('search_for_food')
          "
          @ion-focus="gotoSearch()"
        ></ion-searchbar>
        <ion-buttons slot="end">
          <ion-button @click="gotoRouter('/main/chat')">
            <ion-img :src="isLoggedIn && isNewMessage ? chat_fill_svg : chat_svg" />
          </ion-button>
          <ion-button @click="gotoRouter('/main/map')">
            <ion-img :src="isLoggedIn && selectedHub ? location_click_svg : location_svg" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="category_container">
      <div class="category_title">
        <span>{{ $t('categories') }}</span>
      </div>
      <CategoryPageList />
    </ion-content>
    <ion-footer v-if="!isLoggedIn" class="login-sticky">
      <ion-label>{{ $t('login_sticky') }}</ion-label>
      <ion-button @click="gotoLogin()">{{ $t('login_now') }}</ion-button>
    </ion-footer>
  </ion-page>
</template>
<script>
import {
  IonPage,
  IonContent,
  IonFooter,
  IonToolbar,
  IonImg,
  IonLabel,
  IonHeader,
  IonSearchbar,
  IonButtons,
  IonButton,
  onIonViewWillEnter
} from '@ionic/vue';
import { defineComponent, computed, inject, ref } from 'vue';
import { useStore } from 'vuex';
import CategoryPageList from '../../../components/CategoryPageList';
import { useRouter } from 'vue-router';
import chat_svg from '@/assets/icons/shared/chat.svg';
import chat_fill_svg from '@/assets/icons/shared/chat_fill.svg';
import location_svg from '@/assets/icons/shared/place.svg';
import location_click_svg from '@/assets/icons/shared/place_click.svg';

export default defineComponent({
  name: 'Category',
  components: {
    IonContent,
    IonFooter,
    IonPage,
    IonToolbar,
    IonHeader,
    IonImg,
    IonLabel,
    IonSearchbar,
    IonButtons,
    IonButton,
    CategoryPageList
  },
  async setup() {
    const router = useRouter();
    const store = useStore();
    const isLoggedIn = ref(false);
    const storage = inject('$storage');
    const isNewMessage = computed(() => {
      return store.getters['b2c/getIsNewMessage'];
    });
    const selectedHub = computed(() => {
      return store.getters['b2c/getSelectedHub'];
    });
    let user = null;
    onIonViewWillEnter(async () => {
      user = await storage.getUser();
      if (user?.id) {
        isLoggedIn.value = true;
      } else {
        isLoggedIn.value = false;
      }
    });
    user = await storage.getUser();
    if (user?.id) {
      isLoggedIn.value = true;
    } else {
      isLoggedIn.value = false;
    }
    return {
      chat_svg,
      location_svg,
      chat_fill_svg,
      location_click_svg,
      isNewMessage,
      isLoggedIn,
      selectedHub,
      router,
      storage
    };
  },
  methods: {
    getHubName(data) {
      const hubName = data.substring(0, 14);
      return data.length > 14
        ? `${hubName.substring(0, Math.min(hubName.length, hubName.lastIndexOf(' ')))}...`
        : data;
    },
    gotoSearch() {
      this.router.push({ name: 'search', params: { showSupplier: 'hidden' } });
    },
    gotoRouter(path) {
      this.$router.push(path);
    },
    async gotoLogin() {
      await this.storage.setRedirectPath('/main/category');
      this.$router.push('/home');
    }
  }
});
</script>

<style scoped lang="scss">
@import 'category.module';
</style>

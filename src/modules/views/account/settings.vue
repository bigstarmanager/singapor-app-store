<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/account"></ion-back-button>
        </ion-buttons>
        <ion-label class="page-title">{{ $t('settings') }}</ion-label>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-item
        class="ion-activatable"
        detail="false"
        lines="none"
        button
        @click="showDeleteAccountDialog = true"
      >
        <ion-row class="ion-align-items-center">
          <ion-img :src="trashGrayIcon" />
          <ion-label class="text-item button-text">{{ $t('delete_account') }}</ion-label>
        </ion-row>
      </ion-item>
      <ion-item
        class="ion-activatable button-container"
        detail="false"
        lines="none"
        button
        @click="onClickUpdate"
      >
        <ion-row class="">
          <ion-icon :src="downloadOutline" class="download-icon" />
          <ion-label class="text-item button-text">{{ $t('update') }}</ion-label>
        </ion-row>
      </ion-item>
    </ion-content>
    <ion-modal
      :is-open="showDeleteAccountDialog"
      css-class="delete-account-modal"
      @didDismiss="showDeleteAccountDialog = false"
    >
      <delete-account-modal @delete-account="onDeleteAccount" @close-modal="onCloseModal" />
    </ion-modal>
  </ion-page>
</template>

<script>
import { defineComponent, inject } from 'vue';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonItem,
  IonLabel,
  IonModal,
  IonPage,
  IonRow,
  IonToolbar,
  alertController,
  modalController
} from '@ionic/vue';
import { downloadOutline } from 'ionicons/icons';
import { Deploy } from 'cordova-plugin-ionic';
import { Capacitor } from '@capacitor/core';
import DeleteAccountModal from '@/components/DeleteAccount';
import ProgressBarModal from '@/components/ProgressBarModal';
import { useMutation } from '@vue/apollo-composable';
import { deleteUserAccount } from '@/services/shared/graphql';
import { getAppVersion } from '@/services/shared/graphql/getAppVersion';
import meta from '../../../../package.json';
import store from '../../../store';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
const { useActions } = createNamespacedHelpers(store, 'shared');
import trashGrayIcon from '@/assets/icons/shared/trash_gray.svg';

export default defineComponent({
  name: 'AccountSettings',
  components: {
    IonBackButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonImg,
    IonItem,
    IonLabel,
    IonModal,
    IonPage,
    IonRow,
    IonToolbar,
    DeleteAccountModal
  },
  data() {
    return {
      showDeleteAccountDialog: false,
      user: null
    };
  },
  methods: {
    async checkAvailableUpdate() {
      try {
        const update = await Deploy.checkForUpdate();
        if (update.available) {
          const isProduction = process.env.VUE_APP_ENV === 'production';
          if (isProduction) {
            this.fetchAppVersion({ appType: 3 })
              .then(async (res) => {
                const appVersion = res?.data?.getAppVersion?.length ? res.data.getAppVersion[0] : undefined;
                if (appVersion) {
                  const targetVersion = appVersion.version;
                  if (targetVersion > meta.htmlVersion) {
                    this.showUpdateModal();
                  } else {
                    this.showNoUpdateModal();
                  }
                }
              })
              .catch((error) => console.error('error - checkAvailableUpdate', error));
          } else {
            this.showUpdateModal();
          }
        } else {
          this.showNoUpdateModal();
        }
      } catch (e) {
        console.error('checkAvailableUpdate', e);
      }
    },
    async showUpdateModal() {
      const alert = await alertController.create({
        header: this.$t('update_modal_header'),
        message: this.$t('update_modal_message'),
        backdropDismiss: false,
        buttons: [
          {
            text: 'UPDATE',
            handler: async () => {
              let name = 'Downloading';
              let percent = 0;
              const modal = await modalController.create({
                component: ProgressBarModal,
                componentProps: {
                  name,
                  percent
                }
              });
              modal.present();
              await Deploy.downloadUpdate((progress) => {
                percent = progress;
              });
              await Deploy.extractUpdate((progress) => {
                name = 'Install';
                percent = progress;
                if (process == 100) modal.dismiss();
              });
              await Deploy.reloadApp();
            }
          }
        ]
      });
      await alert.present();
    },
    async showNoUpdateModal() {
      const alert = await alertController.create({
        header: this.$t('no_update_available'),
        buttons: ['OK']
      });
      await alert.present();
    },
    async onClickUpdate() {
      const isNative = Capacitor.isNativePlatform();
      if (isNative) {
        this.checkAvailableUpdate();
      }
    },
    onCloseModal() {
      this.showDeleteAccountDialog = false;
    },
    onDeleteAccount() {
      this.fetchDeleteUserAccount({
        userId: this.user.id
      })
        .then(async () => {
          this.onCloseModal();
          const { clearStore } = useActions(['clearStore']);
          clearStore();
          this.storage.clearStorage();
          await this.$store.dispatch('shared/setUserLoggedIn', { userLoggedIn: false });
          await this.$store.dispatch('b2c/setUpdateLocation', true);
          this.$router.replace('/main/home');
        })
        .catch((e) => {
          this.onCloseModal();
          console.error(e);
        });
    }
  },
  async setup() {
    const storage = inject('$storage');
    const { mutate: fetchDeleteUserAccount } = useMutation(deleteUserAccount);
    const { mutate: fetchAppVersion } = useMutation(getAppVersion);

    return {
      storage,
      fetchAppVersion,
      fetchDeleteUserAccount,
      trashGrayIcon,
      downloadOutline
    };
  },
  async created() {
    this.user = inject('$storage')
      .getUser()
      .then((res) => {
        this.user = res;
      });
  }
});
</script>

<style scoped lang="scss">
@import 'settings.module';
</style>

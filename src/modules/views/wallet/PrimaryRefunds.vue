<template>
  <ion-content scroll-y="false">
    <div class="refunds">
      <ion-list>
        <ion-row>
          <ion-col class="close-icon">
            <ion-icon @click="dismissModal" class="close-icon" :icon="closeOutline" />
          </ion-col>
        </ion-row>
        <p class="title">{{ title }}</p>
        <br />
        <div class="info-text">{{ text1 }}</div>
        <br />
        <div class="info-text">{{ text2 }}</div>
        <ion-button @click="confirmPrimaryRefunds" class="uderstood-btn" expand="block" fill="solid">
          {{ $t('wallet.understood') }}
        </ion-button>
      </ion-list>
    </div>
  </ion-content>
</template>

<script>
import { IonContent, IonIcon, IonCol, IonRow, IonList, IonButton, modalController } from '@ionic/vue';
import { closeOutline } from 'ionicons/icons';
import { defineComponent } from 'vue';
import { setRefundToEwallet } from '@/services/shared/graphql';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';

export default defineComponent({
  name: 'PrimaryRefunds',
  props: {
    title: { type: String },
    text1: { type: String },
    text2: { type: String },
    primaryRefundsStatus: { type: Boolean }
  },
  data() {
    return {
      content: 'Content'
    };
  },
  components: { IonContent, IonIcon, IonCol, IonRow, IonList, IonButton },

  setup() {
    const router = useRouter();
    const { mutate: setPrimaryRefunds } = useMutation(setRefundToEwallet);
    return {
      closeOutline,
      router,
      setPrimaryRefunds
    };
  },

  methods: {
    async dismissModal() {
      await modalController.dismiss();
    },

    async confirmPrimaryRefunds() {
      this.setPrimaryRefunds({
        refundToEwallet: this.primaryRefundsStatus === true ? false : true
      })
        .then(() => {
          this.dismissModal();
        })
        .catch((e) => {
          console.error(e);
        });
    }
  }
});
</script>

<style scoped lang="scss">
@import 'PrimaryRefunds.scss';
</style>

<template>
  <template v-if="!transaction">
    <ion-item class="transaction" lines="none">
      <div>
        <div class="title">
          <ion-skeleton-text animated style="width: 5em"></ion-skeleton-text>
        </div>
        <div class="description">
          <ion-skeleton-text animated style="width: 8em"></ion-skeleton-text>
        </div>
      </div>
      <div slot="end">
        <div class="date">
          <ion-skeleton-text animated style="width: 8em"></ion-skeleton-text>
        </div>
        <div class="amount">
          <ion-skeleton-text animated style="width: 5em"></ion-skeleton-text>
        </div>
      </div>
    </ion-item>
    <div class="line-separator-3"></div>
  </template>
  <template v-else>
    <ion-item class="transaction" lines="none">
      <div>
        <div class="title">
          <ion-row class="ion-align-items-start ion-align-items-center">
            <span>{{ transaction.type.name }}</span>
            <ion-badge
              :class="
                transaction?.status?.name === 'Complete' || transaction?.status?.name === 'Pending'
                  ? 'status-normal'
                  : 'status-failed'
              "
              >{{
                transaction?.status?.name === 'Cancelled' ? 'Failed' : transaction?.status?.name
              }}</ion-badge
            >
            <ion-img
              v-if="
                transaction?.type?.name === 'Top Up' &&
                (transaction?.status?.name === 'Cancelled' || transaction?.status?.name === 'Failed')
              "
              @click="setOpenTopupFail(true)"
              class="info"
              :src="isOpenTopupFailRef ? '/assets/images/info-on.svg' : '/assets/images/info_withdraw.svg'"
            >
            </ion-img>
            <ion-popover
              :is-open="isOpenTopupFailRef"
              css-class="fail-info"
              :show-backdrop="false"
              :backdrop-dismiss="false"
              @didDismiss="setOpenTopupFail(false)"
            >
              <TopupFailInfo @close-info="setOpenTopupFail(false)"></TopupFailInfo>
            </ion-popover>
            <ion-img
              v-if="transaction?.type?.name === 'Withdrawal' && transaction?.status?.name === 'Failed'"
              @click="setOpenWithdrawFail(true)"
              class="info"
              :src="isOpenWithdrawFailRef ? '/assets/images/info-on.svg' : '/assets/images/info_withdraw.svg'"
            >
            </ion-img>
            <ion-popover
              :is-open="isOpenWithdrawFailRef"
              css-class="fail-info"
              :show-backdrop="false"
              :backdrop-dismiss="false"
              @didDismiss="setOpenWithdrawFail(false)"
            >
              <WithdrawFailInfo @close-info="setOpenWithdrawFail(false)"></WithdrawFailInfo>
            </ion-popover>
          </ion-row>
        </div>
        <div class="description">
          &nbsp;
          <p>{{ transaction.description }}</p>
        </div>
      </div>
      <div slot="end">
        <div class="date">
          {{ transactionDate }}
        </div>
        <div
          :class="{
            amount: true,
            positive: transaction.amount > 0
          }"
        >
          {{ transaction.amount > 0 ? '+' : '-' }}
          <span>{{ user?.country?.currency_symbol }}{{ Math.abs(transaction.amount).toFixed(2) }}</span>
          <!-- <ion-img class="chevron" src="/assets/images/ic-chevron-right-24px.png"></ion-img> -->
        </div>
      </div>
    </ion-item>
    <div class="line-separator-3"></div>
  </template>
</template>

<script>
import { IonItem, IonSkeletonText, IonBadge, IonImg, IonRow, IonPopover } from '@ionic/vue';
import dayjs from 'dayjs';
import { defineComponent, inject, ref } from 'vue';
import TopupFailInfo from '@/components/Wallet/TopupFailInfo.vue';
import WithdrawFailInfo from '@/components/Wallet/WithdrawFailInfo.vue';

export default defineComponent({
  name: 'Transaction',
  components: {
    IonItem,
    IonSkeletonText,
    IonBadge,
    IonImg,
    IonRow,
    IonPopover,
    TopupFailInfo,
    WithdrawFailInfo
  },
  props: {
    transaction: Object
  },
  setup() {
    const user = ref();
    const storage = inject('$storage');
    const isOpenTopupFailRef = ref(false);
    const setOpenTopupFail = (state) => {
      isOpenTopupFailRef.value = state;
    };
    const isOpenWithdrawFailRef = ref(false);
    const setOpenWithdrawFail = (state) => {
      isOpenWithdrawFailRef.value = state;
    };
    (async () => {
      user.value = await storage.getUser();
    })();
    return {
      user,
      isOpenTopupFailRef,
      isOpenWithdrawFailRef,
      setOpenTopupFail,
      setOpenWithdrawFail
    };
  },
  computed: {
    transactionDate() {
      // 8 Mar 2021 | 11:59 PM
      let djs = dayjs(new Date(this.transaction.created_at));
      djs = djs.format('D MMM YYYY | hh:mm A');

      return djs;
    }
  }
});
</script>

<style scoped lang="scss">
@import '@/modules/views/cart/cart.scss';
@import 'Transaction.scss';
</style>

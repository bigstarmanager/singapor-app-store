<template>
  <ion-page>
    <ion-header class="order_header ion-no-border">
      <ion-toolbar mode="md">
        <ion-buttons slot="start">
          <ion-back-button
            mode="md"
            default-href="/main/account"
            @click="router.replace('/main/account')"
          ></ion-back-button>
        </ion-buttons>
        <ion-title class="order_title">{{ $t('order.order_title') }}</ion-title>
      </ion-toolbar>
      <ion-segment scrollable class="order_segment" id="order_segment" v-model="selected_segmentValue">
        <ion-segment-button class="order_segment_button" value="overview" id="order_overview">
          <div class="order_segment_label">{{ $t('order.overview') }}</div>
        </ion-segment-button>
        <ion-segment-button class="order_segment_button" value="preparing" id="order_preparing">
          <div class="order_segment_label">
            {{ $t('order.preparing') }}
            <span class="badge" v-show="notify_count.preparing > 0">
              {{ notify_count.preparing > 99 ? 99 : notify_count.preparing }}
            </span>
          </div>
        </ion-segment-button>
        <ion-segment-button class="order_segment_button" value="tocollect" id="order_tocollect">
          <div class="order_segment_label">
            {{ $t('order.to_collect') }}
            <span class="badge" v-show="notify_count.to_collect > 0">
              {{ notify_count.to_collect > 99 ? 99 : notify_count.to_collect }}
            </span>
          </div>
        </ion-segment-button>
        <ion-segment-button class="order_segment_button" value="collected" id="order_collected">
          <div class="order_segment_label">
            {{ $t('order.collected') }}
            <span class="badge" v-show="showNotify.collected && notify_count.collected > 0">
              {{ notify_count.collected > 99 ? 99 : notify_count.collected }}
            </span>
          </div>
        </ion-segment-button>
        <ion-segment-button class="order_segment_button" value="cancelled" id="order_cancelled">
          <div class="order_segment_label">
            {{ $t('order.cancelled') }}
            <span class="badge" v-show="showNotify.cancelled && notify_count.cancelled > 0">
              {{ notify_count.cancelled > 99 ? 99 : notify_count.cancelled }}
            </span>
          </div>
        </ion-segment-button>
        <ion-segment-button class="order_segment_button" value="dispute" id="order_dispute">
          <div class="order_segment_label">
            {{ $t('order.dispute') }}
          </div>
        </ion-segment-button>
      </ion-segment>
    </ion-header>
    <ion-content class="order_container">
      <ion-router-outlet />
    </ion-content>
  </ion-page>
</template>

<script>
import {
  IonPage,
  IonTitle,
  IonHeader,
  IonToolbar,
  IonSegment,
  IonSegmentButton,
  IonRouterOutlet,
  IonButtons,
  IonBackButton,
  IonContent
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { getB2cBadgeOrderMenu } from '../../../services/shared/graphql/allOrdersPaginate';
import { useMutation } from '@vue/apollo-composable';

export default defineComponent({
  name: 'Orders',
  components: {
    IonPage,
    IonToolbar,
    IonHeader,
    IonTitle,
    IonSegment,
    IonSegmentButton,
    IonRouterOutlet,
    IonButtons,
    IonBackButton,
    IonContent
  },
  data: () => ({
    selected_segmentValue: 'overview',
    prevRoute: 'overview'
  }),
  setup() {
    let notify_count = ref({});
    let showNotify = ref({ preparing: true, collected: true, to_collect: true, cancelled: true });
    const isLoading = ref(false);
    const router = useRouter();
    const { mutate: fetchGetB2cBadgeOrderMenu } = useMutation(getB2cBadgeOrderMenu);
    fetchGetB2cBadgeOrderMenu()
      .then((res) => {
        notify_count.value = res.data.getB2cBadgeOrderMenu;
        let route_array = router.currentRoute.value.fullPath.split('/');
        if (route_array[route_array.length - 1] == 'cancelled')
          setTimeout(() => {
            document.getElementById('order_segment').scrollLeft += 200;
          }, 200);
        else if (route_array[route_array.length - 1] == 'collected')
          setTimeout(() => {
            document.getElementById('order_segment').scrollLeft += 100;
          }, 200);
      })
      .catch((error) => {
        console.error(error);
      });
    return {
      notify_count,
      isLoading,
      showNotify,
      router
    };
  },
  mounted() {
    let route_array = this.$route.path.split('/');
    this.selected_segmentValue = route_array[route_array.length - 1];
    this.prevRoute = this.selected_segmentValue;
  },
  watch: {
    $route() {
      let route_array = this.$route.path.split('/');
      if (this.selected_segmentValue !== route_array[route_array.length - 1]) {
        if (
          ['overview', 'preparing', 'collected', 'tocollect', 'cancelled'].includes(
            route_array[route_array.length - 1]
          )
        )
          this.selected_segmentValue = route_array[route_array.length - 1];
      }
    },
    selected_segmentValue(val) {
      if (val == 'collected' && this.showNotify.collected) {
        this.showNotify.collected = false;
        setTimeout(() => {
          document.getElementById('order_segment').scrollLeft += 100;
        }, 200);
      } else if (val == 'cancelled' && this.showNotify.cancelled) {
        this.showNotify.cancelled = false;
        setTimeout(() => {
          document.getElementById('order_segment').scrollLeft += 200;
        }, 200);
      } else if (this.prevRoute == 'preparing' && this.showNotify.preparing) {
        this.showNotify.preparing = false;
        setTimeout(() => {
          document.getElementById('order_segment').scrollLeft = 0;
        }, 200);
      } else if (this.prevRoute == 'tocollect' && this.showNotify.to_collect) {
        setTimeout(() => {
          document.getElementById('order_segment').scrollLeft = 0;
        }, 200);
        this.showNotify.to_collect = false;
      } else if (val == 'overview') {
        setTimeout(() => {
          document.getElementById('order_segment').scrollLeft = 0;
        }, 200);
      } else if (val === 'dispute') {
        setTimeout(() => {
          document.getElementById('order_segment').scrollLeft = 0;
        }, 200);
      }
      this.prevRoute = val;
      this.router.push({ path: `/main/orders/${val}` });
    }
  }
});
</script>

<style scoped lang="scss">
@import 'orders.module';
</style>

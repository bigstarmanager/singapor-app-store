<template>
  <ion-grid class="supplier-list">
    <div class="title">
      <span style="text-transform: uppercase">{{ $t('supplier') }}</span>
      <span role="button" class="see_more" @click="gotoSupplier()">
        {{ 'See more' }}
      </span>
    </div>
    <ion-row class="suppliers" v-if="suppliers.length > 0">
      <ion-col
        v-for="(item, index) in suppliers"
        v-bind:key="index"
        class="supplier-item ion-activatable pa-0"
        @click="onViewSupplier(item.tenant.id)"
      >
        <ion-ripple-effect></ion-ripple-effect>
        <SupplierItem v-if="item" :supplier="item" />
      </ion-col>
    </ion-row>
    <ion-row class="skeleton_supplier" v-else>
      <ion-col v-for="index in 10" v-bind:key="index" class="supplier-item">
        <ion-thumbnail>
          <ion-skeleton-text animated></ion-skeleton-text>
        </ion-thumbnail>
        <div class="supplier_text">
          <ion-skeleton-text animated class="supplier_name"></ion-skeleton-text>
        </div>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>

<script>
import { useStore } from 'vuex';
import { IonCol, IonGrid, IonRow, IonSkeletonText, IonThumbnail, IonRippleEffect } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { defineComponent, computed } from 'vue';
import SupplierItem from '../supplierItem';

export default defineComponent({
  name: 'SupplierList',
  components: {
    IonGrid,
    IonRow,
    IonCol,
    IonSkeletonText,
    IonThumbnail,
    IonRippleEffect,
    SupplierItem
  },
  setup() {
    const router = useRouter();
    const store = useStore();
    const suppliers = computed(() => {
      const allProducts = store.getters['b2c/getAllProducts'];
      return allProducts ? allProducts.suppliers : [];
    });
    const onViewSupplier = (supplier_id) => {
      router.push({ name: 'viewsupplier', params: { supplier_id: supplier_id } });
    };
    return {
      suppliers,
      router,
      onViewSupplier
    };
  },
  methods: {
    gotoSupplier() {
      this.router.push('supplier-list');
    }
  }
});
</script>

<style scoped lang="scss">
@import 'supplier.list.module';
</style>

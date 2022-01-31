<template>
  <div class="suupplier-category-list" :class="!visibility ? 'cat_sticky_out' : ''">
    <ion-slides
      v-if="categories && categories.length > 4"
      :pager="categories.length > 5 ? true : false"
      :options="slideOpts"
      class="category-slids"
    >
      <ion-slide v-for="(category, index) in categories" v-bind:key="category.id">
        <SupplierSearchCategoryItem
          :category="category"
          @click="index != id ? select_category(index) : ''"
          :selected="index == id ? true : false"
        />
      </ion-slide>
    </ion-slides>
    <div v-else-if="categories && categories.length <= 4" class="noslider">
      <div v-for="(category, index) in categories" v-bind:key="category.id">
        <SupplierSearchCategoryItem
          :category="category"
          @click="index != id ? select_category(index) : ''"
          :selected="index == id ? true : false"
        />
      </div>
    </div>
    <ion-slides v-else pager="true" :options="slideOpts" class="supplier-search-skeleton-slides">
      <ion-slide v-for="index in 10" v-bind:key="index">
        <ion-skeleton-text animated class="supplier-search-skeleton-text"></ion-skeleton-text>
      </ion-slide>
    </ion-slides>
  </div>
</template>

<script>
import { IonSlides, IonSlide, IonSkeletonText } from '@ionic/vue';
import SupplierSearchCategoryItem from '../SupplierSearchCategoryItem';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'CategoryList',
  props: ['id', 'visibility', 'categories'],
  data: () => ({
    selected_id: 0
  }),
  components: { IonSlides, IonSlide, IonSkeletonText, SupplierSearchCategoryItem },
  setup(props) {
    const slideOpts = computed(() => {
      return {
        initialSlide: props.id,
        speed: 400,
        slidesPerView: props.categories && props.categories.length < 5 ? props.categories.length : 5,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          type: 'progressbar',
          progressbarFillClass: 'swiper-pagination-progressbar-fill',
          renderProgressbar: function (progressbarFillClass) {
            return '<span class="' + progressbarFillClass + '" style="background: #04565a"></span>';
          }
        }
      };
    });

    return {
      slideOpts
    };
  },
  methods: {
    select_category(index) {
      this.$emit('update:id', index);
    }
  }
});
</script>

<style scoped lang="scss">
@import 'category.list.module';
</style>

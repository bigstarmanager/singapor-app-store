<template>
  <div class="main_category_list" :class="!visibility ? 'cat_sticky_out' : ''">
    <div v-if="categories && categories.length > 0" class="category_slide">
      <ion-slides
        v-if="categories.length > 4"
        :pager="categories.length > 4 ? true : false"
        :options="slideOpts"
      >
        <ion-slide v-for="(category, index) in categories" v-bind:key="category.id">
          <CategoryItem
            :category="category"
            @click="goto ? select_category(index) : gotoCateProduct(index)"
            :selected="index == id ? true : false"
          />
        </ion-slide>
      </ion-slides>
      <div v-else class="static_subcategory">
        <div v-for="(category, index) in categories" v-bind:key="category.id" class="static_subcategory_list">
          <CategoryItem
            :category="category"
            @click="goto ? select_category(index) : gotoCateProduct(index)"
            :selected="index == id ? true : false"
          />
        </div>
      </div>
    </div>
    <ion-slides pager="true" :options="slideOpts1" class="category_skeleton" v-else>
      <ion-slide v-for="index in 15" v-bind:key="index">
        <ion-thumbnail class="skeleton_image">
          <ion-skeleton-text style="border-radius: 100%"></ion-skeleton-text>
        </ion-thumbnail>
        <ion-skeleton-text class="skeleton_name"></ion-skeleton-text>
      </ion-slide>
    </ion-slides>
  </div>
</template>

<script>
import { IonSlides, IonSlide, IonSkeletonText, IonThumbnail } from '@ionic/vue';
import CategoryItem from '../CategoryItem';
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'CategorySlider',
  props: ['id', 'visibility', 'goto', 'availbleSupplier', 'supplier_id', 'categories'],
  data: () => ({
    selected_id: 0
  }),
  components: {
    IonSlides,
    IonSlide,
    CategoryItem,
    IonSkeletonText,
    IonThumbnail
  },
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
    const slideOpts1 = {
      initialSlide: 0,
      speed: 400,
      slidesPerView: 5,
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
    return {
      slideOpts,
      slideOpts1
    };
  },
  methods: {
    select_category(index) {
      this.$emit('update:id', index);
    },
    gotoCateProduct(index) {
      this.$store.dispatch('b2c/setSelectedMainCatID', { id: index });
      this.$router.push('/main/category_product');
    }
  }
});
</script>

<style scoped lang="scss">
@import 'category.list.module';
</style>

<template>
  <div class="category-list">
    <div class="category-item" :class="selected ? 'selected_category' : ''">
      <div>{{ category.name }}</div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'SupplierSearchCategoryItem',
  props: ['category', 'selected'],
  components: {},
  setup() {
    return {
      baseImageUri: process.env.VUE_APP_IMAGE
    };
  }
});
</script>

<style scoped lang="scss">
@import 'category.module';
</style>

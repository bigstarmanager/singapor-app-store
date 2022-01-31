<template>
  <ion-grid class="category_page_list">
    <ion-row class="category_list" v-if="isLoading">
      <ion-col v-for="index in 10" v-bind:key="index" class="category_item">
        <ion-skeleton-text animated class="category_skeleton"> </ion-skeleton-text>
      </ion-col>
    </ion-row>
    <ion-row class="category_list" v-else-if="!isLoading && main_categories.length > 0">
      <ion-col v-for="(category, index) in main_categories" v-bind:key="category.id" class="category_item">
        <CategoryPageItem :category="category" @click="category_product_clicked(index)" />
      </ion-col>
    </ion-row>
    <ion-row class="category_no_list" v-else>
      <ion-Img :src="home_supplier_png" class="no-supplier-img" />
      <ion-label class="no-supplier-desc">
        {{ $t('no_supplier_text1') }}
      </ion-label>
      <ion-label>
        {{ $t('no_supplier_text2') }}
      </ion-label>
      <ion-label>
        {{ $t('no_supplier_text3') }}
        <router-link class="router-link" to="/main/account/contact-us">{{
          $t('no_supplier_text4')
        }}</router-link>
      </ion-label>
    </ion-row>
    <div class="category_browse_more" v-if="!isLoading && main_categories.length > 0">
      <div class="divider" />
      <div class="browse_more" @click="onViewSupplier()">
        {{ $t('looking_to_browse1') }}&nbsp;<span class="brown_more_supplier">{{
          $t('looking_to_browse2')
        }}</span
        >{{ $t('looking_to_browse3') }}
      </div>
    </div>
  </ion-grid>
</template>
<script>
import { IonRow, IonCol, IonGrid, IonSkeletonText, IonLabel, IonImg } from '@ionic/vue';
import { queryAllCategories } from '../../services/shared/graphql/category';
import { useMutation } from '@vue/apollo-composable';
import { defineComponent, ref, computed, inject } from 'vue';
import CategoryPageItem from '../CategoryPageItem';
import { useStore } from 'vuex';
import { useRouter } from 'vue-router';
import home_supplier_png from '@/assets/images/home_no_supplier.png';

export default defineComponent({
  name: 'CategoryPageList',
  components: { IonRow, IonCol, IonGrid, IonSkeletonText, IonLabel, IonImg, CategoryPageItem },
  async setup() {
    const store = useStore();
    const router = useRouter();
    let allCategories = [];
    let isLoading = ref(true);
    const backgroundArray = {
      Meat: '#E8D8CF',
      Seafood: '#84D9FF',
      Snacks: '#86298D',
      Veggies: '#2F9D67',
      Fruits: '#E84B52',
      Staples: '#CF934A',
      Drinks: '#039E43',
      Dairy: '#53ADFF',
      Cooking: '#FFDE32',
      Pastry: '#FFC165',
      Sweets: '#FD6E95',
      Meals: '#902300',
      Health: '#FFDB58',
      Pet: '#BE8F6C',
      Kitchen: '#AA5D89',
      Home: '#FF5C32'
    };
    const storage = inject('$storage');
    let main_categories = ref([]);
    const selectedHub = computed(() => {
      return store.getters['b2c/getSelectedHub'];
    });
    const { mutate: fetchAllCategory } = useMutation(queryAllCategories);

    const getCategories = async () => {
      isLoading.value = true;
      let getCurrentLocation = await storage.getCurrentLocation();
      let selectedState = await storage.getSelectedState();
      let user = await storage.getUser();
      main_categories.value = [];
      await fetchAllCategory({
        active: true,
        hubId: user?.id ? selectedHub.value?.id || undefined : undefined,
        state: user?.id
          ? user.country.description === 'Malaysia'
            ? selectedState.state
            : undefined
          : getCurrentLocation.country === 'Malaysia'
          ? selectedState.state
          : undefined,
        country: user?.id ? undefined : getCurrentLocation.country
      })
        .then((res) => {
          allCategories = res.data.categories;
          store.dispatch('b2c/setCategories', {
            allCategories: allCategories
          });
          allCategories.map((category) => {
            let categoryItem = {
              ...category,
              background: backgroundArray[category.name]
            };
            main_categories.value.push(categoryItem);
          });
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          isLoading.value = false;
        });
    };

    getCategories();
    const onViewSupplier = () => {
      router.push('/main/supplier-list');
    };
    return {
      main_categories,
      getCategories,
      isLoading,
      home_supplier_png,
      selectedHub,
      onViewSupplier
    };
  },
  methods: {
    routeToPath(path) {
      this.$router.push({
        path: path
      });
    },
    category_product_clicked(index) {
      this.$store.dispatch('b2c/setSelectedMainCatID', { id: index });
      this.$router.push('/main/category_product');
    }
  },
  watch: {
    selectedHub() {
      this.getCategories();
    }
  }
});
</script>

<style scoped lang="scss">
@import 'category.page.list.module';
</style>

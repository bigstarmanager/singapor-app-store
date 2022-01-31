<template>
  <section class="search">
    <div class="header">
      <ion-buttons slot="start">
        <ion-back-button text="" default-href="/main/home"></ion-back-button>
      </ion-buttons>
      <ion-searchbar
        ref="inputLabel"
        v-model="searchInput"
        :clear-icon="closeCircleOutline"
        class="searchInput"
        type="text"
        :placeholder="
          selectedHub && selectedHub.alias_name
            ? $t('search_in') + getHubName(selectedHub.alias_name)
            : $t('search_items')
        "
        clear-input
        @ion-change="handleSearch(searchInput)"
        debounce="1000"
      />
    </div>
  </section>
</template>
<script>
import { IonBackButton, IonButtons, IonSearchbar } from '@ionic/vue';
import { defineComponent, computed } from 'vue';
import { chatboxOutline, locationOutline, arrowBackOutline, closeCircleOutline } from 'ionicons/icons';
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'Search',
  components: { IonBackButton, IonButtons, IonSearchbar },
  data: () => ({
    searchInput: ''
  }),
  setup(props, { emit }) {
    const store = useStore();
    const router = useRouter();
    const selectedHub = computed(() => {
      return store.getters['b2c/getSelectedHub'];
    });

    const handleSearch = (data) => {
      emit('handleSearch', data);
    };

    const goBack = () => {
      router.go(-1);
    };

    return {
      chatboxOutline,
      locationOutline,
      arrowBackOutline,
      closeCircleOutline,
      selectedHub,
      handleSearch,
      goBack
    };
  },
  methods: {
    getHubName(data) {
      const hubName = data.substring(0, 14);
      return data.length > 14
        ? `${hubName.substring(0, Math.min(hubName.length, hubName.lastIndexOf(' ')))}...`
        : data;
    }
  }
});
</script>
<style scoped lang="scss">
@import 'searchHeader.module';
</style>

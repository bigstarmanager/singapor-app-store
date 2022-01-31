<template>
  <ion-page>
    <ion-header class="supplier_header">
      <ion-toolbar color="transparent" v-if="!isSearching">
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/home"></ion-back-button>
        </ion-buttons>
        <ion-label>{{ $t('supplier') }}</ion-label>
        <ion-buttons slot="end" @click="toggleSearch()">
          <ion-button>
            <ion-icon class="search-icon" slot="end" :icon="searchOutline" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar color="transparent" v-else>
        <ion-buttons slot="start">
          <ion-back-button text="" default-href="/main/home"></ion-back-button>
        </ion-buttons>
        <ion-searchbar
          ref="searchInput"
          class="header_searchbar"
          searchIcon="undefined"
          show-cancel-button="never"
          :clear-icon="closeCircleOutline"
          @ionCancel="toggleSearch()"
          @ionInput="filterSupplierList"
          :placeholder="$t('search_suppliers')"
        />
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="supplierListContainer">
      <ion-grid class="ion-padding" v-if="isLoading">
        <ion-row v-for="i in 10" v-bind:key="i">
          <div class="supplierSkeleton">
            <div>
              <ion-thumbnail>
                <ion-skeleton-text animated></ion-skeleton-text>
              </ion-thumbnail>
            </div>
            <div class="supplierSkeleton-text">
              <ion-label class="supplier">
                <ion-skeleton-text animated style="width: 70%; height: 14px"></ion-skeleton-text>
              </ion-label>
            </div>
          </div>
        </ion-row>
      </ion-grid>
      <ion-list class="sidebar" v-if="!isLoading && getSuppliers.length !== 0">
        <ion-item
          class="letter"
          v-for="(letter, index) in getLetters"
          v-bind:key="index"
          lines="none"
          @click="gotoGroup(letter)"
        >
          {{ letter }}
        </ion-item>
      </ion-list>
      <div class="no-search-container" v-if="!isLoading && getSuppliers.length === 0">
        <ion-label class="no-search-text">{{ $t('no_results_found') }}</ion-label>
      </div>
      <ion-list class="supplier-list-container" v-if="!isLoading && getSuppliers.length !== 0">
        <ion-item
          class="items"
          v-for="(supplier, index) in getSuppliers"
          v-bind:key="index"
          :id="`supplierGroup${supplier.first_letter}`"
          lines="none"
        >
          <ion-label class="letter" v-if="supplier.name === null">{{ supplier.first_letter }}</ion-label>
          <ion-item class="supplierItem" v-else @click="supplierSearch(supplier.id)">
            <SupplierImg :supplierLogo="supplier.logo" />
            <ion-label class="supplier">
              {{ supplier.name }}
            </ion-label>
          </ion-item>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script>
import { useStore } from 'vuex';
import {
  IonToolbar,
  IonLabel,
  IonPage,
  IonContent,
  IonIcon,
  IonSearchbar,
  IonHeader,
  IonGrid,
  IonRow,
  IonList,
  IonBackButton,
  IonButtons,
  IonButton,
  IonSkeletonText,
  IonThumbnail,
  IonItem
} from '@ionic/vue';
import { searchOutline, closeCircleOutline } from 'ionicons/icons';
import { queryAllSuppliers } from '../../../services/shared/graphql/supplier';
import { useMutation } from '@vue/apollo-composable';
import { useRouter } from 'vue-router';
import SupplierImg from './supplierImg.vue';
import { inject } from 'vue';
export default {
  name: 'AllSupplierList',
  components: {
    IonToolbar,
    IonLabel,
    IonPage,
    IonContent,
    IonIcon,
    IonSearchbar,
    IonBackButton,
    IonButtons,
    IonButton,
    IonHeader,
    IonGrid,
    IonRow,
    IonList,
    IonSkeletonText,
    SupplierImg,
    IonThumbnail,
    IonItem
  },
  computed: {
    getSuppliers() {
      return this.filteredSuppliers || this.suppliersUnderLetter;
    },
    getLetters() {
      return this.filteredLetters.length === 0 ? this.letters : this.filteredLetters;
    }
  },
  data() {
    return {
      filteredLetters: [],
      filteredSuppliers: null,
      allSuppliers: [],
      listOfSupplier: [],
      suppliersUnderLetter: [],
      letters: [],
      isLoading: false,
      isSearching: false
    };
  },
  async setup() {
    const store = useStore();
    const router = useRouter();
    const selectedHub = store.getters['b2c/getSelectedHub'];
    const storage = inject('$storage');
    let currentUser = await storage.getUser();
    let selectedState = await storage.getSelectedState();
    const supplierSearch = (data) => {
      router.push({ name: 'viewsupplier', params: { supplier_id: data } });
    };
    function getContent() {
      return document.querySelector('ion-content.supplierListContainer');
    }
    const gotoGroup = (letter) => {
      const { offsetTop } = document.getElementById(`supplierGroup${letter}`);
      getContent().scrollToPoint(0, offsetTop, 500);
    };
    return {
      selectedHub,
      supplierSearch,
      gotoGroup,
      searchOutline,
      currentUser,
      selectedState,
      closeCircleOutline
    };
  },
  methods: {
    getInitSuppliers() {
      this.isLoading = true;
      const { mutate: getAllSuppliers } = useMutation(queryAllSuppliers);
      getAllSuppliers({
        hubId: this.selectedHub ? this.selectedHub.id : null,
        state: this.currentUser.country.id === 127 ? this.selectedState.state : undefined
      })
        .then((res) => {
          this.allSuppliers = res.data.getAllSuppliers;

          this.suppliersUnderLetter = [];
          for (let index = 0; index < this.allSuppliers.length; index++) {
            let obj = {
              id: this.allSuppliers[index].tenant.id,
              name: this.allSuppliers[index].tenant.name,
              logo: this.allSuppliers[index].logo,
              first_letter: this.allSuppliers[index].tenant.name.charAt(0).toUpperCase()
            };
            this.listOfSupplier.push(obj);
          }
          // sort the supplier by alphabet order
          this.listOfSupplier.sort(function (supplierA, supplierB) {
            supplierA = supplierA.name.toLowerCase();
            supplierB = supplierB.name.toLowerCase();

            return supplierA < supplierB ? -1 : supplierA > supplierB ? 1 : 0;
          });

          // pushes the supplier list in order with the letters
          for (let index = 0; index < this.listOfSupplier.length; index++) {
            if (!this.suppliersUnderLetter.includes(this.listOfSupplier[index].first_letter)) {
              this.suppliersUnderLetter.push(this.listOfSupplier[index].first_letter);
              this.suppliersUnderLetter.push(this.listOfSupplier[index]);
            } else {
              this.suppliersUnderLetter.push(this.listOfSupplier[index]);
            }
          }
          // formats the json object
          for (let index = 0; index < this.suppliersUnderLetter.length; index++) {
            if (typeof this.suppliersUnderLetter[index] === 'string') {
              this.suppliersUnderLetter[index] = {
                id: null,
                name: null,
                logo: null,
                first_letter: this.suppliersUnderLetter[index]
              };
            }
          }

          // get unique letters for the scroll bar
          this.letters = this.suppliersUnderLetter
            .map((item) => item.first_letter)
            .filter((value, index, self) => self.indexOf(value) === index);

          function arrayMove(arr, fromIndex, toIndex) {
            var element = arr[fromIndex];
            arr.splice(fromIndex, 1);
            arr.splice(toIndex, 0, element);
          }
          const treeDotsSupplier = this.suppliersUnderLetter.filter((e) => e.name === 'TreeDots');
          if (treeDotsSupplier.length > 0) {
            const indexOfTreeDots = this.suppliersUnderLetter.indexOf(treeDotsSupplier[0]);
            arrayMove(this.suppliersUnderLetter, indexOfTreeDots, 0);
          }
        })
        .catch((error) => {
          console.error(error);
        })
        .finally(() => {
          this.isLoading = false;
        });
    },
    toggleSearch() {
      this.isSearching = !this.isSearching;
    },
    filterSupplierList(ev) {
      const keyword = ev.target.value;
      this.filteredSuppliers = this.suppliersUnderLetter.filter((e) => {
        if (e.name === null) {
          return true;
        }
        return e.name.toLowerCase().includes(keyword.toLowerCase());
      });
      this.filteredSuppliers = this.filteredSuppliers.filter((e, i, a) => {
        if (e.name !== null) {
          return true;
        } else {
          const sameLetterArray = a.filter((e1) => e1.first_letter === e.first_letter);
          return sameLetterArray.length > 1;
        }
      });
      this.filteredLetters = this.filteredSuppliers
        .map((item) => item.first_letter)
        .filter((value, index, self) => self.indexOf(value) === index);
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  async mounted() {
    this.getInitSuppliers();
  },
  watch: {
    isSearching(v) {
      if (v) {
        setTimeout(() => {
          this.$refs.searchInput.$el.setFocus();
        }, 100);
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import 'AllSupplierList.module';
</style>

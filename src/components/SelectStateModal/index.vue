<template>
  <ion-page>
    <ion-content :scrollY="false">
      <ion-grid>
        <ion-row class="stateTitle">
          <ion-label>{{ $t('which_state') }}</ion-label>
        </ion-row>
        <ion-row class="stateDescription">
          <ion-label>{{ $t('select_state') }}</ion-label>
        </ion-row>
        <ion-row class="selectState" v-if="isCountryShow">
          <ion-label class="selectTitle"> {{ $t('country') }}* </ion-label>
          <ion-select v-model="country" interface="action-sheet" :disabled="isCountryDisable">
            <ion-select-option value="Singapore">Singapore</ion-select-option>
            <ion-select-option value="Malaysia">Malaysia</ion-select-option>
          </ion-select>
        </ion-row>
        <ion-row class="selectState" v-if="showState">
          <ion-label class="selectTitle"> {{ $t('state') }}* </ion-label>
          <ion-select v-model="state" :disabled="country === '' ? true : false" interface="action-sheet">
            <ion-select-option value="Klang Valley">Klang Valley</ion-select-option>
            <ion-select-option value="Perak">Perak</ion-select-option>
            <ion-select-option value="Melaka">Melaka</ion-select-option>
            <ion-select-option value="Johor">Johor</ion-select-option>
            <ion-select-option value="Penang">Penang</ion-select-option>
          </ion-select>
        </ion-row>
        <ion-row class="confirmButton">
          <ion-button :disabled="getDisable" @click="goBack()">
            {{ $t('confirm') }}
          </ion-button>
        </ion-row>
      </ion-grid>
    </ion-content>
  </ion-page>
</template>
<script>
import {
  IonPage,
  IonContent,
  IonButton,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonGrid,
  IonRow
} from '@ionic/vue';
import { defineComponent, ref } from 'vue';
export default defineComponent({
  name: 'SelectState',
  components: {
    IonContent,
    IonPage,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonLabel,
    IonGrid,
    IonRow
  },
  props: {
    initialCountry: String,
    initialState: String,
    isCountryDisable: Boolean,
    isCountryShow: Boolean
  },
  watch: {
    country(val) {
      if (val === 'Singapore') {
        this.showState = false;
        this.state = '';
        document.querySelector('.select-state-modal>.modal-wrapper').style.height = '16.5rem';
      } else {
        this.showState = true;
        document.querySelector('.select-state-modal>.modal-wrapper').style.height = '20.2rem';
      }
    }
  },
  computed: {
    getDisable() {
      if (this.country === '') return true;
      if (this.country === 'Malaysia' && this.state === '') return true;
      return false;
    }
  },
  data: () => {
    return {
      stateList: ['Klang Valley', 'Perak', 'Melaka', 'Johor', 'Penang'],
      showState: true
    };
  },
  setup(props) {
    const country = ref(props.initialCountry || '');
    const state = ref(props.initialState || '');
    if (props.isCountryShow && props.isCountryDisable) {
      country.value = 'Malaysia';
    }
    return {
      state,
      country
    };
  },
  methods: {
    goBack() {
      this.$emit('selectState', { country: this.country, state: this.state });
    }
  }
});
</script>
<style scoped lang="scss">
@import 'selectStateModal.scss';
</style>

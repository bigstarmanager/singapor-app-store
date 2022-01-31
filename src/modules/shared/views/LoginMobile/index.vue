<template>
  <ion-page v-if="!otpMode">
    <ion-header no-border class="bar-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" text=""></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true" class="content">
      <div id="home-container">
        <div class="logo-container">
          <div class="logo">
            <ion-img src="/assets/images/splash_logo.png" alt="Treedots logo" />
          </div>
        </div>
        <Form @submit="onNext" v-slot="{ meta }">
          <Field
            v-model="phoneNumber"
            name="phoneNumber"
            :label="$t('mobile_number')"
            :rules="{ required: true, phoneValidator: true }"
            v-slot="{ field, errorMessage }"
          >
            <ion-item
              class="box phone-number-group"
              :class="{
                error: errorMessage !== undefined
              }"
            >
              <ion-label class="hidden">{{ $t('country_code') }}</ion-label>
              <ion-select interface="alert" v-model="countryCode">
                <ion-select-option v-for="code in preferredCountryCode" v-bind:key="code" :value="code">
                  {{ code }}
                </ion-select-option>
              </ion-select>
              <ion-input v-model="phoneNumber" type="number" :placeholder="$t('mobile_number')"></ion-input>
              <input v-bind="field" type="number" style="display: none" />
            </ion-item>
          </Field>
          <Error-Message name="phoneNumber" class="error" as="div" />
          <div class="button-groups t-m-2">
            <ion-button class="home-btn" expand="block" :disabled="!meta.valid" type="submit">
              <span>{{ $t('next') }}</span>
            </ion-button>
            <ion-label class="signup-link"
              >{{ $t('dont_have_an_account') }}
              <router-link to="/shared/auth/signup-access"
                ><strong>{{ $t('sign_up') }}</strong></router-link
              >
            </ion-label>
          </div>
        </Form>
      </div>
    </ion-content>
  </ion-page>
  <Otp
    v-else
    :title="$t('login')"
    :countryCode="countryCode"
    :phoneNumber="phoneNumber"
    :showError="otpError"
    @cancelOtp="
      otpMode = false;
      otpError = false;
    "
    @retryingOtp="otpError = false"
    @onSubmitOtpCode="loginMobileOtp"
  ></Otp>
</template>

<script>
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonPage,
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonImg
} from '@ionic/vue';
import { computed, defineComponent, inject, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { signInWithOTP, signInWithOTPRequest } from '../../../../services/shared/graphql';
import { useMutation } from '@vue/apollo-composable';
import { Field, Form, ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { preferredCountryCode, userLoginRoute } from '@/services/shared/helper/home';
import Otp from '@/components/Otp';
import Branch from '@/services/shared/helper/branch';
import Intercom from '@/services/shared/helper/intercom';
import PushNotification from '@/services/shared/helper/pushNotification';
import clevertap from '@/services/shared/helper/clevertap';
import logrocket from '@/services/shared/helper/logrocket';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'LoginMobile',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonButton,
    IonInput,
    IonItem,
    IonLabel,
    IonSelect,
    IonSelectOption,
    IonImg,
    Field,
    Form,
    ErrorMessage,
    Otp
  },
  setup() {
    const otpError = ref(false);
    const otpMode = ref(false);
    const router = useRouter();
    const phoneNumber = ref('');
    const storage = inject('$storage');
    let countryCode = ref('');
    const getCountryIndex = async () => {
      let currentCountry = await storage.getCurrentLocation();
      countryCode.value = preferredCountryCode[0];
      if (currentCountry.country === 'Malaysia') {
        countryCode.value = preferredCountryCode[1];
      }
    };
    getCountryIndex();
    const { t } = useI18n();
    const vform = reactive({});
    const fullNumber = computed(() => {
      return parseInt(countryCode.value) + vform.values.phoneNumber;
    });
    const { mutate: signInWithOTPRequestFn } = useMutation(signInWithOTPRequest);
    const { mutate: signInWithOTPFn } = useMutation(signInWithOTP);
    const store = useStore();

    const onNext = async (values, actions) => {
      vform.values = values;
      vform.actions = actions;

      if (!otpMode.value) {
        try {
          const res = await signInWithOTPRequestFn({
            phoneNumber: fullNumber.value
          });

          if (res) {
            otpMode.value = true;
          }
        } catch (e) {
          vform.actions.setFieldError('phoneNumber', t('incorrect_phone_number'));
        }
      }
    };

    const loginMobileOtp = async (otp) => {
      try {
        const res = await signInWithOTPFn({
          phoneNumber: fullNumber.value,
          OTP: otp
        });

        if (res) {
          Branch.setIdentity(res.data.signInWithOTP.id);
          storage.setUser(res.data.signInWithOTP).then(() => {
            Branch.sendBranchEvent(Branch.events.LOGIN_WITH_PHONE);
            Intercom.registerUser().then(() => {
              Intercom.trackEvent(Intercom.events.LOGGED_IN);
            });
          });

          PushNotification.subscribeTopic(res.data.signInWithOTP.id);
          clevertap.setUserProfile(res.data.signInWithOTP);
          logrocket.identifyUser({
            id: res.data.signInWithOTP.id,
            name: res.data.signInWithOTP.first_name + ' ' + res.data.signInWithOTP.last_name,
            phone: res.data.signInWithOTP.mobile,
            signInMethod: 'OTP',
            user_type_id: res.data.signInWithOTP.user_type_id
          });
          await store.dispatch('b2c/setUpdateSignAction', true);
          userLoginRoute(router, store, storage);
        }
      } catch (e) {
        otpError.value = true;
      }
    };
    const phoneMask = '#### ####';

    return {
      otpMode,
      countryCode,
      phoneNumber,
      preferredCountryCode,
      onNext,
      phoneMask,
      loginMobileOtp,
      otpError
    };
  }
});
</script>

<style scoped lang="scss">
@import '@/views/Home/home.scss';
</style>

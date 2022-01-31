<template>
  <ion-page v-if="!otpMode">
    <lottie-vue :isOpen="isLoading" :options="defaultOptions" :overlay="{ opacity: 1 }" />
    <ion-header no-border class="bar-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content scroll-events @ionScroll="onScroll" fullscreen="true" class="content">
      <div id="home-container">
        <div class="logo-container">
          <div class="logo">
            <ion-img src="/assets/images/splash_logo.png" alt="Treedots logo" />
          </div>
          <div class="access-description">
            <p>{{ $t('access_signup_des1') }}</p>
            <p>
              {{ $t('access_signup_des2') }}
              <span @click="$router.push('/home')">{{ $t('login') }}</span>
              {{ $t('access_signup_des3') }}
            </p>
          </div>
        </div>
        <div class="groups">
          <Form @submit="onNext" ref="vformRef" v-slot="{ values, meta }">
            <span class="signup">{{ $t('sign_up') }}</span>
            <Field
              name="firstName"
              :label="$t('first_name')"
              :rules="{ required: true }"
              v-slot="{ field, errorMessage }"
            >
              <ion-item
                class="box"
                :class="{
                  error: errorMessage !== undefined
                }"
              >
                <ion-input
                  v-bind="field"
                  autocomplete="new-password"
                  type="text"
                  :placeholder="$t('first_name')"
                ></ion-input>
              </ion-item>
            </Field>
            <Error-Message name="firstName" class="error" as="div" />
            <Field
              name="lastName"
              :label="$t('last_name')"
              :rules="{ required: true }"
              v-slot="{ field, errorMessage }"
            >
              <ion-item
                class="box"
                :class="{
                  error: errorMessage !== undefined
                }"
              >
                <ion-input
                  v-bind="field"
                  autocomplete="new-password"
                  type="text"
                  :placeholder="$t('last_name')"
                ></ion-input>
              </ion-item>
            </Field>
            <Error-Message name="lastName" class="error" as="div" />
            <Field
              name="country"
              :label="$t('country')"
              :rules="{ required: true }"
              v-slot="{ field, errorMessage }"
            >
              <ion-item
                class="box"
                :class="{
                  error: errorMessage !== undefined
                }"
              >
                <ion-label>{{ $t('country') }}</ion-label>
                <ion-select v-bind="field">
                  <ion-select-option v-for="code in allCountries" v-bind:key="code" :value="code.id">{{
                    code.description
                  }}</ion-select-option>
                </ion-select>
              </ion-item>
            </Field>
            <Error-Message name="country" class="error" as="div" />
            <Field
              name="account_type"
              :label="$t('account_type')"
              :rules="{ required: true }"
              v-slot="{ field, errorMessage }"
            >
              <ion-item
                class="box"
                :class="{
                  error: errorMessage !== undefined
                }"
              >
                <ion-label>{{ $t('account_type') }}</ion-label>
                <ion-select v-bind="field">
                  <ion-select-option v-for="act in buyerTypes" v-bind:key="act" :value="act.value">{{
                    act.label
                  }}</ion-select-option>
                </ion-select>
              </ion-item>
            </Field>
            <Error-Message name="account_type" class="error" as="div" />
            <Field
              v-model="phoneNumber"
              name="phoneNumber"
              :label="$t('mobile_number')"
              :rules="{ required: true, phoneValidator: true, max: 11 }"
              v-slot="{ field, errorMessage }"
            >
              <ion-item
                class="box phone-number-group"
                :class="{
                  error: errorMessage !== undefined
                }"
              >
                <ion-label class="hidden">{{ $t('country_code') }}</ion-label>
                <ion-select v-model="countryCode">
                  <ion-select-option v-for="code in preferredCountryCode" v-bind:key="code" :value="code">
                    {{ `${code}` }}</ion-select-option
                  >
                </ion-select>
                <ion-input
                  v-model="phoneNumber"
                  autocomplete="new-password"
                  type="number"
                  :placeholder="$t('mobile_number')"
                ></ion-input>
                <input v-bind="field" type="text" style="display: none" />
              </ion-item>
            </Field>
            <Error-Message name="phoneNumber" class="error" as="div" />
            <Field
              name="userEmail"
              :label="$t('email_address')"
              :rules="{ required: true, email: true }"
              v-slot="{ field, errorMessage }"
            >
              <ion-item
                class="box"
                :class="{
                  error: errorMessage !== undefined
                }"
              >
                <ion-input
                  v-bind="field"
                  autocomplete="new-password"
                  type="email"
                  :placeholder="$t('email_address')"
                ></ion-input>
              </ion-item>
            </Field>
            <Error-Message name="userEmail" class="error" as="div" />
            <Field
              name="userPassword"
              :label="$t('password')"
              :rules="{ required: true }"
              v-slot="{ field, errorMessage }"
            >
              <ion-item
                class="box"
                :class="{
                  error: errorMessage !== undefined
                }"
              >
                <ion-input-password>
                  <ion-input
                    v-bind="field"
                    autocomplete="new-password"
                    type="password"
                    :placeholder="$t('password')"
                  ></ion-input>
                </ion-input-password>
              </ion-item>
            </Field>
            <Error-Message name="userPassword" class="error" as="div" />
            <Field
              name="confirmPassword"
              :label="$t('password')"
              :rules="{ required: true, is: values.userPassword }"
              v-slot="{ field, errorMessage }"
            >
              <ion-item
                class="box"
                :class="{
                  error: values.confirmPassword && errorMessage !== undefined
                }"
              >
                <ion-input-password>
                  <ion-input
                    v-bind="field"
                    autocomplete="new-password"
                    type="password"
                    :placeholder="$t('confirm_password')"
                  ></ion-input>
                </ion-input-password>
              </ion-item>
            </Field>
            <Error-Message v-if="values.confirmPassword" name="confirmPassword" class="error" as="div" />
            <Field name="terms" :rules="{ required: true }" :label="$t('terms')" v-slot="{ field }">
              <div class="terms-item">
                <ion-checkbox v-bind="field"> </ion-checkbox>
                <ion-label>
                  {{ $t('access_signup_terms') }}
                  <span @click="router.push('/main/account/terms-of-use')">
                    {{ $t('terms') }}
                  </span>
                  {{ $t('and') }}
                  <span @click="router.push('/main/account/privacy-policy')">
                    {{ $t('privacy') }}
                  </span>
                </ion-label>
              </div>
            </Field>
            <Error-Message name="terms" class="error terms" as="div" />
            <div class="button-groups t-m-2">
              <ion-button class="home-btn" expand="block" :disabled="!meta.valid" type="submit"
                ><span>{{ $t('sign_up') }}</span></ion-button
              >
              <ion-label class="signup-link"
                >{{ $t('already_have_an_account') }}
                <router-link to="/home"
                  ><strong>{{ $t('log_in') }}</strong></router-link
                >
              </ion-label>
            </div>
          </Form>
        </div>
      </div>
    </ion-content>
  </ion-page>
  <Otp
    v-else
    :title="$t('sign_up')"
    :countryCode="countryCode"
    :phoneNumber="phoneNumber"
    :showError="otpError"
    @cancelOtp="
      otpMode = false;
      otpError = false;
    "
    @retryingOtp="otpError = false"
    @onSubmitOtpCode="signUpOtp"
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
  IonImg,
  IonCheckbox,
  onIonViewWillEnter
} from '@ionic/vue';
import { computed, defineComponent, inject, ref } from 'vue';
import { useRouter } from 'vue-router';
import { countries, checkUser, userSignUp, loginDashboard } from '../../../../services/shared/graphql';
import { useQuery, useResult, useMutation } from '@vue/apollo-composable';
import IonInputPassword from '@/components/Shared/IonInputPassword.vue';
import { Field, Form, ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { preferredCountryCode } from '@/services/shared/helper/home';
import { cipher } from '@/services/shared/helper/cipher';
import Otp from '@/components/Otp';
import LottieVue from '@/components/Shared/Lottie.vue';
import * as animationData from '@/assets/lottie/main-loader.json';
import Branch from '@/services/shared/helper/branch';
import Intercom from '@/services/shared/helper/intercom';
import PushNotification from '@/services/shared/helper/pushNotification';
import clevertap from '@/services/shared/helper/clevertap';
import logrocket from '@/services/shared/helper/logrocket';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'AccessSignUp',
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
    IonInputPassword,
    IonCheckbox,
    Form,
    Field,
    ErrorMessage,
    Otp,
    LottieVue
  },
  setup() {
    const otpError = ref(false);
    const otpMode = ref(false);
    const router = useRouter();
    const encrypt = cipher();
    const store = useStore();
    const storage = inject('$storage');
    const { result } = useQuery(countries);
    const { mutate: signIn } = useMutation(loginDashboard);
    const { mutate: checkNewUser } = useMutation(checkUser);
    const { mutate: addUser } = useMutation(userSignUp);
    const allCountries = useResult(result, null, (data) =>
      data.allCountries.filter(
        (country) => country.description == 'Singapore' || country.description == 'Malaysia'
      )
    );
    // console.log('allCountries = ', allCountries);
    const phoneNumber = ref('');
    const buyerTypes = [
      {
        value: 2,
        label: 'Personal'
      },
      {
        value: 1,
        label: 'Business'
      }
    ];
    const countryCode = ref(preferredCountryCode[0]);
    let vform = {};
    const { t } = useI18n();
    const fullNumber = computed(() => {
      return parseInt(countryCode.value) + phoneNumber.value;
    });
    const isLoading = ref(false);
    const vformRef = ref(null);

    onIonViewWillEnter(() => {
      if (!vformRef.value) {
        return;
      }
      // This somehow makes the form valid, even though the form is not filled.
      // vformRef.value.resetForm();
      // setTimeout(() => {
      //   vformRef.value.resetForm();
      // }, 100)
    });

    const onScroll = (e) => {
      const header = document.querySelector('.bar-header');
      // 173 is height of logo container.
      if (e.detail.scrollTop > 173) {
        header.classList.add('sticky');
      } else {
        header.classList.remove('sticky');
      }
    };

    const getCustomerId = (country_id = this.user.country_id) => {
      switch (country_id) {
        case (country_id = 127):
          return 3419; // Treedots Malaysia Tenant
        default:
          return 2222; // Treedots Singapore Tenant
      }
    };

    const checkUserResult = async (res) => {
      isLoading.value = false;
      if (res.data && res.data.checkUser === null) {
        const payload = {
          email: vform.values.userEmail,
          password: encrypt(vform.values.userPassword),
          mobile: fullNumber.value,
          country_id: vform.values.country,
          first_name: vform.values.firstName,
          last_name: vform.values.lastName,
          buyer_type: vform.values.account_type,
          customer_id: getCustomerId(vform.values.country),
          user_type_id: 6
        };

        // Add user logic. The otp doesn't actually gets verified, btw.
        if (otpMode.value) {
          await addUser(payload);

          const res = await signIn({
            identity: payload.email,
            password: payload.password
          });

          Branch.setIdentity(res.data.signIn.id);
          Branch.trackCompleteRegistration({
            full_name: `${payload.first_name} ${payload.last_name || ''}`.trim(),
            phone: payload.mobile,
            email: payload.email,
            buyer_type: payload.buyer_type == 1 ? 'Business' : 'Personal'
          });

          storage.setUser(res.data.signIn).then(() => {
            Intercom.registerUser().then(() => {
              Intercom.trackEvent(Intercom.events.SIGN_UP);
            });
          });
          // storage.setIsNew({ isNew: true });
          PushNotification.subscribeTopic(res.data.signIn.id);
          clevertap.setUserProfile(res.data.signIn);
          logrocket.identifyUser({
            id: res.data.signIn.id,
            name: res.data.signIn.first_name + ' ' + res.data.signIn.last_name,
            phone: res.data.signIn.mobile,
            signInMethod: 'SIGNUP',
            user_type_id: res.data.signIn.user_type_id
          });
          await store.dispatch('shared/setUserLoggedIn', { userLoggedIn: true });
          await store.dispatch('b2c/setUpdateSignAction', true);
          const path = await storage.getRedirectPath();
          router.replace(path);
          // router.replace({ name: 'Onboarding', params: { userType: res.data.signIn.buyer_type } });
        } else {
          otpMode.value = true;
        }
      } else {
        if (!otpMode.value) {
          if (res.data && res.data.checkUser.email === vform.values.userEmail) {
            vform.actions.setFieldError('userEmail', t('email_already_registered'));
          }

          if (res.data && res.data.checkUser.mobile === fullNumber.value) {
            vform.actions.setFieldError('phoneNumber', t('mobile_already_registered'));
          }

          if (!res.data) {
            vform.actions.setFieldError('phoneNumber', t('validation.phone'));
          }
          // messageAlert('Your number or email has registered', '/shared/auth/email');
        } else {
          otpError.value = true;
        }
      }
    };

    const onNext = async (values, actions) => {
      vform = { values, actions };
      isLoading.value = true;

      const result = await checkNewUser({
        email: vform.values.userEmail,
        mobile: fullNumber.value
      })
        .then((res) => res)
        .catch((error) => error);
      console.log(result);
      checkUserResult(result);
    };

    const signUpOtp = async (otp) => {
      const result = await checkNewUser({
        email: vform.values.email,
        mobile: fullNumber.value,
        otp: otp
      })
        .then((res) => res)
        .catch((error) => error);

      checkUserResult(result);
    };

    return {
      countryCode,
      allCountries,
      preferredCountryCode,
      buyerTypes,
      phoneNumber,
      onNext,
      router,
      signUpOtp,
      otpError,
      otpMode,
      onScroll,
      defaultOptions: { animationData: animationData.default },
      isLoading,
      vformRef
    };
  }
});
</script>

<style scoped lang="scss">
$login-background: '/assets/images/signup-bg.svg';
@import '@/views/Home/home.scss';
@import 'AccessSignUp.scss';
</style>

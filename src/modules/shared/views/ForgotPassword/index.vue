<template>
  <ion-page v-if="!otpMode">
    <ion-header no-border class="bar-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding">{{ $t('reset_password') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true" class="content">
      <div id="home-container">
        <div class="logo-container"></div>
        <div class="flex">
          <ion-text class="title">{{ $t('forgot_your_password') }}</ion-text>
          <ion-text class="description">{{ $t('enter_your_mobile_number') }}</ion-text>
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
            <Error-Message name="phoneNumber" class="error p-a" as="div" />
            <div class="button-groups t-m-2">
              <ion-button class="home-btn" expand="block" :disabled="!meta.valid" type="submit">
                <span>{{ $t('send_verification_code') }}</span>
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
      </div>
    </ion-content>
  </ion-page>
  <Otp
    v-else
    :title="$t('reset_password')"
    :countryCode="countryCode"
    :phoneNumber="phoneNumber"
    :showError="otpError"
    @cancelOtp="
      otpMode = false;
      otpError = false;
    "
    @retryingOtp="otpError = false"
    @onSubmitOtpCode="forgotPasswordOtp"
  ></Otp>
</template>

<script>
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonPage,
  IonToolbar,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonText
} from '@ionic/vue';
import { computed, defineComponent, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { countries, getUserByMobile } from '../../../../services/shared/graphql';
import { useLazyQuery, useQuery, useResult } from '@vue/apollo-composable';
import { Field, Form, ErrorMessage } from 'vee-validate';
import { useI18n } from 'vue-i18n';
import { preferredCountryCode } from '@/services/shared/helper/home';
import Otp from '@/components/Otp';

export default defineComponent({
  name: 'ForgotPassword',
  components: {
    IonContent,
    IonHeader,
    IonTitle,
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
    IonText,
    Field,
    Form,
    ErrorMessage,
    Otp
  },
  setup() {
    const otpError = ref(false);
    const otpMode = ref(false);
    const router = useRouter();
    const { result } = useQuery(countries);
    const allCountries = useResult(result, null, (data) => data.allCountries);
    console.log('allCountries = ', allCountries);
    const phoneNumber = ref('');
    const countryCode = ref(preferredCountryCode[0]);
    const { load: getUserByMobileQuery, onResult: getUserByMobileResult } = useLazyQuery();
    const { t } = useI18n();
    const fullNumber = computed(() => {
      return parseInt(countryCode.value) + vform.values.phoneNumber;
    });
    const vform = reactive({});

    const onNext = (values, actions) => {
      vform.values = values;
      vform.actions = actions;

      getUserByMobileQuery(getUserByMobile, {
        mobile: fullNumber.value
      });
    };
    const phoneMask = '#### ####';

    getUserByMobileResult((res) => {
      if (!res.error) {
        if (!otpMode.value) {
          otpMode.value = true;
        } else {
          router.push({
            params: {
              userId: res.data.getUserByMobile.id
            },
            name: 'ResetPassword'
          });
        }
      } else {
        if (!otpMode.value) {
          vform.actions.setFieldError('phoneNumber', t('incorrect_phone_number'));
        } else {
          otpError.value = true;
        }
      }
    });

    const forgotPasswordOtp = (otp) => {
      getUserByMobileQuery(getUserByMobile, {
        mobile: fullNumber.value,
        otp: otp
      });
    };

    return {
      otpMode,
      otpError,
      countryCode,
      phoneNumber,
      preferredCountryCode,
      allCountries,
      onNext,
      phoneMask,
      forgotPasswordOtp
    };
  }
});
</script>

<style scoped lang="scss">
@import '@/views/Home/home.scss';
@import 'ForgotPassword.scss';
</style>

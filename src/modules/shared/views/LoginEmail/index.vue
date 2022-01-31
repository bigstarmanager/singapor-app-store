<template>
  <ion-page>
    <lottie-vue :isOpen="isLoading" :options="defaultOptions" :overlay="{ opacity: 1 }" />
    <ion-header no-border class="bar-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
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
        <Form @submit="onLogin" v-slot="{ meta, errors, setFieldError }">
          <Field
            name="userEmail"
            :label="$t('email_address')"
            :rules="{ required: true, email: true }"
            v-slot="{ field, errorMessage }"
          >
            <ion-item
              class="box"
              :class="{
                error:
                  errorMessage !== undefined ||
                  errors.userPassword === $t('incorrect_email_or_password_entered')
              }"
            >
              <ion-input
                v-bind="field"
                type="email"
                @ionChange="onEmailUpdate(errors, setFieldError)"
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
                <ion-input v-bind="field" type="password" :placeholder="$t('password')"></ion-input>
              </ion-input-password>
            </ion-item>
          </Field>
          <Error-Message name="userPassword" class="error p-a" as="div" />
          <ion-item class="ion-no-inner-padding forgot-password" lines="none">
            <router-link slot="end" :to="{ name: 'ForgotPassword' }">{{
              $t('forgot_password_1')
            }}</router-link>
          </ion-item>
          <div class="button-groups t-m-2">
            <ion-button class="home-btn" expand="block" :disabled="!meta.valid" type="submit">
              <span>{{ $t('login') }}</span>
            </ion-button>
            <ion-label class="signup-link"
              >Don't have an Account?
              <router-link to="/shared/auth/signup-access"
                ><strong>{{ $t('sign_up') }}</strong></router-link
              >
            </ion-label>
          </div>
        </Form>
      </div>
    </ion-content>
  </ion-page>
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
  IonLabel,
  IonInput,
  IonItem,
  IonImg
} from '@ionic/vue';
import { defineComponent, inject, ref } from 'vue';
import { useMutation } from '@vue/apollo-composable';
import { loginDashboard } from '../../../../services/shared/graphql';
import { cipher } from '../../../../services/shared/helper/cipher';
import { useRouter } from 'vue-router';
import { ErrorMessage, Field, Form } from 'vee-validate';
import IonInputPassword from '@/components/Shared/IonInputPassword.vue';
import { useI18n } from 'vue-i18n';
import LottieVue from '@/components/Shared/Lottie.vue';
import * as animationData from '@/assets/lottie/main-loader.json';
import Branch from '@/services/shared/helper/branch';
import Intercom from '@/services/shared/helper/intercom';
import PushNotification from '@/services/shared/helper/pushNotification';
import clevertap from '@/services/shared/helper/clevertap';
import logrocket from '@/services/shared/helper/logrocket';
import { userLoginRoute } from '@/services/shared/helper/home';
import { useStore } from 'vuex';

export default defineComponent({
  name: 'LoginEmail',
  components: {
    IonContent,
    IonHeader,
    IonPage,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonButton,
    IonLabel,
    IonInput,
    IonItem,
    IonImg,
    Form,
    Field,
    ErrorMessage,
    IonInputPassword,
    LottieVue
  },
  setup() {
    const router = useRouter();
    const encrypt = cipher();
    const { mutate: signIn } = useMutation(loginDashboard);
    const storage = inject('$storage');
    let vform = {};
    const { t } = useI18n();
    const isLoading = ref(false);
    const store = useStore();

    const onLogin = async (values, actions) => {
      vform = { values, actions };
      isLoading.value = true;
      try {
        const res = await signIn({
          identity: values.userEmail,
          password: encrypt(values.userPassword)
        });

        // store user into state
        // Kim: no need store user into state, because the user info is used cross on the entire app
        // store.dispatch('shared/setUser', {
        //   user: res.data.signIn
        // });

        //store user info into storage
        Branch.setIdentity(res.data.signIn.id);
        PushNotification.subscribeTopic(res.data.signIn.id);
        storage.setUser(res.data.signIn).then(() => {
          Branch.sendBranchEvent(Branch.events.LOGIN_WITH_EMAIL);
          Intercom.registerUser().then(() => {
            Intercom.trackEvent(Intercom.events.LOGGED_IN);
          });
        });
        clevertap.setUserProfile(res.data.signIn);
        logrocket.identifyUser({
          id: res.data.signIn.id,
          name: res.data.signIn.first_name + ' ' + res.data.signIn.last_name,
          phone: res.data.signIn.mobile,
          signInMethod: 'EMAIL',
          user_type_id: res.data.signIn.user_type_id
        });
        await store.dispatch('b2c/setUpdateSignAction', true);
        userLoginRoute(router, store, storage);
      } catch (error) {
        isLoading.value = false;
        console.log(error);
        console.log(vform);
        actions.setFieldError('userPassword', t('incorrect_email_or_password_entered'));
      }
    };

    const onEmailUpdate = (errors, setFieldError) => {
      if (errors.userPassword === t('incorrect_email_or_password_entered')) {
        setFieldError('userPassword', '');
      }
    };

    return {
      onLogin,
      defaultOptions: { animationData: animationData.default },
      isLoading,
      onEmailUpdate
    };
  }
});
</script>

<style scoped lang="scss">
@import '@/views/Home/home.scss';
@import 'LoginEmail.scss';
</style>

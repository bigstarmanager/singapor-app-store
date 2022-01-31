<template>
  <ion-page>
    <ion-header no-border class="bar-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
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
        <Form @submit="onResetPassword" v-slot="{ meta, errors, values }">
          <Field
            name="userPassword"
            :label="$t('password')"
            :rules="{ required: true }"
            v-slot="{ field, errorMessage }"
          >
            <ion-item
              class="box"
              :class="{
                error:
                  errorMessage !== undefined || errors.confirmPassword === 'Password entered does not match'
              }"
            >
              <ion-input-password>
                <ion-input v-bind="field" type="password" :placeholder="$t('password')"></ion-input>
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
                <ion-input v-bind="field" type="password" :placeholder="$t('confirm_password')"></ion-input>
              </ion-input-password>
            </ion-item>
          </Field>
          <Error-Message v-if="values.confirmPassword" name="confirmPassword" class="error" as="div" />
          <div class="button-groups t-m-2">
            <ion-button class="home-btn" expand="block" :disabled="!meta.valid" type="submit">
              <span>{{ $t('confirm') }}</span>
            </ion-button>
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
  IonInput,
  IonItem,
  IonImg
} from '@ionic/vue';
import { defineComponent } from 'vue';
import { cipher } from '../../../../services/shared/helper/cipher';
import { useRouter } from 'vue-router';
import { ErrorMessage, Field, Form } from 'vee-validate';
import IonInputPassword from '@/components/Shared/IonInputPassword.vue';
import { useMutation } from '@vue/apollo-composable';
import { updatePassword } from '@/services/shared/graphql';

export default defineComponent({
  name: 'ResetPassword',
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
    IonImg,
    Form,
    Field,
    ErrorMessage,
    IonInputPassword
  },
  props: {
    userId: Number
  },
  beforeRouteEnter: (to, from, next) => {
    if (from.name != 'ForgotPassword') {
      next({
        name: 'Home'
      });
    }
    next();
  },
  setup(props) {
    const router = useRouter();
    const encrypt = cipher();
    const { mutate: updatePasswordFn } = useMutation(updatePassword);

    const onResetPassword = async (values) => {
      // console.log(values, actions, router, props);
      try {
        const res = await updatePasswordFn({
          userId: props.userId,
          password: encrypt(values.userPassword)
        });

        if (res.data.updatePassword) {
          router.push({
            name: 'LoginEmail'
          });
        }
      } catch (e) {
        console.log(e);
      }
    };

    return {
      onResetPassword
    };
  }
});
</script>

<style scoped lang="scss">
@import '@/views/Home/home.scss';
@import 'ResetPassword.scss';
</style>

<template>
  <ion-page>
    <ion-header no-border class="bar-header">
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" @click="$emit('cancelOtp')"></ion-back-button>
        </ion-buttons>
        <ion-title class="ion-no-padding">{{ title }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content fullscreen="true" class="content">
      <div id="home-container">
        <div class="logo-container"></div>
        <div class="flex">
          <ion-text class="title">{{ $t('verify_your_number') }}</ion-text>
          <ion-text
            class="description"
            v-html="$t('please_enter_verification_code', { countryCode: countryCode, number: phoneNumber })"
          ></ion-text>
          <div ref="digitGroup" class="digit-group">
            <input
              :class="{ error: showError }"
              type="tel"
              id="digit-1"
              name="digit-1"
              autocomplete="one-time-code"
              data-next="digit-2"
            />
            <input
              :class="{ error: showError }"
              type="tel"
              id="digit-2"
              name="digit-2"
              data-next="digit-3"
              data-previous="digit-1"
            />
            <input
              :class="{ error: showError }"
              type="tel"
              id="digit-3"
              name="digit-3"
              data-next="digit-4"
              data-previous="digit-2"
            />
            <input
              :class="{ error: showError }"
              type="tel"
              id="digit-4"
              name="digit-4"
              data-previous="digit-3"
            />
          </div>
          <div ref="errorDiv" class="error">{{ showError ? $t('incorrect_verification_code') : '' }}</div>
          <ion-label class="get-code"
            >{{ $t('get_code') }} <strong @click="resendCode">{{ resendCodeText }}</strong></ion-label
          >
        </div>
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
  IonTitle,
  IonPage,
  IonToolbar,
  IonLabel,
  IonText,
  isPlatform
} from '@ionic/vue';
import { computed, defineComponent, onMounted, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { SmsRetriever } from '@ionic-native/sms-retriever';
import { Capacitor } from '@capacitor/core';
dayjs.extend(duration);

// Credits to johnhoulder for the OTP template.
// https://codepen.io/johnhoulder/pen/VOKJPo

export default defineComponent({
  name: 'Otp',
  components: {
    IonContent,
    IonHeader,
    IonTitle,
    IonPage,
    IonToolbar,
    IonBackButton,
    IonButtons,
    IonLabel,
    IonText
  },
  props: {
    title: String,
    countryCode: String,
    phoneNumber: String,
    showError: Boolean
  },
  setup(props, { emit }) {
    const digitGroup = ref(null);
    const { t } = useI18n();
    const getOtpCode = () => {
      const inputs = digitGroup.value.querySelectorAll('input');
      let code = '';
      for (const input of inputs) {
        code += input.value;
      }

      return code;
    };

    const resendCodeDuration = computed(() => {
      return dayjs.duration(duration.value * 1000).format('mm:ss');
    });
    const resendCodeText = computed(() => {
      return duration.value > 0
        ? t('resend_code_in', { duration: resendCodeDuration.value })
        : t('resend_code');
    });
    const duration = ref(59);
    const isSubmitting = ref(false);
    watch(
      () => props.showError,
      (current) => {
        // console.log(`showError: ${props.showError}, current: ${current}`);
        if (current) {
          isSubmitting.value = false;
        }
      }
    );

    const resendCodeFn = () => {
      duration.value--;
      if (duration.value <= 0) {
        clearInterval(resendCodeInterval);
      }
    };

    let resendCodeInterval = setInterval(resendCodeFn, 1000);

    const resendCode = () => {
      if (duration.value <= 0) {
        duration.value = 59;
        resendCodeInterval = setInterval(resendCodeFn, 1000);
      }
    };

    const onSubmitOtpCode = () => {
      isSubmitting.value = true;
      emit('onSubmitOtpCode', getOtpCode());
    };

    const processSMSMessage = (msg) => {
      const pin = msg ? msg.substr(msg.indexOf(':') + 2, 4) : null;
      return /^\d{4}/g.test(pin) ? pin : null;
    };

    const fillInputs = (inputs, code) => {
      let i = 0;
      for (const input of inputs) {
        input.value = code.split('')[i++];
        input.disabled = true;

        if (i === 4) {
          input.disabled = false;
          input.focus();
          setTimeout(() => {
            onSubmitOtpCode();
          }, 100);
        }
      }
    };

    onMounted(() => {
      const inputs = digitGroup.value.querySelectorAll('.digit-group input');

      // OTP Automation
      if (isPlatform('android') && Capacitor.isNativePlatform()) {
        SmsRetriever.startWatching()
          .then(async (res) => {
            fillInputs(inputs, processSMSMessage(res.Message));
          })
          .catch(async (error) => {
            console.log('new message comming: ERROR', error);
          });
      }

      inputs[0].addEventListener('input', function (e) {
        const otpCode = e.target.value;
        if (otpCode.length === 4) {
          fillInputs(inputs, otpCode);
        } else {
          //void filling non numeric and more or less 4 digits
          this.value =
            Number(otpCode.split('')[0]) || otpCode.split('')[0] === '0' ? otpCode.split('')[0] : '';
        }
      });

      for (const inputElem of inputs) {
        if (inputElem !== inputs[0]) {
          inputElem.disabled = true;
        } else {
          setTimeout(() => {
            inputElem.focus();
          }, 100);
        }
        //inputElem.setAttribute('maxlength', 1);
        inputElem.addEventListener('keyup', function (e) {
          const parent = inputElem.parentNode;
          /* Get the keycode from inputted char because some of Android devices always return 229 as a keycode */
          const inputvalue = e.target.value;
          const inputChar = inputvalue.charAt(e.target.selectionStart - 1);
          let keyCode = e.keyCode || e.which;

          if (inputChar && [0, 229].includes(keyCode)) {
            keyCode = inputChar.charCodeAt();
          }

          if (isSubmitting.value) {
            return;
          }

          if (keyCode === 8 || ([0, 229].includes(keyCode) && !inputvalue && !inputChar)) {
            const prev = parent.querySelector('input#' + inputElem.getAttribute('data-previous'));

            if (props.showError) {
              emit('retryingOtp');
            }

            if (prev) {
              inputElem.disabled = true;
              prev.disabled = false;
              prev.focus();
            }
          } else if (
            (keyCode >= 48 && keyCode <= 57) ||
            (keyCode >= 65 && keyCode <= 90) ||
            (keyCode >= 96 && keyCode <= 105)
          ) {
            const next = parent.querySelector('input#' + inputElem.getAttribute('data-next'));

            if (inputElem.value.length !== 1 || props.showError) {
              return;
            }

            if (next) {
              inputElem.disabled = true;
              next.disabled = false;
              next.focus();
            } else {
              onSubmitOtpCode();
            }
          }
        });
      }
    });

    return {
      onSubmitOtpCode,
      digitGroup,
      resendCode,
      resendCodeDuration,
      resendCodeText
    };
  }
});
</script>

<style scoped lang="scss">
@import '@/views/Home/home.scss';
@import 'Otp.scss';
</style>

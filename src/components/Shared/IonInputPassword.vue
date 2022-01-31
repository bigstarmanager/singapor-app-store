<template>
  <slot></slot>
  <ion-img ref="imgElem" @click="toggleVisibility" :src="visibility" />
</template>

<script>
import { IonImg } from '@ionic/vue';
import { defineComponent, onMounted, ref } from 'vue';

const PASSWORD_SHOW = '/assets/images/password-show.svg';
const PASSWORD_HIDE = '/assets/images/password-hide.svg';

export default defineComponent({
  name: 'IonInputPassword',
  components: {
    IonImg
  },
  setup() {
    const imgElem = ref(null);
    const visibility = ref(PASSWORD_SHOW);
    const inputElem = ref(null);

    // Traverse through previous siblings for ion-input element, and assign once found
    onMounted(async () => {
      let prevSibling = imgElem.value.$el.previousElementSibling;
      while (prevSibling) {
        // console.log(prevSibling.tagName);
        if (prevSibling.tagName === 'ION-INPUT') {
          inputElem.value = await prevSibling.getInputElement();
          break;
        }
        prevSibling = prevSibling.previousElementSibling;
      }
    });

    return {
      imgElem,
      visibility,
      inputElem
    };
  },
  computed: {
    showPassword() {
      return this.visibility === PASSWORD_SHOW ? 'password' : 'text';
    }
  },
  methods: {
    toggleVisibility() {
      if (this.visibility == PASSWORD_SHOW) {
        this.visibility = PASSWORD_HIDE;
      } else {
        this.visibility = PASSWORD_SHOW;
      }

      this.inputElem.setAttribute('type', this.showPassword);
    }
  }
});
</script>
<style lang="scss"></style>

<template>
  <div v-show="isOpen" class="lottie" :style="lottieContainerStyle" ref="lavContainer">
    <div v-if="overlay" class="overlay" ref="refOverlay"></div>
  </div>
</template>

<script>
import lottie from 'lottie-web';
import { defineComponent, inject, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue';

// CREDITS: https://github.com/chenqingspring/vue-lottie/blob/master/src/lottie.vue

/**
   * Creates a div wrapper containing an svg.
   * @displayName Lottie
   *
   * Example usage:
   * <lottie-vue
      :isOpen="isLoadingPage"
      :options="defaultOptions"
      :height="400"
      :width="400"
      :overlay="{opacity:0.5}"
      v-on:animCreated="handleAnimation"/>
   */
export default defineComponent({
  name: 'Lottie',
  props: {
    /**
     * Available options for lottie:
     *
     * https://github.com/airbnb/lottie-web#other-loading-options
     */
    options: {
      type: Object,
      required: true
    },
    /**
     * The height of the div containing svg.
     */
    height: Number,
    /**
     * The width of the div containing svg.
     */
    width: Number,
    /**
     * Adds an overlay behind svg.
     * If an overlay is specified, the width and height
     * is set to the entire viewport.
     * Also, this component will be parented under
     * ion-app.
     */
    overlay: {
      /**
       * Opacity of the overlay. Range between 0-1.
       */
      opacity: Number
    },
    /**
     * Only show this component if true.
     */
    isOpen: Boolean
  },
  /**
   * Emits animCreated event with AnimationItem as its parameter.
   */
  emits: ['animCreated'],
  setup(props, context) {
    const lavContainer = ref(null);
    const refOverlay = ref(null);
    const ionApp = inject('$ionApp');
    let anim;
    const createAnim = () => {
      if (anim) {
        anim.destroy();
      }
      anim = lottie.loadAnimation({
        container: lavContainer.value,
        renderer: 'svg',
        loop: props.options.loop !== false,
        autoplay: props.options.autoplay !== false,
        animationData: props.options.animationData,
        rendererSettings: props.options.rendererSettings
      });
      context.emit('animCreated', anim);
    };

    onMounted(() => {
      createAnim();
    });

    onBeforeUnmount(() => {
      lavContainer.value.remove();
    });

    watch(
      () => props.options.animationData,
      () => {
        createAnim();
      }
    );

    const lottieContainerStyle = ref({
      width: props.width ? `${props.width}px` : '100%',
      height: props.height ? `${props.height}px` : '100%'
    });

    watchEffect(() => {
      lottieContainerStyle.value = {
        width: props.width ? `${props.width}px` : '100%',
        height: props.height ? `${props.height}px` : '100%'
      };
    });

    if (props.overlay) {
      Object.assign(lottieContainerStyle.value, {
        width: '100vw',
        height: '100vh',
        position: 'absolute'
      });

      /**
       * This custom implementation follows the behaviour of ion-loading where
       * the element is parented under ion-app.
       * https://ionicframework.com/docs/api/loading
       *
       * The reason why we do this is because child's stacking order cannot
       * override its parent.
       * https://philipwalton.com/articles/what-no-one-told-you-about-z-index/
       */
      (async () => {
        // Wait until ion-app is mounted.
        await ionApp;
        if (lavContainer.value) {
          const svg = lavContainer.value.querySelector('svg');
          svg.classList.add('svg-overlay');
          refOverlay.value.style.opacity = props.overlay.opacity ?? 1;
          ionApp.value.$el.appendChild(lavContainer.value);
        }
      })();
    }

    return {
      lottieContainerStyle,
      lavContainer,
      refOverlay,
      ionApp
    };
  }
});
</script>
<style lang="scss">
.lottie {
  overflow: hidden;
  margin: 0 auto;

  .svg-overlay {
    z-index: 555;
    position: absolute;
  }

  .overlay {
    width: 100%;
    height: 100%;
    background-color: rgb(255, 255, 255);
    z-index: 554;
    position: absolute;
  }
}
</style>

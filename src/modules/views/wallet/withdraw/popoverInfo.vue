<template>
  <div class="popover">
    <p class="info-label">{{ $t('wallet.info_withdraw') }}</p>
    <p class="info-content">{{ $t('wallet.main_info_withdraw') }}</p>
  </div>
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'WithdrawInfo'
});
</script>

<style scoped lang="scss">
@import 'index';
</style>

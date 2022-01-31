<template>
  <ion-toolbar color="primary">
    <div class="tool-bar-container">
      <ion-buttons slot="start">
        <ion-back-button></ion-back-button>
      </ion-buttons>
      <div>
        <ion-title class="tittle-container" v-if="tittle"> {{ tittle }}</ion-title>
      </div>
      <ion-searchbar v-if="!tittle" placeholder="Search for food" color="light"></ion-searchbar>
      <div class="icon" @click="router.push('chat')">
        <ion-icon :icon="icons.chatboxOutline"></ion-icon>
      </div>
      <div class="icon" @click="CP_clicked = !CP_clicked">
        <ion-icon
          :icon="!CP_clicked ? icons.locationOutline : ''"
          :src="CP_clicked ? '/assets/location_white.svg' : ''"
        ></ion-icon>
      </div>
    </div>
  </ion-toolbar>
</template>

<script>
import { chatboxOutline, locationOutline } from 'ionicons/icons';
export default {
  name: 'ToolBar',
  data: () => ({
    CP_clicked: false,
    tittle: '',
    icons: {
      chatboxOutline,
      locationOutline
    }
  })
};
</script>

<style>
.tool-bar-container {
  display: flex;
  padding-top: 8px;
  padding-left: 4px;
  padding-right: 10px;
}
.icon {
  font-size: 20px;
  color: white;
  margin-left: 8px;
  margin-right: 4px;
  margin-top: 10px;
}
.tittle-container {
  margin-top: 14px;
  margin-bottom: 14px;
}
</style>

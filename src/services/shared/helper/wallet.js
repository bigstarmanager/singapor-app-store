import { toastController } from '@ionic/core';
import { Clipboard } from '@ionic-native/clipboard';

// This function is UNTESTED for BUILDS, but works for browser
export function copyToClipboard(text) {
  // https://ionicframework.com/docs/native/clipboard
  // For Android, iOS, Windows Phone 8
  Clipboard.copy(text);

  // For Desktop
  navigator.clipboard.writeText(text).then(
    () => {
      // console.log('Async: Copying to clipboard was successful!');
      showToast('Copied to clipboard.');
    },
    function (err) {
      showToast('Failed to copy to clipboard.');
      console.error('Async: Could not copy text: ', err);
    }
  );
}

export async function showToast(message) {
  const toast = await toastController.create({
    message: message,
    duration: 3000
  });

  toast.present();
}

import { Capacitor } from '@capacitor/core';
import { CleverTap } from '@ionic-native/clevertap';
import meta from '../../../../package.json';

const ct = CleverTap;

const { VUE_APP_ENV } = process.env;

const initialize = () => {
  if (!Capacitor.isNativePlatform()) return;
  document.addEventListener('deviceready', onDeviceReady, false);
  // document.addEventListener('onCleverTapProfileSync', onCleverTapProfileSync, false);
  // document.addEventListener('onCleverTapProfileDidInitialize', onCleverTapProfileDidInitialize, false);
  // document.addEventListener('onCleverTapInAppNotificationDismissed', onCleverTapInAppNotificationDismissed, false);

  // deeplink handler
  // document.addEventListener('onDeepLink', onDeepLink, false);

  //push notification handler
  // document.addEventListener('onPushNotification', onPushNotification, false);
  // document.addEventListener('onCleverTapInboxDidInitialize', onCleverTapInboxDidInitialize, false);
  // document.addEventListener('onCleverTapInboxMessagesDidUpdate', onCleverTapInboxMessagesDidUpdate, false);
  // document.addEventListener('onCleverTapInboxButtonClick', onCleverTapInboxButtonClick, false);
  // document.addEventListener('onCleverTapInAppButtonClick', onCleverTapInAppButtonClick, false);
  // document.addEventListener('onCleverTapFeatureFlagsDidUpdate', onCleverTapFeatureFlagsDidUpdate, false);
  // document.addEventListener('onCleverTapProductConfigDidInitialize', onCleverTapProductConfigDidInitialize, false);
  // document.addEventListener('onCleverTapProductConfigDidFetch', onCleverTapProductConfigDidFetch, false);
  // document.addEventListener('onCleverTapProductConfigDidActivate', onCleverTapProductConfigDidActivate, false);
  // document.addEventListener('onCleverTapExperimentsUpdated', onCleverTapExperimentsUpdated, false);
  // document.addEventListener('onCleverTapDisplayUnitsLoaded', onCleverTapDisplayUnitsLoaded, false);
  // document.addEventListener('onCleverTapPushNotificationTappedWithCustomExtras', onCleverTapPushNotificationTappedWithCustomExtras, false);
  // document.addEventListener('onCleverTapPushAmpPayloadDidReceived', onCleverTapPushAmpPayloadDidReceived, false);
};

const onDeviceReady = () => {
  VUE_APP_ENV !== 'production' && ct.setDebugLevel(1);

  ct.notifyDeviceReady();

  Capacitor.getPlatform() === 'ios' && ct.registerPush();

  ct.enablePersonalization();

  //Create notification channel for Android O and above
  const channel = VUE_APP_ENV === 'production' ? 'com.thetreedots.social' : 'com.thetreedots.social.testing';
  ct.createNotificationChannel(channel, 'Notification', 'TreeDots App Push Notification', 5, true);
  /** use this for development testing on real device */
  // ct.profileGetCleverTapID().then((id) => {
  //   console.log('CleverTapID: ' + id);
  // });
};

const setPushToken = (token) => {
  if (!Capacitor.isNativePlatform()) return;
  ct.setPushToken(token);
};

const uninitialize = () => {
  if (!Capacitor.isNativePlatform()) return;
  document.removeEventListener('deviceready', onDeviceReady, false);
  // document.removeEventListener('onCleverTapProfileSync', onCleverTapProfileSync, false);
  // document.removeEventListener('onCleverTapProfileDidInitialize', onCleverTapProfileDidInitialize, false);
  // document.removeEventListener('onCleverTapInAppNotificationDismissed', onCleverTapInAppNotificationDismissed, false);

  // deeplink handler
  // document.removeEventListener('onDeepLink', onDeepLink, false);

  // push notification handler
  // document.removeEventListener('onPushNotification', onPushNotification, false);
  // document.removeEventListener('onCleverTapInboxDidInitialize', onCleverTapInboxDidInitialize, false);
  // document.removeEventListener('onCleverTapInboxMessagesDidUpdate', onCleverTapInboxMessagesDidUpdate, false);
  // document.removeEventListener('onCleverTapInboxButtonClick', onCleverTapInboxButtonClick, false);
  // document.removeEventListener('onCleverTapInAppButtonClick', onCleverTapInAppButtonClick, false);
  // document.removeEventListener('onCleverTapFeatureFlagsDidUpdate', onCleverTapFeatureFlagsDidUpdate, false);
  // document.removeEventListener('onCleverTapProductConfigDidInitialize', onCleverTapProductConfigDidInitialize, false);
  // document.removeEventListener('onCleverTapProductConfigDidFetch', onCleverTapProductConfigDidFetch, false);
  // document.removeEventListener('onCleverTapProductConfigDidActivate', onCleverTapProductConfigDidActivate, false);
  // document.removeEventListener('onCleverTapExperimentsUpdated', onCleverTapExperimentsUpdated, false);
  // document.removeEventListener('onCleverTapDisplayUnitsLoaded', onCleverTapDisplayUnitsLoaded, false);
  // document.removeEventListener('onCleverTapPushNotificationTappedWithCustomExtras', onCleverTapPushNotificationTappedWithCustomExtras, false);
  // document.removeEventListener('onCleverTapPushAmpPayloadDidReceived', onCleverTapPushAmpPayloadDidReceived, false);
};

const setUserProfile = (signInData) => {
  if (!Capacitor.isNativePlatform()) return;
  try {
    const { id, email, first_name, last_name, mobile, gender, birth_date, country, type } = signInData;
    const phone = mobile ? (mobile.startsWith('+') ? mobile : `+${mobile}`) : '';
    const fullName = `${first_name} ${last_name}`;
    const dob = birth_date ? new Date(birth_date) : '';
    const profile = {
      Identity: id,
      Name: fullName,
      Email: email,
      Phone: phone,
      Gender: gender ? gender.toUpperCase() : '',
      DOB: dob,
      Country_Code: country?.name,
      Country: country?.description,
      User_ID: id,
      User_Type: type?.name,
      User_App_Version: meta.version,
      User_App_Release_Date: meta.htmlVersion,
      'MSG-email': true,
      'MSG-push': true,
      'MSG-sms': true,
      'MSG-whatsapp': true
    };
    ct.onUserLogin(profile);
  } catch (error) {
    console.log('onUserLogin', error);
  }
};

const clearUserProfile = () => {
  if (!Capacitor.isNativePlatform()) return;
  ct.profileSet({
    'MSG-push': false
  });
};

const setLocation = (lat, lng) => {
  if (!Capacitor.isNativePlatform()) return;
  ct.setLocation(lat, lng);
};

const setState = (state) => {
  if (!Capacitor.isNativePlatform()) return;
  ct.profileSet({
    State: state
  });
};

const setLastJoinedHub = (hub) => {
  if (!Capacitor.isNativePlatform()) return;
  ct.profileSet({
    last_joined_hub_alias_name: hub.alias_name,
    last_joined_hub_name: hub.name,
    last_joined_hub_address: `${hub.road}, ${hub.city} ${hub.postal_code}`
  });
};

const recordEventWithName = (name) => {
  if (!Capacitor.isNativePlatform()) return;
  ct.recordEventWithName(name);
};

const recordEventWithNameAndProps = (name, props) => {
  if (!Capacitor.isNativePlatform()) return;
  ct.recordEventWithNameAndProps(name, props);
};
const clevertap = {
  setPushToken,
  initialize,
  uninitialize,
  setUserProfile,
  clearUserProfile,
  setLocation,
  setState,
  setLastJoinedHub,
  recordEventWithName,
  recordEventWithNameAndProps
};

export default clevertap;

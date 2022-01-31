import { Capacitor } from '@capacitor/core';
import { Intercom as IntercomPlugin } from '@capacitor-community/intercom';

/**
 *
 * Was developed on `@capacitor-community/intercom` v3.0.1
 *
 * Documentation:
 * https://github.com/capacitor-community/intercom/
 *
 * Events detail:
 * https://docs.google.com/spreadsheets/d/1tdHd1O3l2iCewEmujT5t93zjasW4aooyMLwGEno9gFc/edit#gid=1199226586
 *
 */
const events = {
  SIGN_UP: 'sign-up',
  LOGGED_IN: 'logged-in',
  JOIN_COLLECTION_POINT: 'joined-collection-point',
  ORDER_PLACED: 'order-placed',
  ADD_CARD: 'add_card',
  CANCEL_ITEM: 'cancel_item'
};
let storage = null;
const isNative = Capacitor.isNativePlatform();
const TAG = 'VUE_INTERCOM';

/**
 * @param {TDStorage} TDStorage
 */
const init = (TDStorage) => {
  storage = TDStorage;
};

const registerUser = async () => {
  if (!isNative) return;
  try {
    const user = await getUserInfo();
    if (user?.user_id) {
      await IntercomPlugin.registerIdentifiedUser({
        userId: `${user.user_id}`,
        email: user.user_email
      });
    }
  } catch (error) {
    console.error(`${TAG} [registerUser: Error]`, error.message);
  }
};

const logout = async () => {
  if (!isNative) return;
  try {
    await IntercomPlugin.logout();
  } catch (error) {
    console.error(`${TAG} [logout: Error]`, error.message);
  }
};

const getUserInfo = async () => {
  try {
    let user = await storage.getUser();
    return {
      user_id: user?.id || null,
      user_email: user?.email || null,
      user_full_name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
      user_type: user?.type?.name || null,
      user_country: user?.country?.description || null
    };
  } catch (error) {
    return {};
  }
};

/**
 *
 * @param {String} eventName
 * @param {Object} metadata
 * @returns
 */
const trackEvent = async (eventName, metadata = null) => {
  if (!isNative) return;
  try {
    await IntercomPlugin.logEvent({
      name: eventName,
      data: metadata ? metadata : undefined
    });
  } catch (error) {
    console.error(`${TAG} [trackEvent: Error]`, error.message);
  }
};

const Intercom = {
  events,
  init,
  registerUser,
  logout,
  trackEvent
};

export default Intercom;

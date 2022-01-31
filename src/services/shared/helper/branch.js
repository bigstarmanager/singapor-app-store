import { Capacitor } from '@capacitor/core';
import { BranchDeepLinks } from 'capacitor-branch-deep-links';
import store from '../../../store';

/**
 * Event Documentation:
 * https://help.branch.io/developers-hub/docs/tracking-commerce-content-lifecycle-and-custom-events
 *
 * Standar event name:
 * https://github.com/BranchMetrics/android-branch-deep-linking-attribution/blob/master/Branch-SDK/src/main/java/io/branch/referral/util/BRANCH_STANDARD_EVENT.java
 */
const events = {
  // Standard Events
  ADD_TO_CART: 'ADD_TO_CART',
  VIEW_CART: 'VIEW_CART',
  ADD_PAYMENT_INFO: 'ADD_PAYMENT_INFO',
  PURCHASE: 'PURCHASE',
  VIEW_ITEM: 'VIEW_ITEM',
  VIEW_ITEMS: 'VIEW_ITEMS',
  COMPLETE_REGISTRATION: 'COMPLETE_REGISTRATION',

  // Custom Events
  LOGIN_WITH_PHONE: 'LOGIN_WITH_PHONE',
  LOGIN_WITH_EMAIL: 'LOGIN_WITH_EMAIL',
  JOIN_HUB: 'JOIN_HUB',
  JOIN_HUB_WHATSAPP: 'JOIN_HUB_WHATSAPP',
  CLOSE_APP: 'CLOSE_APP'
};
let storage = null;
let clickedBranchLink = false;
const isNative = Capacitor.isNativePlatform();
const TAG = 'VUE_BRANCH';

/**
 * @param {TDStorage} TDStorage
 */
const init = (TDStorage) => {
  storage = TDStorage;
  if (isNative) addBranchDeeplinkLister();
};

const addBranchDeeplinkLister = () => {
  BranchDeepLinks.addListener('init', (event) => {
    // Retrieve deeplink keys from 'referringParams' and evaluate the values to determine where to route the user
    // Check '+clicked_branch_link' before deciding whether to use your Branch routing logic
    const referringParams = event?.referringParams || {};
    clickedBranchLink = referringParams['+clicked_branch_link'] || false;
  });

  BranchDeepLinks.addListener('initError', (error) => {
    console.error(TAG, JSON.stringify(error));
  });
};

const getUserInfo = async () => {
  try {
    let user = await storage.getUser();
    const hub = store.getters['b2c/getSelectedHub'];
    return {
      user_id: user?.id || null,
      user_full_name: `${user?.first_name || ''} ${user?.last_name || ''}`.trim(),
      user_type: user?.type?.name || null,
      user_country: user?.country?.description || null,
      buyer_type: 'B2C',
      hub: hub?.name || null
    };
  } catch (error) {
    return {};
  }
};

const sendBranchEvent = async (eventName, metadata, customData) => {
  if (isNative && eventName) {
    try {
      const user = await getUserInfo();
      const additionalMetadata = metadata || {};
      const additionalCustomData = customData || {};
      BranchDeepLinks.sendBranchEvent({
        eventName: eventName,
        metaData: {
          ...additionalMetadata,
          customData: {
            ...user,
            ...additionalCustomData
          }
        }
      });
    } catch (error) {
      console.error(`${TAG} [${eventName}: Error]`, error.message);
    }
  }
};

/**
 * @param {Number} newIdentity
 */
const setIdentity = (newIdentity) => {
  if (isNative && newIdentity) {
    BranchDeepLinks.setIdentity({ newIdentity: `${newIdentity}` })
      .then((res) => {
        console.log(`${TAG} [setIdentity]`, JSON.stringify(res.referringParams));
      })
      .catch((err) => {
        console.error(`${TAG} [setIdentity: Error]`, err.message);
      });
  }
};

const logout = () => {
  if (!isNative) return;
  BranchDeepLinks.logout()
    .then((res) => {
      console.log(`${TAG} [logout]`, JSON.stringify(res.logged_out));
    })
    .catch((err) => {
      console.error(`${TAG} [logout: Error]`, err.message);
    });
};

/**
 * @param {Object} payload
 */
const trackCompleteRegistration = (payload) => {
  if (isNative && clickedBranchLink) {
    try {
      BranchDeepLinks.sendBranchEvent({
        eventName: events.COMPLETE_REGISTRATION,
        metaData: {
          customData: payload
        }
      });
    } catch (error) {
      console.error(`${TAG} [trackCompleteRegistration: Error]`, error.message);
    }
  }
};

/**
 *
 * @param {String} searchQuery
 * @param {String} category
 */
const trackViewItems = (searchQuery, category) => {
  try {
    sendBranchEvent(events.VIEW_ITEMS, { searchQuery }, { category });
  } catch (error) {
    console.error(`${TAG} [trackViewItems: Error]`, error.message);
  }
};

/**
 *
 * @param {String} tenant
 * @param {String} product
 */
const trackViewItem = (tenant, product) => {
  try {
    sendBranchEvent(events.VIEW_ITEM, { description: 'View Product' }, { tenant, product });
  } catch (error) {
    console.error(`${TAG} [trackViewItem: Error]`, error.message);
  }
};

const trackAddToCart = async ({
  tenant,
  product,
  sku,
  price,
  quantity,
  is_order_by_weight,
  total_weight
}) => {
  try {
    let user = await storage.getUser();
    sendBranchEvent(events.ADD_TO_CART, {
      contentMetadata: [
        {
          productName: product,
          sku,
          price,
          quantity,
          tenant,
          total_weight,
          is_order_by_weight: is_order_by_weight ? 'Yes' : 'No',
          currency: user?.country?.currency_code || undefined
        }
      ]
    });
  } catch (error) {
    console.error(`${TAG} [trackAddToCart: Error]`, error.message);
  }
};

/**
 *
 * @param {String} brand
 * @param {String} country
 * @param {String} funding
 */
const trackAddPaymentInfo = (brand, country, funding) => {
  try {
    sendBranchEvent(events.ADD_PAYMENT_INFO, {}, { brand, country, funding });
  } catch (error) {
    console.error(`${TAG} [addPaymentInfo: Error]`, error.message);
  }
};

const trackPurchase = async ({ order_id, revenue, tax, payment_method, voucher_code, items }) => {
  try {
    /** each item in `items` should be like this
     * {
     * 	product: 'Beef Slice',
     * 	sku: 'Frozen Beef Slice (2 KG)',
     * 	price: 340.0000,
     * 	quantity: 2,
     * 	is_order_by_weight: 0,
     * 	weight: 20,
     * 	tenant: 'TreeDots',
     * 	order_item_id: 1232,
     * }
     */

    let user = await storage.getUser();
    sendBranchEvent(
      events.PURCHASE,
      {
        transactionID: order_id,
        revenue,
        tax,
        coupon: voucher_code,
        currency: user?.country?.currency_code || undefined,
        contentMetadata: items
      },
      {
        payment_method
      }
    );
  } catch (error) {
    console.error(`${TAG} [trackPurchase: Error]`, error.message);
  }
};

const Branch = {
  events,
  init,
  sendBranchEvent,
  setIdentity,
  logout,
  trackCompleteRegistration,
  trackViewItems,
  trackViewItem,
  trackAddToCart,
  trackAddPaymentInfo,
  trackPurchase
};

export default Branch;

const { findIndex, map, merge, remove, update } = require('lodash');

const state = () => ({
  allProducts: null,
  userNotifications: [],
  allOrders: [],
  voucher: null,
  cart: null,
  updateProfile: null,
  lang: 'en-us',
  selected_card: null,
  card: null,
  userChats: [],
  allCategories: [],
  selected_mainCat_id: 0,
  selected_cancel_product_id: 0,
  sendBirdDetails: null,
  product: null,
  origin: null,
  customOrigin: null,
  selectedCP: null,
  previousHub: null,
  selectedHub: null,
  activeAllProduct: true,
  setSupplier: null,
  updateNotificationPage: false,
  updateOrdersPage: false,
  isNewMessage: false,
  // Always an empty object, only used to pass parameters to previousRouteState. See main.js.
  previousRouteParams: {},
  previousRouteState: {},
  // Used to handle events which otherwise cannot be handled via normal means. For example, when a user has added to cart from product-listing, we want to refetch cart when entering cart page.
  applicationState: {},
  selectedCardPayment: false,
  selectedGrabpayAndFpx: null,
  orderTotalAmount: 0,
  ewalletAmount: 0,
  updateLocation: false,
  newNotification: false,
  newCart: false,
  updateSignAction: false,
  getAllVouchers: {
    number_of_vouchers: 0,
    vouchers: []
  },
  checkoutGrabPayFpx: null,
  itemsCheckoutGrabPayFpx: null
});

const defaultStoreState = () => {
  return {
    card: null,
    voucher: null
  };
};

const getters = {
  getAllProducts(state) {
    return state.allProducts;
  },
  getCart(state) {
    return state.cart;
  },
  updateProfile(state) {
    return state.updateProfile;
  },
  getLang(state) {
    return state.lang;
  },
  getSelectedCard(state) {
    return state.selected_card;
  },
  getCard(state) {
    return state.card;
  },
  getCartSelectedProducts(state) {
    if (state.cart == null) {
      return null;
    }

    const tempCart = [];
    for (const item of state.cart) {
      let tempItem = {};
      Object.assign(tempItem, item);

      const products = item.products.filter((o) => o.isChecked);
      tempItem.products = products;

      if (products.length > 0) {
        tempCart.push(tempItem);
      }
    }

    return tempCart;
  },
  getVoucher(state) {
    return state.voucher;
  },
  currentVoucherCode(state) {
    return state.voucher ? state.voucher?.code || state.voucher?.voucher_code : null;
  },
  isVoucherActive(state) {
    return state.voucher ? true : false;
  },
  calculateDiscount(state) {
    const voucherDiscount = state.voucher ? (state.voucher?.order?.total_discount_amount ?? 0) / 100 : 0;
    return voucherDiscount;
  },
  getSelectedMainCatID: (state) => state.selected_mainCat_id,
  getSelectedCancelProductID: (state) => state.selected_cancel_product_id,
  getSendBirdDetails: (state) => state.sendBirdDetails,
  getAllCategories: (state) => state.allCategories,
  getProduct: (state) => state.product,
  getOrigin: (state) => state.origin,
  getCustomOrigin: (state) => state.customOrigin,
  getSelectedCP: (state) => state.selectedCP,
  getPreviousHub: (state) => state.previousHub,
  getSelectedHub: (state) => state.selectedHub,
  getActiveAllProduct: (state) => state.activeAllProduct,
  getPreviousRouteState(state) {
    return state.previousRouteState;
  },
  getApplicationState(state) {
    return state.applicationState;
  },
  getSupplier: (state) => state.setSupplier,
  getAllNotification: (state) => state.userNotifications,
  getupdateNotificationPage: (state) => state.updateNotificationPage,
  getupdateOrdersPage: (state) => state.updateOrdersPage,
  getIsNewMessage: (state) => state.isNewMessage,
  getNewNotification: (state) => state.newNotification,
  getNewCart: (state) => state.newCart,
  getSelectedCardPayment: (state) => state.selectedCardPayment,
  getSelectedGrabpayAndFpx: (state) => state.selectedGrabpayAndFpx,
  getOrderTotalAmount: (state) => state.orderTotalAmount,
  getEwalletAmount: (state) => state.ewalletAmount,
  getUpdateLocation: (state) => state.updateLocation,
  getUpdateSignAction: (state) => state.updateSignAction,
  getAllVouchers: (state) => state.getAllVouchers,
  getCheckoutGrabPayFpx: (state) => state.checkoutGrabPayFpx,
  getItemsCheckoutGrabPayFpx: (state) => state.itemsCheckoutGrabPayFpx
};

const actions = {
  setAllProducts({ commit }, payload) {
    commit('setAllProducts', payload.allProducts);
  },
  setAllOrders({ commit }, payload) {
    commit('setAllOrders', payload.allOrders);
  },
  setVoucher({ commit }, payload) {
    commit('setVoucher', payload);
  },
  setCart({ commit }, payload) {
    commit('setCart', payload);
  },
  setUpdateProfile({ commit }, payload) {
    commit('setUpdateProfile', payload);
  },
  setLang({ commit }, payload) {
    commit('setLang', payload);
  },
  setSelectedCard({ commit }, payload) {
    commit('setSelectedCard', payload);
  },
  setCard({ commit }, payload) {
    commit('setCard', payload);
  },
  removeProductFromCart({ commit }, product) {
    commit('removeProductFromCart', product);
  },
  setUserChatList({ commit }, payload) {
    commit('setUserChatList', payload);
  },
  deleteUserNotification({ commit }, payload) {
    commit('deleteUserNotification', payload);
  },
  readAllUserNotifications({ commit }, payload) {
    commit('readAllUserNotifications', payload);
  },
  setUserNotifications({ commit }, payload) {
    commit('setUserNotifications', payload);
  },
  updateUserNotification({ commit }, payload) {
    commit('updateUserNotification', payload);
  },
  setSelectedMainCatID({ commit }, payload) {
    commit('setSelectedMainCatID', payload.id);
  },
  setSelectedCancelProductID({ commit }, payload) {
    commit('setSelectedCancelProductID', payload.id);
  },
  setSupplier({ commit }, payload) {
    commit('setSupplier', payload.setSupplier);
  },
  setCategories({ commit }, payload) {
    commit('setCategories', payload.allCategories);
  },
  setSendBirdDetails({ commit }, payload) {
    commit('setSendBirdDetails', payload);
  },
  setProduct({ commit }, payload) {
    commit('setProduct', payload.product);
  },
  setOrigin({ commit }, payload) {
    commit('setOrigin', payload);
  },
  setCustomOrigin({ commit }, payload) {
    commit('setCustomOrigin', payload);
  },
  setSelectedCP({ commit }, payload) {
    commit('setSelectedCP', payload);
  },
  setPreviousHub({ commit }, payload) {
    commit('setPreviousHub', payload);
  },
  setSelectedHub({ commit }, payload) {
    commit('setSelectedHub', payload);
  },
  setActiveAllProduct({ commit }, payload) {
    commit('setActiveAllProduct', payload);
  },
  setPreviousRouteParams({ commit }, payload) {
    commit('setPreviousRouteParams', payload);
  },
  setPreviousRouteState({ commit }, payload) {
    commit('setPreviousRouteState', payload);
  },
  setApplicationState({ commit }, payload) {
    commit('setApplicationState', payload);
  },
  addApplicationState({ commit }, payload) {
    commit('addApplicationState', payload);
  },
  removeApplicationState({ commit }, payload) {
    commit('removeApplicationState', payload);
  },
  resetStore({ commit }) {
    commit('resetStore');
  },
  setUpdateNotificationPage({ commit }, payload) {
    commit('setUpdateNotificationPage', payload.status);
  },
  setUpdateOrdersPage({ commit }, payload) {
    commit('setUpdateOrdersPage', payload.status);
  },
  setIsNewMessage({ commit }, payload) {
    commit('setIsNewMessage', payload);
  },
  setNewNotification({ commit }, payload) {
    commit('setNewNotification', payload.status);
  },
  setNewCart({ commit }, payload) {
    commit('setNewCart', payload.status);
  },
  setSelectedCardPayment({ commit }, payload) {
    commit('setSelectedCardPayment', payload);
  },
  setSelectedGrabpayAndFpx({ commit }, payload) {
    commit('setSelectedGrabpayAndFpx', payload);
  },
  setOrderTotalAmount({ commit }, payload) {
    commit('setOrderTotalAmount', payload);
  },
  setEwalletAmount({ commit }, payload) {
    commit('setEwalletAmount', payload);
  },
  setUpdateLocation({ commit }, payload) {
    commit('setUpdateLocation', payload);
  },
  setUpdateSignAction({ commit }, payload) {
    commit('setUpdateSignAction', payload);
  },
  setAllVouchers({ commit }, payload) {
    commit('setAllVouchers', payload);
  },
  setCheckoutGrabPayFpx({ commit }, payload) {
    commit('setCheckoutGrabPayFpx', payload);
  },
  setItemsCheckoutGrabPayFpx({ commit }, payload) {
    commit('setItemsCheckoutGrabPayFpx', payload);
  }
};

const mutations = {
  setAllProducts(state, payload) {
    state.allProducts = payload;
  },
  setAllOrders(state, payload) {
    state.allOrders = payload;
  },
  setVoucher(state, payload) {
    state.voucher = payload;
  },
  setCart(state, payload) {
    state.cart = payload;
  },
  setUpdateProfile(state, payload) {
    state.updateProfile = payload;
  },
  setLang(state, payload) {
    state.updateLanguage = payload;
  },
  setSelectedCard(state, payload) {
    state.removeStripeCard = payload;
  },
  setCard(state, payload) {
    state.card = payload;
  },
  removeProductFromCart(state, product) {
    state.cart.some((cartItem, index) => {
      const match = cartItem.products.findIndex((p) => p.item.id === product.item.id);
      if (match !== -1) {
        cartItem.products.splice(match, 1);
        if (cartItem.products.length === 0) {
          state.cart.splice(index, 1);
        }
        return true;
      }
    });
  },
  setUserChatList(state, payload) {
    state.userChats = payload;
  },
  deleteUserNotification(state, payload) {
    remove(state.userNotifications, (notification) => notification.id === payload.id);
  },
  readAllUserNotifications(state, payload) {
    state.userNotifications = map(state.userNotifications, (notification) => ({
      ...notification,
      read: payload.read || true
    }));
  },
  setUserNotifications(state, payload) {
    state.userNotifications = payload;
  },
  updateUserNotification(state, payload) {
    const notificationKey = findIndex(
      state.userNotifications,
      (notification) => notification.id === payload.id
    );
    update(state.userNotifications, notificationKey, (notification) =>
      merge(notification, payload.notification)
    );
  },
  setCategories(state, payload) {
    state.allCategories = payload;
  },
  setSelectedMainCatID(state, payload) {
    state.selected_mainCat_id = payload;
  },
  setSelectedCancelProductID(state, payload) {
    state.selected_cancel_product_id = payload;
  },
  setSupplier(state, payload) {
    state.setSupplier = payload;
  },
  setSendBirdDetails(state, payload) {
    state.sendBirdDetails = payload;
  },
  setProduct(state, payload) {
    state.product = payload;
  },
  setOrigin(state, payload) {
    state.origin = payload;
  },
  setCustomOrigin(state, payload) {
    state.customOrigin = payload;
  },
  setSelectedCP(state, payload) {
    state.selectedCP = payload;
  },
  setPreviousHub(state, payload) {
    state.previousHub = payload;
  },
  setSelectedHub(state, payload) {
    state.selectedHub = payload;
  },
  setActiveAllProduct(state, payload) {
    state.activeAllProduct = payload;
  },
  setPreviousRouteParams(state, payload) {
    state.previousRouteParams = payload;
  },
  setPreviousRouteState(state, payload) {
    state.previousRouteState = payload;
  },
  setApplicationState(state, payload) {
    state.applicationState = payload;
  },
  addApplicationState(state, payload) {
    for (let key in payload) {
      state.applicationState[key] = payload[key];
    }
  },
  removeApplicationState(state, payload) {
    for (let key in payload) {
      delete state.applicationState[payload[key]];
    }
  },
  resetStore(state) {
    Object.assign(state, defaultStoreState());
  },
  setUpdateNotificationPage(state, payload) {
    state.updateNotificationPage = payload;
  },
  setUpdateOrdersPage(state, payload) {
    state.updateOrdersPage = payload;
  },
  setNewNotification(state, payload) {
    state.newNotification = payload;
  },
  setUpdateOrders(state, payload) {
    state.updateOrders = payload;
  },
  setIsNewMessage(state, payload) {
    state.isNewMessage = payload;
  },
  setNewCart(state, payload) {
    state.newCart = payload;
  },
  setSelectedCardPayment(state, payload) {
    state.selectedCardPayment = payload;
  },
  setSelectedGrabpayAndFpx(state, payload) {
    state.selectedGrabpayAndFpx = payload;
  },
  setOrderTotalAmount(state, payload) {
    state.orderTotalAmount = payload;
  },
  setEwalletAmount(state, payload) {
    state.ewalletAmount = payload;
  },
  setUpdateLocation(state, payload) {
    state.updateLocation = payload;
  },
  setUpdateSignAction(state, payload) {
    state.updateSignAction = payload;
  },
  setAllVouchers(state, payload) {
    state.getAllVouchers = payload;
  },
  setCheckoutGrabPayFpx(state, payload) {
    state.checkoutGrabPayFpx = payload;
  },
  setItemsCheckoutGrabPayFpx(state, payload) {
    state.itemsCheckoutGrabPayFpx = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

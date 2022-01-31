import Tabs from './views/Tabs';
const b2cRoutes = [
  {
    path: '/',
    redirect: '/main/home'
  },
  {
    path: '',
    redirect: '/main/home'
  },
  {
    path: '/main',
    component: Tabs,
    children: [
      {
        path: '',
        redirect: '/main/home'
      },
      {
        path: 'home',
        name: 'homepage',
        component: () => import('./views/home/Home.vue')
      },
      {
        path: 'cart',
        name: 'Cart',
        component: () => import('./views/cart/Cart.vue')
      },
      {
        path: 'category',
        name: 'Category',
        component: () => import('./views/category/category.vue')
      },
      {
        path: 'toppicks',
        name: 'TopPicks',
        component: () => import('./views/home/topPicks.vue')
      },
      {
        path: 'hotdeals',
        name: 'HotDeals',
        component: () => import('./views/home/hotDeals.vue')
      },
      {
        path: 'volumedeal',
        name: 'VolumeDeals',
        component: () => import('./views/home/volumeDeal.vue')
      },
      {
        path: 'category_product',
        name: 'Category_Product',
        component: () => import('./views/category_product/category_product.vue'),
        props: true
      },
      {
        path: 'notifications',
        component: () => import('./views/notifications/Notifications.vue')
      },
      {
        path: 'notifications/details',
        name: 'NotificationDetails',
        component: () => import('./views/notifications/NotificationDetails/NotificationDetails.vue'),
        props: true
      },
      {
        path: 'account',
        name: 'Account',
        component: () => import('./views/account/index.vue')
      },
      {
        path: 'search',
        name: 'search',
        component: () => import('./views/search/Search.vue'),
        props: true
      },
      {
        path: 'supplier/:supplier_id',
        name: 'viewsupplier',
        component: () => import('./views/supplierSearch/SupplierSearch.vue'),
        props: true
      },
      {
        path: 'supplier-list',
        component: () => import('./views/allSupplierList/AllSupplierList.vue')
      }
    ]
  },
  {
    path: '/main/map',
    name: 'Map',
    component: () => import('./views/map/Map.vue')
  },
  {
    path: '/main/chat',
    component: () => import('./views/chat/ChatList.vue')
  },
  {
    path: '/main/chat/details',
    component: () => import('./views/chat/ChatDetails/ChatDetails.vue'),
    props: true
  },
  {
    path: '/main/product-detail/:product_id',
    name: 'product-detail',
    component: () => import('./views/product-listing/ProductDetailVariation'),
    props: true
  },
  {
    path: '/main/account/manage-account',
    component: () => import('./views/account/manage-account.vue')
  },
  {
    path: '/main/account/manage-account/:selected_card',
    name: 'SelectedCard',
    component: () => import('./views/account/card/EditCard.vue'),
    props: true
  },
  {
    path: '/main/account/help',
    name: 'Help',
    component: () => import('./views/account/help.vue')
  },
  {
    path: '/main/account/contact-us',
    name: 'Contact-Us',
    component: () => import('./views/account/contact-us.vue')
  },
  {
    path: '/main/account/privacy-policy',
    name: 'Privacy-policy',
    component: () => import('./views/account/privacy-policy.vue')
  },
  {
    path: '/main/account/terms-of-use',
    name: 'Terms-of-Use',
    component: () => import('./views/account/terms-of-use.vue')
  },
  {
    path: '/main/account/settings',
    name: 'Account-Settings',
    component: () => import('./views/account/settings.vue')
  },
  {
    path: '/main/account/about',
    name: 'About-TreeDots',
    component: () => import('././views/account/about-treedots.vue')
  },
  {
    path: '/main/account/refunds',
    name: 'Refunds',
    component: () => import('./views/account/refunds.vue')
  },
  {
    path: '/main/account/ordering',
    name: 'Ordering',
    component: () => import('./views/account/ordering-and-collections.vue')
  },
  {
    path: '/main/account/faq',
    name: 'Faq',
    component: () => import('./views/account/faq/index.vue')
  },
  {
    path: '/main/account/faq/how-to-order',
    name: 'How-to-order',
    component: () => import('./views/account/faq/questions/how-do-i-order.vue')
  },
  {
    path: '/main/account/faq/group-buy',
    name: 'Group-buy',
    component: () => import('./views/account/faq/questions/what-is-a-group-buy.vue')
  },
  {
    path: '/main/account/faq/collection-point',
    name: 'Collection-point',
    component: () => import('./views/account/faq/questions/join-collection-point.vue')
  },
  {
    path: '/main/account/faq/collect-my-order',
    name: 'Collect-my-order',
    component: () => import('./views/account/faq/questions/when-to-collect-my-order.vue')
  },
  {
    path: '/main/account/faq/cancel-order',
    name: 'Cancel-order',
    component: () => import('./views/account/faq/questions/cancel-my-order.vue')
  },
  {
    path: '/main/account/faq/order-not-achieved',
    name: 'Order-not-achieved',
    component: () => import('./views/account/faq/questions/groupbuy-is-not-achieved.vue')
  },
  {
    path: '/main/account/faq/faulty-product',
    name: 'Faulty-product',
    component: () => import('./views/account/faq/questions/faulty-product.vue')
  },
  {
    path: '/main/account/faq/products-unavailable',
    name: 'Product-unavailable',
    component: () => import('./views/account/faq/questions/unavailable-product-in-my-cart.vue')
  },
  {
    path: '/main/account/faq/home-delivery',
    name: 'Home-delevery',
    component: () => import('./views/account/faq/questions/provide-home-delivery.vue')
  },
  {
    path: '/main/cart/voucher',
    name: 'Voucher',
    component: () => import('./views/cart/Voucher.vue')
  },
  {
    path: '/main/cart/checkout',
    name: 'Checkout',
    component: () => import('./views/cart/Checkout.vue')
  },
  {
    path: '/main/cart/checkout/payment-option',
    name: 'PaymentOption',
    component: () => import('./views/cart/checkout/PaymentOption.vue')
  },
  {
    path: '/main/cart/checkout/success',
    name: 'CheckoutSuccess',
    component: () => import('@/components/Cart/Checkout/status/Success.vue')
  },
  {
    path: '/main/cart/checkout/failed',
    name: 'CheckoutFailed',
    component: () => import('@/components/Cart/Checkout/status/Failed.vue')
  },
  {
    path: '/main/cart/checkout/failed-error',
    name: 'CheckoutError',
    component: () => import('@/components/Cart/Checkout/status/Error.vue')
  },
  {
    path: '/main/how-group-buy-works',
    name: 'GroupBuy',
    component: () => import('./views/shared/GroupBuy.vue')
  },
  {
    path: '/main/orders',
    component: () => import('./views/orders/index.vue'),
    children: [
      {
        path: '',
        redirect: '/main/orders/overview'
      },
      {
        path: 'overview',
        component: () => import('./views/orders/overview/index.vue')
      },
      {
        path: 'preparing',
        component: () => import('./views/orders/preparing/index.vue')
      },
      {
        path: 'collected',
        component: () => import('./views/orders/collected/index.vue')
      },
      {
        path: 'cancelled',
        component: () => import('./views/orders/cancelled/index.vue')
      },
      {
        path: 'tocollect',
        component: () => import('./views/orders/tocollect/index.vue')
      },
      {
        path: 'dispute',
        component: () => import('./views/orders/dispute/index.vue')
      }
    ]
  },
  {
    path: '/main/dispute/details',
    name: 'dispute-details',
    component: () => import('./views/dispute/DisputeDetails.vue'),
    props: (router) => ({
      dispute: JSON.parse(router.params.dispute),
      disputeType: parseInt(router.params.disputeType, 10),
      currencySymbol: router.params.currencySymbol,
      resolutions: JSON.parse(router.params.resolutions)
    })
  },
  {
    path: '/main/wallet',
    name: 'Wallet',
    component: () => import('./views/wallet/Wallet.vue')
  },
  {
    path: '/main/wallet/top-up',
    name: 'TopUpList',
    component: () => import('./views/wallet/topUp/TopUpList.vue')
  },
  {
    path: '/main/wallet/top-up/action',
    name: 'TopUp',
    component: () => import('./views/wallet/topUp/TopUp.vue')
  },
  {
    path: '/main/wallet/withdraw',
    name: 'Withdraw',
    component: () => import('./views/wallet/withdraw/index.vue')
  },
  {
    path: '/main/wallet/withdraw/transfer-to-bank',
    name: 'TransferToBank',
    component: () => import('./views/wallet/withdraw/bankTransfer.vue')
  },
  {
    path: '/main/wallet/withdraw/add-new-bank',
    name: 'AddNewBank',
    component: () => import('./views/wallet/topUp/bankTransfer/AddBankAccountForm.vue')
  },
  {
    path: '/main/wallet/withdraw/action',
    name: 'WithdrawAction',
    component: () => import('./views/wallet/withdraw/WithdrawAction.vue'),
    props: true
  },
  {
    path: '/main/wallet/top-up/bank-transfer/instructions',
    name: 'BankTransferInstructions',
    component: () => import('./views/wallet/topUp/bankTransfer/BankTransferInstructions.vue'),
    props: true
  },
  // {
  //   path: '/main/wallet/top-up/bank-transfer/add-bank-account-instructions',
  //   name: 'AddBankAccountInstructions',
  //   component: () => import('./views/wallet/topUp/bankTransfer/AddBankAccountInstructions.vue')
  // },
  {
    path: '/main/wallet/top-up/bank-transfer/add-bank-account-form',
    name: 'AddBankAccountForm',
    component: () => import('./views/wallet/topUp/bankTransfer/AddBankAccountForm.vue')
  },
  {
    path: '/main/wallet/top-up/bank-transfer/add-bank-account',
    name: 'AddBankAccount',
    component: () => import('./views/wallet/topUp/bankTransfer/AddBankAccount.vue')
  },
  {
    path: '/main/wallet/top-up/paynow/add-paynow-instructions',
    name: 'PaynowInstructions',
    component: () => import('./views/wallet/topUp/paynow/PaynowInstructions.vue'),
    props: true
  },
  // {
  //   path: '/main/wallet/top-up/paynow/add-paynow-instructions',
  //   name: 'AddPaynowInstructions',
  //   component: () => import('./views/wallet/topUp/paynow/AddPaynowInstructions.vue')
  // },
  {
    path: '/main/wallet/top-up/paynow/add-paynow-account',
    name: 'AddPaynowAccount',
    component: () => import('./views/wallet/topUp/paynow/AddPaynowAccount.vue')
  }
];

export default b2cRoutes;

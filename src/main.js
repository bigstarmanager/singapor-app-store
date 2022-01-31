import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import TDStorage from './storage';
import { createI18n } from 'vue-i18n';
import VueGoogleMaps from '@fawmi/vue-google-maps';

import { IonicVue, isPlatform } from '@ionic/vue';
import { Storage } from '@ionic/storage';
import { Deploy } from 'cordova-plugin-ionic';
/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './assets/css/global.scss';
import './assets/css/utils.scss';
import { ApolloClient, createHttpLink, InMemoryCache, ApolloLink, from } from '@apollo/client/core';
import { onError } from '@apollo/client/link/error';
import { ApolloClients } from '@vue/apollo-composable';
import store from './store';
import fetch from 'node-fetch';
import { authGuard } from './modules/shared/guards';
import messages from './assets/i18n';
import VueTheMask from 'vue-the-mask';
import { configure, defineRule } from 'vee-validate';
import AllRules from '@vee-validate/rules';
import { SplashScreen } from '@capacitor/splash-screen';
import { localize } from '@vee-validate/i18n';
import * as Sentry from '@sentry/capacitor';
import { Integrations } from '@sentry/tracing';
import Branch from '@/services/shared/helper/branch';
import Intercom from '@/services/shared/helper/intercom';
import PushNotification from '@/services/shared/helper/pushNotification';
import { App as CapacitorApp } from '@capacitor/app';
import LogRocket from 'logrocket';

const { VUE_APP_APPFLOW_ID, VUE_APP_APPFLOW_ENV } = process.env;

// The following are default rules for vee-validate.
// https://vee-validate.logaretm.com/v4/guide/global-validators#available-rules
Object.keys(AllRules).forEach((rule) => {
  defineRule(rule, AllRules[rule]);
});

// Rule 'is' error message set to 'field entered does not match'.
configure({
  generateMessage: localize('en', {
    messages: {
      is: '{field} entered does not match'
    }
  })
});

// Custom rule for phones. We need a json of all countries and their respective masks to compare against.
// Temporarily set to no validation.
const validatePhone = () => {
  // console.log(number);
  return true;
};

defineRule('phoneValidator', (value) => {
  return validatePhone(value) ? true : false;
});

// init ionic storage
const storage = new Storage();
let apolloClient, apolloBannerClient;

const configureDeploy = async () => {
  const config = {
    appId: VUE_APP_APPFLOW_ID,
    channel: VUE_APP_APPFLOW_ENV
  };
  try {
    await Deploy.configure(config);
  } catch (e) {
    console.log(e);
  }
};

storage.create().then(() => {
  const tdStorage = new TDStorage(storage);
  // add storage object into the meta of route
  // This used to create some guard that need get data from storage
  router.beforeEach((to, from, next) => {
    from.meta.$storage = tdStorage;
    const previousRoute = {
      to,
      from,
      next
    };
    const stateParams = store.state.b2c.previousRouteParams;
    // console.log(stateParams);
    store.dispatch('b2c/setPreviousRouteState', Object.assign(stateParams, previousRoute));
    // Clears current params to ensure previousRouteState is always new.
    store.dispatch('b2c/setPreviousRouteParams', {});

    return authGuard(to, from, next);
  });

  const httpLink = createHttpLink({
    uri: process.env.VUE_APP_GRAPHQL_API,
    fetch: fetch
  });
  const httpBannerLink = createHttpLink({
    uri: process.env.VUE_APP_STRAPI_API,
    fetch: fetch
  });

  const errorLink = onError(({ graphQLErrors }) => {
    // Error Response
    if (graphQLErrors) {
      const gqlError = graphQLErrors[0];
      if (gqlError?.extensions?.code === 'INTERNAL_SERVER_ERROR')
        graphQLErrors[0].message = 'Internal Server Error';
    }
  });

  const authMiddleware = new ApolloLink(async (operation, forward) => {
    // add the authorization to the headers
    const token = await tdStorage.getJWTToken();
    operation.setContext({
      headers: {
        Authorization: token || null
      }
    });
    return forward(operation);
  });

  apolloClient = new ApolloClient({
    link: from([authMiddleware, errorLink, httpLink]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache'
      },
      query: {
        fetchPolicy: 'no-cache'
      },
      mutate: {
        fetchPolicy: 'no-cache'
      }
    }
  });
  apolloBannerClient = new ApolloClient({
    link: from([httpBannerLink]),
    cache: new InMemoryCache(),
    connectToDevTools: true,
    defaultOptions: {
      watchQuery: {
        fetchPolicy: 'no-cache'
      },
      query: {
        fetchPolicy: 'no-cache'
      },
      mutate: {
        fetchPolicy: 'no-cache'
      }
    }
  });
  const i18n = createI18n({
    locale: 'en-us',
    fallbackLocale: 'en-us',
    messages
  });

  const {
    VUE_APP_ENV,
    VUE_APP_SENTRY_DSN_URL,
    VUE_APP_SENTRY_RELEASE,
    VUE_APP_SENTRY_DIST,
    VUE_APP_SENTRY_TRACE_RATE,
    VUE_APP_LOG_ROCKET_ID
  } = process.env;
  if (VUE_APP_ENV !== 'development') {
    /** LogRocket Interation */
    //disbale for now due to high memory use
    LogRocket.init(VUE_APP_LOG_ROCKET_ID);
    /** Sentry Interation */
    Sentry.init({
      dsn: VUE_APP_SENTRY_DSN_URL,
      integrations: [new Integrations.BrowserTracing()],
      release: VUE_APP_SENTRY_RELEASE,
      dist: VUE_APP_SENTRY_DIST,
      environment: VUE_APP_ENV,
      sampleRate: VUE_APP_SENTRY_TRACE_RATE
    });
  }

  // only run auto update on mobile platform
  if (isPlatform('ios') || isPlatform('android')) {
    configureDeploy();
  }

  // Init Push Notification
  PushNotification.init(router);

  // Init Branch.io
  Branch.init(tdStorage);

  // Init Intercom
  Intercom.init(tdStorage);

  // Hide the splash (you should do this on app launch)
  // SplashScreen.hide();

  // Show the splash for an indefinite amount of time:
  // SplashScreen.show({
  //   autoHide: false
  // });

  // Show the splash for two seconds and then automatically hide it:
  // SplashScreen.show({
  //   showDuration: 5000,
  //   autoHide: true
  // });

  const app = createApp(App)
    .provide(ApolloClients, { default: apolloClient, clientBanner: apolloBannerClient })
    .use(IonicVue)
    .use(router)
    .use(store)
    .use(i18n)
    .use(VueTheMask)
    .use(VueGoogleMaps, {
      load: {
        key: process.env.VUE_APP_GOOGLEMAPS_KEY,
        libraries: 'places'
      }
    });

  // add ionic storage into vue global properties
  // app.config.globalProperties.$storage = tdStorage;
  app.provide('$storage', tdStorage);

  router.isReady().then(() => {
    app.mount('#app');
    SplashScreen.hide();
    CapacitorApp.addListener('appUrlOpen', function (event) {
      // Example url: https://social.thetreedots.com/home/tabs1
      // slug = /home/tabs1
      const slug = event.url.split('.com').pop();

      // We only push to the route if there is a slug present
      if (slug) router.push({ path: slug });
    });

    // Track Branch.io event when an App is put into the background
    CapacitorApp.addListener('appStateChange', function (state) {
      if (!state.isActive) {
        Branch.sendBranchEvent(Branch.events.CLOSE_APP);
      }
    });
  });
});

export { apolloClient };

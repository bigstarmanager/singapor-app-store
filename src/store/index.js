import sharedModule from '../modules/shared/store';
import b2cModule from '../modules/store';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import LogRocket from 'logrocket';
import createPlugin from 'logrocket-vuex';

const logrocketPlugin = createPlugin(LogRocket);
const store = new Vuex.Store({
  modules: {
    shared: sharedModule,
    b2c: b2cModule
  },
  plugins: [createPersistedState(), logrocketPlugin]
});

export default store;

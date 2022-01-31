const state = () => ({
  isLoggedIn: false,
  toPath: null,
  user: null,
  isLoading: false
});

const getters = {
  currentUser(state) {
    return state.user;
  },
  getUserLoggedIn(state) {
    return state.isLoggedIn;
  },
  getPath(state) {
    return state.toPath;
  }
};

const actions = {
  setUser({ commit }, payload) {
    commit('setUser', payload.user);
  },
  clearStore({ commit }) {
    commit('clearStore');
  },
  setUserLoggedIn({ commit }, payload) {
    commit('setUserLoggedIn', payload.userLoggedIn);
  },
  setPath({ commit }, payload) {
    commit('setPath', payload.toPath);
  }
};

const mutations = {
  setUser(state, payload) {
    state.user = payload;
    localStorage.setItem('user', JSON.stringify(payload));
    localStorage.setItem('token_jwt', payload.tokenJWT);
  },
  clearStore(state) {
    state.user = null;
    localStorage.setItem('user', null);
    localStorage.setItem('token_jwt', null);
  },
  setUserLoggedIn(state, payload) {
    state.isLoggedIn = payload;
  },
  setPath(state, payload) {
    state.toPath = payload;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
};

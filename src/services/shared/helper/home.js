export const preferredCountryCode =
  process.env.VUE_APP_ENV === 'production' ? ['+65', '+60'] : ['+65', '+60', '+62'];

export const userLoginRoute = async (router, store, storage) => {
  await store.dispatch('b2c/resetStore');
  await store.dispatch('shared/setUserLoggedIn', { userLoggedIn: true });
  const path = await storage.getRedirectPath();
  router.replace(path || '/main/home');
};

export const authGuard = async (to, from, next) => {
  const currentUser = await from.meta.$storage.getUser();
  const isNew = await from.meta.$storage.getIsNew();
  const allowRouteList = [
    '/main/home',
    '/',
    '/home',
    '/main/category',
    '/main/category_product',
    '/main/account/privacy-policy',
    '/main/account/terms-of-use',
    '/main/search'
  ];
  if (
    currentUser &&
    (to.fullPath.indexOf('/shared/auth') > -1 || to.fullPath === '/home' || to.fullPath === '/')
  ) {
    if (isNew && isNew.isNew) {
      next();
    } else {
      if (currentUser.buyer_type === 1) {
        next('/b2b');
      } else {
        next('/');
      }
    }
  } else if (
    !currentUser &&
    to.fullPath.indexOf('/shared/auth') === -1 &&
    !allowRouteList.includes(to.fullPath) &&
    to.name !== 'product-detail'
  ) {
    await from.meta.$storage.setRedirectPath(from.fullPath);
    next('/shared/auth/signup-access');
  } else {
    next();
  }
};

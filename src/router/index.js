import { createRouter, createWebHistory } from '@ionic/vue-router';
import sharedRoutes from '../modules/shared/router';
import b2cRoutes from '../modules/router';

const routes = [...sharedRoutes, ...b2cRoutes];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;

import { createRouter, createWebHashHistory } from 'vue-router'
import routes from './paths';

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes
});

if (!router.hasRoute()) {
  console.log(window.location.hash.replace('#', ''));
  router.addRoute({
      path: window.location.hash.replace('#', ''),
      name: 'TempRoute',
      component:()=> import('../components/Layout.vue')
  })
}
export default router
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory(), // hash模式：createWebHashHistory，history模式：createWebHistory
  routes: [
    {
      path: '/',
      redirect: '/index'
    },
    {
      path: '/index',
      name: 'index',
      component: () => import(/* webpackChunkName: "index" */ '../views/Index.vue')
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import(/* webpackChunkName: "dashboard" */ '../views/Index.vue')
    },
    {
      path: '/login',
      name: 'login',
      component: () => import(/* webpackChunkName: "login" */ '../views/Login.vue')
    },
    {
      path: '/admin_list',
      name: 'Admin_list',
      component: () => import(/* webpackChunkName: "Admin_list" */ '../views/Admin_list.vue')
    },
    {
      path: '/admin_group',
      name: 'admin_group',
      component: () => import(/* webpackChunkName: "admin_group" */ '../views/Admin_group.vue')
    },
    // {
    //   path: '/admin_permissions',
    //   name: 'admin_permissions',
    //   component: () => import(/* webpackChunkName: "admin_permissions" */ '../views/Admin_permissions.vue')
    // },
    {
      path: '/admin_deleted',
      name: 'admin_deleted',
      component: () => import(/* webpackChunkName: "admin_deleted" */ '../views/Admin_deleted.vue')
    },

    ////
    {
      path: '/add',
      name: 'add',
      component: () => import(/* webpackChunkName: "add" */ '../views/AddGood.vue')
    },
    {
      path: '/swiper',
      name: 'swiper',
      component: () => import(/* webpackChunkName: "swiper" */ '../views/Swiper.vue')
    },
    {
      path: '/hot',
      name: 'hot',
      component: () => import(/* webpackChunkName: "hot" */ '../views/IndexConfig.vue')
    },
    {
      path: '/new',
      name: 'new',
      component: () => import(/* webpackChunkName: "new" */ '../views/IndexConfig.vue')
    },
    {
      path: '/recommend',
      name: 'recommend',
      component: () => import(/* webpackChunkName: "recommend" */ '../views/IndexConfig.vue')
    },
    {
      path: '/category',
      name: 'category',
      component: () => import(/* webpackChunkName: "category" */ '../views/Category.vue'),
      children: [
        {
          path: '/category/level2',
          name: 'level2',
          component: () => import(/* webpackChunkName: "level2" */ '../views/Category.vue'),
        },
        {
          path: '/category/level3',
          name: 'level3',
          component: () => import(/* webpackChunkName: "level3" */ '../views/Category.vue'),
        }
      ]
    },
    {
      path: '/good',
      name: 'good',
      component: () => import(/* webpackChunkName: "new" */ '../views/Good.vue')
    },
    {
      path: '/guest',
      name: 'guest',
      component: () => import(/* webpackChunkName: "guest" */ '../views/Guest.vue')
    },
    {
      path: '/order',
      name: 'order',
      component: () => import(/* webpackChunkName: "order" */ '../views/Order.vue')
    },
    {
      path: '/order_detail',
      name: 'order_detail',
      component: () => import(/* webpackChunkName: "order_detail" */ '../views/OrderDetail.vue')
    },
    {
      path: '/account',
      name: 'account',
      component: () => import(/* webpackChunkName: "account" */ '../views/Account.vue')
    }
  ]
})

export default router
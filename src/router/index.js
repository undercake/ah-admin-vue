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
      name: '加载中...',
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
      path: '/group_list',
      name: 'group_list',
      component: () => import(/* webpackChunkName: "Group_list" */ '../views/Group_list.vue')
    },
    {
      path: '/admin_deleted',
      name: 'admin_deleted',
      component: () => import(/* webpackChunkName: "admin_deleted" */ '../views/Admin_deleted.vue')
    },
    {
      path: '/admin_pass',
      name: 'admin_pass',
      component: () => import(/* webpackChunkName: "Admin_pass" */ '../views/Admin_pass.vue')
    },
    {
      path: '/group_rights',
      name: 'group_rights',
      component: () => import(/* webpackChunkName: "Group_rights" */ '../views/Group_rights.vue')
    },
    {
      path: '/Employee_list',
      name: 'Employee_list',
      component: () => import(/* webpackChunkName: "Employee_list" */ '../views/Employee_list.vue')
    },
    {
      path: '/Employee_deleted',
      name: 'Employee_deleted',
      component: () => import(/* webpackChunkName: "Employee_deleted" */ '../views/Employee_deleted.vue')
    },
    {
      path: '/services_list',
      name: 'Services_list',
      component: () => import(/* webpackChunkName: "Services_list" */ '../views/Services_list.vue')
    },
    {
      path: '/services_category',
      name: 'Services_category',
      component: () => import(/* webpackChunkName: "Services_category" */ '../views/Services_category.vue')
    },
    {
      path: '/services_deleted',
      name: 'Services_deleted',
      component: () => import(/* webpackChunkName: "Services_deleted" */ '../views/Services_deleted.vue')
    },
    {
      path: '/my_pass',
      name: 'My_pass',
      component: () => import(/* webpackChunkName: "My_pass" */ '../views/My_pass.vue')
    },
    {
      path: '/customer_list',
      name: 'Customer_list',
      component: () => import(/* webpackChunkName: "Customer_list" */ '../views/Customer_list.vue')
    },
    {
      path: '/customer_near',
      name: 'Customer_near',
      component: () => import(/* webpackChunkName: "Customer_near" */ '../views/Customer_near.vue')
    },
    {
      path: '/customer_deleted',
      name: 'Customer_deleted',
      component: () => import(/* webpackChunkName: "Customer_deleted" */ '../views/Customer_deleted.vue')
    },
    {
      path: '/order_add',
      name: 'Order_add',
      component: () => import(/* webpackChunkName: "Order_add" */ '../views/Order_add.vue')
    },
    {
      path: '/order_list',
      name: 'Order_list',
      component: () => import(/* webpackChunkName: "Order_list" */ '../views/Order_list.vue')
    },
    {
      path: '/order_deleted',
      name: 'Order_deleted',
      component: () => import(/* webpackChunkName: "Order_deleted" */ '../views/Order_deleted.vue')
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
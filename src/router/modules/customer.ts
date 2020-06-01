import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const customerRoutes: RouteConfig = {
  path: '/customer',
  component: Layout,
  redirect: '/customer/customer-listn',
  name: 'Customer',
  meta: {
    title: 'customer',
    icon: 'user'
  },
  children: [
    {
      path: 'customer-list',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/customer/customer-list.vue'),
      name: 'CustomerList',
      meta: { title: 'customerList' }
    },
    {
      path: 'member-list',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/customer/member-list.vue'),
      name: 'MemberList',
      meta: { title: 'memberList' }
    },
    {
      path: 'customer-list-detail',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/customer/customer-list-detail.vue'),
      name: 'CustomerListDetail',
      meta: { title: 'customerListDetail', hidden: true, noCache: true }

    }
  ]
}

export default customerRoutes

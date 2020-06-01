import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const orderRoutes: RouteConfig = {
  path: '/order',
  component: Layout,
  redirect: '/order/order-listn',
  name: 'Order',
  meta: {
    title: 'order',
    icon: 'link'
  },
  children: [
    {
      path: 'order-list',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/order/order-list.vue'),
      name: 'OrderList',
      meta: { title: 'orderList', icon: 'table', noCache: true }
    },
    {
      path: 'order-list-detail',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/order/order-list-detail.vue'),
      name: 'OrderListDetail',
      meta: { title: 'orderListDetail', hidden: true, noCache: true }

    }
  ]
}

export default orderRoutes

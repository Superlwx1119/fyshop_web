import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const commodityRoutes: RouteConfig = {
  path: '/commodity',
  component: Layout,
  redirect: '/commodity/commodity-classification',
  name: 'Commodity',
  meta: {
    title: 'commodity',
    icon: 'component'
  },
  children: [
    {
      path: 'commodity-classification',
      component: () => import(/* webpackChunkName: "inline-edit-table" */ '@/views/commodity/commodity-classification.vue'),
      name: 'CommodityClassification',
      meta: { title: 'commodityClassification' }
    },
    {
      path: 'commodity-list',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/commodity/commodity-list.vue'),
      name: 'CommodityList',
      meta: {
        title: 'commodityList', noCache: true
      }
    },
    {
      path: 'commodity-list-detail',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/commodity/commodity-list-detail.vue'),
      name: 'CommodityListDetail',
      meta: { title: 'commodityListDetail', hidden: true, noCache: true }
    }
  ]
}

export default commodityRoutes

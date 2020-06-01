import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const analysisRoutes: RouteConfig = {
  path: '/analysis',
  component: Layout,
  redirect: '/analysis/analysis-revenue',
  name: 'Analysis',
  meta: {
    title: 'analysis',
    icon: 'zip'
  },
  children: [
    {
      path: 'analysis-revenue',
      component: () => import(/* webpackChunkName: "inline-edit-table" */ '@/views/analysis/revenue-data.vue'),
      name: 'AnalysisRevenue',
      meta: { title: 'analysisRevenue' }
    },
    {
      path: 'analysis-goods',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/analysis/goods-data.vue'),
      name: 'AnalysisGoods',
      meta: { title: 'analysisGoods' }
    },
    {
      path: 'analysis-goods-detail',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/analysis/goods-data-detail.vue'),
      name: 'AnalysisGoodsDetail',
      meta: { title: 'analysisGoodsDetail', hidden: true, noCache: true }
    },
    {
      path: 'analysis-customer',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/analysis/customer-data.vue'),
      name: 'AnalysisCustomer',
      meta: { title: 'analysisCustomer' }
    }
  ]
}

export default analysisRoutes

import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const distributionRoutes: RouteConfig = {
  path: '/distribution',
  component: Layout,
  redirect: '/distribution/distribution-index',
  name: 'Distribution',
  meta: {
    title: 'distribution',
    icon: 'skill'
  },
  children: [
    {
      path: 'distribution-index',
      component: () => import(/* webpackChunkName: "inline-edit-table" */ '@/views/distribution/index.vue'),
      name: 'DistributionIndex',
      meta: { title: 'distributionIndex' }
    },
    {
      path: 'distribution-goods',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/distribution/goods.vue'),
      name: 'DistributionGoods',
      meta: { title: 'distributionGoods' }
    }
  ]
}

export default distributionRoutes

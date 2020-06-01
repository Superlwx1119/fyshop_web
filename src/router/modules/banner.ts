import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const bannerRoutes: RouteConfig = {
  path: '/banner',
  component: Layout,
  redirect: '/banner/banner',
  name: 'Banner',
  meta: {
    title: 'banner',
    icon: 'link'
  },
  children: [
    {
      path: 'banner',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/banner/banner.vue'),
      name: 'Banner',
      meta: { title: 'banner', icon: 'link' }
    }
  ]
}

export default bannerRoutes

import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const storeRoutes: RouteConfig = {
  path: '/store',
  component: Layout,
  redirect: '/store/alipay/a',
  name: 'Store',
  meta: {
    title: 'store',
    icon: 'zip'
  },
  children: [
    {
      path: 'alipay',
      component: () => import(/* webpackChunkName: "menu1" */ '@/views/store/alipay/index.vue'),
      redirect: '/store/alipay/a',
      name: 'alipay',
      meta: { title: 'alipay' },
      children: [
        {
          path: 'data-overview',
          component: () => import(/* webpackChunkName: "menu1-1" */ '@/views/store/alipay/data-overview.vue'),
          name: 'DataOverview',
          meta: { title: 'dataOverview' }
        },
        {
          path: 'card-conf',
          component: () => import(/* webpackChunkName: "menu1-3" */ '@/views/store/alipay/card-conf.vue'),
          name: 'CardConf',
          meta: { title: 'cardConf' }
        },
        {
          path: 'card-conf-detail',
          component: () => import(/* webpackChunkName: "complex-table" */ '@/views/store/alipay/card-conf-detail.vue'),
          name: 'CardConfDetail',
          meta: { title: 'cardConfDetail', hidden: true, noCache: true }
        }
      ]
    }
    // {
    //   path: 'menu2',
    //   component: () => import(/* webpackChunkName: "menu2" */ '@/views/store/menu2/index.vue'),
    //   name: 'Menu2',
    //   meta: { title: 'menu2' }
    // }
  ]
}

export default storeRoutes

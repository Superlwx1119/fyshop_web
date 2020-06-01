import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const marketingRoutes: RouteConfig = {
  path: '/marketing',
  component: Layout,
  redirect: '/marketing/assemble',
  name: 'Marketing',
  meta: {
    title: 'marketing',
    icon: 'edit'
  },
  children: [
    // {
    //   path: 'seckill',
    //   component: () => import(/* webpackChunkName: "complex-table" */ '@/views/marketing/seckill.vue'),
    //   name: 'Seckill',
    //   meta: { title: 'seckill' }
    // },
    {
      path: 'assemble',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/marketing/assemble.vue'),
      name: 'Assemble',
      meta: { title: 'assemble' , noCache: true}
    },
    {
      path: 'assistance',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/marketing/assistance.vue'),
      name: 'Assistance',
      meta: { title: 'assistance' , noCache: true}
    },
    {
      path: 'promotion',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/marketing/promotion.vue'),
      name: 'Promotion',
      meta: { title: 'promotion' , noCache: true}
    },
    // {
    //   path: 'seckill-detail',
    //   component: () => import(/* webpackChunkName: "complex-table" */ '@/views/marketing/seckill-detail.vue'),
    //   name: 'SeckillDetail',
    //   meta: { title: 'seckillDetail', hidden: true, noCache: true }
    // },
    {
      path: 'promotion-detail',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/marketing/promotion-detail.vue'),
      name: 'PromotionDetail',
      meta: { title: 'promotionDetail', hidden: true, noCache: true }
    },
    {
      path: 'assemble-detail',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/marketing/assemble-detail.vue'),
      name: 'AssembleDetail',
      meta: { title: 'assembleDetail', hidden: true, noCache: true }
    },
    {
      path: 'assistance-detail',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/marketing/assistance-detail.vue'),
      name: 'AssistanceDetail',
      meta: { title: 'assistanceDetail', hidden: true, noCache: true }
    }, {
      path: 'card-conf',
      component: () => import(/* webpackChunkName: "menu1-3" */ '@/views/marketing/card-conf.vue'),
      name: 'CardConf',
      meta: { title: 'cardConf' ,noCache: true }
    },
    {
      path: 'card-conf-detail',
      component: () => import(/* webpackChunkName: "complex-table" */ '@/views/marketing/card-conf-detail.vue'),
      name: 'CardConfDetail',
      meta: { title: 'cardConfDetail', hidden: true, noCache: true }
    }
  ]
}

export default marketingRoutes

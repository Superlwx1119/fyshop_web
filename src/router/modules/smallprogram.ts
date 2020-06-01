import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const smallProgram: RouteConfig = {
  path: '/smallProgram',
  component: Layout,
  redirect: 'noredirect',
  name: 'smallprogram',
  meta: {
    title: 'smallprogramIndex',
    icon: 'skill'
  },
  children: [
    {
      path: 'smallprogram',
      component: () => import(/* webpackChunkName: "bar-chart" */ '@/views/smallprogram/index.vue'),
      name: 'smallprogramIndex',
      meta: {
        title: 'smallprogramIndex',
        // noCache: true,
        icon: 'skill'
      }
    }
  ]
}

export default smallProgram

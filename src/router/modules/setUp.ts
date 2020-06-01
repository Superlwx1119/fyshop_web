import { RouteConfig } from 'vue-router'
import Layout from '@/layout/index.vue'

const setUpRoutes: RouteConfig = {
  path: '/setUp',
  component: Layout,
  redirect: '/setUp/freight',
  name: 'SetUp',
  meta: {
    title: 'setUp',
    icon: 'nested'
  },
  children: [
    {
      path: 'freight',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/set-up/freight.vue'),
      name: 'Freight',
      meta: { title: 'freight' }
    },
    {
      path: 'adminSet',
      component: () => import('@/views/set-up/administrators/adminSet.vue'),
      name: 'AdminSet',
      meta: { title: 'adminSet' },
    },
    // {
    //   path: 'administrators',
    //   component: () => import('@/views/set-up/administrators/index.vue'),
    //   redirect: '/setUp/administrators/administrators-list',
    //   name: 'Administrators',
    //   meta: { title: 'administrators' },
    //   children: [
    //     {
    //       path: 'administrators-list',
    //       component: () => import('@/views/set-up/administrators/administrators.vue'),
    //       name: 'AdministratorsList',
    //       meta: { title: 'administratorsList' }
    //     },
    //     {
    //       path: 'role',
    //       component: () => import('@/views/set-up/administrators/role.vue'),
    //       name: 'Role',
    //       meta: { title: 'role' }
    //     }
    //   ]
    // },
    {
      path: 'operation-log',
      component: () => import(/* webpackChunkName: "menu2" */ '@/views/set-up/operation-log.vue'),
      name: 'OperationLog',
      meta: { title: 'operationLog' }
    }
  ]
}

export default setUpRoutes

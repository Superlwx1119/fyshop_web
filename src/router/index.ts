import Vue from 'vue'
import Router, { RouteConfig } from 'vue-router'
import store from '@/store'
import { Message } from 'element-ui';
Vue.component(Message.name,Message)
/* Layout */
import Layout from '@/layout/index.vue'

/* Router modules */
import commodityRoutes from './modules/commodity' // 商品管理路由
import orderRoutes from './modules/order' // 订单管理路由
import customerRoutes from './modules/customer' // 客户管理路由
// import storeRoutes from './modules/store' // 店铺管理路由
import marketingRoutes from './modules/marketing' // 营销管理路由
import setUpRoutes from './modules/setUp' // 系统设置路由
import analysisRoutes from './modules/analysis' // 数据分析路由
import bannerRoutes from './modules/banner' // 轮播图设置路由
import distributionRoutes from './modules/distribution' // 分销代理路由
import smallProgram from './modules/smallprogram' // 分销代理路由

Vue.use(Router)

/*
  Note: sub-menu only appear when children.length>=1
  Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
*/

/*
  name:'router-name'             the name field is required when using <keep-alive>, it should also match its component's name property
                                 detail see : https://vuejs.org/v2/guide/components-dynamic-async.html#keep-alive-with-Dynamic-Components
  redirect:                      if set to 'noredirect', no redirect action will be trigger when clicking the breadcrumb
  meta: {
    roles: ['admin', 'editor']   will control the page roles (allow setting multiple roles)
    title: 'title'               the name showed in subMenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon showed in the sidebar
    hidden: true                 if true, this route will not show in the sidebar (default is false)
    alwaysShow: true             if true, will always show the root menu (default is false)
                                 if false, hide the root menu when has less or equal than one children route
    breadcrumb: false            if false, the item will be hidden in breadcrumb (default is true)
    noCache: true                if true, the page will not be cached (default is false)
    affix: true                  if true, the tag will affix in the tags-view
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
*/

/**
  ConstantRoutes
  a base page that does not have permission requirements
  all roles can be accessed
*/
export const constantRoutes: RouteConfig[] = [
  {
    path: '/redirect',
    component: Layout,
    meta: { hidden: true , canBeShow :true},
    children: [
      {
        path: '/redirect/:path*',
        component: () => import(/* webpackChunkName: "redirect" */ '@/views/redirect/index.vue')
      }
    ]
  },
  {
    path: '/login',
    component: () => import(/* webpackChunkName: "login" */ '@/views/login/index.vue'),
    meta: { hidden: true , canBeShow :true}
  },
  {
    path: '/auth-redirect',
    component: () => import(/* webpackChunkName: "auth-redirect" */ '@/views/login/auth-redirect.vue'),
    meta: { hidden: true , canBeShow :true}
  },
  {
    path: '/404',
    component: () => import(/* webpackChunkName: "404" */ '@/views/error-page/404.vue'),
    meta: { hidden: true , canBeShow :true}
  },
  {
    path: '/401',
    component: () => import(/* webpackChunkName: "401" */ '@/views/error-page/401.vue'),
    meta: { hidden: true , canBeShow :true}
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import(/* webpackChunkName: "dashboard" */ '@/views/dashboard/index.vue'),
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          canBeShow :true,
          affix: true
        }
      }
    ]
  },
  commodityRoutes,
  orderRoutes,
  customerRoutes,
  // storeRoutes,
  analysisRoutes,
  marketingRoutes,
  setUpRoutes,
  bannerRoutes,
  distributionRoutes,
  smallProgram,

  // {
  //   path: '/documentation',
  //   component: Layout,
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import(/* webpackChunkName: "documentation" */ '@/views/documentation/index.vue'),
  //       name: 'Documentation',
  //       meta: { title: 'documentation', icon: 'documentation', affix: true }
  //     }
  //   ]
  // },
  // {
  //   path: '/profile',
  //   component: Layout,
  //   redirect: '/profile/index',
  //   meta: { hidden: true },
  //   children: [
  //     {
  //       path: 'index',
  //       component: () => import(/* webpackChunkName: "profile" */ '@/views/profile/index.vue'),
  //       name: 'Profile',
  //       meta: {
  //         title: 'profile',
  //         icon: 'user',
  //         noCache: true
  //       }
  //     }
  //   ]
  // }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
*/
export const asyncRoutes: RouteConfig[] = [
  // 新添加的路由
  // commodityRoutes,
  // orderRoutes,
  // customerRoutes,
  // // storeRoutes,
  // analysisRoutes,
  // marketingRoutes,
  // setUpRoutes,
  // bannerRoutes,
  // distributionRoutes,
  // {
  //   path: '/permission',
  //   component: Layout,
  //   redirect: '/permission/directive',
  //   meta: {
  //     title: 'permission',
  //     icon: 'lock',
  //     roles: ["21"], // you can set roles in root nav
  //     alwaysShow: true // will always show the root menu
  //   },
  //   children: [
  //     {
  //       path: 'page',
  //       component: () => import(/* webpackChunkName: "permission-page" */ '@/views/permission/page.vue'),
  //       name: 'PagePermission',
  //       meta: {
  //         title: 'pagePermission',
  //         roles: ['21'] // or you can only set roles in sub nav
  //       }
  //     },
  //     {
  //       path: 'directive',
  //       component: () => import(/* webpackChunkName: "permission-directive" */ '@/views/permission/directive.vue'),
  //       name: 'DirectivePermission',
  //       meta: {
  //         title: 'directivePermission',
  //         roles: ['admin']
  //         // if do not set roles, means: this page does not require permission
  //       }
  //     },
  //     {
  //       path: 'role',
  //       component: () => import(/* webpackChunkName: "permission-role" */ '@/views/permission/role.vue'),
  //       name: 'RolePermission',
  //       meta: {
  //         title: 'rolePermission',
  //       }
  //     }
  //   ]
  // },
  /** when your routing map is too long, you can split it into small modules **/
  // chartsRouter,
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true , canBeShow :true}
  }
]

const createRouter = () => new Router({
  // mode: 'history',  // Disabled due to Github Pages doesn't support this, enable this if you need.
  scrollBehavior: (to, from, savedPosition) => {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  },
  base: process.env.BASE_URL,
  routes: constantRoutes
})

const router = createRouter()

let pass = false
let passRoutes = ['/dashboard','/auth-redirect','/login','/404','/401','/redirect']
// router.beforeEach((to, from, next) => {    
//   let routeApi = store.state.user.info.powerRoutes
//   routeApi?routeApi.forEach((item:any,index:any)=>{
//     if(to.name == item.name){
//       if(item.meta.canBeShow){
//         pass = true
//       }
//     }else{
//       if(item.children && item.children.length >=1 ){
//         item.children.forEach((v:any)=>{
//           if(v.meta.canBeShow && to.name == v.name){
//             pass = true
//           }
//         })
//       }
//     }
//   }):next()
//   if(pass || passRoutes.includes(to.path)){
//     next()
//     pass = false
//   }else{
//     if(!to.name){
//       return
//     }
//     Message.error('没有该模块权限')
//   }
// });
// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter();
  (router as any).matcher = (newRouter as any).matcher // reset router
}

export default router

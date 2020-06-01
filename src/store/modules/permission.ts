import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import { RouteConfig } from 'vue-router'
import { asyncRoutes, constantRoutes } from '@/router'
import store from '@/store'
let routerIndex: any = []

export const filterAsyncRoutes = (routes: RouteConfig[], roles: any[]) => {
  const res: RouteConfig[] = []
  roles.forEach(role => {
    const e = { ...role }
    routes.forEach(route => {
      const r = { ...route }
      if (e.name == r.name) {
        if (r.children) {
          r.children = filterAsyncRoutes(r.children, e.children)
        }

        res.push(r)
      }
      // 用来添加隐藏的路由
      if (r.meta.hidden) {
        for (let i = 0; i < routerIndex.length; i++) {
          if (r.path == routerIndex[i]) {
            return
          }
        }
        routerIndex.push(r.path)
        res.push(r)
      }
    })
  })
  return res
}

export interface IPermissionState {
  routes: RouteConfig[]
  dynamicRoutes: RouteConfig[]
}

@Module({ dynamic: true, store, name: 'permission' })
class Permission extends VuexModule implements IPermissionState {
  public routes: RouteConfig[] = []
  public dynamicRoutes: RouteConfig[] = []

  @Mutation
  private SET_ROUTES(routes: RouteConfig[]) {
    this.routes = constantRoutes.concat(routes)
    this.dynamicRoutes = routes
  }

  @Action
  public GenerateRoutes(roles: string[]) {
    // 可以在此设置路由，最好调用vuex里面保存的routers
    let accessedRoutes = filterAsyncRoutes(asyncRoutes, store.state.user.info.powerRoutes)
    // console.log(accessedRoutes);
    // console.log(store.state.user.info.routes);
    this.SET_ROUTES(accessedRoutes)
  }
}

export const PermissionModule = getModule(Permission)

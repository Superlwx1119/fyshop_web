import { VuexModule, Module, Action, Mutation, getModule } from 'vuex-module-decorators'
import { login, logout ,sendCode } from '@/api/users'
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, removeUserInfo } from '@/utils/cookies'
import router, { resetRouter } from '@/router'
import asyncRoutes from '@/router'
import { PermissionModule } from './permission'
import { TagsViewModule } from './tags-view'
import store from '@/store'

export interface IUserState {
  token: string
  name: string
  imgUrl: string  //查看文件
  imgUploadApi: string //上传文件
  roles: string[]
  info: any,
  shopList:any
}

@Module({ dynamic: true, store, name: 'user' })
class User extends VuexModule implements IUserState {
  public token = getToken() || ''
  public name = ''
  // public imgUrl = "http://fy.csgxcf.com/file/"
  public imgUrl = ""
  public imgUploadApi = this.getImgUrl()
  // public imgUrl = this.getImgUrl()
  public roles: string[] = []
  public info = {
    employeeid: '',
    useraccount: '',
    nickname: '',
    headimg: '',
    mobile: '',
    role: '',
    status: ''
  }

  public shopList = window.sessionStorage.getItem('shopList') ? JSON.parse(window.sessionStorage.getItem('shopList')) : []

  private getImgUrl(){
    if(process.env.NODE_ENV=='development'){
      return 'http://192.168.103.62:17100/file-server/file/upload'
    }else{
      return 'https://fy.csgxcf.com/FileSystem/upload'
    }
  }

  @Mutation
  private SET_List(list:any){
    this.shopList = list
    window.sessionStorage.setItem('shopList',JSON.stringify(list))
  }
  
  @Mutation
  private SET_INFO(info: any) {
    // router.options.routes.concat(info.powerRoutes)
    // info.powerRoutes = router
    // info.powerRoutesStr = JSON.stringify(router)
    this.info = info
  }

  @Mutation
  private SET_TOKEN(token: string) {
    this.token = token
  }

  @Mutation
  private SET_NAME(name: string) {
    this.name = name
  }

  @Mutation
  private SET_ROLES(roles: string[]) {
    this.roles = roles
  }

  @Action
  public setList(data:any){
    this.SET_List(data)
  }

  @Action
  public async Login(userInfo: { tenantid: string, account: string, password: string , vCode :number}) {
    let { tenantid, account, password , vCode} = userInfo
    account = account.trim()
    const { data } = await login({ data: { tenantid, account, password ,code:vCode} })
    
  }


  @Action
  public shopLogin(data:{employeeId:string}){
    setToken(data.employeeId)
    data.powerRoutes = router.options.routes
    setUserInfo(JSON.stringify(data))// 保存用户信息到本地，供页面刷新时vuex获取用户信息
    this.SET_TOKEN(data.employeeId)
    this.SET_INFO(data)
    // 可以在此获取登录接口返回的路由路由，设置到vuex里面保存的routers
    // this.ChangeRoles('')//设置路由
  }

  @Action
  public async sendCode(account:string){
    const { data } = await sendCode({ data: { phone:account } })
  }


  @Action
  public ResetToken() {
    removeToken()
    removeUserInfo()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }

  @Action
  public async GetUserInfo() {
    let data: any = getUserInfo()
    this.SET_INFO(JSON.parse(data))
    // this.SET_ROLES([this.info.role])
    this.SET_ROLES(router.options.routes)
    this.SET_NAME(this.info.nickname)
  }

  @Action
  public async ChangeRoles(role: string) {
    await this.GetUserInfo()
    resetRouter()
    PermissionModule.GenerateRoutes(this.roles)
    router.addRoutes(PermissionModule.dynamicRoutes)
    TagsViewModule.delAllViews()
  }

  @Action
  public async LogOut() {
    if (this.token === '') {
      throw Error('LogOut: token is undefined!')
    }
    // await logout()
    removeToken()
    removeUserInfo()
    resetRouter()
    sessionStorage.removeItem('jumpLogin')
    // Reset visited views and cached views
    TagsViewModule.delAllViews()
    this.SET_TOKEN('')
    this.SET_ROLES([])
  }
}

export const UserModule = getModule(User)

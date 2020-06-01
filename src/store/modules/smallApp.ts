import { VuexModule, Module, Mutation, Action, getModule } from 'vuex-module-decorators'
import store from '@/store'
import elementVariables from '@/styles/element-variables.scss'
import defaultSettings from '@/settings'

export interface ISmallAppState {
    token: String
    appToken:String
    appid:String
    shopId:String
    principalName:String
    appletType:String
    appletId:String
    phone:String
    code:String
}

@Module({ dynamic: true, store, name: 'settings' })
class SmallApp extends VuexModule implements ISmallAppState {
  public token = ''
  public appToken = ''
  public shopId = ''
  public appletId = ''
  public appid = ''
  public principalName = ''
  public appletType = ''
  public phone = ''
  public code = ''

  @Mutation
  private CHANGE_SETTING(payload: { key: string, value: any }) {
    const { key, value } = payload
    if (Object.prototype.hasOwnProperty.call(this, key)) {
      (this as any)[key] = value
    }
  }

  @Action
  public ChangeSetting(payload: { key: string, value: any}) {
    this.CHANGE_SETTING(payload)
  }
  
}

export const SmallMudles = getModule(SmallApp)

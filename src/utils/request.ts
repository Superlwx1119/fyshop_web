import axios from 'axios'
import { Message, MessageBox , Loading  } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import store from '@/store'
import { getRealPath } from '@/utils/index'// 获取请求接口地址

let baseURL = ''

if (process.env.NODE_ENV == 'development') {
  baseURL = 'http://192.168.103.62:17100'
} else {
  baseURL = 'https://sapp.csgxcf.com/fyshop_gateway'
}
const service = axios.create({
  // baseURL: 'http://172.16.10.27:8080', // 公共接口
  // baseURL: 'http://fy.csgxcf.com/FyManageMent', // 公共接口
  // baseURL: 'http://swmachine.wicp.vip/', // 公共接口
  // baseURL: 'https://fy.csgxcf.com/FyManageMent', // 公共接口
  // baseURL: 'http://2466y2q466.zicp.vip/', // 公共接口
  // baseURL: 'http://172.16.10.34:8002', // 商品管理--邓宁宁
  // baseURL: 'http://172.16.10.34:8003', // 客户管理--邓宁宁
  // baseURL: 'http://172.16.10.59:8081', // 订单管理--潘昱安
  // baseURL: 'http://172.16.10.59:8082', // 营销玩法--潘昱安
  // baseURL: 'http://172.16.10.59:8080', // 登录--潘昱安
  baseURL: baseURL, // 登录--符文普


  timeout: 10000
  // withCredentials: true // send cookies when cross-domain requests
})
// Request interceptors
service.interceptors.request.use(
  (config) => {
    let  loading :any;
    if (!config.url) {
      config.url = '/getAPIData'; //统一请求编码路径
    }
    if(config.url.indexOf('save')>=0||config.url.indexOf('update')>=0||config.url.indexOf('Alter')>=0||config.url.indexOf('Save')>=0){
      loading = Loading.service({
        lock: true,
        text: '请求中,请稍后...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      })
    }
    if (config.params) {
      config.data.business = config.params.business; //统一请求编码
      config.data.data.tenantid = store.state.user.info.tenantid; //统一租户ID
      config.data.data.shopId = store.state.user.info.shopId; //统一商铺ID
      delete config.params;
    }
    // Add X-Access-Token header to every request, you can add other custom headers here
    if (UserModule.token) {
      config.headers['X-Access-Token'] = UserModule.token
      config.headers['token'] = UserModule.token
      config.headers['type'] = 'tenant'
      config.headers['employeeId'] = store.state.user.info.employeeId
    }
    if(loading){
      setTimeout(()=>{
        loading.close();
      },1000)
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// Response interceptors
service.interceptors.response.use(
  (response) => {
    const res = response.data
    if (res.resultCode != 1) {
      Message({
        message: res.resultInfo || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      if (res.resultCode == 9110 || res.code === 50012 || res.code === 50014) {
        MessageBox.confirm(
          '登录失效，可以取消继续留在该页面，或者重新登录',
          '确定登出',
          {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }
        ).then(() => {
          UserModule.ResetToken()
          location.reload() // To prevent bugs from vue-router
        })
      }
      return Promise.reject(new Error(res.resultInfo || 'Error'))
    } else {
      return response
    }
  },
  (error) => {
    console.log(error)
    let msg = ''
    if(error.message == 'Request failed with status code 401'){
      msg = '用户暂无权限!'
    }else if(error.message == 'timeout of 10000ms exceeded'){
      msg = '请求超时!'
    }
    Message({
      message: msg == '' ? error.message : msg,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service

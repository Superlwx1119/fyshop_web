import request from '@/utils/request'

// //登录
// export const login = (params: any) =>
//   request({
//     url: '/userLogin',
//     method: 'post',
//     data: params,
//     baseURL: 'http://172.16.10.59:8080'
//   })


export const logout = () =>
  request({
    url: '/users/logout',
    method: 'post'
  })

// 获取字典
// 支付类型	PAY
// 小程序类型	ORDER_FROM
// 订单状态	ORDER_STATE
// 微信下单返回状态含义	WX_UNIFIED_ORDER_ERR_DES
// 微信退货返回状态含义	WX_REFUND_ERR_DES
// 优惠券类型	COUPON_TYPE
// 日志操作类型	LOG_TYPE
// 退款状态	ORDER_BACK_STATE
// 退款理由	ORDER_BACK_REASON
// 物流状态	LOGISTICS_STATUS
// 微信卡券底色	WX_CARD_COLOR
// 微信卡券审核状态	WX_CARD_STATUS
// 网页员工权限	EMPLOYEE_ROLE
export const getDictListByType = () =>
  request({
    url: '/getDictListByType',
    method: 'post'
  })

// 登录
export const login = (params: any) =>
  request({
    url: '/shop-server/shopEmloyee/login',
    method: 'post',
    data: params,
  })

  // 第三方登录
  export const jumpLogin = (params: any) =>
  request({
    url: '/shop-server/shopEmloyee/jumpLogin?jumpLogin='+params,
    method: 'get',
  })

  // 获取验证码
export const getShopListByAccount = (params: any) =>
request({
  url: '/shop-server/shopEmloyee/getShopListByAccount',
  method: 'post',
  data: params,
})

  // 根据账号获取商铺列表
export const sendCode = (params: any) =>
  request({
    url: '/shop-server/shopEmloyee/sendCode',
    method: 'post',
    data: params,
  })

  // 根据账号获取权限列表
  export const getShopPower = (params: any) =>
  request({
    url: '/shop-server/power/getShopPower',
    method: 'post',
    data: params,
  })

// 获取员工列表
export const getEmployeeList = (params: any) =>
  request({
    url: '/shop-server/shopEmloyee/queryList',
    method: 'post',
    data: params,
    params: {
      business: '02005'
    },
  })

// 保存员工
export const saveEmployee = (params: any) =>
  request({
    url: '/shop-server/shopEmloyee/save',
    method: 'post',
    data: params,
    params: {
      business: '02007'
    },
  })

  // 删除员工
export const deleteEmployee = (params: any) =>
request({
  url: '/shop-server/shopEmloyee/delete',
  method: 'post',
  data: params,
  params: {
    business: '02007'
  },
})

// 获取员工详情
export const getEmployeePower = (params: any) =>
  request({
    url:'/shop-server/shopEmloyee/getEmployeePower',
    method: 'post',
    data: params,
    params: {
      business: '02006'
    },
  })

// 获取角色列表
export const getRoleList = (params: any) =>
  request({
    url:'/shop-server/queryList',
    method: 'post',
    data: params,
    params: {
      business: '02017'
    },
  })

// 保存角色
export const saveRole = (params: any) =>
  request({
    url:'/shop-server/save',
    method: 'post',
    data: params,
    params: {
      business: '02018'
    },
  })

// 获取角色详情
export const getRole = (params: any) =>
  request({
    url:'/shop-server/queryDetails',
    method: 'post',
    data: params,
    params: {
      business: '02019'
    },
  })

// 删除角色
export const delRole = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '02020'
    },
  })

// 商铺基础设置
export const saveShop = (params: any) =>
  request({
    url:'/shop-server/shopInfo/save',
    method: 'post',
    data: params,
    params: {
      business: '02021'
    },
  })

// 获取店铺设置
export const getTenantShop = (params: any) =>
  request({
    url:'/shop-server/shopInfo/queryDetails',
    method: 'post',
    data: params,
    params: {},
  })

// 操作日志列表
export const getLogList = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '02023'
    },
  })

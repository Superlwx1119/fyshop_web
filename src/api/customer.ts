import request from '@/utils/request'

// 分页查询客户列表-04002
export const queryCustomerInfo = (params: any) =>
  request({
    url:'/customer-server/customerInfoManage/queryList',
    method: 'post',
    data: params,
    params: {},
  })

// 查询单个客户-04013
export const queryOneCustomer = (params: any) =>
  request({
    url:'/customer-server/customerInfoManage/customerInfoDetail',
    method: 'post',
    data: params,
    params: {
      business: '04013'
    },
  })

// 派发优惠券-06020
export const sendCoupon = (params: any) =>
  request({
    url:'/coupon-server/couponInfo/issueCoupon',
    method: 'post',
    data: params,
    params: {
      business: '06020'
    },
  })

// 查询会员等级-04006
export const getMemberLevelList = (params: any) =>
  request({
    url:'/customer-server/customerLevel/queryList',
    method: 'post',
    data: params,
    params: {
      business: '04006'
    },
  })

// 修改会员等级-04007
export const updateMemberLevel = (params: any) =>
  request({
    url:'/customer-server/customerLevel/save',
    method: 'post',
    data: params,
    params: {
      business: '04007'
    },
  })

// 添加会员等级-04008
export const saveCustomerMember = (params: any) =>
  request({
    url:'/customer-server/customerLevel/save',
    method: 'post',
    data: params,
    params: {
      business: '04008'
    },
  })

// 删除会员等级-04009
export const deleteCustomerMember = (params: any) =>
  request({
    url:'/customer-server/customerLevel/delete',
    method: 'post',
    data: params,
    params: {
      business: '04009'
    },
  })

// 查询可用优惠券接口列表-06022
export const canUseCoupon = (params: any) =>
  request({
    url:'/coupon-server/couponInfo/issueCouponList',
    method: 'post',
    data: params,
    params: {
      business: '06022'
    },
  })

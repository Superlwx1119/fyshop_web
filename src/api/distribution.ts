import request from '@/utils/request'

// 获取分销代理首页总统计数据-09001
export const getDistributorDataByShopId = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '09001'
    },
  })

// 获取分销代理首页统计数据(按时间筛选)--09002
export const getDistributorTimeData = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '09002'
    },
  })

// 获取分销代理首页曲线图数据(按时间筛选)--09003
export const getDistributorCurveData = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '09003'
    },
  })

// 分销商品列表--09004
export const getDistributorGoodListData = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '09004'
    },
  })

// 商品参加分销（批量）--09005
export const saveDistributorGood = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '09005'
    },
  })

// 修改分销/取消分销(支持批量)--09006
export const updDistributorGood = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '09006'
    },
  })

// 分销商品分销效果数据--09007
export const getGoodDistributorData = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '09007'
    },
  })

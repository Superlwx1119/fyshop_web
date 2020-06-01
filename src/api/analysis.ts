import request from '@/utils/request'

// 客户数据-05023
export const queryCustomerCountData = (params: any) =>
  request({
    url:'/data-server/customerInfoData/generalSituation',
    method: 'post',
    data: params,
    params: {
      business: '05023'
    },
  })

  // 购买次数客户分布-05023 -- echarts
export const buyNumCustomer = (params: any) =>
request({
  url:'/data-server/customerInfoData/buyNumCustomer',
  method: 'post',
  data: params,
  params: {
    business: '05023'
  },
})

  // 购买次数客户分布-05023 -- echarts
  export const vipCustomerNum = (params: any) =>
  request({
    url:'/data-server/customerInfoData/vipCustomerNum',
    method: 'post',
    data: params,
    params: {
      business: '05023'
    },
  })

// 商品数据-05024
export const queryGoodsCountData = (params: any) =>
  request({
    url:'/data-server/goodsData/goodsGeneralSituation',
    method: 'post',
    data: params,
    params: {
      business: '05024'
    },
  })
//商品数据排行
  export const goodsRankingList = (params: any) =>
  request({
    url:'/data-server/goodsData/goodsRankingList',
    method: 'post',
    data: params,
    params: {
      business: '05024'
    },
  })

// 营收数据统计-05024
export const queryOrderData = (params: any) =>
  request({
    url:'/data-server/revenueData/revenueGeneralSituation',
    method: 'post',
    data: params,
    params: {
      business: '05033'
    },
  })

  // 营收数据总览-05024
export const queryOrderCountData = (params: any) =>
request({
  url:'/data-server/revenueData/revenueCurveData',
  method: 'post',
  data: params,
  params: {
    business: '05033'
  },
})

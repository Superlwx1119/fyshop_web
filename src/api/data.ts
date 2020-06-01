import request from '@/utils/request'

// 首页上半部分统计数据-05021
export const realTimeOverview = (params: any) =>
  request({
    url:'/data-server/data/realTimeOverview',
    method: 'post',
    data: params,
    params: {
      business: '05021'
    },
  })

  // 首页待办事项
export const waitingProcessed = (params: any) =>
request({
  url:'/data-server/data/waitingProcessed',
  method: 'post',
  data: params,
  params: {
    business: '05021'
  },
})

// 首页今日趋势
export const todayTrend = (params: any) =>
  request({
    url:'/data-server/data/todayTrend',
    method: 'post',
    data: params,
    params: {
      business: '05022'
    },
  })

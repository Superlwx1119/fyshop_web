import request from '@/utils/request'

// 下拉列表
export const queryAppletPages = (params: any) =>
  request({
    url:'/shop-server/shopRotationImage/getAppletPageList',
    method: 'post',
    data: params,
    params: {
      business: '05028'
    },
  })

// 保存租户轮播设置
export const saveTenantAppletPage = (params: any) =>
  request({
    url:'/shop-server/shopRotationImage/saveRotationImage',
    method: 'post',
    data: params,
    params: {
      business: '05029'
    },
  })


// 修改租户轮播设置列表
export const updateTenantAppletPage = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '05031'
    },
  })

// 查询租户轮播设置列表05030
export const queryTenantAppletPages = (params: any) =>
  request({
    url:'/shop-server/shopRotationImage/getRotationImageList',
    method: 'post',
    data: params,
    params: {
      business: '05030'
    },
  })

// 删除租户轮播设置
export const deleteTenantAppletPage = (params: any) =>
  request({
    url:'/shop-server/shopRotationImage/deleteRotationImage',
    method: 'post',
    data: params,
    params: {
      business: '05032'
    },
  })

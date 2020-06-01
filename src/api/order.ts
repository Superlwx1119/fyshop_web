import request from '@/utils/request'

// 获取订单列表03005
export const queryOrderList = (params: any) =>
  request({
    url:'/order-server/orderInfoManage/queryList',
    method: 'post',
    data: params,
    params: {
      business: '03005'
    },
  })

// 获取订单详情03006
export const queryOrder = (params: any) =>
  request({
    url:'/order-server/orderInfoManage/get',
    method: 'post',
    data: params,
    params: {
      business: '03006'
    },
  })

// 获取退款订单列表
export const queryRefundList = (params: any) =>
  request({
    url:'/refunds-server/refundsInfoManage/queryList',
    method: 'post',
    data: params,
    params: {
      business: '03014'
    },
  })


  // 拒绝退款
export const refusal = (params: any) =>
request({
  url:'/refunds-server/refundsInfoManage/refusal',
  method: 'post',
  data: params,
  params: {
    business: '03014'
  },
})

// 修改退款状态
export const updateRefundApply = (params: any) =>
  request({
    // url:'/refunds-server/refundsInfoManage/agreedToReturnGoods',
    url:`/refunds-server/refundsInfoManage/${params.data.status == '4' ?'agreedToReturnMoney':'agreedToReturnGoods'}`,
    method: 'post',
    data: params,
    params: {
      business: '03016'
    },
  })
  

// 微信退款
export const wxRefund = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '03017'
    }
  })

// 退款详情
export const queryRefund = (params: any) =>
  request({
    url:'/refunds-server/refundsInfoManage/getDetailsResToShop',
    method: 'post',
    data: params,
    params: {
      business: '03015'
    },
  })

// 订单发货
export const orderSendOut = (params: any) =>
  request({
    url:'/order-server/orderInfoManage/next',
    method: 'post',
    data: params,
    params: {
      business: '03009'
    },
  })

// 查询物流信息
export const queryLogistics = (params: any) =>
  request({
    url:'/logistics-server/logisticsInfo/getLogistics',
    method: 'post',
    data: params,
    params: {
      business: '02015'
    },
  })

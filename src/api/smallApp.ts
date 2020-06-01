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
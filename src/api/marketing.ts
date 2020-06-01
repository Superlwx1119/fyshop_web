import request from '@/utils/request'

// 获取砍价活动列表
export const getBargainActivityList = (params: any) =>
  request({
    url:'/bargain-server/bargainActivity/bargainActivityList',
    method: 'post',
    data: params,
    params: {
      business: '06030'
    },
  })

// 保存砍价活动
export const saveBargainActivity = (params: any) =>
  request({
    url:'/bargain-server/bargainActivity/bargainActivitySave',
    method: 'post',
    data: params,
    params: {
      business: '06031'
    },
  })

  // 删除砍价活动
export const deleteBargainActivity = (params: any) =>
request({
  url:'/bargain-server/bargainActivity/bargainActivityAlterState',
  method: 'post',
  data: params,
  params: {
    business: '06031'
  },
})

  // 获取砍价效果数据
export const getBargainData = (params: any) =>
request({
  url:'/bargain-server/bargainActivity/bargainActivityResultsData',
  method: 'post',
  data: params,
  params: {
    business: '06031'
  },
})


// 获取砍价详情
export const getBargainActivity = (params: any) =>
  request({
    url:'/bargain-server/bargainActivity/bargainActivityDetails',
    method: 'post',
    data: params,
    params: {
      business: '06032'
    },
  })

// 获取拼团活动列表
export const getGroupActivityList = (params: any) =>
  request({
    url:'/group-server/groupActivity/groupActivityList',
    method: 'post',
    data: params,
    params: {
      business: '06027'
    },
  })

// 保存拼团活动
export const saveGroupActivity = (params: any) =>
  request({
    url:'/group-server/groupActivity/groupActivitySave',
    method: 'post',
    data: params,
    params: {
      business: '06028'
    },
  })

  // 删除拼团活动
export const deleteGroupActivity = (params: any) =>
request({
  url:'/group-server/groupActivity/groupActivityAlterState',
  method: 'post',
  data: params,
  params: {
    business: '06028'
  },
})

// 获取拼团详情
export const getGroupActivity = (params: any) =>
  request({
    url:'/group-server/groupActivity/groupActivityDetails',
    method: 'post',
    data: params,
    params: {
      business: '06029'
    },
  })

  // 获取促销列表
export const getpromotionActivityList = (params: any) =>
request({
  url:'/promotion-server/promotionActivity/promotionActivityList',
  method: 'post',
  data: params,
  params: {
    business: '06029'
  },
})


  // 获取促销详情
export const getpromotionActivityDetail = (params: any) =>
  request({
    url:'/promotion-server/promotionActivity/promotionActivityDetails',
    method: 'post',
    data: params,
    params: {
      business: '06029'
    },
  })

    // 保存促销活动
export const promotionActivitySave = (params: any) =>
request({
  url:'/promotion-server/promotionActivity/promotionActivitySave',
  method: 'post',
  data: params,
  params: {
    business: '06029'
  },
})

   // 获取促销效果数据
export const getPromotionActivityResultsData = (params: any) =>
request({
  url:'/promotion-server/promotionActivity/promotionActivityResultsData',
  method: 'post',
  data: params,
  params: {
    business: '06029'
  },
})

   // 下架促销活动
export const promotionActivityAlterStatus = (params: any) =>
request({
  url:'/promotion-server/promotionActivity/promotionActivityAlterStatus',
  method: 'post',
  data: params,
  params: {
    business: '06029'
  },
})

   // 删除促销活动
export const promotionActivityAlterState = (params: any) =>
request({
  url:'/promotion-server/promotionActivity/promotionActivityAlterState',
  method: 'post',
  data: params,
  params: {
    business: '06029'
  },
})

// 获取秒杀活动列表
export const getSeckillActivityList = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '06033'
    },
  })

// 获取拼团数据效果
export const getResultsData = (params: any) =>
request({
  url:'/group-server/groupActivity/groupActivityResultsData',
  method: 'post',
  data: params,
  params: {
    business: '06033'
  },
})

// 保存秒杀活动
export const saveSeckillActivity = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '06034'
    },
  })

// 获取秒杀详情
export const getSeckillActivity = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '06035'
    },
  })

// 获取优惠券列表
export const getCouponList = (params: any) =>
  request({
    url:'/coupon-server/couponInfo/couponInfoList',
    method: 'post',
    data: params,
    params: {
      business: '06026'
    },
  })


// 保存优惠券活动信息
export const saveCoupon = (params: any) =>
  request({
    url:'/coupon-server/couponInfo/couponInfoSave',
    method: 'post',
    data: params,
    params: {
      business: '06016'
    },
  })

// 获取优惠券推广列表
export const getPromotionList = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      // business: '05021'
    },
  })

// 获取推广详情
export const getPromotion = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      // business: '05021'
    },
  })




// 修改优惠券是否投放
export const updateCoupon = (params: any) =>
  request({
    url:'/coupon-server/couponInfo/couponInfoAlterSupportReceive',
    method: 'post',
    data: params,
    params: {
      business: '06018'
    },
  })

  // 删除优惠券
export const deleteCoupon = (params: any) =>
request({
  url:'/coupon-server/couponInfo/couponInfoAlterState',
  method: 'post',
  data: params,
  params: {
    business: '06018'
  },
})

  // 优惠券效果数据
  export const showCouponData = (params: any) =>
  request({
    url:'/coupon-server/couponInfo/couponInfoResultsData',
    method: 'post',
    data: params
  })


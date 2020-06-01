import request from '@/utils/request'

// 分页查询商品列表-05001
export const getGoodsList = (params: any) =>
  request({
    url: '/goods-server/goodsInfoManage/queryList',
    method: 'post',
    data: params,
    params: {
      business: '05001'
    },
    // transformRequest: [function (data, headers) {
    //   data.business = '05001'; // 对 data 进行任意转换处理
    //   return data;
    // }],
  })

// 查询单个商品详情-05002
export const getGoodsDetail = (params: any) =>
  request({
    url: '/goods-server/goodsInfoManage/get',
    method: 'post',
    data: params,
    params: {
      business: '05002'
    },
  })

// 修改商品-05003 添加商品-05004
export const updateGoods = (params: any) =>
  request({
    url:'/goods-server/goodsInfoManage/save',
    method: 'post',
    data: params,
    params: {
      business: '05003'
    },
  })
// 修改商品-05003 添加商品-05004
export const insertGoods = (params: any) =>
  request({
    url:'/goods-server/goodsInfoManage/save',
    method: 'post',
    data: params,
    params: {
      business: '05004'
    },
  })

// 下单前更新库存-05006
export const updateGoodsStock = (params: any) =>
  request({
    method: 'post',
    data: params,
    params: {
      business: '05006'
    },
  })

// 上架或下架商品-05018
export const shelfGood = (params: any) =>
  request({
    url:'/goods-server/goodsInfoManage/updateIssue',
    method: 'post',
    data: params,
    params: {
      business: '05018'
    },
  })

// 删除商品-05019
export const deleteGood = (params: any) =>
  request({
    url:'/goods-server/goodsInfoManage/delete',
    method: 'post',
    data: params,
    params: {
      business: '05019'
    },
  })

// 添加商品分类-05010
export const insertGoodsType = (params: any) =>
  request({
    url:'/goods-server/goodsType/save',
    method: 'post',
    data: params,
    params: {
      business: '05010'
    },
  })

  // 查看分类详情
export const getGoodsType = (params: any) =>
request({
  url:'/goods-server/goodsType/get',
  method: 'post',
  data: params,
  params: {
    business: '05010'
  },
})

// 查询商品分类
export const getQueryList = (params: any) =>
  request({
    url:'/goods-server/goodsCategory/queryList',
    method: 'post',
    data: params,
    params: {
      business: '05010'
    },
  })

// 查询商品分类-05011
export const listGoodsType = (params: any) =>
  request({
    url: '/goods-server/goodsType/queryList',
    method: 'post',
    data: params,
    params: {
      business: '05011'
    },
  })

// 删除商品分类-05012
export const deleteGoodsType = (params: any) =>
  request({
    url:'/goods-server/goodsType/delete',
    method: 'post',
    data: params,
    params: {
      business: '05012'
    },
  })

//保存商品分类
export const saveListType = (params: any) =>
request({
  url:'/goods-server/goodsType/save',
  method: 'post',
  data: params,
})
// 修改商品分类-05013
export const updateGoodsType = (params: any) =>
  request({
    url:'/goods-server/goodsType/save',
    method: 'post',
    data: params,
    params: {
      business: '05013'
    },
  })


interface listQuery {
  shopId: any;
  sortItem: any;
  goodsTypeId: undefined;
  goodsName: undefined;
  status: string; // 状态，可传，1：上架，2：下架
  stockEmptyFlag: any; // 查询售罄商品字段，可传，查询：'1'，不查询：null
  orderFlag: any; // 排序字段，可传，时间排序：null，销量排序：'1'，随机排序：'2'，价格：'3'，库存：'4'
  sortType: any; // 升降排序，可传，升序：null，降序：'1'
  simpleFlag: any; // 简化返参，可传，1：通用，2：简单，3：秒杀，4：拼团，5：砍价
  type:any,
  sortField:any
}

interface goodsAllInfo {
  goodId: any,
  size: string,
  place: string,
  specificationList: any[], // 规格
  detailList: any[], // 规格详情
  mainImageList: any[], // 主图片
  subImageList: any[], // 详情图片
  goodNum: string, // 商品货号
  goodsName: string, // 商品名称
  goodsTypeId: string, // 商品分类
  price: string, // 销售价格
  stock: string, // 期初库存数
  purchasePrice: string, // 进价
  status: any, // 是否上架
  varietyFlag: any,
  tenantid: string, // 租户编号，必传
  shopId: string // 商铺编号，必传
}

export const goodsAllInfo: goodsAllInfo = {
  goodId: '',
  size: '',
  place: '',
  specificationList: [], // 规格
  detailList: [], // 规格详情
  mainImageList: [], // 主图片
  subImageList: [], // 详情图片
  goodNum: '', // 商品货号
  goodsName: '', // 商品名称
  goodsTypeId: '', // 商品分类
  price: '', // 销售价格
  stock: '', // 期初库存数
  purchasePrice: '', // 进价
  status: 1, // 是否上架
  varietyFlag: 1,
  tenantid: '', // 租户编号，必传
  shopId: '' // 商铺编号，必传
}

export const listQuery: listQuery = {
  shopId: '234',
  goodsTypeId: undefined,
  goodsName: undefined,
  status: '10', // 状态，可传，1：上架，2：下架
  stockEmptyFlag: null, // 查询售罄商品字段，null：查询库存>0，1：查询库存=0，2：查询库存>=0
  orderFlag: null, // 排序字段，可传，时间排序：null，销量排序：'1'，随机排序：'2'，价格：'3'，库存：'4'
  sortItem: null,// 排序项：404710, "价格排序"，404720, "销量排序"，404730, "上架时间排序"
  sortType: null, // 升降排序，可传，升序：null，降序：'1'
  simpleFlag: '1',// 简化返参，可传，1：通用，2：简单，3：秒杀，4：拼团，5：砍价
  type:'1',
  sortField:'price'
}

let check3 = (rule: any, value: any, callback: any) => {
  var reg = /(^[1-9]([0-9]+)?(\.[0-9]{1,2})?$)|(^(0){1}$)|(^[0-9]\.[0-9]([0-9])?$)/;
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error("不能为负数!"));
  }
};
let check2 = (rule: any, value: any, callback: any) => {
  var reg = /^(0|[1-9][0-9]*)$/;
  if (reg.test(value)) {
    callback();
  } else {
    callback(new Error("不能为负数!"));
  }
};

export const goodsRules = {
  goodsName: [
    {
      required: true,
      message: "请输入商品名称",
      trigger: "blur"
    },
    {
      max:40,
      message:'最多不超过40个字符!',
    }
  ],
  goodsTypeId: [
    {
      required: true,
      message: "请选择商品分类",
      trigger: "blur"
    }
  ],
  price: [
    {
      required: true,
      message: "请输入销售价格",
      trigger: "change"
    },
    {
      validator: check3,
      trigger: "blur",
      message: "请输入正确的金额"
    }
  ],
  status: [
    {
      required: true,
      message: "请选择是否上架",
      trigger: "blur"
    }
  ],
  stock: [
    {
      required: true,
      message: "请输入期初库存数量",
      trigger: "blur"
    },
    {
      validator: check2,
      trigger: "blur",
      message: "只能输入正整数"
    }
  ]
};

// Just a mock data

export const constantRoutes = [
  {
    path: '/redirect',
    component: 'Layout',
    meta: { hidden: true },
    children: [
      {
        path: '/redirect/:path*',
        component: 'views/redirect/index'
      }
    ]
  },
  {
    path: '/login',
    component: 'views/login/index',
    meta: { hidden: true }
  },
  {
    path: '/auth-redirect',
    component: 'views/login/auth-redirect',
    meta: { hidden: true }
  },
  {
    path: '/404',
    component: 'views/error-page/404',
    meta: { hidden: true }
  },
  {
    path: '/401',
    component: 'views/error-page/401',
    meta: { hidden: true }
  },
  {
    path: '',
    component: 'Layout',
    redirect: 'dashboard',
    children: [
      {
        path: 'dashboard',
        component: 'views/dashboard/index',
        name: 'Dashboard',
        meta: {
          title: 'dashboard',
          icon: 'dashboard',
          affix: true
        }
      }
    ]
  },
]

export const asyncRoutes = [
  {
    path: '/commodity',
    component: "Layout",
    redirect: '/commodity/commodity-classification',
    name: 'Commodity',
    meta: {
      title: 'commodity',
      icon: 'component'
    },
    children: [
      {
        path: 'commodity-classification',
        component: 'views/commodity/commodity-classification',
        name: 'CommodityClassification',
        meta: { title: 'commodityClassification' }
      },
      {
        path: 'commodity-list',
        component: 'views/commodity/commodity-list',
        name: 'CommodityList',
        meta: { title: 'commodityList' }
      },
      {
        path: 'commodity-list-detail',
        component: 'views/commodity/commodity-list-detail',
        name: 'CommodityListDetail',
        meta: { title: 'commodityListDetail', hidden: true, noCache: true }
      }
    ]
  },
  {
    path: '/order',
    component: "Layout",
    redirect: '/order/order-listn',
    name: 'Order',
    meta: {
      title: 'order',
      icon: 'clipboard'
    },
    children: [
      {
        path: 'order-list',
        component: 'views/order/order-list',
        name: 'OrderList',
        meta: { title: 'orderList', icon: 'table' }
      },
      {
        path: 'order-list-detail',
        component: '/views/order/order-list-detail',
        name: 'OrderListDetail',
        meta: { title: 'orderListDetail', hidden: true, noCache: true }

      }
    ]
  },
  {
    path: '/banner',
    component: 'Layout',
    redirect: '/banner/banner',
    name: 'Banner',
    meta: {
      title: 'banner',
      icon: 'link'
    },
    children: [
      {
        path: 'banner',
        component: '/views/banner/banner',
        name: 'Banner',
        meta: { title: 'banner', icon: 'link' }
      },
    ]
  },
  {
    path: '/customer',
    component: 'Layout',
    redirect: '/customer/customer-listn',
    name: 'Customer',
    meta: {
      title: 'customer',
      icon: 'user'
    },
    children: [
      {
        path: 'customer-list',
        component: 'views/customer/customer-list',
        name: 'CustomerList',
        meta: { title: 'customerList' }
      },
      {
        path: 'member-list',
        component: 'views/customer/member-list',
        name: 'MemberList',
        meta: { title: 'memberList' }
      },
      {
        path: 'customer-list-detail',
        component: '@/views/customer/customer-list-detail',
        name: 'CustomerListDetail',
        meta: { title: 'customerListDetail', hidden: true, noCache: true }

      }
    ]
  },

  {
    path: '/analysis',
    component: 'Layout',
    redirect: '/analysis/analysis-revenue',
    name: 'Analysis',
    meta: {
      title: 'analysis',
      icon: 'zip'
    },
    children: [
      {
        path: 'analysis-revenue',
        component: '/views/analysis/revenue-data',
        name: 'AnalysisRevenue',
        meta: { title: 'analysisRevenue' }
      },
      {
        path: 'analysis-goods',
        component: 'views/analysis/goods-data',
        name: 'AnalysisGoods',
        meta: { title: 'analysisGoods' }
      },
      {
        path: 'analysis-goods-detail',
        component: 'views/analysis/goods-data-detail',
        name: 'AnalysisGoodsDetail',
        meta: { title: 'analysisGoodsDetail', hidden: true, noCache: true }
      },
      {
        path: 'analysis-customer',
        component: 'views/analysis/customer-data',
        name: 'AnalysisCustomer',
        meta: { title: 'analysisCustomer' }
      },
    ]
  },
  {
    path: '/marketing',
    component: 'Layout',
    redirect: '/marketing/seckill',
    name: 'Marketing',
    meta: {
      title: 'marketing',
      icon: 'edit'
    },
    children: [
      {
        path: 'seckill',
        component: 'views/marketing/seckill',
        name: 'Seckill',
        meta: { title: 'seckill' }
      },
      {
        path: 'assemble',
        component: 'views/marketing/assemble',
        name: 'Assemble',
        meta: { title: 'assemble' }
      },
      {
        path: 'assistance',
        component: 'views/marketing/assistance',
        name: 'Assistance',
        meta: { title: 'assistance' }
      },
      {
        path: 'seckill-detail',
        component: 'views/marketing/seckill-detail',
        name: 'SeckillDetail',
        meta: { title: 'seckillDetail', hidden: true, noCache: true }
      },
      {
        path: 'assemble-detail',
        component: 'views/marketing/assemble-detail',
        name: 'AssembleDetail',
        meta: { title: 'assembleDetail', hidden: true, noCache: true }
      },
      {
        path: 'assistance-detail',
        component: 'views/marketing/assistance-detail',
        name: 'AssistanceDetail',
        meta: { title: 'assistanceDetail', hidden: true, noCache: true }
      },
      {
        path: 'card-conf',
        component: 'views/store/alipay/card-conf',
        name: 'CardConf',
        meta: { title: 'cardConf' }
      },
      {
        path: 'card-conf-detail',
        component: 'views/store/alipay/card-conf-detail',
        name: 'CardConfDetail',
        meta: { title: 'cardConfDetail', hidden: true, noCache: true }
      }
    ]
  },
  {
    path: '/setUp',
    component: 'Layout',
    redirect: '/setUp/freight',
    name: 'SetUp',
    meta: {
      title: 'setUp',
      icon: 'nested'
    },
    children: [
      {
        path: 'freight',
        component: 'views/set-up/freight',
        name: 'Freight',
        meta: { title: 'freight' }
      },
      {
        path: 'administrators',
        component: 'views/set-up/administrators/index',
        redirect: '/setUp/administrators/administrators-list',
        name: 'Administrators',
        meta: { title: 'administrators' },
        children: [
          {
            path: 'administrators-list',
            component: 'views/set-up/administrators/administrators',
            name: 'AdministratorsList',
            meta: { title: 'administratorsList' }
          },
          {
            path: 'role',
            component: 'views/set-up/administrators/role',
            name: 'Role',
            meta: { title: 'role' }
          }
        ]
      },
      {
        path: 'operation-log',
        component: 'views/set-up/operation-log',
        name: 'OperationLog',
        meta: { title: 'operationLog' }
      }
    ]
  },
  {
    path: '*',
    redirect: '/404',
    meta: { hidden: true }
  }
]

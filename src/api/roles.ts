interface Role {
  id: string;
  name: string;
  power: string;
  shop_id: string;
  routes: any;
}

export const defaultRole: Role = {
  id: '',
  name: '',
  power: '',
  shop_id: '',
  routes: [
    {
      'path': '/commodity',
      'redirect': '/commodity/commodity-classification',
      'name': 'Commodity',
      'meta': {
        'title': 'commodity',
        'icon': 'component'
      },
      'children': [
        {
          'path': 'commodity-classification',
          'name': 'CommodityClassification',
          'meta': {
            'title': 'commodityClassification'
          }
        },
        {
          'path': 'commodity-list',
          'name': 'CommodityList',
          'meta': {
            'title': 'commodityList',
            'noCache': true
          }
        },
        {
          'path': 'commodity-list-detail',
          'name': 'CommodityListDetail',
          'meta': {
            'title': 'commodityListDetail',
            'hidden': true,
            'beShow': true,
            'noCache': true
          }
        }
      ]
    },
    {
      'path': '/order',
      'redirect': '/order/order-listn',
      'name': 'Order',
      'meta': {
        'title': 'order',
        'icon': 'link',
      },
      'children': [
        {
          'path': 'order-list',
          'name': 'OrderList',
          'meta': {
            'title': 'orderList',
            'icon': 'table',
            // 'noCache': true,
          }
        },
        {
          'path': 'order-list-detail',
          'name': 'OrderListDetail',
          'meta': {
            'title': 'orderListDetail',
            // 'hidden': true,
            // 'beShow': true,
            // 'noCache': true
          }
        }
      ]
    },
    {
      'path': '/customer',
      'redirect': '/customer/customer-listn',
      'name': 'Customer',
      'meta': {
        'title': 'customer',
        'icon': 'user'
      },
      'children': [
        {
          'path': 'customer-list',
          'name': 'CustomerList',
          'meta': {
            'title': 'customerList'
          }
        },
        {
          'path': 'member-list',
          'name': 'MemberList',
          'meta': {
            'title': 'memberList'
          }
        },
        {
          'path': 'customer-list-detail',
          'name': 'CustomerListDetail',
          'meta': {
            'title': 'customerListDetail',
            'hidden': true,
            'beShow': true,
            // 'noCache': true
          }
        }
      ]
    },
    {
      'path': '/analysis',
      'redirect': '/analysis/analysis-revenue',
      'name': 'Analysis',
      'meta': {
        'title': 'analysis',
        'icon': 'zip'
      },
      'children': [
        {
          'path': 'analysis-revenue',
          'name': 'AnalysisRevenue',
          'meta': {
            'title': 'analysisRevenue'
          }
        },
        {
          'path': 'analysis-goods',
          'name': 'AnalysisGoods',
          'meta': {
            'title': 'analysisGoods'
          }
        },
        {
          'path': 'analysis-goods-detail',
          'name': 'AnalysisGoodsDetail',
          'meta': {
            'title': 'analysisGoodsDetail',
            'beShow': true,
            'hidden': true,
            // 'noCache': true
          }
        },
        {
          'path': 'analysis-customer',
          'name': 'AnalysisCustomer',
          'meta': {
            'title': 'analysisCustomer'
          }
        }
      ]
    },
    {
      'path': '/marketing',
      'redirect': '/marketing/assemble',
      'name': 'Marketing',
      'meta': {
        'title': 'marketing',
        'icon': 'edit'
      },
      'children': [
        // {
        //   'path': 'seckill',
        //   'name': 'Seckill',
        //   'meta': {
        //     'title': 'seckill'
        //   }
        // },
        {
          'path': 'assemble',
          'name': 'Assemble',
          'meta': {
            'title': 'assemble'
          }
        },
        {
          'path': 'assistance',
          'name': 'Assistance',
          'meta': {
            'title': 'assistance'
          }
        },
        // {
        //   'path': 'seckill-detail',
        //   'name': 'SeckillDetail',
        //   'meta': {
        //     'title': 'seckillDetail',
        //     'hidden': true,
        //     'noCache': true
        //   }
        // },
        {
          'path': 'assemble-detail',
          'name': 'AssembleDetail',
          'meta': {
            'title': 'assembleDetail',
            'hidden': true,
            'beShow': true,
            // 'noCache': true
          }
        },
        {
          'path': 'assistance-detail',
          'name': 'AssistanceDetail',
          'meta': {
            'title': 'assistanceDetail',
            'hidden': true,
            'beShow': true,
            // 'noCache': true
          }
        },
        {
          'path': 'card-conf',
          'name': 'CardConf',
          'meta': {
            'title': 'cardConf'
          }
        },
        {
          'path': 'card-conf-detail',
          'name': 'CardConfDetail',
          'meta': {
            'title': 'cardConfDetail',
            'hidden': true,
            'beShow': true,
            // 'noCache': true
          }
        },
        {
          'path': 'promotion',
          'name': 'Promotion',
          'meta': {
            'title': 'promotion'
          }
        },
        {
          'path': 'promotion-detail',
          'name': 'PromotionDetail',
          'meta': {
            'title': 'promotionDetail',
            'hidden': true,
            'beShow': true,
            // 'noCache': true
          }
        },
      ]
    },
    {
      'path': '/setUp',
      'redirect': '/setUp/freight',
      'name': 'SetUp',
      'meta': {
        'title': 'setUp',
        'icon': 'nested'
      },
      'children': [
        {
          'path': 'freight',
          'name': 'Freight',
          'meta': {
            'title': 'freight'
          }
        },
        {
          'path': 'adminSet',
          'name': 'AdminSet',
          'meta': { 'title': 'adminSet' },
        },
        // {
        //   'path': 'administrators',
        //   'redirect': '/setUp/administrators/administrators-list',
        //   'name': 'Administrators',
        //   'meta': {
        //     'title': 'administrators'
        //   },
        //   'children': [
        //     {
        //       'path': 'administrators-list',
        //       'name': 'AdministratorsList',
        //       'meta': {
        //         'title': 'administratorsList'
        //       }
        //     },
        //     {
        //       'path': 'role',
        //       'name': 'Role',
        //       'meta': {
        //         'title': 'role'
        //       }
        //     }
        //   ]
        // },
        {
          'path': 'operation-log',
          'name': 'OperationLog',
          'meta': {
            'title': 'operationLog'
          }
        }
      ]
    },
    {
      'path': '/banner',
      'redirect': '/banner/banner',
      'name': 'Banner',
      'meta': {
        'title': 'banner',
        'icon': 'link',
      },
      'children': [
        {
          'path': 'banner',
          'name': 'Banner',
          'meta': {
            'title': 'banner',
            'icon': 'link',
            'beShow': true
          }
        }
      ]
    },
    {
      'path': '/distribution',
      'redirect': '/distribution/distribution-index',
      'name': 'Distribution',
      'meta': {
        'title': 'distribution',
        'icon': 'skill'
      },
      'children': [
        {
          'path': 'distribution-index',
          'name': 'DistributionIndex',
          'meta': { 'title': 'distributionIndex' }
        },
        {
          'path': 'distribution-goods',
          'name': 'DistributionGoods',
          'meta': { 'title': 'distributionGoods' }
        }
      ]
    }
  ]
}

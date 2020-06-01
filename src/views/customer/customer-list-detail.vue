<template>
  <div class="app-container">
    <div class="public-box">
      <div class="public-box-wrap">
        <el-form
          id="myForm"
          ref="userInfoList"
          label-width="100px"
          label-position="left"
          :model="userInfoList"
        >
          <div class="goodsBasicInfo">
            <div class="same-header">
              <span class="same-header-left">客户信息</span>
              <el-button
                type="default"
                size="small"
                icon="el-icon-back"
                @click="backPage"
              >
                返回
              </el-button>
            </div>
            <div class="detailStockInfo-wrap user-info">
              <el-form>
                <el-row :gutter="18">
                  <el-col :span="2">
                    <el-image
                      class="user-img"
                      :src="userInfoList.headImage"
                      :preview-src-list="[userInfoList.headImage]"
                    />
                  </el-col>
                  <el-col
                    :span="6"
                    :offset="2"
                  >
                    <el-form-item label="会员昵称：">
                      <span>{{ userInfoList.nickname }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="会员等级：">
                      <span>{{ userInfoList.customerMemberName }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="客户来源：">
                      <span>{{ userInfoList.typeName ? userInfoList.typeName:'无' }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="18">
                  <el-col
                    :span="6"
                    :offset="2"
                  >
                    <el-form-item label="注册时间：">
                      <span>{{ userInfoList.insTime }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="购买商品数量：">
                      <span>{{ userInfoList.goodsNum }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="消费总金额：">
                      <span>{{ userInfoList.consumption }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="18">
                  <el-col
                    :span="6"
                    :offset="2"
                  >
                    <el-form-item label="消费平均价：">
                      <span>{{ userInfoList.avgPrice }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="最后浏览时间：">
                      <span>{{ userInfoList.browseTime }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="最后购买时间：">
                      <span>{{ userInfoList.buyTime }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="18">
                  <el-col
                    :span="6"
                    :offset="2"
                  >
                    <el-form-item label="可用优惠卷：">
                      <span>{{ userInfoList.couponNum }}</span>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item label="不可用优惠卷：">
                      <span>{{ userInfoList.notUseCouponNum }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-row :gutter="18">
                  <el-col
                    :span="18"
                    :offset="2"
                  >
                    <el-form-item label="最近收货地址：">
                      <span>{{ userInfoList.address }}</span>
                    </el-form-item>
                  </el-col>
                </el-row>
              </el-form>
              <el-button
                type="success"
                @click="canUseCoupon()"
              >
                {{ $t('table.issuingVoucher') }}
              </el-button>
            </div>
          </div>
          <div class="goodsStockInfo price-stock-wrap mt20">
            <div class="same-header">
              <span class="same-header-left">购买历史</span>
            </div>
            <div class="detailStockInfo-wrap">
              <el-row>
                <el-col :span="24">
                  <el-form-item label="付款时间：">
                    <el-date-picker
                      v-model="searchTime"
                      type="daterange"
                      :picker-options="pickerOptions"
                      range-separator="-"
                      :start-placeholder="$t('search.startTime')"
                      :end-placeholder="$t('search.endTime')"
                      format="yyyy-MM-dd"
                      value-format="yyyy-MM-dd"
                      align="right"
                    />
                    <el-button
                      v-waves
                      class="filter-item"
                      type="primary"
                      icon="el-icon-search"
                      @click="handleFilter"
                    >
                      {{ $t('table.search') }}
                    </el-button>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-table
                :key="tableKey"
                v-loading="listLoading"
                :data="list"
                border
                fit
                highlight-current-row
                style="width: 100%;"
              >
                <el-table-column
                  label="订单号"
                  prop="orderid"
                  align="center"
                />
                <el-table-column
                  label="商品数"
                  prop="orderid"
                  align="center"
                />
                <el-table-column
                  label="付款时间"
                  prop="ins_time"
                  min-width="150px"
                  align="center"
                />
                <el-table-column
                  label="实付金额"
                  prop="total_fee"
                  width="180px"
                  align="center"
                />
                <el-table-column
                  :label="$t('table.actions')"
                  width="120px"
                  align="center"
                >
                  <template slot-scope="scope">
                    <el-button
                      size="mini"
                      type="primary"
                      @click="goDetail(scope.row)"
                    >
                      {{ $t('table.details') }}
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
              <pagination
                v-show="total>0"
                :total="total"
                :page.sync="currentPage"
                :current-page.sync="pageSize"
                @pagination="getList"
              />
            </div>
          </div>
          <div class="other-operate-btn mt30">
            <el-button
              type="primary"
              @click="backPage()"
            >
              返 回
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
    <el-dialog
      title="发券"
      class="dialog-issuingVoucher"
      :visible.sync="dialogFormVisible"
    >
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="shipmentList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          label="优惠卷"
          prop="couponName"
          align="center"
        />
        <el-table-column
          label="优惠内容"
          prop="content"
          align="center"
        />
        <el-table-column
          label="剩余数量"
          prop="remain"
          align="center"
        />
        <el-table-column
          label="截止时间"
          prop="endTime"
          align="center"
        />
        <el-table-column
          :label="$t('table.actions')"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="sendCoupon(scope.row)"
            >
              {{ $t('table.issuingVoucher') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogFormVisible = false"
        >
          {{ $t('table.close') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  queryOneCustomer,
  queryCustomerInfo,
  canUseCoupon,
  sendCoupon
} from '@/api/customer'
import { queryOrderList } from '@/api/order'
import { IArticleData } from '@/api/types'
import { formatJson } from '@/utils'
import { Form, Form as ElForm } from 'element-ui'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'CustomerListDetail',
  components: { Pagination }
})
export default class extends Vue {
  private userInfoList: any = {};
  private list = [];
  private shipmentList = [];
  private searchTime: any = [];
  private dialogFormVisible: boolean = false;
  private pickerOptions = {
    shortcuts: [
      {
        text: '最近一周',
        onClick(picker: any) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近一个月',
        onClick(picker: any) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近三个月',
        onClick(picker: any) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }
    ]
  };
  private listLoading = true;
  private tableKey = 0;
  private listQuery: any = {
    shop_id: this.$store.state.user.info.shopid // 商铺id
  };

  private total = '';
  private crrentPage = '';
  private pageSize: number = 20;
  private currentPage: number = 1;
  created() {
    this.getList()
    this.getCustomer()
  }
  private handleFilter() {
    this.currentPage = 1
    this.getList()
  }
  // 用户详情
  private async getCustomer() {
    this.listLoading = true
    const { data } = await queryOneCustomer({
      data: { customerId: this.$route.query.id }
    })
    this.userInfoList = data.data
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 用户历史订单列表
  private async getList() {
    this.listQuery.startTime = this.searchTime ? this.searchTime[0] : ''
    this.listQuery.endTime = this.searchTime ? this.searchTime[1] : ''
    this.listQuery.customerId = this.$route.query.id
    let propsData = {
      data: this.listQuery,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    }
    const { data } = await queryOrderList(propsData)
    this.list = data.data.list
    this.total = data.data.total
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 事件-链接商品详情查看
  private goDetail(row: any) {
    this.$router.push({
      name: 'OrderListDetail',
      query: {
        id: row.orderid,
        status: row.status,
        rowStatus: row.status,
        backId: row.back_id // 退款ID
      }
    })
  }
  // 事件-返回上一页
  private backPage() {
    this.$router.go(-1)
  }

  // 获取优惠券列表
  private async canUseCoupon() {
    const { data } = await canUseCoupon({
      data: { shopId: this.$store.state.user.info.shopid }
    })
    this.shipmentList = data.data
    this.dialogFormVisible = true
  }

  // 优惠券列表
  private async sendCoupon(row: any) {
    const { data } = await sendCoupon({
      data: {
        customerIds: this.$route.query.id, // 客户编号拼接
        couponIds: row.couponId, // "卡券编号",
        employeeId: this.$store.state.user.info.employeeId
      }
    })
    this.postMeg(data.resultCode, data.resultInfo)
  }

  // 提交请求，后续处理
  private postMeg(code: number, info: string) {
    this.$message({
      message: info,
      type: code == 1 ? 'success' : 'warning'
    })
    setTimeout(() => {
      if (code == 1) {
        this.dialogFormVisible = false
      }
    }, 1000)
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/detail.scss";
.total {
  .el-form-item__label {
    font-size: 16px;
  }
  span {
    font-size: 18px;
    color: red;
  }
}
.el-table {
  margin-bottom: 20px;
}
.timeline {
  margin-left: 16px;
  margin-top: 20px;
}
.el-dialog {
  .el-form-item {
    margin-bottom: 4px !important;
  }
}
.user-info {
  .user-img {
    position: absolute;
    width: 80px;
    margin-top: 12px;
  }
  .el-form-item {
    margin-bottom: 8px !important;
  }
}
.filter-item {
  margin-left: 20px;
}
</style>

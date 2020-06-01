<template>
  <div class="app-container">
    <el-tabs
      v-model="listQuery.status"
      @tab-click="changeStockStatus"
    >
      <el-tab-pane
        label="待付款"
        name="100"
      />
      <el-tab-pane
        label="拼团已付款待成团"
        name="150"
      />
      <el-tab-pane
        label="待发货"
        name="200"
      />
      <el-tab-pane
        label="已发货"
        name="300"
      />
      <el-tab-pane
        label="已完成"
        name="400"
      />
      <el-tab-pane
        label="已关闭"
        name="500"
      />
      <el-tab-pane
        label="退款订单"
        name="6"
      />
    </el-tabs>
    <div class="filter-container">
      <el-form
        :inline="true"
        :model="listQuery"
        class="demo-form-inline"
      >
        <!-- <el-form-item :label="$t('search.orderSource')+':'">
          <el-select
            v-model="listQuery.order_from"
            :placeholder="$t('search.orderSource')"
            clearable
            style="width: 200px"
            class="filter-item"
          >
            <el-option
              v-for="item in importanceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item :label="$t('search.payTime')+':'">
          <el-date-picker
            v-model="searchTime"
            type="datetimerange"
            :picker-options="pickerOptions"
            range-separator="-"
            :start-placeholder="$t('search.startTime')"
            :end-placeholder="$t('search.endTime')"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            align="right"
          />
        </el-form-item>
        <el-form-item label>
          <el-input
            v-model="listQuery.orderId"
            :placeholder="$t('search.orderNumber')"
            style="width: 200px;"
            class="filter-item"
            clearable
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item>
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
      </el-form>
    </div>
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
        :label="$t('table.orderNumber')"
        prop="orderId"
        align="center"
      />
      <el-table-column
        v-if="listQuery.status==6"
        label="退款编号"
        prop="refundsId"
        align="center"
      />
      <el-table-column
        v-if="listQuery.status != 100"
        :label="listQuery.status==6?'申请时间':'支付时间'"
        width="180"
        :prop="listQuery.status==6?'insTime':'payFinishTime'"
        align="center"
      />
      <el-table-column
        :label="listQuery.status==6?'申请金额':$t('table.payAmount')"
        width="100"
        :prop="listQuery.status==6?'applyMoney':'totalFee'"
        align="center"
      />
      <el-table-column
        :label="$t('table.nickName')"
        prop="nickname"
        align="center"
      />
      <!-- <el-table-column
        :label="$t('table.orderSource')"
        prop="order_from"
        align="center"
      /> -->
      <el-table-column
        :label="$t('table.status')"
        prop="statusValue"
        class-name="status-col"
      />
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="300"
        class-name="fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="goDetail(scope.row)"
          >
            {{ $t('table.details') }}
          </el-button>
          <el-button
            v-if="listQuery.status == '200'"
            size="mini"
            type="warning"
            @click="openDialog(scope.row)"
          >
            {{ $t('table.deliver') }}
          </el-button>
          <el-button
            v-if="listQuery.status == '300'||listQuery.status == '400'||(listQuery.status == '6'&&scope.row.status=='300')"
            size="mini"
            type="warning"
            @click="queryLogistics(scope.row)"
          >
            {{ $t('table.logistics') }}
          </el-button>
          <!-- <el-button
            v-if="listQuery.status == '6'"
            v-show="scope.row.status=='400'"
            size="mini"
            type="primary"
            @click="wxRefund(scope.row.refundsId)"
          >
            退款
          </el-button> -->
          <el-button
            v-if="listQuery.status == '6'"
            v-show="scope.row.status=='8'||(scope.row.status=='100' && scope.row.refundsType == '20')||scope.row.status=='300'"
            size="mini"
            :type="(scope.row.status=='100' && scope.row.refundsType == '20')||scope.row.status=='300' ? 'primary':'success'"
            @click="openActual('4', scope.row.refundsId,scope.row.applyMoney)"
          >
            {{ (scope.row.status=='100' && scope.row.refundsType == '20')||scope.row.status=='300' ? '退款':'同意' }}
          </el-button>
          <el-button
            v-if="listQuery.status == '6'"
            v-show="scope.row.status=='100' && scope.row.refundsType == '10'"
            size="mini"
            type="success"
            @click="refund('2', scope.row.refundsId)"
          >
            同意
          </el-button>
          <el-button
            v-if="listQuery.status == '6'"
            v-show="scope.row.status=='100'||scope.row.status=='200'||scope.row.status=='300'||scope.row.status=='8'"
            size="mini"
            type="danger"
            @click="refund('5', scope.row.refundsId)"
          >
            拒绝
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

    <el-dialog
      title="物流信息"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        :model="logisticsList"
        label-position="left"
        label-width="100px"
        style="width: 300px; margin-left:50px;"
      >
        <el-form-item label="快递公司：">
          <span>{{ logisticsList.logisticsName }}</span>
        </el-form-item>
        <el-form-item label="快递单号：">
          <span>{{ logisticsList.logisticsNo }}</span>
        </el-form-item>
        <el-form-item label="快递状态：">
          <span>{{ logisticsList.statusValue }}</span>
        </el-form-item>
      </el-form>
      <div class="timeline">
        <el-timeline>
          <el-timeline-item
            v-for="(activity, index) in logisticsList.context"
            :key="index"
            color="#0bbd87"
            :timestamp="activity.time"
          >
            {{ activity.information }}
          </el-timeline-item>
        </el-timeline>
      </div>
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

    <el-dialog
      title="订单发货"
      :visible.sync="dialogShipment"
    >
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="shipmentList.orderGoodsList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          :label="$t('table.productName')"
          prop="goodsName"
          align="center"
        />

        <el-table-column
          :label="$t('table.productImage')"
          align="center"
        >
          <template slot-scope="{row}">
            <el-image
              style="width: 40px"
              :src="row.imagePath"
              :preview-src-list="[row.imagePath]"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.specifications')"
          prop="skuName"
          align="center"
        />
        <el-table-column
          :label="$t('table.number')"
          prop="buyNumber"
          width="180px"
          align="center"
        />
      </el-table>

      <el-form
        :model="shipmentList"
        label-position="left"
        label-width="100px"
        style="margin-left:50px;margin-top:20px;"
      >
        <el-form-item label="收货人：">
          <span>{{ shipmentList.customerName }}</span>
        </el-form-item>
        <el-form-item label="联系方式：">
          <span>{{ shipmentList.customerPhone }}</span>
        </el-form-item>
        <el-form-item label="收货地址：">
          <span>{{ shipmentList.customerAddress }}</span>
        </el-form-item>
        <el-form-item label="快递单号：">
          <el-input
            v-model="shipmentLogisticsList.logisticsNo"
            placeholder="请输入快递单号"
            style="width: 300px;"
            class="filter-item"
          />
        </el-form-item>
      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="postLogistics"
        >
          发 货
        </el-button>
        <el-button @click="dialogShipment = false">
          {{ $t('table.close') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="确认退款"
      :visible.sync="dialogActual"
    >
      <el-form
        label-position="left"
        label-width="100px"
        style="margin-left:50px;margin-top:20px;"
      >
        <el-form-item label="退款金额：">
          <el-input
            v-model="actual.actual_money"
            placeholder="退款金额"
            style="width: 200px;"
            class="filter-item"
          />
        </el-form-item>
      </el-form>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="refund('4', actual.refundsId)"
        >
          退 款
        </el-button>
        <el-button @click="dialogActual = false">
          {{ $t('table.close') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  queryOrderList,
  queryRefundList,
  orderSendOut,
  queryOrder,
  queryLogistics,
  queryRefund,
  updateRefundApply,
  wxRefund,
  refusal
} from '@/api/order'
import { formatJson } from '@/utils'
import { Form, Form as ElForm } from 'element-ui'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'OrderList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private tableKey = 0;
  private list: any[] = [];
  private shipmentList: any = [];
  private shipmentTotal = 0;
  private hidepage: boolean = false; // 当弹框分页只有一页时，隐藏分页
  private listLoading: boolean = true;
  private searchTime = [];
  private shipmentLogisticsList: any = {
    logisticsNo: '',
    logisticsName: '',
    orderId: ''
  }; // 提交物流
  private logisticsList: any = {}; // 物流详情
  private total: number = 0;
  private pageSize: number = 20;
  private currentPage: number = 1;
  private actual: any = {
    actual_money: '',
    refundsId: ''
  }; // 退款金额
  private listQuery: any = {
    shopId: this.$store.state.user.info.shopId, // 商铺id
    orderId: '', //	订单id，模糊
    status: '200',
    order_from: '',
    startTime: '',
    endTime: ''
  };
  private dialogShipment: boolean = false;
  private dialogFormVisible: boolean = false;
  private dialogActual: boolean = false;
  private importanceOptions = [
    { value: '1102', label: '微信小程序' },
    { value: '1101', label: '支付宝小程序' }
  ];
  private pickerOptions = {
    shortcuts: [
      {
        text: '昨天',
        onClick(picker: any) {
          const start = new Date(
            new Date(new Date().toLocaleDateString()).getTime()
          )
          const end = new Date(
            new Date(new Date().toLocaleDateString()).getTime()
          )
          start.setTime(start.getTime() - 3600 * 1000 * 24)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '今天',
        onClick(picker: any) {
          const start = new Date(
            new Date(new Date().toLocaleDateString()).getTime()
          )
          const end = new Date(
            new Date(new Date().toLocaleDateString()).getTime()
          )
          end.setTime(end.getTime() + 3600 * 1000 * 24)
          picker.$emit('pick', [start, end])
        }
      },
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
      }
    ]
  };

  created() {
    if (sessionStorage.getItem('orderOldPage')) {
      let orderOldPage = JSON.parse(sessionStorage.getItem('orderOldPage'))
      this.listQuery = orderOldPage.listQuery
      this.pageSize = orderOldPage.pageSize
      this.currentPage = orderOldPage.currentPage
      this.changeStockStatus({ name: this.listQuery.status })
    }
    if (this.$route.query.status) {
      this.listQuery.status = this.$route.query.status
    }
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    this.listQuery.startTime = this.searchTime ? this.searchTime[0] : ''
    this.listQuery.endTime = this.searchTime ? this.searchTime[1] : ''
    let propsData = {
      data: this.listQuery,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    }
    const { data } =
      this.listQuery.status == '6'
        ? await queryRefundList(propsData)
        : await queryOrderList(propsData)
    this.list = data.data.list
    this.total = data.data.total
    if(this.currentPage > 1 && this.list.length == 0){
      this.currentPage = 1
      this.getList()
    }
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private async getDetail(id: string) {
    this.shipmentList = {}
    this.listLoading = true
    const { data } = await queryOrder({
      data: {
        orderId: id
      }
    })
    this.shipmentList = data.data
    this.shipmentLogisticsList.orderId = id
    setTimeout(() => {
      this.shipmentLogisticsList.logisticsNo = ''
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private async postLogistics() {
    if (this.shipmentLogisticsList.logisticsNo == '') {
      this.$message({
        type: 'warning',
        message: '请填写快递单号'
      })
      return
    }
    this.listLoading = true
    // this.shipmentLogisticsList.logistics_no.trim();
    const { data } = await orderSendOut({
      data: this.shipmentLogisticsList
    })
    this.dialogShipment = false
    this.getList()
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 查看物流信息
  private async queryLogistics(row: any) {
    this.listLoading = true
    const { data } = await queryLogistics({
      data: {
        logisticsNo: row.logisticsNo
      }
    })
    this.logisticsList = data.data
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
    let status = {
      '0': '在途',
      '1': '揽件',
      '2': '疑难',
      '3': '签收',
      '4': '退签或异常签收',
      '5': '派件',
      '6': '退回'
    }
    this.logisticsList.statusValue = status[data.data.status]
    this.dialogFormVisible = true
  }
  // 切换商品状态
  private changeStockStatus(e: any) {
    this.listQuery.status = e.name

    // this.currentPage = 1
    this.getList()
  }

  private handleFilter() {
    this.currentPage = 1
    this.getList()
  }

  private openDialog(row: any) {
    this.getDetail(row.orderId)
    this.dialogShipment = true
  }

  // 事件-链接商品详情查看
  private goDetail(row: any) {
    sessionStorage.setItem('orderOldPage', JSON.stringify({ currentPage: this.currentPage, pageSize: this.pageSize, listQuery: this.listQuery }))
    this.$router.push({
      name: 'OrderListDetail',
      query: {
        orderId: row.refundsId ? row.refundsId : row.orderId,
        status: this.listQuery.status,
        rowStatus: row.status,
        backId: row.refundsId // 退款ID
      }
    })
  }

  // 退款申请
  private async updateRefundApply(msg: string, id: any) {
    if (msg == '5') {
      const { data } = await refusal({
        data: {
          refundsId: id
        }
      })
      this.getList()
      return
    }
    const { data } = await updateRefundApply({
      data: {
        refundsId: id,
        status: msg,
        actualMoney: msg == '4' ? this.actual.actual_money : ''
      }
    })
    this.actual.actual_money = ''
    this.actual.refundsId = ''
    this.getList()

    // if (msg == '4') {
    //   // 确认退款
    //   // this.wxRefund(id)
    // } else {
    // }
  }
  // 微信退款
  private async wxRefund(id: any) {
    const { data } = await wxRefund({
      data: {
        id: id
      }
    })
    this.getList()
  }
  // 事件-退货操作
  private refund(msg: string, id: any) {
    if (this.actual.actual_money == '' && msg == '4') {
      this.$message.error('金额不能为空!')
      return
    }
    let reg = /^(\d+)(.\d{0,2})?$/
    if (!reg.test(this.actual.actual_money) && msg == '4' && Number(this.actual.actual_money) == 0) {
      this.$message.error('输入金额不正确!')
      return
    }
    this.dialogActual = false
    let msgList: any = {
      '4': '退款吗？确认后款项将退回用户。',
      '5': '拒绝退款吗？',
      '2': '同意用户退货吗？'
    }
    this.$confirm(`确认${msgList[msg]}`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      inputPattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
      inputErrorMessage: '输入金额不正确',
      type: 'warning'
    })
      .then(() => {
        this.updateRefundApply(msg, id)
      })
      .catch(error => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
  }

  // 事件-打开退款弹窗
  private openActual(msg: string, id: any, apply_money: any) {
    this.dialogActual = true
    this.actual.actual_money = apply_money
    this.actual.refundsId = id
  }
}
</script>
<style lang="scss" scoped>
.other-operate-btn {
  flex: 1;
  /* align-self: flex-start;
  justify-content: flex-end; */
  display: flex;
  padding-right: 50px;
  margin-bottom: 20px;
}

.img-same-css {
  width: 80px;
}

/* newStyles start */
.up-btn {
  color: #89cb67;
}

.down-btn {
  color: #e2a047;
}

.delete-btn {
  color: #ef6b6d;
}

.search-label {
  margin-right: 10px;
  color: #1f2d3d;
  font-weight: 600;
  vertical-align: text-top;
}
.filter-container .el-form-item {
  margin-bottom: 0;
}
.timeline {
  margin-left: 16px;
  margin-top: 20px;
}
.el-dialog {
  .el-form-item {
    margin-bottom: 8px !important;
  }
  .dialog-pagination {
    text-align: right;
  }
}
</style>

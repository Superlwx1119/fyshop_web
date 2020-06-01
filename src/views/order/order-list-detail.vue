<template>
  <div
    v-loading="loading"
    class="app-container"
  >
    <div class="public-box">
      <div class="public-box-wrap">
        <el-form
          id="myForm"
          ref="list"
          label-width="100px"
          label-position="left"
          :model="list"
        >
          <div class="detailBasicInfo">
            <div class="same-header">
              <span class="same-header-left">订单信息</span>
              <el-button
                type="default"
                size="small"
                icon="el-icon-back"
                @click="backPage"
              >
                返回
              </el-button>
            </div>
            <div class="detailStockInfo-wrap">
              <el-form>
                <el-form-item label="订单编号：">
                  <span>{{ list.orderId }}</span>
                </el-form-item>
                <el-form-item
                  v-if="queryInfo.status==6"
                  label="退款编号："
                >
                  <span>{{ list.refundsId }}</span>
                </el-form-item>
                <el-form-item label="订单状态：">
                  <span>{{ list.statusValue }}</span>
                </el-form-item>
                <el-form-item
                  v-if="queryInfo.status==6"
                  label="退款原因："
                >
                  <span>{{ list.reasonValue }}</span>
                </el-form-item>
                <el-form-item
                  v-if="queryInfo.status==6"
                  label="退款理由："
                >
                  <span>{{ list.explains == '' ? '无':list.explains }}</span>
                </el-form-item>
                <el-form-item
                  v-if="queryInfo.status==6"
                  label="退款凭证："
                >
                  <div
                    v-for="(item, index) in showMainPictureArr"
                    :key="index"
                    class="img-box"
                  >
                    <!-- <span>{{item}}</span> -->
                    <el-image
                      class="goods-img"
                      :src="item"
                      :preview-src-list="[item]"
                    />
                  </div>
                </el-form-item>
              </el-form>
              <el-button
                v-if="list.status==200"
                type="primary"
                size="mini"
                @click="dialogShipment=true"
              >
                发 货
              </el-button>
              <el-button
                v-if="list.status==300"
                type="primary"
                size="mini"
                @click="queryLogistics()"
              >
                查看物流
              </el-button>
              <!-- <el-button
                v-if="queryInfo.status == '6'"
                v-show="list.status=='400'"
                size="mini"
                type="primary"
                @click="wxRefund(list.id)"
              >退款</el-button> -->
              <el-button
                v-if="queryInfo.status == '6'"
                v-show="list.status=='8'||(list.status=='100' && list.refundsType == '20')||list.status=='300'"
                size="mini"
                :type="(list.status=='100' && list.refundsType == '20')||list.status=='300' ? 'primary':'success'"
                @click="openActual('4', list.refundsId,list.applyMoney)"
              >
                {{ (list.status=='100' && list.refundsType == '20')||list.status=='300' ? '退款':'同意' }}
              </el-button>
              <el-button
                v-if="queryInfo.status == '6'"
                v-show="(list.status=='100' && list.refundsType == '10')"
                size="mini"
                type="success"
                @click="refund('2', list.refundsId)"
              >
                同意
              </el-button>
              <el-button
                v-if="queryInfo.status == '6'"
                v-show="list.status=='100'||list.status=='200'||list.status=='300'||list.status=='8'"
                size="mini"
                type="danger"
                @click="refund('5', list.refundsId)"
              >
                拒绝
              </el-button>
            </div>
          </div>
          <div class="detailStockInfo mt20">
            <div class="same-header">
              <span class="same-header-left">收货人信息</span>
            </div>
            <div class="detailStockInfo-wrap">
              <el-form>
                <el-form-item label="收货人：">
                  <span>{{ list.customerName }}</span>
                </el-form-item>
                <el-form-item label="联系方式：">
                  <span>{{ queryInfo.status==6?list.phone:list.customerPhone }}</span>
                </el-form-item>
                <el-form-item label="收货地址：">
                  <span>{{ queryInfo.status==6?list.address:list.customerAddress }}</span>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="detailStockInfo price-stock-wrap mt20">
            <div class="same-header">
              <span class="same-header-left">商品信息</span>
            </div>
            <div class="detailStockInfo-wrap">
              <el-table
                :key="tableKey"
                v-loading="listLoading"
                :data="queryInfo.status==6?list.refundGoodsListToShop:list.orderGoodsList"
                border
                fit
                highlight-current-row
                style="width: 100%;"
              >
                <!-- <el-table-column
                  :label="$t('table.productCde')"
                  prop="goods_number"
                  align="center"
                /> -->
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
                  :label="$t('table.productName')"
                  prop="goodsName"
                  min-width="150px"
                  align="center"
                />
                <el-table-column
                  :label="$t('table.specifications')"
                  prop="skuName"
                  width="180px"
                  align="center"
                />
                <el-table-column
                  :label="$t('table.unitPrice')"
                  prop="actualPrice"
                  width="110px"
                  align="center"
                />
                <el-table-column
                  :label="$t('table.number')"
                  :prop="queryInfo.status==6?'refundsNumber':'buyNumber'"
                  align="center"
                  width="105px"
                />
                <el-table-column
                  :label="$t('table.subtotal')"
                  :prop="queryInfo.status==6?'subtotal':'subtotalPrice'"
                  align="center"
                  width="95"
                />
              </el-table>
              <el-form>
                <el-form-item label="商品数量：">
                  <span>共{{ queryInfo.status==6?list.refundsNumSum:list.goodsNumber }}件</span>
                </el-form-item>
                <el-form-item label="商品金额：">
                  <span>{{ queryInfo.status==6?list.goodsPrice:list.goodsPriceTotal }}元</span>
                </el-form-item>
                <el-form-item label="优惠金额：">
                  <span>{{ queryInfo.status==6?list.apportion:list.couponRemission }}元</span>
                </el-form-item>
                <el-form-item label="会员折扣：">
                  <span>{{ queryInfo.status==6?list.discount:list.memberRemission }}元</span>
                </el-form-item>
                <el-form-item
                  v-if="queryInfo.status!=6"
                  label="运费金额："
                >
                  <span>{{ queryInfo.status==6?list.logistics_apportion:list.freightFee }}元</span>
                </el-form-item>
                <el-form-item
                  class="total"
                  label="实收金额："
                >
                  <span>{{ queryInfo.status==6?list.applyMoney:list.totalFee }}元</span>
                </el-form-item>
                <el-form-item
                  v-if="queryInfo.status==6"
                  class="total"
                  label="退款金额："
                >
                  <span>{{ queryInfo.status==6?list.applyMoney:list.actualMoney }}元</span>
                </el-form-item>
              </el-form>
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
      <el-form
        :model="tempArticleData"
        label-position="left"
        label-width="100px"
        style="margin-left:50px;margin-top:20px;"
      >
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
            v-model="actual.actualMoney"
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
          @click="refund('4', actual.id)"
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
  queryOrder,
  queryLogistics,
  orderSendOut,
  updateRefundApply,
  queryRefund,
  wxRefund,
  refusal
} from '@/api/order'
import { IArticleData } from '@/api/types'
import { formatJson } from '@/utils'
import { Form, Form as ElForm } from 'element-ui'

@Component({
  name: 'OrderListDetail',
  components: {}
})
export default class extends Vue {
  private list: any = {};
  private dialogFormVisible: boolean = false;
  private logisticsList: any = {}; // 物流详情
  private dialogShipment: boolean = false;
  private listLoading: boolean = true;
  private tempArticleData = {}
  private loading : boolean = false;
  private shipmentLogisticsList: any = {
    logisticsNo: '',
    orderId: ''
  }; // 提交物流
  private tableKey = 0;
  private showMainPictureArr = [];
  private dialogStatus = '';
  private tkStatus = '2'; // 退款状态1：退款操作，2退货退款申请
  private total = '';
  private crrentPage = '';
  private dialogActual: boolean = false;
  private actual: any = {
    actualMoney: '',
    id: ''
  }; // 退款金额
  private queryInfo: any = {};
  created() {
    this.queryInfo = this.$route.query
    if (this.queryInfo.status == 6) {
      this.queryRefund()
    } else {
      this.getList()
    }
  }
  private async getList() {
    this.listLoading = true
    const { data } = await queryOrder({
      data: { orderId: this.queryInfo.orderId }
    })
    this.list = data.data
    // this.total = data.total;
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }
  // 退款详情
  private async queryRefund() {
    this.listLoading = true
    const { data } = await queryRefund({
      data: { refundsId: this.queryInfo.orderId }
    })
    this.list = data.data
    // this.total = data.total;
    if (this.list.imagePath) {
      this.showMainPictureArr = this.list.imagePath.split(',')
    }
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }
  private handleCreate() {
    this.dialogStatus = 'create'
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }
  // 查看物流信息
  private async queryLogistics() {
    this.loading = true
    const { data } = await queryLogistics({
      data: {
        logisticsNo: this.list.logisticsNo
      }
    })
    this.logisticsList = data.data
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
    setTimeout(() => {
      this.loading = false
    }, 0.5 * 1000)
    this.dialogFormVisible = true
  }
  // 物流发货
  private async postLogistics() {
    if (this.shipmentLogisticsList.logisticsNo == '') {
      this.$message({
        type: 'warning',
        message: '请填写快递单号'
      })
      return
    }
    this.listLoading = true
    this.shipmentLogisticsList.orderId = this.queryInfo.orderId
    const { data } = await orderSendOut({
      data: this.shipmentLogisticsList
    })
    this.getList()
    this.queryRefund()
    this.dialogShipment = false
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 事件-链接商品列表查看
  private linkGoodsListLook(index: any, row: any, word: any) {
    this.$router.push({
      name: 'CommodityClassification',
      query: {
        word: 'edit',
        goodsId: row.goods_id,
        currentPage: this.crrentPage
      }
    })
  }
  // 退款申请
  private async updateRefundApply(msg: string, id: any) {
    const { data } = await updateRefundApply({
      data: {
        refundsId: id,
        status: msg,
        actualMoney: msg == '4' ? this.actual.actualMoney : ''
      }
    })
    this.actual.actualMoney = ''
    this.actual.id = ''
    this.$message({
      message: '退款状态存在延迟,请勿重复申请退款',
      type: 'warning'
    })
    // if (msg == "4") {
    //   // 确认退款
    //   this.wxRefund(id);
    // } else {
    //   }
    this.queryRefund()
  }

  // 退款拒绝
  private async refusal(id: any) {
    const { data } = await refusal({
      data: {
        refundsId: id,
      }
    })
    this.actual.actualMoney = ''
    this.actual.id = ''
    if(data.resultCode == 1){
      this.$message({
        message:'操作成功!',
        type:'success'
      })
    }
    // if (msg == "4") {
    //   // 确认退款
    //   this.wxRefund(id);
    // } else {
    //   }
    this.queryRefund()
  }

  // 微信退款
  private async wxRefund(id: any) {
    const { data } = await wxRefund({
      data: {
        id: id
      }
    })
    this.queryRefund()
  }
  // 事件-退货操作
  private refund(msg: string, id: any) {
    if (this.actual.actualMoney == '' && msg == '4') {
      this.$message.error('金额不能为空!')
      return
    }
    let reg = /^(\d+)(.\d{0,2})?$/
    if (!reg.test(this.actual.actualMoney) && msg == '4' && Number(this.actual.actualMoney) == 0) {
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
        if(msg == '5'){
          this.refusal(id)
          return
        }
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
    this.actual.actualMoney = apply_money
    this.actual.id = id
  }
  // 事件-返回上一页
  private backPage() {
    this.$router.go(-1)
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
.img-box {
  display: inline-block;
  margin-right: 10px;
  img {
    display: none;
  }
  .goods-img {
    width: 100px;
    display: inline-block;
  }
}
</style>

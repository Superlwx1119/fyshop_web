<template>
  <div class="dashboard-editor-container">
    <div class="public-box">
      <div class="public-box-wrap">
        <div class="detailBasicInfo">
          <div class="same-header">
            <span class="same-header-left">实时概览</span>
          </div>
        </div>
        <div class="detailBasicInfo-left">
          <el-row>
            <el-col :span="2">
              <div class="grid-content bg-purple-dark">
                浏览访问
              </div>
            </el-col>
            <el-col :span="22">
              <el-col
                :span="4"
                class="card"
              >
                <p class="title">
                  访客数
                </p>
                <p class="total">
                  {{ browseVisit.visitNum.todayNum}}
                </p>
                <p class="day">
                  昨日全天
                  <span>{{ browseVisit.visitNum.yesterdayNum }}</span>
                </p>
                <p class="day">
                  较昨日数据
                  <span>{{ browseVisit.visitNum.todayYesterdayProportion }}</span>
                </p>
              </el-col>
              <el-col
                :span="4"
                class="card"
              >
                <p class="title">
                  浏览量
                </p>
                <p class="total">
                  {{ browseVisit.browseNum.todayNum }}
                </p>
                <p class="day">
                  昨日全天
                  <span>{{ browseVisit.browseNum.yesterdayNum }}</span>
                </p>
                <p class="day">
                  较昨日数据
                  <span>{{ browseVisit.browseNum.todayYesterdayProportion }}</span>
                </p>
              </el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <div class="grid-content bg-purple-dark">
                成交转化
              </div>
            </el-col>
            <el-col :span="22">
              <el-col
                :span="4"
                class="card"
              >
                <p class="title">
                  支付金额(元)
                </p>
                <p class="total">
                  {{ ransformation.payAmount.todayNum }}
                </p>
                <p class="day">
                  昨日全天
                  <span>{{ ransformation.payAmount.yesterdayNum }}</span>
                </p>
                <p class="day">
                  较昨日数据
                  <span>{{ ransformation.payAmount.todayYesterdayProportion }}</span>
                </p>
              </el-col>
              <el-col
                :span="4"
                class="card"
              >
                <p class="title">
                  成功退款金额(元)
                </p>
                <p class="total">
                  {{ ransformation.refundAmount.todayNum }}
                </p>
                <p class="day">
                  昨日全天
                  <span>{{ ransformation.refundAmount.yesterdayNum }}</span>
                </p>
                <p class="day">
                  较昨日数据
                  <span>{{ ransformation.refundAmount.todayYesterdayProportion }}</span>
                </p>
              </el-col>
              <el-col
                :span="4"
                class="card"
              >
                <p class="title">
                  营业额(元)
                </p>
                <p class="total">
                  {{ ransformation.turnover.todayNum }}
                </p>
                <p class="day">
                  昨日全天
                  <span>{{ ransformation.turnover.yesterdayNum }}</span>
                </p>
                <p class="day">
                  较昨日数据
                  <span>{{ ransformation.turnover.todayYesterdayProportion }}</span>
                </p>
              </el-col>
              <el-col
                :span="4"
                class="card"
              >
                <p class="title">
                  客单价(元)
                </p>
                <p class="total">
                  {{ ransformation.guestUnitPrice.todayNum }}
                </p>
                <p class="day">
                  昨日全天
                  <span>{{ ransformation.guestUnitPrice.yesterdayNum }}</span>
                </p>
                <p class="day">
                  较昨日数据
                  <span>{{ ransformation.guestUnitPrice.todayYesterdayProportion }}</span>
                </p>
              </el-col>
              <el-col
                :span="4"
                class="card"
              >
                <p class="title">
                  支付订单数
                </p>
                <p class="total">
                  {{ ransformation.payOrderNum.todayNum }}
                </p>
                <p class="day">
                  昨日全天
                  <span>{{ ransformation.payOrderNum.yesterdayNum }}</span>
                </p>
                <p class="day">
                  较昨日数据
                  <span>{{ ransformation.payOrderNum.todayYesterdayProportion}}</span>
                </p>
              </el-col>
              <el-col
                :span="4"
                class="card"
              >
                <p class="title">
                  访问—支付转化率
                </p>
                <p class="total">
                  {{ ransformation.visitPayProportion.todayNum }}
                </p>
                <p class="day">
                  昨日全天
                  <span>{{ ransformation.visitPayProportion.yesterdayNum }}</span>
                </p>
                <p class="day">
                  较昨日数据
                  <span>{{ ransformation.visitPayProportion.todayYesterdayProportion }}</span>
                </p>
              </el-col>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="2">
              <div class="grid-content bg-purple-dark">
                客户会员
              </div>
            </el-col>
            <el-col :span="22">
              <el-col
                :span="4"
                class="card"
              >
                <p class="title">
                  新增会员数
                </p>
                <p class="total">
                  {{ customerMember.newCustomerNum.todayNum }}
                </p>
                <p class="day">
                  昨日全天
                  <span>{{ customerMember.newCustomerNum.yesterdayNum }}</span>
                </p>
                <p class="day">
                  较昨日数据
                  <span>{{ customerMember.newCustomerNum.todayYesterdayProportion }}</span>
                </p>
              </el-col>
              <el-col
                :span="4"
                class="card"
              >
                <p class="title">
                  支付客户数
                </p>
                <p class="total">
                  {{ customerMember.payCustomerNum.todayNum }}
                </p>
                <p class="day">
                  昨日全天
                  <span>{{ customerMember.payCustomerNum.yesterdayNum }}</span>
                </p>
                <p class="day">
                  较昨日数据
                  <span>{{ customerMember.payCustomerNum.todayYesterdayProportion }}</span>
                </p>
              </el-col>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="public-box-wrap">
        <div class="detailBasicInfo">
          <div class="same-header">
            <span class="same-header-left">待办事项</span>
          </div>
        </div>
        <div class="detailBasicInfo-left">
          <el-row>
            <el-col
              :span="4"
              class="wait-card"
            >
              <p class="title">
                待发货订单
                <span>{{ waitingProcess.orderNum }}</span>
              </p>
              <router-link
                :to="{path: '/order/order-list', query: {status: '200'}}"
                class="go-detail"
              >
                去处理
              </router-link>
            </el-col>
            <el-col
              :span="4"
              :offset="2"
              class="wait-card"
            >
              <p class="title">
                退款售后
                <span>{{ waitingProcess.refundNum }}</span>
              </p>
              <router-link
                :to="{path: '/order/order-list', query: {status: '6'}}"
                class="go-detail"
              >
                去处理
              </router-link>
            </el-col>
            <el-col
              :span="4"
              :offset="2"
              class="wait-card"
            >
              <p class="title">
                已售罄商品
                <span>{{ waitingProcess.goodsNum }}</span>
              </p>
              <router-link
                :to="{path: '/commodity/commodity-list', query: {status: '15'}}"
                class="go-detail"
              >
                去查看
              </router-link>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="public-box-wrap">
        <div class="detailBasicInfo">
          <div class="same-header">
            <span class="same-header-left">常用功能</span>
          </div>
        </div>
        <div class="detailBasicInfo-left function-box">
          <el-row>
            <el-col
              :span="6"
              class="function-card"
            >
              <img
                src="./../../../images/sp.png"
                alt
              >
              <router-link to="/commodity/commodity-list-detail">
                发布商品
              </router-link>
            </el-col>
            <el-col
              :span="6"
              class="function-card"
            >
              <img
                src="./../../../images/dd.png"
                alt
              >
              <router-link to="/order/order-list">
                订单处理
              </router-link>
            </el-col>
            <el-col
              :span="6"
              class="function-card"
            >
              <img
                src="./../../../images/ysbb.png"
                alt
              >
              <router-link to="/analysis/analysis-revenue">
                营收数据
              </router-link>
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :span="6"
              class="function-card"
            >
              <img
                src="./../../../images/yhq.png"
                alt
              >
              <router-link to="/marketing/card-conf">
                优惠卡券
              </router-link>
            </el-col>
            <el-col
              :span="6"
              class="function-card"
            >
              <img
                src="./../../../images/pt.png"
                alt
              >
              <router-link to="/marketing/assemble">
                好友拼团
              </router-link>
            </el-col>
            <el-col
              :span="6"
              class="function-card"
            >
              <img
                src="./../../../images/kj.png"
                alt
              >
              <router-link to="/marketing/assistance">
                助力砍价
              </router-link>
            </el-col>
          </el-row>
        </div>
      </div>
      <div class="public-box-wrap">
        <div class="detailBasicInfo">
          <div class="same-header">
            <span class="same-header-left">今日趋势</span>
          </div>
        </div>
        <div class="detailBasicInfo-left">
          <div class="search-box">
            <el-form
              :inline="true"
              :model="listQuery"
            >
              <el-radio-group
                v-model="listQuery.type"
                @change="todayTrend"
              >
                <el-form-item label="浏览行为:">
                  <el-radio :label="1">
                    访客数
                  </el-radio>
                  <el-radio :label="2">
                    浏览量
                  </el-radio>
                </el-form-item>
                <el-form-item label="成交转化:">
                  <el-radio :label="3">
                    支付金额
                  </el-radio>
                  <el-radio :label="4">
                    支付客户数
                  </el-radio>
                  <el-radio :label="5">
                    支付订单数
                  </el-radio>
                  <el-radio :label="6">
                    客单价
                  </el-radio>
                </el-form-item>
              </el-radio-group>
              <el-form-item label="对比日期:">
                <el-date-picker
                  v-model="listQuery.date"
                  type="date"
                  placeholder="选择日期"
                  value-format="yyyy-MM-dd"
                  @change="todayTrend"
                />
              </el-form-item>
            </el-form>
            <!-- <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;"> -->
            <line-chart :chart-data="lineChartData" />
            <!-- </el-row> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import 'echarts/theme/macarons.js' // Theme used in BarChart, LineChart, PieChart and RadarChart
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { realTimeOverview, todayTrend ,waitingProcessed } from '@/api/data'
import LineChart, { ILineChartData } from './components/LineChart.vue'

@Component({
  name: 'DashboardAdmin',
  components: {
    LineChart
  }
})
export default class extends Vue {
  private listQuery: any = {
    type: 1, // 1：访客数，2：浏览数，3：支付金额，4：支付客户数，5：支付订单数，6：客单价
    date: '' // 比较日期，昨日或者以前的日期
  };
  private lineChartData = {};
  private listLoading = true;
  private pageData: any = {};
  private browseVisit: any = {
    visitNum:{
      todayNum:'',
      yesterdayNum:'',
      todayYesterdayProportion:''
    },
    browseNum:{
      todayNum:'',
      yesterdayNum:'',
      todayYesterdayProportion:''
    }
  };
  private customerMember: any = {
    newCustomerNum:{
      todayNum:'',
      yesterdayNum:'',
      todayYesterdayProportion:''
    },
    payCustomerNum:{
      todayNum:'',
      yesterdayNum:'',
      todayYesterdayProportion:''
    }
  };
  private ransformation: any = {
    guestUnitPrice:{
      todayNum:'',
      yesterdayNum:'',
      todayYesterdayProportion:''
    },
    payAmount:{
      todayNum:'',
      yesterdayNum:'',
      todayYesterdayProportion:''
    },
    payOrderNum:{
      todayNum:'',
      yesterdayNum:'',
      todayYesterdayProportion:''
    },
    refundAmount:{
      todayNum:'',
      yesterdayNum:'',
      todayYesterdayProportion:''
    },
    turnover:{
      todayNum:'',
      yesterdayNum:'',
      todayYesterdayProportion:''
    },
    visitPayProportion:{
      todayNum:'',
      yesterdayNum:'',
      todayYesterdayProportion:''
    },
  };
  private waitingProcess = {};
  // private pageData: any = {};

  created() {
    this.getPageData();
    this.waitingProcessed()
    this.todayTrend();
  }

  private async waitingProcessed(){
    const { data } = await waitingProcessed({
      data: {}
    })
    this.waitingProcess = data.data
  }

  private async getPageData() {
    this.listLoading = true
    let toDay = new Date().getFullYear()+'-'+(new Date().getMonth()+1 < 10 ? '0' + (new Date().getMonth()+1) : new Date().getMonth()+1)+'-'+(new Date().getDate() < 10 ? '0' + new Date().getDate():new Date().getDate())
    const { data } = await realTimeOverview({
      data: {
        date : toDay
      }
    })

    this.pageData = data.data
    this.browseVisit = data.data.browseVisit
    this.customerMember = data.data.customerMember
    this.ransformation = data.data.ransformation
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }
  private async todayTrend() {
    const { data } = await todayTrend({
      data: this.listQuery
    })
    this.lineChartData = data.data
  }
  // 处理默认选中当前日期
  private getNowTime() {
    let day1 = new Date()
    day1.setTime(day1.getTime() - 24 * 60 * 60 * 1000)
    let yesterDate =
      day1.getFullYear() + '-' + (day1.getMonth() + 1) + '-' + day1.getDate()
    this.listQuery.date = yesterDate
    this.todayTrend()
  }
}
</script>

<style lang="scss" scoped>
.dashboard-editor-container {
  padding: 32px;
  // background-color: rgb(240, 242, 245);
  position: relative;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 32px;
  }
}

.same-header {
  display: flex;
  align-items: center;
  padding-bottom: 12px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.same-header-left::before {
  content: "";
  display: inline-flex;
}

.same-header-left {
  flex: 1;
  font-size: 18px;
  font-weight: 600;
  border-left: 3px solid #409eff;
  padding-left: 10px;
  color: #409eff;
}

.detailBasicInfo-left {
  padding: 30px 10px 20px 10px;
  .el-form--inline .el-form-item {
    display: block;
  }
  .el-row {
    height: 120px;
    overflow: hidden;
  }
  .el-col-2 {
    width: 80px !important;
    height: 120px;
    line-height: 120px;
    text-align: center;
    color: #fff;
  }
  .el-row:nth-child(1) {
    background-color: #f3f7fd;
    .el-col-2 {
      background-color: #5c89fd;
    }
  }
  .el-row:nth-child(2) {
    background-color: #f1f8f1;
    .el-col-2 {
      background-color: #58ca79;
    }
  }
  .el-row:nth-child(3) {
    background-color: #fffbf4;
    .el-col-2 {
      background-color: #ffbc4e;
    }
  }
  .card {
    display: inline-block;
    height: 120px;
    padding: 10px 16px;
    p {
      margin: 8px 0;
    }
    .title {
      font-size: 16px;
      font-weight: 600;
    }
    .total {
      font-size: 18px;
      font-weight: 600;
    }
    .day {
      font-size: 12px;
      color: darkgray;
      span {
        float: right;
      }
    }
  }
  .wait-card {
    padding: 10px 16px;
    .title {
      margin-bottom: 40px;
      font-size: 16px;
      font-weight: 600;
      span {
        float: right;
      }
    }
    .go-detail {
      color: #409eff;
      cursor: pointer;
    }
  }
}
.function-box.detailBasicInfo-left {
  .el-row {
    height: 80px;
    line-height: 80px;
    background-color: #fff;
    .function-card {
      padding: 10px 16px;
      height: 80px;
      line-height: 60px;
      font-size: 30px;
      img {
        width: 36px;
        margin-right: 10px;
        vertical-align: sub;
      }
    }
  }
}

@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>

<template>
  <div class="app-container">
    <div class="public-box">
      <div class="detailBasicInfo">
        <div class="same-header">
          <span class="same-header-left">整体概况</span>
        </div>
      </div>
      <div class="detailBasicInfo-left">
        <el-row :gutter="32">
          <el-col
            :span="4"
            class="card"
          >
            <p class="title">
              客户总数
            </p>
            <p class="total">
              {{ list.customerNum }}
            </p>
          </el-col>
          <el-col
            :span="4"
            class="card"
          >
            <p class="title">
              访问次数
            </p>
            <p class="total">
              {{ list.accessNum }}
            </p>
          </el-col>
          <el-col
            :span="4"
            class="card"
          >
            <p class="title">
              支付客户总数
            </p>
            <p class="total">
              {{ list.customerNum }}
            </p>
          </el-col>
          <el-col
            :span="4"
            class="card"
          >
            <p class="title">
              支付次数
            </p>
            <p class="total">
              {{ list.payNum }}
            </p>
          </el-col>
          <el-col
            :span="4"
            class="card"
          >
            <p class="title">
              客户/支付转化率
            </p>
            <p class="total">
              {{ list.customerPayConversion }}
            </p>
          </el-col>
          <el-col
            :span="4"
            class="card"
          >
            <p class="title">
              访问/支付转化率
            </p>
            <p class="total">
              {{ list.accessPayConversion }}
            </p>
          </el-col>
        </el-row>
      </div>

      <div class="detailBasicInfo">
        <div class="same-header">
          <span class="same-header-left">客户画像</span>
        </div>
      </div>
      <div
        v-if="isShow"
        class="detailBasicInfo-left"
      >
        <!-- <el-row :gutter="32">
          <el-col
            :xs="24"
            :sm="24"
            :lg="12"
          >
            <div class="chart-wrapper">
              <p>男女占比</p>
              <pie-chart :chart-data="lineChartData.genderList" />
            </div>
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :lg="12"
          >
            <div class="chart-wrapper">
              <p>各平台占比</p>
              <pie-chart :chart-data="lineChartData.customerTypeList" />
            </div>
          </el-col>
        </el-row> -->
        <el-row :gutter="32">
          <el-col
            :xs="24"
            :sm="24"
            :lg="12"
          >
            <div class="chart-wrapper">
              <p>购买次数客户分布</p>
              <pie-chart :chart-data="lineChartData.orderNumList" />
            </div>
          </el-col>
          <el-col
            :xs="24"
            :sm="24"
            :lg="12"
          >
            <div class="chart-wrapper">
              <p>VIP占比</p>
              <pie-chart :chart-data="lineChartData.vipList" />
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { queryCustomerCountData, buyNumCustomer, vipCustomerNum } from '@/api/analysis'
import { formatJson } from '@/utils'
import PieChart from './components/PieChart.vue'

@Component({
  name: 'CustomerData',
  components: {
    PieChart
  }
})
export default class extends Vue {
  private lineChartData: any = {
    genderList: {
      name: '男女占比',
      legendData: [],
      seriesData: []
    },
    customerTypeList: {
      name: '各平台占比',
      legendData: [],
      seriesData: []
    },
    orderNumList: {
      name: '购买次数分布',
      legendData: [],
      seriesData: []
    },
    vipList: {
      name: 'VIP占比',
      legendData: [],
      seriesData: []
    }
  };
  private list: any = {};
  private isShow: boolean = false;
  private listLoading: boolean = true;
  private downloadLoading: boolean = false;

  created() {
    this.getList()
    this.buyNumCustomer()
    this.vipCustomerNum()
  }

  private async vipCustomerNum() {
    const { data } = await vipCustomerNum({
      data: {}
    })
    let arr = []
    let arr2 = []
    data.data.forEach(item => {
      arr.push(item.customerMemberName)
      let json = {
        value: item.customerNum,
        name: item.customerMemberName
      }
      arr2.push(json)
    })
    this.lineChartData.vipList.legendData = arr
    this.lineChartData.vipList.seriesData = arr2
  }
  private async buyNumCustomer() {
    const { data } = await buyNumCustomer({
      data: {}
    })
    let arr = []
    let arr2 = []
    data.data.forEach(item => {
      arr.push(item.name)
      let json = {
        value: item.num,
        name: item.name
      }
      arr2.push(json)
    })
    this.lineChartData.orderNumList.legendData = arr
    this.lineChartData.orderNumList.seriesData = arr2
  }
  private async getList() {
    this.listLoading = true
    const { data } = await queryCustomerCountData({
      data: {}
    })
    this.list = data.data
    // this.lineChartData.genderList.legendData = this.list.genderList;
    // this.lineChartData.genderList.seriesData = this.list.genderListData;
    // this.lineChartData.customerTypeList.legendData = this.list.customerTypeList;
    // this.lineChartData.customerTypeList.seriesData = this.list.customerTypeListData;
    // this.lineChartData.orderNumList.legendData = this.list.orderNumList;
    // this.lineChartData.orderNumList.seriesData = this.list.orderNumListData;
    // this.lineChartData.vipList.legendData = this.list.vipList;
    // this.lineChartData.vipList.seriesData = this.list.vipListData;
    setTimeout(() => {
      this.isShow = true
      this.listLoading = false
    }, 0.5 * 1000)
  }
}
</script>
<style lang="scss" scoped>
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

  .card {
    display: inline-block;
    height: 80px;
    padding: 10px 16px;
    background-color: #f3f7fd;
    p {
      margin: 8px 0;
      text-align: center;
    }
    .title {
      margin-bottom: 14px;
      font-size: 16px;
      font-weight: 600;
    }
    .total {
      font-size: 18px;
      font-weight: 600;
    }
  }
}
.chart-wrapper {
  p {
    font-size: 20px;
    font-weight: 600;
    text-align: center;
  }
}
</style>

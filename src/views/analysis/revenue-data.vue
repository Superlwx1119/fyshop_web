<template>
  <div class="app-container">
    <!-- <el-tabs
      v-model="stockStatus"
      @tab-click="changeStockStatus"
    >
      <el-tab-pane
        label="总览"
        name="0"
      />
      <el-tab-pane
        label="微信小程序"
        name="1"
      />
      <el-tab-pane
        label="支付宝小程序"
        name="2"
      />
      <el-tab-pane
        label="QQ小程序"
        name="3"
      />
      <el-tab-pane
        label="百度小程序"
        name="4"
      />
      <el-tab-pane
        label="头条小程序"
        name="5"
      />
    </el-tabs>-->
    <div class="filter-container">
      <el-row>
        <line-chart-search @searchData="searchData" />
      </el-row>
      <el-row>
        <line-chart :chart-data="lineChartData" />
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import 'echarts/theme/macarons.js' // Theme used in BarChart, LineChart, PieChart and RadarChart
import { Component, Vue } from 'vue-property-decorator'
import { UserModule } from '@/store/modules/user'
import { queryOrderCountData, queryOrderData } from '@/api/analysis'
import LineChart, { ILineChartData } from './components/LineChart.vue'
import LineChartSearch from './components/LineChartSearch.vue'
import { formatJson } from '@/utils'

@Component({
  name: 'RevenueData',
  components: {
    LineChart,
    LineChartSearch
  }
})
export default class extends Vue {
  private list: any = {};
  private listLoading: boolean = true;
  private stockStatus = '0';
  private listQuery: any = {};

  private downloadLoading: boolean = false;
  private lineChartData: any = {};

  created() {
    this.getList()
    // this.getData()
  }

  private handleSetLineChartData(type: string) {}

  private searchData(data: any) {
    this.listQuery = data
    this.getList()
  }
  private async getData(val) {
    const { data } = await queryOrderData({
      data: this.listQuery
    })
    val.chartData = data.data
    this.lineChartData = val
    // this.lineChartData = data.data;
  }
  private async getList() {
    this.listLoading = true
    const { data } = await queryOrderCountData({
      data: this.listQuery
    })
    // this.lineChartData = data.data;
    this.getData(data.data)
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 切换商品状态
  private changeStockStatus(e: any) {
    switch (e.name) {
      case '1':
        this.listQuery.status = '2'
        this.listQuery.stockEmptyFlag = null
        break
      case '2':
        this.listQuery.status = '0'
        this.listQuery.stockEmptyFlag = '1'
        break
      default:
        this.listQuery.status = '1'
        this.listQuery.stockEmptyFlag = null
        break
    }
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
</style>

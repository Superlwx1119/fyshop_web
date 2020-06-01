<template>
  <div>
    <el-row class="chart-search" />
    <el-row class="panel-group">
      <el-col
        :span="4"
        class="card-panel-col"
      >
        <div class="card-panel-description">
          <div class="card-panel-text">
            订单
          </div>
          <div class="card-panel-num">
            {{ pageData.payOrderNum }}笔
          </div>
        </div>
      </el-col>
      <el-col
        :span="4"
        :offset="1"
        class="card-panel-col"
      >
        <div class="card-panel-description">
          <div class="card-panel-text">
            销售总金额
          </div>
          <div class="card-panel-num">
            ￥{{ pageData.payAmount }}
          </div>
        </div>
      </el-col>
      <el-col
        :span="4"
        :offset="1"
        class="card-panel-col"
      >
        <div class="card-panel-description">
          <div class="card-panel-text">
            退款金额
          </div>
          <div class="card-panel-num">
            ￥{{ pageData.refundAmount }}
          </div>
        </div>
      </el-col>
      <el-col
        :span="4"
        :offset="1"
        class="card-panel-col"
      >
        <div class="card-panel-description">
          <div class="card-panel-text">
            实际总金额
          </div>
          <div class="card-panel-num">
            ￥{{ pageData.turnover }}
          </div>
        </div>
      </el-col>
      <!-- <el-col
        :span="4"
        :offset="1"
        class="card-panel-col"
      >
        <div class="card-panel-description">
          <div class="card-panel-text">
            实际总利润
          </div>
          <div class="card-panel-num">
            ￥{{ chartData.orderLastMoney }}
          </div>
        </div>
      </el-col> -->
    </el-row>
    <div
      id="lineChart"
      :class="className"
      :style="{height: height, width: width}"
    />
  </div>
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'
import CountTo from 'vue-count-to'

export interface ILineChartData {
  nameList: any[];
  valueList: any[];
  orderLastMoney: any;
  incomeMoney: any;
  orderNumber: any;
  refundMoney: any;
  saleMoney: any;
}

@Component({
  name: 'LineChart',
  components: {
    CountTo
  }
})
export default class extends mixins(ResizeMixin) {
  @Prop({ required: true }) private chartData!: ILineChartData;
  @Prop({ default: 'chart' }) private className!: string;
  @Prop({ default: '98%' }) private width!: string;
  @Prop({ default: '350px' }) private height!: string;

  @Watch('chartData', { deep: true })
  private onChartDataChange(value: ILineChartData) {
    this.setOptions(value)
  }

  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  }

  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  }
  private pageData = {}
  private initChart() {
    // this.chart = echarts.init(this.$el as HTMLDivElement, "macarons");
    let id: any = document.getElementById('lineChart')
    this.chart = echarts.init(id)
    // this.setOptions(this.chartData);
  }

  private setOptions(chartData: ILineChartData) {
    if (this.chart) {
      let arr1 = []
      let arr2 = []
      this.pageData = this.chartData.chartData
      chartData.actualTotalAmount.forEach(item=>{
        arr1.push(item.dataValue)
      })
      chartData.salesTotalAmount.forEach(item=>{
        arr2.push(item.dataValue)
      })
      // chartData.chartData.lineData.forEach(item => {
      //   let json = {
      //     name: item.name,
      //     itemStyle: {
      //       // color: '#FF005A',
      //       lineStyle: {
      //         // color: '#FF005A',
      //         width: 2
      //       }
      //     },
      //     smooth: true,
      //     type: 'line',
      //     data: item.data,
      //     animationDuration: 2800,
      //     animationEasing: 'cubicInOut'
      //   }
      //   arrY.push(json)
      // })
      this.chart.setOption({
        xAxis: {
          data: chartData.abscissa,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        legend: {
          data: ['销售总金额','实际总金额']
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross'
          },
          padding: 8
        },
        yAxis: {
          axisTick: {
            show: false
          }
        },
        // legend: {
        //   data: ["expected"]
        // },
        series: [
          {
            name: '销售总金额',
            itemStyle: {
              // color: '#FF005A',
              lineStyle: {
                // color: '#FF005A',
                width: 2
              }
            },
            smooth: true,
            type: 'line',
            data: arr2,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          },
          {
          name: '实际总金额',
            itemStyle: {
              // color: '#FF005A',
              lineStyle: {
                // color: '#FF005A',
                width: 2
              }
            },
            smooth: true,
            type: 'line',
            data: arr1,
            animationDuration: 2800,
            animationEasing: 'cubicInOut'
          }
        ]
      } as EChartOption<EChartOption.SeriesLine>)
    }
  }
}
</script>
<style lang="scss" scoped>
.panel-group {
  margin-top: 18px;
  background-color: aliceblue;

  .card-panel-description {
    font-weight: bold;
    margin: 26px;
    margin-left: 0px;
    text-align: center;

    .card-panel-text {
      line-height: 16px;
      color: rgba(0, 0, 0, 0.45);
      font-size: 14px;
      margin-bottom: 12px;
    }

    .card-panel-num {
      font-size: 18px;
    }
  }
}
#lineChart {
  background: #fff;
  padding: 16px 16px 0;
  margin: 32px 0;
}
</style>

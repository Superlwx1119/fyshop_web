<template>
  <div
    :class="className"
    :style="{height: height, width: width}"
  />
</template>

<script lang="ts">
import echarts, { EChartOption } from 'echarts'
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'
export interface ILineChartData {
  legendData: string[];
  seriesData: any[];
  name: string;
}
@Component({
  name: 'PieChart'
})
export default class extends mixins(ResizeMixin) {
  @Prop({ required: true }) private chartData!: ILineChartData;
  @Prop({ default: 'chart' }) private className!: string;
  @Prop({ default: '100%' }) private width!: string;
  @Prop({ default: '360px' }) private height!: string;
  private data: any = [
    'Industries',
    'Technology',
    'Forex',
    'Gold',
    'Forecasts'
  ];

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

  private initChart() {
    this.chart = echarts.init(this.$el as HTMLDivElement, 'macarons')
    this.chart.setOption({
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        left: 'center',
        bottom: '10',
        data: this.chartData.legendData
      },
      series: [
        {
          name: this.chartData.name,
          type: 'pie',
          roseType: 'radius',
          radius: [15, 95],
          center: ['50%', '45%'],
          data: this.chartData.seriesData,
          animationEasing: 'cubicInOut',
          animationDuration: 2600
        }
      ]
    } as EChartOption<EChartOption.SeriesPie>)
  }
}
</script>

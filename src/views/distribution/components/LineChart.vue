<template>
  <div>
    <div id="lineChart" :class="className" :style="{height: height, width: width}" />
  </div>
</template>

<script lang="ts">
import echarts, { EChartOption } from "echarts";
import { Component, Prop, Watch } from "vue-property-decorator";
import { mixins } from "vue-class-component";
import ResizeMixin from "@/components/Charts/mixins/resize";
import CountTo from "vue-count-to";

export interface ILineChartData {
  coord: any[];
  zcjData: any[];
}

@Component({
  name: "LineChart",
  components: {
    CountTo
  }
})
export default class extends mixins(ResizeMixin) {
  @Prop({ required: true }) private chartData!: ILineChartData;
  @Prop({ default: "chart" }) private className!: string;
  @Prop({ default: "100%" }) private width!: string;
  @Prop({ default: "350px" }) private height!: string;

  @Watch("chartData", { deep: true })
  private onChartDataChange(value: ILineChartData) {
    this.setOptions(value);
  }

  mounted() {
    this.$nextTick(() => {
      this.initChart();
    });
  }

  beforeDestroy() {
    if (!this.chart) {
      return;
    }
    this.chart.dispose();
    this.chart = null;
  }

  private initChart() {
    let id: any = document.getElementById("lineChart");
    this.chart = echarts.init(id);
  }

  private setOptions(chartData: ILineChartData) {
    if (this.chart) {
      this.chart.setOption({
        xAxis: {
          data: chartData.coord,
          boundaryGap: false,
          axisTick: {
            show: false
          }
        },
        grid: {
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross"
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
            name: "",
            itemStyle: {
              color: "#FF005A",
              lineStyle: {
                color: "#FF005A",
                width: 2
              }
            },
            smooth: true,
            type: "line",
            data: chartData.zcjData,
            animationDuration: 2800,
            animationEasing: "cubicInOut"
          }
        ]
      } as EChartOption<EChartOption.SeriesLine>);
    }
  }
}
</script>
<style lang="scss" scoped>
#lineChart {
  background: #fff;
  padding: 16px 16px 0;
  margin: 32px 0;
}
</style>

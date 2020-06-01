<template>
  <div class="app-container">
    <div class="detailBasicInfo-left function-box">
      <el-row>
        <el-col :span="4" class="function-card df jc-sb">
          <img src="./../../images/kh.png" alt />
          <div class="card-text">
            <p>微客数量</p>
            <p>{{distributorData.wkNum}}</p>
          </div>
        </el-col>
        <el-col :span="4" class="function-card df jc-sb" :offset="1">
          <img src="./../../images/kh2.png" alt />
          <div class="card-text">
            <p>推入客户数</p>
            <p>{{distributorData.fxtrkhNum}}</p>
          </div>
        </el-col>
        <el-col :span="4" class="function-card df jc-sb" :offset="1">
          <img src="./../../images/sp.png" alt />
          <div class="card-text">
            <p>推入成交单数</p>
            <p>{{distributorData.fxcjdsNum}}</p>
          </div>
        </el-col>
        <el-col :span="4" class="function-card df jc-sb" :offset="1">
          <img src="./../../images/je.png" alt />
          <div class="card-text">
            <p>推入总成交额</p>
            <p>{{distributorData.fxzcjNum}}</p>
          </div>
        </el-col>
        <el-col :span="4" class="function-card df jc-sb" :offset="1">
          <img src="./../../images/jq.png" alt />
          <div class="card-text">
            <p>发放奖励</p>
            <p>{{distributorData.fxhdNum}}</p>
          </div>
        </el-col>
      </el-row>
    </div>
    <div class="filter-container">
      <el-row>
        <!-- <line-chart-search @searchData="searchData" /> -->
        <el-radio-group v-model="timeType" @change="changeRadio">
          <el-radio-button :label="0">今日</el-radio-button>
          <el-radio-button :label="1">昨日</el-radio-button>
          <el-radio-button :label="2">本周</el-radio-button>
          <el-radio-button :label="3">上周</el-radio-button>
          <el-radio-button :label="4">本月</el-radio-button>
          <el-radio-button :label="5">上月</el-radio-button>
        </el-radio-group>
      </el-row>
      <el-row class="panel-group">
        <el-col :span="4" class="card-panel-col">
          <div class="card-panel-description">
            <div class="card-panel-text">新增微客数量</div>
            <div class="card-panel-num">{{ distributorTimeData.wkNum }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="card-panel-col">
          <div class="card-panel-description">
            <div class="card-panel-text">新增推入访客</div>
            <div class="card-panel-num">{{ distributorTimeData.fxtrkhNum }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="card-panel-col">
          <div class="card-panel-description">
            <div class="card-panel-text">推入访客访问数</div>
            <div class="card-panel-num">{{ distributorTimeData.fxtrkhfwNum }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="card-panel-col">
          <div class="card-panel-description">
            <div class="card-panel-text">推入成交单数</div>
            <div class="card-panel-num">{{ distributorTimeData.fxcjdsNum }}笔</div>
          </div>
        </el-col>
        <el-col :span="4" class="card-panel-col">
          <div class="card-panel-description">
            <div class="card-panel-text">推入成交额</div>
            <div class="card-panel-num">￥{{ distributorTimeData.fxzcjNum }}</div>
          </div>
        </el-col>
        <el-col :span="4" class="card-panel-col">
          <div class="card-panel-description">
            <div class="card-panel-text">发放奖励</div>
            <div class="card-panel-num">￥{{ distributorTimeData.fxhdNum }}</div>
          </div>
        </el-col>
      </el-row>
      <el-row>
        <line-chart :chart-data="lineChartData" />
      </el-row>
    </div>
  </div>
</template>

<script lang="ts">
import "echarts/theme/macarons.js";
import { Component, Vue } from "vue-property-decorator";
import {
  getDistributorCurveData,
  getDistributorTimeData,
  getDistributorDataByShopId
} from "@/api/distribution";
import LineChart, { ILineChartData } from "./components/LineChart.vue";

@Component({
  name: "RevenueData",
  components: {
    LineChart
  }
})
export default class extends Vue {
  private list: any = {};
  private listLoading:boolean  = true;
  private stockStatus = "0";
  private timeType: number = 0;
  private downloadLoading: boolean = false;
  private lineChartData: any = {};
  private distributorData: any = {};
  private distributorTimeData: any = {};

  created() {
    this.getDistributorCurveData();
    this.getDistributorDataByShopId();
    this.getDistributorTimeData();
  }

  private handleSetLineChartData(type: string) {}

  private changeRadio(timeType: number) {
    this.timeType = timeType;
    this.getDistributorCurveData();
    this.getDistributorTimeData();
  }

  private async getDistributorCurveData() {
    this.listLoading = true;
    const { data } = await getDistributorCurveData({
      data: {
        timeType: this.timeType
      }
    });
    this.lineChartData = data.data;
    setTimeout(() => {
      this.listLoading = false;
    }, 0.5 * 1000);
  }

  private async getDistributorDataByShopId() {
    this.listLoading = true;
    const { data } = await getDistributorDataByShopId({
      data: {}
    });
    this.distributorData = data.data;
    setTimeout(() => {
      this.listLoading = false;
    }, 0.5 * 1000);
  }

  private async getDistributorTimeData() {
    this.listLoading = true;
    const { data } = await getDistributorTimeData({
      data: {
        timeType: this.timeType
      }
    });
    this.distributorTimeData = data.data;
    setTimeout(() => {
      this.listLoading = false;
    }, 0.5 * 1000);
  }
}
</script>
<style lang="scss" scoped>
.function-box.detailBasicInfo-left {
  .el-row {
    height: 100px;
    margin-bottom: 20px;
    line-height: 100px;
    background-color: #fff;
    .function-card {
      padding: 10px 16px;
      height: 100px;
      background-color: aliceblue;
      border-radius: 4px;
      img {
        width: 60px;
        margin-right: 10px;
        vertical-align: sub;
      }
      .card-text {
        font-size: 18px;
        line-height: 20px;
        p {
          margin: 10px;
          text-align: right;
        }
      }
    }
  }
}
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
</style>

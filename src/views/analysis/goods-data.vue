<template>
  <div class="app-container">
    <div class="public-box">
      <div class="detailBasicInfo">
        <div class="same-header">
          <span class="same-header-left">整体概况</span>
        </div>
      </div>
      <div class="detailBasicInfo-left">
        <el-row>
          <el-col :span="2">
            <div class="grid-content bg-purple-dark">
              商品概况
            </div>
          </el-col>
          <el-col :span="22">
            <el-col
              :span="4"
              class="card"
            >
              <p class="title">
                上架商品数
              </p>
              <p class="total">
                {{ data.shelvesGoodsNum }}
              </p>
            </el-col>
            <el-col
              :span="4"
              class="card"
            >
              <p class="title">
                被访问商品数
              </p>
              <p class="total">
                {{ data.accessGoodsNum }}
              </p>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="grid-content bg-purple-dark">
              商品流量
            </div>
          </el-col>
          <el-col :span="22">
            <el-col
              :span="4"
              class="card"
            >
              <p class="title">
                商品浏览量
              </p>
              <p class="total">
                {{ data.commodityFlowNum }}
              </p>
            </el-col>
            <el-col
              :span="4"
              class="card"
            >
              <p class="title">
                商品浏览人数
              </p>
              <p class="total">
                {{ data.commodityFlowCustomerNum }}
              </p>
            </el-col>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="2">
            <div class="grid-content bg-purple-dark">
              商品转化
            </div>
          </el-col>
          <el-col :span="22">
            <el-col
              :span="4"
              class="card"
            >
              <p class="title">
                下单商品数
              </p>
              <p class="total">
                {{ data.orderGoodsNum }}
              </p>
            </el-col>
            <el-col
              :span="4"
              class="card"
            >
              <p class="title">
                支付商品数
              </p>
              <p class="total">
                {{ data.payGoodsNum }}
              </p>
            </el-col>
          </el-col>
        </el-row>
      </div>

      <div class="detailBasicInfo">
        <div class="same-header">
          <span class="same-header-left">商品排行</span>
        </div>
      </div>
      <div class="detailBasicInfo-left">
        <el-tabs
          v-model="stockStatus"
          @tab-click="changeStockStatus"
        >
          <el-tab-pane
            label="访客排行"
            name="1"
          />
          <el-tab-pane
            label="销量排行"
            name="2"
          />
          <el-tab-pane
            label="访客/销量转化率排行"
            name="3"
          />
        </el-tabs>
        <el-table
          :key="tableKey"
          v-loading="listLoading"
          :data="list"
          border
          fit
          highlight-current-row
          style="width: 100%;"
          @sort-change="sort"
        >
          <el-table-column
            align="center"
            label="排行"
            type="index"
            width="55"
          />
          <!-- <el-table-column
            :label="$t('table.productCde')"
            prop="goodNum"
            align="center"
            width="80"
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
            :label="$t('table.productGrouping')"
            width="180px"
            prop="goodsTypeName"
            align="center"
          />
          <el-table-column
            label="价格"
            width="110px"
            prop="price"
            align="center"
          />
          <el-table-column
            label="访客"
            width="105px"
            prop="visitors"
            align="center"
          />
          <el-table-column
            label="销量"
            prop="sales"
            align="center"
            width="95"
          />
          <el-table-column
            label="销量/访客转化率"
            width="180px"
            prop="salesVisitors"
            align="center"
          >
            <template slot-scope="scope">
              {{ scope.row.salesVisitors }}%
            </template>
          </el-table-column>
          <!-- <el-table-column
            :label="$t('table.actions')"
            align="center"
            width="230"
            class-name="fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                @click="goDetail(scope.row.goodsId)"
              >
                详情
              </el-button>
            </template>
          </el-table-column> -->
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
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getGoodsList,
  shelfGood,
  deleteGood,
  listGoodsType,
  listQuery
} from '@/api/commodity'
import { queryGoodsCountData , goodsRankingList } from '@/api/analysis'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'GoodsData',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private tableKey = 0;
  private list = [];
  private data = {};
  private total: number = 0;
  private listLoading = true;
  private pageSize: number = 20;
  private currentPage: number = 1;
  private stockStatus = '1';
  private listQuery = listQuery;
  private importanceOptions = [];
  private downloadLoading: boolean = false;

  created() {
    this.getList()
    this.getData()
  }

  private async getList() {
    this.listLoading = true
    this.listQuery.simpleFlag = '6'
    this.listQuery.stockEmptyFlag = '2'
    const { data } = await goodsRankingList({
      data: this.listQuery,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    })
    this.list = data.data.list
    this.total = data.data.total
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }
  private async getData() {
    this.listLoading = true
    const { data } = await queryGoodsCountData({
      data: {}
    })
    this.data = data.data
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 切换商品状态
  private changeStockStatus(e: any) {
    switch (e.name) {
      case '2':
        this.listQuery.type = '2'
        break
      case '3':
        this.listQuery.type = '3'
        break
      default:
        this.listQuery.type = '1'
        break
    }

    this.getList()
  }

  // 切换商品状态
  private sort(column: any, prop: any, order: any) {
    let propList: any = {
      price: 3
    }
    this.listQuery.type = propList[column.prop]
    column.order === 'ascending'
      ? (this.listQuery.sortType = 1)
      : (this.listQuery.sortType = 2)
    this.getList()
  }

  private handleFilter() {
    this.currentPage = 1
    this.getList()
  }

  // 事件-链接商品列表查看
  private goDetail(id: string) {
    this.$router.push({
      name: 'AnalysisGoodsDetail',
      query: {
        goodsId: id
      }
    })
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
  .el-row {
    height: 80px;
    overflow: hidden;
  }
  .el-col-2 {
    width: 80px !important;
    height: 80px;
    line-height: 80px;
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
    height: 80px;
    padding: 10px 16px;
    p {
      margin: 8px 0;
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
</style>

<template>
  <div class="app-container">
    <div class="public-box">
      <el-tabs
        v-model="stockStatus"
        @tab-click="changeStockStatus"
      >
        <el-tab-pane
          label="未分销商品"
          name="1"
        />
        <el-tab-pane
          label="分销中商品"
          name="0"
        />
      </el-tabs>
      <div class="filter-container">
        <el-form
          :inline="true"
          :model="listQuery"
          class="demo-form-inline"
        >
          <el-form-item label="商品分类:">
            <el-select
              v-model="listQuery.type_id"
              :placeholder="$t('table.type')"
              clearable
              style="width: 200px"
              class="filter-item"
            >
              <el-option
                v-for="item in importanceOptions"
                :key="item.typeId"
                :label="item.typeName"
                :value="item.typeId"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="参与活动:">
            <el-select
              v-model="listQuery.cyhd"
              :placeholder="$t('table.type')"
              clearable
              style="width: 200px"
              class="filter-item"
            >
              <el-option
                v-for="item in cyhdOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label>
            <el-input
              v-model="listQuery.keyword"
              placeholder="商品名称"
              style="width: 200px;"
              class="filter-item"
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
        <div class="other-operate-btn">
          <el-button
            v-if="stockStatus==1"
            type="success"
            @click="editBatch('批量参与')"
          >
            批量参与
          </el-button>
          <el-button
            v-if="stockStatus==0"
            type="primary"
            @click="editBatch('批量设置')"
          >
            批量设置
          </el-button>
          <el-button
            v-if="stockStatus==0"
            type="danger"
            @click="editBatch('批量取消')"
          >
            批量取消
          </el-button>
        </div>
      </div>

      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="list"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
        />
        <el-table-column
          :label="$t('table.productCde')"
          prop="good_num"
          align="center"
          width="100"
        />
        <el-table-column
          :label="$t('table.productImage')"
          align="center"
        >
          <template slot-scope="{row}">
            <el-image
              style="width: 40px"
              :src="row.image_path"
              :preview-src-list="[row.image_path]"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.productName')"
          prop="good_name"
          min-width="150px"
          align="center"
        />
        <el-table-column
          :label="$t('table.productGrouping')"
          width="180px"
          prop="type_name"
          align="center"
        />
        <el-table-column
          label="参与活动"
          width="110"
          prop="price"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.cyhd==0?'好友拼团': scope.row.cyhd==1?'助力砍价':'无活动' }}
          </template>
        </el-table-column>
        <el-table-column
          label="原价"
          prop="price"
          align="center"
          width="95"
        />
        <el-table-column
          label="进价"
          prop="purchase_price"
          align="center"
          width="95"
        />
        <el-table-column
          label="活动最低价"
          prop="hdzdj"
          align="center"
          width="95"
        />
        <el-table-column
          v-if="stockStatus==0"
          label="奖励比例"
          width="110"
          prop="readSaleRatio"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.distributor_proportion }}%
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.actions')"
          align="center"
          width="180"
          class-name="fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-if="stockStatus==1"
              size="mini"
              type="primary"
              @click="openDialog('参与',scope.row)"
            >
              参与
            </el-button>
            <el-button
              v-if="stockStatus==0"
              size="mini"
              type="success"
              @click="getGoodDistributorData(scope.row.good_id)"
            >
              数据
            </el-button>
            <el-button
              v-if="stockStatus==0"
              size="mini"
              type="primary"
              @click="openDialog('设置',scope.row)"
            >
              设置
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
    </div>
    <el-dialog
      :title="dialogStatus"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="tempArticleData"
        :model="tempArticleData"
        label-position="left"
        label-width="120px"
        style="margin-left:50px;"
        :rules="rules"
      >
        <el-form-item
          label="奖励比例："
          prop="proportion"
        >
          <el-input
            v-model="tempArticleData.proportion"
            style="width:240px;"
            placeholder="请输入比例为1-29的整数"
          />&nbsp;&nbsp;%
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="editStockSubmit()"
        >
          {{ $t('table.confirm') }}
        </el-button>
        <el-button
          type
          @click="dialogFormVisible = false"
        >
          {{ $t('table.close') }}
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="数据效果"
      :visible.sync="dialogVisible"
    >
      <el-row>
        <el-col :span="6">
          <p class="card-title">
            推入总成交额
          </p>
          <p class="card-nub">
            ￥{{ goodDistributorData.fxzcjNum }}
          </p>
        </el-col>
        <el-col :span="6">
          <p class="card-title">
            推入成交单数
          </p>
          <p class="card-nub">
            {{ goodDistributorData.fxcjdsNum }}
          </p>
        </el-col>
        <el-col :span="6">
          <p class="card-title">
            推入访客数
          </p>
          <p class="card-nub">
            {{ goodDistributorData.fxtrkhfwNum }}
          </p>
        </el-col>
        <el-col :span="6">
          <p class="card-title">
            推入支付客户数
          </p>
          <p class="card-nub">
            {{ goodDistributorData.fxtrkhNum }}
          </p>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { listGoodsType } from '@/api/commodity'
import { queryGoodsCountData } from '@/api/analysis'
import { formatJson } from '@/utils'
import { Form, Form as ElForm } from 'element-ui'
import {
  getDistributorGoodListData,
  saveDistributorGood,
  updDistributorGood,
  getGoodDistributorData
} from '@/api/distribution'
import Pagination from '@/components/Pagination/index.vue'

interface listQuery {
  isfx: string;
  cyhd: string;
  type_id: string;
  keyword: string;
}

@Component({
  name: 'GoodsData',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private tableKey = 0;
  private list: any = [];
  private data: any = {};
  private goodDistributorData: any = {};
  private multipleSelectArr: any = [];
  private total: number = 0;
  private listLoading = true;
  private pageSize: number = 20;
  private currentPage: number = 1;
  private stockStatus = '1';
  private listQuery: listQuery = {
    isfx: '1',
    cyhd: '',
    type_id: '',
    keyword: ''
  };
  private dialogFormVisible = false;
  private dialogVisible = false;
  private importanceOptions: any = [];
  private cyhdOptions: any = [
    { label: '好友拼团', value: 0 },
    { label: '助力砍价', value: 1 },
    { label: '无活动', value: 2 }
  ];
  private dialogStatus: string = '';
  private rules = {
    proportion: [{ required: true, message: '请输入奖励比例', trigger: 'blur' }]
  };
  private tempArticleData = {
    id: '',
    proportion: 0 // 比例
  };

  created() {
    this.getList()
    this.getType()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getDistributorGoodListData({
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

  // 获取商品分类
  private async getType() {
    this.listLoading = true
    const { data } = await listGoodsType({
      data: { pageFlag: '2' }
    })
    this.importanceOptions = data.data.list
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 获取商品分销商品分销效果数据
  private async getGoodDistributorData(id: string) {
    this.listLoading = true
    const { data } = await getGoodDistributorData({
      data: { good_id: id }
    })
    this.goodDistributorData = data.data
    setTimeout(() => {
      this.listLoading = false
      this.dialogVisible = true
    }, 0.5 * 1000)
  }

  private handleSelectionChange(val: any) {
    this.multipleSelectArr = val
  }

  // 事件-批量编辑状态
  private editBatch(status: string) {
    if (this.multipleSelectArr.length != 0) {
      let item = this.multipleSelectArr
      let strArr: Array<string> = []
      item.forEach((v: any, i: any) => {
        this.listQuery.isfx == '1'
          ? strArr.push(v.good_id)
          : strArr.push(v.distributor_good_id)
      })
      if (status == '批量取消') {
        this.delStock(strArr.join(','))
      } else {
        this.openDialog(status, strArr.join(','))
      }
    } else {
      this.$message({
        message: '没有勾选数据哦',
        type: 'warning'
      })
    }
  }

  // 批量取消
  private delStock(ids: string) {
    this.$confirm(`确认批量取消分销中的商品?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.setData(ids, true)
      })
      .catch(error => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
  }

  // 编辑提交
  private editStockSubmit() {
    if (
      this.tempArticleData.proportion > 0 &&
      this.tempArticleData.proportion < 30
    ) {
      // 看情况是否需要不同接口
      (this.$refs['tempArticleData'] as ElForm).validate((valid: boolean) => {
        switch (this.dialogStatus) {
          case '参与':
            this.addData(this.tempArticleData.id)
            break
          case '设置':
            this.setData(this.tempArticleData.id, false)
            break
          case '批量参与':
            this.addData(this.tempArticleData.id)
            break
          case '批量设置':
            this.setData(this.tempArticleData.id, false)
            break
        }
      })
    } else {
      return this.$message({
        message: '请输入比例为1-29的整数',
        type: 'warning'
      })
    }
  }

  // 参加奖励比例
  private async addData(id: string) {
    const { data } = await saveDistributorGood({
      data: {
        good_id: id,
        distributor_proportion: this.tempArticleData.proportion / 100,
        upd_employee_id: this.$store.state.user.info.employeeid
      }
    })
    this.postMeg(data.resultCode, data.resultInfo)
  }

  // 设置奖励比例
  private async setData(id: string, isDel: boolean) {
    const { data } = await updDistributorGood({
      data: {
        distributor_good_id: id,
        distributor_proportion: this.tempArticleData.proportion / 100,
        state: isDel ? 1 : 0,
        upd_employee_id: this.$store.state.user.info.employeeid
      }
    })
    this.postMeg(data.resultCode, data.resultInfo)
  }

  // 提交请求，后续处理
  private postMeg(code: string, info: string) {
    this.$message({
      message: info,
      type: code == '1' ? 'success' : 'warning'
    })
    setTimeout(() => {
      if (code == '1') {
        this.dialogFormVisible = false
        this.getList()
      }
    }, 1000)
  }

  // 切换状态
  private changeStockStatus(e: any) {
    this.listQuery.isfx = e.name
    this.getList()
  }

  private handleFilter() {
    this.currentPage = 1
    this.getList()
  }

  // 打开弹框
  private openDialog(status: string, row: any) {
    this.tempArticleData.proportion = 0
    if (status.length > 2) {
      this.tempArticleData.id = row
    } else {
      if (this.listQuery.isfx == '1') {
        this.tempArticleData.id = row.good_id
      } else {
        this.tempArticleData.id = row.distributor_good_id
        this.tempArticleData.proportion = row.distributor_proportion * 100
      }
    }
    this.dialogStatus = status
    this.dialogFormVisible = true;
    (this.$refs['tempArticleData'] as ElForm).clearValidate()
  }
}
</script>
<style lang="scss" scoped>
.other-operate-btn {
  flex: 1;
  display: flex;
  padding-right: 50px;
  margin-bottom: 10px;
  margin-top: -10px;
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

.el-dialog {
  .el-col-6 {
    text-align: center;
    .card-title {
      font-size: 16px;
      font-weight: 700;
    }
    .card-nub {
      font-size: 16px;
      font-weight: 500;
      color: tomato;
    }
  }
}
</style>

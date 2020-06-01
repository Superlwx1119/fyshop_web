<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        :inline="true"
        :model="listQuery"
        class="demo-form-inline"
      >
        <el-form-item label="砍价状态:">
          <el-select
            v-model="listQuery.state"
            placeholder="全部状态"
            clearable
            style="width: 200px"
            class="filter-item"
          >
            <el-option
              v-for="item in stateOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类:">
          <el-select
            v-model="listQuery.type"
            placeholder="全部分类"
            clearable
            style="width: 200px"
            class="filter-item"
          >
            <el-option
              v-for="item in importanceOptions"
              :key="item.goodsTypeId"
              :label="item.goodsTypeName"
              :value="item.goodsTypeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-input
            v-model="listQuery.goodsName"
            placeholder="活动商品关键词"
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
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="goDetail('add')"
          >
            {{ $t('table.add') }}砍价
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!-- <el-table-column label="商品货号" prop="goods_number" align="center" width="80" /> -->
      <el-table-column
        label="商品图片"
        width="110px"
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
        label="商品名称"
        min-width="150"
        align="center"
        prop="goodsName"
      />
      <el-table-column
        label="商品分组"
        width="140"
        align="center"
        prop="goodsTypeName"
      />
      <el-table-column
        label="起止时间"
        width="165"
        align="center"
        prop="time"
      />
      <el-table-column
        label="砍价状态"
        width="95"
        align="center"
        prop="stateValue"
      />
      <el-table-column
        label="需要人数"
        width="95"
        align="center"
        prop="bargainNumber"
      />
      <el-table-column
        label="原价"
        width="95"
        align="center"
        prop="priceOut"
      />
      <el-table-column
        label="最低价"
        align="center"
        width="95"
        prop="priceStr"
      />
      <el-table-column
        label="库存"
        align="center"
        width="95"
        prop="stock"
      />
      <el-table-column
        label="砍价库存"
        align="center"
        width="95"
        prop="stock"
      />
      <el-table-column
        label="砍价销量"
        align="center"
        width="95"
        prop="sales"
      />
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="230"
        class-name="fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="goDetail('edit', scope.row.bargainId)"
          >
            编辑
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="openDialog('edit',scope.$index, scope.row)"
          >
            数据
          </el-button>
          <el-button
            size="mini"
            type="danger"
            :disabled="scope.row.disabled"
            @click="deleteSubmit(scope.row)"
          >
            {{ $t('table.delete') }}
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
    <el-dialog
      title="砍价"
      :visible.sync="dialogFormVisible"
    >
      <el-row>
        <el-col :span="8">
          <p class="card-title">
            砍价总成交额
          </p>
          <p class="card-nub">
            ￥{{ bargainData.totalAmount }}
          </p>
        </el-col>
        <el-col :span="8">
          <p class="card-title">
            砍价成交数
          </p>
          <p class="card-nub">
            {{ bargainData.totalOrder }}
          </p>
        </el-col>
        <el-col :span="8">
          <p class="card-title">
            参与老客户
          </p>
          <p class="card-nub">
            {{ bargainData.oldParticipateCustomer }}
          </p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <p class="card-title">
            砍价总优惠额
          </p>
          <p class="card-nub">
            ￥{{ bargainData.totalDiscountAmount }}
          </p>
        </el-col>
        <!-- <el-col :span="8">
          <p class="card-title">销量/库存占比</p>
          <p class="card-nub">￥88</p>
        </el-col> -->
        <el-col :span="8">
          <p class="card-title">
            参与新客户
          </p>
          <p class="card-nub">
            {{ bargainData.newParticipateCustomer }}
          </p>
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { listGoodsType } from '@/api/commodity'
import { getBargainActivityList, saveBargainActivity, getBargainData, deleteBargainActivity } from '@/api/marketing'

import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'Assistance',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private tableKey = 0;
  private list = [];
  private total: number = 0;
  private listLoading: boolean = true;
  private dialogFormVisible: boolean = false;
  private pageSize: number = 20;
  private currentPage: number = 1;
  private listQuery = {
    shop_id: this.$store.state.user.info.shopid,
    state: '',
    type: '',
    goods_name: ''
  };
  private importanceOptions = [];
  private stateOptions = [
    { value: 0, label: '进行中' },
    { value: 1, label: '未开始' },
    { value: 2, label: '已结束' }
  ];
  private dialogStatus = '';
  private downloadLoading = false;

  created() {
    this.getList()
    this.getType()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getBargainActivityList({
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
  private bargainData = {}// 效果数据
  private async getBargainData(bargainId) {
    const { data } = await getBargainData({
      data: { bargainId: bargainId }
    })
    this.bargainData = data.data
  }

  // 切换商品状态
  private openDialog(status: string, index: any, row: any) {
    this.getBargainData(row.bargainId)
    this.dialogFormVisible = true
  }

  private handleFilter() {
    this.currentPage = 1
    this.getList()
  }

  // 跳转到详情页
  private goDetail(status: string, id: string) {
    this.$router.push({
      name: 'AssistanceDetail',
      query: {
        status: status,
        id: id
      }
    })
  }

  private async delAssemble(id: string) {
    const { data } = await deleteBargainActivity({
      data: {
        bargainId: id,
        employeeId: this.$store.state.user.info.employeeId,
        state: '-1'
      }
    })
    this.$message({
      message: data.resultInfo,
      type: data.resultCode == 1 ? 'success' : 'warning'
    })
    this.getList()
  }

  // 删除砍价
  private deleteSubmit(group: any) {
    if (group.stateValue == '进行中') {
      this.$message.error('活动进行中无法删除!')
      return
    }
    this.$confirm(`确认删除活动?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.delAssemble(group.bargainId)
      })
      .catch(error => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
  }
}
</script>
<style lang="scss" scoped>
.filter-container .el-form-item {
  margin-bottom: 0;
}

.el-dialog {
  .el-col-8 {
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

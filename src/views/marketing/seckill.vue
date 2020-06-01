<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        :inline="true"
        :model="listQuery"
        class="demo-form-inline"
      >
        <el-form-item label="秒杀状态:">
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
              :key="item.typeId"
              :label="item.typeName"
              :value="item.typeId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-input
            v-model="listQuery.goods_name"
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
            {{ $t('table.add') }}秒杀
          </el-button>
          <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
          >{{ $t('table.export') }}</el-button>-->
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
      <el-table-column
        label="商品货号"
        prop="goods_number"
        align="center"
        width="80"
      />
      <el-table-column
        label="商品图片"
        width="110px"
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
        label="商品名称"
        min-width="150px"
        align="center"
        prop="goods_name"
      />
      <el-table-column
        label="商品分组"
        width="140px"
        align="center"
        prop="type_name"
      />
      <el-table-column
        label="起止时间"
        width="165px"
        align="center"
        prop="time"
      />
      <el-table-column
        label="秒杀状态"
        width="105px"
        align="center"
        prop="state_value"
      />
      <el-table-column
        label="原价"
        width="105px"
        align="center"
        prop="original_price"
      />
      <el-table-column
        label="秒杀价格"
        align="center"
        width="95"
        prop="activity_price"
      />
      <el-table-column
        label="秒杀库存"
        align="center"
        width="95"
        prop="stock"
      />
      <el-table-column
        label="秒杀销量"
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
            @click="goDetail('edit', scope.row.id)"
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
            @click="deleteSubmit(scope.row.id)"
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
      title="秒杀"
      :visible.sync="dialogFormVisible"
    >
      <el-row>
        <el-col :span="8">
          <p class="card-title">
            秒杀总成交额
          </p>
          <p class="card-nub">
            ￥999
          </p>
        </el-col>
        <el-col :span="8">
          <p class="card-title">
            秒杀成交数
          </p>
          <p class="card-nub">
            88
          </p>
        </el-col>
        <el-col :span="8">
          <p class="card-title">
            参与老客户
          </p>
          <p class="card-nub">
            88
          </p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <p class="card-title">
            秒杀总优惠额
          </p>
          <p class="card-nub">
            ￥999
          </p>
        </el-col>
        <el-col :span="8">
          <p class="card-title">
            销量/库存占比
          </p>
          <p class="card-nub">
            ￥88
          </p>
        </el-col>
        <el-col :span="8">
          <p class="card-title">
            参与新客户
          </p>
          <p class="card-nub">
            88
          </p>
        </el-col>
      </el-row>
      <!-- <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{ $t('table.cancel') }}</el-button>
        <el-button
          type="primary"
          @click="dialogStatus==='create'?createData():updateData()"
        >{{ $t('table.confirm') }}</el-button>
      </div>-->
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { listGoodsType } from '@/api/commodity'
import { getSeckillActivityList, saveSeckillActivity } from '@/api/marketing'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'Seckill',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private tableKey = 0;
  private list = [];
  private total: number = 0;
  private listLoading = true;
  private dialogFormVisible = false;
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
    const { data } = await getSeckillActivityList({
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

  // 切换商品状态
  private openDialog(status: string, index: any, row: any) {
    this.dialogFormVisible = true
  }

  private handleFilter() {
    this.currentPage = 1
    this.getList()
  }

  // 跳转到详情页
  private goDetail(status: string, id: string) {
    this.$router.push({
      name: 'SeckillDetail',
      query: {
        status: status,
        id: id
      }
    })
  }

  private async delAssemble(id: string) {
    const { data } = await saveSeckillActivity({
      data: {
        id: id,
        state: '-1'
      }
    })
    this.$message({
      message: data.resultInfo,
      type: data.resultCode == 1 ? 'success' : 'warning'
    })
    this.getList()
  }

  // 删除商品
  private deleteSubmit(id: string) {
    this.$confirm(`确认删除商品?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.delAssemble(id)
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

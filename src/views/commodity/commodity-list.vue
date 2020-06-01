<template>
  <div class="app-container">
    <el-tabs
      v-model="stockStatus"
      @tab-click="changeStockStatus"
    >
      <el-tab-pane
        label="上架中"
        name="10"
      />
      <el-tab-pane
        label="仓库中"
        name="20"
      />
      <el-tab-pane
        label="已售罄"
        name="15"
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
            v-model="listQuery.goodsTypeId"
            :placeholder="$t('table.type')"
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
            placeholder="商品名称/货号"
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
            {{ $t('table.add') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="other-operate-btn">
      <el-button
        v-if="stockStatus != '15'"
        :type="stockStatus == '10'? 'warning' : 'success'"
        icon="el-icon-sold-out"
        @click="editBatch('edit')"
      >
        {{ stockStatus == '20'? ($t('table.batch') +$t('table.upShelf') ) :
          stockStatus == '10'? ($t('table.batch') +$t('table.lowerShelf') ) : '' }}
      </el-button>
      <el-button
        v-if="stockStatus != '10'"
        type="danger"
        icon="el-icon-delete"
        @click="editBatch('det')"
      >
        {{ $t('table.batch') +$t('table.delete') }}
      </el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sort"
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        type="selection"
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
        label="最低价"
        sortable="custom"
        width="110px"
        prop="minPrice"
        align="center"
      />
      <el-table-column
        label="最高价"
        sortable="custom"
        width="110px"
        prop="maxPrice"
        align="center"
      />
      <el-table-column
        :label="$t('table.stock')"
        sortable="custom"
        width="105px"
        prop="stock"
        align="center"
      />
      <el-table-column
        :label="$t('table.salesVolume')"
        sortable="custom"
        prop="sale"
        align="center"
        width="95"
      />
      <el-table-column
        :label="$t('table.addTime')"
        sortable="custom"
        width="180px"
        prop="insTime"
        align="center"
      />
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="230"
        class-name="fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="stockStatus != '15'"
            size="mini"
            :type="stockStatus == '20'? 'success' : 'warning'"
            :disabled="scope.row.disabled"
            @click="editStock(scope.row.goodsId,'edit')"
          >
            {{ stockStatus == '20'? $t('table.upShelf') :
              stockStatus == '10'? $t('table.lowerShelf') : '' }}
          </el-button>
          <el-button
            size="mini"
            type="primary"
            @click="goDetail('edit', scope.row.goodsId)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            v-if="stockStatus != '10'"
            size="mini"
            type="danger"
            :disabled="scope.row.disabled"
            @click="editStock(scope.row.goodsId,'det')"
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
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'CommodityList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private tableKey = 0;
  private list = [];
  private total: number = 0;
  private listLoading = true;
  private pageSize: number = 20;
  private currentPage: number = 1;
  private stockStatus: any = '10';
  private listQuery = listQuery;
  // status:列表查询状态   msg:弹框消息提示; stockEmptyFlag:查询售罄商品字段; setStatus:提交上架下架状态
  private switchList = [
    { status: 10, msg: '下架', setStatus: 20, stockEmptyFlag: 0 },
    { status: 20, msg: '上架', setStatus: 10, stockEmptyFlag: 0 },
    { status: 0, msg: '删除', setStatus: null, stockEmptyFlag: 1 }
  ];
  private importanceOptions = [];
  private multipleSelectArr = [];
  private downloadLoading = false;

  mounted() {
    // this.listQuery.shopId = this.$store.state.user.info.shopId;
    this.listQuery.stockEmptyFlag = '2' // 默认查询库存》=0；
    this.listQuery.sortType = '10' // 升降排序，可传，升序：null，降序：'1'
    if (sessionStorage.getItem('goodsOldPage')) {
      let goodsOldPage = JSON.parse(sessionStorage.getItem('goodsOldPage'))
      this.listQuery = goodsOldPage.listQuery
      this.pageSize = goodsOldPage.pageSize
      this.currentPage = goodsOldPage.currentPage
      this.stockStatus = goodsOldPage.stockStatus
      this.changeStockStatus({ name: goodsOldPage.listQuery.status })
    }else{
      if (this.$route.query.status) {
        this.stockStatus = this.$route.query.status
        // this.changeStockStatus({ name: '2' })
      }
      this.changeStockStatus({ e: this.listQuery.status })
      // this.getList()
    }
      this.getType()
    
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getGoodsList({
      data: this.listQuery,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    })
    this.list = data.data.list
    this.total = data.data.total
    if(this.currentPage > 1 && this.list.length == 0){
      this.currentPage = 1
      this.getList()
    }
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 获取商品分类
  private async getType() {
    this.listLoading = true
    const { data } = await listGoodsType({
      data: { pageFlag: '2' },
      pageSize:10000,
      page : 1 ,
    })
    this.importanceOptions = data.data.list
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }
  // 切换商品状态
  private changeStockStatus(e: any) {
    switch (e.name) {
      case '15':
        this.listQuery.status = '15'
        this.listQuery.stockEmptyFlag = '2'
        break
      case '20':
        this.listQuery.status = '20'
        this.listQuery.stockEmptyFlag = '1'
        break
      default:
        this.listQuery.status = '10'
        this.listQuery.stockEmptyFlag = '2'
        break
    }
    this.currentPage = 1
    this.getList()
  }

  // 切换商品状态
  private sort(column: any, prop: any, order: any) {
    let propList: any = {
      price: 3,
      stock: 4,
      saleNum: 1,
      insTime: null
    }
    this.listQuery.orderFlag = propList[column.prop]
    switch (column.prop) {
      case 'minPrice':
        this.listQuery.sortItem = 404710
        break
      case 'maxPrice':
        this.listQuery.sortItem = 404710
        break
      case 'sale':
        this.listQuery.sortItem = 404720
        break
      case 'insTime':
        this.listQuery.sortItem = 404730
        break
      default:
        this.listQuery.sortItem = null
    }
    if (column.order == 'ascending') {
      this.listQuery.sortType = 30
    } else if (column.order == 'descending') {
      this.listQuery.sortType = 40
    } else {
      this.listQuery.sortType = null
    }
    // column.order == 'ascending'
    //   ? (this.listQuery.sortType = 30)
    //   : (this.listQuery.sortType = null)
    this.getList()
  }

  private handleSelectionChange(val: any) {
    this.multipleSelectArr = val
  }

  private handleFilter() {
    this.currentPage = 1
    this.getList()
  }

  // 事件-链接商品列表查看
  private goDetail(status: any, id: string) {
    console.log(this.listQuery)
    sessionStorage.setItem('goodsOldPage', JSON.stringify({ currentPage: this.currentPage, pageSize: this.pageSize, listQuery: this.listQuery, stockStatus: this.stockStatus }))
    this.$router.push({
      name: 'CommodityListDetail',
      query: {
        status: status,
        goodsId: id
      }
    })
  }

  // 编辑列表状态
  private editStock(id: any, status: string) {
    let arrIndex = this.switchList.findIndex(item => {
      return item.status == this.stockStatus
    })
    let msg =
      status == 'det'
        ? '删除'
        : this.switchList[arrIndex].msg
    this.$confirm(`确认${msg}商品?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.editStockSubmit(id, status)
      })
      .catch(error => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
  }

  // 编辑提交
  private editStockSubmit(id: any, status: string) {
    if (status == '2' || status == 'det') {
      this.deleteGood(id)
    } else {
      this.shelfGood(id)
    }
  }

  // 事件-批量编辑状态
  private editBatch(status: string) {
    if (this.multipleSelectArr.length != 0) {
      let item = this.multipleSelectArr
      let strArr: Array<string> = []
      item.forEach((v: any, i) => {
        strArr.push(v.goodsId)
      })
      this.editStock(strArr.join(','), status)
    } else {
      this.$message({
        message: '没有勾选数据哦',
        type: 'warning'
      })
    }
  }

  // 删除商品
  private async deleteGood(goodsIdArr: any) {
    const propsData = {
      data: typeof goodsIdArr === 'string' ? goodsIdArr.split(',') : goodsIdArr // 商品编号，必传

    }
    await deleteGood(propsData).then(res => {
      setTimeout(() => {
        this.getList()
      }, 500)
    }) // 刷新数据
    this.$message({
      message: '删除成功',
      type: 'success'
    })
  }

  // 上下架提交
  private async shelfGood(goodsIdArr: any) {
    let arrIndex = this.switchList.findIndex(item => {
      return item.status == this.stockStatus
    })
    const propsData = {
      data: {
        goodsIdList: typeof goodsIdArr === 'string' ? goodsIdArr.split(',') : goodsIdArr, // 商品编号，必传
        status: this.switchList[arrIndex].setStatus // 10：上架（在销售），20：下架（在仓库
      }
    }
    await shelfGood(propsData).then(res => {
      setTimeout(() => {
        this.getList()
      }, 500)
    })
  }
}
</script>
<style lang="scss" scoped>
.other-operate-btn {
  flex: 1;
  display: flex;
  padding-right: 50px;
  margin-bottom: 20px;
}

/* newStyles start */
.up-btn {
  color: #89cb67;
}

.down-btn {
  color: #e2a047;
}

.delete-btn {
  color: #ef6b6d;
}

.search-label {
  margin-right: 10px;
  color: #1f2d3d;
  font-weight: 600;
  vertical-align: text-top;
}
.filter-container .el-form-item {
  margin-bottom: 0;
}
</style>

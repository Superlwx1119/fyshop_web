<template>
  <div>
    <div>123456</div>
    <el-dialog
      title="选择商品"
      :visible.sync="dialogFormVisible"
    >
      <div class="filter-container">
        <el-form
          :inline="true"
          :model="listQuery"
          class="demo-form-inline"
        >
          <el-form-item label="商品分类:">
            <el-select
              v-model="listQuery.goodType"
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
          <el-form-item label>
            <el-input
              v-model="listQuery.goodName"
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
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="goodsList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          :label="$t('table.productCde')"
          prop="goodNum"
          align="center"
        />

        <el-table-column
          :label="$t('table.productImage')"
          align="center"
          width="100"
        >
          <template slot-scope="{row}">
            <el-image
              style="width: 40px"
              :src="row.mainImageList[0].imagePath"
              :preview-src-list="[row.mainImageList[0].imagePath]"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.productName')"
          prop="goodName"
          align="center"
        />
        <el-table-column
          :label="$t('table.productGrouping')"
          prop="goodTypeName"
          align="center"
        />
        <el-table-column
          :label="$t('table.price')"
          prop="price"
          align="center"
          width="100"
        />
        <el-table-column
          :label="$t('table.actions')"
          align="center"
          class-name="fixed-width"
          width="100"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="primary"
              @click="saveGoods(scope.row.goodId)"
            >
              {{ $t('table.edit') }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="currentPage"
        :page-sizes="[5]"
        :current-page.sync="pageSize"
        @pagination="getGoodsList"
      />
    </el-dialog>
    <el-dialog
      title="设置最低价格和库存"
      :visible.sync="dialogSetVisible"
    >
      <el-form
        v-if="isOneType"
        :inline="true"
        :model="postDetailList"
        :rules="rules"
        class="demo-form-inline"
      >
        <el-row>
          <el-form-item
            label="最低价格:"
            prop="goodsWeight"
          >
            <el-input
              v-model="postDetailList.price"
              style="width:200px;margin-right:20px"
              placeholder="最低价格不能高于现价"
              class="filter-item"
            />
            <span class="form-tips">现价：{{ goodsdetailList.price }}</span>
            <span class="form-tips">进价：{{ goodsdetailList.purchasePrice }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="砍价库存:"
            prop="goodsWeight"
          >
            <el-input
              v-model="postDetailList.stock"
              style="width:200px;margin-right:20px"
              placeholder="砍价库存不能高于现库存"
              class="filter-item"
            />
            <span class="form-tips">库存：{{ goodsdetailList.stock }}</span>
          </el-form-item>
        </el-row>
      </el-form>

      <el-table
        v-if="!isOneType"
        :key="tableKey"
        v-loading="listLoading"
        :data="goodsdetailList.detailList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          v-for="(item, index) in goodsdetailList.specificationList"
          :key="index"
          :label="item.specName"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.tableValues[index] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="价格"
          align="center"
          width="200px"
          class-name="fixed-width"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.nowPrice"
              :min="0"
              style="width:140px"
              class="filter-item"
            />
            <p>原价：{{ scope.row.price }}，进价：{{ scope.row.purchasePrice }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="库存"
          align="center"
          width="200px"
          class-name="fixed-width"
        >
          <template slot-scope="scope">
            <el-input-number
              v-model="scope.row.nowStock"
              :min="0"
              style="width:140px"
              class="filter-item"
            />
            <p>库存：{{ scope.row.stock }}</p>
          </template>
        </el-table-column>
      </el-table>
      <div
        v-if="!isOneType"
        class="batch-setup"
      >
        批量设置：价格
        <el-input
          v-model="postDetailList.price"
          style="width:100px"
          class="filter-item"
        />库存
        <el-input
          v-model="postDetailList.stock"
          style="width:100px"
          class="filter-item"
        />
        <el-button
          size="mini"
          type="primary"
          @click="batchSettingPriceAndstock()"
        >
          设 置
        </el-button>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogSetVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="setPrice()"
        >
          保 存
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import {
  getGoodsList,
  listGoodsType,
  listQuery,
  getGoodsDetail
} from '@/api/commodity'
import ResizeMixin from '@/components/Charts/mixins/resize'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'AddDialog'
})
export default class extends mixins(ResizeMixin) {
  private postList: any = {
    goods_list: []
  };
  private listQuery = listQuery; // 商品搜索条件
  private queryInfo: any = {
    status: '',
    id: ''
  }; // 路由信息
  private pageSize: number = 5;
  private currentPage: number = 1;
  private tableKey: number = 0;
  private goodsList: any = []; // 商品列表
  private list: any = [];
  private listLoading = true;
  private dialogFormVisible = false;
  private dialogSetVisible = false;
  private importanceOptions: any[] = []; // 商品分类列表
  private goodsdetailList: any = {}; // 商品详情
  private postDetailList: any = {
    stock: '',
    price: ''
  };
  private isOneType = true; // 判断商品是不是单一规格
  private total: number = 0;

  private check2 = (rule: any, value: any, callback: any) => {
    var reg = /^(0|[1-9][0-9]*)$/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('不能为负数!'))
    }
  };

  private rules = {
    join_number: [
      {
        required: true,
        message: '请输入成团人数',
        trigger: 'blur'
      },
      {
        validator: this.check2,
        trigger: 'blur',
        message: '不能为负数'
      }
    ],
    time: [
      {
        required: true,
        message: '请选择时间',
        trigger: 'change'
      }
    ]
  };
  created() {
    this.queryInfo = this.$route.query
  }

  // 获取商品列表
  private async getGoodsList() {
    this.listLoading = true
    this.listQuery.stockEmptyFlag = null
    const { data } = await getGoodsList({
      data: this.listQuery,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    })
    this.goodsList = data.data.list
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

  // 删除商品详情
  private delGoods() {
    this.postList.goods_id = ''
  }
  // 获取商品详情和编辑商品,edit用来区分是否已经添加过商品
  private async saveGoods(id: string, edit: string) {
    const { data } = await getGoodsDetail({
      data: {
        goodId: id
      }
    })
    this.goodsdetailList = data.data.good
    let detailListLength = data.data.good.detailList.length // 区分商品是否多规格
    edit && (this.goodsdetailList.detailList = this.postList.goods_list)
    if (detailListLength > 0) {
      this.isOneType = false
      this.goodsdetailList.detailList.forEach((e: any, i: any) => {
        this.goodsdetailList.detailList[i].tableValues = e.valueNames.split(
          ','
        )
        if (!edit) {
          // 设置新增商品的默认拼团价格
          this.goodsdetailList.detailList[i].nowPrice = 0
          this.goodsdetailList.detailList[i].nowStock = 0
        }
      })
    } else {
      this.isOneType = true
      this.postDetailList.price = this.postList.activity_price
      this.postDetailList.stock = this.postList.activity_stock
    }
    this.dialogSetVisible = true
  }
  // 批量设置价格和库存
  private batchSettingPriceAndstock() {
    let tableData = this.goodsdetailList.detailList
    for (const item of tableData) {
      item.nowPrice = this.postDetailList.price
      item.nowStock = this.postDetailList.stock
    }
    this.$nextTick(() => {
      this.goodsdetailList.detailList = tableData
      this.goodsdetailList.detailList.push()
    })
  }
  // 保存价格和库存
  private setPrice() {
    // this.postList = this.goodsdetailList;
    this.postList.goods_id = this.goodsdetailList.goodId
    this.postList.goods_name = this.goodsdetailList.goodName
    this.postList.goods_stock = this.goodsdetailList.stock
    this.postList.original_price = this.goodsdetailList.price
    this.postList.image_path = this.goodsdetailList.mainImageList[0].imagePath
    if (this.isOneType) {
      let groupGoods = [
        {
          id: this.postList.goods_list[0] ? this.postList.goods_list[0].id : '',
          nowPrice: this.postDetailList.price,
          nowStock: this.postDetailList.stock,
          price: this.goodsdetailList.price,
          stock: this.goodsdetailList.stock
        }
      ]
      if (this.postDetailList.price == '' || this.postDetailList.stock == '') {
        return this.$message({
          type: 'warning',
          message: '请填写完整信息'
        })
      }
      this.postList.activity_price = this.postDetailList.price
      this.postList.activity_stock = this.postDetailList.stock
      this.postList.goods_list = groupGoods
    } else {
      let totalPrice = this.goodsdetailList.detailList[0].nowPrice
      let totalStork: number = 0
      for (const item of this.goodsdetailList.detailList) {
        if (totalPrice > item.nowPrice) {
          totalPrice = item.nowPrice
        }
        totalStork += parseFloat(item.nowStock)
      }
      this.postList.activity_price = totalPrice
      this.postList.activity_stock = totalStork
      this.postList.goods_list = this.goodsdetailList.detailList
    }
    this.dialogSetVisible = false
    this.dialogFormVisible = false
  }

  private handleFilter() {
    this.currentPage = 1
    this.getGoodsList()
  }

  // 打开选择商品弹出框
  private openSearch(status: string) {
    this.getType()
    this.getGoodsList()
    this.dialogFormVisible = true
  }
}
</script>
<style lang="scss" scoped>
</style>

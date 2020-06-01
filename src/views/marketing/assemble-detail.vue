<template>
  <div class="app-container">
    <div class="public-box marketing">
      <div class="public-box-wrap">
        <el-form
          label-width="100px"
          label-position="left"
          :model="postList"
        >
          <div class="detailBasicInfo">
            <div class="same-header">
              <span class="same-header-left">活动商品</span>
              <el-button
                type="default"
                size="small"
                icon="el-icon-back"
                @click="backPage"
              >
                返回
              </el-button>
            </div>
            <div class="detailBasicInfo-wrap">
              <div class="detailBasicInfo-left">
                <el-button
                  v-if="!postList.goods_id"
                  type="primary"
                  @click="openSearch()"
                >
                  添加商品
                </el-button>
                <div v-if="postList.goods_id">
                  <el-form-item label="商品图片:">
                    <el-image
                      v-if="postList.image_path"
                      style="width: 100px"
                      :src="postList.image_path"
                      :preview-src-list="[postList.image_path]"
                    />
                  </el-form-item>
                  <el-form-item label="商品名称:">
                    {{ postList.goods_name }}
                  </el-form-item>
                  <el-form-item label="原价:">
                    {{ postList.original_price }}
                  </el-form-item>
                  <el-form-item label="拼团价:">
                    {{ postList.activity_price }}
                  </el-form-item>
                  <el-form-item label="库存:">
                    {{ postList.goods_stock }}
                  </el-form-item>
                  <el-form-item label>
                    <el-button
                      v-if="postList.stateValue != '未开始' || queryInfo.status == 'add'"
                      type="primary"
                      size="mini"
                      @click="saveGoods(postList.goods_id,'edit')"
                    >
                      编辑
                    </el-button>
                    <el-button
                      v-if="postList.stateValue == '已结束'"
                      type="danger"
                      size="mini"
                      @click="delGoods()"
                    >
                      删除
                    </el-button>
                  </el-form-item>
                </div>
              </div>
            </div>
          </div>
          <div class="goodsAttr mt30">
            <div class="same-header">
              <span class="same-header-left">规则限制</span>
            </div>
            <div class="detailStockInfo-wrap">
              <el-form
                id="myForm"
                ref="postList"
                :model="postList"
                label-width="100px"
                label-position="left"
                :rules="rules"
              >
                <el-form-item
                  label="成团人数:"
                  prop="join_number"
                >
                  <el-input
                    v-model="postList.join_number"
                    class="small-input"
                  />人
                </el-form-item>
                <el-form-item
                  label="活动时间:"
                  prop="time"
                >
                  <el-date-picker
                    v-model="postList.time"
                    type="datetimerange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    :default-time="['00:00:00', '23:59:59']"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    :picker-options="pickerOptions"
                  />
                  <!-- <el-date-picker
                    v-model="postList.time"
                    type="datetimerange"
                    format="yyyy-MM-dd HH:mm:ss"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                  /> -->
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="other-operate-btn mt30">
            <el-button
              v-if="$route.query.status == 'add'"
              type="primary"
              @click="submitForm('postList')"
            >
              保 存
            </el-button>
            <el-button @click="backPage()">
              返 回
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
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
        <!-- <el-table-column
          :label="$t('table.productCde')"
          prop="goodsNumber"
          align="center"
        /> -->

        <el-table-column
          :label="$t('table.productImage')"
          align="center"
          width="100"
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
          align="center"
        />
        <el-table-column
          :label="$t('table.productGrouping')"
          prop="goodsTypeName"
          align="center"
        />
        <el-table-column
          label="最低价"
          prop="minPrice"
          align="center"
          width="100"
        />
        <el-table-column
          label="最高价"
          prop="maxPrice"
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
              v-if="scope.row.activityType=='0'"
              size="mini"
              type="primary"
              @click="saveGoods(scope.row.goodsId)"
            >
              添加
            </el-button>
            <span
              v-else
              style="color:red;"
            >参加活动中</span>
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
      title="设置拼团价格和库存"
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
            label="拼团价格:"
            prop="goodsWeight"
          >
            <el-input
              v-model="postDetailList.price"
              style="width:200px;margin-right:20px"
              placeholder="拼团价格不能高于现价"
              class="filter-item"
            />
            <span class="form-tips">现价：{{ goodsdetailList.price }}</span>，
            <span class="form-tips">进价：{{ goodsdetailList.purchasePrice }}</span>
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item
            label="库存:"
            prop="goodsWeight"
          >
            {{ goodsdetailList.stock }}
          </el-form-item>
        </el-row>
      </el-form>

      <el-table
        v-if="!isOneType"
        :key="tableKey"
        v-loading="listLoading"
        :data="goodsdetailList.skuList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          v-for="(item, index) in goodsdetailList.specsKeyList"
          :key="index"
          :label="item.specsKey"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.skuName.split(',')[index] }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="价格"
          align="center"
          width="200px"
          class-name="fixed-width"
        >
          <template slot-scope="{row}">
            <el-input-number
              v-model="row.activityPrice"
              :min="0"
              :step="1"
              style="width:140px"
              :precision="2"
              class="filter-item"
              @blur="blurCheck(row.activityPrice)"
            />
            <p>价格：{{ row.price }}</p>
          </template>
        </el-table-column>
        <el-table-column
          label="库存"
          align="center"
          width="200px"
          class-name="fixed-width"
        >
          <template slot-scope="scope">
            {{ scope.row.stock }}
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
import { Component, Vue } from 'vue-property-decorator'
import {
  getGoodsList,
  listGoodsType,
  listQuery,
  getGoodsDetail
} from '@/api/commodity'
import { saveGroupActivity, getGroupActivity } from '@/api/marketing'
import { formatJson } from '@/utils'
import { Form, Form as ElForm } from 'element-ui'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'AssembleDetail',
  components: { Pagination }
})
export default class extends Vue {
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
  private listLoading: boolean = true;
  private dialogFormVisible: boolean = false;
  private dialogSetVisible: boolean = false;
  private importanceOptions: any[] = []; // 商品分类列表
  private goodsdetailList: any = {}; // 商品详情
  private postDetailList: any = {
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

  private pickerOptions = {
    // 限制时间不让选择今天以前的
    disabledDate(time: any) {
      return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
    }
  };

  private blurCheck(price) {
    let reg = /^(\d+)(.\d{0,2})?$/
    let pass = true
    if (price == '' || !price) {
      this.$message.error('价格不能为空!')
      pass = false
      return pass
    }
    if (!reg.test(price)) {
      this.$message.error('价格最多保留2位小数!')
      pass = false
    }
    return pass
  }

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
    this.queryInfo.status === 'edit' && this.getGroupActivity()
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

  private async postDetail(postData: any) {
    const { data } = await saveGroupActivity({
      data: postData
    })
    this.$message({
      message: data.resultInfo,
      type: data.resultCode == 1 ? 'success' : 'warning'
    })
    setTimeout(() => {
      this.$router.go(-1)
    }, 0.5 * 1000)
  }

  // 删除商品详情
  private delGoods() {
    if (this.postList.stateValue == '进行中') {
      this.$message.error('活动进行中无法删除!')
      return
    }
    this.postList.goods_id = ''
    this.postList = {}
  }

  // 获取商品详情和编辑商品,edit用来区分是否已经添加过商品
  private async saveGoods(id: string, edit: string) {
    if (edit && this.postList.stateValue == '进行中') {
      this.$message.error('活动进行中无法编辑!')
      return
    }
    const { data } = await getGoodsDetail({
      data: {
        goodsId: id
      }
    })
    this.goodsdetailList = data.data
    let detailListLength = data.data.skuList.length // 区分商品是否多规格
    // edit && (this.goodsdetailList.skuList = this.postList.goods_list)
    if (detailListLength > 0 && data.data.skuList) {
      this.isOneType = false
      this.goodsdetailList.skuList.forEach((e: any, i: any) => {
        this.goodsdetailList.skuList[i].tableValues = e.specsValueList ? e.specsValueList.split(',') : ''
        if (edit) {
          this.editGoods.forEach(item => {
            if (item.skuId == e.skuId) {
              e.activityPrice = item.activityPrice
            }
          })
        }
        if (!edit) {
          // 设置新增商品的默认拼团价格
          this.goodsdetailList.skuList[i].activityPrice = 0
          this.goodsdetailList.skuList[i].groupPrice = 0
        } else {
          this.goodsdetailList.skuList[i].activityPrice = this.goodsdetailList.skuList[i].activityPrice
          this.goodsdetailList.skuList[i].groupPrice = this.goodsdetailList.skuList[i].activityPrice
        }
      })
    } else {
      this.isOneType = true
      this.postDetailList.price = this.postList.activity_price
    }
    this.dialogSetVisible = true
  }

  // 批量设置价格和库存
  private batchSettingPriceAndstock() {
    if (!this.blurCheck(this.postDetailList.price)) {
      return
    }
    let tableData = this.goodsdetailList.skuList
    for (const item of tableData) {
      item.groupPrice = this.postDetailList.price
      item.activityPrice = this.postDetailList.price
    }
    this.$nextTick(() => {
      this.goodsdetailList.skuList = tableData
      this.goodsdetailList.skuList.push()
    })
  }
  private editGoods = []
  private async getGroupActivity() {
    this.listLoading = true
    const { data } = await getGroupActivity({
      data: {
        groupId: this.queryInfo.id
      }
    })
    this.postList = data.data
    this.postList.join_number = data.data.lowestNumber
    this.postList.goods_id = data.data.goodsId
    this.postList.groupId = data.data.groupId
    this.goodsdetailList.goodsId = data.data.goodsId
    this.postList.goods_name = data.data.goodsName
    this.postList.image_path = data.data.imagePath.split(',')[0]
    this.postList.goods_stock = data.data.stock
    this.postList.activity_price = data.data.priceStr
    this.postList.original_price = data.data.priceOut
    this.postList.goods_list = data.data.tggList
    this.editGoods = data.data.tggList
    this.postList.time = []
    this.postList.time.push(data.data.startTime)
    this.postList.time.push(data.data.endTime)
    // this.postList.time[0] = data.data.start_time
    // this.postList.time[1] = data.data.end_time
    // Just to simulate the time of the request
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 保存价格和库存
  private setPrice() {
    this.postList.goods_id = this.goodsdetailList.goodsId
    this.postList.goods_name = this.goodsdetailList.goodsName
    // this.postList.goods_stock = this.goodsdetailList.stock
    this.postList.image_path = this.goodsdetailList.imagePathMain[0]
    this.postList.goods_stock = 0
    this.goodsdetailList.skuList.forEach(item => {
      this.postList.goods_stock += item.stock
    })
    let arr = []
    for (let i = 0; i < this.goodsdetailList.skuList.length; i++) {
      arr.push(this.goodsdetailList.skuList[i].price)
    }
    let min = arr[0]
    for (let i = 1; i < arr.length; i++) {
      var cur = arr[i]
      cur < min ? min = cur : null
    }
    let max = arr[arr.length - 1]
    for (let i = 1; i < arr.length; i++) {
      var cur = arr[i]
      cur > max ? max = cur : null
    }
    this.postList.original_price = min + '-' + max
    // console.log("拼团商品展示", this.postList);
    // console.log("商品总价格和库存", this.postDetailList);
    // console.log("商品具体规格数值", this.goodsdetailList.skuList);
    if (this.isOneType) {
      let groupGoods = [
        {
          skuId: this.postList.goods_list[0] ? this.postList.goods_list[0].id : '',
          groupPrice: this.postDetailList.price,
          price: this.goodsdetailList.price,
          stock: this.goodsdetailList.stock
        }
      ]
      if (this.postDetailList.price == '') {
        return this.$message({
          type: 'warning',
          message: '请填写完整信息'
        })
      }
      this.postList.activity_price = this.postDetailList.price
      this.postList.goods_list = groupGoods
    } else {
      let totalPrice = this.goodsdetailList.skuList[0].activityPrice
      for (const item of this.goodsdetailList.skuList) {
        if (totalPrice > item.activityPrice) {
          totalPrice = item.activityPrice
        }
      }
      this.postList.activity_price = totalPrice
      this.postList.goods_list = this.goodsdetailList.skuList
    }
    let pass = false
    let msg = ''
    this.postList.goods_list.forEach(item => {
      if (Number(item.activityPrice) == 0 || !item.activityPrice) {
        msg = '拼团价格不能为空!'
        pass = true
        return
      }
      if (Number(item.activityPrice) > item.price) {
        msg = '拼团价格高于原价!'
        pass = true
      }
    })
    if (pass) {
      if (this.queryInfo.status == 'add') {
        // this.postList = {}
      } else {
        this.postList.original_price = this.postList.priceOut
        this.postList.activity_price = this.postList.priceStr
      }
      this.$message.error(msg)
      return
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
  // 事件-返回上一页
  private backPage() {
    this.$router.go(-1)
  }

  // 事件-提交表单
  private submitForm(postList: any) {
    if (!this.postList.goods_id) {
      this.$message({
        type: 'warning',
        message: '请添加商品'
      })
      return
    }
    if (this.postList.goods_stock < this.postList.join_number || this.postList.goods_stock == 0) {
      this.$message.error('库存不足!')
      return
    }
    if (!this.postList.activity_price) {
      this.$message.error('拼团价为空!')

      return
    }
    (this.$refs[postList] as ElForm).validate((valid: boolean) => {
      if (valid) {
        let postData = {
          id: this.queryInfo.id,
          groupId: this.postList.groupId ? this.postList.groupId : '',
          goodsId: this.goodsdetailList.goodsId,
          lowestNumber: this.postList.join_number,
          shopId: this.$store.state.user.info.shopId,
          startTime: this.postList.time ? this.postList.time[0] : '',
          endTime: this.postList.time ? this.postList.time[1] : '',
          tggList: this.postList.goods_list,
          employeeId: this.$store.state.user.info.employeeId
        }
        this.postDetail(postData)
      } else {
        return false
      }
    })
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/detail.scss";
.batch-setup {
  margin-top: 20px;
  .el-input {
    margin-right: 10px;
  }
}
</style>

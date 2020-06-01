<template>
  <div class="app-container">
    <div class="public-box">
      <div class="public-box-wrap">
        <el-form
          id="myForm"
          ref="postList"
          label-width="100px"
          label-position="left"
          :model="postList"
          :rules="rules"
        >
          <div class="detailBasicInfo">
            <div class="same-header">
              <span class="same-header-left">基本信息</span>
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
                <el-form-item
                  label="优惠券名称"
                  prop="couponName"
                >
                  <el-input
                    v-model="postList.couponName"
                    placeholder="请输入优惠券名称，最多10个字"
                  />
                  <!-- <span class="remarks">如有商品货号，可输入商品货号，建议30位数字以内，最多支持40位数字</span> -->
                </el-form-item>
                <el-form-item
                  label="发放总数量"
                  prop="sum"
                >
                  <el-input
                    v-model="postList.sum"
                    placeholder="请输入发放数量"
                  />
                </el-form-item>
                <el-form-item
                  label="卡券类型"
                  prop="type"
                >
                  <el-radio-group v-model="postList.couponType">
                    <p class="radio-box">
                      <el-radio :label="20">
                        金额券，优惠
                        <el-input v-model="typeList[2]" />元
                      </el-radio>
                    </p>
                    <!-- <p class="radio-box">
                      <el-radio :label="20">
                        减满券，购满
                        <el-input v-model="typeList[4]" />减
                        <el-input v-model="typeList[2]" />
                      </el-radio>
                    </p> -->
                    <p class="radio-box">
                      <el-radio :label="30">
                        折扣券，享受
                        <el-input
                          v-model="typeList[3]"
                          placeholder="如：9.9"
                        />折
                      </el-radio>
                    </p>
                  </el-radio-group>
                </el-form-item>
                <el-form-item
                  label="使用门槛"
                  prop="conditions"
                >
                  <p class="radio-box">
                    满 <el-input v-model="postList.conditions" />元可使用
                  </p>
                </el-form-item>
                <el-form-item
                  label="投放状态"
                  prop="supportReceive"
                >
                  <el-radio-group v-model="postList.supportReceive">
                    <el-radio label="0">
                      直接投放
                    </el-radio>
                    <el-radio label="1">
                      暂不投放
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="goodsAttr mt30">
            <div class="same-header">
              <span class="same-header-left">规则限制</span>
            </div>
            <div class="detailStockInfo-wrap">
              <!-- <el-form-item label="适用商品" prop="goods_type">
                <el-radio-group v-model="postList.goods_type">
                  <el-radio :label="0">
                    <span>所有商品</span>
                  </el-radio>
                  <el-radio :label="1">
                    <span>指定商品可用</span>
                    <el-button
                      v-if="postList.goods_type==1"
                      size="mini"
                      type="primary"
                      @click="openSearch('postList')"
                    >选择商品</el-button>
                  </el-radio>
                  <el-radio :label="2">
                    <span>指定商品不可用</span>
                    <el-button
                      v-if="postList.goods_type==2"
                      size="mini"
                      type="primary"
                      @click="openSearch('postList')"
                    >选择商品</el-button>
                  </el-radio>
                </el-radio-group>
              </el-form-item> -->
              <el-form-item
                label="限领次数"
                prop="limitGet"
              >
                <el-input
                  v-model="postList.limitGet"
                  placeholder="请输入次数"
                />
              </el-form-item>
              <el-form-item
                label="有效时间"
                prop="time"
              >
                <el-date-picker
                  v-model="postList.time"
                  type="daterange"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  　:picker-options="pickerOptions"
                />
              </el-form-item>
            </div>
          </div>
          <!-- <div class="goodsAttr mt30">
            <div class="same-header">
              <span class="same-header-left">平台个性化必要信息</span>
              <span>因各平台优惠卡券功能需要上传的信息不一致，需针对不同平台填写各平台要求的个性化必要信息。</span>
            </div>

            <el-tabs v-model="stockStatus" @tab-click="changeStockStatus">
              <el-tab-pane label="微信" name="0" />
              <el-tab-pane label="支付宝" name="1" />
            </el-tabs>

            <div class="detailStockInfo-wrap">
              <el-form-item label="发放总数量" prop="sum">
                <el-input v-model="postList.sum" placeholder="请输入发放数量" />
              </el-form-item>
              <el-form-item label="卡券颜色" prop="color">
                <span
                  v-for="(item,index) in cardColorList"
                  :key="index"
                  :style="'background-color:'+item.value"
                  :class="{'card-color': true,'card-color-yes': item.id==postList.color}"
                  @click="saveColor(item.id)"
                />
              </el-form-item>
              <el-form-item label="使用须知" prop="description">
                <el-input v-model="postList.description" placeholder="请输入使用须知" />
              </el-form-item>
              <el-form-item label="可否转送" required>
                <el-switch
                  v-model="give_friend"
                  active-value="true"
                  inactive-value="false"
                  active-text="是"
                  inactive-text="否"
                />
              </el-form-item>
            </div>
          </div>-->
          <div class="other-operate-btn mt30">
            <el-button
              type="primary"
              @click="submitForm('postList')"
            >
              保 存
            </el-button>
            <el-button @click="backPage()">
              取 消
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
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          align="center"
          type="selection"
          width="55"
        />
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
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="editBatch()"
        >
          批量选择
        </el-button>
      </div>
      <pagination
        v-show="total>0"
        :total="total"
        :page.sync="currentPage"
        :current-page.sync="pageSize"
        small
        layout=" prev, pager, next"
        :page-sizes="[5]"
        @pagination="getGoodsList"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import {
  getGoodsList,
  listGoodsType,
  listQuery,
  getGoodsDetail
} from '@/api/commodity'
import { saveCoupon } from '@/api/marketing'
import { Form, Form as ElForm } from 'element-ui'
import { IArticleData } from '@/api/types'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'CardConfDetail',
  components: { Pagination }
})
export default class extends Vue {
  private postList: any = {
    conditions: null,
    supportReceive: '0',
    goods_list: '',
    color: '',
    goods_type: 0,
    couponType: 20
  };
  private listQuery = listQuery; // 商品搜索条件
  private queryInfo: any = {
    status: '',
    id: ''
  }; // 路由信息
  private pageSize: number = 20;
  private currentPage: number = 1;
  private tableKey = 0;
  private goodsList: any = []; // 商品列表
  private list: any = [];
  private typeList: any = {
    1: '',
    2: '',
    3: '',
    4: ''
  };
  private give_friend = 'true'; // 是否可以转赠
  private stockStatus = '0';
  private cardColorList: any = [];
  private multipleSelectArr = [];
  private listLoading: boolean = true;
  private dialogFormVisible: boolean = false;
  private dialogSetVisible: boolean = false;
  private importanceOptions: any[] = []; // 商品分类列表
  private total: number = 0;

  private pickerOptions = {
    // 限制时间不让选择今天以前的
    disabledDate(time: any) {
      return time.getTime() < Date.now() - 24 * 60 * 60 * 1000
    }
  };
  private check2 = (rule: any, value: any, callback: any) => {
    var reg = /^(0|[1-9][0-9]*)$/
    if (reg.test(value)) {
      callback()
    } else {
      callback(new Error('输入值不正确!'))
    }
  };

  private blurCheck(rule: any, value: any, callback: any) {
    let reg = /^(\d+)(.\d{0,2})?$/
    if (reg.test(value) && value <= 999999999) {
      callback()
    } else {
      callback(new Error('输入值不正确或大于999999999!'))
    }
  }

  private rules = {
    supportReceive: [
      {
        required: true,
        message: '请选择投放状态',
        trigger: 'change'
      }
    ],
    conditions: [
      {
        required: true,
        message: '请输入使用门槛',
        trigger: 'blur'
      },
      {
        validator: this.blurCheck,
        trigger: 'blur'
      }
    ],
    couponName: [
      {
        required: true,
        message: '请输入优惠券名',
        trigger: 'blur'
      },
      {
        max: 10,
        message: '优惠券名称最多10个字符'
      }
    ],
    sum: [
      {
        required: true,
        message: '请输入优惠券数量',
        trigger: 'blur'
      },
      {
        validator: this.check2,
        trigger: 'blur',
        message: '请输入数字'
      },
      {
        max: 9,
        message: '不能超过999999999张'
      }
    ],
    description: [
      {
        required: true,
        message: '请输入使用须知',
        trigger: 'blur'
      }
    ],
    color: [
      {
        required: true,
        message: '请选择颜色',
        trigger: 'blur'
      }
    ],
    couponType: [
      {
        required: true,
        message: '请选择优惠券类型',
        trigger: 'change'
      }
    ],
    goods_type: [
      {
        required: true,
        message: '请选择适用商品',
        trigger: 'change'
      }
    ],
    limitGet: [
      {
        required: true,
        message: '请输入每个人限领次数',
        trigger: 'blur'
      },
      {
        validator: this.check2,
        trigger: 'blur'
      },
      {
        max: 2,
        message: '每人最多领取99次'
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
    const { data } = await saveCoupon({
      data: postData
    })
    this.$message({
      message: data.resultInfo,
      type: data.resultCode == 1 ? 'success' : 'warning'
    })
    setTimeout(() => {
      this.$router.go(-1)
    }, 1 * 1000)
  }

  // 保存选择颜色
  private saveColor(color: string) {
    this.postList.color = color
  }
  private handleSelectionChange(val: any) {
    this.multipleSelectArr = val
  }
  // 选择商品
  private async saveGoods(id: string) {
    this.postList.goods_list = id
    this.dialogFormVisible = false
  }

  // 切换平台状态
  private changeStockStatus(e: any) {}

  private handleFilter() {
    this.currentPage = 1
    this.getGoodsList()
  }
  // 事件-批量编辑状态
  private editBatch(status: string) {
    if (this.multipleSelectArr.length != 0) {
      let item = this.multipleSelectArr
      let strArr: Array<string> = []
      item.forEach((v: any, i) => {
        strArr.push(v.goodId)
      })
      this.saveGoods(strArr.join(','))
    } else {
      this.$message({
        message: '没有勾选数据哦',
        type: 'warning'
      })
    }
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

  // 事件-返回上一页
  private messageReturn(msg: string) {
    this.$message({
      type: 'warning',
      message: msg
    })
  }

  // 事件-提交表单
  private submitForm(postList: any) {
    (this.$refs[postList] as ElForm).validate((valid: boolean) => {
      if (valid) {
        if (this.postList.goods_type != 0 && !this.postList.goods_list) {
          return this.messageReturn('请添加适用商品')
        }
        if (this.postList.couponType == 20 && !this.typeList[2]) {
          return this.messageReturn('请添加优惠金额')
        }
        if (this.postList.couponType == 20 && (Number(this.typeList[2]) < 0.1 || Number(this.typeList[2]) > 9999)) {
          return this.messageReturn('优惠面值至少为0.1元,且勿超过9999元')
        }
        if (this.postList.couponType == 30 && !this.typeList[3]) {
          return this.messageReturn('请添加折扣')
        }
        let reg = /^(\d+|\d+\.\d{1,2})$/
        if (this.postList.couponType == 30 && (Number(this.typeList[3]) > 0 || Number(this.typeList[3]) < 10) && !reg.test(this.typeList[3])) {
          return this.messageReturn('折扣值请输入0-10之间的数字,最多两位小数')
        }
        if (!this.postList.conditions) {
          return this.messageReturn('请添加使用门槛')
        }
        // if (this.postList.couponType == 20 && !this.typeList[4]) {
        //   return this.messageReturn("请添写减免金额");
        // }
        // if (this.postList.couponType == 20 && !this.typeList[2]) {
        //   return this.messageReturn("请添写购满金额");
        // }
        if (this.postList.couponType == 30) {
          let nub = parseFloat(this.typeList[this.postList.couponType / 10])
          if (nub >= 10 || nub < 0.1) {
            return this.messageReturn('请输入正确的折扣')
          }
        }
        let coupon_wx_card = {
          color: this.postList.color,
          description: this.postList.description,
          sum: this.postList.sum,
          give_friend: this.give_friend
        }
        let postData = this.postList
        postData.coupon_wx_card = coupon_wx_card
        postData.startTime = this.postList.time[0]
        postData.endTime = this.postList.time[1]
        postData.discounts = this.typeList[this.postList.couponType / 10]
        postData.conditions = this.postList.conditions
        postData.shopId = this.$store.state.user.info.shopid
        if (this.postList.couponType == 30) {
          postData.discounts = parseFloat(this.typeList[this.postList.couponType / 10])
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
.radio-box {
  margin: 0;
  .el-input {
    width: 80px !important;
    margin: 6px;
  }
}
.detailStockInfo-wrap {
  .el-radio-group {
    .el-radio {
      display: block;
      margin: 16px 0;
      button {
        margin-left: 20px;
      }
    }
  }
}
.card-color {
  display: inline-block;
  position: relative;
  width: 60px;
  height: 60px;
  margin-right: 12px;
  cursor: pointer;
}

.card-color-yes {
  &:after {
    content: "";
    width: 36%;
    height: 16%;
    margin: -3px 0 0 0;
    position: absolute;
    left: 20px;
    top: 24px;
    border: 3px solid #000;
    border-radius: 1px;
    border-top: none;
    border-right: none;
    background: transparent;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
  }
}
</style>

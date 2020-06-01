<template>
  <div class="app-container commodity-list">
    <div class="public-box">
      <div class="public-box-wrap">
        <el-form
          id="myForm"
          ref="goodsAllInfo"
          label-width="100px"
          label-position="left"
          :model="goodsAllInfo"
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
                <!-- <el-form-item
                  label="商品货号："
                  class="rules-none"
                >
                  <el-input
                    v-model="goodsAllInfo.goodsNumber"
                    :disabled="wordBool"
                  />
                  <span class="remarks">如有商品货号，可输入商品货号，建议30位数字以内，最多支持40位数字</span>
                </el-form-item> -->
                <el-form-item
                  label="商品名称："
                  prop="goodsName"
                >
                  <el-input
                    v-model="goodsAllInfo.goodsName"
                    :disabled="wordBool"
                  />
                  <span class="remarks">请输入商品名称，建议30字以内，最多支持40字</span>
                </el-form-item>
                <el-form-item
                  required
                  label="商品分类："
                  prop="goodsTypeId"
                >
                  <el-select
                    v-model="goodsAllInfo.goodsTypeId"
                    placeholder="请选择商品分类"
                    @change="changeGoodsType"
                  >
                    <el-option
                      v-for="item in allType"
                      :key="item.goodsTypeId"
                      :label="item.goodsTypeName"
                      :value="item.goodsTypeId"
                    />
                  </el-select>
                </el-form-item>
                <el-form-item
                  label="是否上架："
                  prop="status"
                >
                  <el-radio-group
                    v-model="goodsAllInfo.status"
                    :disabled="wordBool"
                  >
                    <el-radio :label="10">
                      是，直接上架
                    </el-radio>
                    <el-radio :label="20">
                      否，暂时放入仓库
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <div class="show-mainPicture">
                  <span class="show-mainPicture-left">
                    展示主图：
                    <br>(最多5张)
                  </span>
                  <el-upload
                    class="show-mainPicture-right"
                    :action="$store.state.user.imgUploadApi"
                    list-type="picture-card"
                    multiple
                    :file-list="showMainPictureArr"
                    :disabled="wordBool"
                    :limit="5"
                    :before-upload="beforeAvatarUpload"
                    :on-success="mainPictrueUploadSuccess"
                    :on-error="mainPictrueUploadError"
                    :on-remove="mainPictrueRemove"
                    :on-exceed="mainHandleExceed"
                  >
                    <i class="el-icon-plus" />
                  </el-upload>
                </div>
                <span
                  v-if="mainPictureBool"
                  class="errorInfo-tip"
                >请至少选择一张主图</span>
                <div class="show-mainPicture mt40">
                  <span class="show-mainPicture-left">
                    详情图：
                    <br>(最多15张)
                  </span>
                  <el-upload
                    class="show-mainPicture-right"
                    :action="$store.state.user.imgUploadApi"
                    list-type="picture-card"
                    multiple
                    :file-list="showDetailsPictureArr"
                    :disabled="wordBool"
                    :limit="15"
                    :before-upload="beforeAvatarUpload"
                    :on-success="detailsPictureUploadSuccess"
                    :on-error="detailsPictureUploadError"
                    :on-remove="detailsPictureRemove"
                    :on-exceed="detailsHandleExceed"
                  >
                    <i class="el-icon-plus" />
                  </el-upload>
                </div>
                <span
                  v-if="detailsPictureBool"
                  class="errorInfo-tip"
                >请至少选择一张详情图</span>
              </div>
            </div>
          </div>
          <div class="detailStockInfo price-stock-wrap mt20">
            <div class="same-header">
              <span class="same-header-left">价格库存</span>
            </div>
            <div class="detailStockInfo-wrap table-wrap">
              <el-form>
                <el-form-item label="商品规格：">
                  <el-radio-group v-model="goodsAllInfo.varietyFlag">
                    <el-radio :label="1">
                      统一规格
                    </el-radio>
                    <el-radio :label="2">
                      多种规格
                    </el-radio>
                  </el-radio-group>
                </el-form-item>
                <div v-if="format.length < 3&&goodsAllInfo.varietyFlag==2">
                  <el-button
                    class="add-format-btn"
                    type="primary"
                    @click="addFormat()"
                  >
                    增加规格
                  </el-button>
                </div>
                <div
                  v-if="goodsAllInfo.varietyFlag==1"
                  class="global-setting-wrap"
                >
                  <!-- <el-form-item label="进价：">
                    <el-input-number
                      v-model="goodsAllInfo.purchasePrice"
                      :precision="2"
                      :min="0.01"
                      label="描述文字"
                    />
                  </el-form-item> -->
                  <el-form-item label="价格：">
                    <el-input-number
                      v-model="goodsAllInfo.price"
                      :precision="2"
                      :min="0.01"
                      label="描述文字"
                    />
                  </el-form-item>
                  <el-form-item label="库存：">
                    <el-input-number
                      v-model="goodsAllInfo.stock"
                      :min="0"
                      label="描述文字"
                    />
                  </el-form-item>
                </div>
              </el-form>
              <el-form
                v-if="goodsAllInfo.varietyFlag==2"
                label-width="68px"
                class="detailStockInfo-wrap panel-item"
              >
                <div class="dib vat">
                  <div class="format-wrap">
                    <div
                      v-for="(item, index) in format"
                      :key="index"
                      class="format-item"
                    >
                      <div class="format-name-box">
                        <el-form-item
                          label="规格名："
                          class="dib input-box"
                        >
                          <el-input
                            v-model="item.specsKey"
                            placeholder="请输入规格名"
                            class="input"
                            :disabled="item.beEdit"
                            @focus="specsKeyFocus(item.specsKey)"
                            @blur="specsKeyBlur(item)"
                          />
                        </el-form-item>
                        <div class="dib">
                          <el-button
                            class="add-format-btn"
                            type="danger"
                            @click="deleteFormat(index)"
                          >
                            删除规格
                          </el-button>
                        </div>
                      </div>
                      <div
                        v-if="!!item.specsKey || item.specsKey==''"
                        class="format-values"
                      >
                        <el-form-item
                          label="规格值："
                          class="dib vat format-value input-box"
                        >
                          <el-input
                            v-for="(value, valueIndex) in item.specsValueList"
                            :key="valueIndex"
                            v-model="value.specsValue"
                            placeholder="请输入规格值"
                            class="input"
                            :disabled="value.beEdit"
                            @focus="onFormatValueFocus(index, valueIndex ,value)"
                            @blur="onFormatValueBlur(index, valueIndex, value)"
                          >
                            <i
                              slot="suffix"
                              class="hv-cp el-input__icon format-deledt-icon el-icon-delete-solid"
                              @click="deleteFormatValue(index, valueIndex)"
                            />
                          </el-input>
                        </el-form-item>
                        <div class="dib vat">
                          <el-button
                            class="add-format-btn"
                            type="primary"
                            @click="addFormatValue(index)"
                          >
                            增加规格值
                          </el-button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </el-form>
              <div
                v-if="format.length&&goodsAllInfo.varietyFlag==2"
                class="setting-wrap"
              >
                <el-table
                  :data="tableData"
                  class="table"
                  style="width: 100%"
                >
                  <el-table-column
                    v-for="(item, index) in format"
                    :key="index"
                    :label="item.specsKey"
                  >
                    <template slot-scope="{row}">
                      <template>{{ row.specsValues[index] }}</template>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column
                    prop="purchasePrice"
                    label="进价"
                  >
                    <template slot-scope="{row}">
                      <template>
                        <el-input-number
                          @change="changeTableData"
                          v-model="row.purchasePrice"
                          :precision="2"
                          :min="0.01"
                        />
                      </template>
                    </template>
                  </el-table-column> -->
                  <el-table-column
                    prop="price"
                    label="价格"
                  >
                    <template slot-scope="{row}">
                      <template>
                        <el-input-number
                          v-model="row.price"
                          :precision="2"
                          :min="0.01"
                          @change="changeTableData"
                        />
                      </template>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="stock"
                    label="库存"
                  >
                    <template slot-scope="{row}">
                      <template>
                        <el-input-number
                          v-model="row.stock"
                          :min="0"
                          @blur="blurZero(row)"
                          @change="changeTableData"
                        />
                      </template>
                    </template>
                  </el-table-column>
                  <el-table-column
                    prop="imagePath"
                    width="160"
                    label="图片"
                  >
                    <template slot-scope="scope">
                      <template>
                        <el-upload
                          class="avatar-uploader"
                          :action="$store.state.user.imgUploadApi"
                          :show-file-list="false"
                          :on-success="handleAvatarSuccess"
                          :before-upload="beforeAvatarUpload"
                          @click="getRow(scope)"
                        >
                          <img
                            v-if="scope.row.imagePath"
                            :src="scope.row.imagePath"
                            class="avatar"
                            @click="getRow(scope)"
                          >
                          <i
                            v-else
                            class="el-icon-plus avatar-uploader-icon"
                            @click="getRow(scope)"
                          />
                        </el-upload>
                      </template>
                    </template>
                  </el-table-column>
                </el-table>
                <span class="dib">批量设置：</span>
                <el-form
                  class="dib"
                  label-width="60px"
                >
                  <!-- <el-form-item
                    label="进价："
                    class="dib input-box"
                  >
                    <el-input-number
                      v-model="purchasePrice"
                      :precision="2"
                      :min="0.01"
                      label="描述文字"
                    />
                  </el-form-item> -->
                  <el-form-item
                    label="价格："
                    class="dib input-box"
                  >
                    <el-input-number
                      v-model="globalPrice"
                      :precision="2"
                      :min="0.01"
                      label="描述文字"
                    />
                  </el-form-item>
                  <el-form-item
                    label="库存："
                    class="dib input-box"
                  >
                    <el-input-number
                      v-model="globalstock"
                      :min="0"
                      label="描述文字"
                    />
                  </el-form-item>
                  <div class="dib">
                    <el-button
                      class="add-input-btn"
                      type="primary"
                      @click="batchSettingPriceAndstock()"
                    >
                      确定
                    </el-button>
                  </div>
                </el-form>
              </div>
            </div>
          </div>
          <div
            v-if="!wordBool"
            class="other-operate-btn mt30"
          >
            <el-button
              type="primary"
              @click="submitForm('goodsAllInfo')"
            >
              保 存
            </el-button>
            <el-button @click="resetForm('goodsAllInfo')">
              取 消
            </el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import { Form, Form as ElForm } from 'element-ui'

import {
  getGoodsDetail,
  insertGoods,
  updateGoods,
  listGoodsType,
  goodsRules
} from '@/api/commodity'
import { formatJson } from '@/utils'
// 从公共js引入页面跳转无法重置
interface goodsAllInfo {
  goodsId: any;
  size: string;
  place: string;
  specsKeyList: any[]; // 规格
  skuList: any[]; // 规格详情
  mainImageList: any[]; // 主图片
  imagePathMain: any[]; // 主图片
  subImageList: any[]; // 详情图片
  imagePathDetails: any[]; // 详情图片
  goodsNumber: string; // 商品货号
  goodsName: string; // 商品名称
  goodsTypeId: string; // 商品分类
  price: string; // 销售价格
  stock: string; // 期初库存数
  purchasePrice: string; // 进价
  status: any; // 是否上架
  varietyFlag: any;
}

@Component({
  name: 'CommodityListDetail',
  components: {}
})
export default class extends Vue {
  private goodsAllInfo: goodsAllInfo = {
    goodsId: '',
    size: '',
    place: '',
    specsKeyList: [], // 规格
    skuList: [], // 规格详情
    mainImageList: [], // 主图片
    imagePathMain: [], // 主图片
    subImageList: [], // 详情图片
    imagePathDetails: [], // 详情图片
    goodsNumber: '', // 商品货号
    goodsName: '', // 商品名称
    goodsTypeId: '', // 商品分类
    price: '', // 销售价格
    stock: '', // 期初库存数
    purchasePrice: '', // 进价
    status: 10, // 是否上架
    varietyFlag: 1
  };
  private isEachtable: boolean = true; // 用来进入页面生成table，只作用一次
  private tableList: Array<any> = []; // 用来记录商品ID，判断是否刷新页面
  private queryId: any; // 用来记录商品ID，判断是否刷新页面
  private listLoading: boolean = true;
  private wordBool: boolean = false; // 查看为true,编辑为false,默认为false = defaultArticleData;
  private allType: Array<any> = []; // 所有可选的商品类型
  // 展示主图
  private showMainPictureArr: any[] = []; // 展示主图
  private showDetailsPictureArr: any[] = []; // 展示详情图
  private mainPictureBool: boolean = false; // 主图提示;
  private detailsPictureBool: boolean = false; // 详情图提示
  private format: any[] = [];
  private tableData: any[] = [];
  private goodsAttr: any[] = [];
  private detailsPictureArr: any[] = [];
  private crrentPage: string = '';
  private currentFormatValue = ''; // 当前表单规格值
  private currentData: any = {
    goodsPriceInventory: []
  };
  private goodsStyleValue: any[] = [];
  private purchasePrice: string = ''; // 全局进价
  private globalPrice: string = ''; // 全局价格
  private globalstock: string = ''; // 全局库存
  private rowImgIndex: string = ''; // 多规格列表上传图片index
  private goodsNote: any[] = [];// 规格列表备份
  private rules = goodsRules;

  created() {
    this.getType()
    if (this.$route.query.status === 'edit') {
      this.queryId = this.$route.query.goodsId
      this.getGoodsDetail()
    }
  }

  private varietyFlag = null
  private blurZero(row) {
    if (!row.stock) {
      row.stock = 0
    }
  }

  private async getGoodsDetail() {
    this.listLoading = true
    const { data } = await getGoodsDetail({
      data: {
        goodsId: this.$route.query.goodsId
      }
    })
    this.goodsAllInfo = Object.assign(this.goodsAllInfo, data.data)
    this.goodsAllInfo.goodsId = this.$route.query.goodsId
    this.goodsAllInfo.imagePathMain.length &&
      this.goodsAllInfo.imagePathMain.forEach((item, index) => {
        this.showMainPictureArr.push({ url: item })
      })

    this.goodsAllInfo.imagePathDetails.length &&
      this.goodsAllInfo.imagePathDetails.forEach((item, index) => {
        this.showDetailsPictureArr.push({ url: item })
      })
    this.format = this.goodsAllInfo.specsKeyList
    
    let varietyFlag = null
    if (this.goodsAllInfo.specsKeyList.length > 0) {
      this.goodsAllInfo.varietyFlag = 2
      this.varietyFlag = 2
    } else {
      this.goodsAllInfo.varietyFlag = 1
      this.varietyFlag = 1
      this.goodsAllInfo.price = this.goodsAllInfo.skuList[0].price
      this.goodsAllInfo.stock = this.goodsAllInfo.skuList[0].stock
    }
    let arr = JSON.parse(JSON.stringify(this.goodsAllInfo.skuList))
    arr.forEach(item => {
      item.specsValues = item.skuName
    })
    this.format.forEach(item=>{
      item.beEdit = true
      item.specsValueList.forEach(v=>{
        v.beEdit = true
      })
    })
    this.currentData.goodsPriceInventory = arr
    setTimeout(() => {
      // this.processStyleItem(null, null, null, null)
      this.processGoodsTable(null)
      this.listLoading = false
    }, 0.5 * 1000)
  }

  // 获取商品分类
  private async getType() {
    const { data } = await listGoodsType({
      data: { shopId: this.$store.state.user.info.shopId }
    })
    this.allType = data.data.list
  }
  private changeGoodsType(goodsTypeId) {
    this.allType.forEach(item => {
      if (item.goodsTypeId == goodsTypeId) {
        this.goodsAllInfo.goodsTypeName = item.goodsTypeName
      }
    })
  }

  // 事件-链接商品列表查看
  private linkGoodsListLook(index: any, row: any, word: any) {
    this.$router.push({
      name: 'CommodityClassification',
      query: {
        word: 'edit',
        goodsId: row.goods_id,
        currentPage: this.crrentPage
      }
    })
  }
  // 批量设置价格和库存
  private batchSettingPriceAndstock() {
    if (typeof (this.globalstock) === 'undefined' || this.globalstock == '') {
      this.globalstock = '0'
      this.$message.error('库存不能为空!')
      return
    }
    const tableData = JSON.parse(JSON.stringify(this.tableData))
    for (const item of tableData) {
      item.price = this.globalPrice
      item.stock = this.globalstock
      item.purchasePrice = this.purchasePrice
    }
    this.tableData = tableData
    this.changeTableData()
  }
  // 验证商品属性是否填写
  private validatorGoodsAttr() {
    for (const item of this.goodsAttr) {
      if (!item.attr_value) {
        return false
      }
      return true
    }
  }

  private changeTableData() { // 修改表格数据
    const tableData = this.tableData
    this.goodsNote = tableData
  }

  private rowId : any = 0;

  // 表单数据转换表格所需格式（目前不灵活，后期待优化）
  private processStyleItem(type, index, valueIndex, specsKey) {
    let skuList = JSON.parse(JSON.stringify(this.goodsAllInfo.skuList))
    let __tableData: any = []
    const arr: any = this.format[0]
    const arr2: any = (this.format[1] && this.format[1]) || []
    const arr3: any = (this.format[2] && this.format[2]) || []
    let that = this
    function newTableData() {
      if (that.format.length === 1) {
        for (const value of arr.specsValueList) {
          let valueIds = ''
          let skuId = ''
          valueIds = `${value.specsValue}`
          skuList.forEach(item=>{
          if(valueIds == item.skuName){
              skuId = item.skuId
            }
          })
          __tableData.push({
            stock: 0,
            price: 0,
            purchasePrice: 0,
            imagePath: '',
            specsValues: valueIds,
            skuId:skuId
          })
        }
      }
      if (that.format.length === 2) {
        for (const value of arr.specsValueList) {
          for (const value2 of arr2.specsValueList) {
            let valueIds = ''
            let skuId = ''
            valueIds = `${value.specsValue},${value2.specsValue}`
            skuList.forEach(item=>{
              if(valueIds == item.skuName){
                skuId = item.skuId
              }
            })
            __tableData.push({
              stock: 0,
              price: 0,
              purchasePrice: 0,
              imagePath: '',
              specsValues: valueIds,
              skuId:skuId
            })
          }
        }
      }
      if (that.format.length === 3) {
        for (const value of arr.specsValueList) {
          for (const value2 of arr2.specsValueList) {
            for (const value3 of arr3.specsValueList) {
              let valueIds = ''
              let skuId = ''
              valueIds = `${value.specsValue},${value2.specsValue},${value3.specsValue}`
              skuList.forEach(item=>{
              if(valueIds == item.skuName){
                  skuId = item.skuId
                }
              })
              __tableData.push({
                stock: 0,
                price: 0,
                purchasePrice: 0,
                imagePath: '',
                specsValues: valueIds,
                skuId:skuId
              })
            }
          }
        }
      }
    }
    if (type == 'delate') {
      const __tableDataTwo = this.goodsNote
      let arrSame = []
      let arr = __tableDataTwo.filter((v, i) => {
        if (typeof v.specsValues === 'string') {
          v.specsValueList = v.specsValues.split(',')
        } else {
          v.specsValueList = v.specsValues
        }
        if (typeof valueIndex === 'number') {
          if (v.specsValueList[index] == this.format[index].specsValueList[valueIndex].specsValue && this.format[index].specsKey == specsKey) {
            return v
          } else {
            arrSame.push(v)
          }
        } else {
          newTableData()
        }
      })
      arrSame.forEach(item => {
        item.specsValues = item.specsValueList.toString()
      })
      __tableData = arrSame
    } else {
      newTableData()
    }

    const tableData = this.goodsNote || []
    if (tableData.length) {
      for (const table of tableData) {
        for (let __table of __tableData) {
          if (__table.specsValues == table.specsValues) {
            __table.price = table.price
            __table.stock = table.stock
            __table.imagePath = table.imagePath
          }
        }
      }
    }
    if (this.isEachtable && this.goodsAllInfo.skuList.length > 0) {
      this.isEachtable = false
      this.goodsAllInfo.skuList.forEach((e: any, i) => {
        this.$nextTick(() => {
          if (__tableData[i]) {
            __tableData[i].price = e.price
            __tableData[i].skuId = e.skuId
            __tableData[i].stock = e.stock
            __tableData[i].purchasePrice = e.purchasePrice
            __tableData[i].imagePath = e.imagePath
            __tableData[i].specsValues = e.specsValues
          }
        })
      })
    }
    // this.goodsNote = __tableData

    this.$set(this.currentData, 'goodsPriceInventory', __tableData)
    this.processGoodsTable('edit')
  }

  private forMatBlur(item){
    if(item.beEdit){
      return false
    }
  }

  // 当规格值表单失焦点
  private onFormatValueBlur(index: any, valueIndex: string , row : any) {
    if(row.beEdit){
      row.specsValue = this.currentValue 
      this.$message.error('已有规格值不能编辑!')
      return
    }
    const value = this.format[index].specsValueList[valueIndex]
    let that = this
    function checkForm() {
      let pass = true
      let specsKey = []
      let format = JSON.parse(JSON.stringify(that.format))
      format.forEach(item => {
        if (specsKey.indexOf(item.specsKey) >= 0) {
          pass = false
        } else {
          let specsValue = []
          item.specsValueList.forEach(v => {
            if (specsValue.indexOf(v.specsValue) >= 0) {
              pass = false
            }
            specsValue.push(v.specsValue)
          })
        }
        specsKey.push(item.specsKey)
      })
      return pass
    }
    if (value.specsValue == '') {
      this.deleteFormatValue(index, valueIndex)
      const newStyleValueItem = {
        specsKey: value.specsValue
      }
      this.goodsStyleValue.push(newStyleValueItem)
      this.processStyleItem(null, null, null, null)
      return
    }
    if (!checkForm()) {
      this.deleteFormatValue(index, valueIndex)
      const newStyleValueItem = {
        specsKey: value.specsValue
      }
      this.goodsStyleValue.push(newStyleValueItem)
      this.processStyleItem(null, null, null, null)
      this.$message.error('规格值或规格名重复,请检查')
      return
    }
    if (!value.specsValue || this.currentFormatValue == value.specsValue) {
      return
    }

    const newStyleValueItem = {
      specsKey: value.specsValue
    }
    this.goodsStyleValue.push(newStyleValueItem)
    this.processStyleItem(null, null, null, null)
  }
  // 增加规格值
  private addFormatValue(index: string) {
    const format = JSON.parse(JSON.stringify(this.format))
    format[index].specsValueList.push({
      specsValue: ''
      // value_id: ""
    })
    this.format = format
  }
  // 删除规格值
  private deleteFormatValue(index: string, valueIndex: string) {
    const format = JSON.parse(JSON.stringify(this.format))
    this.processStyleItem('delate', index, valueIndex, format[index].specsKey)
    format[index].specsValueList.splice(valueIndex, 1)
    this.format = format
  }
  // 增加规格
  private addFormat() {
    const format = JSON.parse(JSON.stringify(this.format))
    if (this.format.length >= 2) {
      this.$message({
        message: '最多增加两个个规格',
        type: 'warning'
      })
      return
    }
    format.push({
      specsKey: '',
      specsValueList: []
    })
    this.format = format
  }
  private currentValue = ''
  private onFormatValueFocus(index: any, valueIndex: string ,row :any) {
    this.currentValue = row.specsValue
    this.currentFormatValue = this.format[index].specsValueList[
      valueIndex
    ].specsValueList
  }
  private currentSpecsKey = ''
  private specsKeyFocus(item){
    // if(item.beEdit){
    //   this.$message.error('已有规格不能编辑!')
    // }
    this.currentSpecsKey= item
  }
  private specsKeyBlur(item){
    if(item.beEdit){
      this.$message.error('已有规格不能编辑!')
      item.specsKey = this.currentSpecsKey
    }
  }
  // 删除规格
  private deleteFormat(index: string) {
    const format = JSON.parse(JSON.stringify(this.format))
    const tableData = JSON.parse(JSON.stringify(this.tableData))
    format.splice(index, 1)
    tableData.splice(index, 1)
    this.format = format
    this.tableData = tableData
    this.processStyleItem(null, index, null, null)
  }
  // 数据转换表格所需格式
  private processGoodsTable(type) {
    const currentData = this.currentData
    let tableData = JSON.parse(JSON.stringify(currentData.goodsPriceInventory))
    tableData.forEach((item, index) => {
      // 规格值id字符串转换为数组
      if (typeof item.specsValues === 'string') {
        item.specsValues = item.specsValues.split(',')
      } else {
        item.specsValues = item.specsValueList
      }
      for (let key in item.specsValues) {
        for (let keyValue of this.goodsStyleValue) {
          if (item.specsValues[key] == keyValue.specsKey) {
            item.specsKey = keyValue.specsKey
            // item[keyValue.style_id] = keyValue.specsKey;
          }
        }
      }
    })
    this.tableData = tableData
    this.goodsNote = tableData
  }

  // 事件-返回上一页
  private backPage() {
    this.$router.go(-1)
  }
  // 事件-取消、重置
  private resetForm(goodsAllInfo: any) {
    // this.$refs[goodsAllInfo].resetFields();
    this.$nextTick(() => {
      (this.$refs[goodsAllInfo] as Form).clearValidate()
    })
    this.mainPictureBool = false
    this.detailsPictureBool = false
    this.$router.go(-1)
  }

  private resetPostList() {
    this.tableList = []
    this.tableData.forEach((v: any, i) => {
      let tr = {
        price: v.price,
        stock: v.stock,
        skuId: v.skuId,
        specsValues: v.specsValues.join(','),
        purchasePrice: v.purchasePrice,
        imagePath: v.imagePath
        // specsValues: JSON.stringify(v.specsValues)
      }
      this.tableList.push(tr)
    })
    let varietyFlag = this.goodsAllInfo.varietyFlag
    this.goodsAllInfo.price = varietyFlag == 1 ? this.goodsAllInfo.price : ''
    this.goodsAllInfo.stock = varietyFlag == 1 ? this.goodsAllInfo.stock : ''
    this.goodsAllInfo.purchasePrice =
      varietyFlag == 1 ? this.goodsAllInfo.purchasePrice : ''
    this.goodsAllInfo.specsKeyList = varietyFlag == 2 ? this.format : []
    this.goodsAllInfo.skuList = varietyFlag == 2 ? this.tableList : []
  }

  // 新增商品列表请求提交,编辑加上ID就行
  private async addGoods() {
    this.resetPostList()

    this.goodsAllInfo.mainImageList.toString()
    this.goodsAllInfo.imagePathDetails.toString()
    if (this.goodsAllInfo.varietyFlag == 1) {
      this.goodsAllInfo.skuList = [{
        price: this.goodsAllInfo.price,
        stock: this.goodsAllInfo.stock
      }]
    }
    if (this.goodsAllInfo.skuList.length <= 0) {
      this.$message.error('请添加规格值!')
      return
    }
    const { data } = await insertGoods({
      data: this.goodsAllInfo
    })
    this.postMeg(data.resultCode, data.resultInfo)
  }
  // 编辑商品列表请求提交
  private async editGoods() {
    if (this.goodsAllInfo.varietyFlag == 2) {
      this.resetPostList()
    } else {
      this.goodsAllInfo.skuList = []
      this.goodsAllInfo.specsKeyList = []
      this.goodsAllInfo.skuList.push({ price: this.goodsAllInfo.price, stock: this.goodsAllInfo.stock })
      // this.goodsAllInfo.skuList[0].price = this.goodsAllInfo.price
      // this.goodsAllInfo.skuList[0].stock = this.goodsAllInfo.stock
    }
    if (this.goodsAllInfo.skuList.length <= 0) {
      this.$message.error('请添加规格!')
      return
    }
    const { data } = await updateGoods({
      data: this.goodsAllInfo
    })
    this.postMeg(data.resultCode, data.resultInfo)
  }

  // 提交请求，后续处理
  private postMeg(code: number, info: string) {
    this.$message({
      message: info,
      type: code == 1 ? 'success' : 'warning'
    })
    setTimeout(() => {
      code == 1 && this.$router.go(-1)
    }, 1000)
  }

  // 事件-提交表单
  private submitForm(forms: any) {
    (this.$refs[forms] as ElForm).validate((valid: boolean) => {
      if (valid) {
        // 判断主图和详情图有没有上传
        if (
          this.goodsAllInfo.imagePathMain.length != 0 &&
          this.goodsAllInfo.imagePathDetails.length != 0
        ) {
          // 商品详情编辑提交
          // console.log(this.goodsAllInfo)
          // this.goodsAllInfo.mainImageList.forEach(item => {
          //   this.goodsAllInfo.imagePathMain.push(item.imagePath)
          // })
          // this.goodsAllInfo.subImageList.forEach(item => {
          //   this.goodsAllInfo.imagePathDetails.push(item.imagePath)
          // })
          // return

          this.goodsAllInfo.goodsId ? this.editGoods() : this.addGoods()
        } else {
          console.log('error submit!!')
        }
      } else {
        return false
      }
    })
    if (this.goodsAllInfo.imagePathMain.length == 0) {
      this.mainPictureBool = true // 主图提示显示
    }
    if (this.goodsAllInfo.imagePathDetails.length == 0) {
      this.detailsPictureBool = true // 详情图提示显示
    }
  }

  // 事件-主图上传删除
  private mainPictrueRemove(file: any, fileList: any) {
    this.goodsAllInfo.imagePathMain.forEach((v, i) => {
      if (v == file.url) {
        this.goodsAllInfo.imagePathMain.splice(i, 1)
        // this.showMainPictureArr.splice(i, 1)
      }
    })
    if (this.goodsAllInfo.imagePathMain.length === 0) {
      this.mainPictureBool = true
    }
  }

  // 事件-详情图上传删除
  private detailsPictureRemove(file: any, fileList: any) {
    this.goodsAllInfo.imagePathDetails.forEach((v, i) => {
      if (v == file.url) {
        this.goodsAllInfo.imagePathDetails.splice(i, 1)
        // this.showDetailsPictureArr.splice(i, 1)
      }
    })
    if (this.goodsAllInfo.imagePathDetails.length === 0) {
      this.detailsPictureBool = true
    }
  }
  private mainHandleExceed(files: any, fileList: any) {
    this.$message.warning(
      `当前限制选择 5 张图片，本次选择了 ${
        files.length
      } 个文件，共选择了 ${files.length + fileList.length} 个文件`
    )
  }
  private detailsHandleExceed(files: any, fileList: any) {
    this.$message.warning(
      `当前限制选择 15 张图片，本次选择了 ${
        files.length
      } 个文件，共选择了 ${files.length + fileList.length} 个文件`
    )
  }
  // 事件-列表图片上传成功
  private handleAvatarSuccess(res: any, file: any) {
    this.tableData[parseInt(this.rowImgIndex)].imagePath = res.data[0]
  }
  private getRow(row: any) {
    this.rowImgIndex = row.$index
  }
  private beforeAvatarUpload(file: any) {
    const isJPG = file.type === 'image/jpeg'
    const isPNG = file.type === 'image/png'
    const isLt2M = file.size / 1024 / 1024 < 2

    if (!isJPG && !isPNG) {
      this.$message.error('上传图片只能是 JPG 和 PNG 格式!')
    }
    if (!isLt2M) {
      this.$message.error('上传图片大小不能超过 2MB!')
    }
    return (isJPG || isPNG) && isLt2M
  }
  // 事件-主图上传成功
  private mainPictrueUploadSuccess(responseFile: any, res: any, file: any) {
    if (res) {
      this.goodsAllInfo.imagePathMain.push(res.response.data[0])
    }
    if (this.goodsAllInfo.imagePathMain.length != 0) {
      this.mainPictureBool = false
    }
  }
  // 事件-主图上传失败
  private mainPictrueUploadError(err: any, file: any, fileList: any) {
    this.$message.error('图片上传错误!')
  }
  // 事件-详情图上传成功
  private detailsPictureUploadSuccess(responseFile: any, res: any, file: any) {
    if (res) {
      this.goodsAllInfo.imagePathDetails.push(res.response.data[0])
    }
    if (this.goodsAllInfo.imagePathDetails.length != 0) {
      this.detailsPictureBool = false
    }
  }
  // 事件-详情图上传失败
  private detailsPictureUploadError(err: any, file: any, fileList: any) {
    this.$message.error('图片上传错误!')
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/detail.scss";
</style>

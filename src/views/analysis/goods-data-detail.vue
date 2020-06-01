<template>
  <div class="app-container">
    <div class="public-box">
      <div class="public-box-wrap">
        <el-form
          id="myForm"
          ref="goodsAllInfo"
          label-width="100px"
          label-position="left"
          :model="goodsAllInfo"
        >
          <div class="detailBasicInfo">
            <div class="same-header">
              <span class="same-header-left">商品信息</span>
              <el-button type="default" size="small" icon="el-icon-back" @click="backPage">返回</el-button>
            </div>
            <div class="detailBasicInfo-wrap">
              <div class="detailBasicInfo-left">
                <el-form-item label="商品货号：">{{ goodsAllInfo.goodNum }}</el-form-item>
                <el-form-item label="商品名称：">{{ goodsAllInfo.goodName }}</el-form-item>
                <el-form-item label="商品分类：">{{ goodsAllInfo.goodType }}</el-form-item>
                <el-form-item label="是否上架：">{{ goodsAllInfo.status==1?'已上架':'未上架' }}</el-form-item>
                <el-form-item label="商品主图：">
                  <div v-for="(item, index) in showMainPictureArr" :key="index" class="img-box">
                    <img :src="item.url" alt />
                    <el-image class="goods-img" :src="item.url" :preview-src-list="[item.url]" />
                  </div>
                </el-form-item>
                <el-form-item label="商品详图">
                  <div v-for="(item, index) in showDetailsPictureArr" :key="index" class="img-box">
                    <img :src="item.url" alt />
                    <el-image class="goods-img" :src="item.url" :preview-src-list="[item.url]" />
                  </div>
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="detailStockInfo price-stock-wrap mt20">
            <div class="same-header">
              <span class="same-header-left">商品数据</span>
            </div>
            <div class="detailStockInfo-wrap table-wrap">
              <el-form>
                <!-- <el-form-item label="商品规格：">
                  <el-radio-group v-model="goodsAllInfo.varietyFlag">
                    <el-radio :label="1">统一规格</el-radio>
                    <el-radio :label="2">多种规格</el-radio>
                  </el-radio-group>
                </el-form-item>-->
                <el-form-item label="访客数：">{{ goodsAllInfo.readNum }}</el-form-item>
                <el-form-item label="访客排行：">{{ goodsAllInfo.stock }}无</el-form-item>
                <el-form-item label="销量：">{{ goodsAllInfo.saleNum }}</el-form-item>
                <el-form-item label="销量排行：">{{ goodsAllInfo.stock }}无</el-form-item>
                <el-form-item label="销量/访客转化率：">{{ goodsAllInfo.readSaleRatio }}%</el-form-item>
                <el-form-item label="销量/访客转化率排行：">{{ goodsAllInfo.stock }}无</el-form-item>
                <!-- <el-form-item label="库存：">{{goodsAllInfo.stock}}</el-form-item> -->
                <el-form-item
                  v-if="goodsAllInfo.varietyFlag==1"
                  label="价格："
                >{{ goodsAllInfo.price }}</el-form-item>
                <el-form-item v-if="goodsAllInfo.varietyFlag==2" label="规格明细：">
                  <el-table :data="tableData" class="table" style="width: 100%">
                    <el-table-column
                      v-for="(item, index) in format"
                      :key="index"
                      :label="item.specName"
                    >
                      <template slot-scope="{row}">
                        <template>{{ row.valueNames[index] }}</template>
                      </template>
                    </el-table-column>
                    <el-table-column prop="price" label="价格">
                      <template slot-scope="{row}">
                        <template>{{ row.price }}</template>
                      </template>
                    </el-table-column>
                    <el-table-column prop="stock" label="销量">
                      <template slot-scope="{row}">
                        <template>{{ row.stock }}</template>
                      </template>
                    </el-table-column>
                    <el-table-column prop="stock" label="销量排行">
                      <template slot-scope="{row}">
                        <template>{{ row.stock }}</template>
                      </template>
                    </el-table-column>
                    <!-- <el-table-column prop="stock" label="库存">
                      <template slot-scope="{row}">
                        <template>{{row.stock}}</template>
                      </template>
                    </el-table-column>-->
                  </el-table>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="other-operate-btn mt30">
            <el-button @click="backPage()">返 回</el-button>
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { cloneDeep } from "lodash";
import { Form, Form as ElForm } from "element-ui";
import { getGoodsDetail, goodsAllInfo } from "@/api/commodity";
import { formatJson } from "@/utils";

@Component({
  name: "GoodsDataDetail",
  components: {}
})
export default class extends Vue {
  private goodsAllInfo = goodsAllInfo;
  private isEachtable: boolean = true; // 用来进入页面生成table，只作用一次
  private tableList: Array<any> = []; // 用来记录商品ID，判断是否刷新页面
  private queryId: any; // 用来记录商品ID，判断是否刷新页面
  private listLoading: boolean = true;

  // 展示主图
  private showMainPictureArr: any[] = []; // 展示主图
  private showDetailsPictureArr: any[] = []; // 展示详情图
  private format: any[] = [];
  private tableData: any[] = [];
  private detailsPictureArr: any[] = [];
  private crrentPage: string = "";
  private currentData: any = {
    goodsPriceInventory: []
  };
  private goodsStyleValue: any[] = [];

  created() {
    this.queryId = this.$route.query.goodsId;
    this.getGoodsDetail();
  }
  private async getGoodsDetail() {
    this.listLoading = true;
    const { data } = await getGoodsDetail({
      data: {
        goodId: this.$route.query.goodsId,
        shopId: this.$store.state.user.info.shopid, // 商铺编号，必传
        simpleFlag: 1 // null：浏览量，1：访客数
      }
    });
    this.goodsAllInfo = data.data.good;
    this.goodsAllInfo.goodId = this.$route.query.goodsId;
    this.goodsAllInfo.mainImageList.length &&
      this.goodsAllInfo.mainImageList.forEach((item, index) => {
        this.showMainPictureArr.push({ url: this.$store.state.user.imgUrl + item.imagePath });
      });
    this.goodsAllInfo.subImageList.length &&
      this.goodsAllInfo.subImageList.forEach((item, index) => {
        this.showDetailsPictureArr.push({ url: this.$store.state.user.imgUrl + item.imagePath });
      });
    this.format = this.goodsAllInfo.specificationList;
    this.currentData.goodsPriceInventory = this.goodsAllInfo.detailList;
    setTimeout(() => {
      this.processStyleItem();
      this.listLoading = false;
    }, 0.5 * 1000);
  }

  // 事件-链接商品列表查看
  private linkGoodsListLook(index: any, row: any, word: any) {
    this.$router.push({
      name: "CommodityClassification",
      query: {
        word: "edit",
        goodsId: row.goods_id,
        currentPage: this.crrentPage
      }
    });
  }

  // 表单数据转换表格所需格式（目前不灵活，后期待优化）
  private processStyleItem() {
    const __tableData: any = [];
    const arr: any = this.format[0];
    const arr2: any = (this.format[1] && this.format[1]) || [];
    const arr3: any = (this.format[2] && this.format[2]) || [];
    if (this.format.length === 1) {
      for (const value of arr.valueList) {
        let valueIds = "";
        valueIds = `${value.valueName}`;
        __tableData.push({
          stock: 0,
          price: 0,
          valueNames: valueIds
        });
      }
    }
    if (this.format.length === 2) {
      for (const value of arr.valueList) {
        for (const value2 of arr2.valueList) {
          let valueIds = "";
          valueIds = `${value.valueName},${value2.valueName}`;
          __tableData.push({
            stock: 0,
            price: 0,
            valueNames: valueIds
          });
        }
      }
    }
    if (this.format.length === 3) {
      for (const value of arr.valueList) {
        for (const value2 of arr2.valueList) {
          for (const value3 of arr3.valueList) {
            let valueIds = "";
            valueIds = `${value.valueName},${value2.valueName},${value3.valueName}`;
            __tableData.push({
              stock: 0,
              price: 0,
              valueNames: valueIds
            });
          }
        }
      }
    }
    const tableData = this.currentData.goodsPriceInventory || [];
    if (tableData.length) {
      for (const table of tableData) {
        for (let __table of __tableData) {
          if (__table.valueNames == table.valueNames) {
            __table.price = table.price;
            __table.stock = table.price;
          }
        }
      }
    }
    if (this.isEachtable && this.goodsAllInfo.detailList.length > 0) {
      this.isEachtable = false;
      this.goodsAllInfo.detailList.forEach((e: any, i) => {
        __tableData[i].price = e.price;
        __tableData[i].stock = e.stock;
        __tableData[i].purchasePrice = e.purchasePrice;
        __tableData[i].imagePath = e.imagePath;
        __tableData[i].valueNames = e.valueNames;
      });
    }
    this.$set(this.currentData, "goodsPriceInventory", __tableData);
    this.processGoodsTable();
  }

  // 数据转换表格所需格式
  private processGoodsTable() {
    const currentData = this.currentData;
    let tableData = JSON.parse(JSON.stringify(currentData.goodsPriceInventory));
    for (let item of tableData) {
      // 规格值id字符串转换为数组
      item.valueNames = item.valueNames.split(",");
      for (let key in item.valueNames) {
        for (let keyValue of this.goodsStyleValue) {
          if (item.valueNames[key] == keyValue.specName) {
            item.specName = keyValue.specName;
            // item[keyValue.style_id] = keyValue.specName;
          }
        }
      }
    }
    this.tableData = tableData;
  }

  // 事件-返回上一页
  private backPage() {
    this.$router.go(-1);
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/detail.scss";
.img-box {
  display: inline-block;
  margin-right: 10px;
  img {
    display: none;
  }
  .goods-img {
    width: 100px;
    display: inline-block;
  }
}
</style>

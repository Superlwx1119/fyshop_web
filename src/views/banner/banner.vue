<template>
  <div
    id="banner"
    class="app-container"
  >
    <div class="public-box">
      <div class="public-box-wrap">
        <el-form
          id="myForm"
          ref="goodsAllInfo"
          label-width="140px"
          label-position="right"
          :model="goodsAllInfo"
          :rules="rules"
        >
          <div class="detailStockInfo price-stock-wrap mt20">
            <div class="same-header">
              <span class="same-header-left">轮播图设置</span>
            </div>
            <div class="detailStockInfo-wrap table-wrap freight">
              <el-row
                v-for="(item,index) in bannerList"
                :key="index"
                class="banner"
              >
                <el-col :span="8">
                  <el-upload
                    class="avatar-uploader"
                    :action="$store.state.user.imgUploadApi"
                    :show-file-list="false"
                    :on-success="handleAvatarSuccess"
                    :before-upload="beforeAvatarUpload"
                    @click="getRow(index)"
                  >
                    <img
                      v-if="item.imagePath"
                      :src="item.imagePath"
                      class="avatar"
                      @click="getRow(index)"
                    >
                    <i
                      v-else
                      class="el-icon-plus avatar-uploader-icon"
                      @click="getRow(index)"
                    />
                  </el-upload>
                </el-col>
                <el-col :span="16">
                  <el-form-item label="链接页面：">
                    <el-select
                      v-model="item.pageId"
                      placeholder="请选择"
                      @change="changeSelect(index)"
                    >
                      <el-option
                        v-for="item in options"
                        :key="item.pageId"
                        :label="item.pageName"
                        :value="item.pageId"
                      />
                    </el-select>
                  </el-form-item>
                  <el-form-item
                    v-if="item.pageId=='20191205101859077684838408175639'"
                    label="链接商品："
                  >
                    <el-button
                      v-if="!item.name"
                      style="margin-left:0px;"
                      type="primary"
                      @click="openDialog(index)"
                    >
                      选择
                    </el-button>
                    <div
                      v-else
                      class="goods-info"
                      @click="openDialog(index)"
                    >
                      {{ item.name }}
                    </div>
                  </el-form-item>
                  <div style="padding-left:140px;">
                    <el-button
                      type="primary"
                      @click="submitForm(index)"
                    >
                      保 存
                    </el-button>
                    <el-button
                      type="danger"
                      @click="delBanner(index)"
                    >
                      删除
                    </el-button>
                  </div>
                </el-col>
              </el-row>
            </div>
          </div>
        </el-form>
        <div>
          <el-button
            v-if="bannerList.length<5&&showAddBanner"
            style="margin-left:20px;"
            type="success"
            plain
            @click="addBanner()"
          >
            添加轮播图
          </el-button>
        </div>
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
          <el-form-item :label="propIndex===0?'商品分类:':'状态:'">
            <el-select
              v-if="propIndex===0"
              v-model="listQuery.goodType"
              placeholder="请选择"
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
            <el-select
              v-else
              v-model="list.state"
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
          <el-form-item label>
            <el-input
              v-if="propIndex===0"
              v-model="listQuery.goodsName"
              placeholder="商品名称/货号"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
            <el-input
              v-else
              v-model="list.goods_name"
              placeholder="活动商品关键词"
              style="width: 200px;"
              class="filter-item"
              @keyup.enter.native="handleFilter"
            />
          </el-form-item>
          <el-form-item>
            <el-button
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
          :prop="propList[propIndex].goodNum"
          align="center"
        /> -->
        <el-table-column
          :label="$t('table.productImage')"
          align="center"
          width="100"
        >
          <template slot-scope="{row}">
            <el-image
              v-if="propIndex===0"
              style="width: 40px"
              :src="row.imagePath"
              :preview-src-list="[row.imagePath]"
            />
            <el-image
              v-else
              style="width: 40px"
              :src="row.imagePath"
              :preview-src-list="[row.imagePath]"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('table.productName')"
          :prop="propList[propIndex].goodsName"
          align="center"
        />
        <el-table-column
          :label="$t('table.productGrouping')"
          :prop="propList[propIndex].goodsTypeName"
          align="center"
        />
        <el-table-column
          :label="$t('table.price')"
          :prop="propList[propIndex].price"
          align="center"
          width="100"
        >
          <template slot-scope="{row}">
            <p v-if="row.minPrice == row.maxPrice">
              {{ row.maxPrice }}
            </p>
            <p v-else>
              {{ row.minPrice }} - {{ row.maxPrice }}
            </p>
          </template>
        </el-table-column>
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
              @click="saveGoods(scope.row)"
            >
              选择
            </el-button>
          </template>
        </el-table-column>
      </el-table>

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
import { Component, Vue, Watch } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import {
  getGoodsList,
  listGoodsType,
  listQuery,
  getGoodsDetail
} from '@/api/commodity'
import { getBargainActivityList, getGroupActivityList } from '@/api/marketing'
import {
  queryAppletPages,
  saveTenantAppletPage,
  queryTenantAppletPages,
  deleteTenantAppletPage,
  updateTenantAppletPage
} from '@/api/banner'
import { formatJson } from '@/utils'
import { Form, Form as ElForm } from 'element-ui'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'Banner',
  components: { Pagination }
})
export default class extends Vue {
  private goodsAllInfo = {};
  private bannerList: any = [
    {
      imagePath: '',
      name: '',
      pageId: '',
      params: ''
    }
  ];
  private listQuery = listQuery; // 商品搜索条件
  private list = {
    shop_id: this.$store.state.user.info.shopid,
    state: '',
    type: '',
    goods_name: ''
  }; // 活动搜索条件
  private pageSize: number = 20;
  private currentPage: number = 1;
  private total: number = 0;
  private tableKey = 0;
  private propIndex = 0; // 区分选择商品列表prop字段
  private selectValue: any = ''; // 下拉列表选中的值
  private idList: any = {
    '20191205101859077684838408175639': 1, // 商品
    '20191205101825079482839158331231': 0, // 卡券
    '20191205095918075813937995790881': 3, // 砍价
    '20191205095853078135427040368370': 4 // 团购
  };
  private importanceOptions: any[] = []; // 商品分类列表
  private goodsList: any = []; // 商品列表
  private dialogFormVisible = false;
  private listLoading = true;
  private showAddBanner = true;
  private rowImgIndex: number = 0;
  private allType = []; // 所有可选的商品类型
  private stateOptions = [
    { value: 0, label: '进行中' },
    { value: 1, label: '未开始' },
    { value: 2, label: '已结束' }
  ];
  private options: any = [];
  private propList: any = [
    {
      goodNum: 'goodNum',
      goodsName: 'goodsName',
      goodsTypeName: 'goodsTypeName',
      price: 'price'
    },
    {
      goodNum: 'goods_number',
      goodsName: 'goods_name',
      goodsTypeName: 'type_name',
      price: 'original_price'
    }
  ];
  private rules = {
    goodsName: [
      {
        required: true,
        message: '请输入商品名称',
        trigger: 'blur'
      }
    ]
  };

  created() {
    this.queryAppletPages()
    this.queryTenantAppletPages()
  }

  private async queryAppletPages() {
    const { data } = await queryAppletPages({
      data: {}
    })
    this.options = data.data.list
    this.options.push({
      pageId: '',
      pageName: '无链接'
    })
  }

  private async queryTenantAppletPages() {
    const { data } = await queryTenantAppletPages({
      data: {}
    })
    this.bannerList = data.data.list
  }

  private async getGoodsDetail() {
    this.listLoading = true
    const { data } = await getGoodsDetail({
      data: {
        goodId: this.$route.query.goodsId
      }
    })
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }
  // 获取商品列表
  private async getGoodsList() {
    this.listLoading = true
    this.goodsList = []
    this.total = 0
    let selectValue: any = this.selectValue
    let postData: any = {
      data: this.listQuery,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    }
    if (selectValue == 1) {
      this.getType()
      postData.data = this.listQuery
    } else {
      postData.data = this.list
    }
    let getUrl: any = {
      1: getGoodsList,
      3: getBargainActivityList,
      4: getGroupActivityList
    }
    const { data } = await getUrl[selectValue](postData)
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

  // 获取商品ID和名字
  private async saveGoods(row: any) {
    if (this.selectValue > 1) {
      this.bannerList[this.rowImgIndex].params = 'goodsId=' + row.goodsId
      this.bannerList[this.rowImgIndex].name = row.goods_name
    } else {
      this.bannerList[this.rowImgIndex].params = 'goodsId=' + row.goodsId
      this.bannerList[this.rowImgIndex].name = row.goodsName
    }
    this.dialogFormVisible = false
  }

  private handleFilter() {
    this.currentPage = 1
    this.getGoodsList()
  }

  // 事件-列表图片上传成功
  private handleAvatarSuccess(res: any, file: any) {
    this.bannerList[this.rowImgIndex].imagePath = res.data[0]
  }

  private beforeAvatarUpload(file: any) {
    const isLt2M = file.size / 1024 / 1024 < 5

    if (!isLt2M) {
      this.$message.error('上传图片大小不能超过 5MB!')
    }
    return isLt2M
  }

  // 获取选中banner的index
  private getRow(index: number) {
    this.rowImgIndex = index
  }

  // 打开选择商品弹出框
  private openDialog(index: number) {
    this.rowImgIndex = index
    this.selectValue = this.idList[this.bannerList[this.rowImgIndex].pageId]
    this.getGoodsList()
    this.dialogFormVisible = true
  }
  private addBanner() {
    if (this.bannerList.length >= 5) {
      this.showAddBanner = false
      return
    }
    this.bannerList.push({
      imagePath: '',
      name: '',
      pageId: '',
      params: ''
    })
  }

  private changeSelect(index: number) {
    let value = this.bannerList[index].pageId
    this.rowImgIndex = index
    this.selectValue = this.idList[value]
    this.bannerList[this.rowImgIndex].name = ''
    this.bannerList[this.rowImgIndex].params = ''
    this.bannerList[this.rowImgIndex].pagePath = ''
    this.bannerList[this.rowImgIndex].path = ''
    this.bannerList[this.rowImgIndex].page = null
    if (this.selectValue > 1) {
      this.propIndex = 1
    } else {
      this.propIndex = 0
    }
  }
  // 编辑banner
  private async editGoods() {
    const { data } = await saveTenantAppletPage({
      data: this.bannerList[this.rowImgIndex]
    })
    this.postMeg(data.resultCode, data.resultInfo)
  }

  // 添加banner
  private async addGoods() {
    const { data } = await saveTenantAppletPage({
      data: this.bannerList[this.rowImgIndex]
    })
    this.postMeg(data.resultCode, data.resultInfo)
  }

  // 删除banner
  private async delBanner(index: number) {
    if (this.bannerList.length === 1) {
      return
    }
    if (this.bannerList[index].id) {
      const { data } = await deleteTenantAppletPage({
        data: { id: this.bannerList[index].id }
      })
      this.postMeg(data.resultCode, data.resultInfo)
    }
    this.bannerList.splice(index, 1)
    this.showAddBanner = true
  }
  // 提交请求，后续处理
  private postMeg(code: number, info: string) {
    this.$message({
      message: info,
      type: code == 1 ? 'success' : 'warning'
    })
    this.queryTenantAppletPages()
    code == 1 && (this.showAddBanner = true)
  }

  // 事件-提交表单
  private submitForm(index: number) {
    this.rowImgIndex = index
    if (!this.bannerList[index].imagePath) {
      return this.$message({
        message: '请上传图片',
        type: 'warning'
      })
    }
    // 商品详情链接需要添加商品信息
    if (
      this.bannerList[this.rowImgIndex].pageId ==
        '20191205101859077684838408175639' &&
      !this.bannerList[this.rowImgIndex].name
    ) {
      return this.$message({
        message: '请选择链接商品',
        type: 'warning'
      })
    }
    if (this.bannerList[index].params) {
      this.bannerList[index].path = '/pages/goods/detail'
    } else {
      this.bannerList[index].path = ''
    }
    this.bannerList[index].id ? this.editGoods() : this.addGoods()
  }
}
</script>
<style lang="scss" scoped>
@import "@/styles/detail.scss";
.el-form-item {
  .el-button {
    margin-left: 20px;
  }
}
.banner {
  margin-top: 12px;
  border-bottom: 1px solid #d9d9d9;
}
.avatar-uploader {
  margin-bottom: 12px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 356px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 356px;
  height: 178px;
  display: block;
}
.goods-info {
  cursor: pointer;
  text-align: left;
  font-size: 14px;
  color: #409eff;
}
</style>

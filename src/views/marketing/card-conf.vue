<template>
  <div class="app-container card-conf">
    <div class="filter-container">
      <el-form
        :inline="true"
        :model="listQuery"
        class="demo-form-inline"
      >
        <el-form-item label="卡券状态:">
          <el-select
            v-model="listQuery.currentStatus"
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
        <el-form-item label="投放状态:">
          <el-select
            v-model="listQuery.supportReceive"
            placeholder="全部状态"
            clearable
            style="width: 200px"
            class="filter-item"
          >
            <el-option
              v-for="item in sendOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="卡券分类:">
          <el-select
            v-model="listQuery.couponType"
            placeholder="全部分类"
            clearable
            style="width: 200px"
            class="filter-item"
          >
            <el-option
              v-for="item in importanceOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label>
          <el-input
            v-model="listQuery.couponName"
            placeholder="卡券名称关键词"
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
            {{ $t('table.add') }}卡券
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
      <el-table-column
        label="卡券名称"
        min-width="150px"
        align="center"
        prop="couponName"
      />
      <el-table-column
        label="卡券类型"
        width="140px"
        align="center"
        prop="couponTypeValue"
      />
      <el-table-column
        label="优惠内容"
        align="center"
        prop="content"
      />
      <el-table-column
        label="状态"
        width="105px"
        align="center"
        prop="currentStatusExplain"
      />
      <el-table-column
        label="生效日期"
        width="170px"
        align="center"
        prop="startTime"
      >
        <template slot-scope="{row}">
          <p>{{ row.startTime }}&nbsp;起</p>
          <p>{{ row.endTime }}&nbsp;止</p>
        </template>
      </el-table-column>
      <el-table-column
        label="已领取/剩余"
        width="105px"
        align="center"
        prop="getNumber"
      />
      <el-table-column
        label="已使用"
        align="center"
        width="95"
        prop="useNumber"
      />
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="250"
        class-name="fixed-width"
      >
        <template slot-scope="scope">
          <!-- <el-button size="mini" type="primary" @click="goDetail('edit', scope.row.id)">编辑</el-button> -->
          <el-button
            size="mini"
            type="primary"
            @click="openDialog('edit',scope.$index, scope.row)"
          >
            数据
          </el-button>
          <el-button
            size="mini"
            :type="scope.row.supportReceive =='0' ? 'danger':'success'"
            :disabled="scope.row.disabled"
            @click="deleteSubmit(scope.row,scope.row.supportReceive =='0' ? '停止':'投放')"
          >
            {{ scope.row.supportReceive =='0' ? '停止':'投放' }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            :disabled="scope.row.disabled"
            @click="deleteSubmit(scope.row,'删除')"
          >
            删除
          </el-button>
          <!-- <el-button
            v-if="scope.row.status_value=='生效中'"
            size="mini"
            type="primary"
            @click="openStatusDialog(scope.row)"
          >推广</el-button>-->
          <el-button
            v-if="scope.row.status_value==='生效中'"
            size="mini"
            type="primary"
            @click="spreadDialog(scope.row)"
          >
            推广
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
      title="卡券"
      :visible.sync="dialogFormVisible"
    >
      <el-row>
        <el-col :span="8">
          <p class="card-title">
            卡券总成交额
          </p>
          <p class="card-nub">
            ￥{{ couponData.totalAmount }}
          </p>
        </el-col>
        <el-col :span="8">
          <p class="card-title">
            卡券成交数
          </p>
          <p class="card-nub">
            {{ couponData.totalOrder }}
          </p>
        </el-col>
        <el-col :span="8">
          <p class="card-title">
            参与老客户
          </p>
          <p class="card-nub">
            {{ couponData.oldParticipateCustomer }}
          </p>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="8">
          <p class="card-title">
            卡券总优惠额
          </p>
          <p class="card-nub">
            ￥{{ couponData.totalDiscountAmount }}
          </p>
        </el-col>
        <el-col :span="8">
          <p class="card-title">
            卡券客单价
          </p>
          <p class="card-nub">
            ￥{{ couponData.unitPrice }}
          </p>
        </el-col>
        <el-col :span="8">
          <p class="card-title">
            参与新客户
          </p>
          <p class="card-nub">
            {{ couponData.newParticipateCustomer }}
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
    <el-dialog
      title="推广卡券"
      :visible.sync="dialogStatusVisible"
    >
      <el-table
        :key="tableKey"
        :data="statusList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          label="小程序平台"
          min-width="150px"
          align="center"
          prop="platform_value"
        />
        <el-table-column
          label="剩余数量"
          width="140px"
          align="center"
          prop="remain"
        />
        <el-table-column
          label="状态"
          width="105px"
          align="center"
          prop="status_value"
        />
        <el-table-column
          :label="$t('table.actions')"
          align="center"
          width="110"
          class-name="fixed-width"
        >
          <template slot-scope="scope">
            <el-button
              v-if="scope.row.status==0"
              size="mini"
              type="primary"
              @click="spreadDialog(scope.row)"
            >
              推广
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="卡券"
      :visible.sync="spreadDialogVisible"
      class="card-box"
    >
      <el-row>
        <el-input
          v-model="spreadList.url"
          placeholder="Please input"
          style="width:400px; max-width:100%;"
        />
        <el-button
          v-clipboard:copy="spreadList.url"
          v-clipboard:success="clipboardSuccess"
          type="primary"
          icon="el-icon-document"
        >
          复制
        </el-button>
      </el-row>
      <div
        id="imageDom"
        ref="imageDom"
        :style="cardColor"
        class="card-img"
      >
        <div class="card-content">
          <div>
            <div
              class="card-top"
              :style="cardColor"
            >
              <p>{{ spreadList.name }}</p>
              <h3>{{ spreadList.content }}</h3>
              <p>{{ spreadList.use_limit }}</p>
            </div>
            <div class="card-time">
              使用时间：{{ spreadList.time }}
            </div>
            <div class="card-down">
              <div id="qrcode" />
              <p>扫码领取</p>
            </div>
          </div>
        </div>
      </div>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="downloadImg()"
        >
          下载海报
        </el-button>
        <el-button
          type="primary"
          @click="downloadCode()"
        >
          下载二维码
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  getCouponList,
  getPromotionList,
  getPromotion,
  updateCoupon,
  deleteCoupon,
  showCouponData
} from '@/api/marketing'
import Pagination from '@/components/Pagination/index.vue'
import { handleClipboard, clipboardSuccess } from '@/utils/clipboard' // use clipboard directly
import QRCode from 'qrcode'
import html2canvas from 'html2canvas'
import { setTimeout } from 'timers'

@Component({
  name: 'CardConf',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private tableKey = 0;
  private inputData = 'https://github.com/Armour/vue-typescript-admin-template';
  private clipboardSuccess = clipboardSuccess;
  private handleClipboard = handleClipboard;
  private cardColor: string = '';
  private statusList: any = []; // 卡券推广状态
  private spreadList: any = {}; // 卡券详情状态
  private list = [];
  private total: number = 0;
  private listLoading: boolean = true;
  private dialogFormVisible: boolean = false;
  private spreadDialogVisible: boolean = false;
  private dialogStatusVisible: boolean = false;
  private pageSize: number = 20;
  private currentPage: number = 1;
  private listQuery = {
    shopId: this.$store.state.user.info.shopid,
    couponType: '',
    couponName: '',
    currentStatus: '',
    supportReceive: ''
  };
  private importanceOptions = [
    { value: 20, label: '金额卷' },
    // { value: 2, label: "金额卷" },
    { value: 30, label: '折扣卷' }
  ];
  private sendOptions = [
    { value: 0, label: '不投放' },
    { value: 1, label: '投放' }
  ];
  private stateOptions = [
    { value: 0, label: '生效中' },
    { value: 1, label: '未生效' },
    { value: 2, label: '失效' }
    // { value: 2, label: "过期" }
  ];
  private dialogStatus = '';
  private downloadLoading = false;

  created() {
    this.getList()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getCouponList({
      data: this.listQuery,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    })
    this.list = data.data.list
    this.total = data.data.total
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
    this.listLoading = false
  }

  // 获取推广小程序列表
  private async getPromotionList(id: string) {
    const { data } = await getPromotionList({
      data: {
        id: id
      }
    })
    this.statusList = data.data
  }
  // 获取优惠券详情
  private async spreadDialog(row: any) {
    const { data } = await getPromotion({
      data: {
        id: row.id,
        platform: row.platform
      }
    })
    this.spreadList = data.data
    this.spreadDialogVisible = true
    this.dialogStatusVisible = false
    // this.cardColor = "background-color:" + this.spreadList.colour;
    this.cardColor = 'background-color:red'
    setTimeout(() => {
      this.creatQrCode()
    }, 100)
  }

  private openStatusDialog(row: any) {
    this.dialogStatusVisible = true
    this.getPromotionList(row.id)
  }
  private async showCouponData(id) {
    const { data } = await showCouponData({ data: { couponId: id } })
    this.couponData = data.data
  }

  private couponData = {}// 卡券数据
  private openDialog(status: string, index: any, row: any) {
    this.dialogFormVisible = true
    this.showCouponData(row.couponId)
  }
  // 下载海报
  private downloadImg() {
    let imageDom: any = this.$refs.imageDom
    let imgUrl: any
    html2canvas(imageDom, {
      backgroundColor: null // 无背景
    }).then(canvas => {
      // 转成图片，生成图片地址
      imgUrl = canvas.toDataURL('image/png')
      var eleLink = document.createElement('a')
      eleLink.href = imgUrl // 转换后的图片地址
      eleLink.download = '海报'
      // 触发点击
      document.body.appendChild(eleLink)
      eleLink.click()
      // 然后移除
      document.body.removeChild(eleLink)
    })
  }
  // 下载二维码
  private downloadCode() {
    let opts: any = {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      quality: 0.3,
      margin: 1,
      width: 150
    }
    QRCode.toDataURL(this.spreadList.url, opts, function(err: any, url: any) {
      if (err) throw err
      var eleLink = document.createElement('a')
      eleLink.href = url // 转换后的图片地址
      eleLink.download = '二维码'
      // 触发点击
      document.body.appendChild(eleLink)
      eleLink.click()
      // 然后移除
      document.body.removeChild(eleLink)
    })
  }
  // 生成页面二维码
  private creatQrCode() {
    let container: any = document.getElementById('qrcode')
    container.innerHTML = ''
    let opts: any = {
      errorCorrectionLevel: 'H',
      type: 'image/jpeg',
      quality: 0.3,
      margin: 1,
      width: 150
      // color: {
      //   dark: "#010599FF",
      //   light: "#FFBF60FF"
      // }
    }
    QRCode.toCanvas(this.spreadList.url, opts, function(err: any, canvas: any) {
      if (err) throw err
      container.appendChild(canvas)
    })
  }

  private handleFilter() {
    this.currentPage = 1
    this.getList()
  }

  // 跳转到详情页
  private goDetail(status: string, id: string) {
    this.$router.push({
      name: 'CardConfDetail',
      query: {
        status: status,
        id: id
      }
    })
  }

  private async delAssemble(id: string, state: string) {
    let propsData: any = {
      data: {
        couponId: id
      }
    }
    if (state === '停止') {
      propsData.data.supportReceive = '1'
    } else if (state === '投放') {
      propsData.data.supportReceive = '0'
    } else { // 删除
      const { data } = await deleteCoupon(propsData)
      this.$message({
        message: data.resultInfo,
        type: data.resultCode == 1 ? 'success' : 'warning'
      })
      this.getList()
      return
    }
    const { data } = await updateCoupon(propsData)
    this.$message({
      message: data.resultInfo,
      type: data.resultCode == 1 ? 'success' : 'warning'
    })
    this.getList()
  }

  // 删除卡券
  private deleteSubmit(row: any, state: string) {
    if (row.currentStatus != 2 && state == '删除') {
      this.$message.error('只能删除失效优惠券!')
      return
    }
    this.$confirm(`确认${state}优惠券?`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        this.delAssemble(row.couponId, state)
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
.card-box {
  .card-img {
    display: inline-block;
    margin-top: 20px;
    width: 360px;
    height: 500px;
    border-radius: 4px;
    .card-content {
      display: inline-block;
      position: absolute;
      margin-top: 80px;
      left: 190px;
      padding: 12px;
      width: 320px;
      height: 400px;
      background-color: #fff;
      border-radius: 6px;
      .card-top {
        color: #fff;
        border-radius: 4px;
        p {
          padding: 12px 0;
          margin: 0;
        }
        h3 {
          margin: 0;
          font-size: 26px;
          font-weight: 700;
        }
      }
      .card-time {
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #ccc;
      }
      .card-down {
        margin-top: 40px;
        p {
          margin: 10px 0;
          font-weight: 600;
        }
      }
    }
  }
}
</style>

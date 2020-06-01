<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        :inline="true"
        :model="listQuery"
        class="demo-form-inline"
      >
        <!-- <el-row>
          <el-col :span="24">
            <el-form-item label="客户来源">
              <el-select
                v-model="listQuery.type"
                placeholder="客户来源"
                clearable
                style="width: 200px"
                class="filter-item"
              >
                <el-option
                  v-for="item in typeList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="会员等级">
              <el-select
                v-model="listQuery.memberId"
                placeholder="会员等级"
                clearable
                style="width: 200px"
                class="filter-item"
              >
                <el-option
                  v-for="item in importanceOptions"
                  :key="item.memberId"
                  :label="item.memberStage"
                  :value="item.memberId"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>-->
        <el-row>
          <el-col :span="24">
            <el-form-item label="注册时间">
              <el-date-picker
                v-model="registerTime"
                type="daterange"
                :picker-options="pickerOptions"
                range-separator="-"
                :start-placeholder="$t('search.startTime')"
                :end-placeholder="$t('search.endTime')"
                :default-time="['00:00:00', '23:59:59']"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                align="right"
              />
            </el-form-item>
            <el-form-item label="会员等级">
              <el-select
                v-model="listQuery.customerMemberLevel"
                placeholder="会员等级"
                clearable
                style="width: 200px"
                class="filter-item"
              >
                <el-option
                  v-for="item in importanceOptions"
                  :key="item.customerLevelId"
                  :label="'VIP'+item.customerMemberLevel"
                  :value="item.customerMemberLevel"
                />
              </el-select>
            </el-form-item>
            <el-form-item label>
              <el-input
                v-model="listQuery.keyWord"
                placeholder="客户昵称/手机号"
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
          </el-col>
        </el-row>
      </el-form>
    </div>
    <div class="other-operate-btn">
      <el-button
        type="primary"
        icon="el-icon-s-ticket"
        @click="canUseCoupon()"
      >
        {{ $t('table.batch') +$t('table.issuingVoucher') }}
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
      @selection-change="handleSelectionChange"
    >
      <el-table-column
        align="center"
        label="选择"
        type="selection"
        width="55"
      />
      <el-table-column
        label="客户昵称"
        prop="nickname"
        align="center"
        width="180"
      />
      <el-table-column
        label="客户头像"
        align="center"
      >
        <template slot-scope="{row}">
          <el-image
            style="width: 40px"
            :src="row.headImage"
            :preview-src-list="[row.headImage]"
          />
        </template>
      </el-table-column>
      <!-- <el-table-column label="客户来源" min-width="150px" prop="typeName" align="center"></el-table-column> -->
      <el-table-column
        label="会员等级"
        width="120px"
        prop="customerMemberName"
        align="center"
      />
      <el-table-column
        label="可用卡券数量"
        width="110px"
        prop="couponNum"
        align="center"
      />
      <el-table-column
        label="消费金额"
        prop="consumption"
        align="center"
      />
      <el-table-column
        label="注册时间"
        prop="insTime"
        align="center"
      />
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="180"
        class-name="fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            @click="goDetail(scope.row)"
          >
            {{ $t('table.details') }}
          </el-button>
          <el-button
            size="mini"
            type="success"
            @click="canUseCoupon(scope.row.customerId)"
          >
            {{ $t('table.issuingVoucher') }}
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
      title="发券"
      class="dialog-issuingVoucher"
      :visible.sync="dialogFormVisible"
    >
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="shipmentList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column
          label="优惠卷"
          prop="couponName"
          align="center"
        />
        <el-table-column
          label="优惠内容"
          prop="content"
          align="center"
        />
        <el-table-column
          label="剩余数量"
          prop="remain"
          align="center"
        />
        <el-table-column
          label="截止时间"
          prop="endTime"
          align="center"
        />
        <el-table-column
          :label="$t('table.actions')"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="success"
              @click="sendCoupon(scope.row)"
            >
              {{ $t('table.issuingVoucher') }}
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
          @click="dialogFormVisible = false"
        >
          {{ $t('table.close') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { cloneDeep } from 'lodash'
import {
  queryCustomerInfo,
  getMemberLevelList,
  canUseCoupon,
  sendCoupon
} from '@/api/customer'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

@Component({
  name: 'CustomerList',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private tableKey = 0;
  private customerId: string = ''; // 保存发券用户ID
  private list = [];
  private shipmentList = [];
  private registerTime = [];
  private multipleSelection: any = [];
  private total: number = 0;
  private listLoading: boolean = true;
  private pageSize: number = 20;
  private currentPage: number = 1;
  private listQuery = {
    endTime: '', // 查询结束时间，可传，yyyy-MM-dd
    keyWord: '', // 手机号和昵称模糊查询，可传
    customerMemberLevel: '', // 会员等级，可传
    // price: "", // 消费金额，可传
    startTime: '' // 查询开始时间，可传，yyyy-MM-dd
    // type: "" // 客户联系（1：微信，2：支付宝，3：百度，4：头条，5：QQ），可传
  };
  private dialogFormVisible: boolean = false;
  private importanceOptions = [];
  private typeList = [
    { value: '1', label: '微信' },
    { value: '2', label: '支付宝' },
    { value: '3', label: '百度' },
    { value: '4', label: '头条' },
    { value: '5', label: 'QQ' }
  ];
  private pickerOptions = {
    shortcuts: [
      {
        text: '昨天',
        onClick(picker: any) {
          const start = new Date(
            new Date(new Date().toLocaleDateString()).getTime()
          )
          const end = new Date(
            new Date(new Date().toLocaleDateString()).getTime()
          )
          start.setTime(start.getTime() - 3600 * 1000 * 24)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '今天',
        onClick(picker: any) {
          const start = new Date(
            new Date(new Date().toLocaleDateString()).getTime()
          )
          const end = new Date(
            new Date(new Date().toLocaleDateString()).getTime()
          )
          end.setTime(end.getTime() + 3600 * 1000 * 24)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近一周',
        onClick(picker: any) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近一个月',
        onClick(picker: any) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
          picker.$emit('pick', [start, end])
        }
      }
    ]
  };

  created() {
    this.getList()
    this.getVipLevel()
  }

  private async getList() {
    this.listLoading = true
    this.registerTime ? (this.listQuery.startTime = this.registerTime[0]) : ''
    this.registerTime ? (this.listQuery.endTime = this.registerTime[1]) : ''
    const { data } = await queryCustomerInfo({
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

  // 获取会员等级
  private async getVipLevel() {
    const { data } = await getMemberLevelList({
      data: {}
    })
    this.importanceOptions = data.data.list
  }

  // 获取优惠券列表
  private async canUseCoupon(id: string) {
    if (id) {
      this.customerId = id
    } else {
      if (this.multipleSelection.length === 0) {
        return this.$message({
          message: '请先勾选客户',
          type: 'warning'
        })
      }
      let ids: any = []
      for (let i = 0; i < this.multipleSelection.length; i++) {
        ids.push(this.multipleSelection[i].customerId)
      }
      this.customerId = ids.join(',')
    }
    const { data } = await canUseCoupon({
      data: { shopId: this.$store.state.user.info.shopid }
    })
    this.shipmentList = data.data
    this.dialogFormVisible = true
  }

  // 优惠券列表
  private async sendCoupon(row: any) {
    const { data } = await sendCoupon({
      data: {
        customerIds: this.customerId, // 客户编号拼接
        couponIds: row.couponId, // "卡券编号",
        employeeId: this.$store.state.user.info.employeeId
      }
    })
    this.postMeg(data.resultCode, data.resultInfo)
    this.getList()
  }

  // 提交请求，后续处理
  private postMeg(code: number, info: string) {
    this.$message({
      message: info,
      type: code == 1 ? 'success' : 'warning'
    })
    this.getVipLevel()
    setTimeout(() => {
      if (code == 1) {
        this.getVipLevel()
        this.dialogFormVisible = false
      }
    }, 1000)
  }

  // 切换商品状态
  private changeStockStatus(e: any) {
    this.getList()
  }

  private handleFilter() {
    this.currentPage = 1
    this.getList()
  }

  // 事件-链接商品详情查看
  private goDetail(row: any) {
    this.$router.push({
      name: 'CustomerListDetail',
      query: {
        id: row.customerId
      }
    })
  }
  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }
}
</script>
<style lang="scss" scoped>
.filter-container .el-form-item {
  margin-bottom: 0;
}

.el-dialog {
  .el-form-item {
    margin-bottom: 8px !important;
  }
  .dialog-pagination {
    text-align: right;
  }
}
</style>

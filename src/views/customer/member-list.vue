<template>
  <div class="app-container">
    <div class="filter-container">
      <i class="el-icon-info" /> 消费满1元=1成长值，建议配置3~5个等级，最多配置10个等级
      <el-button
        size="small"
        style="float:right"
        type="primary"
        @click="openDialogAdd"
      >
        新增
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
    >
      <el-table-column
        label="会员等级"
        prop="customerMemberLevel"
        min-width="100px"
        align="center"
      >
        <template slot-scope="scope">
          <p>VIP{{ scope.row.customerMemberLevel }}</p>
        </template>
      </el-table-column>
      <el-table-column
        label="会员名称"
        prop="customerMemberName"
        width="180px"
        align="center"
      />
      <el-table-column
        label="成长值"
        prop="consumptionSum"
        width="110px"
        align="center"
      />
      <el-table-column
        label="享受折扣"
        prop="discount"
        class-name="status-col"
        width="100"
      >
        <template slot-scope="scope">
          <p>{{ scope.row.discount ? scope.row.discount + '折' : '' }}</p>
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('table.actions')"
        align="center"
        width="230"
        class-name="fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            v-if="scope.row.customerMemberName"
            size="mini"
            type="primary"
            @click="openDialog('编辑',scope.row)"
          >
            编辑
          </el-button>
          <el-button
            v-if="!scope.row.customerMemberName"
            v-show="scope.row.customerMemberLevel==customerMemberLevel"
            size="mini"
            type="warning"
            @click="openDialog('配置',scope.row)"
          >
            配置
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="tips-warning">
      <i class="el-icon-warning" />
      <span class="title">配置前必读：</span>
      <p>1、配置会员等级时，会员等级配置后不可删除，只可编辑和再配置更高的等级。</p>
      <p>2、配置会员成长值时，成长值不能等于或低于上一等级的成长值。</p>
      <p>3、配置会员折扣时，折扣不能等于或高于上一等级的折扣。</p>
      <p>4、编辑会员成长值时，成长值更改会影响已成会员用户的会员等级变化，请谨慎更改。</p>
      <p>5、编辑会员折扣时，更改折扣会影响已成会员用户的会员体验，请谨慎更改。</p>
    </div>
    <el-dialog
      :title="dialogStatus"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="memberList"
        :model="tempArticleData"
        label-position="left"
        label-width="120px"
        style="margin-left:50px;"
        :rules="rules"
      >
        <el-form-item
          label="会员等级："
          prop="customerMemberLevel"
        >
          <span class="level">{{ tempArticleData.customerMemberLevel }}</span>
        </el-form-item>
        <el-form-item
          label="会员名称："
          prop="customerMemberName"
        >
          <el-input
            v-model="tempArticleData.customerMemberName"
            placeholder="最多支持6个字"
          />
        </el-form-item>
        <el-form-item
          label="所需成长值："
          prop="consumptionSum"
        >
          <el-input
            v-model.number="tempArticleData.consumptionSum"
            placeholder="消费满1元=1成长值"
          />
          <span class="input-tips">成长值不能等于或低于上一等级的成长值。</span>
        </el-form-item>
        <el-form-item
          label="享受折扣："
          prop="discount"
        >
          <el-input
            v-model="tempArticleData.discount"
            placeholder="输入0.01-0.99的数字"
          />
          <span class="input-tips">折扣不能等于或高于上一等级的折扣。</span>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          type="primary"
          @click="dialogStatus==='编辑'?updateMemberLevel('memberList'):saveCustomerMember('memberList')"
        >
          {{ $t('table.confirm') }}
        </el-button>
        <el-button
          type
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
import {
  getMemberLevelList,
  updateMemberLevel,
  saveCustomerMember,
  deleteCustomerMember
} from '@/api/customer'
import { formatJson } from '@/utils'
import { Form, Form as ElForm } from 'element-ui'

@Component({
  name: 'MemberList',
  components: {}
})

export default class extends Vue {
  private tableKey = 0;
  private customerMemberLevel: string = ''; // 保存展示配置按钮的等级
  private list: any = [];
  private shipmentList = [];
  private total: number = 0;
  private shipmentTotal = 0;
  private listLoading: boolean = true;
  private dialogFormVisible: boolean = false;
  private dialogStatus: string = '';

  private levelIndex = 0

  private validateDiscount(rule: any, value: any, callback: any) {
    if (this.list.length == 0) {
      callback()
      return
    }

    let reg = /^(\d+|\d+\.\d{1,2})$/
    if (!reg.test(value)) {
      callback(new Error('请输入0.01到9.99的数值!'))
      return
    }
    this.list.forEach((item, index) => {
      if (item.customerMemberLevel == this.levelIndex) { // 编辑
        if (this.levelIndex < this.list.length && index != 0) {
          if (value >= this.list[this.levelIndex - 2].discount) {
            callback(new Error('不能高于上一等级折扣值!'))
          } else if (value <= this.list[this.levelIndex].discount) {
            callback(new Error('不能低于下一等级折扣值!'))
          } else {
            callback()
          }
        } else if (index == 0 && this.list.length >= 1) {
          if (value <= this.list[this.levelIndex].discount) {
            callback(new Error('不能低于下一等级折扣值!'))
          } else {
            callback()
          }
        } else if (this.levelIndex == this.list.length && this.levelIndex != 1) {
          if (value >= this.list[this.levelIndex - 2].discount) {
            callback(new Error('不能高于上一等级折扣值!'))
          } else {
            callback()
          }
        }
      }

      if (this.levelIndex > this.list.length) {
        if (value >= this.list[this.list.length - 1].discount) {
          callback(new Error('不能高于上一等级折扣值!'))
        } else {
          callback()
        }
      }
    })

    // if (value >= this.list[this.list.length-1].discount ? this.list[this.list.length-1].discount : 0 ) {
    //   callback(new Error("不能低于上一等级折扣!"));
    // } else {
    //   callback();
    // }
  }

  private validateSum(rule: any, value: any, callback: any) {
    if (this.list.length == 0) {
      callback()
      return
    }

    this.list.forEach((item, index) => {
      if (item.customerMemberLevel == this.levelIndex) { // 编辑
        if (this.levelIndex < this.list.length && index != 0) {
          // console.log(value,this.list[index-1].consumptionSum,this.list[index+1].consumptionSum)
          if (value <= this.list[this.levelIndex - 2].consumptionSum) {
            callback(new Error('不能低于上一等级成长值!'))
          } else if (value >= this.list[this.levelIndex].consumptionSum) {
            callback(new Error('不能高于下一等级成长值!'))
          } else {
            callback()
          }
        } else if (index == 0 && this.list.length >= 1) {
          if (value >= this.list[this.levelIndex].consumptionSum) {
            callback(new Error('不能高于下一等级成长值!'))
          } else {
            callback()
          }
        } else if (this.levelIndex == this.list.length && this.levelIndex != 1) {
          if (value <= this.list[this.levelIndex - 2].consumptionSum) {
            callback(new Error('不能低于上一等级成长值!'))
          } else {
            callback()
          }
        }
      }
      if (this.levelIndex > this.list.length) {
        if (value <= this.list[this.list.length - 1].consumptionSum) {
          callback(new Error('不能低于上一等级成长值!'))
        } else {
          callback()
        }
      }
    })
    // if (value <= this.list[this.list.length-1].consumptionSum ? this.list[this.list.length-1].consumptionSum : 0 ) {
    //   callback(new Error("不能低于上一等级成长值!"));
    // } else {
    //   callback();
    // }
  }

  private rules = {
    customerMemberLevel: [{ required: true, message: '请输入等级', trigger: 'blur' }],
    customerMemberName: [
      { required: true, message: '请输入会员名称', trigger: 'blur' },
      { max: 6, message: '名称过长' }
    ],
    consumptionSum: [
      { required: true, message: '请输入会员最大成长值', trigger: 'blur' },
      { validator: this.validateSum, trigger: 'blur' },
      { type: 'number', message: '请输入数字' }

    ],
    discount: [
      { required: true, message: '请输入会员折扣', trigger: 'blur' },
      { validator: this.validateDiscount, trigger: 'blur' }
      // { type:'number' , message: "请输入数字"}
    ]
  };
  private tempArticleData = {
    discount: 0, // 折扣，必传
    consumptionSum: 0, // 最大成长值，必传
    customerMemberName: '', // 名称，必传
    customerMemberLevel: '', // 等级，Vip1，Vip2等等，必传
    tenantid: this.$store.state.user.info.tenantid // 租户编号，必传
  };

  created() {
    this.getVipLevel()
  }

  // 获取会员等级
  private async getVipLevel() {
    this.listLoading = true
    const { data } = await getMemberLevelList({
      data: {}
    })
    this.list = data.data.list
    for (let i = 0; i < this.list.length; i++) {
      if (!this.list[i].customerMemberName) {
        this.customerMemberLevel = this.list[i].customerMemberLevel
        break
      }
    }
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
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

  // 删除会员等级
  private async deleteCustomerMember() {
    const { data } = await deleteCustomerMember({
      data: this.tempArticleData
    })
    this.postMeg(data.resultCode, data.resultInfo)
  }

  // 添加会员等级
  private async saveCustomerMember(forms: any) {
    (this.$refs[forms] as ElForm).validate((valid: boolean) => {
      if (valid) {
        saveCustomerMember({
          data: this.tempArticleData
        }).then(res => {
          this.postMeg(res.data.resultCode, res.data.resultInfo)
        })
      } else {
        console.log('error submit!!')
      }
    })
    // const { data } = await saveCustomerMember({
    //   data: this.tempArticleData
    // });
    // this.postMeg(data.resultCode, data.resultInfo);
  }

  private listAdd() {
    // this.saveCustomerMember()
    // let level = Number(this.list[this.list.length-1].customerMemberLevel)+1
    // this.list.push({customerMemberLevel:level})
  }
  // 修改会员等级
  private async updateMemberLevel(forms: any) {
    (this.$refs[forms] as ElForm).validate((valid: boolean) => {
      if (valid) {
        updateMemberLevel({
          data: this.tempArticleData
        }).then(res => {
          this.postMeg(res.data.resultCode, res.data.resultInfo)
        })
      } else {
        console.log('error submit!!')
      }
    })
  }
  private openDialogAdd() {
    let level =this.tempArticleData.customerMemberLevel == '' ? 1 : Number(this.list[this.list.length - 1].customerMemberLevel) + 1
    if (level > 10) {
      this.$message.error('最多配置10个等级!')
      return
    }
    this.tempArticleData = {
      discount: 0, // 折扣，必传
      consumptionSum: 0, // 最大成长值，必传
      customerMemberName: '', // 名称，必传
      customerMemberLevel: '', // 等级，Vip1，Vip2等等，必传
      tenantid: this.$store.state.user.info.tenantid // 租户编号，必传
    }
    this.tempArticleData.customerMemberLevel = level
    this.levelIndex = level
    this.dialogStatus = '配置'
    this.dialogFormVisible = true
  }
  // 打开弹框
  private openDialog(status: string, row: any) {
    this.tempArticleData = JSON.parse(JSON.stringify(row))
    this.dialogStatus = status
    this.levelIndex = row.customerMemberLevel
    this.dialogFormVisible = true
  }
}
</script>
<style lang="scss" scoped>
.filter-container .el-form-item {
  margin-bottom: 0;
}

.el-dialog {
  .el-form-item {
    margin-bottom: 22px !important;
  }
  .dialog-pagination {
    text-align: right;
  }
  .level {
    font-size: 18px;
    font-weight: 700;
  }
  .el-input {
    width: 160px !important;
  }
  .input-tips {
    margin-left: 4px;
  }
}
.el-icon-info {
  color: #1890ff;
}

.tips-warning {
  margin-top: 20px;
  .el-icon-warning {
    color: #ffba00;
  }
  .title {
    display: inline-block;
    margin-left: 4px;
    color: red;
  }
  p {
    font-size: 14px;
    line-height: 14px;
  }
}
</style>

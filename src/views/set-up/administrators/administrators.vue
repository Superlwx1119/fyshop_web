<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        :inline="true"
        :model="listQuery"
        class="demo-form-inline"
      >
        <el-form-item>
          <el-input
            v-model="listQuery.account"
            placeholder="账号"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="listQuery.nickname"
            placeholder="姓名"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label>
          <el-select
            v-model="listQuery.roleId"
            placeholder="角色"
            clearable
            style="width: 200px"
            class="filter-item"
          >
            <el-option
              v-for="item in importanceOptions"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>
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
            @click="handleUpdate('add')"
          >
            {{ $t('table.add') }}
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
      @selection-change="handleSelectionChange"
    >
      <!-- <el-table-column align="center" type="selection" width="55" /> -->
      <el-table-column
        :label="$t('table.id')"
        type="index"
        align="center"
        width="80"
      />
      <el-table-column
        label="账号"
        prop="account"
        align="center"
      />
      <el-table-column
        label="姓名"
        prop="nickname"
        align="center"
      />
      <el-table-column
        label="角色"
        prop="roleName"
        align="center"
      />
      <el-table-column
        label="状态"
        prop="statusName"
        align="center"
      />
      <el-table-column
        label="创建时间"
        prop="insTime"
        align="center"
      />
      <el-table-column
        label="修改时间"
        prop="updTime"
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
            size="mini"
            type="primary"
            @click="handleUpdate('edit',scope.row)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            :disabled="scope.row.disabled"
            @click="editStock(scope.row.employeeId,'det')"
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
    <el-dialog
      :title="textMap[dialogStatus]"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="tempArticleData"
        label-position="left"
        label-width="100px"
        style="width: 300px; margin-left:50px;"
      >
        <el-form-item
          label="账号"
          prop="account"
        >
          <el-input v-model="tempArticleData.account" />
        </el-form-item>
        <el-form-item
          label="密码"
          prop="password"
        >
          <el-input v-model="tempArticleData.password" />
        </el-form-item>
        <el-form-item
          label="姓名"
          prop="nickname"
        >
          <el-input v-model="tempArticleData.nickname" />
        </el-form-item>
        <el-form-item
          label="角色"
          prop="roleId"
        >
          <el-select
            v-model="tempArticleData.roleId"
            placeholder="请选择角色"
            clearable
            style="width: 200px"
            class="filter-item"
          >
            <el-option
              v-for="item in importanceOptions"
              :key="item.roleId"
              :label="item.roleName"
              :value="item.roleId"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="状态"
          prop="status"
        >
          <el-select
            v-model="tempArticleData.status"
            :placeholder="$t('table.type')"
            clearable
            style="width: 200px"
            class="filter-item"
          >
            <el-option
              v-for="item in statusOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogFormVisible = false">
          {{ $t('table.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="submitForm('dataForm')"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { Form, Form as ElForm } from 'element-ui'
import { getGoodsList, deleteGood, listGoodsType } from '@/api/commodity'
import {
  getEmployeeList,
  saveEmployee,
  deleteEmployee,
  getEmployee,
  getRoleList
} from '@/api/users'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce(
  (acc: { [key: string]: string }, cur) => {
    acc[cur.key] = cur.display_name
    return acc
  },
  {}
) as { [key: string]: string }

@Component({
  name: 'Adminsistrators',
  components: {
    Pagination
  },
  filters: {
    typeFilter: (type: string) => {
      return calendarTypeKeyValue[type]
    }
  }
})
export default class extends Vue {
  private tableKey = 0;
  private list = [];
  private total: number = 0;
  private listLoading = true;
  private pageSize: number = 20;
  private currentPage: number = 1;
  private listQuery = {
    roleId: '',
    nickname: '',
    account: ''
  };
  // status:列表查询状态   msg:弹框消息提示; stockEmptyFlag:查询售罄商品字段; setStatus:提交上架下架状态
  private statusOptions = [
    { value: 0, label: '启用' },
    { value: 1, label: '停用' }
  ];
  private importanceOptions = [];
  private calendarTypeOptions = calendarTypeOptions;
  private multipleSelectArr = [];
  private downloadLoading = false;
  private dialogFormVisible = false;
  private dialogStatus = '';
  private tempArticleData: any = {};
  private setPassword: any = { pass: '', checkPass: '' };
  private textMap = {
    edit: '编辑',
    add: '新增',
    set: '修改密码'
  };
  private rules = {
    account: [
      { required: true, message: '请输入账号', trigger: 'blur' },
      { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
    ],
    nickname: [
      { required: true, message: '请输入姓名', trigger: 'blur' },
      { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
    ],
    roleId: [{ required: true, message: '请选择角色', trigger: 'change' }],
    status: [{ required: true, message: '请选择状态', trigger: 'change' }]
  };

  created() {
    this.getList()
    this.getRole()
  }

  private async getList() {
    this.listLoading = true
    const { data } = await getEmployeeList({
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

  // 获取角色
  private async getRole() {
    this.listLoading = true
    const { data } = await getRoleList({
      data: { shopId: this.$store.state.user.info.shopId },
      currentPage: 1,
      pageSize: 100
    })
    this.importanceOptions = data.data.list
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
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
    this.$router.push({
      name: 'CommodityListDetail',
      query: {
        status: status,
        goodsId: id
      }
    })
  }

  private handleUpdate(status: string, row: any) {
    this.tempArticleData = {}
    status == 'edit' && (this.tempArticleData = Object.assign({}, row))
    this.tempArticleData.shopid = this.$store.state.user.info.shopid
    this.tempArticleData.tenantid = this.$store.state.user.info.tenantid
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })

    this.dialogStatus = status
    this.dialogFormVisible = true
  }

  // 编辑列表状态
  private editStock(id: any, status: string) {
    let msg = status == 'det' ? '删除' : ''
    this.$confirm(`确认${msg}该员工?`, '提示', {
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
      this.deleteEmployee(id)
    } else {
      // this.shelfGood(id);
    }
  }

  // 新增请求提交,编辑加上employeeid就行
  private async saveEmployee() {
    const { data } = await saveEmployee({
      data: this.tempArticleData
    })
    this.postMeg(data.resultCode, data.resultInfo)
  }

  // 事件-提交表单
  private submitForm(goodsAllInfo: any) {
    (this.$refs[goodsAllInfo] as ElForm).validate((valid: boolean) => {
      if (valid) {
        this.saveEmployee()
      } else {
        return false
      }
    })
  }
  // 提交请求，后续处理
  private postMeg(code: number, info: string) {
    this.$message({
      message: info,
      type: code == 1 ? 'success' : 'warning'
    })
    this.dialogFormVisible = false
    this.getList()
  }
  // 删除员工
  private async deleteEmployee(id: any) {
    const propsData = {
      data: {
        id: id,
        shopId: this.$store.state.user.info.shopId,
        status: '-1'
      }
    }
    await deleteEmployee(propsData).then(res => {
      this.getList()
    }) // 刷新数据
    this.$message({
      message: '删除成功',
      type: 'success'
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

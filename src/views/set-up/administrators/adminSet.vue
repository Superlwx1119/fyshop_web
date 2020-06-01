<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form
        :inline="true"
        :model="listQuery"
        class="demo-form-inline"
      >
        <!-- <el-form-item label>
          <el-input
            v-model="listQuery.roleName"
            placeholder="角色名"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item> -->
        <el-form-item>
          <!-- <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >{{ $t('table.search') }}</el-button> -->
          <el-button
            class="filter-item"
            style="margin-left: 10px;"
            type="primary"
            icon="el-icon-circle-plus-outline"
            @click="handleCreateRole()"
          >
            {{ $t('table.add') }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-table
      :data="adminList"
      style="width: 80%;"
      border
    >
      <el-table-column
        align="center"
        label="序号"
        type="index"
        width="120"
      />
      <el-table-column
        align="center"
        prop="account"
        label="手机号"
      />
      <el-table-column
        align="center"
        prop="nickname"
        label="昵称"
      />
      <!-- <el-table-column
        align="center"
        prop="mobile"
        label="登录手机号"
      /> -->
      <el-table-column
        align="center"
        prop="insTime"
        label="创建时间"
      />
      <el-table-column
        align="center"
        prop="upDateTime"
        label="上次修改时间"
      />
      <!-- <el-table-column align="center" prop="roleName" label="角色名称" /> -->
      <el-table-column
        align="center"
        label="操作"
        width="220"
      >
        <template slot-scope="scope">
          <el-button
            type="primary"
            size="small"
            @click="handleEdit(scope)"
          >
            编辑
          </el-button>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(scope)"
          >
            {{ $t('permission.delete') }}
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
      :visible.sync="dialogVisible"
      :title="dialogType==='edit'?'编 辑':'新 增'"
    >
      <el-form
        :model="role"
        label-width="100px"
        label-position="left"
      >
        <el-form-item label="手机号">
          <el-input
            v-model="role.account"
            placeholder="手机号"
          />
        </el-form-item>
        <el-form-item label="昵称">
          <el-input
            v-model="role.nickname"
            placeholder="昵称"
          />
        </el-form-item>
        <!-- <el-form-item label="登录手机号">
          <el-input
            v-model="role.mobile"
            placeholder="登录手机号"
          />
          <el-button
            v-if="!setWord"
            size="small"
            style="margin-top:5px"
            type="primary"
            @click="setWord = true"
          >
            修改密码
          </el-button>
        </el-form-item>
        <el-form-item
          v-if="dialogType==='edit' && setWord"
          label="修改密码"
        >
          <el-input
            v-model="role.newWord"
            type="password"
            placeholder="新密码"
          />
          <el-button
            size="small"
            style="margin-top:5px"
            type="danger"
            @click="setWord = false"
          >
            取消修改
          </el-button>
        </el-form-item> -->
        <!-- <el-form-item
          v-if="dialogType==='new'"
          label="登录密码"
        >
          <el-input
            v-model="role.password"
            type="password"
            placeholder="登录密码"
          />
        </el-form-item> -->
        <el-form-item label="权限">
          <!-- <el-tree
            ref="tree"
            :data="routesTreeData"
            :props="defaultProps"
            show-checkbox
            node-key="path"
            class="permission-tree"
          /> -->
          <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
          <div style="margin: 15px 0;"></div>
          <el-checkbox-group v-model="role.powerListId" @change="handleCheckedCitiesChange">
            <el-checkbox v-for="item in role.powerListName" :label="item" :key="item">{{item}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <div style="text-align:right;">
        <el-button
          type="danger"
          @click="dialogVisible=false"
        >
          {{ $t('permission.cancel') }}
        </el-button>
        <el-button
          type="primary"
          @click="confirmRole"
        >
          {{ $t('permission.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import path from 'path'
import { cloneDeep } from 'lodash'
import { Component, Vue } from 'vue-property-decorator'
import { getGoodsList, deleteGood, listGoodsType } from '@/api/commodity'
import { RouteConfig } from 'vue-router'
import { Tree } from 'element-ui'
import { AppModule } from '@/store/modules/app'
import Pagination from '@/components/Pagination/index.vue'
import { defaultRole } from '@/api/roles'
import { getEmployeeList , getShopPower , saveEmployee, deleteEmployee, getEmployeePower, getRoleList, saveRole, delRole, getRole } from '@/api/users'

interface RoutesTreeData {
  children: RoutesTreeData[];
  title: string;
  path: string;
}

@Component({
  name: 'AdminSet',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private role = Object.assign({}, defaultRole);
  private reshapedRoutes: RouteConfig[] = [];
  private serviceRoutes: RouteConfig[] = [];
  private currentNode = '';
  private setWord = false;
  private adminList: any = [];
  private dialogVisible = false;
  private dialogType = 'new';
  private checkStrictly = false;
  private defaultProps = {
    children: 'children',
    label: 'title'
  };
  private listQuery = {
    shop_id: this.$store.state.user.info.shopid,
    roleName: ''
  };
  private total: number = 0;
  private pageSize: number = 20;
  private currentPage: number = 1;
  get routesTreeData() {
    return this.generateTreeData(this.reshapedRoutes)
  }

  created() {
    // Mock: get all routes and roles list from server
    this.getRoutes()
    this.getList()
  }

  private getRoutes() {
    this.serviceRoutes = this.role.routes
    this.reshapedRoutes = this.reshapeRoutes(this.role.routes)
  }

  private async getShopPower(){
    const { data } = await getShopPower({
      data:{shopId:this.$store.state.user.info.shopId}
    })
    data.data.powerListName = []
    data.data.powerListId = []
    data.data.powerRoutes = []
    data.data.forEach(item=>{
      if(item.checked === true){
        data.data.powerListId.push(item.powerName)
      }
      data.data.powerListName.push(item.powerName)
    })
    this.role = {
      account : '',
      employeeId : '',
      nickname : '',
      powerListId : [],
      powerRoutes:[],
      powerListName : data.data.powerListName,
      powerList : data.data
    }
    // this.role.powerListId = data.data.powerListName
    // this.role.powerListName = data.data.powerListName
  }

  private async getList() {
    // const { data } = await getRoles({
    //   /* Your params here */
    // });
    // this.adminList = data.items;
    const { data } = await getEmployeeList({
      data: this.listQuery,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    })
    this.adminList = data.data.list
  }

  private isIndeterminate = true
  private checkAll = false

  private handleCheckAllChange(val) {
    this.role.powerRoutes = val ? this.role.powerListName : [];
    this.isIndeterminate = false;
  }

  private handleCheckedCitiesChange(value){
    let checkedCount = value.length;
    this.checkAll = checkedCount === this.role.powerListName.length;
    this.isIndeterminate = checkedCount > 0 && checkedCount < this.role.powerListName.length;
  }

  private generateTreeData(routes: RouteConfig[]) {
    const data: RoutesTreeData[] = []
    for (let route of routes) {
      const tmp: RoutesTreeData = {
        children: [],
        title: '',
        path: ''
      }
      tmp.title = this.$t(`route.${route.meta.title}`).toString()
      tmp.path = route.path
      if (route.children) {
        tmp.children = this.generateTreeData(route.children)
      }
      data.push(tmp)
    }
    return data
  }
  private handleFilter() {
    this.currentPage = 1
    this.getList()
  }
  // Reshape the routes structure so that it looks the same as the sidebar
  private reshapeRoutes(routes: RouteConfig[], basePath = '/') {
    const reshapedRoutes: RouteConfig[] = []
    for (let route of routes) {
      // Skip hidden routes
      if (route.meta && route.meta.hidden && !route.meta.beShow) {
        continue
      }
      const onlyOneShowingChild = this.onlyOneShowingChild(
        route.children,
        route
      )
      if (
        route.children &&
        onlyOneShowingChild &&
        (!route.meta || !route.meta.alwaysShow)
      ) {
        route = onlyOneShowingChild
      }
      const data: RouteConfig = {
        path: path.resolve(basePath, route.path),
        meta: {
          title: route.meta && route.meta.title,
          canBeShow: route.meta.canBeShow ? route.meta.canBeShow : false
        }
      }
      // Recursive generate child routes
      if (route.children) {
        data.children = this.reshapeRoutes(route.children, data.path)
      }
      reshapedRoutes.push(data)
    }
    return reshapedRoutes
  }

  private flattenRoutes(routes: RouteConfig[]) {
    let data: RouteConfig[] = []
    routes.forEach(route => {
      if (route.meta.canBeShow) {
        data.push(route)
      }
      if (route.children) {
        const temp = this.flattenRoutes(route.children)
        if (temp.length > 0) {
          data = [...data, ...temp]
        }
      }
    })
    return data
  }

  private handleCreateRole() {
    
    // this.role = Object.assign({}, defaultRole)
    // if (this.$refs.tree) {
    //   (this.$refs.tree as Tree).setCheckedKeys([])
    // }
    this.getShopPower()
    this.dialogType = 'new'
    
    this.dialogVisible = true
  }

  private async getEmployeePower(id) {
    const { data } = await getEmployeePower({
      data: { employeeId: id }
    })
    data.data.powerListName = []
    data.data.powerListId = []
    data.data.powerRoutes = []
    data.data.powerList.forEach(item=>{
      if(item.checked === true){
        data.data.powerListId.push(item.powerName)
      }
      data.data.powerListName.push(item.powerName)
    })
    if(data.data.powerListId.length == data.data.powerList.length){
      data.data.powerListId = data.data.powerListName
      this.checkAll = true
    }
    this.role = cloneDeep(data.data)
    console.log(this.role)
    return
    this.$nextTick(() => {
      const routes = this.flattenRoutes(this.reshapeRoutes(JSON.parse(this.role.powerRoutes)))
      const treeData = this.generateTreeData(routes)
      const treeDataKeys = treeData.map(t => t.path);
      (this.$refs.tree as Tree).setCheckedKeys(treeDataKeys)
      // set checked state of a node not affects its father and child nodes
      this.checkStrictly = false
    })
  }

  private handleEdit(scope: any) {
    this.dialogType = 'edit'
    this.dialogVisible = true
    this.checkStrictly = true
    this.getEmployeePower(scope.row.employeeId)
  }

  private handleDelete(scope: any) {
    const { $index, row } = scope
    this.$confirm('确认删除该员工?', 'Warning', {
      confirmButtonText: '确认',
      cancelButtonText: '关闭',
      type: 'warning'
    })
      .then(async() => {
        const { data } = await deleteEmployee({ data: { id: row.employeeId } })
        this.postMeg(data.resultCode, data.resultInfo)
      })
      .catch(err => {
        console.error(err)
      })
  }

  private generateTree(
    routes: RouteConfig[],
    basePath = '/',
    checkedKeys: string[]
  ) {
    const res: RouteConfig[] = []
    for (const route of routes) {
      const routePath = path.resolve(basePath, route.path)
      // recursive child routes
      if (route.children) {
        route.children = this.generateTree(
          route.children,
          routePath,
          checkedKeys
        )
      }
      if (checkedKeys.includes(routePath)) {
        route.meta.canBeShow = true
      }
      if (route.redirect && route.children.length == 1 && routePath + routePath == route.children[0].path) {
        if (checkedKeys.includes(routePath + routePath)) {
          route.meta.canBeShow = true
        }
      }
      res.push(route)
    }
    return res
  }

  private async confirmRole() {
    const isEdit = this.dialogType === 'edit'
    // const checkedKeys = (this.$refs.tree as Tree).getCheckedKeys()
    // this.role.routes = this.generateTree(
    //   cloneDeep(this.serviceRoutes),
    //   '/',
    //   checkedKeys
    // )
    if (this.setWord && this.dialogType === 'edit') {
      this.role.password = this.role.newWord
    }
    if (!this.setWord && this.dialogType === 'edit') {
      this.role.password = ''
    }
    this.role.shop_id = this.$store.state.user.info.shopId
    // this.role.powerRoutes = JSON.stringify(this.role.routes)
    this.role.powerList.forEach(item=>{
      this.role.powerListId.forEach(v=>{
        if(item.powerName == v){
          this.role.powerRoutes.push(item.powerId)
        }
      })
    })
    this.role.powerIds = this.role.powerRoutes.toString()
    delete this.role.powerRoutes
    const { data } = await saveEmployee({ data: this.role })
    this.postMeg(data.resultCode, data.resultInfo)
  }

  // 提交请求，后续处理
  private postMeg(code: number, info: string) {
    this.$message({
      message: info,
      type: code == 1 ? 'success' : 'warning'
    })
    this.dialogVisible = false
    this.setWord = false
    this.getList()
  }
  // Reference: src/layout/components/Sidebar/SidebarItem.vue
  private onlyOneShowingChild(
    children: RouteConfig[] = [],
    parent: RouteConfig
  ) {
    let onlyOneChild = null
    const showingChildren = children.filter(
      item => !item.meta || !item.meta.hidden
    )
    // When there is only one child route, the child route is displayed by default
    if (showingChildren.length === 1) {
      onlyOneChild = showingChildren[0]
      onlyOneChild.path = path.resolve(parent.path, onlyOneChild.path)
      return onlyOneChild
    }
    // Show parent if there are no child route to display
    if (showingChildren.length === 0) {
      onlyOneChild = { ...parent, path: '' }
      return onlyOneChild
    }
    return false
  }
}
</script>

<style lang="scss" scoped>
.app-container {
  .roles-table {
    margin-top: 30px;
  }

  .permission-tree {
    margin-bottom: 30px;
  }
}
</style>

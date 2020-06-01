<template>
  <div class="app-container">
    <div class="filter-container">
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        {{ $t('table.add')+ $t('table.type') }}
      </el-button>
      <!-- <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="danger"
        icon="el-icon-delete"
        @click="handleCreate"
      >{{$t('table.batch')+ $t('table.delete') }}</el-button>-->
      <!-- <el-button
        v-waves
        :loading="downloadLoading"
        class="filter-item"
        type="primary"
        icon="el-icon-download"
        @click="handleDownload"
      >{{ $t('table.export') }}</el-button>-->
    </div>
    <el-table
      :key="tableKey"
      ref="dragTable"
      v-loading="listLoading"
      :data="list"
      row-key="sort"
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
        label="分类名称"
        prop="goodsTypeName"
        align="center"
      />
      <el-table-column
        :label="$t('table.actions')"
        width="180"
        align="center"
        class-name="fixed-width"
      >
        <template slot-scope="{row}">
          <el-button
            type="primary"
            size="mini"
            @click="handleUpdate(row)"
          >
            {{ $t('table.edit') }}
          </el-button>
          <el-button
            size="mini"
            type="danger"
            @click="handleModifyStatus(row)"
          >
            {{ $t('table.delete') }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.currentPage"
      :limit.sync="listQuery.pageSize"
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
          label="一级类目"
          prop="levelOne"
        >
          <el-autocomplete
            v-model="tempArticleData.levelOne"
            class="inline-input"
            :fetch-suggestions="querySearchOne"
            placeholder="请输入内容"
            clearable
            @select="handleSelect"
          />
          <!-- <el-input v-model="tempArticleData.typeName" /> -->
        </el-form-item>
        <el-form-item
          v-if="tempArticleData.levelOne"
          label="二级类目"
          prop="levelTwo"
        >
          <el-autocomplete
            v-model="tempArticleData.levelTwo"
            class="inline-input"
            :fetch-suggestions="querySearchTwo"
            placeholder="请输入内容"
            clearable
            @select="handleSelect"
          />
          <!-- <el-input v-model="tempArticleData.typeName" /> -->
        </el-form-item>
        <el-form-item
          v-if="tempArticleData.levelTwo&&tempArticleData.levelOne"
          label="三级类目"
          prop="levelThree"
        >
          <el-autocomplete
            v-model="tempArticleData.levelThree"
            class="inline-input"
            :fetch-suggestions="querySearchThree"
            placeholder="请输入内容"
            clearable
            @select="handleSelect"
          />
          <!-- <el-input v-model="tempArticleData.typeName" /> -->
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
          @click="dialogStatus==='create'?createData():updateData()"
        >
          {{ $t('table.confirm') }}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Form } from 'element-ui'
import {
  listGoodsType,
  getQueryList,
  insertGoodsType,
  deleteGoodsType,
  updateGoodsType,
  saveListType,
  getGoodsType
} from '@/api/commodity'
import { exportJson2Excel } from '@/utils/excel'
import { formatJson } from '@/utils'
import Pagination from '@/components/Pagination/index.vue'
import Sortable from 'sortablejs'

@Component({
  name: 'CommodityClassification',
  components: {
    Pagination
  }
})
export default class extends Vue {
  private tableKey = 0;
  private list = [];
  private total: number = 0;
  private listLoading: boolean = true;
  private listQuery = {
    currentPage: 1,
    pageSize: 20
  };
  private multipleSelection = [];
  private dialogFormVisible: boolean = false;
  private dialogStatus: string = '';
  private textMap = {
    update: '编辑',
    create: '新增'
  };
  private rules = {
    levelOne: [
      { required: true, message: '请选择一级类目', trigger: 'change' }
    ],
    levelTwo: [
      { required: true, message: '请选择二级类目', trigger: 'change' }
    ],
    levelThree: [
      { required: true, message: '请选择三级类目', trigger: 'change' }
    ]
  };
  private downloadLoading = false;
  private tempArticleData = {
    typeName: '',
    typeId: '',
    levelOne: null,
    levelOneList: [],
    levelTwo: null,
    levelTwoList: [],
    levelThree: null,
    levelThreeList: [],
    itemData: {}
  };
  private async getQueryList(id, level) { // 获取类名下拉列表
    if (id) {
      const { data } = await getQueryList({
        data: { goodsCategoryId: id }
      })
      data.data.forEach(item => {
        item.value = item.categoryName
        item.address = item.goodsCategoryId
      })
      if (level == 1) {
        this.levelTwoList = data.data
      } else if (level == 2) {
        this.levelThreeList = data.data
      }
    } else {
      const { data } = await getQueryList({
        data: { goodsCategoryId: '' }
      })
      data.data.forEach(item => {
        item.value = item.categoryName
        item.address = item.goodsCategoryId
      })
      this.levelOneList = data.data
    }
  }

  @Watch('tempArticleData', { deep: true })
  getVisible(newVal, oldVal) {
    if (newVal.levelOne == '') {
      this.tempArticleData.levelTwo = null
      this.tempArticleData.levelThree = null
    } else if (newVal.levelTwo == '') {
      this.tempArticleData.levelThree = null
    }
  }

  private handleSelect(item) { // 选择下拉选项
    if (item.level == 3) {
      this.tempArticleData.itemData = item
      this.getQueryList(item.goodsCategoryId, item.level)
    } else {
      this.getQueryList(item.goodsCategoryId, item.level)
    }
  }

  private levelOneList =[]
  private levelTwoList =[]
  private levelThreeList =[]
  private querySearchOne(queryString, cb) {
    var restaurants = this.levelOneList
    var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
    // 调用 callback 返回建议列表的数据
    cb(results)
  }
  private querySearchTwo(queryString, cb) {
    var restaurants = this.levelTwoList
    var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
    // 调用 callback 返回建议列表的数据
    cb(results)
  }
  private querySearchThree(queryString, cb) {
    var restaurants = this.levelThreeList
    var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants
    // 调用 callback 返回建议列表的数据
    cb(results)
  }

  private createFilter(queryString) {
    return (restaurant) => {
      return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0)
    }
  }
  created() {
    this.getList()
    this.getQueryList(null, null)
  }
  mounted() {
    this.rowDrop()
  }
  private rowDrop() {
    const tbody = this.$refs.dragTable.$el.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
    // const tbody = document.querySelector('.el-table__body-wrapper tbody')
    const _this = this
    Sortable.create(tbody, {
      onEnd({ newIndex, oldIndex }) {
        let currRow = _this.list.splice(oldIndex, 1)[0]
        _this.list.splice(newIndex, 0, currRow)
        currRow.sort = newIndex
        _this.saveType(currRow)
      }
    })
  }

  private async saveType(item) {
    const { data } = await saveListType({
      data: {
        goodsTypeId: item.goodsTypeId,
        goodsTypeName: item.goodsTypeName,
        shopId: this.$store.state.user.info.shopId,
        sort: item.sort
      }
    })
  }

  private async getList() {
    this.listLoading = true
    const { data } = await listGoodsType({
      data: { pageFlag: '1' },
      currentPage: this.listQuery.currentPage,
      pageSize: this.listQuery.pageSize
    })
    this.list = data.data.list
    this.total = data.data.total
    setTimeout(() => {
      this.listLoading = false
    }, 0.5 * 1000)
  }

  private handleFilter() {
    this.listQuery.currentPage = 1
    this.getList()
  }

  private handleModifyStatus(row: any) {
    this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        deleteGoodsType({
          data: {
            goodsTypeId: row.goodsTypeId
          }
        }).then(res => {
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
      .catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
  }

  private handleSelectionChange(val: any) {
    this.multipleSelection = val
  }

  private handleCreate() {
    this.tempArticleData = Object.assign({})
    this.dialogStatus = 'create'
    this.dialogFormVisible = true
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  private createData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        const { data } = await insertGoodsType({
          data: {
            categoryId: this.tempArticleData.itemData.categoryId,
            goodsTypeName: this.tempArticleData.itemData.categoryName
          }
        })
        this.getList()
        this.dialogFormVisible = false
        this.$notify({
          title: '成功',
          message: '新增成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }
  private editRow = []
  private handleUpdate(row: any) {
    getGoodsType({data:{goodsTypeId : row.goodsTypeId}}).then(res=>{
      for(let i=0;i<3;i++){
        switch (i){
          case 0:{
            // this.getQueryList(res.data.data.idOne,1)
            // this.tempArticleData.levelOne = res.data.data.idOne
            this.tempArticleData.levelOne = res.data.data.nameOne
            let item = {
              address:res.data.data.idOne,
              categoryName:res.data.data.nameOne,
              goodsCategoryId:res.data.data.idOne,
              level:1,
              value:res.data.data.nameOne
            }
            this.handleSelect(item)
          };
          break;
          case 1:{
            // this.getQueryList(res.data.data.idTwo,2)
            // this.tempArticleData.levelTwo = res.data.data.idTwo
            this.tempArticleData.levelTwo = res.data.data.nameTwo
            let item = {
              address:res.data.data.idTwo,
              categoryName:res.data.data.nameTwo,
              goodsCategoryId:res.data.data.idTwo,
              level:2,
              value:res.data.data.nameTwo
            }
            this.handleSelect(item)
          };
          break;
          case 2:{
            // this.getQueryList(res.data.data.idThree,3)
            // this.tempArticleData.levelThree = res.data.data.idThree
            this.tempArticleData.levelThree = res.data.data.nameThree
            let item = {
              address:res.data.data.idThree,
              categoryName:res.data.data.nameThree,
              goodsCategoryId:res.data.data.idThree,
              level:3,
              value:res.data.data.nameThree
            }
            this.handleSelect(item)
          };
          break;
        }
        
      }
    })
    // this.tempArticleData = Object.assign({}, row)
    this.dialogStatus = 'update'
    this.dialogFormVisible = true
    this.editRow = row
    this.$nextTick(() => {
      (this.$refs['dataForm'] as Form).clearValidate()
    })
  }

  private updateData() {
    (this.$refs['dataForm'] as Form).validate(async valid => {
      if (valid) {
        console.log(this.editRow,this.tempArticleData)
        return
        const { data } = await updateGoodsType({
          data: {
            categoryId: this.tempArticleData.itemData.categoryId,
            goodsTypeName: this.tempArticleData.itemData.categoryName,
            goodsTypeId: this.editRow.goodsTypeId
          }
        })
        this.getList()
        this.dialogFormVisible = false
        this.editRow = []
        this.$notify({
          title: '成功',
          message: '更新成功',
          type: 'success',
          duration: 2000
        })
      }
    })
  }

  private handleDownload() {
    this.downloadLoading = true
    const tHeader = ['timestamp', 'title', 'type', 'importance', 'status']
    const filterVal = ['timestamp', 'title', 'type', 'importance', 'status']
    const data = formatJson(filterVal, this.list)
    exportJson2Excel(tHeader, data, 'table-list')
    this.downloadLoading = false
  }
}
</script>

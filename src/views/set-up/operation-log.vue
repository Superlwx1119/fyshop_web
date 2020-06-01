<template>
  <div class="app-container">
    <div class="filter-container">
      <el-form :inline="true" :model="listQuery" class="demo-form-inline">
        <el-form-item label="操作内容:">
          <el-input
            v-model="listQuery.message"
            placeholder="操作内容"
            style="width: 200px;"
            class="filter-item"
            @keyup.enter.native="handleFilter"
          />
        </el-form-item>
        <el-form-item label="操作时间:">
          <el-date-picker
            v-model="time"
            type="datetimerange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="handleFilter"
          >{{ $t('table.search') }}</el-button>
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
      <el-table-column label="名称" prop="nickname" width="180" align="center" />
      <el-table-column label="角色" prop="role" width="120" align="center" />
      <el-table-column label="操作时间" prop="ins_time" width="180" align="center" />
      <el-table-column label="操作IP" prop="oper_ip" width="180" align="center" />
      <el-table-column label="操作结果" prop="result" width="120" align="center" />
      <el-table-column label="操作内容" prop="message" align="center" />
    </el-table>

    <pagination
      v-show="total>0"
      :total="total"
      :page.sync="currentPage"
      :currentPage.sync="pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { Form } from "element-ui";
import { getLogList } from "@/api/users";
import Pagination from "@/components/Pagination/index.vue";

@Component({
  name: "OperationLog",
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
    shop_id: this.$store.state.user.info.shopid,
    message: "",
    start_time: "",
    end_time: ""
  };
  private pageSize: number = 20;
  private currentPage: number = 1;
  private time: any[] = [];

  created() {
    this.getList();
  }

  private async getList() {
    this.listLoading = true;
    this.listQuery.start_time = this.time ? this.time[0] : "";
    this.listQuery.end_time = this.time ? this.time[1] : "";
    const { data } = await getLogList({
      data: this.listQuery,
      currentPage: this.currentPage,
      pageSize: this.pageSize
    });
    this.list = data.data.list;
    this.total = data.data.total;
    setTimeout(() => {
      this.listLoading = false;
    }, 0.5 * 1000);
  }

  private handleFilter() {
    this.currentPage = 1;
    this.getList();
  }
}
</script>

<template>
  <div>
    <el-row class="line-chart-search">
      <el-form
        :inline="true"
        :model="listQuery"
        class="demo-form-inline"
      >
        <!-- <el-form-item>
          <el-radio-group v-model="listQuery.day">
            <el-radio-button :label="0">
              今天
            </el-radio-button>
            <el-radio-button :label="1">
              昨天
            </el-radio-button>
            <el-radio-button :label="7">
              近七天
            </el-radio-button>
            <el-radio-button :label="30">
              近三十天
            </el-radio-button>
          </el-radio-group>
        </el-form-item> -->
        <!-- <el-form-item>
          <el-select
            v-model="listQuery.type"
            clearable
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label>
          <el-date-picker
            v-model="time"
            type="daterange"
            :picker-options="pickerOptions"
            range-separator="-"
            :start-placeholder="$t('search.startTime')"
            :end-placeholder="$t('search.endTime')"
            format="yyyy-MM-dd"
            value-format="yyyy-MM-dd"
            align="right"
            @change="tiemChange"
          />
        </el-form-item>
        <el-form-item>
          <el-button
            v-waves
            class="filter-item"
            type="primary"
            icon="el-icon-search"
            @click="search"
          >
            {{ $t('table.search') }}
          </el-button>
        </el-form-item>
      </el-form>
    </el-row>
  </div>
</template>

<script lang="ts">
import { Component, Prop } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'

export interface listQuery {
  day: any;
  type: string;
  startTime: string;
  endTime: string;
}

@Component({
  name: 'LineChartSearch'
})
export default class extends mixins(ResizeMixin) {
  private time: any = [new Date(),new Date()];
  private listQuery: listQuery = {
    day: '',
    type: '',
    startTime: '',
    endTime: ''
  };
  private options = [
    // {
    //   value: "null",
    //   label: "按销售总金额"
    // },
    {
      value: '100',
      label: '按销售金额'
    },
    {
      value: '200',
      label: '按收入总金额'
    }
  ];
  private pickerOptions = {
    shortcuts: [
      {
        text: '今天',
        onClick(picker: any) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime())
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '昨天',
        onClick(picker: any) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 )
          end.setTime(end.getTime() - 3600 * 1000 * 24 )
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
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 29)
          picker.$emit('pick', [start, end])
        }
      },
      {
        text: '最近三个月',
        onClick(picker: any) {
          const end = new Date()
          const start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
          picker.$emit('pick', [start, end])
        }
      }
    ]
  };
  private search() {
    this.$emit('searchData', this.listQuery)
  }
  private tiemChange(e: any) {
    this.listQuery.startTime = this.time[0]
    this.listQuery.endTime = this.time[1]
    this.listQuery.day = ''
  }
}
</script>
<style lang="scss" scoped>
</style>

<template>
  <div class="app-container">
    <div
      v-for="(item,index) of shopList"
      :key="index"
      class="shopItem"
      @click="toTheShop(item)"
    >
      <el-image :src="item.headImage" />
      <p>{{ item.nickname }}</p>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Route } from 'vue-router'
import { Component, Prop, Watch } from 'vue-property-decorator'
import { mixins } from 'vue-class-component'
import ResizeMixin from '@/components/Charts/mixins/resize'
import { UserModule } from '@/store/modules/user'
import { Dictionary } from 'vuex'
// export interface ShopListData {
//   employeeId: string;
//   powerRoutes: any[];
//   nickname: string;
//   shopId:string;
// }
@Component({
  name: 'chooseShops'
})
export default class extends Vue {
  @Prop({ required: true }) private shopList!: any;

  mounted() {

  }
  private redirect?: string;
  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  private otherQuery: Dictionary<string> = {};
  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce(
      (acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      },
      {} as Dictionary<string>
    )
  }

  private toTheShop(row) {
    UserModule.shopLogin(row)
    window.sessionStorage.setItem('shopList', JSON.stringify({ 'data': row }))
    this.$router.push({
      path: this.redirect || '/',
      // path: '/redirect',
      query: this.otherQuery
    })
    this.$router.go(0)
  }
}
</script>

<style lang="scss" scoped>
.app-container {
    min-height: 400px;
    max-height: 700px;
    overflow-y: auto;
        .shopItem{
            cursor: pointer;
            border: 1px solid gray;
            border-radius: 4px;
            float: left;
            display: flex;
            margin: 10px;
            padding: 10px;
            align-items: center;
            width: 200px;
            p{
                margin-left: 10px;
            }
        }
}
</style>

<template>
  <div
    id="freight"
    class="app-container"
  >
      <iframe style="width:100%;height:150vh" v-if="show" :src="urlName" frameborder="0"></iframe>
      <!-- <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="基本信息" name="first">
          <base-message />
        </el-tab-pane>
        <el-tab-pane label="样式主题" name="second">
          <theme-style/>
        </el-tab-pane>
        <el-tab-pane label="体验发布" name="third">
          <push-up />
        </el-tab-pane>
        <el-tab-pane label="微信支付" name="fourth">
          <wx-pay />
        </el-tab-pane>
      </el-tabs> -->
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { getGoodsDetail, updateGoods } from '@/api/commodity'
import { saveShop, getTenantShop } from '@/api/users'
import { formatJson } from '@/utils'
import BaseMessage from './modules/basemessage.vue'
import WxPay from './modules/wxPay.vue'
import PushUp from './modules/pushUp.vue'
import ThemeStyle from './modules/themeStyle.vue'
import { Form, Form as ElForm } from 'element-ui'
import axios from 'axios'
@Component({
  name: 'SmallProgram',
  components: {
    BaseMessage,
    WxPay,
    PushUp,
    ThemeStyle
  }
})
export default class extends Vue {
  private activeName = 'first'
  private urlName = ''
  private url = ''
  private code = ''
  private show = false
  private handleClick(){

  }
  created() {
    // this.getTenantShop()
    sessionStorage.setItem('pass','true')
    if (process.env.NODE_ENV == 'development') {
      // this.urlName = 'http://192.168.103.39:8080/WeappList#/Login?pass=true&code='+this.code
      this.url = 'http://192.168.103.125:15000'
    } else {
      // this.urlName = 'http://21h.csgxcf.com/21h/shop/#/Login?pass=true&code='+this.code
      this.url = 'https://sapp.csgxcf.com/thirdparty_gateway'
    }
    this.getCodeToShop()
  }

  private async getCodeToShop(){
    axios({
      method: 'post',
      url: this.url + '/tenant-server/user/getCodeToShop',
      data:{data:{userId:this.$store.state.user.info.account}}
    }).then(res=>{
      this.code = res.data.data.code
      this.$nextTick(()=>{
        this.show = true
        if (process.env.NODE_ENV == 'development') {
            this.urlName = 'http://192.168.103.39:8080/#/WeappList?pass=true&code='+this.code +'&account='+this.$store.state.user.info.account+'&appid='+this.$route.query.appid+'&appletId='+this.$route.query.appletId
        } else {
          this.urlName = 'https://21h.csgxcf.com/21h/shop/#/WeappList?pass=true&code='+this.code +'&account='+this.$store.state.user.info.account+'&appid='+this.$route.query.appid+'&appletId='+this.$route.query.appletId
        }
      })
    })
  }
}
</script>
<style lang="scss" scoped>

</style>

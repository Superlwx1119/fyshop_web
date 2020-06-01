<template>
  <div class="login-container">
    <div class="login-box df jc-sb">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <div class="title-container">
          <h3 class="title">
            丰赢小程序商城后台
          </h3>
        </div>
        <p>账户登录</p>
        <!-- <el-form-item prop="tenantid">
          <span class="svg-container">
            <img src="./../../images/login_id.png" alt />
          </span>
          <el-input
            ref="tenantid"
            v-model="loginForm.tenantid"
            placeholder="请输入用户ID"
            name="tenantid"
            type="text"
            autocomplete="on"
          />
        </el-form-item> -->
        <el-form-item prop="account">
          <span class="svg-container">
            <img
              src="./../../images/login_name.png"
              alt
            >
          </span>
          <el-input
            ref="account"
            v-model="loginForm.account"
            placeholder="请输入用户名"
            name="account"
            type="text"
            autocomplete="on"
          />
        </el-form-item>

        <!-- <el-form-item prop="password">
          <span class="svg-container">
            <img
              src="./../../images/login_pw.png"
              alt
            >
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="请输入密码"
            name="password"
            autocomplete="on"
            @keyup.enter.native="handleLogin"
          />
          <span
            class="show-pwd"
            @click="showPwd"
          >
            <svg-icon :name="passwordType === 'password' ? 'eye-off' : 'eye-on'" />
          </span>
        </el-form-item> -->
        <el-form-item prop="code">
          <span class="svg-container">
            <img
              src="./../../images/login_pw.png"
              alt
            >
          </span>
          <el-input
            ref="code"
            v-model="loginForm.code"
            placeholder="请输入验证码"
            name="code"
            @keyup.enter.native="handleLogin"
          />
          <el-button
            size="small"
            type="text"
            :disabled="banBtn"
            @click="getCode"
          >
            {{ buttonText }}
          </el-button>
        </el-form-item>
        <el-button
          class="login_button"
          :loading="loading"
          type="primary"
          @click.native.prevent="handleLogin"
        >
          登 录
        </el-button>
      </el-form>
      <div class="login-img">
        <img
          src="./../../images/login_bk2.png"
          alt
        >
      </div>
    </div>
    <el-dialog
      title="选择店铺"
      :visible.sync="dialogVisible"
      width="50%"
    >
      <choose-shops :shop-list="shopList" />
      <!-- <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span> -->
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vuex'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { isValidUsername } from '@/utils/validate'
import chooseShops from './chooseShops.vue'
import { login, logout, sendCode, jumpLogin } from '@/api/users'
import { getToken, setToken, removeToken, getUserInfo, setUserInfo, removeUserInfo } from '@/utils/cookies'
@Component({
  name: 'Login',
  components: { chooseShops }
})
export default class extends Vue {
  private dialogVisible = false
  private buttonText = '获取验证码'
  private validateTenantid = (rule: any, value: string, callback: Function) => {
    // if (!isValidUsername(value)) {
    if (value.length < 1) {
      callback(new Error('请输入用户ID'))
    } else {
      callback()
    }
  };
  private validateUsername = (rule: any, value: string, callback: Function) => {
    // if (!isValidUsername(value)) {
    if (value.length < 1) {
      callback(new Error('请输入用户名'))
    } else {
      callback()
    }
  };
  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 1) {
      callback(new Error('请输入密码'))
    } else {
      callback()
    }
  };
  private loginForm = {
    // account: "admin",
    // password: "111111"
    tenantid: '000001',
    account: '',
    password: '',
    code: ''
  };

  private checkCode(rule:any, value:any, callback:any) {
    let reg = new RegExp('^[0-9]*$')
    if (reg.test(value)) {
      callback()
    } else {
      return callback(new Error('验证码为数字'))
    }
  }
  private loginRules = {
    tenantid: [{ validator: this.validateTenantid, trigger: 'blur' }],
    account: [{ validator: this.validateUsername, trigger: 'blur' }],
    // password: [{ validator: this.validatePassword, trigger: 'blur' }],
    // code :[{type:'number',trigger:'blur',message:'请输入正确验证码'},{required:true,message:'验证码不能为空'}]
    code: [{ required: true, message: '验证码不能为空' }, { validator: this.checkCode }]
  };
  private passwordType = 'password';
  private loading = false;
  private redirect?: string;
  private otherQuery: Dictionary<string> = {};

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

  private getQueryVariable(variable) { // 获取url参数
    var str = window.location.hash.indexOf('?')
    var query = window.location.hash.substring(str + 1, window.location.hash.length)
    var vars = query.split('&')
    for (var i = 0; i < vars.length; i++) {
      var pair = vars[i].split('=')
      if (pair[0] == variable) { return pair[1] }
    }
    return (false)
  }

  created() {
    setTimeout(()=>{
      let jumpLogin = this.getQueryVariable('url')
      let start = jumpLogin && jumpLogin.indexOf('jumpLogin')
      let end = jumpLogin.length
      jumpLogin = jumpLogin.substring(start+24,end)
      sessionStorage.setItem('jumpLogin',jumpLogin)
      if (sessionStorage.getItem('jumpLogin')) {
        this.jumpLogin(sessionStorage.getItem('jumpLogin'))
      }
    },150)
    
  }

  private async jumpLogin(val) {
    jumpLogin(val).then(res => {
      UserModule.setList(res.data.data)
      UserModule.shopLogin(res.data.data)
      window.sessionStorage.setItem('shopList', JSON.stringify(res.data.data))
      // window.sessionStorage.setItem('appid', res.data.data.appid)
      // window.sessionStorage.setItem('appletId', res.data.data.appletId)
      setToken(res.data.data.employeeId)
      setUserInfo(JSON.stringify(res.data.data))
      this.$router.go(0)
      this.$router.push({
        path: '/smallProgram/smallprogram',
        // path: '/redirect',
        query: this.otherQuery
      })
    })
  }

  mounted() {
    if (this.loginForm.tenantid === '') {
      (this.$refs.tenantid as Input).focus()
    } else if (this.loginForm.account === '') {
      (this.$refs.account as Input).focus()
    } else if (this.loginForm.password === '') {
      (this.$refs.password as Input).focus()
    }
  }

  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }

  private timer : any;
  private banBtn = false
  private getCode() {
    this.banBtn = true
    this.buttonText = `60秒后可重新发送`
    UserModule.sendCode(this.loginForm.account).then(res => {
      let time = 60
      this.timer = setInterval(() => {
        if (time > 0) {
          this.banBtn = true
          this.buttonText = `${time}秒后可重新发送`
          time--
        } else {
          clearInterval(this.timer)
          this.buttonText = '获取验证码'
          this.timer = null
          this.banBtn = false
        }
      }, 1000)
      this.$message({
        message: '短信发送成功!',
        type: 'success'
      })
    }).catch(()=>{
      this.buttonText = '获取验证码'
      this.timer = null
      this.banBtn = false
    })
  }

  private shopList = []// 店铺列表

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        // Just to simulate the time of the request
        setTimeout(() => {
          this.loading = false
        }, 1000)
        const { data } = await login({ data: this.loginForm })
        UserModule.setList(data.data)
        window.sessionStorage.setItem('shopList', JSON.stringify(data))
        this.shopList = data.data
        this.dialogVisible = true
        // await UserModule.LoginOnline(this.loginForm);
        // this.$router.push({
        //   // path: this.redirect || '/',
        //   path: '/',
        //   query: this.otherQuery
        // })
      } else {
        return false
      }
    })
  }

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
}
</script>

<style lang="scss">
.login-container {
  background-image: url(./../../images/login_bk.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  -moz-background-size: 100% 100%;

  .el-input {
    display: inline-block;
    height: 47px;
    width: 59%;

    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px rgba(255, 255, 255, 1) inset !important;
        -webkit-text-fill-color: #454545 !important;
      }
    }
  }

  .el-form-item {
    background: rgba(255, 255, 255, 1);
    border: 1px solid rgba(217, 217, 217, 1);
    opacity: 1;
    border-radius: 4px;
    color: #454545;
  }
  .login_button {
    width: 100%;
    height: 48px;
    margin-bottom: 30px;
    background: rgb(248, 104, 31);
    border-color: rgb(248, 104, 31);
    font-size: 20px;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: $loginBg;
  .login-box {
    position: relative;
    width: 1080px;
    height: 650px;
    margin: 140px auto;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
    opacity: 1;
    border-radius: 10px;
    z-index: 3;
    .login-form {
      position: relative;
      padding-top: 120px;
      width: 320px;
      height: 650px;
      background: rgba(255, 255, 255, 1);
      opacity: 1;
      border-radius: 10px 0px 0px 10px;
      margin: 0 auto;
      overflow: hidden;
      .title {
        font-size: 35px;
        font-weight: bold;
        line-height: 24px;
        color: rgba(51, 51, 51, 1);
      }
      p {
        padding-left: 4px;
        font-size: 18px;
        font-weight: 500;
        line-height: 23px;
        color: rgba(0, 0, 0, 0.65);
      }
    }
    .login-img {
      display: inline-block;
      margin-right: 80px;
      width: 526px;
      height: 405px;
    }
    &:after {
      content: "";
      position: absolute;
      left: 80px;
      bottom: -60px;
      width: 920px;
      height: 60px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 0.1;
      border-radius: 0 0 10px 10px;
    }
    &:before {
      content: "";
      position: absolute;
      left: 50px;
      bottom: -30px;
      width: 980px;
      height: 30px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 3px 6px rgba(0, 0, 0, 0.16);
      opacity: 0.4;
      border-radius: 0 0 10px 10px;
    }
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>

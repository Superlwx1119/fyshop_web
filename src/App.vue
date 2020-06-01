<template>
  <div id="app">
    <!-- 每次跳转页面刷新 -->
    <!-- <router-view :key="$route.path" /> -->
    <router-view />
    <service-worker-update-popup />
    <audio
      id="audio"
      ref="audio"
      hidden
      controls
      preload="auto"
    >
      <source
        src="@/assets/tips.mp3"
        type="audio/mpeg"
      >
    </audio>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ServiceWorkerUpdatePopup from '@/pwa/components/ServiceWorkerUpdatePopup.vue'
import { getUserInfo } from '@/utils/cookies'
@Component({
  name: 'App',
  components: {
    ServiceWorkerUpdatePopup
  }
})
export default class extends Vue {
  private showAudio = true ;
  private websocket : Object;
  private audio : any;
  private play() {
    if (this.audio.played) {
      this.audio.load()
    }
    this.audio.play()
  }

  
  created(){
    
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

  private initWebSocket() { // 初始化weosocket
    let paramOne = 'order'
    let paramTwo = getUserInfo().shopId
    let paramThree = 'newOrder'

    let wsuri = '' // ws地址
    if (process.env.NODE_ENV == 'development') {
      wsuri = 'ws://192.168.103.62:17100/websocket-server/websocket/' + paramOne + '/' + paramTwo + '/' + paramThree
    } else {
      wsuri = window.location.origin.replace(/^https?/, 'wss') + '/websocket-server/websocket/' + + paramOne + '/' + paramTwo + '/' + paramThree
    }
    this.websocket = new WebSocket(wsuri)
    this.websocket.onopen = this.websocketonopen

    this.websocket.onerror = this.websocketonerror

    this.websocket.onmessage = this.websocketonmessage
    this.websocket.onclose = this.websocketclose
  }

  private websocketonopen() {
    console.log('WebSocket连接成功')
  }
  private websocketsend(agentData) { // 数据发送
    this.websocket.send(agentData)
  }
  private websocketonerror(e) { // 错误
    console.log('WebSocket连接发生错误')
  }
  private websocketonmessage(e) { // 数据接收
    if (e.data == '') {
      this.$notify({
        title: '提示',
        message: '有新订单请及时处理',
        type: 'success'
      })
      this.play()
      // this.audio.played.start(0)
    }
    return
    const redata = JSON.parse(e.data)
    // 注意：长连接我们是后台直接1秒推送一条数据，
    // 但是点击某个列表时，会发送给后台一个标识，后台根据此标识返回相对应的数据，
    // 这个时候数据就只能从一个出口出，所以让后台加了一个键，例如键为1时，是每隔1秒推送的数据，为2时是发送标识后再推送的数据，以作区分
    if (redata.code == '200') {
      // this.getNotification();
    } else {

    }
  }
  private websocketclose(e) { // 关闭
    console.log('connection closed (' + e.code + ')')
  }

  private setPlay() {
    this.audio = this.$refs.audio
  }

  destroy() {
    this.websocket = null
  }

  mounted() {
    this.setPlay()
    this.initWebSocket()
  }
}
</script>

<style >
  .el-image-viewer__close{
    color: white !important;
  }
</style>

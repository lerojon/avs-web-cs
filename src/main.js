import Vue from 'vue'

import 'normalize.css/normalize.css'// A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/zh-CN' // lang i18n
import VCharts from 'v-charts'


import App from './App'
import router from './router'
import store from './store'

// global file like css components js 这些文件会全局调用
import '@/styles/index.scss' // global css 
import '@/icons' // global icon
import '@/permission' //global permission control 
import simulate from '../static/json/simulate'
// 导入框架文件
Vue.prototype.$simulate = simulate


//视频预览

import VideoPlayer from 'vue-video-player'
require('video.js/dist/video-js.css')
require('vue-video-player/src/custom-theme.css')
Vue.use(VideoPlayer)

//视频预览

Vue.use(ElementUI, { locale })
Vue.use(VCharts)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

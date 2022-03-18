import router from './router'
import store from './store'
import NProgress from 'nprogress' // Progress 进度条
import 'nprogress/nprogress.css'// Progress 进度条样式
import { Form, Message } from 'element-ui'
import { getToken } from '@/utils/auth' // 验权

const whiteList = ['/avs/login'] // '/avs',不重定向白名单
// const whiteList = ['/home'] // 不重定向白名单

router.beforeEach((to,from,next)=>{
    NProgress.start()
    if (getToken()) {
      store.dispatch('RouterList')
      next()
    /*  if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if(store.getters.addRouters.length === 0){
 
        store.dispatch('GenerateRoutes').then(() => { // 生成可访问的路由表
          
            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表(注入路由)
            next({ ...to, replace: true }) //replace: true --》 这里是防止router.addRoutes 未添加完路由 用户点击浏览器的回退按钮 、整句的作用是防止路由未加载完成页面出现空白页
        })
      }else{
        next() //路由出口，如果没有正确的路由出口，路由导航会进入死循环，栈溢出
      }
     
     
    }  */
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
        console.log('white')
      next()
    } else {
        next(`/avs/login`)
    //   next()
      NProgress.done()
    }
  }
})
 /* router.beforeEach((to, from, next) => {
  NProgress.start()
  if (getToken()) {
     if (to.path === '/login' ) {
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      
      if (store.getters.addRouters.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          let menus=res.data;
          let username=res.data.staff;
          store.dispatch('GenerateRoutes', { menus,username }).then(() => { // 生成可访问的路由表
            
            router.addRoutes(store.getters.addRouters); // 动态添加可访问路由表
            next({ ...to, replace: true })
          })
        }).catch((err) => {
          store.dispatch('FedLogOut').then(() => {
            Message.error(err || '验证失败,请重新登录')
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    } 
  } else {
    // 登录
    if(whiteList.indexOf(to.path) !== -1){
        next()
        
    }else{
      // 其他页面
      next('/login')
      NProgress.done()
    }
  }
})  */

router.afterEach(() => {
  NProgress.done() // 结束Progress
})

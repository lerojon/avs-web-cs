import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'



/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, sysswise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
  }
 **/
export const constantRouterMap = [
  {path: '/avs/login', component: () => import('@/views/login/index'), hidden: true}, // /avs
  // {path: '/404', component: () => import('@/views/404'), hidden: true},
  {
    path: '',
    // name: 'avs',
    component: Layout,
    redirect: '/avs',
    children: [{
      path: 'avs',
      name: 'avs',
      component: () => import('@/views/home/index'),
      meta: {title: '模板管理', icon: 'AWS_mode'}
    },
    {
      path: '/avs/templateList',
      name: 'templateList',
      component: () => import('@/views/home/child-page/template-list'),
      meta: {title: '模板列表'},
      hidden:true
    },
    {
      path: '/avs/templateConf',
      name: 'templateConf',
      redirect: '/avs/templateConf/moduleEdit',
      component: () => import('@/views/home/child-page/template-conf'),
      meta: {title: '模板配置'},
      hidden:true,
      children:[
        {
          path: 'moduleEdit',
      name: 'moduleEdit',
      component: () => import('@/views/home/child-page/module-edit'),
      meta: {title: '模块编辑'},
      hidden:true
        },
        {
            path: 'moduleMerge',
        name: 'moduleMerge',
        component: () => import('@/views/home/child-page/module-merge'),
        meta: {title: '模块复核'},
        hidden:true
          }
      ]
    },
    {
        path: '/avs/itemEdit',
        name: 'itemEdit',
        component: () => import('@/views/home/child-page/item-edit'),
        meta: {title: '模块配置'},
        hidden:true
      },
      {
        path: '/avs/videoPreview',
        name: 'videoPreview',
        component: () => import('@/views/home/child-page/video-preview'),
        meta: {title: '视频预览'},
        hidden:true
      },
  
  ]
  }
]

export const asyncRouterMap = [
  {path: '*', redirect: '/404', hidden: true}
]

export default new Router({
  mode: 'history', //后端支持可开 无#
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})


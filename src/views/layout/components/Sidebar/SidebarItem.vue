<template>
  <div class="menu-wrapper">
    <!-- <template>
      <router-link to="/home" >
        <el-menu-item  class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon  icon-class="item.children[0].meta.icon"></svg-icon>
          <span  slot="title">首页</span>
        </el-menu-item>
      </router-link>
    </template>-->
    <template v-for="item in routes" v-if="!item.hidden&&item.children">
      <!-- <div
        v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow"
        :key="item.children[0].name"
        class="a_style"
      >
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </div>-->
      <!-- <router-link
        v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow"
        :to="item.path+'/'+item.children[0].path"
        :key="item.children[0].name"
        class="a_style"
      >
        <el-menu-item :index="item.path+'/'+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>item.path+item.children[0].path-->
      <router-link
        v-if="hasOneShowingChildren(item.children) && !item.children[0].children&&!item.alwaysShow"
        to="/"
        :key="item.children[0].name"
        class="a_style"
      >
        <el-menu-item :index="item.path+item.children[0].path" :class="{'submenu-title-noDropdown':!isNest}">
          <svg-icon v-if="item.children[0].meta&&item.children[0].meta.icon" :icon-class="item.children[0].meta.icon"></svg-icon>
          <span v-if="item.children[0].meta&&item.children[0].meta.title" slot="title">{{item.children[0].meta.title}}</span>
        </el-menu-item>
      </router-link>

      <el-submenu v-else :index="item.name||item.path" :key="item.name">
        <template slot="title">
          <svg-icon v-if="item.meta&&item.meta.icon" :icon-class="item.meta.icon"></svg-icon>
          <span v-if="item.meta&&item.meta.title" slot="title">{{item.meta.title}}</span>
        </template>

        <template v-for="child in item.children" v-if="!child.hidden">
          <!-- 具名组件，自己调自己 -->
          <sidebar-item
            :is-nest="true"
            class="nest-menu"
            v-if="child.children&&child.children.length>0"
            :routes="[child]"
            :key="child.path"
          ></sidebar-item>

          <router-link v-else :to="item.path+'/'+child.path" :key="child.name">
            <el-menu-item :index="item.path+'/'+child.path">
              <svg-icon v-if="child.meta&&child.meta.icon" :icon-class="child.meta.icon"></svg-icon>
              <span v-if="child.meta&&child.meta.title" slot="title">{{child.meta.title}}</span>
            </el-menu-item>
          </router-link>
        </template>
      </el-submenu>
    </template>
  </div>
</template>

<script>
import { constantRouterMap } from '@/router/index'
export default {
  name: 'SidebarItem',
  props: {
    routes: {
      type: Array
    },
    isNest: {
      type: Boolean,
      default: false
    }
  },
  created() {},
  methods: {
    hasOneShowingChildren(children) {
      const showingChildren = children.filter(item => {
        return item.hidden === false //这里要严格在路由设置hidden是false还是true， 如果是 !item.hidden 这样的判断 就会将undefined也算进去 那么一个父级菜单只包含一个子级菜单的路由就会被认为是一个单独菜单而没有展开功能
      })
      if (showingChildren.length === 0) {
        //所以这里不能用 showingChildren.length === 1 进行判断
        return true
      }
      return false
    }
  }
}
</script>
<style lang='scss' scoped>
/* /deep/ .el-menu-item{
 
        padding-left: 20px!important;
  
} */
.a_style {
  /deep/ .el-menu-item {
    &:hover {
      background-color: rgba(255, 255, 255, 0.1) !important;
      height: 50px;
      color: #fff !important;
      border-radius: 25px;
    }
    &.is-active {
      background-color: rgba(255, 255, 255, 0.1) !important;
      height: 50px;
      color: #fff !important;
      border-radius: 25px;
    }
    // border-right: 10px solid #000;
  }
}
</style>

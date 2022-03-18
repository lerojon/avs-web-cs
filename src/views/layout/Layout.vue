<template>
  <div class="app-wrapper" :class="classObj">
    <navbar></navbar>
    <div class="main-container">
      <sidebar class="sidebar-container"></sidebar>
      <div class="out-main" style="background-color: #fff;">
        <div class="main-box">
          <breadcrumb></breadcrumb>
          <app-main class="app-main"></app-main>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Navbar, Sidebar, AppMain } from './components' //如果直接引入一个文件夹则取index.vue或index.js作为from的来源
import ResizeMixin from './mixin/ResizeHandler'
import Breadcrumb from '@/components/Breadcrumb'

export default {
  name: 'layout',
  components: {
    Navbar,
    Sidebar,
    AppMain,
    Breadcrumb
  },
  mixins: [ResizeMixin],
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar
    },
    device() {
      return this.$store.state.app.device
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        withoutAnimation: this.sidebar.withoutAnimation,
        // 导致在1024px下菜单隐藏
        mobile: this.device === 'mobile'
      }
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import 'src/styles/mixin.scss';

/* @include 混入 Sass @mixin 与 @include
@mixin 指令允许我们定义一个可以在整个样式表中重复使用的样式。
@include 指令可以将混入（mixin）引入到文档中。 */

.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}
</style>

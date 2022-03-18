<template>
  <scroll-bar>
    <template slot="hamburgers">
      <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger>
    </template>
    <template slot="routers">
      <el-menu
        mode="vertical"
        :show-timeout="200"
        :default-active="$route.path"
        :collapse="isCollapse"
        text-color="#ffffff"
        active-text-color="#ffffff"
      >
        <sidebar-item :routes="routes"></sidebar-item>
      </el-menu>
    </template>
  </scroll-bar>
</template>
    
  </scroll-bar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import ScrollBar from '@/components/ScrollBar'
import Hamburger from '@/components/Hamburger'
export default {
  components: { SidebarItem, ScrollBar, Hamburger },
  computed: {
    ...mapGetters(['sidebar', 'routers']),
    routes() {
      // return this.$router.options.routes
      return this.routers
    },
    isCollapse() {
      return !this.sidebar.opened
    }
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    }
  }
}
</script>
<style rel="stylesheet/scss" scoped lang='scss'>
.hamburger-container {
  line-height: 58px;
  height: 50px;
  float: left;
  padding: 0 20px;
}
</style>

<template>
  <el-menu class="navbar" mode="horizontal">
    <div class="logo">
      <img src="../../../assets/images/logo.png" />
      保泰科技
    </div>
    <!-- 2022/2/24 -->
    <!-- <hamburger class="hamburger-container" :toggleClick="toggleSideBar" :isActive="sidebar.opened"></hamburger> -->
    <!-- 2022/2/24 -->
    <!-- <breadcrumb></breadcrumb> -->
    <div class="avatar-container" trigger="click">
      <div class="avatar-wrapper">
        <!-- <img class="user-avatar" :src="avatar"> -->
        <!-- <i class="el-icon-caret-bottom"></i> -->
      </div>
      <div class="user-dropdown">
        <!-- <router-link class="inlineBlock" to="/">
            {{name}}
        </router-link>-->
        <div class="inlineBlock">{{name}}</div>
        <!-- <div class="quit-block">
          <img class="quit-avatar" src="../../../assets/images/icon/quit_icon.png" />
          <span @click="logout" style="display:block;">退出</span>
        </div>-->
      </div>
    </div>
  </el-menu>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import quitIcon from '@/assets/images/icon/quit_icon.png'
export default {
  components: {
    Breadcrumb,
    Hamburger
  },
  computed: {
    ...mapGetters(['sidebar', 'avatar', 'name'])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('ToggleSideBar')
    },
    logout() {
      this.$confirm('确认要退出系统吗?', '信息确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.$store.dispatch('LogOut').then(() => {
            window.close()
            // this.$router.push({ path: "/login" }) 无接口时的路由方法，有接口就不能这么搞 有路由守卫(全局的)
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
        .catch(() => {})
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.navbar {
  border: none !important;
  height: 50px;
  line-height: 50px;
  border-radius: 0px !important;
  padding: 0 0 0 40px;
  box-sizing: border-box;
  .logo {
    display: flex;
    align-items: center;
    height: 50px;
    float: left;
    padding: 0 10px;
    font-size: 20px;
    font-family: SourceHanSansCN-Bold, SourceHanSansCN;
    font-weight: bold;
    color: #191f6d;
    img {
      width: 115px;
      height: 35px;
      margin-right: 22px;
    }
  }
  .hamburger-container {
    line-height: 58px;
    height: 50px;
    float: left;
    padding: 0 20px;
  }
  .screenfull {
    position: absolute;
    right: 90px;
    top: 16px;
    color: red;
  }
  .avatar-container {
    height: 50px;
    display: inline-block;
    position: absolute;
    right: 35px;
    top: 0;
    display: flex;
    .avatar-wrapper {
      cursor: pointer;
      margin-top: 5px;
      position: relative;
      .user-avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
      .el-icon-caret-bottom {
        position: absolute;
        right: -20px;
        top: 25px;
        font-size: 12px;
      }
    }
    .user-dropdown {
      display: flex;
      .inlineBlock {
        margin-right: 60px;
      }
      .quit-block {
        display: flex;
        align-items: center;
        .quit-avatar {
          margin-right: 10px;
          width: 20px;
          height: 20px;
        }
      }
    }
  }
}
</style>


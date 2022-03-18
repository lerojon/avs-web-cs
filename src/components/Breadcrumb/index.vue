<template>
  <el-breadcrumb class="app-breadcrumb" separator separator-class="el-icon-arrow-right">
    <transition-group name="breadcrumb">
      <!-- ---2022/2/21 -->
      <!-- <el-breadcrumb-item v-if="levelList[0].meta.title" :key="levelList[0].path" class="first">
        <span v-if="levelList[0].redirect==='noredirect'|| 0 ==levelList.length-1" class="no-redirect">
          {{levelList[0].meta.title}}
          <i class="el-icon-close"></i>
        </span>
        <router-link v-else :to="levelList[0].redirect||levelList[0].path">
          {{levelList[0].meta.title}}
          <i class="el-icon-close"></i>
        </router-link>
      </el-breadcrumb-item>
      <el-breadcrumb-item
        v-if="levelList.length>1 && levelList[levelList.length-1].meta.title"
        :key="levelList[levelList.length-1].path"
        class="second"
      >
        <span class="no-redirect" @click="close">
          {{levelList[levelList.length-1].meta.title}}
          <i class="el-icon-close"></i>
        </span>
      </el-breadcrumb-item>-->
      <!-- ---2022/2/21 -->

      <el-breadcrumb-item
        v-for="(item,index)  in levelList"
        :key="item.path"
        v-if="item.meta.title"
        :class="['first',{'second': levelList.length > 1 && index == levelList.length-1}]"
      >
        <span v-if="item.redirect==='noredirect'||index==levelList.length-1" class="no-redirect">{{item.meta.title}}</span>
        <router-link v-else-if="item.path==='/avs'" :to="{ path:  item.redirect||item.path}">{{item.meta.title}}</router-link>
        <span v-else>{{item.meta.title}}</span>
      </el-breadcrumb-item>
    </transition-group>
    <!-- <div class="rightClose" @click="close">
      <i class="el-icon-close"></i>
    </div>-->
  </el-breadcrumb>
</template>

<script>
export default {
  created() {
    this.getBreadcrumb()
  },
  data() {
    return {
      levelList: null
    }
  },
  watch: {
    $route() {
      this.getBreadcrumb()
    }
  },
  methods: {
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name)
      const first = matched[0]
      if (first && first.name !== 'avs') {
        matched = [{ path: '/avs', meta: { title: '模板管理' } }].concat(matched)
      }
      this.levelList = matched
    },
    close() {
      this.$router.push({ path: '/avs' })
    }
  }
}
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  padding-left: 30px; //2022/2/21
  display: inline-block;
  font-size: 12px;
  line-height: 65px;
  width: 100%;
  height: 65px;
  box-shadow: 0px 2px 8px 0px rgba(215, 215, 215, 0.5);
  border-radius: 40px 40px 0px 0px;
  overflow: hidden;
  // background: #F9F9F9;
  // box-shadow: 0px 1px 4px 0px rgba(212, 212, 212, 0.5);
  // margin-left: 10px;
  .no-redirect {
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    color: #b1b1b1;
    cursor: text;
  }
}
.first,
.second {
  // background: #fff;
  // height: 32px;
  //   padding: 0 15px 0 30px;//2022/2/21
  line-height: 65px;
  // box-shadow: 3px 3px 4px 0px rgba(238, 238, 238, 0.5);
  i {
    margin-left: 9px;
    font-style: normal;
  }
}
.second {
  //   background: #eaf4ff;//2022/2/21
}
/deep/ .first .el-breadcrumb__inner a,
.second .no-redirect {
  font-size: 12px;
  font-family: SourceHanSansCN-Regular, SourceHanSansCN;
  font-weight: 400;
  color: #b1b1b1;
}
.second .no-redirect {
  color: #027aff !important;
  cursor: pointer !important;
}
.rightClose {
  float: right;
  width: 40px;
  background: #fff;
  text-align: center;
  font-size: 14px;
  cursor: pointer;
}

/deep/ .el-breadcrumb__separator {
  //   display: none;//2022/2/21
}
</style>

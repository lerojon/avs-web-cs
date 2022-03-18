<template>
  <div>
    <!-- Steps  -->
    <div class="steps-style">
      <el-steps align-center :space="300" :active="activeNum">
        <el-step @click.native="stepJumpEdit" title="模块编辑"></el-step>
        <el-step @click.native="stepJump" title="模板复核"></el-step>
      </el-steps>
    </div>
    <!-- router-view -->
    <div :class="{'router-view--style':activeNum===2}">
      <router-view @activeNumEvent="activeNumEvent" ref="routerPage"></router-view>
    </div>
    <footer-button v-if="activeNum ===1">
      <el-button @click="goBackEdit">返回</el-button>
      <el-button @click="saveMates" type="primary">保存</el-button>
      <el-button @click="templateMerge" type="primary">模板合成</el-button>
    </footer-button>
    <footer-button v-if="activeNum ===2">
      <el-button @click="goBack">上一步</el-button>
      <el-button @click="comfirIssue" :disabled="buttonStatus" :type="!buttonStatus?'primary':'info'">确认发布</el-button>
      <!-- <el-button @click="moduleMerge" type="primary">模板合成</el-button> -->
    </footer-button>
  </div>
</template>
<script>
import footerButton from '@/components/uniComs/footer-button'
import store from '@/store'
export default {
  name: 'templateConf',
  components: {
    footerButton
  },
  created() {},
  mounted() {
    /* if (this.activeNum === 2) {
      if (this.$store.state.data.templateLis.length === 0) {
        store.dispatch('GetTemplateList', this.$refs.routerPage.productId).then(result => {
          this.buttonStatus = this.statusFunction(result)
          console.log('sssssssss:', this.buttonStatus)
        })
      }
    } */
  },
  watch: {
    activeNum: function (value) {
      if (value === 2) {
        store.dispatch('GetTemplateList', this.$refs.routerPage.productId).then(result => {
          this.buttonStatus = this.statusFunction(result)
        })
      }
    }
  },
  data() {
    return {
      activeNum: 1,
      buttonStatus: ''
    }
  },
  methods: {
    statusFunction(list = []) {
      return list.some(value => {
        return value.synthesisStatus === 2 || value.synthesisStatus === -1 || value.synthesisStatus === 0
      })
    },
    activeNumEvent(num) {
      this.activeNum = num
      console.log('routerPath:', this.$route)
    },
    saveMates() {
      this.$refs.routerPage.saveMate()
      //   console.log(this.$refs.routerPage.saveMate())
    },
    stepJump() {
      this.$refs.routerPage.stepJump()
    },
    stepJumpEdit() {
      this.$refs.routerPage.stepJumpEdit()
    },
    templateMerge() {
      //   this.activeNum = 2
      this.$refs.routerPage.templateMerge()
    },
    goBack() {
      this.activeNum = 1
      //   this.$router.push({ path: '/avs/templateConf/moduleEdit' })
      this.$router.go(-1)
    },
    goBackEdit() {
      this.$router.push({ path: '/avs' })
    },
    comfirIssue() {
      this.$refs.routerPage.comfirIssue()
    }
  }
}
</script>
<style lang="scss" scoped>
.steps-style {
  width: 100%;
  text-align: center;
  margin-bottom: 30px;
}
/deep/ .el-steps {
  justify-content: center;
  align-content: center;
}
/deep/ [data-v-09ba1fb4] .el-step__head.is-process .el-step__icon.is-text {
  border: 1px solid #333333;
  color: #666666;
}
/deep/ .el-step__head.is-wait .el-step__icon.is-text {
  border: 1px solid #333333;
  color: #666666;
}
/deep/ .el-step__title.is-wait {
  color: #333333;
}
/deep/ .el-step__title.is-process {
  color: #333333;
}
/deep/ .el-step.is-center .el-step__line {
  left: 61%;
  right: -39%;
}
/deep/ .el-step__head.is-finish .el-step__icon.is-text {
  background: #027aff;
  color: #fff;
}
/deep/ .el-step__head.is-process .el-step__icon.is-text {
  background: #ffffff;
  border: 1px solid #d9d9d9;
  color: #666666;
}
/deep/ .el-step__head.is-process .el-step__icon-inner {
  color: #666666;
}
/deep/ .el-step__title.is-process {
  color: #333333 !important;
}
/deep/ .el-step__title.is-finish {
  color: #333333 !important;
}
.router-view--style {
  //   padding: 10px;
  height: calc(100vh - 350px);
  overflow-y: auto;
}
</style>
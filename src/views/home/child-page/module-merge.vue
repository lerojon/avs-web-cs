<template>
  <div style="margin-bottom:80px;">
    <temp-item
      @videoPre="videoPre"
      ref="tempItem"
      @deleteEvent="deleteEvent"
      :pageFlag="pageFlag"
      v-for="(item,index) in moduleList"
      :key="index"
      :moduleConf="item"
      :tempId="item.templateId"
      :videoUrl="item.url"
      :synthesisStatus="item.synthesisStatus"
      @remarkTem="remarkTem"
      @changeTemName="changeTemName"
      :rawData="item.rawData"
    ></temp-item>
    <div v-if="moduleList.length === 0" class="dataNull">暂无数据</div>
    <!-- footer button -->
    <!-- <div class="footer-return--btn">
      <el-button>返回</el-button>
    </div>-->
    <uni-dialog ref="dialogRef">
      <template slot="titleDefault">
        <svg-icon icon-class="info-circle"></svg-icon>
        <span class="comfirIssueTitle">视频发布确认</span>
        <!-- <i class="el-icon-warning" style="background: ;"></i> -->
      </template>
      <template slot="inputBody">
        <span class="context">
          请问，您是否已复核完所有的模板？
          点击确认后将删除正在使用模板，改用您已复核完成的此套模板！
        </span>
      </template>

      <template slot="btnBody">
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button @click="comfir()" type="primary">确 定</el-button>
        </div>
      </template>
    </uni-dialog>
    <!-- <footer-button>
      <el-button>返回</el-button>
    </footer-button>-->
  </div>
</template>
<script>
import tempItem from '../home-comp/temp-list--item'
import footerButton from '@/components/uniComs/footer-button'
import uniDialog from '@/components/uniComs/uni-dialog'
import {
  queryModuleWord,
  changeTemName,
  remarkTem,
  delTem,
  tempalteList,
  queryTemplate,
  saveModuleField,
  confirmRelease
} from '@/api/avs-video'
export default {
  components: {
    tempItem,
    footerButton,
    uniDialog
  },
  data() {
    return {
      productId: '',
      moduleList: [],
      rawData: { remarks: '' },
      templateId: []
    }
  },
  created() {
    this.productId = this.$route.query.productId
    this.$emit('activeNumEvent', 2)
  },
  mounted() {
    this.getTemList(this.productId)
  },
  computed: {
    pageFlag: function () {
      if (this.$route.path === '/avs/templateList') return false
      else return true
    }
  },
  methods: {
    videoPre(id) {
      this.$router.push({ path: '/avs/videoPreview', query: { productId: this.productId, templateId: id } })
    },
    getTemList(productId) {
      let publishStatus = ''
      if (this.$route.path === '/avs/templateList') publishStatus = 1
      else publishStatus = 0
      tempalteList(
        {
          productId,
          publishStatus
        },
        true,
        false
      ).then(res => {
        let list = res.data
        let tempId = []
        list.map(item => {
          item['rawData'] = {}
          item['rawData'].remarks = item.templateRemark
        })
        list.forEach(item => {
          tempId.push(item.templateId)
        })
        this.moduleList = list
        this.templateId = tempId
      })
    },

    remarkTem() {
      this.getTemList(this.productId)
    },
    changeTemName() {
      this.getTemList(this.productId)
    },
    deleteEvent(val) {
      delTem(val, true, '删除成功').then(result => {
        //   this.moduleList = res.data
        this.getTemList(this.productId)
        console.log('deleteTem:', result)
      })
    },

    goBack() {
      this.$router.go(-1)
    },
    comfirIssue() {
      this.$refs.dialogRef.openDia()
      /* this.$confirm('请问，您是否已复核完所有的模板？点击确认后将删除正在使用模板，改用您已复核完成的此套模板！', '视频发布确认', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {}) */
    },
    cancel() {
      this.$refs.dialogRef.openDia()
    },
    comfir() {
      confirmRelease(this.templateId, false, false).then(result => {
        this.$refs.dialogRef.openDia()
        this.$router.push({ path: '/avs/templateList', query: { productId: this.productId } })
      })
    },
    stepJumpEdit() {
      this.$router.push({ path: '/avs/templateConf/moduleEdit', query: { productId: this.productId } })
    }
  }
}
</script>
<style lang='scss' scoped>
.comfirIssueTitle {
  margin-left: 10px;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #333333;
  line-height: 14px;
  font-weight: 500;
}
.context {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: #333333;
  text-align: justify;
  line-height: 20px;
  font-weight: 400;
}
.dataNull {
  position: absolute;
  top: 44%;
  left: 44%;
  transform: translate(50%, 50%);
  font-size: 30px;
  color: #cacdd1;
}
</style>
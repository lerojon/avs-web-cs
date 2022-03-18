<template>
  <div style="margin-bottom:80px;">
    <temp-item
      @deleteEvent="deleteEvent"
      :pageFlag="pageFlag"
      v-for="(item,index) in moduleList"
      :key="index"
      :moduleConf="item"
      :videoUrl="item.url"
      ref="tempItem"
      @remarkTem="remarkTem"
      @changeTemName="changeTemName"
      :rawData="item.rawData"
    ></temp-item>
    <div v-if="moduleList.length === 0" class="dataNull">暂无数据</div>
    <!-- footer button -->
    <!-- <div class="footer-return--btn">
      <el-button>返回</el-button>
    </div>-->
    <footer-button>
      <el-button @click="goBack">返回</el-button>
    </footer-button>
  </div>
</template>
<script>
import tempItem from '../home-comp/temp-list--item'
import footerButton from '@/components/uniComs/footer-button'
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
    footerButton
  },
  data() {
    return {
      productId: '',
      moduleList: [],
      rawData: { remarks: '' }
    }
  },
  created() {
    this.productId = this.$route.query.productId
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
  watch: {},
  methods: {
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
        list.map(item => {
          item['rawData'] = {}
          item['rawData'].remarks = item.templateRemark
        })
        this.moduleList = list
        console.log('temList:', res)
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
    }
  }
}
</script>
<style lang='scss' scoped>
.dataNull {
  position: absolute;
  top: 44%;
  left: 44%;
  transform: translate(50%, 50%);
  font-size: 30px;
  color: #cacdd1;
}
</style>
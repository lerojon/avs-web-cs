<template>
  <div>
    <!-- title -->
    <div class="title-style">
      <div>产品名称：{{tempObj.productName}}</div>
    </div>
    <div class="out-area">
      <!-- leftArea -->
      <div class="left-area">
        <div>视频预览</div>
        <div class="video-area">
          <p v-if="!videoUrl">{{videoMessage}}</p>
          <video-player v-else class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
        </div>
        <div class="video-name">{{tempObj.templateName}}</div>
      </div>
      <!-- rightArea -->
      <div class="right-area">
        <!-- 表格 -->
        <table-el
          :addBtnFlag="false"
          @colClick="colClick"
          :tableHeight="tableHeight"
          :dataObj="dataObj"
          @handleSizeChange="handleSizeChange"
          @handleCurrentChange="handleCurrentChange"
          @blur="blur"
          :total="pageTotal"
        ></table-el>
      </div>
    </div>
    <!-- 弹窗-外层 -->
    <uni-dialog ref="dialogRef">
      <template slot="titleDefault">
        <svg-icon icon-class="info-circle"></svg-icon>
        <span class="comfirIssueTitle">视频合成确认</span>
        <!-- <i class="el-icon-warning" style="background: ;"></i> -->
      </template>
      <template slot="inputBody">
        <span class="context">您确认要合成视频并预览吗？</span>
      </template>

      <template slot="btnBody">
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button @click="comfir" type="primary">确 定</el-button>
        </div>
      </template>
    </uni-dialog>
    <!-- 弹窗-内层 -->
    <uni-dialog ref="innerDialogRef">
      <template slot="titleDefault">
        <svg-icon icon-class="info-circle"></svg-icon>
        <span class="comfirIssueTitle">温馨提示</span>
        <!-- <i class="el-icon-warning" style="background: ;"></i> -->
      </template>
      <template slot="inputBody">
        <span class="context">视频合成约需2分钟，稍后请刷新页面，点击播放按钮观看！</span>
      </template>

      <template slot="btnBody">
        <div class="dialog-footer">
          <el-button @click="innerComfir" type="primary">确 定</el-button>
        </div>
      </template>
    </uni-dialog>
    <footer-button>
      <el-button @click="goBack">返回</el-button>
      <!-- <el-button type="primary">保存</el-button> -->
      <el-button @click="videoMerge" type="primary">视频合成</el-button>
    </footer-button>
  </div>
</template>
<script>
import footerButton from '@/components/uniComs/footer-button'
import tableEl from '@/components/uniComs/table-el'
import uniDialog from '@/components/uniComs/uni-dialog'
import {
  queryModuleWord,
  changeTemName,
  remarkTem,
  delTem,
  tempalteList,
  queryTemplate,
  saveModuleField,
  confirmRelease,
  videoMergeRequ,
  queryPreviewingVideoURL
} from '@/api/avs-video'
export default {
  name: 'templateConf',
  components: {
    footerButton,
    tableEl,
    uniDialog
  },

  data() {
    return {
      productId: '',
      templateId: '',
      pageTotal: 0,
      sizePage: 10,
      currentPage: 1,
      tempObj: '',
      videoUrl: '',
      videoMessage: '暂无视频',
      tableHeight: window.innerHeight - 500,
      dataObj: {
        // 定义table的模板和数据
        tableData: [],
        tabledefind: [
          {
            type: 'ordinary',
            label: '序号',
            width: '180',
            prop: ''
          },
          {
            type: 'ordinary',
            label: '参数类别',
            width: '180',
            prop: 'paramCategroyName'
          },
          {
            type: 'ordinary',
            label: '参数名称',
            width: '180',
            prop: 'paramName'
          },
          {
            type: 'specific',
            label: '模拟值',
            width: '180',
            prop: 'paramValue',
            slotType: 'input'
          },
          {
            type: 'ordinary',
            label: '使用模块',
            width: '180',
            prop: 'moduleName'
          }
          //   {
          //     type: 'ordinary',
          //     label: '是否必填',
          //     width: '180',
          //     prop: 'requiredFlag'
          //   }
        ]
      },
      playerOptions: {
        // playbackRates: [0.5, 1.0, 1.5, 2.0], //倍速控制
        autoplay: false, //是否自动播放
        muted: false, //是否静音播放
        loop: false, //是否循环播放
        preload: 'auto',
        language: 'zh-CN', //语言，还要引入对应的文件
        aspectRatio: '16:9', //比例
        fluid: true,
        sources: [
          {
            type: '',
            src: 'http://10.30.44.73:9000/test2/%E8%AE%A1%E5%88%92%E4%B9%A6%E8%A7%86%E9%A2%91.mp4?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=0IQOYFZAVJBJ18JZCJP0%2F20220121%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20220121T023423Z&X-Amz-Expires=604800&X-Amz-Security-Token=eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJhY2Nlc3NLZXkiOiIwSVFPWUZaQVZKQkoxOEpaQ0pQMCIsImV4cCI6MTY0MjczNjAyNCwicG9saWN5IjoiY29uc29sZUFkbWluIn0.aeRF9cqdpVJTRm8BArysKQVcSsl6-LaLTZEh5t_9wyHSHbOR8hpzb0ZoZ6U62LbjzAPwJYdLvdOhqtSSg9Mbuw&X-Amz-SignedHeaders=host&versionId=null&X-Amz-Signature=897eb2142dcab159b77a3af9c15cf10c31a8eeb955565d0c6d7d9bbc4df29570' //url地址
          }
        ],
        poster: '', //你的封面地址
        notSupportedMessage: '此视频暂无法播放，请稍后再试',
        controlBar: {
          timeDivider: false,
          durationDisplay: false, //剩余时间是否显示
          remainingTimeDisplay: false, //剩余时间是否显示，有一个即可
          fullscreenToggle: true //全屏按钮
        }
      }
    }
  },
  created() {
    this.productId = this.$route.query.productId
    this.templateId = this.$route.query.templateId
    this.getModuleWordList(this.sizePage, this.currentPage)
    this.getTemplate(this.templateId)
    this.getVideoProUrl(this.templateId, this.productId)
  },
  watch: {},
  methods: {
    getModuleWordList(size, current) {
      queryModuleWord(
        {
          page: {
            size: size,
            current: current
          },
          templateId: this.templateId,
          product_id: this.productId
        },
        true,
        false
      ).then(result => {
        this.dataObj.tableData = []
        this.dataObj.tableData = result.data.records
        this.pageTotal = result.data.total * 1
        console.log(typeof this.pageTotal)
      })
    },
    getTemplate(templateId) {
      queryTemplate({ templateId: templateId }, false, false).then(result => {
        this.tempObj = result.data
      })
    },
    colClick(val) {
      if (val.itemsFlag === 'edit') {
      } else if (val.itemsFlag === 'templateList') {
        this.$router.push({ path: '/templateList' })
      } else if (val.itemsFlag === 'templateConf') {
        this.$router.push({ path: '/templateConf' })
      }
    },
    handleCurrentChange(currenPage) {
      this.currentPage = currenPage
      this.getModuleWordList(this.sizePage, this.currentPage)
    },
    handleSizeChange(pageSize) {
      this.sizePage = pageSize
      this.getModuleWordList(this.sizePage, this.currentPage)
    },
    blur(val) {
      //

      saveModuleField(val, false, '修改成功').then(result => {
        this.getModuleWordList(this.sizePage, this.currentPage)
      })
    },
    goBack() {
      this.$router.go(-1)
    },

    cancel() {
      this.$refs.dialogRef.openDia()
    },
    comfir() {
      this.$refs.innerDialogRef.openDia()
    },
    getVideoProUrl(tempId, proId) {
      queryPreviewingVideoURL({ templateId: tempId, productId: proId }, false, false).then(result => {
        console.log('视频合成成功回调:', result)
        this.videoUrl = result.data.url
        this.$set(this.playerOptions.sources[0], 'src', result.data.url)
        switch (result.data.createVideoFlag) {
          case '0':
            this.videoMessage = '合成中,请稍后刷新页面'
            break
          case '1':
            this.videoMessage = '已合成'
            break
          case '-1':
            this.videoMessage = '合成失败'
            break
          case '2':
            this.videoMessage = '合成成功,请稍后刷新页面'
            break
          default:
            this.videoMessage = '暂无视频,点击视频合成后刷新页面'
        }
      })
    },
    innerComfir() {
      //调合成接口
      this.$refs.dialogRef.openDia()
      this.$refs.innerDialogRef.openDia()
      videoMergeRequ({ templateId: this.templateId }, false, '合成成功').then(result => {
        this.getVideoProUrl(this.templateId, this.productId)
      })
    },
    videoMerge() {
      this.$refs.dialogRef.openDia()
    }
  }
}
</script>
<style lang='scss' scoped>
.title-style {
  padding: 20px 0;
  border-bottom: 1px solid #e6e6e6;
  margin-bottom: 20px;
  font-family: SourceHanSansCN-Medium;
  font-size: 14px;
  color: #333333;
  font-weight: 500;
}
.out-area {
  display: flex;
  justify-content: space-between;
  align-content: center;
  width: 100%;
  height: calc(100vh - 350px);
  .left-area {
    width: 30%;
    height: 100%;
    // background: red;
    // background: #fbfbfb;
    display: flex;
    // align-content: center;
    align-items: center;
    // justify-content: center;
    flex-direction: column;
    padding: 10px 0;
    box-sizing: border-box;
    /deep/ .el-input {
      input {
        width: 100% !important;
      }
      //   width: 60%;
    }
    .video-area {
      width: 100%;
      height: 50%;
      /* width: 400px;
      height: 300px; */
      background: #f5f5f5;
      border-radius: 14.49px;
      margin: 20px 0;
      position: relative;
      p {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        font-size: 12px;
        color: #333333;
        font-weight: 500;
      }
    }
    .video-name {
      margin-top: 50px;
      font-size: 12px;
    }
  }
  .right-area {
    width: 69%;
    height: 100%;
    // background: red;
    // background: #fbfbfb;
    // display: flex;
    border: 1px solid #e8e8e8;
    border-radius: 4px;
    padding: 26px;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
  }
}
.video-player {
  width: 100%;
  height: 100%;
  border-radius: 14.49px;
}
/deep/ .vjs-custom-skin > .video-js {
  border-radius: 14.49px;
  height: 100%;
}
/deep/ .vjs-custom-skin > .video-js .vjs-control-bar {
  overflow: hidden;
}
/deep/ .video-js .vjs-modal-dialog {
  border-radius: 14.49px;
}
</style>
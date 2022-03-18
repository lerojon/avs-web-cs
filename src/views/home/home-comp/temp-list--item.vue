<template>
  <div class="item-body">
    <el-row :gutter="20">
      <!-- 左边图片区 @click="handerClick"-->
      <el-col :span="5" style="margin-right:6%;">
        <div class>
          <div class="video-body">
            <div v-if="!videoUrl">{{messageMerge}}</div>
            <video-player v-else class="video-player vjs-custom-skin" ref="videoPlayer" :playsinline="true" :options="playerOptions"></video-player>
          </div>
          <div class="video-name">
            <div :class="{'proVideo':pageFlag}">{{moduleConf.templateName}}</div>
            <div class="module-operation">
              <div v-if="pageFlag" @click="videoPre" class="proview-video">预览视频</div>
              <div tabindex="-1" @blur="handerClick" @click="handerClick">
                <svg-icon icon-class="too-much"></svg-icon>
              </div>
              <!-- <span>...</span> -->
              <transition name="slide-fade">
                <div v-if="showOper" class="tag-module">
                  <div @click="renameEvent" class="tag-item">重命名</div>
                  <div @click="deleteEvent" class="tag-item">删除</div>
                </div>
              </transition>
            </div>
          </div>
        </div>
      </el-col>
      <!-- 右边详情区 -->
      <el-col :span="17">
        <div class="grid-content--right">
          <div>
            <el-row :gutter="5">
              <el-col :span="5">
                <div class="grid-content">大小：{{moduleConf.size}}</div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">时长：{{moduleConf.timeLength}}</div>
              </el-col>
              <el-col :span="5">
                <div class="grid-content">格式：{{moduleConf.videoFormat}}</div>
              </el-col>
              <el-col :span="9">
                <div class="grid-content">上线日期：{{moduleConf.publishTime}}</div>
              </el-col>
            </el-row>
          </div>
          <div style="padding:10px 0;">
            <el-row type="flex" align="middle" :gutter="1">
              <el-col :span="2">
                <div class>模板组成：</div>
              </el-col>
              <el-col :span="21">
                <div class="temp-constitute">
                  <!-- :style="'width:'+100/moduleConf.tempComp.length+'%;'"style="height:129px;" -->
                  <div class="module-sty" v-for="(item , index) in moduleConf.tempComp" :key="index">
                    <div style=" background: #f5f5f5;padding: 10px;">{{item.moduleName}}</div>
                    <svg-icon v-if="index+1 < moduleConf.tempComp.length" icon-class="add-icon"></svg-icon>
                  </div>
                </div>
              </el-col>
            </el-row>
          </div>
          <div>
            <el-row :gutter="1">
              <el-col :span="2">
                <div class>备注：</div>
              </el-col>
              <el-col :span="21">
                <div class>
                  <avs-input @change="change" :rawData="rawData" field="remarks" :textarea="true" :autosize="{ minRows: 2, maxRows: 2}"></avs-input>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
      </el-col>
    </el-row>
    <uni-dialog title="重命名" ref="dialogRef">
      <template slot="inputBody">
        <el-form :model="dataForm" :rules="rules" ref="dataForm">
          <el-form-item label prop="rename">
            <el-input class="child-style" v-model="dataForm.rename" placeholder="请输入名字"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template slot="btnBody">
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button @click="comfir(dataForm)" type="primary">确 定</el-button>
        </div>
      </template>
    </uni-dialog>

    <!-- 视频预览弹窗 -->
    <uni-dialog title="视频预览" ref="videoPreview">
      <template slot="inputBody">
        <video :src="this.moduleConf.url" autoplay="autoplay"></video>
      </template>
      <!-- <template slot="btnBody">
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button @click="comfir(dataForm)" type="primary">确 定</el-button>
        </div>
      </template>-->
    </uni-dialog>
  </div>
</template>
<script>
import avsInput from '@/components/base-coms/avs-input'
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
    avsInput,
    uniDialog
  },
  props: {
    pageFlag: {
      type: [Boolean]
    },
    moduleConf: {
      type: [Object]
    },
    rawData: {
      type: [Object]
    },
    field: {
      type: [String],
      default: 'remarks'
    },
    tempId: {
      type: [String, Number]
    },
    videoUrl: {
      type: [String]
    },
    synthesisStatus: {
      type: [Number]
    }
    /*  showOper: {
      type: [Boolean],
      default: false
    } */
  },
  data() {
    return {
      //   field: 'remarks',
      //   rawData: { remarks: '' },
      messageMerge: '',
      dataForm: { rename: '' },
      rules: {
        rename: [{ required: true, message: '请输入名字', trigger: 'blur' }]
      },
      showOper: false,
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
            src: this.videoUrl //'http://172.27.28.196:9000/baotai/a22222.mp4' //url地址
          }
        ],
        poster: '', //你的封面地址
        notSupportedMessage: '视频无法播放',
        controlBar: {
          timeDivider: false,
          durationDisplay: false, //剩余时间是否显示
          remainingTimeDisplay: false, //剩余时间是否显示，有一个即可
          fullscreenToggle: true //全屏按钮
        }
      }
    }
  },

  computed: {},
  created() {
    if (this.synthesisStatus === 1) {
      this.messageMerge = '合成成功'
    } else if (this.synthesisStatus === 0) {
      this.messageMerge = '未合成'
    } else if (this.synthesisStatus === -1) {
      this.messageMerge = '合成失败'
    } else if (this.synthesisStatus === 2) {
      this.messageMerge = '合成中'
    }
  },
  methods: {
    videoPre() {
      //   this.$refs.videoPreview.openDia()
      this.$emit('videoPre', this.tempId)
    },
    handerClick() {
      this.openReName()
      // this.$emit('openReNameEvent')
      console.log(this.showOper)
    },
    openReName() {
      this.showOper = !this.showOper
    },
    change(val) {
      if (
        this.moduleConf &&
        (this.moduleConf.productId === 0 || this.moduleConf.productId) &&
        (this.moduleConf.templateId === 0 || this.moduleConf.templateId)
      ) {
        let requestObj = {
          productId: this.moduleConf.productId,
          templateId: this.moduleConf.templateId,
          templateRemark: val.remarks,
          publishStatus: this.pageFlag ? 0 : 1
        }
        remarkTem(requestObj, false, '备注修改成功')
          .then(result => {
            this.$emit('remarkTem')
            console.log('remarkTem:', result)
          })
          .catch(err => {
            console.log('remarkTemerr:', err)
          })
        console.log('change', val)
      }
    },
    cancel() {
      this.resetForm()
      this.$refs.dialogRef.openDia()
      //   this.showOper = !this.showOper
    },
    comfir(dataForm) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          if (
            this.moduleConf &&
            (this.moduleConf.productId === 0 || this.moduleConf.productId) &&
            (this.moduleConf.templateId === 0 || this.moduleConf.templateId)
          ) {
            let requestObj = {
              productId: this.moduleConf.productId,
              templateId: this.moduleConf.templateId,
              templateName: this.dataForm.rename ? this.dataForm.rename.trim() : '',
              publishStatus: this.pageFlag ? 0 : 1
            }
            changeTemName(requestObj, false, '重命名成功')
              .then(result => {
                this.$emit('changeTemName')
                console.log('changeTemName:', result)
              })
              .catch(err => {
                console.log('changeTemNameerr:', err)
              })
          }
          this.$refs.dialogRef.openDia()
          this.resetForm()
          //   this.showOper = !this.showOper
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },

    /* colClick(val) {
      if (val.itemsFlag === 'edit') {
      } else if (val.itemsFlag === 'templateList') {
        this.$router.push({ path: '/templateList' })
      }
      console.log(val, 'colClick')
    }, */

    resetForm() {
      this.$refs['dataForm'].resetFields()
    },
    renameEvent() {
      this.$refs.dialogRef.openDia()
    },
    deleteEvent() {
      if (
        this.moduleConf &&
        (this.moduleConf.productId === 0 || this.moduleConf.productId) &&
        (this.moduleConf.templateId === 0 || this.moduleConf.templateId)
      ) {
        let requestObj = {
          productId: this.moduleConf.productId,
          templateId: this.moduleConf.templateId,
          publishStatus: this.pageFlag ? 0 : 1
        }
        this.$emit('deleteEvent', requestObj)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.item-body {
  background: #fbfbfb;
  padding: 20px;
  box-sizing: border-box;
  margin-bottom: 10px;
  .video-body {
    width: 100%;
    height: 168px;
    background: #dbdbdb;
    border-radius: 8px;
    margin-bottom: 3px;
    text-align: center;
    line-height: 168px;
  }
  .video-name {
    padding: 12px 0 0;
    display: flex;
    justify-content: space-between;
    .module-operation {
      position: relative;
      display: flex;
      .tag-module {
        //这里需要判断页面 改left为right
        width: 70px;
        position: absolute;
        top: 20px;
        left: -26px;
        box-shadow: 0px 2px 4px 0px;
        z-index: 100;
        background: #ffffff;
        .tag-item {
          text-align: center;
          padding: 5px;
        }
        .tag-item:hover {
          cursor: pointer;
        }
      }
    }
  }
  .grid-content--right {
    height: 168px;
  }
  .temp-constitute {
    width: 100%;

    background: #ffffff;
    border: 1px solid #dbdbdb;
    border-radius: 2px;
    display: flex;
    align-items: center;
    padding: 10px;
    box-sizing: border-box;
    flex-wrap: wrap;
  }
  .module-sty {
    display: flex;

    align-items: center;
    // padding: 10px;
    // background: #f5f5f5;
    border-radius: 2px;
    // max-height: 28px;
    // line-height: 28px;
  }
}

.el-col {
  border-radius: 4px;
}

.grid-content {
  line-height: 36px;
  border-radius: 4px;
  min-height: 36px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.proview-video {
  /*  position: absolute;
  top: 1px;
  left: 1px; */
  color: #4686f2;
  margin-right: 5px;
}
.video-player {
  width: 100%;
  height: 100%;
  border-radius: 8px;
}
/deep/ .vjs-custom-skin > .video-js {
  border-radius: 8px;
  height: 100%;
}
/deep/ .vjs-custom-skin > .video-js .vjs-control-bar {
  overflow: hidden;
}
/deep/ .video-js .vjs-modal-dialog {
  border-radius: 8px;
}
/deep/ .vjs-fluid {
  padding-top: 0 !important;
}
.proVideo {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  width: 50%;
}
</style>
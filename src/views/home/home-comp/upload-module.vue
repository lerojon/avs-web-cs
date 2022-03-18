<template>
  <div style="display:flex;flex-direction: column;align-items: center;">
    <div class="upload-box">
      <div :class="['double-upl',{'checkSourceUrl':checkSourceUrl}]">
        <!-- <div>测试模块id:{{deleteMoudelId}}---{{falMoudleId}}</div> -->
        <div v-if="requiredFlag == 1" style=" text-align: center;margin-bottom:10px;color:#4686F2;">必选</div>
        <div v-if="requiredFlag == 0" style=" text-align: center;margin-bottom:10px;color:#838383;">非必选</div>
        <avs-upload
          :httpRequest="httpRequest"
          :handlePreview="handlePreview"
          :handleRemove="handleRemove"
          :beforeRemove="beforeRemove"
          :handleExceed="handleExceed"
          :handleChange="handleChange"
          :handleError="handleError"
          :handleSucccess="handleSucccess"
          :handleProgress="handleProgress"
          :beforeUpload="beforeUpload"
          upLoadTitle="上传源视频"
          doubleTitle="上传带标记的视频"
          :backgroundFlag="requiredFlag==0?true:false"
          :double="true"
          :limit="2"
          :accept="accept"
          @oneEvent="oneEvent"
          @doubleEvent="doubleEvent"
          :fileList="fileList"
        ></avs-upload>
      </div>
      <div style="display:flex;flex-direction: column;justify-content: flex-end;margin-left:10px;">
        <svg-icon v-if="sourceUrl" @svgEvent="editEvent" icon-class="edit-icon"></svg-icon>
        <div style="margin-bottom:5px;"></div>
        <svg-icon @svgEvent="closeEvent" icon-class="close-icon"></svg-icon>
      </div>
    </div>
    <div class="plus-icon">
      <svg-icon @svgEvent="svgEvent" icon-class="plus-sign"></svg-icon>
    </div>
  </div>
</template>
<script>
import avsUpload from '@/components/base-coms/avs-upload'
import { saveModule, updateModuleNum, deleteModuleVideo, minioUpload } from '@/api/avs-video'
import * as uniUtils from '@/utils'

// import { Progress } from 'element-ui'
let stream = require('stream')
export default {
  name: 'uploadModule',
  components: {
    avsUpload
  },
  props: {
    orderId: {
      type: [Number, String]
    },
    deleteMoudelId: {
      type: [Number, String]
    },
    productId: {
      type: [Number, String],
      default: ''
    },
    moduleIndex: {
      type: [Number, String]
    },
    fileList: {
      type: [Array]
    },
    sourceUrl: {
      type: [String]
    },
    remarkUrl: {
      type: [String]
    },
    source_fileId: {
      type: [Number, String]
    },
    sing_fileId: {
      type: [Number, String]
    },
    updateOrder: {
      type: [Array]
    },
    checkSourceUrl: {
      type: [Boolean],
      default: false
    },
    requiredFlag: {
      type: [Number, String]
    },
    falMoudleId: {
      type: [String, Number]
    },
    model_item: {}
  },
  data() {
    return {
      //   fileList: [],
      accept: '.mp4',
      model_id: '',
      uploadSort: 0,
      uploadFileType: '',
      uploadFileType1: '',
      uploadFileType2: '',
      sourceUrlFlag: this.sourceUrl,
      sourceFlag: '',
      playTime: ''
    }
  },

  computed: {},
  watch: {},
  created() {},
  mounted() {},
  methods: {
    //   初始化函数
    initUploadSortn() {
      //解决上传视频，模块ID传参不正常的问题,线程问题,v-for渲染出来的模块没有独立出来造成的
      this.model_id = ''
      console.log('aiya')
    },

    saveMoudleRequest(objData, upload_sort, locatFlag, noticeFlag) {
      let sourceObjData = uniUtils.deepClone(objData)

      if (sourceObjData.source_fileId || sourceObjData.sing_fileId) {
        delete sourceObjData.source_fileId
        delete sourceObjData.sing_fileId
      }
      if (!sourceObjData.id) {
        delete sourceObjData.id
      } else {
        delete sourceObjData.orderNum
      }

      return new Promise(resolve => {
        saveModule(sourceObjData, locatFlag, noticeFlag).then(result => {
          resolve(result)
        })
      })
    },
    /* saveMoudleRequestSing(objData, upload_sort, locatFlag, noticeFlag) {
      let sourceObjData = uniUtils.deepClone(objData)
      console.log('objData-----2:', objData, sourceObjData)
      if (sourceObjData.source_fileId || sourceObjData.sing_fileId) {
        delete sourceObjData.source_fileId
        delete sourceObjData.sing_fileId
      }
      if (!sourceObjData.id) {
        //
        delete sourceObjData.id
      } else {
        delete sourceObjData.orderNum
      }

      return new Promise(resolve => {
        saveModule(sourceObjData, locatFlag, noticeFlag).then(result => {
          resolve(result)
        })
      })
    }, */
    oneEvent() {
      this.uploadFileType = 'sourceFile'
      this.uploadFileType1 = 'sourceFile'
    },
    doubleEvent() {
      this.uploadFileType = 'singFile'
      this.uploadFileType2 = 'singFile'
    },
    //自定义的上传方法
    httpRequest(param) {
      if (this.falMoudleId) {
        this.model_id = this.falMoudleId
      }

      let file = param.file
      let doumloadUrl = `http://172.27.28.196:9000/baotai/${file.uid + file.name}`
      let _self = this
      if (this.uploadFileType1 === 'sourceFile') {
        this.uploadFileType1 = ''
        param.onProgress({ percent: 0 })
        let sourceObj = {}
        // let singObj = {}

        //-------
        let url = window.URL.createObjectURL(file)
        var audioElement = new Audio(url)
        audioElement.addEventListener('loadedmetadata', () => {
          _self.playTime = audioElement.duration //当前视频长度
        })
        //-------
        uniUtils.minioClient.presignedPutObject('baotai', file.uid + file.name, 24 * 60 * 60, function (err, presignedUrl) {
          if (err) {
            return console.log(err)
          } else {
            let dataObj = {
              url: presignedUrl,
              method: 'put',
              data: file,
              onUploadProgress: progressEvent => {
                const complete = parseInt(((progressEvent.loaded / progressEvent.total) * 100) | 0, 10)
                // 重点二：onProgress()方法需要以上方接收的形参来调用
                // 这个方法有一个参数"percent"，给他进度值 complete 即可
                param.onProgress({ percent: complete })
              }
            }
            minioUpload(dataObj).then(res => {
              param.onSuccess()
              //----------------------------------

              let lastModified = uniUtils.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S')
              /* uniUtils.getVideoTime(file, function (time) {
                _self.$set(sourceObj, 'moduleTime', time)
              }) */

              _self.$set(sourceObj, 'moduleTime', _self.playTime)

              _self.$set(sourceObj, 'productId', _self.productId)
              _self.$set(sourceObj, 'orderNum', _self.orderId)
              _self.$set(sourceObj, 'moduleName', file.name)
              _self.$set(sourceObj, 'sourceUrl', doumloadUrl)
              _self.$set(sourceObj, 'moduleFormat', file.type)
              _self.$set(sourceObj, 'moduleSize', file.size)
              _self.$set(sourceObj, 'sourceUploadTime', lastModified)
              _self.$set(sourceObj, 'source_fileId', file.uid)
              _self.$set(sourceObj, 'id', _self.model_id)

              //   setTimeout(() => {
              //需要时间 进行深度拷贝 以免对象改变影响其他功能（删除，同名文件判断，等需要uid属性）的判断

              _self
                .saveMoudleRequest(sourceObj, _self.uploadSort, false, false)
                .then(result => {
                  //   ++_self.uploadSort
                  _self.model_id = result.data.id
                  sourceObj.moduleIndex = _self.moduleIndex
                  sourceObj.id = result.data.id
                  console.log('--------1:', result)

                  _self.$emit('GetMouleDetail', sourceObj)
                  setTimeout(() => {
                    updateModuleNum({ moduleNumList: _self.updateOrder }, false, false).then(result => {})
                  }, 50)
                })
                .catch(err => {
                  param.onError()
                  _self.uploadSort = 0
                })
              //   }, 500)

              //------------------

              //----------------------------------
            }),
              error => {
                param.onSuccess()
              }
          }
        })
      } else if (this.uploadFileType2 === 'singFile') {
        this.uploadFileType2 = ''
        param.onProgress({ percent: 0 })
        // let file = param.file
        // let _self = this
        // let sourceObj = {}
        let singObj = {}
        // if (_self.falMoudleId) _self.model_id = _self.falMoudleId

        uniUtils.minioClient.presignedPutObject('baotai', file.uid + file.name, 24 * 60 * 60, function (err, presignedUrl) {
          if (err) {
            return console.log(err)
          } else {
            let dataObj = {
              url: presignedUrl,
              method: 'put',
              data: file,
              onUploadProgress: progressEvent => {
                const complete = parseInt(((progressEvent.loaded / progressEvent.total) * 100) | 0, 10)
                // 重点二：onProgress()方法需要以上方接收的形参来调用
                // 这个方法有一个参数"percent"，给他进度值 complete 即可
                param.onProgress({ percent: complete })
              }
            }
            minioUpload(dataObj).then(res => {
              param.onSuccess()
              //----------------------------------

              let signUploadTime = uniUtils.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S')
              // singObj.orderNum = _self.orderId
              _self.$set(singObj, 'productId', _self.productId)
              singObj.moduleRemarkName = file.name
              singObj.remarkUrl = doumloadUrl
              singObj.signUploadTime = signUploadTime
              singObj.sing_fileId = file.uid
              singObj.id = _self.model_id
              singObj.orderNum = _self.orderId
              // let objData = uniUtils.deepClone(singObj) //进行深度拷贝 以免对象改变影响其他功能（删除，同名文件判断，等需要uid属性）的判断
              //   setTimeout(() => {
              _self
                .saveMoudleRequest(singObj, _self.uploadSort, false, false)
                .then(result => {
                  _self.model_id = result.data.id
                  singObj.moduleIndex = _self.moduleIndex
                  singObj.id = result.data.id

                  _self.$emit('GetMouleDetail', singObj)
                })
                .catch(err => {
                  param.onError()
                  _self.uploadSort = 0
                })
              //   }, 500)
              //----------------------------------
            }),
              error => {
                param.onSuccess()
              }
          }
        })
      }
    },
    //------这几个会被传到子组件（el-upload）里调用
    handlePreview(file) {
      window.open(file.url, '_blank', 'menubar=0,scrollbars=1, resizable=1,status=1,titlebar=0,toolbar=0,location=1')
    },
    handleSucccess(data) {},
    deleteVideoRequest(moudleId, videoFlag, moduleIndex, fileList, urlFlag) {
      deleteModuleVideo({ id: moudleId, videoFlag: videoFlag }, false, '删除成功')
        .then(result => {
          this.$emit('getFileList', moduleIndex, fileList, urlFlag)
          console.log(result)
        })
        .catch(err => {})
    },
    handleRemove(file, fileList) {
      /* if (file.hasOwnProperty('file')) {
        for (let index in this.fileList) {
          if (this.fileList[index].uid === file.uid) {
            this.fileList.splice(index, 1)
            return
          }
        }
      } */

      //这里的删除用文件名无法区别同名文件，需要用文件uid 进行区别所以可以给对象moudelData加个属性source_fileId 用以区别同名文件
      if (file && file.status === 'success') {
        //移除前方法
        let _self = this

        uniUtils.minioClient.removeObject('baotai', file.name, function (err) {
          if (err) {
            return console.log('Unable-------to-----remove------object', err)
          }
          if (_self.uploadSort === 1) {
            _self.uploadSort = 1
          } else {
            _self.uploadSort = 0
          }
          if (_self.source_fileId === file.uid) {
            _self.deleteVideoRequest(_self.deleteMoudelId, 1, _self.moduleIndex, fileList, 'sourceFile')
          } else if (_self.sing_fileId === file.uid) {
            _self.deleteVideoRequest(_self.deleteMoudelId, 2, _self.moduleIndex, fileList, 'singFile')
            // _self.$emit('getFileList', _self.moduleIndex, fileList, 'singFile')
          }
          return false //测试 防止触发两遍
        })
        //----------------测试
        /*  _self.uploadSort = 0
        if (_self.source_fileId === file.uid) {
          _self.deleteVideoRequest(_self.deleteMoudelId, 1, _self.moduleIndex, fileList)
          //   _self.$emit('getFileList', _self.moduleIndex, fileList, 'sourceFile')
        } else if (_self.sing_fileId === file.uid) {
          _self.deleteVideoRequest(_self.deleteMoudelId, 2, _self.moduleIndex, fileList)
          //   _self.$emit('getFileList', _self.moduleIndex, fileList, 'singFile')
        } */
        //----------------测试
      }
    },
    beforeRemove(file, fileList) {
      if (file && file.status === 'success') {
        //移除前方法
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },
    handleExceed() {
      this.$message.error(`最多只能上传两个文件`)
    },
    handleChange(file, fileList) {
      if (file && file.status === 'success') {
        this.$emit('getChangeFileList', this.moduleIndex, fileList)
      }
    },
    handleError(err, file, fileList) {},
    handleProgress(event, file, fileList) {
      if (event.percent == 100) {
        /* fileList[0].progressFlag = false
        fileList[0].successFlag = true */
      } else {
        /*  fileList[0].progressFlag = true
        fileList[0].successFlag = false
        fileList[0].progressPercent = event.percent */
      }
    },
    beforeUpload(file) {
      if (this.sourceUrl && this.uploadFileType === 'sourceFile') {
        this.$message.error(`源文件已上传`)
        return false
      } else if (this.remarkUrl && this.uploadFileType === 'singFile') {
        this.$message.error(`标记文件已上传`)
        return false
      }
      //   return false
    },
    //------这几个会被传到子组件（el-upload）里调用
    svgEvent() {
      if (this.sourceUrl || this.remarkUrl) {
        this.$emit('addModule')
      } else {
        this.$message.error(`请先上传视频才可创建新模块`)
      }
    },
    closeEvent() {
      this.$emit('closeModule')
    },
    editEvent() {
      this.$emit('editModule')
    },
    toBlob(base64Data) {
      //base64转blob

      let byteString = base64Data
      if (base64Data.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(base64Data.split(',')[1]) // base64 解码
      } else {
        byteString = unescape(base64Data.split(',')[1])
      }
      // 获取文件类型
      let mimeString = base64Data.split(';')[0].split(':')[1] // mime类型

      // ArrayBuffer 对象用来表示通用的、固定长度的原始二进制数据缓冲区
      // let arrayBuffer = new ArrayBuffer(byteString.length) // 创建缓冲数组
      // let uintArr = new Uint8Array(arrayBuffer) // 创建视图

      let uintArr = new Uint8Array(byteString.length) // 创建视图

      for (let i = 0; i < byteString.length; i++) {
        uintArr[i] = byteString.charCodeAt(i)
      }
      // 生成blob
      const blob = new Blob([uintArr], {
        type: mimeString
      })
      // 使用 Blob 创建一个指向类型化数组的URL, URL.createObjectURL是new Blob文件的方法,可以生成一个普通的url,可以直接使用,比如用在img.src上
      return blob
    }
  }
}
</script>
<style lang='scss' scoped>
.upload-box {
  display: flex;
  margin-left: 20px;
}
.double-upl {
  border: 1px dashed #b5b5b5;
  padding: 10px;
}
.checkSourceUrl {
  animation: 1s rainbow infinite;
}
@keyframes rainbow {
  0% {
    border: 1px dashed red;
  }
  40% {
    border: 1px dashed #b5b5b5;
  }
  60% {
    border: 1px dashed red;
  }
  100% {
    border: 1px dashed #b5b5b5;
  }
  //   80% {
  //     border: 1px dashed red;
  //   }
  //   100% {
  //     border: 1px dashed #b5b5b5;
  //   }
}
.plus-icon {
  margin: 20px 0;
}
</style>
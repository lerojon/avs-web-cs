<template>
  <div>
    <div class="out-area">
      <!-- leftArea -->
      <div class="left-area">
        <div class="product-name">
          <p>文本计划书产品ID：</p>
          <el-input v-model="planProductId" placeholder="请输入内容"></el-input>
          <avs-upload
            :accept="accept"
            :fileList="musicFiles"
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
            otherStyle="frontHidden"
            styles="margin-top:40px;"
            upLoadTitle="上传文件"
            title="背景音乐配置："
            :limit="1"
          ></avs-upload>
        </div>
      </div>
      <!-- rightArea -->
      <div class="right-area">
        <div>
          <svg-icon class="svg-style" @svgEvent="svgEvent" icon-class="plus-sign"></svg-icon>
        </div>
        <upload-module
          ref="upload_Module"
          :productId="productId"
          :orderId="item.orderNum"
          :moduleIndex="index"
          :model_item="item"
          :fileList="item.fileList?item.fileList:[]"
          :sourceUrl="item.sourceUrl"
          :remarkUrl="item.remarkUrl"
          :source_fileId="item.source_fileId"
          :sing_fileId="item.sing_fileId"
          :updateOrder="updateOrder"
          :deleteMoudelId="item.id"
          :checkSourceUrl="item.checkSourceUrl"
          :requiredFlag="item.requiredFlag"
          :falMoudleId="item.id?item.id:''"
          @closeModule="closeModule(index,item.orderNum)"
          @addModule="addModule(index)"
          @editModule="editModule(index)"
          @GetMouleDetail="GetMouleDetail"
          @getFileList="getFileList"
          @getChangeFileList="getChangeFileList"
          v-for="(item,index) in moduleList"
          :key="index"
        ></upload-module>
      </div>
    </div>
  </div>
</template>

<script>
import { saveMaterial, deleteModule, queryMaterial, updateModuleNum, queryModule, minioUpload, createTempate } from '@/api/avs-video'
import avsUpload from '@/components/base-coms/avs-upload'
import uploadModule from '../home-comp/upload-module'
import * as uniUtils from '@/utils'

export default {
  name: 'moduleEdit',
  components: {
    avsUpload,
    uploadModule
  },
  data() {
    return {
      saveFlag: true,
      accept: '.mp3',
      planProductId: '',
      fileList: [],
      param: { id: null },
      moduleList: [],
      productId: '',
      musicFiles: [],
      updateOrder: [],
      musicParams: {
        timeLength: '',
        productId: '',
        materialName: '',
        materialType: '',
        url: '',
        size: '',
        format: '',
        deleteFlag: ''
      }
    }
  },
  created() {
    this.productId = this.$route.query.productId
    this.initPage(this.productId)
    this.$emit('activeNumEvent', 1)
  },
  methods: {
    initPage(productId) {
      this.musicParams.productId = productId
      queryModule({ productId: productId }, true, '查询成功')
        .then(result => {
          let moduleList = []
          moduleList = uniUtils.ObjArrayCompare(result.data.moduleList, 'orderNum')

          this.moduleList = this.initArray(moduleList)
        })
        .catch(err => {
          this.moduleList = []
        })

      queryMaterial({ productId: productId }, false, false)
        .then(result => {
          if (result.data && result.data.materialList && uniUtils.ArrayFlag(result.data.materialList)) {
            let materialList = result.data.materialList
            materialList.forEach((item, index) => {
              this.planProductId = item.planProductId
              let fileObj = {}
              fileObj['name'] = item.materialName
              fileObj['percentage'] = 100
              fileObj['size'] = item.size
              fileObj['status'] = 'success'
              fileObj['url'] = item.url
              fileObj['uid'] = 'materialName'
              fileObj['raw'] = {
                uid: 'materialName',
                name: item.materialName,
                size: item.size,
                type: item.format
              }
              if (item.url && item.materialName) this.musicFiles.push(fileObj)
              //if (!uniUtils.NullObjectFlag(this.musicParams))
              this.musicParams = uniUtils.deepClone(item)
            })
          }
          this.planProductId = result.data.planProductId
          this.musicParams['planProductId'] = this.planProductId
        })
        .catch(err => {})
    },
    initArray(arr) {
      arr.forEach(item => {
        let fileSource = {}
        let fileSing = {}
        let fileList = []
        fileSource['name'] = item.moduleName
        fileSource['percentage'] = 100
        fileSource['size'] = item.moduleSize
        fileSource['status'] = 'success'
        fileSource['moduleTime'] = item.moduleTime
        fileSource['url'] = item.sourceUrl
        fileSource['sourceUploadTime'] = item.sourceUploadTime
        fileSource['uid'] = 'sourceUrl'
        fileSource['raw'] = {
          uid: 'sourceUrl',
          name: item.moduleName,
          size: item.moduleSize,
          type: item.moduleFormat
        }
        fileSing['name'] = item.moduleRemarkName
        fileSing['url'] = item.remarkUrl
        fileSing['uid'] = 'remarkUrl'
        fileSing['status'] = 'success'
        fileSing['percentage'] = 100
        fileSing['size'] = item.moduleSize
        fileSing['raw'] = {
          uid: 'sourceUrl',
          name: item.moduleRemarkName,
          size: item.moduleSize,
          type: item.moduleFormat
        }
        if (item.remarkUrl && item.sourceUrl) {
          fileList.push(fileSource, fileSing)
        } else if (item.sourceUrl && !item.remarkUrl) {
          fileList.push(fileSource)
        } else if (!item.sourceUrl && item.remarkUrl) {
          fileList.push(fileSing)
        }
        item['fileList'] = fileList
        item['source_fileId'] = 'sourceUrl'
        item['sing_fileId'] = 'remarkUrl'
      })
      return arr
    },
    /* getFileParam(index, fileParam) {
      //这里用来解决模块页面显示顺序对了 但页面数据不对称的问题:fileParam="item.fileParam?item.fileParam:{}"
      console.log('getFileParam::', index, fileParam)
      this.$set(this.moduleList[index], 'fileParam', fileParam)
    }, */
    getFileList(index, fileList, fileType) {
      //这里用来解决在只有两个模块且两个模块都上传文件，然后在第一个模块那里即中间增加模块的时侯第二模块的文件出现在了新增的模块里，页面显示的直观表现就是新增的模块并未出现在中间而是跑到了最后面去。
      this.$set(this.moduleList[index], 'fileList', fileList)
      if (fileType === 'sourceFile') {
        this.$set(this.moduleList[index], 'moduleName', '')
        this.$set(this.moduleList[index], 'sourceUrl', '')
        this.$set(this.moduleList[index], 'moduleFormat', '')
        this.$set(this.moduleList[index], 'moduleTime', '')
        this.$set(this.moduleList[index], 'moduleSize', '')
        this.$set(this.moduleList[index], 'sourceUploadTime', '')
      } else {
        this.$set(this.moduleList[index], 'remarkUrl', '')
        this.$set(this.moduleList[index], 'moduleRemarkName', '')
        this.$set(this.moduleList[index], 'signUploadTime', '')
      }
      this.$forceUpdate()
    },
    getChangeFileList(index, fileList) {
      this.$set(this.moduleList[index], 'fileList', fileList)
    },
    GetMouleDetail(valObj) {
      //   this.moduleList.forEach((item, index) => {})
      let objData = uniUtils.deepClone(valObj)
      Object.assign(this.moduleList[objData.moduleIndex], objData)
      this.$forceUpdate()
      this.updateOrder = this.updataOrder(this.moduleList)
      console.log('GetMouleDetail::--', this.moduleList, valObj)
    },
    svgEvent() {
      //生成第一个模块
      // orderNum为模块的顺序
      if (uniUtils.ArrayFlag(this.moduleList)) {
        if (this.moduleList.length <= 0) {
          let orderNum = 1
          this.moduleList.push({ orderNum: orderNum })
        } else {
          return false
        }
      } else {
        this.moduleList = []
        let orderNum = 1
        this.moduleList.push({ orderNum: orderNum })
      }
    },
    //---------------背景音乐素材上传--------
    httpRequest(param) {
      param.onProgress({ percent: 0 })
      let file = param.file
      let _self = this

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
            let doumloadUrl = `http://172.27.28.196:9000/baotai/${file.uid + file.name}`

            // let lastModified = uniUtils.dateFormat(new Date(), 'yyyy-MM-dd hh:mm:ss.S')
            uniUtils.getVideoTime(file, function (time) {
              _self.$set(_self.musicParams, 'timeLength', time)
            })

            _self.$set(_self.musicParams, 'productId', _self.productId)
            _self.$set(_self.musicParams, 'materialName', file.name)
            _self.$set(_self.musicParams, 'materialType', 1)
            _self.$set(_self.musicParams, 'url', doumloadUrl)
            _self.$set(_self.musicParams, 'size', file.size)
            _self.$set(_self.musicParams, 'format', file.type)
            _self.$set(_self.musicParams, 'deleteFlag', 0)
            //let sourceObjData = uniUtils.deepClone(_self.musicParams) //进行深度拷贝 以免对象改变影响其他功能（删除，同名文件判断，等需要uid属性）的判断

            _self.saveFlag = false
            //----------------------------------
          }),
            error => {
              param.onSuccess()
            }
        }
      })
      //   this.musicFiles.push(param.file)
    },
    saveMate() {
      this.saveFlag = true
      this.$set(this.musicParams, 'planProductId', this.planProductId)
      if (this.musicParams.id) delete this.musicParams.id
      saveMaterial(this.musicParams, false, false)
        .then(result => {
          console.log('saveMaterialRequest:', result)
        })
        .catch(err => {
          param.onError()
        })
    },
    handleChange(file, fileList) {
      if (file.status === 'success') {
        this.musicFiles = fileList
      }
      console.log(file)
      // 监听文件变化，增减文件时都会被子组件调用
    },
    handleError(err, file, fileList) {},
    handlePreview(file) {},
    beforeUpload(file) {},
    handleProgress(event, file, fileList) {},
    handleSucccess(response, file, fileList) {},
    handleExceed(files, fileList) {},
    handleRemove(file, fileList) {
      if (file && file.status === 'success') {
        //移除前方法
        let _self = this
        console.log(file)
        uniUtils.minioClient.removeObject('baotai', file.name, function (err) {
          if (err) {
            return console.log('Unable to remove object', err)
          }
          if (file.hasOwnProperty('file')) {
            for (let index in _self.musicFiles) {
              if (_self.musicFiles[index].uid === file.uid) {
                _self.musicFiles.splice(index, 1)
                return
              }
            }
          }
          _self.saveFlag = false
          _self.musicParams.deleteFlag = 1
          _self.musicParams.productId = _self.productId //等后台那边id精度问题解决了 可以注释调
          _self.musicFiles = fileList
        })
      }
    },
    beforeRemove(file, fileList) {
      if (file && file.status === 'success') {
        //移除前方法
        return this.$confirm(`确定移除 ${file.name}？`)
      }
    },

    //-------------背景音乐素材上传----------
    addModule(index) {
      //这里添加模块有两种情况1.从中间加；2.从尾部加。

      if (index + 1 < this.moduleList.length) {
        //属于情况1
        let orderNum = this.moduleList[index].orderNum + 1
        this.moduleList.splice(index + 1, 0, { orderNum: orderNum })
        this.moduleList.forEach((item, subscript) => {
          if (subscript > index + 1) {
            this.$set(item, 'orderNum', item.orderNum + 1)
            // item.orderNum = item.orderNum + 1
          }
        })

        this.$forceUpdate()
        console.log('情况1中间加:', index, this.moduleList)
      } else {
        //属于情况2
        let orderNum = this.moduleList[index].orderNum + 1
        this.moduleList.push({ orderNum: orderNum })

        this.$forceUpdate()
        console.log('情况2尾部加:', index, this.moduleList)
      }
      //   this.updateOrder = this.updataOrder(this.moduleList)
      //---------
      setTimeout(() => {
        //页面渲染不及时 会报错
        this.$refs['upload_Module'][index + 1].initUploadSortn() //ref与v-for使用回返回一个元素节点数组 解决上传视频，模块ID传参不正常的问题
      }, 50)
      //---------
      console.log(index, this.moduleList)
    },
    closeModule(index, id) {
      if (this.moduleList[index].id || this.moduleList[index].id === '0' || this.moduleList[index].id === 0) {
        var moId = this.moduleList[index].id
      } else {
        var moId = ''
      }
      deleteModule({ id: moId }, false, '删除成功').then(result => {
        this.moduleList.forEach((item, subscript) => {
          if (subscript > index) {
            this.$set(item, 'orderNum', subscript)
            //   item.orderNum = subscript
          }
        })
        this.moduleList.splice(index, 1) //这个不能先于循环执行
        //更新顺序
        let updateOrder = this.updataOrder(this.moduleList)
        updateModuleNum({ moduleNumList: updateOrder }, false, false).then(result => {})
      })
      //---------
      this.$refs['upload_Module'].forEach(item => {
        item.initUploadSortn() //解决上传视频，模块ID传参不正常的问题
      })
      //---------
      console.log(index, id, this.moduleList)
    },
    updataOrder(arryData = []) {
      let orderArr = []
      arryData.forEach(item => {
        orderArr.push({ orderNum: item.orderNum, id: item.id ? item.id : '' })
      })
      return orderArr
    },

    editModule(index) {
      this.$router.push({ path: '/avs/itemEdit', query: { moudleId: this.moduleList[index].id, productId: this.productId } })
    },
    templateMerge() {
      //   return false
      let checkArry = []
      this.moduleList.forEach((item, index) => {
        if (!item.sourceUrl) {
          item.checkSourceUrl = true
          checkArry.push(index)
        } else {
          item.checkSourceUrl = false
        }
      })
      this.$forceUpdate()

      if (checkArry.length !== 0) {
        this.$confirm('请上传源视频', '提示', {
          confirmButtonText: '确定',
          showCancelButton: false,
          type: 'warning'
        })
        return false
      }
      if (!this.saveFlag) this.saveMate()
      createTempate({ prodId: this.productId }, false, '合成成功').then(result => {
        setTimeout(() => {
          this.$router.push({ path: '/avs/templateConf/moduleMerge', query: { productId: this.productId } })
        }, 1000)
      })
    },
    stepJump() {
      this.$router.push({ path: '/avs/templateConf/moduleMerge', query: { productId: this.productId } })
    }
  }
}
</script>
<style lang='scss' scoped>
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
    background: #fbfbfb;
    display: flex;
    align-content: center;
    // justify-content: center;
    flex-direction: column;
    padding: 50px 0;
    box-sizing: border-box;
    /deep/ .el-input {
      input {
        width: 100% !important;
      }
      //   width: 60%;
    }
    .product-name {
      width: 60%;
      margin: 0 auto;
    }
  }
  .right-area {
    width: 69%;
    height: 100%;
    // background: red;
    background: #fbfbfb;
    display: flex;

    padding: 20px 0;
    flex-direction: column;
    align-items: center;
    overflow-y: auto;
  }
  .svg-style {
    margin-bottom: 20px;
  }
}
</style>
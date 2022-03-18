<template>
  <div>
    <el-upload
      class="upload-demo"
      action
      ref="upload"
      :on-remove="handleRemove"
      :before-remove="beforeRemove"
      :limit="100"
      :on-exceed="handleExceed"
      :show-file-list="true"
      multiple
      :file-list="showFile"
      :auto-upload="false"
      :on-change="changeFile"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传</el-button>-->
      <div slot="tip" class="el-upload__tip">文件大小不超过5M</div>
    </el-upload>
  </div>
</template>
<script>
import { uploadFile } from '@/api/modList'

export default {
  name: 'multiUpload',
  props: {
    uploadType: {
      type: [String, Number],
      default: ''
    },
    fileLists: { type: [Array, String], default: () => [] },
    disable: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    fileLists: function(v) {
      this.showFile = []
      this.fileLists.forEach(e => {
        this.showFile.push({ name: e.fileName, status: 'ready', id: e.id })
      })
    }
  },
  data() {
    return {
      show_file: true,
      uploadFileArry: [],
      showFile: []
      // fileLists: [{ name: 'food.jpg', url: 'https://xxx.cdn.com/xxx.jpg' }]
    }
  },

  methods: {
    changeFile(file, fileList) {
      this.uploadFileArry = []
      fileList.forEach(v => {
        if (v.raw) {
          this.uploadFileArry.push(v.raw)
          this.showFile.push({
            name: v.raw.name,
            status: 'ready',
            id: v.raw.uid
          })
        }
        /* this.show_file.push({
           name: v.fileName, status: 'ready', id: e.id 
        }) */
      })
    },
    /***
     * 通过发送事件来分别获取不同的上传文件url
     */
    emitEvent(val) {
      this.$emit('fileSubmit', val)
    },
    submitUpload() {
      // this.$refs.upload.submit()
      if (this.uploadFileArry && this.uploadFileArry.length !== 0) {
        let formData = new FormData()
        this.uploadFileArry.forEach(v => {
          formData.append('files', v)
        })
        uploadFile(formData, this.uploadType).then(res => {
          if (res.status === '1') {
            this.show_file = true
            this.emitEvent(res)
          } else {
            this.$message.error(res.message)
            this.emitEvent('')
          }
        })
      }
    },
    /* uploadFiles() {
      :http-request="uploadFiles"
      const _file = params.file
      const isLt5M = _file.size / 1024 / 1024 < 5
        if (!isLt5M) {
        this.$message.error('请上传5M以下的文件')
        return false
      } 
      // 通过 FormData 对象上传文件
      let formData = new FormData()
       formData.append('files', _file)
      uploadFile(formData, this.uploadType).then(res => {
        if (res.status === '1') {
          this.show_file = true
          this.emitEvent(res)
        } else {
          this.$message.error(res.message)
          this.emitEvent('')
        }
      })
    }, */
    handleRemove(file, fileList) {
      this.uploadFileArry = []
      fileList.forEach(v => {
        if (v.raw) this.uploadFileArry.push(v.raw)
      })
      this.$emit('cancelUpload', file, fileList)
    },

    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    }
    /* :on-success="handleSuccess"
      :on-error="handleError" // 上传成功钩子
    handleSuccess(_res, _file, fileList) {
      console.log('successs::::', _res, _file, fileList)
      // this.processFileList(fileList)
    },
    // 上传失败的钩子
    handleError(err, _file, fileList) {
      if (err.code !== 200) {
        this.$message({
          message: err.message || '上传失败',
          type: 'warning'
        })
      }
      // this.processFileList(fileList)
    } */
  }
}
</script>
<style>
</style>



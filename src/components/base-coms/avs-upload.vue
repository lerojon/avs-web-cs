<template>
  <div :class="['up-load--body']" :style="styles">
    <div>
      <el-upload
        :class="['upload-demo',otherStyle]"
        action
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :on-change="handleChange"
        :on-error="handleError"
        :on-progress="handleProgress"
        :http-request="httpRequest"
        :on-success="handleSucccess"
        :before-upload="beforeUpload"
        multiple
        :limit="limit"
        :accept="accept"
        :on-exceed="handleExceed"
        :file-list="fileList"
      >
        <!-- <div class="double-box" style="display:flex;"> -->
        <div @click="oneEvent" style="display:flex; align-items:center;color: #333333 !important;">
          <div slot="tip" v-if="title && !double">{{title}}</div>
          <div :class="['up-load--area',{'double-style':double,'backgroundFlag':backgroundFlag}]">
            <i class="el-icon-upload"></i>
            <div style="margin-left:7px;">{{upLoadTitle}}</div>
          </div>
        </div>

        <div @click="doubleEvent" v-if="double" :class="['up-load--area',{'double-two':double}]">
          <i class="el-icon-upload"></i>
          <div style="margin-left:7px;">{{doubleTitle}}</div>
        </div>
        <!-- </div> -->
      </el-upload>
    </div>
  </div>
</template>
<script>
export default {
  name: 'avsUpload',
  components: {},
  props: {
    title: {
      type: String,
      default: ''
    },

    styles: {
      type: String,
      default: ''
    },
    upLoadTitle: {
      type: String,
      default: '点击上传'
    },
    doubleTitle: {
      type: String,
      default: '点击上传'
    },
    double: {
      type: Boolean,
      default: false
    },
    limit: {
      type: Number,
      default: 3
    },
    fileList: {
      type: Array
    },
    accept: {
      type: [String]
    },
    otherStyle: {
      type: [String]
    },
    backgroundFlag: Boolean,
    handlePreview: Function,
    handleRemove: Function,
    beforeRemove: Function,
    handleExceed: Function,
    handleChange: Function,
    handleError: Function,
    handleProgress: Function,
    httpRequest: Function,
    handleSucccess: Function,
    hamdleProgress: Function,
    beforeUpload: Function
  },
  data() {
    return {
      //   fileList: []
    }
  },
  watch: {},
  computed: {},
  methods: {
    oneEvent() {
      this.$emit('oneEvent')
    },
    doubleEvent() {
      this.$emit('doubleEvent')
    }
    /*  handleRemove(file, fileList) {
      this.$emit('handleRemove', file, fileList)
    } */
  }
}
</script>
<style lang='scss' scoped>
.up-load--body {
  display: flex;
  //   justify-content: center;
}
.up-load--area {
  display: flex;
  border: 1px solid #d9d9d9;
  padding: 8px;
  justify-content: center;
  align-content: center;
  color: #333333 !important;
}
/* .double-box {
  display: flex;
  justify-content: space-between;
} */
.double-style {
  border: 1px solid #4686f2;
  color: #4686f2 !important;
  background: #f2f7ff;
  //   margin-right: 5px;
}
.double-two {
  margin-left: 5px;
}
/deep/ .el-upload {
  display: flex;
  //   justify-content: space-between;
}
.backgroundFlag {
  background: #ffffff;
  border: 1px solid #d9d9d9;

  color: #333333 !important;
}
/deep/.frontHidden .el-upload-list {
  width: 60%;
}
</style>
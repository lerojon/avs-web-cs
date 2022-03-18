<template>
  <el-form-item label v-if="initComplete" :style="itemStyle" :prop="field">
    <div class="label-body">
      <label :style="{color:'#F56C6C'}" v-if="importance">*</label>
      <label style v-text="label"></label>:
    </div>
    <avs-input
      class="child-style"
      v-if="compType == 'avs-input'"
      :label="label"
      ref="formRef"
      :placeholder="placeholder"
      :importance="importance"
      :password="password"
      :textarea="textarea"
      :max="max"
      :maxlength="maxlength"
      :isFullLine="isFullLine"
      :disabled="disabled"
      :field="field"
      :rawData="rawData"
      @change="change"
    ></avs-input>
    <avs-select :mulitFlag="mulitFlag" class="child-style" v-if="compType == 'avs-select'"></avs-select>
  </el-form-item>
</template>
<script>
import avsInput from './avs-input'
import avsSelect from './avs-select'
export default {
  components: {
    avsInput,
    avsSelect
  },
  props: {
    rawData: {
      type: [Object]
    },
    bRegFlag: {
      type: Boolean,
      default: true
    },
    field: {
      type: String
    },
    placeholder: {
      type: String,
      default: ''
    },
    selectPlaceholder: {
      type: String,
      default: '请选择'
    },
    itemStyle: {
      type: String,
      default: ''
    },
    precision: {
      //精度
      type: Number
    },
    isFullLine: {
      //是否整行
      type: Boolean,
      default: false
    },
    compType: {
      //组件类型
      type: String
    },
    label: {
      //左边文字
      type: String,
      default: '未知'
    },
    disabled: {
      //是否禁止
      type: Boolean,
      default: false
    },
    importance: {
      //是否必填
      type: Boolean,
      default: false
    },
    precFlag: {
      //
      type: Boolean,
      default: false
    },
    password: {
      //密码输入框
      type: Boolean,
      default: false
    },
    textarea: {
      //输入框多行
      type: Boolean,
      default: false
    },

    /** 下拉框 */
    opKey: {
      type: String
    },
    isMulti: {
      type: Boolean
    },
    remoteFlag: {
      type: Boolean,
      default: true
    },
    remoteField: {
      type: String
    },
    isCollapse: {
      type: Boolean
    },
    clearable: {
      type: Boolean
    },
    opList: {
      type: Array
    },
    dataType: {
      type: String
    },

    /**上传组件 */
    bSimple: {
      //是否为简单模式,无输入框
      type: Boolean,
      default: false
    },
    upLoadUrl: {
      type: String
    },
    extraOutData: {
      type: Object,
      default: null
    },

    /* 查找输入 */
    subFields: {
      type: Array
    },
    hideSearchBtn: {
      type: Boolean
    },
    isCanEdit: {
      type: Boolean
    },
    itemLabel: {
      type: String,
      default: 'label'
    },
    itemName: {
      type: String,
      default: 'name'
    },

    /**查询数据 */
    queryData: {
      type: Object
    },

    /**时间选择配置 */
    pickOptions: {
      type: Object
    },

    /**下拉查询 */
    showField: {
      type: String
    },

    /**下拉查询子菜单 */
    sublistName: {
      type: String
    },
    iconConf: {
      type: String
    },

    /** 是否禁止 */
    isShow: {
      type: Boolean
    },
    isQuery: {
      type: Boolean,
      default: false
    },
    showField: {
      type: String
    },
    isjiahao: {
      //是否整行
      type: Boolean
    },

    // 是否截取10个
    sliceFlag: {
      type: Boolean,
      default: false
    },
    tipFlag: {
      type: Boolean,
      default: false
    },
    long_item: {
      type: Boolean,
      default: false
    },
    timeNoS: {
      type: Boolean,
      default: false
    },
    yunxishuru: {
      type: Boolean,
      default: false
    },
    rawDataKey: {
      type: String,
      default: ''
    },
    two_clow: {
      // 显示两格长度
      type: Boolean,
      default: false
    },
    opacity: {
      // 空白占位
      type: Boolean,
      default: false
    },
    shurushousuo: {
      type: Boolean,
      default: false
    },
    itemList: {
      type: Array,
      default: function() {
        return []
      }
    },

    //时间段
    startTime: {
      type: String,
      default: '00:00'
    },
    endTime: {
      type: String,
      default: '24:00'
    },
    step: {
      type: Number,
      default: 1
    },
    max: {
      type: Number
    },
    min: {
      type: Number
    },
    maxlength: {
      type: Number,
      default: 100
    },

    //label字多
    duozilabel: {
      type: Boolean,
      default: false
    },
    isSearch: {
      type: Boolean,
      default: false
    },
    editDisabled: {
      type: Boolean,
      default: false
    },
    keyword: {
      type: Boolean
    },
    placement: {
      type: String
    },

    /** 是否带图标 */
    isMore: {
      type: Boolean
    },

    /* 是否显示详细地址输入框 */
    notShowXiangxiqizhi: {
      type: Boolean,
      default: false
    },

    //上传组件是否压缩图片宽高
    needZipImg: {
      type: Boolean,
      default: false
    },

    /*  上传 */
    limit: {
      type: Number,
      default: 9
    },
    dataMore: {
      type: Object
    },
    name: {
      type: String,
      default: 'file'
    },
    uploadType: {
      type: [String, Number],
      default: ''
    },
    showFile: {
      type: Boolean,
      default: true
    },
    // 文件大小
    sizeMax: {
      type: Number,
      default: 5
    },
    // 是否打开文件大小限制
    sizeLimit: {
      type: Boolean,
      default: true
    },
    // 文件格式
    accept: {
      type: String,
      default: 'all'
    },

    isNoBorder: {
      type: Boolean,
      default: false
    },

    // 级联选择
    options: {
      type: Array,
      default: function() {
        return []
      }
    },
    changeOnSelect: {
      type: Boolean,
      default: false
    },
    showAllLevels: {
      type: Boolean,
      default: true
    },
    mulitFlag: {
      type: [Boolean],
      default: false
    }
  },
  data() {
    return {
      /**组件禁止 */
      bForbid: false,
      /** 动态样式 */
      classVal: '',
      /** 静态样式 */
      staticclassVal: '',

      // 数据
      params: [],
      initComplete: false //数据初始化完成
    }
  },
  watch: {
    //声明时变为一个对象，原来的函数被套在handler属性里边
    //另外可以添加其他属性
  },
  mounted() {
    this.initData()
    this.initComplete = true
  },
  methods: {
    /**表格column设置焦点 */
    columnSetFocus() {
      let refObj = this.$refs.columnRef
      if (wllib.detect.wlIsNotNull(refObj)) {
        refObj.setFocus()
      }
    },

    /**组件基类设置焦点 */
    setFocus() {
      let refObj = this.$refs.compRef
      if (wllib.detect.wlIsNotNull(refObj)) {
        refObj.focus()
      }
    },

    initData() {
      this.staticclassVal = ''
      this.dynamicClass = ''
      this.classVal = {}
      this.bForbid = false

      // if (!this.rawData[this.field]) this.$set(this.rawData, this.field, null)
      this.regComp()
    },

    /** 更新验证样式 */
    updateValidateClass() {
      let cls = this.classVal
      let flag = false
      if (flag) {
        cls.pass = true
        cls.fail = false
      } else {
        cls.pass = false
        cls.fail = true
      }
      return flag
    },

    /** 重置验证样式 */
    resetValidateClass() {
      let cls = this.classVal
      cls.pass = false
      cls.fail = false
    },

    handleItemChange(val, param) {
      this.$emit('handleItemChange', val, param)
    },

    formHandler(param) {
      this.$emit('formHandler', param)
    },

    queryResult(param) {
      this.$emit('queryResult', param)
    },

    addSome(param) {
      this.$emit('addSome', param)
    },
    change(val) {
      this.$emit('change', val)
    },
    blur() {
      this.$emit('blur')
    },

    focus(event) {
      this.$emit('focus', event)
    },

    handleKeyup() {
      this.$emit('keyupEnter')
    },

    search(data) {
      this.$emit('search', data)
    },

    iconClick() {
      this.$emit('iconClick')
    },

    iconClick1() {
      this.$emit('iconClick1')
    },

    keyupEnter() {
      this.$emit('keyupEnter')
    },

    handleRemove(file, fileList) {
      this.$emit('handleRemove', file, fileList)
    },

    fileSubmit(val) {
      this.$emit('fileSubmit', val)
    },

    regComp() {
      this.$emit('regComp', { field: this.field, compType: this.compType, label: this.label, importance: this.importance })
    },

    type() {
      if (this.password) {
        return 'password'
      } else if (this.textarea) {
        return 'textarea'
      }
      return ''
    },
    getMaxLength() {
      if (this.textarea) {
        return 10000
      } else {
        return this.maxlength
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/*--  */
/deep/ .el-form-item__content {
  display: -webkit-box;
  width: 100%;
  display: flex;
  align-content: center;
  .span-icon {
    width: 20px;
    height: 20px;
    display: block;
    text-align: center;
    line-height: 18px;
    border-radius: 100%;
    color: #027aff;
    border: 1px solid #027aff;
    margin-left: 20px;
  }
  .label-body {
    text-align: right;
    width: 20%;
    margin-right: 10px;
  }
}
.child-style {
  width: 60%;
}
/* -- */
/deep/ .el-input {
}

/deep/ input {
  background: none !important;
  outline: none !important;
  border: 1px solid #e8e8e8 !important;
}

/deep/ .el-range-editor {
  border: none;
}

/deep/ .el-range__icon {
  margin-left: -15px !important;
}
/deep/ .el-range-separator {
  padding: 0 !important;
}

/deep/ .el-range-editor.is-disabled {
  background: #fff;
}
</style>
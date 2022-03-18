<template>
  <!-- v-model="rawData[field]" -->
  <el-input
    v-model="rawData[field]"
    :type="type"
    :resize="resize"
    :maxlength="getMaxLength"
    :placeholder="placeholder"
    :clearable="isClearable"
    :disabled="isDisabled"
    :size="size"
    :prefix-icon="prefixIcon"
    :suffix-icon="suffixIcon"
    :rows="rows"
    :autosize="autosize"
    :auto-complete="autoComplete"
    @keyup.enter.native="handleKeyup"
    @blur="blur"
    @focus="focus"
    @change="change"
  ></el-input>
</template>
<script>
export default {
  props: {
    rawData: {
      type: [Object],
      default: () => {
        return {}
      }
    },
    field: {
      type: [String]
    },
    isFullLine: {
      //是否整行
      type: [Boolean],
      default: false
    },
    max: {
      type: [Number]
    },
    password: {
      //类型
      type: [Boolean],
      default: false
    },
    textarea: {
      type: [Boolean],
      default: false
    },
    resize: {
      type: [String],
      default: 'none'
    },
    maxlength: {
      //最大输入长度
      type: [Number]
    },
    placeholder: {
      //输入框占位文本
      type: [String],
      default: ''
    },
    isClearable: {
      //是否可清空
      type: [Boolean],
      default: false
    },
    isDisabled: {
      //是否禁用
      type: [Boolean],
      default: false
    },
    size: {
      //输入框尺寸，只在 type!="textarea" 时有效 可选medium / small / mini
      type: [String]
    },
    prefixIcon: {
      //输入框头部图标
      type: [String]
    },
    suffixIcon: {
      //输入框尾部图标
      type: [String]
    },
    rows: {
      //输入框行数，只对 type="textarea" 有效
      type: [Number],
      default: 2
    },
    autosize: {
      //自适应内容高度，只对 type="textarea" 有效，可传入对象，如，{ minRows: 2, maxRows: 6 }
      type: [Boolean, Object],
      default: false
    },
    autoComplete: {
      //原生属性，自动补全 on off
      type: [String],
      default: 'off'
    }
  },
  data() {
    return {
      inputValue: '',
      paramData: {}
    }
  },
  computed: {
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
  },
  mounted() {},
  methods: {
    blur() {
      this.$emit('blur')
    },
    focus() {
      this.$emit('focus')
    },
    change(e) {
      /* if (this.max && this.rawData[this.field] && this.rawData[this.field].length > this.max) {
        this.rawData[this.field] = this.rawData[this.field].slice(0, this.max)
        this.$message({
          message: '超出最大长度' + this.max,
          type: 'warning'
        })
      } */
      //   this.rawData[this.field] = this.rawData[this.field].trim()
      this.$emit('change', this.rawData)
    }
  }
}
</script>
<style lang="scss" scoped>
</style>
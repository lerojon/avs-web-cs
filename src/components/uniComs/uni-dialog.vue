<template>
  <div>
    <el-dialog :title="title" class="dialog-style" :width="width" :before-close="handleClose" :visible.sync="dialogVisible">
      <span slot="title">
        <slot name="titleDefault"></slot>
      </span>
      <div class="input-body--style">
        <slot name="inputBody"></slot>
      </div>
      <span slot="footer" class="btn-body--style">
        <slot name="btnBody"></slot>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import { validBlank } from '@/utils/validate'

export default {
  components: {},
  props: {
    width: {
      type: [String],
      default: '40%'
    },
    title: {
      type: [String],
      default: ''
    }
  },
  watch: {},

  data() {
    return {
      dialogVisible: false
    }
  },
  methods: {
    openDia() {
      this.dialogVisible = !this.dialogVisible
    },
    handleClose(done) {
      done()
      if (this.$slots.inputBody[0] && this.$slots.inputBody[0].context.dataForm) this.$slots.inputBody[0].context.dataForm = {}
    }
  }
}
</script>
<style lang='scss' scoped>
.input-body--style {
  width: 80%;
  margin: 0 auto;
}
.btn-body--style {
  text-align: right;
}
.dialog-style {
  border-radius: 8px;
}
/deep/ .el-dialog {
  border-radius: 8px;
}
</style>
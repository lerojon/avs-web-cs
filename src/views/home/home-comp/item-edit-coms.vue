<template>
  <div class="adv-style">
    <div class="double-input">
      <el-form-item prop="moduleName">
        <el-input :clearable="true" :value="value" @input="update" class="child-style" placeholder></el-input>
      </el-form-item>
      <!-- <div class="el-icon-minus"></div>
      <el-form-item prop="moduleName">
        <el-input class="child-style" placeholder></el-input>
      </el-form-item>-->
    </div>
    <!-- <div class="double-input">
      <el-form-item prop="moduleType">
        <el-select class="child-style" placeholder>
          <el-option label="险种一" value="shanghai"></el-option>
          <el-option label="险种二" value="beijing"></el-option>
        </el-select>
      </el-form-item>
    </div>-->
    <svg-icon @svgEvent="closeEvent" icon-class="close-icon"></svg-icon>
  </div>
</template>
<script>
export default {
  name: 'itemComs',
  data() {
    return {}
  },
  props: {
    value: {
      type: [Number, String]
    }
  },
  methods: {
    closeEvent() {
      this.$emit('closeEvent')
    },
    update(val) {
      console.log(val, 'afasfa')
      this.$emit('input', val)
    }
  }
}
</script>
<style lang='scss' scoped>
.adv-style {
  margin-left: 20px;
  display: flex;
  align-items: center;
  //   border-bottom: 1px solid #d8d8d8;
  .double-input {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d8d8d8;
    width: 60%;
    margin-right: 20px;
  }
  /deep/ .el-form-item {
    margin: 0 !important;
    padding: 0;
    width: 100% !important;
    .el-form-item__content {
      width: 100%;
    }
  }
  /deep/ .el-input {
    input {
      background: none;
      outline: none;
      border: none !important;
      text-align: center;
      //   border: 1px solid #e8e8e8 !important;
    }
  }
}
</style>
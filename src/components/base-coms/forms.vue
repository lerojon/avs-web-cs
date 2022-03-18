<template>
  <div>
    <el-form>
      <slot name="mainBody"></slot>
    </el-form>
    <div style="color:#231335;">
      <slot name="otherBody"></slot>
    </div>
  </div>
</template>
<script>
export default {}
</script>
<style lang='scss' scoped>
</style>
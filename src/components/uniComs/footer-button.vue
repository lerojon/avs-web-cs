<template>
  <div class="footer-return--btn">
    <slot></slot>
  </div>
</template>
<script>
export default {}
</script>
<style lang="scss" scoped>
.footer-return--btn {
  position: absolute;
  bottom: 0;
  left: 20px;
  height: 80px;
  width: calc(100% - 40px);
  background: #ffffff;
  box-shadow: 0px -2px 6px 0px rgba(238, 238, 238, 0.46);
  text-align: center;
  line-height: 80px;
  z-index: 999;
}
</style>
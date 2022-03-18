<template>
  <div></div>
</template>

<script>
import { getToken, setToken, removeToken } from '@/utils/auth' // 验权
import { tansParams, NotEmptyFlag } from '@/utils' // 验权
export default {
  name: 'login',
  data() {
    return {}
  },
  created() {
    setToken('this.$route.query.token')
    this.$router.push({ path: '/avs' })
    /*  if (!NotEmptyFlag(this.$route.query.token)) {
      let param = tansParams({ aiavs: 1 })
      window.location.href = `http://10.30.44.72:8002/avs-system/login?${param}` // // `http://localhost:80/avs-system/login?${param}`
    } else {
      setToken(this.$route.query.token)
      this.$router.push({ path: '/avs' })
    } */
  },
  methods: {}
}
</script>

<style lang='scss' scoped>
.stysName {
  position: absolute;
  left: 0;
  top: -100px;
  // transform: translateX(-50%);
  font-size: 25px;
  font-family: SourceHanSansCN-Medium, SourceHanSansCN;
  font-weight: 500;
  text-align: center;
  color: #ffffff;
  width: 100%;
}
.login-form-layout {
  position: relative;
  width: 520px;
  height: 400px;
  left: 50%;
  top: 232px;
  transform: translate(-50%);
  padding: 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 40px;
  .login-form-card {
    position: absolute;
    top: 20px;
    left: 20px;
    background: #ffffff;
    border-radius: 20px;
    width: 480px;
    height: 360px;
    z-index: 9;
    padding: 29px 55px 79px;
  }
}

.login-title {
  text-align: center;
}

.login-center-layout {
  background: #409eff;
  position: fixed;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100vw;
  height: 100vh;
}
.pasuser {
  border-bottom: 1px solid #e6e6e6;
}
/deep/ .el-input__inner {
  border: none;
  padding: 0;
}
.secondBut {
  display: flex;
  justify-content: space-between;
  .itembtn {
    width: 64px;
    height: 14px;
    font-size: 14px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #027aff;
    line-height: 21px;
  }
}
/deep/ .el-form-item__content {
}
</style>

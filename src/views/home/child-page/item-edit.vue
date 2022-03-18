<template>
  <!-- 这里可以考虑封装成一个组件 -->
  <div>
    <el-form :model="dataForm" :rules="rules" ref="dataForm">
      <div>
        <p>基础信息</p>
        <div class="modele-item">
          <el-form-item label="模块名称：" prop="moduleName">
            <el-input class="child-style noBorder" disabled v-model="dataForm.moduleName" placeholder="模块名称"></el-input>
          </el-form-item>
          <el-form-item label="模块类别：" prop="moduleCategory">
            <el-select class="child-style" v-model="dataForm.moduleCategory" placeholder="请选择模块类别">
              <el-option v-for="item in moduleTypeList" :key="item.code" :label="item.codeName" :value="item.codeName"></el-option>
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="备注：" prop="productName">
            <el-input class="child-style" v-model="dataForm.productName" placeholder="请输入产品名称"></el-input>
          </el-form-item>-->
        </div>
      </div>
      <!-- no2 -->
      <div>
        <p>基础属性</p>
        <div class="modele-item base-style">
          <div class="base-item">模块格式：{{moduleFormat}}</div>
          <div class="base-item">模块大小：{{moduleSize}}M</div>
          <div class="base-item">模块时长：{{moduleTime}}</div>
          <div class="base-item">上传时间：{{moduleCreateTime}}</div>
        </div>
      </div>
      <!-- no3 -->
      <div class="no3-style">
        <p>必须/非必选配置</p>
        <div class="modele-items">
          <el-form-item label="是否必须：" prop="selectFlag">
            <el-select class="child-style" v-model="dataForm.selectFlag" placeholder="请选择配置类别">
              <el-option v-for="item in selectFlagList" :key="item.id" :label="item.label" :value="item.id"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <transition name="slide-fade">
          <div v-if="selectFlag">
            <div style="margin-bottom:15px;">
              当各字段取值
              <strong style="color:red;">同时</strong> 满足如下要求，选用此模块合成视频：
            </div>
            <div class="big-body">
              <el-button @click="addOption" style="margin-bottom:20px;" type="primary">新增</el-button>
              <!-- 多加一个div好修改加样式 -->
              <div>
                <!-- 循环层 -->
                <div class="out-for" v-for="(item,index) in moduleRuleList" :key="index">
                  <el-form-item class="long-style" :label="(index+1)+'.'" prop="moduleCategory">
                    <el-cascader
                      class="child-style"
                      :show-all-levels="false"
                      :clearable="true"
                      :props="cascaderProps"
                      :options="cascaDerOptions"
                      v-model="item.modelCodes"
                      @change="handleChange"
                    ></el-cascader>
                    <!-- <el-select class="child-style" placeholder="请选择模块类别">
                      <el-option label="险种一" value="shanghai"></el-option>
                      <el-option label="险种二" value="beijing"></el-option>
                    </el-select>-->
                  </el-form-item>
                  <el-form-item label="取值：" prop="operator">
                    <el-select :clearable="true" @change="operatorChange" class="child-style" v-model="item.operator" placeholder="请选择模块类别">
                      <el-option v-for="items in operatorOptions" :key="items.codeName" :label="items.codeName" :value="items.codeName"></el-option>
                    </el-select>
                  </el-form-item>
                  <div>
                    <edit-coms v-model="item.value" @closeEvent="closeEvent(index,item.id)"></edit-coms>
                    <!-- 放一个组件 -->
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>
      </div>
      <!-- no4 -->
      <div>
        <p>其他</p>
        <div class="modele-item textarea-style">
          <el-form-item label="备注：" prop="moduleRemark">
            <el-input
              :autosize="{ minRows: 5, maxRows: 5}"
              resize="none"
              type="textarea"
              class="child-style"
              v-model="dataForm.moduleRemark"
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
        </div>
      </div>
    </el-form>
    <footer-button>
      <el-button @click="goBack">返回</el-button>
      <el-button @click="saveMoudelConf" type="primary">保存</el-button>
      <el-button @click="nextStep" type="primary">下一步</el-button>
      <!-- <el-button @click="moduleMerge" type="primary">模板合成</el-button> -->
    </footer-button>
  </div>
</template>
<script>
import footerButton from '@/components/uniComs/footer-button'
import editComs from '../home-comp/item-edit-coms.vue'
import { getDataMoudle, queryModuleRule, saveModuleMessage, queryModuleMessage, getBaseComm } from '@/api/avs-video'
import * as uniUtils from '@/utils'
export default {
  components: {
    footerButton,
    editComs
  },
  data() {
    return {
      moduleCreateTime: '',
      moduleTime: '',
      moduleSize: '',
      moduleFormat: '',
      requiredFlag: '',
      moduleId: '',
      productId: '',
      moduleTypeList: [],
      //   cascaDerOptions: [],
      operatorOptions: [],
      selectFlagList: [
        { id: 'required', label: '必选' },
        { id: 'unrequired', label: '非必选' }
      ],
      moduleRuleList: [
        {
          id: '',
          modelCodes: [], //第一个框的值
          operator: '', //第二个框的值 操作符
          value: '', //第三个框的值
          deleteFlag: 0 //是否删除,0未删除,1已删除
        }
      ],
      //---------
      cascaderProps: {
        label: 'fieldName',
        value: 'fieldName',
        children: 'childrenList'
      },
      selectedOptions: '',
      cascaDerOptions: [],
      //---------
      dataForm: {
        moduleName: '',
        moduleCategory: '',
        selectFlag: 'required', //默认必选
        moduleRemark: ''
      },
      rules: {}
    }
  },
  created() {
    this.moduleId = this.$route.query.moudleId
    this.productId = this.$route.query.productId
    this.initPage(this.moduleId, this.productId)
  },
  computed: {
    selectFlag: function () {
      if (this.dataForm.selectFlag === 'required') {
        this.requiredFlag = 1
        return false
      } else {
        this.requiredFlag = 0
        queryModuleRule({ moduleId: this.moduleId }).then(result => {
          console.log('resultqueryModuleRule:', result)
        })
        return true
      }
    }
  },
  methods: {
    initPage(moduleId, productId) {
      queryModuleMessage({ id: moduleId }, true, false).then(result => {
        this.moduleCreateTime = result.data.sourceUploadTime
        this.moduleFormat = result.data.moduleFormat
        this.moduleTime = result.data.moduleTime ? result.data.moduleTime : '无模块时长'
        if (result.data.moduleSize) {
          this.moduleSize = (result.data.moduleSize / 1024 / 1024).toFixed(1)
        }
        this.$set(this.dataForm, 'moduleName', result.data.moduleName)
        // this.dataForm.moduleName = result.moduleName
        this.dataForm.moduleCategory = result.data.moduleCategory
        this.dataForm.moduleRemark = result.data.moduleRemark
        if (result.data && result.data.moduleRuleList.length > 0) {
          this.dataForm.selectFlag = 'unrequired'
          this.requiredFlag = 0
          let ruleList = result.data.moduleRuleList
          ruleList.forEach((item, index) => {
            this.moduleRuleList[index] = {}
            this.moduleRuleList[index].modelCodes = [item.modelCode, item.modelCodeChild]
            this.moduleRuleList[index].operator = item.operator
            this.moduleRuleList[index].value = item.value

            this.moduleRuleList[index].id = item.id
            this.moduleRuleList[index].deleteFlag = item.deleteFlag
          })
        }

        console.log('result-------:', result, this.dataForm)
      })

      //必须/非必选配置 第二个值
      getBaseComm({ parentCode: 'module_operator_type' }).then(result => {
        this.operatorOptions = result.data
      })

      queryModuleRule({ moduleId: this.moduleId }).then(result => {
        //用于回显
        let ruleList = result.data
        /* ruleList.forEach((item, index) => {
          this.moduleRuleList[index] = {}
          this.moduleRuleList[index].modelCodes = [item.modelCode, item.modelCodeChild]
          this.moduleRuleList[index].operator = item.operator
          this.moduleRuleList[index].value = item.value
          this.moduleRuleList[index].moduleId = item.moduleId
          this.moduleRuleList[index].id = item.id
          this.moduleRuleList[index].deleteFlag = item.deleteFlag
        }) */
        // this.moduleRuleList = ruleList
        console.log('resultqueryModuleRule-----:', result, this.moduleRuleList)
      })

      getBaseComm({ parentCode: 'module_type' }).then(result => {
        this.moduleTypeList = result.data
      })

      getDataMoudle({ productId: productId }, false, false).then(result => {
        this.cascaDerOptions = result.data
        console.log('resultgetDataMoudle:', result)
      })
      this.$forceUpdate()
    },
    handleChange(e) {
      console.log('handleChange:', e, this.moduleRuleList)
    },
    goBack() {
      this.$router.go(-1)
    },
    saveMoudelConf() {
      let lastParamArr = this.initParam(this.moduleRuleList, this.requiredFlag)
      saveModuleMessage(lastParamArr, false, '保存成功').then(result => {
        console.log('saveMoudelConf:', result, this.moduleRuleList, lastParamArr)
      })
    },
    initParam(arry, required_flag) {
      let lastParamArr = {}
      let reRuleParam = uniUtils.deepClone(arry)
      reRuleParam.map(item => {
        item.modelCode = item.modelCodes[0]
        item.modelCodeChild = item.modelCodes[1]
        delete item.modelCodes
        delete item.id
      })

      lastParamArr.id = this.moduleId
      lastParamArr.moduleRuleList = reRuleParam
      lastParamArr.requiredFlag = required_flag
      lastParamArr.moduleRemark = this.dataForm.moduleRemark
      lastParamArr.moduleCategory = this.dataForm.moduleCategory
      lastParamArr.moduleName = this.dataForm.moduleName
      if (required_flag === 1) delete lastParamArr.moduleRuleList

      return lastParamArr
    },
    closeEvent(index, id) {
      /* let reParam = uniUtils.deepClone(this.moduleRuleList)
      reParam[index].deleteFlag = 1 */
      this.moduleRuleList.splice(index, 1)
      console.log('closeEvent:', index, id)
    },
    addOption() {
      this.moduleRuleList.push({
        id: '',
        modelCodes: [], //第一个框的值
        operator: '', //第二个框的值 操作符
        value: '', //第三个框的值
        deleteFlag: 0 //是否删除,0未删除,1已删除
      })
      console.log(this.moduleRuleList)
    },
    operatorChange(item) {
      this.$forceUpdate()
    },
    nextStep() {
      //跳转到研究院的页面

      window.location.href = `http://172.27.28.196:8002/aimm-media/edit?projectId=${this.productId}&moduleId=${this.moduleId}`
    }
  }
}
</script>
<style lang='scss' scoped>
p {
  font-family: SourceHanSansCN-Bold;
  font-size: 14px;
  color: #515151;
  font-weight: 700;
}
.modele-item {
  display: flex;
  border-bottom: 1px solid #f8f8f8;
  padding-bottom: 20px;
  margin-bottom: 50px;
  //   width: 100%;
  //   justify-content: space-between;
}
.modele-items {
  display: flex;
}
.no3-style {
  border-bottom: 1px solid #f8f8f8;
  padding-bottom: 20px;
  margin-bottom: 50px;
}
.textarea-style /deep/.el-form-item {
  display: flex;
  flex-direction: column;
  /* flex-wrap: nowrap; */
  /* justify-content: space-evenly; */
  align-items: flex-start;
  width: 100%;
}
.textarea-style /deep/ .el-form-item__content {
  width: 100%;
}
.base-style {
  justify-content: space-between;
  padding-bottom: 40px;
  padding-right: 120px;
}
/deep/ .el-form-item {
  display: flex;
  width: 40%;
}
.child-style {
  width: 100%;
}
/deep/ .el-form-item__content {
  width: 50%;
}
/* .child-style:nth-of-type(1) {
  margin-right: 180px;
} */
.out-for {
  display: flex;
}
.out-for /deep/ .el-form-item {
  display: flex;
  width: auto !important;
}
.out-for .long-style {
  width: 35% !important;
  /deep/ .el-form-item__content {
    width: 90% !important;
  }
}
.out-for /deep/ .el-form-item__content {
  width: 76%;
}
.big-body {
  background: #f9faff;
  width: 80%;
  padding: 20px;
}
// -------
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.slide-fade-enter-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter, .slide-fade-leave-to
/* .slide-fade-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
.noBorder /deep/ input {
  border: none !important;
}
</style>
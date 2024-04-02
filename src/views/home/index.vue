<template>
  <div class="app-container">
    <!-- 表格 -->
    <table-el
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      @colClick="colClick"
      @addNewProduct="addNewProduct"
      :tableHeight="tableHeight"
      :dataObj="dataObj"
      :total="pageTotal"
    ></table-el>
    <!-- 新增产品弹窗 -->
    <uni-dialog ref="dialogRef">
      <template slot="inputBody">
        <el-form :model="dataForm" :rules="rules" ref="dataForm">
          <el-form-item label="产品名称：" prop="productName">
            <el-input class="child-style" v-model="dataForm.productName" placeholder="请输入产品名称"></el-input>
          </el-form-item>
          <el-form-item label="险种：" prop="insuranceType">
            <el-select class="child-style" v-model="dataForm.insuranceType" placeholder="请选择险种">
              <el-option v-for="item  in options" :key="item.code" :label="item.codeName" :value="item.codeName"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-if="eventFlag==='edits'" label="备注：" prop="remark">
            <el-input class="child-style" v-model="dataForm.remark" placeholder></el-input>
          </el-form-item>
        </el-form>
        <!-- <avs-forms>
          <template slot="mainBody">
            <avs-forms-item
              v-for="(item , index) in confData"
              :key="index"
              :field="item.field"
              :placeholder="item.placeholder"
              :importance="item.importance"
              :label="item.label"
              :compType="item.compType"
              :rawData="state"
              :mulitFlag="item.mulitFlag"
              @change="change"
            ></avs-forms-item>
          </template>
        </avs-forms>-->
      </template>
      <template slot="btnBody">
        <div class="dialog-footer">
          <el-button @click="cancel">取 消</el-button>
          <el-button @click="comfir(dataForm)" type="primary">确 定</el-button>
        </div>
      </template>
    </uni-dialog>
  </div>
</template>

<script>
import { productList, getBaseComm, addProduct, productEdit, deleteProduct } from '@/api/avs-video'
import * as uniUtils from '@/utils'
import { str2Date } from '@/utils/date'
import tableEl from '@/components/uniComs/table-el'
import uniDialog from '@/components/uniComs/uni-dialog'
// import avsForms from '@/components/base-coms/forms'
// import avsFormsItem from '@/components/base-coms/form-item'
import { templateConf } from '@/templateconfig/index-dialog--conf'
const { log } = console

export default {
  name: 'avs',
  components: {
    tableEl,
    uniDialog
  },
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      pageTotal: 0,
      productId: '',
      options: this.$simulate.insurance_list,
      // confData: templateConf,
      eventFlag: '', //点击类型
      tableHeight: window.innerHeight - 340,
      state: { conf: templateConf },
      dataForm: {
        productName: '',
        insuranceType: '',
        remark: ''
      },
      rules: {
        productName: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
        insuranceType: [{ required: true, message: '请选择险种', trigger: 'blur' }]
      },
      dataObj: {
        // 定义table的模板和数据
        tableData: [],
        tabledefind: [
          {
            type: 'ordinary',
            label: '序号',
            width: '180',
            prop: ''
          },
          {
            type: 'ordinary',
            label: '险种',
            width: '180',
            prop: 'insuranceCategory'
          },
          {
            type: 'ordinary',
            label: '产品名称',
            width: '180',
            prop: 'productName'
          },
          {
            type: 'specific',
            label: '操作',
            width: '180',
            btns: [
              {
                btn: '编辑',
                flag: 'edit',
                type: 'text',
                size: 'small'
              },
              {
                btn: '模板列表',
                flag: 'templateList',
                type: 'text',
                size: 'small'
              },
              {
                btn: '模板配置',
                flag: 'templateConf',
                type: 'text',
                size: 'small'
              },
              {
                btn: '删除',
                flag: 'delete',
                type: 'text',
                size: 'small'
              }
            ]
          }
        ]
      },

      param_arr: []
    }
  },
  mounted() {
    this.queryDir()
  },
  created() {
    this.getTableList(this.pageSize, this.currentPage)
    console.log('indexpage')
  },
  watch: {
    /* state: {
      handler() {
        if (this.state.conf && this.state.conf.length) {
          this.state.conf.forEach(item => {
            if (item.watch) {
              item.watch.func(this.state.conf, this.state[item.field])
            }
          })
        }
      },
      deep: true
    } */
  },
  methods: {
    getTableList(pageSize, currentPage) {
      productList({
        page: {
          size: pageSize,
          current: currentPage
        }
      }).then(res => {
        this.dataObj.tableData = res.data.records
        this.pageTotal = res.data.total * 1
        console.log(typeof this.pageTotal)
      })
    },
    //字典查询
    queryDir(paramData = 'risk_type') {
      getBaseComm({ parentCode: paramData }, false, false).then(res => {
        this.options = res.data
      })
    },
    change(val) {
      this.param_arr.push(val)
    },
    cancel() {
      //   this.resetForm()
      this.$refs.dialogRef.openDia()
    },
    comfir(dataForm) {
      this.$refs['dataForm'].validate(valid => {
        if (valid) {
          let queryObj = {
            productName: this.dataForm.productName || '',
            insuranceCategory: this.dataForm.insuranceType || '',
            productId: this.productId,
            productRemark: this.dataForm.remark || ''
          }
          if (this.eventFlag === 'adds') {
            delete queryObj.productId
            delete queryObj.productRemark
            addProduct(queryObj, false, '添加成功').then(res => {
              this.$refs.dialogRef.openDia()
              this.resetForm()
              this.getTableList(10, 1)
            })
          } else {
            productEdit(queryObj, false, '编辑成功').then(res => {
              this.$refs.dialogRef.openDia()
              this.resetForm()
              this.getTableList(this.pageSize, this.currentPage)
            })
          }

          //   alert('submit!')
        } else {
          return false
        }
      })
    },
    addNewProduct() {
      this.eventFlag = 'adds'
      //这里可以先验证this.dataForm是否为对象
      for (var key in this.dataForm) {
        this.$set(this.dataForm, key, '')
      }
      this.$refs.dialogRef.openDia()
    },
    colClick(val) {
      if (val.itemsFlag === 'edit') {
        this.eventFlag = 'edits'
        this.productId = val.productId
        this.dataForm.productName = val.productName
        this.dataForm.insuranceType = val.insuranceCategory
        this.dataForm.remark = val.productRemark
        this.$refs.dialogRef.openDia()
      } else if (val.itemsFlag === 'templateList') {
        this.$router.push({ path: '/avs/templateList', query: { productId: val.productId } })
      } else if (val.itemsFlag === 'templateConf') {
        this.$router.push({ path: '/avs/templateConf', query: { productId: val.productId } })
      } else if (val.itemsFlag === 'delete') {
        this.$confirm('此操作将永久删除, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
          .then(() => {
            deleteProduct({ productId: val.productId }, true, false).then(res => {
              this.getTableList(this.pageSize, this.currentPage)
            })
            /* this.$message({
            type: 'success',
            message: '删除成功!'
          }) */
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          })
      }
    },

    resetForm() {
      this.$refs['dataForm'].resetFields()
    },
    //分页------
    handleSizeChange(val) {
      this.pageSize = val
      this.getTableList(this.pageSize, this.currentPage)
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getTableList(this.pageSize, this.currentPage)
    }
    //分页------
  }
}
</script>

<style lang='scss' scoped>
/deep/ .el-form-item {
  display: flex;
  width: 100%;
}
/deep/ .el-form-item__label {
  width: 25%;
}

/deep/ input {
  background: none !important;
  outline: none !important;
  border: 1px solid #e8e8e8 !important;
}
/deep/ .el-form-item__content {
  // display: -webkit-box;
  width: 75%;
  /* display: flex;
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
  } */
}
.child-style {
  width: 100%;
}
.indexPage {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  // margin-top: 5vh;
  // position: absolute;
  // top: 280%;
  // left: 32%;
  // transform: translate(-50%,-50%);
  img {
    width: 600px;
    height: 341px;
  }
  .indexTitle {
    text-align: center;

    font-size: 36px;
    font-family: SourceHanSansCN-Regular, SourceHanSansCN;
    font-weight: 400;
    color: #464646;
    margin-bottom: 80px;
  }
}
</style>

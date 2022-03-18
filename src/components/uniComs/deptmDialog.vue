<template>
  <div>
    <!-- 如果:close-on-click-modal="false" :show-close="false"这两个值不设置就要修改dialog的dialogFormVisible值只能在父组件修改,否则会报错 -->
    <el-dialog width="70%" :close-on-click-modal="false" :show-close="false" :title="title" :visible.sync="dialogFormVisible">
      <el-form class="el_forms" ref="forminfo" :rules="rules" :model="formDialog" label-position="left">
        <!-- -------------合并的项------------- -->
        <el-form-item prop="cdeptName" class="operation" label="部门名称:" :label-width="formLabelWidth">
          <el-input v-model="formDialog.cdeptName" placeholder="请输入部门名称" auto-complete="off"></el-input>
        </el-form-item>
        <!-- 机构 -->
        <el-form-item prop="corgOid" class="operation_select" label="机构名字" :label-width="formLabelWidth">
          <el-select v-model="formDialog.corgOid" @change="selectCorgOid" placeholder="请选择机构名字">
            <el-option v-for="item in organizationList" :key="item.corgOid" :label="item.corgName" :value="item.corgOid"></el-option>
          </el-select>
        </el-form-item>
        <!-- 部门 -->
        <el-form-item prop="cparOiditme" class="operation_select" label="上级部门" :label-width="formLabelWidth">
          <el-select v-model="formDialog.cparOiditme" value-key="cparOid" placeholder="请选择上级部门">
            <el-option v-for="item in DepartmentList" :key="item.cparOid" :label="item.cparName" :value="item"></el-option>
          </el-select>
        </el-form-item>
        <!-- 部门级别 .cparOid-->
        <el-form-item prop="cdeptLevel" class="operation_select" label="部门级别" :label-width="formLabelWidth">
          <el-select v-model="formDialog.cdeptLevel" placeholder="请选择部门级别">
            <el-option v-for="item in DepartmentLevelList" :key="item.id" :label="item.lableName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <!-- -------------合并的项------------- -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogEvent('cancel')">取 消</el-button>
        <el-button type="primary" @click="dialogEvent('confirm')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>


<script>
import { validBlank } from '@/utils/validate'
export default {
  props: {
    dialogFormVisible: {
      type: [String, Boolean],
      default: false
    },
    title: {
      type: [String],
      default: ''
    },

    reShowObj: {
      //编辑时的回显数据
      type: [Array, Object, String],
      default: function() {
        return {}
      }
    },
    organizationList: {
      //机构列表
      type: [Array, Object],
      default: function() {
        return []
      }
    },

    DepartmentList: {
      //当前部门列表
      type: [Array, Object],
      default: function() {
        return []
      }
    }
  },
  watch: {
    reShowObj: {
      handler(newVal) {
        console.log(newVal, 'cvzvczxvczxzv')
        if (this.title === '编辑') {
          if (this.reShowObj) {
            this.$emit('getDepList', newVal.corgOid)
            this.formDialog.cdeptName = newVal.cdeptName
            this.formDialog.cdeptLevel = newVal.cdeptLevel
            let itmeObj = {
              cparOid: newVal.cparOid,
              cdeptOid: newVal.cdeptOid
            }
            this.formDialog.cparOiditme = itmeObj
            /* this.formDialog.cparOiditme.cparOid = newVal.cparOid
            this.formDialog.cparOiditme.cdeptOid = newVal.cdeptOid */

            this.formDialog.corgOid = newVal.corgOid
          }
        }
      },
      deep: true,
      immediate: true
    }

    /*  title: {
      handler() {
        if (this.title === '添加')
          Object.keys(this.formDialog).forEach(key => {
            this.formDialog[key] = ''
          })
      },
      deep: true,
      immediate: true
    } */
  },

  data() {
    return {
      DepartmentLevelList: [
        {
          lableName: '处室',
          id: '1'
        },
        {
          lableName: '部门',
          id: '0'
        }
      ],
      //-----
      formDialog: {
        cdeptName: '', //部门名称
        corgOid: '', //机构
        cparOiditme: {}, //上级部门
        cdeptLevel: '' //部门级别
      },
      rules: {
        cdeptName: [
          { required: true, message: '请输入部门名称', trigger: 'blur' },

          {
            validator: (rule, value, callback) => {
              if (!validBlank(value)) {
                callback(new Error('输入不能包含空格'))
              } else {
                callback()
              }
            }
          }
        ],
        corgOid: [{ required: true, message: '请选择机构名字', trigger: 'blur' }],
        cparOiditme: [{ required: true, message: '请选择上级部门', trigger: 'blur' }]
      },
      formLabelWidth: '130px'
    }
  },
  methods: {
    selectCorgOid(e) {
      this.formDialog.cparOiditme = ''
      this.$emit('getDepList', e)
    },
    dialogEvent(type) {
      if (type === 'confirm') {
        this.$refs.forminfo.validate(vail => {
          if (vail) {
            if (this.title === '添加') {
              this.$emit('addClick', type, this.formDialog)
            } else if (this.title === '编辑') {
              this.$emit('editEvent', type, this.formDialog)
            }
          }
        })
      } else {
        if (this.title === '添加') {
          this.$emit('addClick', type)
        } else if (this.title === '编辑') {
          this.$emit('editEvent', type, 'cancle')
        }
      }
    },
    resetData() {
      this.$nextTick(() => {
        this.$refs.forminfo.resetFields()
        Object.keys(this.formDialog).forEach(key => {
          this.formDialog[key] = ''
        })
      })
    }
  }
}
</script>
<style lang='scss' scoped>
.el_forms {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}
.operation {
  width: 45%;
  /* margin-left: auto;
  margin-right: auto; */
  // border-bottom: 1px solid #d2d2d2;
}
.el-form-item {
  // width: 50%;
  border-bottom: 1px solid #d2d2d2;

  margin-bottom: 26 px;
}
.operation_select {
  width: 45%;
}
/deep/.el-select {
  width: 100%;
}
</style>
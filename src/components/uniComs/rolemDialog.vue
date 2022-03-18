<template>
  <div>
    <el-dialog v-if="title === '分配权限'" :close-on-click-modal="false" :show-close="false" :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="formAuthority" :rules="rulesAuthority" :model="formAuthority" label-position="rigth">
        <el-form-item prop="menusid" class="operation_auth" label="权限设置:" label-width="160px">
          <el-tree :data="muenList" :props="defaultProps" ref="menus" node-key="id" show-checkbox @check-change="handleCheckChange"></el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="authority('cancel')">取 消</el-button>
        <el-button type="primary" @click="authority('confirm')">确 定</el-button>
      </div>
    </el-dialog>
    <!--:load="loadNode" 如果:close-on-click-modal="false" :show-close="false"这两个值不设置就要修改dialog的dialogFormVisible值只能在父组件修改,否则会报错 -->
    <el-dialog v-else :close-on-click-modal="false" :show-close="false" :title="title" :visible.sync="dialogFormVisible">
      <el-form ref="forminfo" :rules="rules" :model="formDialog" label-position="rigth">
        <el-form-item prop="name" class="operation" label="名称:" :label-width="formLabelWidth">
          <el-input v-model="formDialog.name" placeholder="请输入名称" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item prop="code" class="operation" label="编码:" :label-width="formLabelWidth">
          <el-input v-model="formDialog.code" placeholder="请输入编码" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="description" class="operation" label="描述:" :label-width="formLabelWidth">
          <el-input v-model="formDialog.description" placeholder="请输入描述" auto-complete="off"></el-input>
        </el-form-item>
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
    muenList: {
      //权限菜单列表
      type: [Object, Array],
      default: function() {
        return []
      }
    },
    checkData: {
      //权限菜单列表
      type: [Object, Array],
      default: function() {
        return []
      }
    },
    reShowObj: {
      //编辑时的回显数据
      type: [Array, Object, String],
      default: function() {
        return {}
      }
    }
  },
  watch: {
    reShowObj: {
      handler() {
        console.log(this.reShowObj, 'reshow')
        if (this.title === '编辑') {
          let { name, code, description, id } = this.reShowObj
          this.formDialog.name = name
          this.formDialog.code = code
          this.formDialog.description = description
          this.formDialog.id = id
        }
      },
      deep: true,
      immediate: true
    },

    checkData: function(oldVal, newVal) {
      this.$nextTick(() => {
        //树结构未渲染出来的时候，调用setCheckEdKeys会报错
        if (this.checkData && this.checkData.length) this.$refs.menus.setCheckedKeys(oldVal)
        else this.$refs.menus.setCheckedKeys([])
      })
    }
  },

  data() {
    return {
      //----------
      defaultProps: {
        label: 'title',
        children: 'children'
      },
      count: 1,

      //----------
      formAuthority: {},
      formDialog: {
        name: '', //名称
        code: '', //编码
        description: '' //描述
      },
      rules: {
        name: [
          { required: true, message: '请输入名称', trigger: 'blur' },
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

        code: [
          { required: true, message: '请输入编码', trigger: 'blur' },
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

        description: [
          { required: true, message: '请输入描述', trigger: 'blur' },
          {
            validator: (rule, value, callback) => {
              if (!validBlank(value)) {
                callback(new Error('输入不能包含空格'))
              } else {
                callback()
              }
            }
          }
        ]
      },
      rulesAuthority: {},
      formLabelWidth: '65px'
    }
  },
  methods: {
    dialogEvent(type) {
      // console.log(this.formDialog, 'vail')
      if (type === 'confirm') {
        this.$refs.forminfo.validate(vail => {
          if (vail) {
            if (this.title === '新增') {
              this.$emit('dialogClick', type, this.formDialog)
            } else if (this.title === '编辑') {
              this.$emit('editClick', type, this.formDialog)
            }
          }
        })
      } else {
        if (this.title === '新增') {
          this.$emit('dialogClick', type)
        } else if (this.title === '编辑') {
          this.$emit('editClick', type, 'cancle')
        }
      }
    },
    //----------分配权限区
    authority(type) {
      let menusCheckId = [].concat(this.$refs.menus.getCheckedKeys(), this.$refs.menus.getHalfCheckedKeys())
      type === 'confirm' ? this.$emit('authoritys', type, menusCheckId) : this.$emit('authoritys', type)
    },
    handleCheckChange(data, checked, indeterminate) {
      console.log(data, checked, indeterminate)
    },

    //----------分配权限区
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
.operation {
  width: 100%;
}
.el-form-item {
  // width: 50%;
  border-bottom: 1px solid #d2d2d2;
}
.operation_auth {
  width: 100%;
  border-bottom: none;
  /deep/ .el-form-item__label {
    line-height: 26px;
  }
}
.operation_select {
  width: 50%;
}
/deep/.el-select {
  width: 100%;
}
</style>
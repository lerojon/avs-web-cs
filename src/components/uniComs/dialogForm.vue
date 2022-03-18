<template>
  <div>
    <!-- 如果:close-on-click-modal="false" :show-close="false"这两个值不设置就要修改dialog的dialogFormVisible值只能在父组件修改,否则会报错 -->
    <el-dialog width="70%" :close-on-click-modal="false" :show-close="false" :title="title" :visible.sync="dialogFormVisible">
      <el-form class="el_forms" ref="forminfo" :rules="rules" :model="formDialog" label-position="left">
        <el-form-item prop="cstaffName" class="operation" label="姓名:" :label-width="formLabelWidth">
          <el-input v-model="formDialog.cstaffName" placeholder="请输入姓名" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item prop="cstaffCode" class="operation" label="工号:" :label-width="formLabelWidth">
          <el-input
            :disabled="title === '编辑'?true:false"
            oninput="value=value.replace(/^\.+|[^\d.]/g,'')"
            @blur="salaryChange"
            v-model="formDialog.cstaffCode"
            placeholder="请输入工号"
            auto-complete="off"
            maxlength="6"
          ></el-input>
        </el-form-item>
        <el-form-item prop="cemail" class="operation" label="邮箱:" :label-width="formLabelWidth">
          <el-input v-model="formDialog.cemail" placeholder="请输入邮箱" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item v-if="title !== '编辑'" prop="password" class="operation" label="密码:" :label-width="formLabelWidth">
          <el-input v-model="formDialog.password" placeholder="请输入密码" auto-complete="off"></el-input>
        </el-form-item>

        <el-form-item prop="roleIds" class="operation_select" label="角色" :label-width="formLabelWidth">
          <el-select v-model="formDialog.roleIds" multiple placeholder="请选择">
            <el-option v-for="item in queryRoleList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- -------------合并的项------------- -->
        <!-- 1 当前机构 -->
        <el-form-item prop="corgOid" class="operation_select" label="当前机构" :label-width="formLabelWidth">
          <el-select v-model="formDialog.corgOid" placeholder="请选择">
            <el-option v-for="item in organizationList" :key="item.corgOid" :label="item.corgName" :value="item.corgOid"></el-option>
          </el-select>
        </el-form-item>
        <!-- 2 考核机构 -->
        <el-form-item prop="ccurrentOrgOid" class="operation_select" label="考核机构" :label-width="formLabelWidth">
          <el-select v-model="formDialog.ccurrentOrgOid" placeholder="请选择">
            <el-option v-for="item in organizationList" :key="item.corgOid" :label="item.corgName" :value="item.corgOid"></el-option>
          </el-select>
        </el-form-item>
        <!-- 3 当前管线 -->
        <el-form-item prop="cpipelineCode" class="operation_select" label="当前管线" :label-width="formLabelWidth">
          <el-select v-model="formDialog.cpipelineCode" placeholder="请选择">
            <el-option
              v-for="item in currentPipelineList"
              :key="item.cpipelineCode"
              :label="item.cpipelineName"
              :value="item.cpipelineCode"
            ></el-option>
          </el-select>
        </el-form-item>
        <!-- 4 考核管线 -->
        <el-form-item prop="ccurrentPipelineCode" class="operation_select" label="考核管线" :label-width="formLabelWidth">
          <el-select v-model="formDialog.ccurrentPipelineCode" placeholder="请选择">
            <el-option v-for="item in assessPipelineList" :key="item.cpipelineCode" :label="item.cpipelineName" :value="item.cpipelineCode"></el-option>
          </el-select>
        </el-form-item>
        <!-- 5 当前部门 -->
        <el-form-item prop="cdeptOid" class="operation_select" label="当前部门" :label-width="formLabelWidth">
          <el-select v-model="formDialog.cdeptOid" placeholder="请选择">
            <el-option v-for="item in currentDepartmentList" :key="item.cdeptOid" :label="item.cdeptName" :value="item.cdeptOid"></el-option>
          </el-select>
        </el-form-item>
        <!-- 6 考核部门 -->
        <el-form-item prop="ccurrentDeptOid" class="operation_select" label="考核部门" :label-width="formLabelWidth">
          <el-select v-model="formDialog.ccurrentDeptOid" placeholder="请选择">
            <el-option v-for="item in assessDepartmentList" :key="item.cdeptOid" :label="item.cdeptName" :value="item.cdeptOid"></el-option>
          </el-select>
        </el-form-item>
        <!-- 7 当前岗位 -->
        <el-form-item prop="cpostOid" class="operation_select" label="当前岗位" :label-width="formLabelWidth">
          <el-select v-model="formDialog.cpostOid" placeholder="请选择">
            <el-option v-for="item in currentPositionList" :key="item.cpostOid" :label="item.cpostName" :value="item.cpostOid"></el-option>
          </el-select>
        </el-form-item>
        <!-- 8 考核岗位 -->
        <el-form-item prop="ccurrentPostOid" class="operation_select" label="考核岗位" :label-width="formLabelWidth">
          <el-select v-model="formDialog.ccurrentPostOid" placeholder="请选择">
            <el-option v-for="item in assessPositionList" :key="item.cpostOid" :label="item.cpostName" :value="item.cpostOid"></el-option>
          </el-select>
        </el-form-item>
        <!-- 9 当前职级 -->
        <el-form-item prop="cpqCode" class="operation_select" label="当前职级" :label-width="formLabelWidth">
          <el-select v-model="formDialog.cpqCode" placeholder="请选择">
            <el-option v-for="item in rankList" :key="item.cpqCode" :label="item.cpqName" :value="item.cpqCode"></el-option>
          </el-select>
        </el-form-item>
        <!-- 10 考核职级 -->
        <el-form-item prop="ccurrentPqCode" class="operation_select" label="考核职级" :label-width="formLabelWidth">
          <el-select v-model="formDialog.ccurrentPqCode" placeholder="请选择">
            <el-option v-for="item in rankList" :key="item.cpqCode" :label="item.cpqName" :value="item.cpqCode"></el-option>
          </el-select>
        </el-form-item>
        <!-- 11 入职时间 -->
        <el-form-item prop="centryTime" class="operation_select" label="入职时间" :label-width="formLabelWidth">
          <el-date-picker :picker-options="pickerOptions" v-model="formDialog.centryTime" type="date" placeholder="选择日期"></el-date-picker>
        </el-form-item>
        <!-- 12 是否离职 -->
        <el-form-item prop="cisStop" class="operation_select" label="是否离职" :label-width="formLabelWidth">
          <el-select v-model="formDialog.cisStop" placeholder="请选择">
            <el-option v-for="item in dimissionList" :key="item.id" :label="item.lableName" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <!-- 13 是否特殊 -->
        <el-form-item prop="cisSpecial" class="operation_select" label="是否特殊" :label-width="formLabelWidth">
          <el-select v-model="formDialog.cisSpecial" placeholder="请选择">
            <el-option v-for="item in specialList" :key="item.id" :label="item.lableName" :value="item.id"></el-option>
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
    queryRoleList: {
      //角色列表
      type: [Array],
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
    },
    organizationList: {
      //机构列表
      type: [Array, Object],
      default: function() {
        return []
      }
    },
    currentPipelineList: {
      //当前管线列表
      type: [Array, Object],
      default: function() {
        return []
      }
    },
    assessPipelineList: {
      //考核管线列表
      type: [Array, Object],
      default: function() {
        return []
      }
    },
    currentDepartmentList: {
      //当前部门列表
      type: [Array, Object],
      default: function() {
        return []
      }
    },
    assessDepartmentList: {
      //考核部门列表
      type: [Array, Object],
      default: function() {
        return []
      }
    },
    currentPositionList: {
      //当前岗位列表
      type: [Array, Object],
      default: function() {
        return []
      }
    },
    assessPositionList: {
      //考核岗位列表
      type: [Array, Object],
      default: function() {
        return []
      }
    },
    rankList: {
      //职级列表
      type: [Array, Object],
      default: function() {
        return []
      }
    }
  },
  watch: {
    reShowObj: function(newVal) {
      console.log(newVal, 'reshow')
      if (this.title === '编辑') {
        /* let { cstaffName, cstaffCode, cemail, roleIds, cstaffOid, ccurrentDeptOid, ccurrentOrgOid, ccurrentPipelineCode } = newVal
        this.formDialog.cstaffName = cstaffName
        this.formDialog.cstaffCode = cstaffCode
        this.formDialog.cemail = cemail
        delete this.formDialog.password
        this.formDialog.roleIds = roleIds
        this.formDialog.cstaffOid = cstaffOid
        this.cstaffCode = cstaffCode */ //这一步是为了防止用户打开浏览器调试修改disable属性修改cstaffCode值
        this.formDialog = newVal // 直接解构 因为对象的key跟后台传过来的是一样的
      }
    },
    'formDialog.cstaffCode': function(oldVal, newVal) {
      console.log('newVal:', newVal, '-----', 'oldVal:', oldVal, this.cstaffCode)
    },
    'formDialog.corgOid': function(newVal) {
      this.$emit('getPipelineDepList', newVal, 'currentPipelineDept')
    },
    'formDialog.ccurrentOrgOid': function(newVal) {
      this.$emit('getPipelineDepList', newVal, 'assessPipelineDept')
    },
    'formDialog.cdeptOid': function(newVal) {
      this.$emit('getPostList', newVal, 'current')
    },
    'formDialog.ccurrentDeptOid': function(newVal) {
      console.log('考核部门：：', newVal)
      this.$emit('getPostList', newVal, 'assess')
    }
  },

  data() {
    return {
      cstaffCode: '', //这一步是为了防止用户打开浏览器调试修改disable属性修改cstaffCode值
      //-----
      dimissionList: [
        {
          lableName: '是',
          id: '1'
        },
        {
          lableName: '否',
          id: '0'
        }
      ], //是否离职列表
      specialList: [
        {
          lableName: '是',
          id: '1'
        },
        {
          lableName: '否',
          id: '0'
        }
      ], //是否特殊列表
      //-----
      formDialog: {
        cstaffName: '', //员工姓名
        cstaffCode: '', //工号
        cemail: '', //邮箱
        password: '', //密码
        roleIds: [], //角色
        corgOid: '', //当前机构
        ccurrentOrgOid: '', //考核机构
        cpipelineCode: '', //当前管线
        ccurrentPipelineCode: '', //考核管线
        cdeptOid: '', //当前部门
        ccurrentDeptOid: '', //考核部门
        cpostOid: '', //当前岗位
        ccurrentPostOid: '', //考核岗位
        cpqCode: '', //当前职级
        ccurrentPqCode: '', //考核职级
        centryTime: '', //入职时间
        cisStop: '', //是否离职
        cisSpecial: '' //是否特殊
      },
      rules: {
        cstaffName: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
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
        cstaffCode: [
          { required: true, message: '请输入工号', trigger: 'blur' },
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
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
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
        cemail: [
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur,change' },
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
        // acceptanceStandard: [{ required: true, message: '请输入内容', trigger: 'blur' }],
        // deliveryStandard: [{ required: true, message: '请输入内容', trigger: 'blur' }]
      },
      formLabelWidth: '80px',
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      }
    }
  },
  methods: {
    salaryChange(e) {
      this.formDialog.cstaffCode = e.target.value
    },
    dialogEvent(type) {
      if (type === 'confirm') {
        this.$refs.forminfo.validate(vail => {
          if (vail) {
            if (this.title === '添加') {
              this.$emit('dialogClick', type, this.formDialog)
              setTimeout(() => {
                this.$refs.forminfo.resetFields()
              }, 100)
            } else if (this.title === '编辑') {
              //this.formDialog.cstaffCode = this.cstaffCode //这一步是为了防止用户打开浏览器调试修改disable属性修改cstaffCode值 但是可以加可以不加 用户修改接口会提示报错
              this.$emit('editClick', type, this.formDialog)
              setTimeout(() => {
                this.$refs.forminfo.resetFields()
              }, 100)
            }
          }
        })
      } else {
        if (this.title === '添加') {
          this.$emit('dialogClick', type)
          setTimeout(() => {
            this.$refs.forminfo.resetFields()
          }, 100)
        } else if (this.title === '编辑') {
          this.$emit('editClick', type, 'cancle')
          setTimeout(() => {
            this.$refs.forminfo.resetFields()
          }, 100)
        }
      }
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
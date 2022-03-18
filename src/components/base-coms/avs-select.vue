<template>
  <el-select v-model="list" :multiple="mulitFlag" v-if="mulitFlag" :placeholder="placeholder" @focus="focus">
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>
  <!-- <el-select
    :clearable="clearableflag"
    v-else
    v-model="value"
    :placeholder="placeholder"
    :filterable="filterable_flag"
    @visible-change="visibleChange"
    @focus="focus"
    @change="change"
    @clear="clear"
  >
    <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
  </el-select>-->
</template>
<script>
import * as uniUtils from '@/utils'
export default {
  props: {
    mulitFlag: {
      //是否多选
      type: [Boolean],
      default: false
    },
    clearableflag: {
      //单选时是否可以清空选项
      type: [Boolean],
      default: true
    },
    placeholder: {
      type: [String],
      default: ''
    },
    filterable_flag: {
      type: [Boolean],
      default: true
    },
    rawData: {
      type: [Object]
    }
  },
  data() {
    return {
      //   options: [],
      loading: false,
      valueList: [],
      list: [],
      obj: '',
      selectVal: null,
      val: null,
      options: [
        {
          value: '选项1',
          label: '黄金糕'
        },
        {
          value: '选项2',
          label: '双皮奶'
        },
        {
          value: '选项3',
          label: '蚵仔煎'
        },
        {
          value: '选项4',
          label: '龙须面'
        },
        {
          value: '选项5',
          label: '北京烤鸭'
        }
      ],
      value: ''
    }
  },
  watch: {
    //声明时变为一个对象，原来的函数被套在handler属性里边
    //另外可以添加其他属性
    rawData: {
      handler() {
        this.val = this.rawData[this.field]
        this.setOptions()
        this.setBindData()
      },
      deep: true //设置深度监听-->实现监听对象下的某一属性变化
    }
  },
  mounted() {
    if (!this.rawData[this.field]) this.setCompInitData()
    this.val = this.rawData[this.field]
    this.setOptions()
    this.setBindData()
  },
  methods: {
    /**设置组件的state初始值 */
    setCompInitData() {
      /* if (this.isMulti) {
        this.rawData[this.field] = []
      } else {
        this.rawData[this.field] = {}
      } */
    },

    checkValidate() {
      if (this.isMulti) {
        return uniUtils.NullArrayFlag(this.list)
      } else {
        // console.log('检查必填',this.obj)
        return uniUtils.NullStringFlag(this.obj.toString())
      }
    },

    /** 下拉值改变 */
    change(param) {
      this.updateSelectValue(param)
      let evt = {}
      evt.sendComp = this
      this.$nextTick(() => {
        console.log('this.val', evt)
        this.$emit('formHandler', this.val)
        if (!this.isMulti) {
          //多选的在visibleChange事件中再触发change回调，避免触发两次change回调 及 在表格中需要多选时却选择一次就失焦
          this.$emit('change', this.val)
        }
      })
    },

    /**更新新的valueLIst */
    updateValueList(value) {
      let findIndex = this.valueList.findIndex(val => {
        return val.id == value.id
      })
      if (findIndex == -1) {
        this.valueList.push(value)
      } else {
        this.valueList[findIndex].itemData = value.itemData
      }
    },

    /**更新绑定的值 */
    updateSelectValue(param) {
      // console.log('新valulist', this.options, param, this.valueList)
      if (this.mulitFlag) {
        /**更新可选列表 */
        this.options.forEach(el => {
          if (param.indexOf(el.id) > -1) {
            this.updateValueList(el)
          }
        })
        this.clear()
        this.valueList.forEach(element => {
          if (param.indexOf(element.id) > -1) {
            let tmp = {}
            tmp.id = element.id
            tmp[this.showField] = element.label
            tmp.itemData = element.itemData
            this.val.push(tmp)
          }
        })
        this.rawData[this.field] = this.val
      } else {
        this.options.forEach(el => {
          let id = this.obj
          if (el.id == id) {
            this.rawData[this.field] = Object({})
            this.rawData[this.field]['id'] = el.id
            this.rawData[this.field][this.showField] = el.label
            this.rawData[this.field]['itemData'] = el.itemData
          }
          this.val = this.rawData[this.field]
        })
      }
    },

    remoteMethod(query) {
      this.queryOption(query)
    },

    /**有焦点时自动查询 */
    focus() {
      //   this.queryOption('')
      this.$emit('focus')
    },

    queryOption(query) {
      this.loading = true
      this.options = []
      let req = { page: 1, pageSize: 100, item_list: [] }
      if (query.trim() == '') {
        req.item_list = []
      } else {
        if (this.remoteField) req[this.remoteField] = query.trim()
        else req[this.queryData.name] = query.trim()
      }
      if (uniUtils.NullArrayFlag(this.itemList)) {
        this.itemList.forEach(item => {
          req.item_list.push(item)
        })
      }

      if (uniUtils.NullArrayFlag(req.item_list)) {
        req.item_list.forEach(val => {
          req[val.name] = val.value1
          if (val.value2 && val.name2) req[val.name2] = val.value2
        })
      }
      delete req.item_list

      let request = null
      if (this.queryData.type == 'post') {
        request = this.zjPost(this.queryData.url, req)
      } else {
        request = this.zjGet(this.queryData.url, req)
      }
      request.then(res => {
        this.loading = false
        if (!res || !res.data || (!res.data.length && !res.data.list)) {
          res.data = []
        } else if (res.data.list && !res.data.list.length) {
          res.data.list = []
        }
        let dataList = []
        if (res.data && res.data.list) {
          dataList = res.data.list
        } else if (res.data && res.data.length && !res.data.list) {
          dataList = res.data
        }
        if (this.sublistName) {
          this.pushSubList(dataList)
        } else {
          dataList.forEach(item => {
            if (!item.id && this.queryData.id) item.id = item[this.queryData.id]
            let tmp = {}
            tmp.id = this.queryData.id ? item[this.queryData.id] : item.id
            tmp.label = item[this.queryData.name]
            tmp.param = item
            tmp.itemData = item
            this.addOptions(tmp)
          })
        }
      })
    },

    pushSubList(arr) {
      arr.forEach(item => {
        let tmp = {}
        tmp.id = item.id
        tmp.label = item[this.queryData.name]
        tmp.param = item
        tmp.itemData = item
        this.addOptions(tmp)
        if (uniUtils.NullArrayFlag(item[this.sublistName])) {
          this.pushSubList(item[this.sublistName])
        }
      })
    },

    /**增加options */
    addOptions(addData) {
      if (uniUtils.NullArrayFlag(this.options)) {
        let findIndex = this.options.findIndex(val => {
          return val.id == addData.id
        })
        if (findIndex > -1) {
          if (addData.itemData) {
            this.options[findIndex].itemData = addData.itemData
          }
        } else {
          this.options.push(addData)
        }
      } else {
        this.options.push(addData)
      }
    },

    /**获取下拉选项 */
    setOptions() {
      this.options = []
      if (uniUtils.ArrayFlag(this.val)) {
        this.val.forEach(item => {
          let tmp = {}
          tmp.id = item.id
          tmp.label = item[this.showField]
          if (uniUtils.NotNullFlag(item.itemData)) {
            tmp.itemData = item.itemData
          }
          this.addOptions(tmp)
          this.updateValueList(tmp)
        })
      } else {
        if (uniUtils.NotNullFlag(this.val)) {
          let tmp = {}
          tmp.id = this.val.id
          tmp.label = this.val[this.showField]
          if (uniUtils.NotNullFlag(this.val.itemData)) {
            tmp.itemData = this.val.itemData
          }
          this.addOptions(tmp)
        }
      }
    },

    //设置下拉列表绑定值
    setBindData() {
      // console.log('设置下拉列表绑定值', this.isMulti, this.val)
      if (this.isMulti) {
        if (!this.val) {
          return
        }
        this.list = []
        this.val.forEach(item => {
          this.list.push(item.id)
        })
      } else {
        if (uniUtils.NullObjectFlag(this.val)) {
          this.obj = this.val.id
        } else {
          this.obj = ''
        }
      }
    },

    clear() {
      if (this.mulitFlag) {
        this.rawData[this.field] = []
        this.val = []
      } else {
        this.rawData[this.field] = null
        this.val = null
      }
    },

    visibleChange(flag) {
      // 下拉框显示或消失回调，flag为false时为消失回调
      var temp = uniUtils.deepClone(this.val)
      if (uniUtils.ObjectFlag(temp)) {
        temp.row = this.rawData
        temp.colConf = Object({
          field: this.field
        })
      }
      if (!flag && this.isMulti) {
        //多选的才需要在此触发change回调，单选的会在change事件中就触发回调，避免触发两次回调事件
        this.$nextTick(() => {
          this.$emit('change', temp)
        })
      }
    }
    /* visibleChange(){
          this.$emit('visibleChange')
      },
      focus(){
        this.$emit('focus')
      },
      change(){
          this.$emit('change')
      },
      clear(){
          this.$emit('clear')
      } */
  }
}
</script>
<style lang="scss" scoped>
</style>
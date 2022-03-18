<template>
  <div>
    <div class="new-add" v-if="addBtnFlag">
      <el-button type="primary" icon="el-icon-edit" @click="addNewProduct">新增产品</el-button>
    </div>
    <div>
      <el-table
        :header-cell-style="function(){
           return 'background:#F6FAFF;color:#303134;font-size:14px'
        }"
        :data="dataObj.tableData"
        :height="tableHeight"
        stripe
        style="width: 100%"
      >
        <template v-for="item in dataObj.tabledefind">
          <!-- 普通列 -->
          <el-table-column
            v-if="item.type==='ordinary' && item.label === '序号'"
            align="center"
            :key="item.prop"
            type="index"
            :label="item.label"
          ></el-table-column>
          <el-table-column
            v-if="item.type==='ordinary'&& item.label !== '序号'"
            align="center"
            :key="item.prop"
            :prop="item.prop"
            :label="item.label"
          ></el-table-column>
          <!-- 特殊列 @input="updataInput"-->
          <el-table-column v-if="item.type==='specific'" align="center" :key="item.label" :label="item.label">
            <template slot-scope="scope">
              <el-input
                class="input-sty"
                v-if="item.slotType === 'input'"
                type="text"
                size="small"
                @blur="$emit('blur',scope.row)"
                v-model="scope.row[item.prop]"
              ></el-input>
              <el-button
                v-else
                v-for="(items , index) in item.btns"
                :key="index"
                @click="handleClick(scope.row,items.flag)"
                type="text"
                size="small"
              >{{items.btn?items.btn:scope.row[item.prop]}}</el-button>
            </template>
          </el-table-column>
        </template>
      </el-table>
    </div>
    <div class="pagination">
      <el-pagination
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="pageSizesArry"
        :page-size="pageSize"
        :total="total"
      >></el-pagination>
    </div>
  </div>
</template>
<script >
import { inpuireList, dictionaries, changeStatus } from '@/api/modList'
import * as uniUtils from '@/utils'
export default {
  name: 'tableEl',
  props: {
    tableData: [Array],
    dataObj: [Object],
    tableHeight: [String, Number],
    addBtnFlag: {
      type: Boolean,
      default: true
    },
    total: {
      type: [Number],
      default: 0
    },
    pageSize: {
      type: [Number],
      default: 10
    },
    currentPage: {
      type: [Number],
      default: 1
    }
  },
  data() {
    return {
      pageSizesArry: [10, 20, 30, 40, 50, 100, 200]
    }
  },
  created() {},
  mounted() {
    console.log(this.dataObj, 'xxxxxxx')
  },
  watch: {},
  methods: {
    addNewProduct() {
      this.$emit('addNewProduct')
    },
    handleClick(val, itemsFlag) {
      if (uniUtils.ObjectFlag(val)) {
        val.itemsFlag = itemsFlag
      } else {
        let objitem = { itemsFlag: itemsFlag }
        val.push(objitem)
      }
      //val到时候看接口返回的数据类型 需要判断是对象还是数组
      this.$emit('colClick', val)
    },
    handleSizeChange(val) {
      this.$emit('handleSizeChange', val)
    },
    handleCurrentChange(val) {
      this.$emit('handleCurrentChange', val)
    },
    updataInput(val) {
      this.$emit('input', val)
    }
  }
}
</script>
<style lang='scss' scoped>
.new-add {
  padding: 0px 0px 30px;

  button {
    // width: 120px;
    // height: 36px;
  }
}
.pagination {
  text-align: end;
  margin-top: 30px;
}
.out-elcol {
  // border-bottom:1px solid #000;
  display: flex;
  align-items: center;
  /deep/ input {
    background: none;
    outline: none;
    border: none;
  }
  .in-elcol {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #d2d2d2;
    margin-right: 50px;
    color: #616161;
    font-size: 14px;
    &:nth-of-type(4) {
      justify-content: space-between;
      border: none !important;
      margin-right: 0px;
      button:nth-of-type(1) {
        margin-right: 30px;
      }
    }
  }
  .in-elcolbut {
    justify-content: space-between;
    border: none !important;
    margin-right: 0px;
    button:nth-of-type(1) {
      margin-right: 30px;
    }
  }
}
/deep/ .el-table th.is-leaf,
.el-table td {
  text-align: center;
}
/* .input-sty {
  text-align: center;
} */
</style>








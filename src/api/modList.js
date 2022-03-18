// import request from '@/utils/request'
import loadingRequest from '@/utils/loadinRequest'


//查询表格数据
export function inpuireList(data,isLoading,noticeInfo) {
  return  loadingRequest({
    url:'/web/template/findAll',
    method:'post',
    data:data
  },isLoading,noticeInfo)
    /* return request({
      url:'/web/template/findAll',
      method:'post',
      data:data
    }) */
  }

  //查询表格数据
export function changeStatus(params,isLoading,noticeInfo) {
  return  loadingRequest({
    url:'/web/template/status',
    method:'get',
    params:params
  },isLoading,noticeInfo)
  /* return request({
    url:'/web/template/status',
    method:'get',
    params:params
  }) */
}

  //字典
  export function dictionaries(data,isLoading,noticeInfo) {
    return  loadingRequest({
      url:'/web/dictionaries/getDict',
      method:'post',
      data:data
    },isLoading,noticeInfo)
    /* return request({
      url:'/web/dictionaries/getDict',
      method:'post',
     
      data:data
    }) */
  }

  //查询单条数据
  export function requireOneData(params,isLoading,noticeInfo) {
    return  loadingRequest({
      url:'/web/template/findById',
      method:'get',
      params:params
    },isLoading,noticeInfo)
    /* return request({
      url:'/web/template/findById',
      method:'get',
      params:params
    }) */
  }

  //查询部门列表 系统管理 部门管理
  export function requireDept(data,isLoading,noticeInfo) {
   return  loadingRequest({
    url:'/system/dept/findAll',
    method:'post',
    data:data
  },isLoading,noticeInfo)
    
  }
  //查询部门人员列表
  export function requireDeptMens(data,isLoading,noticeInfo) {
    return  loadingRequest({
      url:'/system/staff/findAll',
      method:'post',
      data:data
    },isLoading,noticeInfo)
    
  }
  //上传文件接口
  export function uploadFile(data,tag,isLoading=true,noticeInfo=false) {
    return  loadingRequest({
      url:`/web/file/upload/${tag}`,
      method:'post',
      headers:{
        'Content-Type':'multipart/form-data'
      },
      data:data
    },isLoading,noticeInfo)
    /* return request({
      url:`/web/file/upload/${tag}`,
      method:'post',
      headers:{
        'Content-Type':'multipart/form-data'
      },
      data:data
    }) */
  }
  //新增模板接口
  export function addTemplate(data,isLoading,noticeInfo) {
    return  loadingRequest({
      url:'/web/template/add',
      method:'post',
      data:data
    },isLoading,noticeInfo)
    /* return request({
      url:'/web/template/add',
      method:'post',
      data:data
    }) */
  }
  //编辑模板接口
  export function editTemplate(data,isLoading,noticeInfo) {
    return  loadingRequest({
      url:'/web/template/edit',
      method:'post',
      data:data
    },isLoading,noticeInfo)
    /* return request({
      url:'/web/template/edit',
      method:'post',
      data:data
    }) */
  }
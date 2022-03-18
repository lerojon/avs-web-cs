// import request from '@/utils/request'
import loadingRequest from '@/utils/loadinRequest'

//查询用户表格数据
export function staffList(data,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/staff/findAll',
    method:'post',
    data:data
  },isLoading,noticeInfo)
   
  }

  //查询角色列表数据
export function roleList(data,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/role/findAll',
    method:'post',
    data:data
  },isLoading,noticeInfo)
   
  }
  //添加新用户
export function addNewRoles(data,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/staff/add',
    method:'post',
    data:data
  },isLoading,noticeInfo)
    
  }
  //删除用户
export function deleteRoles(params,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/staff/delete',
    method:'get',
    params:params
  },isLoading,noticeInfo)
    
  }
  //编辑查询用户详情
export function requireRolesDetail(params,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/staff/findById',
    method:'get',
    params:params
  },isLoading,noticeInfo)
    
  }
  //编辑用户
export function editRoles(data,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/staff/edit',
    method:'post',
    data:data
  },isLoading,noticeInfo)
  }
  //获取机构列表
export function getOrgList(params,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/org/findOrg',
    method:'get',
    params:params
  },isLoading,noticeInfo)
  }
  //获取职级列表
export function getLevelList(params,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/level/findAllLevel',
    method:'get',
    params:params
  },isLoading,noticeInfo)
  }
  //获取岗位列表 cDeptOid
export function getDeptList(params,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/post/findByDeptId',
    method:'get',
    params:params
  },isLoading,noticeInfo)
  }
  //获取管线列表 corgId
export function getPipelineList(params,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/pipeline/findByOrgId',
    method:'get',
    params:params
  },isLoading,noticeInfo)
  }
  
  /**
   * 角色管理新增 
   * post
   * @param { "name": "测试用",
    "code": "test",
    "description": "就是测试用的"} data 
   * @param {*} isLoading 
   * @param {*} noticeInfo 
   * @returns 
   */
export function roleAdds(data,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/role/add',
    method:'post',
    data:data
  },isLoading,noticeInfo)
  }

  
  /**
   * 角色管理 编辑
   * post
   * @param { "id":"c8ef709b3eab9d2f977741f6d14656cb",
    "name": "测试修改一下角色",
    "code": "test",
    "description": "就是测试用的"} data 
   * @param {*} isLoading 
   * @param {*} noticeInfo 
   * @returns 
   */
export function roleEdit(data,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/role/edit',
    method:'post',
    data:data
  },isLoading,noticeInfo)
  }
  /**
   * 角色管理 删除
   * get
   * @param {id} data 
   * @param {*} isLoading 
   * @param {*} noticeInfo 
   * @returns 
   */
export function roleDelete(params,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/role/delete',
    method:'get',
    params:params
  },isLoading,noticeInfo)
  }
  /**
   * 角色管理 分配权限 获取菜单
   * get
   * @param {groupId} data 
   * @param {*} isLoading 
   * @param {*} noticeInfo 
   * @returns 
   */
export function GetRoleMenu(params,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/menu/tree',
    method:'get',
    params:params
  },isLoading,noticeInfo)
  }
  /**
   * 角色管理 分配权限 保存权限设置
   * post
   * @param {*} isLoading 
   * @param {*} noticeInfo 
   * @returns 
   */
export function saveMenuAuth(data,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/role/saveMenuAuth',
    method:'post',
    data:data
  },isLoading,noticeInfo)
  }
  /**
   * 部门管理 添加 编辑
   * post
   * @param {*} isLoading 
   * @param {*} noticeInfo 
   * @returns 
   */
export function deptAddEdit(data,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/dept/edit',
    method:'post',
    data:data
  },isLoading,noticeInfo)
  }

  //编辑查询详情
export function findDetail(params,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/dept//findById',
    method:'get',
    params:params
  },isLoading,noticeInfo)
  }
  //删除
export function deleteApi(params,isLoading,noticeInfo) {
  return loadingRequest({
    url:'/system/dept/delete',
    method:'get',
    params:params
  },isLoading,noticeInfo)
  }
  


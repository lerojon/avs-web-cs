import loadingRequest from '@/utils/loadinRequest'
import request from '@/utils/request'

//上传视频到minio
export  function minioUpload(requestObj){
    return request(requestObj)
    /* return request({
      url:'/web/template/findAll',
      method:'post',
      data:data
    }) */
}

/**
   * 统一参数说明 
   * post
   * @param {data} Object
   * @param {loadingFlag} Boolean
   * @param {noticeInfo} String or Boolean ,"添加成功"
   * @returns Promise
   */

//公共接口1------------
/**
 * 下拉框选项列表（获取字典数据） 
 */
export function getBaseComm(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/baseCode/getBaseComm',
        method:'post',
        data:data
        },loadingFlag,noticeInfo)
} 
//公共接口------------

//---------------------------

//产品接口4--------
/**
 * 产品列表分页查询接口
 */
 export function productList(data,loadingFlag,noticeInfo){
    return loadingRequest({
    url:'/product/queryAll',
    method:'post',
    data:data
    },loadingFlag,noticeInfo)
}

/**
   * 新增产品 （创建产品接口）
   * post
   * @param {noticeInfo} String or Boolean ,"添加成功"
   * @returns Promise
   */
export function addProduct(data,loadingFlag,noticeInfo){
    return loadingRequest({
    url:'/product/addProduct',
    method:'post',
    data:data
    },loadingFlag,noticeInfo)
}

/**
 * 产品编辑（基础信息保存接口）
 */
export function productEdit(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/product/saveSubmitInfo',
        method:'post',
        data:data
        },loadingFlag,noticeInfo)
}


/**
 * 删除产品（产品列表-删除接口）
 */
 export function deleteProduct(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/product/deleteProductList',
        method:'DELETE',
        data:data
        },loadingFlag,noticeInfo)
}
//产品接口--------

//模板接口9---------
/**
 * 模板合成
 */
 export function createTempate(params,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/template/createTempate',
        method:'get',
        params:params
        },loadingFlag,noticeInfo)
}

/**
 * 待发布模板列表-确认发布接口
 */
 export function confirmRelease(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/template/confirmRelease',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 模板预览-模块字段数据保存接口
 */
 export function saveModuleField(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/templateReview/saveModuleField',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 模板预览-查询模板接口
 */
 export function queryTemplate(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/template/queryTemplate',
        method:'post',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 模板列表(已发布、待发布)-模板列表查询接口
 * params {"publishStatus": 1} Number //发布状态(以发布、待发布) 
 */
 export function tempalteList(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/template/queryAll',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 模板列表(已发布、待发布)-模板删除接口
 */
 export function delTem(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/template/deleteById',
        method:'DELETE',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 模板列表(已发布、待发布)-模板添加备注接口
 */
 export function remarkTem(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/template/modifyRemarks',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 模板列表(已发布、待发布)-模板名称修改接口
 */
 export function changeTemName(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/template/modifyName',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 模板预览-分页查询模块字段数据接口
 */
 export function queryModuleWord(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/template/queryModuleWord',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}
//模板接口---------

//模块接口10----------
/**
 * 产品模板配置-保存接口
 */
 export function saveMaterial(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/module/saveMaterial',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 产品模板配置-删除模块接口
 */
 export function deleteModule(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/module/deleteModule',
        method:'DELETE',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 产品模板配置-查询素材接口
 */
 export function queryMaterial(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/module/queryMaterial',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 模块基础信息-查询接口
 */
 export function queryModuleMessage(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/module/queryModuleMessage',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 模块基础信息-保存接口
 */
 export function saveModuleMessage(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/module/saveModuleMessage',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 产品模板配置-更新模块顺序接口
 */
 export function updateModuleNum(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/module/updateModuleNum',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 产品模板配置-查询模块接口
 */
 export function queryModule(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/module/queryModule',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 产品模板配置-模块保存接口
 */
 export function saveModule(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/module/saveModule',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 模块基础信息-查询模块规则配置接口
 */
 export function queryModuleRule(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/module/queryModuleRule',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 产品模板配置-删除模块视频接口
 */
 export function deleteModuleVideo(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/module/deleteModuleVideo',
        method:'DELETE',
        data:data
        },loadingFlag,noticeInfo)
}


//模块接口----------

//片段处理流程接口共 (4) 个----------
/**
 * 视频片段所用字段回调接口
 */
 export function moelDataUseFiled(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/moduleSign/moelDataUseFiled',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 视频片段URL获取接口
 */
 export function getModelUrl(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/getModelUrl',
        method:'POST',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 视频片段标记请求接口（前端跳转）
 */
 export function jumpUrl(params,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/prod=01001',
        method:'get',
        params:params
        },loadingFlag,noticeInfo)
}

/**
 * 数据模型字段查询接口
 */
 export function getDataMoudle(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/dataMoudle/getDataMoudle',
        method:'post',
        data:data
        },loadingFlag,noticeInfo)
}
//片段处理流程接口共 (4) 个----------

//模板合成接口共 (2) 个----------
/**
 * 合成状态回调接口
 */
 export function createTemplateCall(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/createTemplateCall',
        method:'post',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 模板合成请求接口
 */
 export function weee(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/weee',
        method:'post',
        data:data
        },loadingFlag,noticeInfo)
}
//模板合成接口共 (2) 个----------

//视频合成-----------
/**
 * 合成状态回调接口
 */
 export function createVideoCall(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/createVideoCall',
        method:'post',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 视频合成接口
 * params templateId
 */
 export function videoMergeRequ(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/video/createVideo',
        method:'post',
        data:data
        },loadingFlag,noticeInfo)
}

/**
 * 视频地址获取接口
 * params templateId
 */
 export function queryPreviewingVideoURL(data,loadingFlag,noticeInfo){
    return loadingRequest({
        url:'/template/queryPreviewingVideoURL',
        method:'post',
        data:data
        },loadingFlag,noticeInfo)
}
//视频合成-----------


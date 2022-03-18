import request from '@/utils/request'
import { Message, MessageBox ,Loading  } from 'element-ui'
import Vue from 'vue'


//--------20211117
// loading框设置局部刷新，且所有请求完成后关闭loading框
let loading;
function startLoading() {
    
  loading = Vue.prototype.$loading({
    lock: true,
    text: "加载中...",
    //target: document.querySelector('.app-main')//设置加载动画区域
  });
}
function endLoading() {
  loading.close();
}
 
/**
 * 
 * @param {*} info 需要提示的字符串
 */
function notice(info,type){
    Message({
        message: info,
        type: type,
        center: true
      })
}
//声明一个对象用于存储请求个数
/* let needLoadingRequestCount = 0;
function showFullScreenLoading() {
    if (needLoadingRequestCount === 0) {
        startLoading();
    }
    needLoadingRequestCount++;
};
function tryHideFullScreenLoading() {
    if (needLoadingRequestCount <= 0) return;
    needLoadingRequestCount--;
    if (needLoadingRequestCount === 0) {
      endLoading();
    }
}; */
//--------20211117
/**
 * 
 * @param {*} dataObj 请求数据对象
 * @param {*} isLoading 是否需要加载页面 是Boolean
 * @param {*} info可以是Boolean 也可以是 字符串 如果是boolean则表示不用提示信息
 * @returns 
 */
export default function loadingRequest(dataObj , isLoading=true , info='请求成功'){
    if(isLoading){
        startLoading()
    }
    return new Promise((resolve,reject)=>{
        request(dataObj).then((res)=>{
            
            if(isLoading){
                endLoading()
            }
            if(res.code === '200'|| res.code === 200){
                if(info) notice(info,'success')
                else notice(res.message,'success')
                resolve(res) 
            }else{
                notice(res.message,'warning')
                reject(res)
            }
            // resolve(res)    
        }).catch((err)=>{
            if(isLoading){
                endLoading()
            }
            reject(err)
        })
    })
}
import axios from 'axios'
import { Message, MessageBox ,Loading  } from 'element-ui'
import store from '../store'
import { getToken } from '@/utils/auth'
import Vue from 'vue'

axios.defaults.withCredentials=true;//让ajax携带cookie---2021/11/17
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
 
//声明一个对象用于存储请求个数
let needLoadingRequestCount = 0;
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
};
//--------20211117


// 创建axios实例
const service = axios.create({
  baseURL: process.env.BASE_API, // api的base_url
  timeout: 1800000 // 请求超时时间
})

// request拦截器
service.interceptors.request.use(config => {
  if (store.getters.token) {
    config.headers['Authorization'] =`${getToken()}`  // Bearer 让每个请求携带自定义token 请根据实际情况自行修改
  }
  return config
}, error => {
  // Do something with request error
  console.log('request拦截器:',error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    //console.log("response:",response)
  /**
  * code为非200是抛错 可结合自己业务进行修改
  */
   let res = {};
   if (typeof response == 'string') {
     res = JSON.parse(JSON.stringify(response));
   } else {
     res = response;
   }
    /* const res = response.data */
    if (res.status !== 200) {
      /*--- Message({
        message: res.message,
        type: 'error',
        duration: 3 * 1000
      }) */

      // 401:未登录;
      if (res.status === 401) {
        Message({
            message: '网络异常，请联系管理员，稍后再试',
            type: 'error',
            duration: 3 * 1000
          })
        /* MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('FedLogOut').then(() => {
            location.reload()// 为了重新实例化vue-router对象 避免bug
          })
        }) */
      }
      return Promise.reject('error')
    } else {
      if(res.data.code === '200'||res.data.code === 200 ||res.status === 200 ||res.status === '200' ){
        return  Promise.resolve(res.data)
      }else{
         Message({
          message: response.data.message,
          type: 'error',
          duration: 3 * 1000
        })
        // return response.data
      }
    }
  },
  error => {
    
    //console.log('err' + error)// for debug
    Message({
      message: '网络异常，请稍后再试',
      type: 'error',
      duration: 3 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

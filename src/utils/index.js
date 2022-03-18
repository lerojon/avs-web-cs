//工具类方法
import Vue from 'vue'

//----------------------------------
var Minio = require('minio')

/**
 * MinIO
 * minio客户端对象，用于上传、下载文件
 */
export var minioClient = new Minio.Client({
    endPoint: '172.27.28.196',//10.30.44.73endPoint是一个主机名或者IP地址。不用写http前缀和端口号,如果写了会报错
    port: 9000,//TCP/IP端口号。可选，默认值是，如果是http,则默认80端口，如果是https,则默认是443端口。
    useSSL: false,//true代表使用HTTPS协议
    accessKey: 'minioadmin',//accessKey类似于用户ID，用于唯一标识你的账户。
    secretKey: 'minioadmin'//secretKey是你账户的密码。
});

/**
 * AWS S3
 * minio客户端对象，用于上传、下载文件
 */
 export var s3Client = new Minio.Client({
    endPoint:  '172.27.28.196',
    accessKey: 'minioadmin',
    secretKey: 'minioadmin'
})


/**
 * 生成一个给HTTP GET请求用的presigned URL。浏览器/移动端的客户端可以用这个URL进行下载，即使其所在的存储桶是私有的。这个presigned URL可以设置一个失效时间，默认值是7天。
 * @param {*} bucketName 存储桶名称。
 * @param {*} objectName 对象名称。
 * @param {*} expiry 失效时间（以秒为单位），默认是7天，不得大于七天 24*60*60*7
 * @returns 
 */
 export function getMinioDouUrl(bucketName,objectName,expiry=24*60*60*7){
  return  minioClient.presignedGetObject(bucketName, objectName, expiry, function(err, presignedUrl) {
    if (err) return console.log(err)
    else return presignedUrl
  })
}
 

/**
 * 获取视频时长
 * @param {*} time 
 * @param {*} cFormat 
 * @returns 
 */
export function getVideoTime(file,callback){
    let url = window.URL.createObjectURL(file)
    var audioElement = new Audio(url)
    audioElement.addEventListener('loadedmetadata',()=>{
          let playTime =  audioElement.duration; //当前视频长度
          callback(playTime)
   })
   
}
//----------------------------------




export function parseTime(time, cFormat) {
  if (arguments.length === 0) {
    return null
  }
  const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
  let date
  if (typeof time === 'object') {
    date = time
  } else {
    if (('' + time).length === 10) time = parseInt(time) * 1000
    date = new Date(time)
  }
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay()
  }
  const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
    let value = formatObj[key]
    if (key === 'a') return ['一', '二', '三', '四', '五', '六', '日'][value - 1]
    if (result.length > 0 && value < 10) {
      value = '0' + value
    }
    return value || 0
  })
  return time_str
}

export function formatTime(time, option) {
  time = +time * 1000
  const d = new Date(time)
  const now = Date.now()

  const diff = (now - d) / 1000

  if (diff < 30) {
    return '刚刚'
  } else if (diff < 3600) { // less 1 hour
    return Math.ceil(diff / 60) + '分钟前'
  } else if (diff < 3600 * 24) {
    return Math.ceil(diff / 3600) + '小时前'
  } else if (diff < 3600 * 24 * 2) {
    return '1天前'
  }
  if (option) {
    return parseTime(time, option)
  } else {
    return d.getMonth() + 1 + '月' + d.getDate() + '日' + d.getHours() + '时' + d.getMinutes() + '分'
  }
}

/*
* 通用判断方法
* version: 1.1
* Copyright (c) 2018 weile it
*/

// 判断是否为非空对象 
export function NullObjectFlag(param) {
  if(NotNullFlag(param)){
      return !(Object.keys(param).length == 0);
  }
  return false
}

/**
 * 判断是不是对象
 * @param {*} param 
 * @returns 
 */
export function ObjectFlag(param) {
  return Object.prototype.toString.call(param) === '[object Object]';
}

/**
 * 判断是不是数组
 * @param {*} param 
 * @returns 
 */
export function ArrayFlag(param) {
  return Object.prototype.toString.call(param) === '[object Array]';
}

/**
 * 判断是不是空数组
 * @param {*} param 
 * @returns 
 */
export function NullArrayFlag(param) {
  if (ArrayFlag(param)) {
      return param.length > 0;
  }
  return false;
}

/**
 * 判断是不是数字类型
 * @param {*} param 
 * @returns 
 */
export function NumberFlag(param) {
  return Object.prototype.toString.call(param) === '[object Number]';
}

/**
 * 判断是不是字符串
 * @param {*} param 
 * @returns 
 */
export function StringFlag(param) {
  return Object.prototype.toString.call(param) === '[object String]';
}

/**
 * 判断是不是空字符串
 * @param {*} param 
 * @returns 
 */
export function NullStringFlag(param) {
  if (StringFlag(param)) {
      return param != '';
  }
  return false;
}

/**
 * 判断是不是Null值
 * @param {*} param 
 * @returns 
 */
export function NullFlag(param) {
  return Object.prototype.toString.call(param) === '[object Null]';
}

/**
 * 判断是不是Undefined类型
 * @param {*} param 
 * @returns 
 */
export function UndefinedFlag(param) {
  return Object.prototype.toString.call(param) === '[object Undefined]';
}

/**
 * 判断是不是时间类型
 * @param {*} param 
 * @returns 
 */
export function DateFlag(param) {
  return Object.prototype.toString.call(param) === '[object Date]';
}

/**
 * 判断是不是布尔类型
 * @param {*} param 
 * @returns 
 */
export function BooleanFlag(param) {
  return Object.prototype.toString.call(param) === '[object Boolean]';
}

/**
 * 判断是不是函数类型
 * @param {*} param 
 * @returns 
 */
export function FuncFlag(param) {
  return Object.prototype.toString.call(param) === '[object Function]';
}

export function ValidDateFlag(param) {
  if (DateFlag(param)) {
      return !NumberFlag(param.getTime());
  }
  return false;
}


export function NotNullFlag(param) {
  return !NullFlag(param) && !UndefinedFlag(param);
}

export function NotEmptyFlag(param) {
  return !NullFlag(param) && !UndefinedFlag(param) && param !== '';
}


export function Greater0Flag(param) {
  return NumberFlag(param) && param > 0;
}


/**
 * 判断是不是有小数
 * @param {*} param 
 * @returns 
 */
export function FloatNumFlag(val) {
  if (NumberFlag(val) || val <= 0) {
      return false;
  } else {
      return true;
  }
}

/**
 * 判断是不是整数类型
 * @param {*} param 
 * @returns 
 */
export function IntFlag(val) {
  if (/(^[1-9]\d*$)/.test(val) || val == 0) {
      return true;
  } else {
      return false;
  }
}


/**
* 是否包含数组的 json key
* @param key 链式属性名, abcd.list[].name
*/
export function isArrayKey(key) {
  return StringFlag(key) && (key.indexOf('[') > -1);
}


/**
* 是否已经存在相同属性的元素
* @param list 待检测数组
* @param item 对比对象
* @param key 对比属性名; 默认为 id
*/
export const hasObjectList = (list, item, key = 'id') => {
  let flag = false;
  if (NullArrayFlag(list)) {
      list.every((val) => {
          if (val[key] == item[key]) {
              flag = true;
          }
          return !flag;
      })
  }
  return flag;
}



/**
* 是否已经存在相同属性的元素
* @param list 待检测数组
* @param val 对比值 
* @param key 对比属性名; 默认为 id
*/
export const hasValueList = (list, val, key = 'id') => {
  let flag = false;
  if (NullArrayFlag(list)) {
      list.every((val) => {
          if (val[key] == val) {
              flag = true;
          }
          return !flag;
      })
  }
  return flag;
}

/**
 * 判断是不是微信端
 * @param {*} param 
 * @returns 
 */
export function WeixianFlag(param) {
  return param == 'shiji' || param == 'weixianhuaxuepin';
}

export function WXPFlag(param) {
  return param == 'weixianhuaxuepin';
}

export function SingleFlag(param) {
  return param == 'shi';
}

export function DizhiFullValueFlag(param) {
  let flag = true;
  let keyArr = ['sheng', 'shi', 'qu', 'xiangxidizhi']
  if (param) {
      for (let key in keyArr) {
          if (!param[key]) {
              flag = false
          }
      }
  } else {
      flag = false
  }
  return flag
}

/**
 * 深度拷贝
 * @param {*} param 
 * @returns 
 */
export function deepClone(obj) {
  let objClone = Array.isArray(obj) ? [] : {};
  if (obj && typeof obj === "object") {
      for (let key in obj) {
          if (obj.hasOwnProperty(key)) {
              //判断ojb子元素是否为对象，如果是，递归复制
              if (obj[key] && typeof obj[key] === "object") {
                  objClone[key] = deepClone(obj[key]);
              } else {
                  //如果不是，简单复制
                  objClone[key] = obj[key];
              }
          }
      }
  }
  return objClone;
}


export function getHoursDiff(dt1, dt2) {
  if (typeof (dt1) == "string") {
      dt1 = new Date(dt1.replace(/-/, '/'));
      dt2 = new Date(dt2.replace(/-/, '/'));
  }
  var res = dt2 - dt1;
  if (NumberFlag(res))
      throw Error("invalid dates arguments");
  return res / (1000 * 60 * 60);
}

//获取日期对象
export function getDateObj(date) {
  var d;
  if (DateFlag(date)) {
      d = date;
  } else if (StringFlag(date) || NumberFlag(date)) {
      d = new Date(date);
  }
  if (!ValidDateFlag(d)) {
      // console.warn('无效日期格式', date);
      return "";
  }
  return d
}


// 将 Date 转化为指定格式的String
// 月(M)、日(d)、小时(h)、分(m)、秒(s)、季度(q) 可以用 1-2 个占位符，
// 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
// 例子：
// dateFormat(new Date(), "yyyy-MM-dd hh:mm:ss.S") ==> 2006-07-02 08:09:04.423
// dateFormat(new Date(), "yyyy-M-d h:m:s.S")      ==> 2006-7-2 8:9:4.18
//author: meizz
export function dateFormat(date, fmt) {
  var d = getDateObj(date)
  if (!fmt) {
      fmt = 'yyyy-MM-dd HH:mm:ss';
  }
  var o = {
      "M+": d.getMonth() + 1, //月份
      "d+": d.getDate(), //日
      "h+": d.getHours() % 12 == 0 ? 12 : d.getHours() % 12, //小时
      "H+": d.getHours(), //小时
      "m+": d.getMinutes(), //分
      "s+": d.getSeconds(), //秒
      "q+": Math.floor((d.getMonth() + 3) / 3), //季度
      "S": d.getMilliseconds() //毫秒
  };
  if (/(y+)/.test(fmt))
      fmt = fmt.replace(RegExp.$1, (d.getFullYear() + "").substr(4 - RegExp.$1.length));
  for (var k in o)
      if (new RegExp("(" + k + ")").test(fmt))
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
  return fmt;
};

//获取date的毫秒数
export function getMilliTime(date) {
  var d = getDateObj(date)
  if (d == "") {
      return ""
  }

  var milliSeconds = d.getTime()
  return milliSeconds
}

//获取月份的最后一天
export function getMonthLastDay(date) {
  var d = getDateObj(date)
  if (d == "") {
      return ""
  }
  d.setMonth(d.getMonth() + 1, 1);
  var milliSeconds = d.getTime() - 86400000
  var fmt = dateFormat(milliSeconds, 'yyyy-MM-dd HH:mm:ss')
  return fmt
}

//获取月份的第一天
export function getMonthFirstDay(date) {
  var d = getDateObj(date)
  if (d == "") {
      return ""
  }
  d.setDate(1);
  var fmt = dateFormat(d, 'yyyy-MM-dd HH:mm:ss')
  return fmt
}

//返回当前时间   默认到秒
export function getTime(timeFlag = 'toSecond') {
  var date = new Date();
  if (timeFlag==='toMinute') {
      return dateFormat(date, 'yyyy-MM-dd HH:mm');
  } else if (timeFlag==='toDay') {
      return dateFormat(date, 'yyyy-MM-dd');
  } else if (timeFlag==='dayBegin') {
      return dateFormat(date, 'yyyy-MM-dd') + ' 00:00:00';
  } else if (timeFlag==='dayEnd') {
      return dateFormat(date, 'yyyy-MM-dd') + ' 23:59:59';
  } else {
      return dateFormat(date, 'yyyy-MM-dd HH:mm:ss');
  }
}

export function getDateDay(date, num) {
  date = new Date(date);
  date.setDate(date.getDate() + num)
  return dateFormat(date, 'yyyy-MM-dd HH:mm:ss')
}

//返回星期几
export function getDay(item) {
  var date = new Date();
  if (item) {
      date = new Date(item);
  }
  switch (date.getDay()) {
      case 0:
          return '星期日';
      case 1:
          return '星期一';
      case 2:
          return '星期二';
      case 3:
          return '星期三';
      case 4:
          return '星期四';
      case 5:
          return '星期五';
      case 6:
          return '星期六';
  }
}


//返回这周日期
export function getDates(currentTime) {
  var currentDate = new Date(currentTime)
  var timesStamp = currentDate.getTime();
  var currenDay = currentDate.getDay();
  var dates = [];
  for (var i = 0; i < 7; i++) {
      dates.push(new Date(timesStamp + 24 * 60 * 60 * 1000 * (i - (currenDay + 6) % 7)).toLocaleDateString().replace(/\//g, '-'));
  }
  return dates
}


//返回当前年

export function getYear() {
  var myDate = new Date();
  var tYear = myDate.getFullYear();
  return tYear ;
}

//返回当前年月

export function doHandleDate() {
  var myDate = new Date();
  var tYear = myDate.getFullYear();
  var tMonth = myDate.getMonth();

  var m = tMonth + 1;
  if (m.toString().length == 1) {
      m = "0" + m;
  }
  return tYear + '-' + m;
}

//获取当前月份天数:
export function mGetDate() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  var d = new Date(year, month, 0);
  return d.getDate();
}


/**
* 当前时间经过的天数日期
* @param day 偏移天数, 整数未来时间, 负数为过去时间
* 
* @returns {string} 小时分钟秒是固定 yyyy-MM-dd 00:00:00
*/
export function somedayFormat(day,bIncludeHMS = false) {
  var t = new Date().getTime();
  t += day * 86400000;
  var date = new Date(t);

  var dateStr
  if(bIncludeHMS){
      dateStr = dateFormat(date);
  }else{
      dateStr = dateFormat(date, 'yyyy-MM-dd');
      dateStr += " 00:00:00";
  }
  return dateStr;
}

/** 获取当前日期前后的天数*/
export function getDayByChange(changeDay) {
  var dateTime = new Date();
  dateTime = dateTime.setDate(dateTime.getDate() + changeDay);
  dateTime = new Date(dateTime);
  var fmt = dateFormat(dateTime, 'yyyy-MM-dd HH:mm:ss')
  return fmt
}

//返回星期几
export function getDaypingyin(date) {
  if (!date) {
      date = new Date();
  } else {
      date = new Date(date)
  }
  switch (date.getDay()) {
      case 0:
          return 'zhouri';
      case 1:
          return 'zhouyi';
      case 2:
          return 'zhouer';
      case 3:
          return 'zhousan';
      case 4:
          return 'zhousi';
      case 5:
          return 'zhouwu';
      case 6:
          return 'zhouliu';
  }
}

//返回当前月
export function getyue(date) {
  if (!date) {
      date = new Date();
  } else {
      date = new Date(date)
  }
  switch (date.getMonth()) {
      case 0:
          return '1月';
      case 1:
          return '2月';
      case 2:
          return '3月';
      case 3:
          return '4月';
      case 4:
          return '5月';
      case 5:
          return '6月';
      case 6:
          return '7月';
      case 7:
          return '8月';
      case 8:
          return '9月';
      case 9:
          return '10月';
      case 10:
          return '11月';
      case 11:
          return '12月';
  }
}

//获取下一个月
export function getNextMonth(date) {
  var d = getDateObj(date)
  if (d == "") {
      return ""
  }
  d.setMonth(d.getMonth() + 1, 1);
  var fmt = dateFormat(d, 'yyyy-MM-dd HH:mm:ss')
  return fmt
}

/**
 * 给展开表格的三级数据增加一个虚拟_id
 */
 export const insertDataId = (data, secondKey = "children", thirdKey = "children") => {
  let bus = new Vue({});
  // let idValue = 0;
  //展开页面重复 id 问题, 最正确解决方案是在组件里面记录一个自增 id
  let idValue = Math.floor(Math.random() * 10000);
  data.forEach((element) => {
      idValue += 1;
      bus.$set(element,"_id_",idValue)
      if (element[secondKey] && element[secondKey].length) {
          element[secondKey].forEach((twoVal) => {
              idValue += 1;
              bus.$set(twoVal,"_id_",idValue)
              if (element[thirdKey] && element[thirdKey].length) {
                  element[thirdKey].forEach((threeVal) => {
                      idValue += 1;
                      bus.$set(threeVal,"_id_",idValue)
                  });
              }
          });
      }
  });
}

/**
 * 对象数组根据属性排序
 * params{*} Array 数组对象
 * params{*} key 排序依据的属性
 */
export function ObjArrayCompare(Array,key){
    if(ArrayFlag(Array)){

       return  Array.sort(function(value1,value2){
            var val1=value1[key];
           var val2=value2[key];
           return val1-val2;
       });

        }
        
    }

/**
 * 参数处理
 * @param {*} params  参数
 */
export function tansParams(params) {
    let result = ""
    for (const propName of Object.keys(params)) {
      const value = params[propName]
      var part = encodeURIComponent(propName) + "="
      if (value !== null && typeof value !== "undefined") {
        if (typeof value === "object") {
          for (const key of Object.keys(value)) {
            if (value[key] !== null && typeof value[key] !== "undefined") {
              let params = propName + "[" + key + "]"
              var subPart = encodeURIComponent(params) + "="
              result += subPart + encodeURIComponent(value[key]) + "&"
            }
          }
        } else {
          result += part + encodeURIComponent(value) + "&"
        }
      }
    }
    return result
  }
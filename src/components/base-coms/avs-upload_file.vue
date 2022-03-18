<template>
  <div>
    <!-- //在父组件使用的模块 -->

    <template>
      <div id="upload_works">
        <div class="type_info">
          <div class="info">支持JPG，PNG，GIF格式，大小不超过20M</div>
          <!-- 自己封装的手动上传文件的组件 -->
          <upload-file
            accept="image/*"
            ref="myUpload"
            action="/api/production/uploadImgList"
            name="files"
            id="my-upload"
            multiple
            :limit="10"
            :file-list="fileList"
            :data="param"
            :on-change="onChange"
            :on-progress="uploadProgress"
            :on-success="uploadSuccess"
            :on-failed="uploadFailed"
            :on-finished="onFinished"
          >
            <div class="normal_button">上传文件</div>
          </upload-file>
          <div class="three">或拖放到这里</div>
        </div>
      </div>
    </template>
    <!-- //在父组件使用的模块 -->
    <div class="digital_upload">
      <input style="display: none" @change="addFile" :multiple="multiple" type="file" :name="name" :id="id" :accept="accept" />
      <label :for="id">
        <slot></slot>
      </label>
    </div>
  </div>
</template>

<script>
export default {
  name: 'my-upload',
  props: {
    name: String,
    action: {
      type: String,
      required: true
    },
    fileList: {
      type: Array,
      default() {
        return []
      }
    },
    accept: {
      type: String,
      require: true
    },
    id: {
      type: String,
      default: 'my-upload'
    },
    data: Object,
    multiple: Boolean,
    limit: Number,
    onChange: Function,
    onBefore: Function,
    onProgress: Function,
    onSuccess: Function,
    onFailed: Function,
    onFinished: Function
  },
  created() {
    console.log(this.onChange)
  },
  methods: {
    // input的 chang事件处理方法
    addFile({ target: { files } }) {
      console.log('addFile:', files)
      // input标签触发onchange事件时，将文件加入待上传列表
      for (let i = 0, l = files.length; i < l; i++) {
        files[i].url = URL.createObjectURL(files[i]) // 创建blob地址，不然图片怎么展示？
        files[i].status = 'ready' // 开始想给文件一个字段表示上传进行的步骤的，后面好像也没去用......
      }
      console.log('fileList:', this.fileList, new Date())
      let fileList = [...this.fileList]
      if (this.multiple) {
        // 多选时，文件全部压入列表末尾
        fileList = [...fileList, ...files]
        const l = fileList.length
        let limit = this.limit
        if (limit && typeof limit === 'number' && Math.ceil(limit) > 0 && l > limit) {
          // 有数目限制时，取后面limit个文件
          limit = Math.ceil(limit)
          // limit = limit > 10 ? 10 : limit;
          fileList = fileList.slice(l - limit)
        }
      } else {
        // 单选时，只取最后一个文件。注意这里没写成fileList = files;是因为files本身就有多个元素（比如选择文件时一下子框了一堆）时，也只要一个
        fileList = [files[0]]
      }
      this.onChange(fileList) // 调用父组件方法，将列表缓存到上一级data中的fileList属性
    },
    // 移除某一个文件
    remove(index) {
      const fileList = [...this.fileList]
      if (fileList.length) {
        fileList.splice(index, 1)
        this.onChange(fileList)
      }
    },
    // 检测是否可以提交
    checkIfCanUpload() {
      console.log(this.fileList.length)
      return this.fileList.length ? (this.onBefore && this.onBefore()) || !this.onBefore : false
    },
    // 根据情况使用不同的提交的方法
    submit() {
      console.log('开始提交')
      if (this.checkIfCanUpload()) {
        // console.log('开始提交2')
        if (this.onProgress && typeof XMLHttpRequest !== 'undefined') {
          this.xhrSubmit()
        } else {
          this.fetchSubmit()
        }
      }
    },
    // fethc 提交
    fetchSubmit() {
      const keys = Object.keys(this.data)
      const values = Object.values(this.data)
      const action = this.action
      const promises = this.fileList.map(each => {
        each.status = 'uploading'
        const data = new FormData()
        data.append(this.name || 'file', each)
        keys.forEach((one, index) => data.append(one, values[index]))
        return fetch(action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: data
        })
          .then(res => res.text())
          .then(res => JSON.parse(res)) // 这里res.text()是根据返回值类型使用的，应该视情况而定
      })
      Promise.all(promises)
        .then(resArray => {
          // 多线程同时开始，如果并发数有限制，可以使用同步的方式一个一个传，这里不再赘述。
          let success = 0
          let failed = 0
          resArray.forEach((res, index) => {
            if (res.code === 1) {
              success++ // 统计上传成功的个数，由索引可以知道哪些成功了
              this.onSuccess(index, res)
            } else if (res.code === 520) {
              // 约定失败的返回值是520
              failed++ // 统计上传失败的个数，由索引可以知道哪些失败了
              this.onFailed(index, res)
            }
          })
          return { success, failed } // 上传结束，将结果传递到下文
        })
        .then(this.onFinished) // 把上传总结果返回
    },
    // xhr 提交
    // xhrSubmit () {
    //     const _this = this
    //     const options = this.fileList.map((rawFile, index) => ({
    //         file: rawFile,
    //         data: _this.data,
    //         filename: _this.name || 'file',
    //         action: _this.action,
    //         headers: {
    //             Authorization: window.sessionStorage.getItem('token')
    //         },
    //         onProgress (e) {
    //             _this.onProgress(index, e)// 闭包，将index存住
    //         },
    //         onSuccess (res) {
    //             _this.onSuccess(index, res)
    //         },
    //         onError (err) {
    //             _this.onFailed(index, err)
    //         },
    //         onFinished (res) { // 👉👉👉👉这里补充一个配置
    //             _this.onFinished(res) // 👉👉👉👉
    //         }
    //     }))
    //     const l = this.fileList.length
    //     const send = async options => {
    //         for (let i = 0; i < l; i++) {
    //             await _this.sendRequest(options[i])// 这里用了个异步方法，按次序执行this.sendRequest方法，参数为文件列表包装的每个对象，this.sendRequest下面紧接着介绍
    //         }
    //     }
    //     send(options)
    // },
    xhrSubmit() {
      const _this = this
      const options = {
        file: this.fileList,
        data: _this.data,
        filename: _this.name || 'file',
        action: _this.action,
        headers: {
          Authorization: window.sessionStorage.getItem('token')
        },
        onProgress(e) {
          _this.onProgress(1, e) // 闭包，将index存住
        },
        onSuccess(res) {
          _this.onSuccess(1, res)
        },
        onError(err) {
          _this.onFailed(1, err)
        },
        onFinished(res) {
          // 👉👉👉👉这里补充一个配置
          _this.onFinished(res) // 👉👉👉👉
        }
      }
      // this.fileList.map((rawFile, index) => ({
      //     file: rawFile,
      //     data: _this.data,
      //     filename: _this.name || 'file',
      //     action: _this.action,
      //     headers: {
      //         Authorization: window.sessionStorage.getItem('token')
      //     },
      //     onProgress (e) {
      //         _this.onProgress(index, e)// 闭包，将index存住
      //     },
      //     onSuccess (res) {
      //         _this.onSuccess(index, res)
      //     },
      //     onError (err) {
      //         _this.onFailed(index, err)
      //     },
      //     onFinished (res) { // 👉👉👉👉这里补充一个配置
      //         _this.onFinished(res) // 👉👉👉👉
      //     }
      // }))
      console.log(options)
      _this.sendRequest(options)
      // const l = this.fileList.length
      // const send = async options => {
      //     for (let i = 0; i < l; i++) {
      //         await _this.sendRequest(options[i])// 这里用了个异步方法，按次序执行this.sendRequest方法，参数为文件列表包装的每个对象，this.sendRequest下面紧接着介绍
      //     }
      // }
      // send(options)
    },
    // 发起上传请求这里借鉴了element-ui的上传源码
    sendRequest(option) {
      // const _this = this
      upload(option)
      function getError(action, option, xhr) {
        // eslint-disable-next-line no-void
        var msg = void 0
        if (xhr.response) {
          msg = xhr.status + ' ' + (xhr.response.error || xhr.response)
        } else if (xhr.responseText) {
          msg = xhr.status + ' ' + xhr.responseText
        } else {
          msg = 'fail to post ' + action + ' ' + xhr.status
        }
        var err = new Error(msg)
        err.status = xhr.status
        err.method = 'post'
        err.url = action
        return err
      }

      function getBody(xhr) {
        var text = xhr.responseText || xhr.response
        if (!text) {
          return text
        }

        try {
          return JSON.parse(text)
        } catch (e) {
          return text
        }
      }

      function upload(option) {
        if (typeof XMLHttpRequest === 'undefined') {
          return
        }

        var xhr = new XMLHttpRequest()
        var action = option.action

        if (xhr.upload) {
          xhr.upload.onprogress = function progress(e) {
            if (e.total > 0) {
              e.percent = (e.loaded / e.total) * 100
            }
            option.onProgress(e)
          }
        }

        var formData = new FormData()

        if (option.data) {
          Object.keys(option.data).map(function (key) {
            formData.append(key, option.data[key])
          })
        }

        option.file.forEach(item => {
          formData.append(option.filename, item)
        })
        // formData.append(option.filename, option.file)

        xhr.onerror = function error(e) {
          option.onError(e)
        }

        xhr.onload = function onload() {
          if (xhr.status < 200 || xhr.status >= 300) {
            return option.onError(getError(action, option, xhr))
          }

          option.onSuccess(getBody(xhr))
        }

        xhr.open('post', action, true)

        if (option.withCredentials && 'withCredentials' in xhr) {
          xhr.withCredentials = true
        }

        var headers = option.headers || {}

        for (var item in headers) {
          // eslint-disable-next-line no-prototype-builtins
          if (headers.hasOwnProperty(item) && headers[item] !== null) {
            xhr.setRequestHeader(item, headers[item])
          }
        }
        xhr.send(formData)
        return xhr
      }
    }
  }
}
</script>

<style lang="scss" scoped>
</style>
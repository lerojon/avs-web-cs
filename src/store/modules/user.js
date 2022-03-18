import { login, logout, getInfo } from '@/api/login'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { Message, MessageBox } from 'element-ui'
import Cookies from 'js-cookie'
const user = {
  state: {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    userInfo: {},
   
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      state.token = token
    },
    SET_NAME: (state, name) => {
      state.name = name
    },
    SET_AVATAR: (state, avatar) => {
      state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    },
    SET_USERINFO: (state, userInfo) => {
      state.userInfo = userInfo
    },
   
  },

  actions: {
    // 登录
    Login({ commit }, userInfo) {
      const username = userInfo.username.trim()
      let req = {
        username,
        password: userInfo.password,
        loginType: userInfo.loginType,
        rememberPwd: true
      }
      if(userInfo.loginType == 2){
        req.ssoToken = userInfo.ssoToken
      }
      // if()
      return new Promise((resolve, reject) => {
        login(req).then(response => {
          if(response.status === 0 || response.status === '0'){
            Message({
              message: response.message,
              type: 'error',
              duration: 3 * 1000
            })
            reject()
          }else{
            
          const tokenStr = response.data  //保存token 
          setToken(tokenStr)
          commit('SET_TOKEN', tokenStr)
          resolve()
          }
          
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 获取用户信息
    GetInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        getInfo().then(response => {
          const data = response.data
          /* if (data.roles && data.roles.length > 0) { // 验证返回的roles是否是一个非空数组
            commit('SET_ROLES', data.roles)
          } else {
            reject('getInfo: roles must be a non-null array !')
          } */
          console.log('data.staff.cstaffName:',data.staff.cstaffName)
         
          commit('SET_NAME', data.staff.cstaffName)
          commit('SET_USERINFO', data.staff)
          Cookies.set('cstaffOid', data.staff.cstaffOid)
          // commit('SET_AVATAR', data.icon)
          resolve(response)
        }).catch(error => {
          reject(error)
        })
      })
    },

    // 登出
    LogOut({ commit, state }) {
      return new Promise((resolve, reject) => {
        /* 没有接口时的写法20211109 commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resolve() */
        logout(state.token).then(() => {
          commit('SET_TOKEN', '')
          commit('SET_ROLES', [])
         
          removeToken()
          resolve()
        }).catch(error => {
          reject(error)
        })
      })
    },
   

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise(resolve => {
        commit('SET_TOKEN', '')
       
        removeToken()
        resolve()
      })
    }
  }
}

export default user

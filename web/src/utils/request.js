import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

// create an axios instance
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 0 // request timeout
})

// request interceptor
service.interceptors.request.use(
  config => {
    // do something before request is sent

    // const token = store.getters['user/token']
    // const user = store.getters['user/userInfo']
    config.data = JSON.stringify(config.data)
    config.headers = {
      'Content-Type': 'application/json;charset=utf-8;'
      // 'x-token': token,
      // 'x-user-id': user.ID
    }

    if (store.getters.token) {
      // let each request carry token
      // ['X-Token'] is a custom headers key
      // please modify it according to the actual situation
      config.headers['Authorization'] = `Token ${getToken()}`
    }
    return config
  },
  error => {
    // do something with request error
    console.error('request error', error) // for debug
    return Promise.reject(error)
  }
)

// response interceptor
service.interceptors.response.use(
  /**
   * If you want to get http information such as headers or status
   * Please return  response => response
  */

  /**
   * Determine the request status by custom code
   * Here is just an example
   * You can also judge the status by HTTP Status Code
   */
  response => {
    const res = response.data
    // if the custom code is not 20000, it is judged as an error.
    if (res.code && res.code !== 0) {
      Message({
        message: res.msg || 'Error',
        type: 'error',
        duration: 5 * 1000
      })

      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      if (res.code === 50008 || res.code === 50012 || res.code === 401) {
        // to re-login
        MessageBox.confirm('您已被登出，您可以选择取消继续在此页面，或重新登录', '确认登出', {
          confirmButtonText: '重新登录',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          store.dispatch('user/resetToken').then(() => {
            location.reload()
          })
        })
      }
      return Promise.reject(new Error(res.msg || 'Error'))
    } else {
      return res
    }
    // return res
  },
  error => {
    console.error('err:' + error) // for debug
    console.error('error response: ', error.response)
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
      if (error.response.data) {
        let err
        if (error.response.data.error) {
          if (typeof error.response.data.error === 'string') {
            err = error.response.data.error
          } else if (typeof error.response.data.error === 'object') {
            err = error.response.data.error.join('<br/>')
          } else {
            err = error
          }
        } else if (error.response.data.detail) {
          err = error.response.data.detail
        }
        Message({
          message: `<p>【${error.response.status}】${err}</p>`,
          type: 'error',
          duration: 5 * 1000,
          dangerouslyUseHTMLString: true
        })
      }
      return Promise.reject(error)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message)
    }
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service

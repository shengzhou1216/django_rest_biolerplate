import request from '@/utils/request'

export function register(data) {
  return request({
    url: '/auth/register/',
    method: 'post',
    data
  })
}

export function login(data) {
  return request({
    url: '/auth/login/',
    method: 'post',
    data
  })
}

export function getInfo() {
  return request({
    url: '/auth/info/',
    method: 'get'
    // params: { token }
  })
}

export function logout() {
  return request({
    url: '/user/logout/',
    method: 'post'
  })
}


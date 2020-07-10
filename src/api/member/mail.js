import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) {
  return request({
    url: `${requestPath.common}/pm/page`,
    method: 'get',
    params
  })
}

export function addAPI(data) {
  return request({
    url: `${requestPath.common}/pm/save`,
    method: 'post',
    data
  })
}

export function updateAPI(data) {
  return request({
    url: `${requestPath.common}/operatepower/update`,
    method: 'post',
    data
  })
}

export function deleteAPI(data) {
  return request({
    url: `${requestPath.common}/pm/batch/delete`,
    method: 'post',
    data
  })
}

export function getMemberAPI(params) {
  return request({
    url: `${requestPath.common}/member/page/keyword`,
    method: 'get',
    params
  })
}

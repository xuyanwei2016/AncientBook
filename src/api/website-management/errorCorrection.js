import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getData(params) {
  return request({
    url: `${requestPath.common}/correction/page`,
    method: 'get',
    params
  })
}

export function deleteData(data) {
  return request({
    url: `${requestPath.common}/correction/delete/${data}`,
    method: 'post'
    // data
  })
}

export function addData(data) {
  return request({
    url: `${requestPath.common}/correction/save`,
    method: 'post',
    data
  })
}

export function changeType(data) {
  return request({
    url: `${requestPath.common}/correction/batch/update/reply-status`,
    method: 'post',
    data
  })
}

import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getData(params) {
  return request({
    url: `${requestPath.common}/adsign/page`,
    method: 'get',
    params
  })
}

export function getAdSignAPI(params) {
  return request({
    url: `${requestPath.common}/adsign/${params}`,
    method: 'get'
  })
}

export function changeStatus(data) {
  return request({
    url: `${requestPath.common}/adsign/batch/update`,
    method: 'post',
    data
  })
}

export function massDeleteAPI(data) {
  return request({
    url: `${requestPath.common}/adsign/batch/delete`,
    method: 'post',
    data
  })
}

export function updateAdPos(data) {
  return request({
    url: `${requestPath.common}/adsign/update`,
    method: 'post',
    data
  })
}

export function createAdPos(data) {
  return request({
    url: `${requestPath.common}/adsign/save`,
    method: 'post',
    data
  })
}

export function getAds(params) {
  return request({
    url: `${requestPath.common}/adspace/page`,
    method: 'get',
    params
  })
}

export function deleteAd(data) {
  return request({
    url: `${requestPath.common}/adspace/batch/delete`,
    method: 'post',
    data
  })
}

export function addAd(data) {
  return request({
    url: `${requestPath.common}/adspace/save`,
    method: 'post',
    data
  })
}

export function updateAd(data) {
  return request({
    url: `${requestPath.common}/adspace/update`,
    method: 'post',
    data
  })
}

export function getOnead(params) {
  return request({
    url: `${requestPath.common}/adspace/${params}`,
    method: 'get'
  })
}

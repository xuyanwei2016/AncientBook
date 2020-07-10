import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/copyright/listByNameOrIdentifier`,
        method: 'get',
        params
    })
}
export function deleteAPI(data) {
    return request({
        url: `${requestPath.resource}/copyright/batch/delete`,
        method: 'post',
        data:data
    })
}
export function addAPI(data) {
    return request({
        url: `${requestPath.resource}/copyright/save`,
        method: 'post',
        data: data
    })
}
export function updateAPI(data) {
    return request({
        url: `${requestPath.resource}/copyright/update`,
        method: 'post',
        data: data
    })
}
export function detailsAPI(data) {
    return request({
        url: `${requestPath.resource}/copyright/${data}`,
        method: 'get',
        data
    })
}

export function contractClassAPI(data) {
    return request({
        url: `${requestPath.resource}/public/contract`,
        method: 'get',
        data
    })
}
export function getauthorListAPI(params) {
    console.log(params)
    return request({
        url: `${requestPath.resource}/authorLibrary/page`,
        method: 'get',
        params: params
    })
}
export function excelAPI(data) {
    return request({
        url: `${requestPath.resource}/copyright/import`,
        method: 'post',
        data: data
    })
}

/*新书合同管理 导出GET /bg/copyright/export*/
export function exportAPI(data) {
  return request({
    url: `${requestPath.resource}/copyright/export`,
    method: 'post',
    data: data
  })
}

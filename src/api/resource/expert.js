import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

// 分页查询
export function getListAPI(params) {
    console.log(params)
    return request({
        url: `${requestPath.resource}/authorLibrary/page`,
        method: 'get',
        params:params
    })
}

// 批量审核
export function batchingAuditAPI(data) {
    return request({
        url: `${requestPath.resource}/authorLibrary/batch/update/status`,
        method: 'post',
        data
    })
}

// 批量删除
export function batchingDelAPI(data) {
    return request({
        url: `${requestPath.resource}/authorLibrary/batch/delete`,
        method: 'post',
        data
    })
}

// 详情页面
export function detailsAPI(id) {
    return request({
        url: `${requestPath.resource}/authorLibrary/${id}`,
        method: 'get',
    })
}

// 新增
export function addAPI(data) {
    return request({
        url: `${requestPath.resource}/authorLibrary/save`,
        method: 'post',
        data
    })
}

// 更新
export function updateAPI(data) {
    return request({
        url: `${requestPath.resource}/authorLibrary/update`,
        method: 'post',
        data
    })
}
       // 自定义分类树结构
       export function getTreeAPI(params) {
        return request({
            url: `${requestPath.resource}/diytype/list/dataType?resourceType=${params}`,
            method: 'get',
        })
      }
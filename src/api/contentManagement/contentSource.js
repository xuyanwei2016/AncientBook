import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

// 获取列表
export function getListAPI(params) {
    return request({
        url: `${requestPath.content}/contentSource/page`,
        method: 'get',
        params
    })
}
//获取所有的列表，没有分页
export function getAllSourceAPI(params) {
    return request({
        url: `${requestPath.content}/contentSource/list`,
        method: 'get',
        params
    })
}
// 新增
export function addAPI(data) {
    return request({
        url: `${requestPath.content}/contentSource/save`,
        method: 'post',
        data
    })
}

// 批量删除
export function batchDelAPI(data) {
    return request({
        url: `${requestPath.content}/contentSource/batch/delete`,
        method: 'post',
        data
    })
}

// 更新
export function updateAPI(data) {
    return request({
        url: `${requestPath.content}/contentSource/update`,
        method: 'post',
        data
    })
}

// 详情
export function detailsAPI(id) {
    return request({
        url: `${requestPath.content}/contentSource/${id}`,
        method: 'get',
    })
}

//名称是否存在
export function isExsitAPI(params) {
    console.log(params)
    return request({
        url: `${requestPath.content}/contentSource/isExist`,
        method: 'get',
        params
    })
}
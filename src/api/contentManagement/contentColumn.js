import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getAllAPI() {
    return request({
        url: `${requestPath.content}/contentColumn/all`,
        method: 'get',
    })
}

// 新增
export function addAPI(data) {
    return request({
        url: `${requestPath.content}/contentColumn/save`,
        method: 'post',
        data
    })
}

// 查询
export function detailsAPI(id) {
    return request({
        url: `${requestPath.content}/contentColumn/${id}`,
        method: 'get',
    })
}

// 单条更新
export function updateAPI(data) {
    return request({
        url: `${requestPath.content}/contentColumn/update/${data.id}`,
        method: 'post',
        data
    })
}

// 单条删除
export function batchDelAPI(data) {
    return request({
        url: `${requestPath.content}/contentColumn/delete`,
        method: 'post',
        data:data
    })
}

// 查询最大排序号
export function maxSortAPI(params) {
    return request({
        url: `${requestPath.content}/contentColumn/get/maxOrderNum`,
        method: 'get',
        params
    })
}

// 上/下移一位
export function updateUpDownAPI(data) {
    return request({
        url: `${requestPath.content}/contentColumn/update?operationId=${data.operationId}&exchangeId=${data.exchangeId}`,
        method: 'post',
        data
    })
}

//显示名称是否存在

export function ifCheckNameAPI(params) {
    return request({
        url: `${requestPath.content}/contentColumn/check/name`,
        method: 'get',
        params
    })
}

//标识名称是否存在

export function identifierNameAPI(params) {
    return request({
        url: `${requestPath.content}/contentColumn/isExist`,
        method: 'get',
        params
    })
}


//修改顺序
export function changeSortAPI(params) {
    return request({
        url: `${requestPath.content}/contentColumn/update/sort`,
        method: 'post',
        params
    })
}
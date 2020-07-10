import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getContantListAPI(params) {
    return request({
        url: `${requestPath.content}/content/page`,
        method: 'get',
        params
    })
}

// 批量审核，伪删除，还原
export function batchAPI(data) {
    return request({
        url: `${requestPath.content}/content/batch/update/review`,
        method: 'post',
        data
    })
}

// 设置属性
export function setAtrAPI(data) {
    return request({
        url: `${requestPath.content}/content/batch/update`,
        method: 'post',
        data
    })
}


// 新增
export function addAPI(data) {
    return request({
        url: `${requestPath.content}/content/save`,
        method: 'post',
        data
    })
}

// 详情页
export function detailsAPI(id) {
    return request({
        url: `${requestPath.content}/content/${id}`,
        method: 'get',
    })
}

// 更新
export function updateAPI(data) {
    return request({
        url: `${requestPath.content}/content/update/${data.id}`,
        method: 'post',
        data
    })
}


// 批量彻底删除
export function batchDelAPI(data) {
    return request({
        url: `${requestPath.content}/content/batch/delete`,
        method: 'post',
        data
    })
}


// 全部清空
export function allEmptyAPI(data) {
    return request({
        url: `${requestPath.content}/content/delete/all`,
        method: 'post',
        data
    })
}


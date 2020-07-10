import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

// 列表
export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/recycle-bin/page`,
        method: 'get',
        params
    })
}

// 详情页
export function detailsAPI(id) {
    return request({
        url: `${requestPath.resource}/recycle-bin/get/${id}`,
        method: 'get',
    })
}

// 批量删除
export function batchDelAPI(data) {
    return request({
        url: `${requestPath.resource}/recycle-bin/batch/delete`,
        method: 'post',
        data
    })
}

// 批量还原
export function batchRestoreAPI(data) {
    return request({
        url: `${requestPath.resource}/recycle-bin/batch/restore`,
        method: 'post',
        data
    })
}

// 全部清空
export function allEmptyAPI(data) {
    return request({        
        url: `${requestPath.resource}/recycle-bin/delete/all`,
        method: 'post',
        data
    })
}
export function getTypeAPI(params) { //数据类型
    return request({
        url: `${requestPath.resource}/public/type/list`,
        method: 'get',
        params: params
    })
}
// 相关资源列表
export function getRelatedListAPI(params) { //数据类型
    return request({
        url: `${requestPath.resource}/public/relation-resource/page`,
        method: 'get',
        params: params
    })
}
export function saveAPI(data) { //申请
    return request({
        url: `${requestPath.works}/apply/save`,
        method: 'post',
        data
    })
}

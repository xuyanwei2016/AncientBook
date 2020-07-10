import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getClassify() {
    return request({
        url: `${requestPath.resource}/diytype/tree`,
        method: 'get'
    })
}

export function getIdify(params) {
    return request({
        url: `${requestPath.resource}/diytype/${params}`,
        method: 'get'
    })
}

export function deleteClassify(data) {
    return request({
        url: `${requestPath.resource}/diytype/delete`,
        method: 'post',
        data
    })
}

export function updateClassify(data) {
    return request({
        url: `${requestPath.resource}/diytype/update`,
        method: 'post',
        data
    })
}

export function addClassify(data) {
    return request({
        url: `${requestPath.resource}/diytype/save`,
        method: 'post',
        data
    })
}

export function isExist(params) {
    return request({
        url: `${requestPath.resource}/diytype/isExist/typeName`,
        method: 'get',
        params
    })
}

export function codeExist(params) {
    return request({
        url: `${requestPath.resource}/diytype/isExist/oldCode/oldCode`,
        method: 'get',
        params
    })
}

// 查询一级分类 
export function getStair(params) {
    return request({
        url: `${requestPath.resource}/diytype/PARENT`,
        method: 'get',
        params
    })
}


//查询自定义分类
export function getNameDiyAPI(data) {
    return request({
        url: `${requestPath.resource}/diytype/tree_name?name=${data}`,
        method: 'get'
    })
}

//查询当前最大排序号
export function getMaxOrderNumAPI(data) {
    return request({
        url: `${requestPath.resource}/diytype/maxOrderNum?id=${data}`,
        method: 'get'
    })
}
import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(params) { //获取主题列表
    return request({
        url: `${requestPath.resource}/themeLexicon/listByChineseRoot`,
        method: 'get',
        params
    })
}

export function deleteAPI(data) { //删除主题
    return request({
        url: `${requestPath.resource}/themeLexicon/batch/delete`,
        method: 'post',
        data
    })
}

export function addAPI(data) { //新增主题
    return request({
        url: `${requestPath.resource}/themeLexicon/save`,
        method: 'post',
        data
    })
}

export function detailsAPI(params) { //根据ID查询
    return request({
        url: `${requestPath.resource}/themeLexicon/get/${params}`,
        method: 'get',
    })
}

export function updateAPI(data) { //更新主题
    return request({
        url: `${requestPath.resource}/themeLexicon/update`,
        method: 'post',
        data
    })
}
export function batchingAuditAPI(data) { //更新主题
    return request({
        url: `${requestPath.resource}/themeLexicon/batch/update/review`,
        method: 'post',
        data
    })
}
export function batchDelAPI(data) { //批量删除主题内容
    return request({
        url: `${requestPath.resource}/themeLexicon/batch/delete`,
        method: 'post',
        data
    })
}
export function isExistAPI(params) { //词根是否存在
    return request({
        url: `${requestPath.resource}/themeLexicon/isExist`,
        method: 'get',
        params:params
    })
}
//导出excel
export function exportAPI(data) { 
    return request({
        url: `${requestPath.resource}/themeLexicon/export?objectIds=${data}`,
        method: 'get'
    })
}
//获取词条列表
export function getSeriesListAPI() { //词根是否存在
    return request({
        url: `${requestPath.resource}/series/list`,
        method: 'get',
    })
}

//导入
export function importAPI(data) { 
    return request({
        url: `${requestPath.resource}/themeLexicon/import`,
        method: 'post',
        data
    })
}

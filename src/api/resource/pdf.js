import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

// 分页查询
export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/pdf-library/page`,
        method: 'get',
        params
    })
}

// 批量审核
export function batchingAuditAPI(data) {
    return request({
        url: `${requestPath.resource}/pdf-library/batch/update/updown`,
        method: 'post',
        data
    })
}

// 批量删除
export function batchingDelAPI(data) {
    return request({
        url: `${requestPath.resource}/pdf-library/batch/delete`,
        method: 'post',
        data
    })
}

// 批量修改价格
export function batchingUpdatePriceAPI(data) {
    return request({
        url: `${requestPath.resource}/pdf-library/batch/update/price`,
        method: 'post',
        data
    })
}

// 查询
export function detailsAPI(id) {
    return request({
        url: `${requestPath.resource}/pdf-library/get/${id}`,
        method: 'get',
    })
}

// 新增
export function addPdfAPI(data) {
    return request({
        url: `${requestPath.resource}/pdf-library/save`,
        method: 'post',
        data
    })
}

// 编辑
export function updatePdfAPI(data) {
    return request({
        url: `${requestPath.resource}/pdf-library/update`,
        method: 'post',
        data
    })
}

// 导入
export function importAPI(data) {
    return request({
        url: `${requestPath.resource}/pdf-library/import`,
        method: 'post',
        data
    })
}

//获取相关资源列表
export function getRelatedList(params) {
    return request({
        url: `${requestPath.resource}/public/relation-resource/page`,
        method: 'get',
        params: params
    })
}
//获取关联内容列表
export function getRelatedListAPI(params) {
    return request({
        url: `${requestPath.resource}/ebook/relation-resource/pop-page`,
        method: 'get',
        params: params
    })
}
//保存关联资源
export function saveRelatedAPI(data) {
    return request({
        url: `${requestPath.resource}/public/relation-resource/save`,
        method: 'post',
        data
    })
}
//批量删除关联资源
export function delRelatedAPI(data) {
    return request({
        url: `${requestPath.resource}/public/batch/relation/delete`,
        method: 'post',
        data
    })
}
// 自定义分类
export function getTreeAPI(params) {
    return request({
        url: `${requestPath.resource}/diytype/list/dataType?resourceType=${params}`,
        method: 'get',
    })
}
// 修改自定义分类
export function updateTypeAPI(data) {
    return request({
        url: `${requestPath.resource}/pdf-library/batch/update/diytype`,
        method: 'post',
        data
    })
}
import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

// 文章列表
export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/clause/page`,
        method: 'get',
        params
    })
}

// 批量审核
export function batchingAuditAPI(data) {
    return request({
        url: `${requestPath.resource}/clause/batch/update`,
        method: 'post',
        data
    })
}

// 批量修改价格
// export function batchingUpdatePriceAPI(data) {
//     return request({
//         url: `${requestPath.resource}/clause/batch/update/price`,
//         method: 'post',
//         data
//     })
// }

// 批量删除
export function batchingDelAPI(data) {
    return request({
        url: `${requestPath.resource}/clause/batch/delete`,
        method: 'post',
        data
    })
}

// 新增
export function addAPI(data) {
    return request({
        url: `${requestPath.resource}/clause/save`,
        method: 'post',
        data
    })
}
//更新
export function updateAPI(data) {
    return request({
        url: `${requestPath.resource}/clause/update`,
        method: 'post',
        data
    })
}
//导入条文
export function importClauseAPI(data) {
    return request({
        url: `${requestPath.resource}/clause/import`,
        method: 'post',
        data
    })
}
//获取指定课件信息
export function detailsAPI(params) {
    return request({
        url: `${requestPath.resource}/clause/get/${params}`,
        method: 'get'
    })
}
// 添加附件
export function uploadFileListAPI(data) {
    return request({
        url: `${requestPath.resource}/clause/save/attachment`,
        method: 'post',
        data
    })
}
//附件删除
export function delFileListAPI(data) {
    return request({
        url: `${requestPath.resource}/clause/delete/attachment`,
        method: 'post',
        data
    })
}
//获取相关资源列表
export function getRelatedList(params) {
    return request({
        url: `${requestPath.resource}/public/relation-resource/page`,
        method: 'get',
        params:params
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
//批量删除关联资源
// export function delRelatedAPI(data) {
//     return request({
//         url: `${requestPath.resource}/clause/batch/relation/delete`,
//         method: 'post',
//         data
//     })
// }
//批量修改分类
export function confirmUpdateDiytype(data) {
    return request({
        url: `${requestPath.resource}/clause/batch/update/diytype`,
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
      url: `${requestPath.resource}/clause/batch/update/diytype`,
      method: 'post',
      data
    })
}

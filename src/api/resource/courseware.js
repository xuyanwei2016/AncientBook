import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

// 文章列表
export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/courseware-library/page`,
        method: 'get',
        params
    })
}

// 批量审核
export function batchingAuditAPI(data) {
    return request({
        url: `${requestPath.resource}/courseware-library/batch/update/updown`,
        method: 'post',
        data
    })
}

// 批量修改价格
export function batchingUpdatePriceAPI(data) {
    return request({
        url: `${requestPath.resource}/courseware-library/batch/update/price`,
        method: 'post',
        data
    })
}

// 批量删除
export function batchingDelAPI(data) {
    return request({
        url: `${requestPath.resource}/courseware-library/batch/delete`,
        method: 'post',
        data
    })
}

// 新增
export function addAPI(data) {
    return request({
        url: `${requestPath.resource}/courseware-library/save`,
        method: 'post',
        data
    })
}
//修改
export function updateAPI(data) {
    return request({
        url: `${requestPath.resource}/courseware-library/update`,
        method: 'post',
        data
    })
}
//导入课件
export function importCourseAPI(data) {
    return request({
        url: `${requestPath.resource}/courseware-library/import`,
        method: 'post',
        data
    })
}
//获取指定课件信息
export function getInfoAPI(params) {
    return request({
        url: `${requestPath.resource}/courseware-library/get/${params}`,
        method: 'get'
    })
}
// 添加附件
export function uploadFileListAPI(data) {
    return request({
        url: `${requestPath.resource}/courseware-library/save/attachment`,
        method: 'post',
        data
    })
}
//获取相关资源列表
export function getRelatedList(params) {
    return request({
        url: `${requestPath.resource}/courseware-library/relation-resource/page`,
        method: 'get',
        params:params
    })
}
//保存关联资源
export function saveRelatedAPI(data) {
    return request({
        url: `${requestPath.resource}/courseware-library/relation-resource/save`,
        method: 'post',
        data
    })
}
//批量删除关联资源
export function delRelatedAPI(data) {
    return request({
        url: `${requestPath.resource}/courseware-library/batch/relation/delete`,
        method: 'post',
        data
    })
}
//删除附件
export function delFileListAPI(data) {
    return request({
        url: `${requestPath.resource}/courseware-library/delete/attachment`,
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
// 修改自定义分类
export function updateTypeAPI(data) {
    return request({
      url: `${requestPath.resource}/courseware-library/batch/update/diytype`,
      method: 'post',
      data
    })
}
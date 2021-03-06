import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
export function getListAPI(params) { //列表
    return request({
        url: `${requestPath.resource}/animation-library/page`,
        method: 'get',
        params
    })
}
export function getCopyrightListAPI(params) {
    return request({
        url: `${requestPath.resource}/copyright/page/list/vague`,
        method: 'get',
        params
    })
}
export function importAnimationAPI(data) { //上传动画
    return request({
        url: `${requestPath.resource}/animation-library/import`,
        method: 'post',
        data
    })
}
export function saveAPI(data) { //新增
    return request({
        url: `${requestPath.resource}/animation-library/save`,
        method: 'post',
        data
    })
}
// 添加附件
export function uploadFileListAPI(data) {
    return request({
        url: `${requestPath.resource}/animation-library/save/attachment`,
        method: 'post',
        data
    })
}
export function detailsAPI(params) { //列表
    return request({
        url: `${requestPath.resource}/animation-library/get/${params}`,
        method: 'get',
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
/*批量审核 */
export function batchingAuditAPI(data) {
    return request({
        url: `${requestPath.resource}/animation-library/batch/update/updown`,
        method: 'post',
        data:data
    })
}
/*批量修改价格 */
export function batchingUpdatePriceAPI(data) {
    return request({
        url: `${requestPath.resource}/animation-library/batch/update/price`,
        method: 'post',
        data:data
    })
}
export function batchDeleteAPI(data) { //批量删除
    return request({
        url: `${requestPath.resource}/animation-library/batch/delete`,
        method: 'post',
        data
    })
}
// 左侧树
export function getNavAPI() {
    return request({
        url: `${requestPath.resource}/diytype/tree`,
        method: 'get'
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
      url: `${requestPath.resource}/animation-library/batch/update/diytype`,
      method: 'post',
      data
    })
}
export function editAPI(data) { //编辑
    return request({
        url: `${requestPath.resource}/animation-library/update`,
        method: 'post',
        data
    })
}
//附件删除
export function delFileListAPI(data) {
    return request({
        url: `${requestPath.resource}/animation-library/delete/attachment`,
        method: 'post',
        data
    })
}
//获取资源操作记录
export function getResourceLogAPI(params) {
    return request({
        url: `${requestPath.common}/log/resourceLog`,
        method: 'get',
        params:params
    })
}
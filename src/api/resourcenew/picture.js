import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
/*查询图片列表 */
export function getPicList(params) {
  return request({
      url: `${requestPath.resource}/image-library/page`,
      method: 'get',
      params:params
  })
}
/*批量审核图片 */
export function batchingAuditAPI(data) {
  return request({
      url: `${requestPath.resource}/image-library/batch/update/updown`,
      method: 'post',
      data:data
  })
}
/*批量修改价格 */
export function batchingUpdatePriceAPI(data) {
  return request({
      url: `${requestPath.resource}/image-library/batch/update/price`,
      method: 'post',
      data:data
  })
}
/*批量删除 */
export function batchingDelAPI(data) {
  return request({
      url: `${requestPath.resource}/image-library/batch/delete`,
      method: 'post',
      data:data
  })
}
//添加
export function addAPI(data) {
  return request({
    url: `${requestPath.resource}/image-library/save`,
    method: 'post',
    data
  })
}
//修改
export function updateAPI(data) {
  return request({
    url: `${requestPath.resource}/image-library/update`,
    method: 'post',
    data
  })
}
//根据id获取值
export function getInfoAPI(id) { 
  return request({
    url: `${requestPath.resource}/image-library/get/${id}`,
    method: 'get'
  })
}
// 根据类型获取标签
export function getLabelAPI(data){
  return request({
    url: `${requestPath.resource}/label/list/dataType?dataType=${data}`,
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

// 左侧树
export function getNavAPI() {
  return request({
      url: `${requestPath.resource}/diytype/tree`,
      method: 'get'
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
   //批量新增
   export function saveBatchAPI(data) {
    return request({
      url: `${requestPath.resource}/image-library/batch/save`,
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
    url: `${requestPath.resource}/image-library/batch/update/diytype`,
    method: 'post',
    data
  })
}
// 添加附件
export function uploadFileListAPI(data) {
  return request({
      url: `${requestPath.resource}/image-library/save/attachment`,
      method: 'post',
      data
  })
}
//附件删除
export function delFileListAPI(data) {
  return request({
      url: `${requestPath.resource}/image-library/delete/attachment`,
      method: 'post',
      data
  })
}
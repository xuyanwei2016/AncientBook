import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

// 文章列表
export function getListAPI(params) {
    return request({
        url: `${requestPath.resource}/criterion/page`,
        method: 'get',
        params
    })
}

// 批量审核
export function batchingAuditAPI(data) { 
    return request({
        url: `${requestPath.resource}/criterion/batch/update`,
        method: 'post',
        data
    })
}

// 批量删除
export function batchingDelAPI(data) {
    return request({
        url: `${requestPath.resource}/criterion/batch/delete`,
        method: 'post',
        data
    })
}

// 新增
export function addAPI(data) {
    return request({
        url: `${requestPath.resource}/criterion/save`,
        method: 'post',
        data
    })
}
// /bg/achievement/get/{oid} 获取列表中
// 更新
export function updateAPI(data) {
    return request({
        url: `${requestPath.resource}/criterion/update`,
        method: 'post',
        data
    })
}

// 详情
export function detailsAPI(id) {
    return request({
        url: `${requestPath.resource}/criterion/get/${id}`,
        method: 'get',
    })
}
//获取相关资源列表
export function getRelatedList(params) {
    return request({
        url: `${requestPath.resource}/criterion/relation-resource/page`,
        method: 'get',
        params:params
    })
  }
   //保存关联资源
  export function saveRelatedAPI(data) {
    return request({
      url: `${requestPath.resource}/criterion/relation-resource/save`,
      method: 'post',
      data
    })
  }
    //批量删除关联资源
    export function delRelatedAPI(data) {
        return request({
          url: `${requestPath.resource}/article-library/batch/relation/delete`,
          method: 'post',
          data
        })
      }
    // 自定义分类
export function getTreeAPI(params) {
    return request({
        url: `${requestPath.resource}/diytype/tree`,
        method: 'get',
        params:params
    })
  }
  // 修改自定义分类
  export function updateTypeAPI(data) {
    return request({
      url: `${requestPath.resource}/criterion/batch/update/diytype`,
      method: 'post',
      data
    })
  }
  // 添加附件
export function uploadFileListAPI(data) {
    return request({
        url: `${requestPath.resource}/criterion/save/attachment?oid=${data.bookid}&token=${data.token}`,
        method: 'post',
        data
    })
  }
  //附件删除
  export function delFileListAPI(data) {
    return request({
        url: `${requestPath.resource}/criterion/delete/attachment?oid=${data.bookid}&token=${data.token}`,
        method: 'post',
        data
    })
  }
  //导入(未做)
  export function toLeadAPI(data) {
    return request({
      url: `${requestPath.resource}/criterion/import`,
      method: 'post',
      data
    })
  }

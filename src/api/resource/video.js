import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
// 左侧树
export function getNavAPI() {
    return request({
        url: `${requestPath.resource}/diytype/tree`,
        method: 'get'
    })
  }

export function getListAPI(params) { //列表
    return request({
        url: `${requestPath.resource}/video-library/page`,
        method: 'get',
        params
    })
}

export function batchDeleteAPI(data) { //批量删除
    return request({
        url: `${requestPath.resource}/video-library/batch/delete`,
        method: 'post',
        data
    })
}

export function upDownAPI(data) { //上架
    return request({
        url: `${requestPath.resource}/video-library/batch/update/updown`,
        method: 'post',
        data
    })
}

export function saveAPI(data) { //新增
    return request({
        url: `${requestPath.resource}/video-library/save`,
        method: 'post',
        data
    })
}

export function editAPI(data) { //编辑
    return request({
        url: `${requestPath.resource}/video-library/update`,
        method: 'post',
        data
    })
}

export function detailsAPI(params) { //列表
    return request({
        url: `${requestPath.resource}/video-library/get/${params}`,
        method: 'get',
    })
}
/*批量审核 */
export function batchingAuditAPI(data) {
    return request({
        url: `${requestPath.resource}/video-library/batch/update/updown`,
        method: 'post',
        data:data
    })
  }
/*批量修改价格 */
export function batchingUpdatePriceAPI(data) {
    return request({
        url: `${requestPath.resource}/video-library/batch/update/price`,
        method: 'post',
        data:data
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
//获取关联内容列表
export function getRelatedListAPI(params) {
    return request({
        url: `${requestPath.resource}/ebook/relation-resource/pop-page`,
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
 //导入视频
 export function importVideoAPI(data) {
    return request({
      url: `${requestPath.resource}/video-library/import`,
      method: 'post',
      data
    })
  }
      // 自定义分类
export function getTreeAPI(params) {
    return request({
        url: `${requestPath.resource}/diytype/list/dataType?resourceType=${params}`,
        method: 'get',
        params:params
    })
  }
  // 修改自定义分类
  export function updateTypeAPI(data) {
    return request({
      url: `${requestPath.resource}/video-library/batch/update/diytype`,
      method: 'post',
      data
    })
  }
   // 添加附件
export function uploadFileListAPI(data) {
    return request({
        url: `${requestPath.resource}/video-library/save/attachment?oid=${data.bookid}&token=${data.token}`,
        method: 'post',
        data
    })
  }
  //附件删除
  export function delFileListAPI(data) {
    return request({
        url: `${requestPath.resource}/video-library/delete/attachment?oid=${data.bookid}&token=${data.token}`,
        method: 'post',
        data
    })
  }
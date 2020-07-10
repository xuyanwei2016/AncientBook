import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
// 左侧树
export function getNavAPI() {
  return request({
      url: `${requestPath.resource}/diytype/tree`,
      method: 'get'
  })
}
/*查询图书列表 */
export function getListAPI(params) {
  return request({
      url: `${requestPath.resource}/ebook/page`, 
      method: 'get',
      params:params
  })
}
/*批量审核 */
export function batchingAuditAPI(data) {
  return request({
      url: `${requestPath.resource}/ebook/batch/update/review`,
      method: 'post',
      data:data
  })
}
/*批量修改价格 */
export function batchingUpdatePriceAPI(data) {
  return request({
      url: `${requestPath.resource}/ebook/batch/update/price`,
      method: 'post',
      data:data
  })
}
/*批量删除 */
export function batchingDelAPI(data) {
  return request({
      url: `${requestPath.resource}/ebook/batch/delete`,
      method: 'post',
      data:data
  })
}
/*批量修改销售状态 */
export function setSellAPI(data) {
  return request({
    url: `${requestPath.resource}/ebook/batch/update/updown`,
      method: 'post',
      data:data
  })
}
/*提交审核 */
export function commitAuditAPI(data) {
  return request({
      url: `${requestPath.resource}/ebook/batch/update`,
      method: 'post',
      data:data
  })
}
//添加
export function addAPI(data) {
  return request({
    url: `${requestPath.resource}/ebook/save`,
    method: 'post',
    data
  })
}
//修改
export function updateAPI(data) {
  return request({
    url: `${requestPath.resource}/ebook/update`, 
    method: 'post', 
    data
  })
}
//根据id获取值
export function getInfoAPI(id) { 
  return request({
    url: `${requestPath.resource}/ebook/${id}`,
    method: 'get'
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
        url: `${requestPath.resource}/public/relation-resource/pop-page`,
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
 
  //ftp
  export function getFtpAPI(params) {
    return request({
        url: `/file/ftp/analysis/directory`,
        method: 'get',
        params:params
    })
  }
//解析epub
export function epubAPI(data) {
  return request({
    url: `${requestPath.resource}/ebook/uploadepub?tokens=${data}`,
    method: 'post',
    data
  })
}
//下载模板
export function downLoadTempAPI(params) {
  return request({
      url: `/file/ftp/download/file`,
      method: 'get',
      params:params
  })
}
// 导出excel
export function excelAPI(data) {
  return request({
    url: `${requestPath.resource}/ebook/export`,
    method: 'post',
    data
  })
}
// 导入excel
export function excelImportAPI(data, obj) {
  return request({
    url: `${requestPath.resource}/ebook/import?diyTypeId=${obj.diyTypeId}&diyTypeCode=${obj.diyTypeCode}`,
    method: 'post',
    data
  })
}
//导入相关资源
export function resourceImportAPI(data) {
  return request({
    url: `${requestPath.resource}/ebook/import/resource`,
    method: 'post',
    data
  })
}
//获取专家库姓名
export function getAuthorsAPI(data) {
  return request({
      url: `${requestPath.resource}/authorLibrary/list/name`,
      method: 'get',
      data
  })
}

//获取合同列表
export function getCopyrightListAPI(params) {
  return request({
    url: `${requestPath.statistics}/contract/client/get`,
    method: 'get',
    params
  })
}
//获取版权列表
export function getTypeSetAPI(params) {
  return request({
    url: `${requestPath.ftp}/list?remoteDirectory=${params}/排版文件`,
    method: 'get'
  })
}
//获取封面列表
export function getCoverAPI(params) {
  return request({
    url: `${requestPath.ftp}/list?remoteDirectory=${params}/封面`,
    method: 'get'
  })
}

//获取排版文件
export function getCopyrAPI(params) {
  return request({
    url: `${requestPath.ftp}/list?remoteDirectory=${params}/版权`,
    method: 'get'
  })
}

export function getRelationResourceAPI(params) { //相关资源
  return request({
    url: `${requestPath.resource}/ebook/relation-resource/${params}`,
    method: 'get'
  })
}


export function getRelationResourceDetailsAPI(data) { //详情
  return request({
    url: `${requestPath.resource}/ebook/getarticle?markid=${data.markId}`,
    method: 'get'
  })
}


//获目录
export function getChapterAPI(data) { 
  return request({
    url: `${requestPath.resource}/ebook/getchapter?bookid=${data}`,
    method: 'get'
  })
}


//文件下载
export function downLoadFileAPI(data) {
  return request({
    url:`${requestPath.ftp}/download/directoryfiledown?pathList=${data}`,
    method:'post'
  })
}
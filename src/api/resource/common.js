import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getNavAPI() {
    return request({
        url: `${requestPath.resource}/diytype/tree`,
        method: 'get'
    })
}

export function getOptionAPI() {
    return request({
        url: `${requestPath.resource}/diytype/list`,
        method: 'get'
    })
}
export function getTypeAPI(params) { //全部数据类型-列表
    return request({
        url: `${requestPath.resource}/public/type/list`,
        method: 'get'
    })
}

export function fileAPI(params) { //文件类型-列表
    return request({
        url: `${requestPath.resource}/public/download/list`,
        method: 'get',
        params: params
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
    url: `${requestPath.resource}/public/batch/update/diytype`,
      method: 'post',
      data
    })
  }
// 导出图书
export function excelExportAPI(params) {
    return request({
        url: `${requestPath.resource}/public/export`,
        method: 'get',
        params: params
    })
}
// 导出excel字段名称列表
export function exportListAPI(params) {
    return request({
        url: `${requestPath.resource}/public/export/list`,
        method: 'get',
        params: params
    })
}

// 添加附件
export function uploadFileListAPI(data) {
    return request({
        url: `${requestPath.resource}/ebook/save/attachment`,
        method: 'post',
        data
    })
}
//下载
export function downloadAPI(params) {
    return request({
        url: `${requestPath.works}/apply/predown`,
        method: 'get',
        params: params
    })
}
//丛书名称
export function bookNameListAPI(params) {
    return request({
        url: `${requestPath.resource}/series/list`,
        method: 'get',
        params: params
    })
}
//附件列表
export function files(params) {
    return request({
        url: `${requestPath.file}token/page`,
        method: 'get',
        params
    })
}
//附件删除
export function delFileListAPI(data) {
    return request({
        url: `${requestPath.resource}/ebook/delete/attachment?bookid=${data.bookid}&token=${data.token}`,
        method: 'post',
        data
    })
}
//获取关联内容弹窗列表
export function getRelatedListAPI(params) {
    return request({
        url: `${requestPath.resource}/public/relation-resource/pop-page`,
        method: 'get',
        params:params
    })
  }
// 所属部门
export function getDepartmentAPI(params) {
    return request({
        url: `${requestPath.common}/department/list`,
        method: 'get',
        params:params
    })
  }
  //查询用户所属部门
export function sectionAPI(data){
    return request({
      url:`${requestPath.common}/user/get/default`,
      method:'get',
      data
    })
  }

//选择相关合同
  export function getCopyrightListAPI(params) {
    return request({
        url: `${requestPath.resource}/copyright/page/list/vague`,
        method: 'get',
        params
    })
  }
  export function getCopyrightListAPI2(params) {
    return request({
        url: `${requestPath.resource}/copyright/page/list/vague`,
        method: 'get',
        params
    })
  }
//加工文件列表
export function getProcessAPI(data) {
    return request({
        url: `${requestPath.ftp}/jglist?remoteDirectory=${data}`,
        method: 'get',
    })
}
// 操作记录列表
export function fileListAPI(params) {
    return request({
        url: `${requestPath.common}/log/resourceLog`,
        method: 'get',
        params: params
    })
}



//pdf加密
export function encryptDividePDFByPageAPI(data) {
    return request({
        url: `${requestPath.pdf}/encryptDividePDFByPage/${data}/10`,
        method: 'get'
    })
}
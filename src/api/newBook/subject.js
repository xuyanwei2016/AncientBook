import request from '@/utils/request';
import { requestPath } from '@/utils/global.js';

/*查询列表 */
export function getListAPI(params){
  return request({
    url:`${requestPath.newbook}/subject/page`,
    method:'get',
    params
  })
}

/*按照作者模糊查询*/
export function getAuthorAPI(params){
  return request({
    url:`${requestPath.resource}/authorLibrary/list/name`,
    method:'get',
    params
  })
}
/*根据输丛书名智能提示，右模糊*/
export function getSeriesAPI(params){
  return request({
    url:`${requestPath.resource}/series/prompt/{name}`,
    method:'get',
    params
  })
}

/*提交审核*/
export function updateStatusAPI(data){
  return request({
    url:`${requestPath.newbook}/subject/batch/update/status`,
    method:'post',
    data
  })
}

/*批量删除*/
export function batchDeleteAPI(data){
  return request({
    url:`${requestPath.newbook}/subject/batch/delete`,
    method:'post',
    data
  })
}

/*查看详情*/
export function getDetailAPI(data){
  return request({
    url:`${requestPath.newbook}/subject/get/${data}`,
    method:'get',
  })
}

/*获取学历列表*/
export function getEducationAPI(data){
  return request({
    url:`${requestPath.newbook}/subject/get/education`,
    method:'get',
  })
}

/*修改*/
export function editAPI(data){
  return request({
    url:`${requestPath.newbook}/subject/update`,
    method:'post',
    data
  })
}

/*导出*/
export function exportAPI(data){
  return request({
    url:`${requestPath.newbook}/subject/export`,
    method:'get',
    params:data
  })
}

/*批量审核*/
export function batchAuditAPI(data){
  return request({
    url:`${requestPath.newbook}/subject/batch/audit`,
    method:'post',
    data
  })
}

/*获取当前人的申报权限*/
export function getAuthAPI(data){
  return request({
    url:`${requestPath.common}/user/get/audit/auth`,
    method:'get',
  })
}

/*获取部门下的用户*/
export function getUserListAPI(data){
  return request({
    url:`${requestPath.common}/user/editor/list`,
    method:'get',
  })
}

/*保存选题*/
export function saveAPI(data){
  return request({
    url:`${requestPath.newbook}/subject/save`,
    method:'post',
    data
  })
}

/*详情中获取的审核意见*/
export function getAuditsListAPI(data){
  return request({
    url:`${requestPath.newbook}/subject/list/audits/${data}`,
    method:'get',
  })
}

/*下载GET /file/download/{fileName}*/
export function downLoadAPI(data){
  return request({
    url:`${requestPath.file}/download/${data}`,
    method:'get',
  })
}

/*指定三审负责人POST /bg/subject/assign*/
export function subjectAssignAPI(data){
  return request({
    url:`${requestPath.newbook}/subject/assign`,
    method:'post',
    data
  })
}

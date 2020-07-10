import request from '@/utils/request';
import { requestPath } from '@/utils/global.js';

export function getListAPI(params){
  return request({
    url:`${requestPath.newbook}/cip/page`,
    method:'get',
    params
  })
}
/*提交审核*/
export function updateStatusAPI(data){
  return request({
    url:`${requestPath.newbook}/cip/update/status`,
    method:'post',
    data
  })
}
/*批量审核*/
export function batchAuditAPI(data){
  return request({
    url:`${requestPath.newbook}/cip/batch/audit`,
    method:'post',
    data
  })
}
/*填写cip*/
export function fillCipAPI(data){
  return request({
    url:`${requestPath.newbook}/cip/fill/cip`,
    method:'post',
    data
  })
}
/*分配书号*/
export function assignIsbnAPI(data){
  return request({
    url:`${requestPath.newbook}/cip/assign/isbn`,
    method:'post',
    data
  })
}

/*查看详情*/
export function getDetailAPI(data){
  return request({
    url:`${requestPath.newbook}/cip/get/${data}`,
    method:'get',
  })
}

/*修改*/
export function updateAPI(data){
  return request({
    url:`${requestPath.newbook}/cip/update/details`,
    method:'post',
    data
  })
}
/*获取审核意见*/
export function getAuditLogsAPI(data){
  return request({
    url:`${requestPath.newbook}/cip/get/auditLogs?id=${data}`,
    method:'get',
  })
}

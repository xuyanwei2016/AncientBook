import request from '@/utils/request';
import { requestPath } from '@/utils/global.js';

/*分页列表（三审列表）*/
export function getListAPI(params){
  return request({
    url:`${requestPath.newbook}/audit/page`,
    method:'get',
    params
  })
}

/*查询子分页列表（一审，二审，三审）*/
export function getSubListAPI(params){
  return request({
    url:`${requestPath.newbook}/audit/sub/page`,
    method:'get',
    params
  })
}
/*指定审校人*/
export function auditAssignAPI(data){
  return request({
    url:`${requestPath.newbook}/audit/assign`,
    method:'post',
    data
  })
}

/*获取三审详情*/
export function getThreeDetailAPI(params){
  return request({
    url:`${requestPath.newbook}/audit/get/${params}`,
    method:'get',
  })
}

/*完善信息*/
export function perfectInfoAPI(data){
  return request({
    url:`${requestPath.newbook}/audit/perfect`,
    method:'post',
    data
  })
}

/*批量审核审核*/
export function batchAuditAPI(data){
  return request({
    url:`${requestPath.newbook}/audit/batch/audit`,
    method:'post',
    data
  })
}

/*查审核意见列表*/
export function getAuditListAPI(params){
  return request({
    url:`${requestPath.newbook}/audit/list/logs?auditId=${params}`,
    method:'get',
  })
}

/*子列表中的审核记录GET /bg/audit/sub/list/logs*/
export function getAuditSubListAPI(params){
  return request({
    url:`${requestPath.newbook}/audit/sub/list/logs`,
    method:'get',
    params
  })
}

/*图书再版*/
export function reprintAPI(data){
  return request({
    url:`${requestPath.newbook}/audit/reprint`,
    method:'post',
    data
  })
}

/*验证图书是否印刷*/
export function checkAPI(data){
  return request({
    url:`${requestPath.newbook}/audit/check`,
    method:'post',
    data
  })
}

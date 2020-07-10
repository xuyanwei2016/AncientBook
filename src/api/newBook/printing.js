import request from '@/utils/request';
import {requestPath} from '@/utils/global.js';

export function getListAPI(params){
  return request({
    url:`${requestPath.newbook}/print/page`,
    method:'get',
    params
  })
}

/*提交审核*/
export function updateStatusAPI(data){
  return request({
    url:`${requestPath.newbook}/print/update/status`,
    method:'post',
    data
  })
}

/*图书是否可以加印*/
export function printCheckAPI(data){
  return request({
    url:`${requestPath.newbook}/print/check`,
    method:'post',
    data
  })
}

/*详情GET /bg/print/get/{id}*/
export function getDetailAPI(id){
  return request({
    url:`${requestPath.newbook}/print/get/${id}`,
    method:'get',
  })
}
/*修改*/
export function updateAPI(data){
  return request({
    url:`${requestPath.newbook}/print/update`,
    method:'post',
    data
  })
}

/*获取审核意见列表*/
export function getLogsAPI(params){
  return request({
    url:`${requestPath.newbook}/print/get/logs`,
    method:'get',
    params
  })
}

/*保存意见*/
export function saveAuditAPI(data){
  return request({
    url:`${requestPath.newbook}/print/save/audit`,
    method:'post',
    data
  })
}

/*图书入库*/
export function bookStorageAPI(data){
  return request({
    url:`${requestPath.newbook}/print/book/storage`,
    method:'post',
    data
  })
}

/*图书加印*/
export function bookAdditionAPI(data){
  return request({
    url:`${requestPath.newbook}/print/addition`,
    method:'post',
    data
  })
}

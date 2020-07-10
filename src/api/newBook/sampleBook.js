import request from '@/utils/request';
import { requestPath } from '@/utils/global.js';

/*查询列表 */
export function getListAPI(params){
  return request({
    url:`${requestPath.newbook}/sytlebook/page`,
    method:'get',
    params
  })
}

/*详情*/
export function getDetailAPI(id){
  return request({
    url:`${requestPath.newbook}/sytlebook/get/${id}`,
    method:'get',
  })
}

/*保存申领记录*/
export function saveApplicantAPI(data){
  return request({
    url:`${requestPath.newbook}/sytlebook/save/applicant`,
    method:'post',
    data
  })
}

/*删除申领记录*/
export function deleteApplicantAPI(data){
  return request({
    url:`${requestPath.newbook}/sytlebook/delete?id=${data}`,
    method:'post',
  })
}

/*获取申领列表*/
export function getApplicantAPI(id){
  return request({
    url:`${requestPath.newbook}/sytlebook/list/applicant/${id}`,
    method:'get',
  })
}

/*更新*/
export function updateAPI(data){
  return request({
    url:`${requestPath.newbook}/sytlebook/update`,
    method:'post',
    data
  })
}
































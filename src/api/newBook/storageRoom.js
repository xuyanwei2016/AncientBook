import request from '@/utils/request';
import { requestPath } from '@/utils/global.js';

/*查询列表 */
export function getListAPI(params){
  return request({
    url:`${requestPath.newbook}/storage/page`,
    method:'get',
    params
  })
}

/*详情*/
export function getDetailAPI(id){
  return request({
    url:`${requestPath.newbook}/storage/get/${id}`,
    method:'get',
  })
}

/*修改*/
export function updateAPI(data){
  return request({
    url:`${requestPath.newbook}/storage/update`,
    method:'post',
    data
  })
}




















































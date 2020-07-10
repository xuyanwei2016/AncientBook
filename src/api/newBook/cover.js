import request from '@/utils/request';
import {requestPath} from '@/utils/global.js';

export function getListAPI(params){
  return request({
    url:`${requestPath.newbook}/cover/page`,
    method:'get',
    params
  })
}
/*提交审核 批量审核 设计完成*/
export function submitReviewAPI(data){
  return request({
    url:`${requestPath.newbook}/cover/update/status`,
    method:'post',
    data
  })
}

/*批量删除*/
export function batchDeteleAPI(data){
  return request({
    url:`${requestPath.newbook}/cover/batch/delete`,
    method:'post',
    data
  })
}

/*详情*/
export function getDetailAPI(id){
  return request({
    url:`${requestPath.newbook}/cover/get/${id}`,
    method:'get',
  })
}

/*保存*/
export function saveAPI(data){
  return request({
    url:`${requestPath.newbook}/cover/save`,
    method:'post',
    data
  })
}

/*修改*/
export function updateAPI(data){
  return request({
    url:`${requestPath.newbook}/cover/update`,
    method:'post',
    data
  })
}

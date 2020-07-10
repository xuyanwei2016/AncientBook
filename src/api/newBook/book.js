import request from '@/utils/request';
import { requestPath } from '@/utils/global.js';


export function getListAPI(params){
  return request({
    url:`${requestPath.newbook}/newbook/page`,
    method:'get',
    params
  })
}

/*数量统计*/
export function statisticsAPI(params){
  return request({
    url:`${requestPath.newbook}/newbook/statistics`,
    method:'get',
    params
  })
}

/*详情*/
export function getDetailAPI(id){
  return request({
    url:`${requestPath.newbook}/newbook/get/${id}`,
    method:'get',
  })
}

/*日志列表*/
export function getLogsAPI(params){
  return request({
    url:`${requestPath.newbook}/newbook/list/logs`,
    method:'get',
    params
  })
}



























































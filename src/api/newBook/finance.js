import request from '@/utils/request';
import { requestPath } from '@/utils/global.js';

/*列表*/
export function getListAPI(params){
  return request({
    url:`${requestPath.newbook}/financial/page`,
    method:'get',
    params
  })
}

/*结算POST /bg/financial/settlement*/
export function settlementAPI(data){
  return request({
    url:`${requestPath.newbook}/financial/settlement`,
    method:'post',
    data
  })
}

/*详情GET /bg/financial/get/details*/
export function getFinancialDetailAPI(params){
  return request({
    url:`${requestPath.newbook}/financial/get/details`,
    method:'get',
    params
  })
}

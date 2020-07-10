import request from '@/utils/request'
import { requestPath } from '@/utils/global'

export function getData(data) {
  return request({
    url: `${requestPath.common}/log/page`,
    method: 'get',
    params: data
  })
}


//获取日志详情
export function getDetailAPI(data){
  return request({
    url: `${requestPath.common}/log/getlogbyid?id=${data}`,
    method: 'get'
  })
}
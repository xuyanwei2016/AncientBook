import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'/*查询列表 */
//添加合同
export function addAPI(data) {
    return request({
        url: `${requestPath.statistics}/contract/save`,
        method: 'post',
        data:data
    })
}
//详情
export function detailsAPI(data) {
    return request({
        url: `${requestPath.statistics}/contract/${data}`,
        method: 'get',
        data
    })
}

export function updateAPI (data){
     return request({
        url: `${requestPath.statistics}/contract/update`,
        method: 'post',
        data:data
    })
}
export function exportAPI (params){
    return request({
       url: `${requestPath.statistics}/contract/exportpdf?id=${params}`,
       method: 'get',
       //params:params
   })
}
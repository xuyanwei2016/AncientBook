import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
/*查询列表 */
export function getListAPI(params) {
    return request({
        url: `${requestPath.works}/apply/page`,
        method: 'get',
        params: params
    })
}

export function getdetailsAPI(params) {
    return request({
        url: `${requestPath.works}/apply/${params}`,
        method: 'get',
    })
}
//批量下载
export function predownAPI(params) {
    return request({
        url: `${requestPath.works}/apply/predown`,
        method: 'get',
        params
    })
}
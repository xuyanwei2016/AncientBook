import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
/*查询列表 */
export function getListAPI(params) {
    return request({
        url: `${requestPath.works}/Examine/page`,
        method: 'get',
        params: params
    })
}

export function getdetailsAPI(params) { //详情
    return request({
        url: `${requestPath.works}/Examine/${params}`,
        method: 'get',
    })
}

export function reviewAPI(data) { //批量审核
    return request({
        url: `${requestPath.works}/Examine/batch/update/review`,
        method: 'post',
        data
    })
}
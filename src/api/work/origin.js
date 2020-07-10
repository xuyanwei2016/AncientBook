
import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'/*查询列表 */
export function getListAPI(params) {
    return request({
        url: `${requestPath.statistics}/contract/page`,
        method: 'get',
        params: params
    })
}
/*批量删除 */
export function batchingDelAPI(data) {
    return request({
        url: `${requestPath.statistics}/contract/batch/delete`,
        method: 'post',
        data: data
    })
}

//修改到期提醒
export function saveLocalAlertAPI(data) {
    return request({
        url: `${requestPath.statistics}/contract/save-local-alert?time=${data}`,
        method: 'post',
        data: data
    })
}

//获取到期时间提醒
export function getLocalAlertAPI() {
    return request({
        url: `${requestPath.statistics}/contract/get-local-alert`,
        method: 'get',
    })
}

//导出合同信息
export function exportConAPI(params) {
    return request({
        url: `${requestPath.statistics}/contract/export`,
        method: 'get',
        params:params
    })
}
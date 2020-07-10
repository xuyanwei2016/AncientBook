import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
/*查询列表 */
export function getListAPI(params) {
    return request({
        url: `${requestPath.statistics}/useStatistics/list`,
        method: 'get',
        params: params
    })
}
/*查询部门列表*/
export function getdepartListAPI(params) {
    return request({
        url: `${requestPath.common}/department/list`,
        method: 'get',
        params: params
    })
}
/*年月度对比*/
export function getYearAPI(params) {
    return request({
        url: `${requestPath.statistics}/useStatistics/contrast`,
        method: 'get',
        params: params
    })
}
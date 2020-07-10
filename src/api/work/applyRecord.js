import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
/*查询列表 */
export function getListAPI(params) {
    return request({
        url: `${requestPath.works}/apply/recordpage`,
        method: 'get',
        params: params
    })
}
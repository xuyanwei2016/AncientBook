import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
export function addSearchAPI() {
    return request({
        url: `${requestPath.works}/solr/addsome`,
        method: 'get'
    })
}
export function updateSearchAPI() {
    return request({
        url: `${requestPath.works}/solr/addall`,
        method: 'get'
    })
}
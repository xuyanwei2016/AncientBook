import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'
/*查询列表 */
export function getListAPI(params) {
    return request({
        url: `${requestPath.works}/solr/page`,
        method: 'get',
        params: params
    })
}

export function getTypeAPI(params) { //数据类型
    return request({
        url: `${requestPath.resource}/public/type/list`,
        method: 'get',
        params: params
    })
}

export function saveAPI(data) { //申请
    return request({
        url: `${requestPath.works}/apply/save`,
        method: 'post',
        data
    })
}
export function getresourceNumAPI(params) { //折线
    return request({
        url: `${requestPath.statistics}/numStatistics/contrast`,
        method: 'get',
        params: params
    })
}
export function getPieAPI(params) { //扇形
    console.log(params)
    return request({
        url: `${requestPath.statistics}/numStatistics/fan`,
        method: 'get',
        params: params
    })
}
export function getresourceListAPI(data) { //资源列表
    return request({
        url: `${requestPath.resource}/public/type/list`,
        method: 'get',
        data
    })
}


//资源批量下载
export function downLoadAPI(data) {
    return request({
        url: `${requestPath.works}/apply/predown?ids=${data.ids}&type=${data.type}`,
        method: 'get',
        data
    })
}

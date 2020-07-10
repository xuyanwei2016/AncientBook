import request from '@/utils/request';
import { requestPath } from '@/utils/global.js';
export function getListAPI(params) {
    
        return request({
            url: `${requestPath.resource}/series/page`,
            method: 'get',
            params: params
        })
    
}
export function addAPI(data) {
    return request({
        url: `${requestPath.resource}/series/save`,
        method: 'post',
        data: data
    })
}
export function deleteAPI(data) {
    return request({
        url: `${requestPath.resource}/series/batch/delete`,
        method: 'post',
        data: data
    })
}
export function updateAPI(data) {
    return request({
        url: `${requestPath.resource}/series/update`,
        method: 'post',
        data: data
    })
}
export function isExistAPI(params) {
    return request({
        url: `${requestPath.resource}/series/isExist?name=${params.seriesName}`,
        method: 'get'
    })

}
export function excelAPI(data) {
    return request({
        url: `${requestPath.resource}/series/import`,
        method: 'post',
        data: data
    })
}
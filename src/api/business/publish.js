import request from '@/utils/request';
import { requestPath } from '@/utils/global.js';
export function getListAPI(params) {
        return request({
            url: `${requestPath.resource}/publishing/list/name`,
            method: 'get',
            params
        })
    
   
}
//获取全部的出版单位
export function getAllListAPI(params) {
    return request({
        url: `${requestPath.resource}/publishing/list`,
        method: 'get',
        params
    })


}
export function addAPI(data) {
    return request({
        url: `${requestPath.resource}/publishing/save`,
        method: 'post',
        data: data
    })
}
export function deleteAPI(data) {
    return request({
        url: `${requestPath.resource}/publishing/batch/delete`,
        method: 'post',
        data: data
    })
}
export function updateAPI(data) {
    return request({
        url: `${requestPath.resource}/publishing/update`,
        method: 'post',
        data: data
    })
}
export function detailsAPI(data) {
    return request({
        url: `${requestPath.resource}/publishing/${data}`,
        method: 'get',
        data
    })
}

//重名验证
export function repeatAPI(data) {
    return request({
        url: `${requestPath.resource}/publishing/repeat/${data}`,
        method: 'get',
        data
    })
}
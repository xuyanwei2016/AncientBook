import request from '@/utils/request';
import { requestPath } from '@/utils/global.js';

export function getListAPI(params) {  //获取每个平台分页销量
    return request({
        url: `${requestPath.statistics}/ymxStatistics/page`,
        method: 'get',
        params: params
    }) 
}

export function massDeleteApi(data) {//平台的批量删除
    return request({
        url: `${requestPath.statistics}/ymxStatistics/batch/delete`,
        method: 'post',
        data: data
    })
}
export function importAmazonAPI(data) {//导入亚马孙
    return request({
        url: `${requestPath.statistics}/ymxStatistics/import`,
        method: 'post',
        data: data
    })
}
export function importiReaderAPI(data) {//导入掌阅
    return request({
        url: `${requestPath.statistics}/ymxStatistics/importZy`,
        method: 'post',
        data: data
    })
}
export function importiDangDangAPI(data) {//导入当当
    return request({
        url: `${requestPath.statistics}/ymxStatistics/importDd`,
        method: 'post',
        data: data
    })
}
export function importNetEaseAPI(data) {//导入网易
    return request({
        url: `${requestPath.statistics}/ymxStatistics/importWy`,
        method: 'post',
        data: data
    })
}
export function importBaiduAPI(data) {//导入百度
    return request({
        url: `${requestPath.statistics}/ymxStatistics/importBd`,
        method: 'post',
        data: data
    })
}
export function importMandayAPI(data) {//导入人天
    return request({
        url: `${requestPath.statistics}/ymxStatistics/importRt`,
        method: 'post',
        data: data
    })
}
export function importObtainAPI(data) {//导入得到
    return request({
        url: `${requestPath.statistics}/ymxStatistics/importDedao`,
        method: 'post',
        data: data
    })
}
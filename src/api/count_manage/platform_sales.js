import request from '@/utils/request';
import { requestPath } from '@/utils/global.js';

export function getPlatformListAPI(params) {  //获取平台销量,自定义表格
    return request({
        url: `${requestPath.statistics}/bookStatistics/list`,
        method: 'get',
        params: params
    }) 
}
export function getPlatformListDetilsAPI(params) {  //获取平台销量,自定义表格的copy
    return request({
        url: `${requestPath.statistics}/bookStatistics/detailsReport`,
        method: 'get',
        params: params
    }) 
}
export function getBookListAPI(params) {  //获取图书销量销量
    return request({
        url: `${requestPath.statistics}/bookStatistics/page`,
        method: 'get',
        params: params
    }) 
}
export function getdetialsAPI(params) {  //首次获取图书详情页数据
    return request({
        url: `${requestPath.statistics}/bookStatistics/detail`,
        method: 'get',
        params: params
    }) 
}

export function getReportdetialsAPI(params) {  //图书详情的图表查询
    return request({
        url: `${requestPath.statistics}/bookStatistics/report`,
        method: 'get',
        params: params
    }) 
}

export function getGroupbookAPI(params) {  //获取套组书列表
    return request({
        url: `${requestPath.statistics}/bookGroupStatistics/page`,
        method: 'get',
        params: params
    }) 
}
export function getGroupbookLinkAPI(params) {  //查询组书关联资源
    return request({
        url: `${requestPath.statistics}/bookGroupStatistics/queryRelation`,
        method: 'get',
        params: params
    }) 
}

export function getGroupbookSourceAPI(params) {  //选择套组书关联资源
    return request({
        url: `${requestPath.resource}/ebook/isbn`,
        method: 'get',
        params: params
    }) 
}

export function saveGroupbookSourceAPI(data) {  //关联套组书的资源
    return request({
        url: `${requestPath.statistics}/bookGroupStatistics/save`,
        method: 'post',
        data: data
    }) 
}
export function cancleGroupbookSourceAPI(data) {  //取消套组书的资源
    return request({
        url: `${requestPath.statistics}/bookGroupStatistics/batch/delete`,
        method: 'post',
        data: data
    }) 
}
export function getGroupbookEditAPI(params) {  //套组书列表编辑
    return request({
        url: `${requestPath.statistics}/bookGroupStatistics/querySplit`,
        method: 'get',
        params: params
    }) 
}
export function getGroupbookUpdateAPI(data) {  //套组书修改金额
    return request({
        url: `${requestPath.statistics}/bookGroupStatistics/update`,
        method: 'post',
        data: data
    }) 
}

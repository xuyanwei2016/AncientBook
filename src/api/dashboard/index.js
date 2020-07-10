import request from '@/utils/request';
import { requestPath } from '@/utils/global.js';

export function getbookListAPI(params) {  //获取图书销售排行榜
    return request({
        url: `${requestPath.statistics}/gateway/page`,
        method: 'get',
        params: params
    }) 
}
export function gettipListAPI(params) {  //获取在售电子出版物到期提醒
    return request({
        url: `${requestPath.statistics}/gateway/remindQuery`,
        method: 'get',
        params: params
    }) 
}




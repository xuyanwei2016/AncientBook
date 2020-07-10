import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(data) { /* 获取表格数据 、查看用户信息、查询*/
    return request({
        url: `${requestPath.common}/organmember/page`,
        method: 'get',
        params: data
    })
}

export function batchDeleteAPI(data) { /* 批量删除接口 */
    return request({
        url: `${requestPath.common}/organmember/batch/delete`,
        method: 'post',
        data
    })
}

export function batchUpdateStastusAPI(data) { /* 批量修改状态接口 */
    return request({
        url: `${requestPath.common}/organmember/batch/update/status`,
        method: 'post',
        data
    })
}

export function batchResetCodeAPI(data) { /* 批量重置密码接口 */
    return request({
        url: `${requestPath.common}/organmember/batch/update/reset-pwd`,
        method: 'post',
        data
    })
}

/* export function viewUserInfo(data) {  分页查看用户信息接口
    return request({
        url: `${requestPath.common}/organmember/export`,
        method: 'get',
        params: data
    })
} */

export function exportAPI(data) { /* 导出会员接口 */
    return request({
        url: `${requestPath.common}/organmember/export`,
        method: 'get',
        params: data
    })
}

export function searchMemberAPI(data) { /* 查询机构会员 */
    return request({
        url: `${requestPath.common}/organmember/get/{oid}`,
        method: 'get',
        params: data
    })
}
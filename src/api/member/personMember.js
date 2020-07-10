import request from '@/utils/request'
import { requestPath } from '@/utils/global.js'

export function getListAPI(data) { /* 获取表格数据 */
  return request({
    url: `${requestPath.common}/member/page`,
    method: 'get',
    params: data
  })
}

export function searchAPI(data) { /* 获取表格数据 */
  return request({
    url: `${requestPath.common}/member/page/keyword`,
    method: 'get',
    params: data
  })
}

export function batchDeleteAPI(data) { /* 批量删除接口 */
  return request({
    url: `${requestPath.common}/member/batch/delete`,
    method: 'post',
    data
  })
}

export function deleteAPI(data) { /* 删除接口 */
  return request({
    url: `${requestPath.common}/member/delete/{oid}`,
    method: 'post',
    data
  })
}

export function batchRechargeAPI(data) { /* 批量充值接口 */
  return request({
    url: `${requestPath.common}/member/batch/update/recharge`,
    method: 'post',
    data
  })
}

export function updateAPI(data) { /* 批量更新状态接口 */
  return request({
    url: `${requestPath.common}/member/batch/update/status`,
    method: 'post',
    data
  })
}

export function exportAPI(data) { /* 导出会员接口 */
  return request({
    url: `${requestPath.common}/member/export`,
    method: 'get',
    params: data
  })
}

export function changeAPI(data) { /* 修改用户信息接口 */
  return request({
    url: `${requestPath.common}/member/update`,
    method: 'post',
    data
  })
}

export function addAPI(data) { /* 新增接口 */
  return request({
    url: `${requestPath.common}/member/save`,
    method: 'post',
    data
  })
}

export function getUserByIdAPI(data) {
  return request({
    url: `${requestPath.common}/member/${data}`,
    method: 'get'
  })
}

export function exportMemberInfoAPI(data) {
  return request({
    url: `${requestPath.common}/member/export`,
    method: 'get',
    params: data
  })
}

export function searchScoreAPI(data) { /* 查询账户积分接口 */
  return request({
    url: `${requestPath.common}/member/score/page`,
    method: 'get',
    params: data
  })
}

export function searchBalanceAPI(data) { /* 查询会员余额接口 */
  return request({
    url: `${requestPath.common}/member/balance/page`,
    method: 'get',
    params: data
  })
}

export function searchExportAPI(data) { /* 导出会员接口 */
  return request({
    url: `${requestPath.common}/member/export`,
    method: 'get',
    params: data
  })
}

export function searchAccountExistAPI(data) {
  return request({
    url: `${requestPath.common}/member/isExist/account`,
    // url: 'http://www.xwcbquanmeiti.com/allmedia/fg/solr/solrapi.html?guanjianzi=%E4%B9%A6%E7%B1%8D&pageNum=21',
    method: 'get',
    params: data
  })
}

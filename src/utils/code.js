/**
 * @Author:      skyeGao
 * @Email:       yyjzp1314@126.com
 * @DateTime:    2019-03-26 21:39:04
 * @Description: Description 
 */

let protocol = location.protocol;

// api 的 base_url 8696
export const WEBSITE_BASEURL = protocol + '//zgsccbs.com:80';
// 个人中心的website
export const WEBSITE_USERCENTER = protocol + '//localhost:8089';

export const FILEPREFIX = WEBSITE_BASEURL + '/file1/file/?fileName=';         // 后面接图片返回的cover字段或视频
export const USERCENTERPREFIX = WEBSITE_USERCENTER + '/#/?url=';              // 用户中心跳转 - 登录或注册
export const USERCENTER_NEWS_URL = WEBSITE_USERCENTER + '/#/news';            // 用户中心跳转 - 消息
export const USERCENTER_INDEX_URL = WEBSITE_USERCENTER + '/#/userCenterTemp'; // 用户中心跳转 - 主页
export const USERCENTER_RETRIEVEPSW_URL = WEBSITE_USERCENTER + '/#/retrievePsw'; // 用户中心跳转 - 找回密码




// 广告位 code
export const AD_CODE = {
  HOME_TOP: 'ceshi_1',            // 网站首页头部广告图
  HOME_CAROUSEL: 'ceshi_2',       // 网站首页轮播图
  HOME_BOTTOM_LEFT: 'ceshi_3',    // 网站首页底部广告图左
  HOME_BOTTOM_RIGHT: 'ceshi_4',   // 网站首页底部广告图右
  BOOK_DETAIL: 'ceshi_5',         // 网站图书详情页广告图
  INFO: 'ceshi_6',                // 网站资讯页广告图
}

// 推荐位 code
export const RECORD_CODE = {
  HOME_KEYPOINT: 'PC_home01',     // 首页-重点推荐
  HOME_WEIKE: 'PC_home02',        // 首页-特色微课
  HOME_TOPIC: 'PC_home03',        // 首页-精选专题
  HOME_ANLISHICAO: 'PC_home04',   // 首页-案例实操
  INFO_GOODBOOK: 'PC_home05',     // 资讯列表页-好书推荐
}

// 资源类型
export const RESOURCETYPE_CODE = {
  rsAll: 0,
  rsBook: 1,
  rsWeiCourse: 2,
  EXPERT: 3,
  TOPIC: 4,
  rsWenku: 31,
  rsAnli: 32,
  rsShicao: 33,
  rsLaw: 34,
  rsQA: 35,
  OTHER: 50,
  NOTICE: 100,
}
export const RESOURCETYPE = [{
  value: RESOURCETYPE_CODE.rsAll,
  label: '全部'
}, {
  value: RESOURCETYPE_CODE.rsBook,
  label: '图书'
}, {
  value: RESOURCETYPE_CODE.rsWeiCourse,
  label: '微课'
}, {
  value: RESOURCETYPE_CODE.rsExpert,
  label: '专家'
}, {
  value: RESOURCETYPE_CODE.rsTopic,
  label: '专题'
}, {
  value: RESOURCETYPE_CODE.rsWenku,
  label: '文章'
}, {
  value: RESOURCETYPE_CODE.rsAnli,
  label: '案例'
}, {
  value: RESOURCETYPE_CODE.rsShicao,
  label: '实操技能'
}, {
  value: RESOURCETYPE_CODE.rsLaw,
  label: '文法规章'
}, {
  value: RESOURCETYPE_CODE.rsQA,
  label: '问答'
}, {
  value: RESOURCETYPE_CODE.OTHER,
  label: '未分类文章'
}, {
  value: RESOURCETYPE_CODE.rsNotice,
  label: '公告内容' // 在/fg/comment/page 这个接口中 也叫 资讯
}]

// 资源类型 对应的 数据展示类型
export const RS_DATA_TYPE = {
  ARTICAL: [31, 32, 33, 34, 35, 50], // 文库/案例/实操/法规/问答 属于 文章类型数据 - 对应打开文章阅读页(html或者pdf)
  WEIKE: [2], // 微课 - 对应打开微课详情页
  BOOK: [1],  // 图书 - 对应打开图书详情页
}

// 专题模板
export const TOPIC_TEMPLATE = {
  WEIKE: 1, // 微课模板
  LIST: 2,  // 列表模板
  CONTENT:3 // 内容模板
}


// 查询loading效果公共配置
export const loadingConfig = {
  lock: true,
  text: 'Loading',
  background: 'rgba(0, 0, 0, 0.3)',
}

/*
  文章阅读页权限说明

  0-未上架，前台展示“资源更新中，敬请期待~”
  1-未登录，资源为免费，但用户需登录后阅读
  2-vip免费，
  3-单品购买
  4-机构会员无权限

  文章详情接口/fg/article-library/get/{oid}，返回参数中有'messageCode',若为空，则是可阅读。若非空，需要根据具体的值来判断：
  0："资源更新中，敬请期待~"
  1："试读结束，登录后继续阅读全文","开通VIP会员免费看"按钮
  2: "试读结束，登录后继续阅读全文","开通VIP会员免费看"按钮,判断是否登录（"已是会员或已购买，请登录后阅读"）
  3: "试读结束，登录后继续阅读全文"(暂时不做)
  4: "阅读全文请通过个人账号购买，或者联系管理员"
*/


/*
  微课详情页权限说明
  
  0-未上架，前台展示“资源更新中，敬请期待~”
  1-未登录，资源为免费，但用户需登录后阅读
  2-vip免费，
  3-单品购买
  4-机构会员无权限

  微课详情接口/fg/smallclass/get/{oid}，返回参数中有'messageCode',若为空，则是可阅读。若非空，需要根据具体的值来判断：
  0："资源更新中，敬请期待~"
  1："登陆后观看视频",
  2: "精品内容，开通VIP会员免费看"
  3: "精品内容，请先通过以下方式购买内容阅读权限"(暂时不做)
  4："观看视频请通过个人账号购买，或者联系管理员"
*/


/*
  图书详情页权限说明
  
  0-未上架或未定价，前台展示“资源更新中，敬请期待~”
  1-所属图书无版权或者不可售
  2-未登录或未购买
  3-机构会员无权限

  图书详情接口/fg/ebook/get/{oid}，返回参数中有'messageCode',若为空，则是可阅读。若非空，需要根据具体的值来判断：
  0："资源更新中，敬请期待~"
  1："温馨提示：该资源暂不支持在线购买或阅读全文",
  2: 试读按钮
  3: 试读按钮，"温馨提示：阅读全文请通过个人账号购买，或者联系管理员"
*/










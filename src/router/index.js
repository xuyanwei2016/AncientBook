import Vue from 'vue';
import Router from 'vue-router';
import store from "@/store";

const _import = require('./_import_' + process.env.NODE_ENV)
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/* Layout */
import Layout from '../views/layout/Layout'

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
    goback:true                     //头部的返回键
  }
 **/
export const constantRouterMap = [{
  path: '/login',
  component: _import('login/index'),
  hidden: true
},
  {
    path: '/welcome',
    component: Layout,
    hidden: true,
    children: [{
      path: '/',
      component: _import('login/welcome'),
      hidden: true
    }

    ]
  },
  {
    path: '/authredirect',
    component: _import('login/authredirect'),
    hidden: true
  },
  {
    path: '/404',
    component: _import('errorPage/404'),
    hidden: true
  },
  {
    path: '/401',
    component: _import('errorPage/401'),
    hidden: true
  },
  {
    path: '/personal',
    component: _import('login/personal'),
    hidden: true,
    meta: {
      routerIds: ['0204']
    }
  },
  {
    path: '/password',
    component: _import('login/password'),
    hidden: true,
    meta: {
      routerIds: ['0205']
    }
  },
  {
    path: '/message',
    component: _import('login/message'),
    hidden: true,
    meta: {
      title: '高级检索',
      routerIds: ['0203']
    }
  },
]

// export default new Router({
//     // mode: 'history', // require service support
//     scrollBehavior: () => ({
//         y: 0
//     }),
//     routes: constantRouterMap
// })

const createRouter = () => new Router({
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRouterMap
})
const router = createRouter()

export function resetRouter() {
  const newRouter = createRouter();
  router.matcher = newRouter.matcher
}

export default router


export const asyncRouterMap = [{
  path: '/',
  component: Layout,
  redirect: '/'
},
  {
    path: '/401',
    component: _import('errorPage/401'),
    hidden: true,
    meta: {
      title: '401',
      goback: true,
      routerIds: ['401401401']
    }
  },
  {
    path: '/resource/book_store/Ebook/ebook',
    component: _import('resource/book/Ebook/ebook'),
    name: 'ebook',
    hidden: true,
    meta: {
      title: 'epub',
      goback: true,
      routerIds: ['0115']
    }
  },
  {
    path: '/dashboard',
    component: Layout,
    redirect: '/dashboard/home',
    navItem: true,
    meta: {
      title: '工作台',
      routerIds: ['02']
    },
    children: [{
      path: '/dashboard/home',
      component: _import('dashboard/index'),
      name: 'homeInedx',
      sideItem: true,
      meta: {
        title: '系统门户',
        routerIds: ['0204']
      }
    }, {
      path: '/works',
      component: _import('work_manage/index'),
      name: 'works',
      sideItem: true,
      meta: {
        title: '资源广场',
        routerIds: ['0203'],
        noCache: false
      }
    }, {
      path: '/relativeResource',
      component: _import('work_manage/relativeResource'),
      name: 'relativeResource',
      hidden: true,
      meta: {
        title: '相关资源',
        routerIds: ['0203']
      }
    }, {
      path: '/search',
      component: _import('work_manage/search'),
      name: 'search',
      sideItem: true,
      hidden: true,
      meta: {
        title: '高级检索',
        routerIds: ['0203']
      }
    }, {
      path: '/apply',
      component: _import('work_manage/apply'),
      name: 'apply',
      sideItem: true,
      meta: {
        title: '我的申请',
        routerIds: ['0201']
      }
    }, {
      path: '/apply/apply_details',
      component: _import('work_manage/apply_details'),
      name: 'apply_details',
      sideItem: true,
      hidden: true,
      meta: {
        title: '申请信息',
        routerIds: ['0201'],
        goback: true
      }
    }, {
      path: '/check',
      component: _import('work_manage/check'),
      name: 'check',
      sideItem: true,
      meta: {
        title: '我的审核',
        routerIds: ['0202']
      }
    }, {
      path: '/check/check_details',
      component: _import('work_manage/check_details'),
      name: 'check_details',
      sideItem: true,
      hidden: true,
      meta: {
        title: '审核信息',
        routerIds: ['0202'],
        goback: true
      }
    }, {
      path: '/applyRecord',
      component: _import('work_manage/applyRecord'),
      name: 'applyRecord',
      sideItem: true,
      meta: {
        title: '申请下载记录',
        routerIds: ['0205']
      }

    }]
  },
  {
    path: '/newBook',
    component: Layout,
    redirect: '/newBook/book',
    navItem: true,
    meta: {
      title: '新书',
      routerIds: ['13']
    },
    children: [{
      path: '/newBook/book',
      component: _import('newBook/book/index'),
      name: 'bookIndex',
      sideItem: true,
      meta: {
        title: '新书管理',
        routerIds: ['1301']
      }
    }, {
      path: '/newBook/book/view',
      component: _import('newBook/book/view'),
      name: 'bookView',
      sideItem: true,
      hidden: true,
      meta: {
        title: '查看图书',
        goback: true,
        routerIds: ['1301']
      }
    }, {
      path: '/newBook/subject',
      component: _import('newBook/subject/index'),
      name: 'subjectIndex',
      sideItem: true,
      meta: {
        title: '选题管理',
        routerIds: ['1302'],
        goback: false,
      },

    }, {
      path: '/newBook/subject/subjectAdd',
      component: _import('newBook/subject/subjectAdd'),
      name: 'subjectAdd',
      sideItem: true,
      hidden: true,
      meta: {
        title: '添加选题',
        goback: true,
        routerIds: ['1302']
      }
    }, {
      path: '/newBook/subject/view',
      component: _import('newBook/subject/view'),
      name: 'subjectView',
      sideItem: true,
      hidden: true,
      meta: {
        title: '查看选题',
        goback: true,
        routerIds: ['1302']
      }
    }, {
      path: '/newBook/subject/examine',
      component: _import('newBook/subject/examine'),
      name: 'subjectExamine',
      sideItem: true,
      hidden: true,
      meta: {
        title: '审核选题',
        goback: true,
        routerIds: ['1302']
      }
    }, {
      path: '/newBook/examine',
      component: _import('newBook/examine/index'),
      name: 'examineIndex',
      redirect: '/newBook/examine/allTry',
      meta: {
        title: '三审作业',
        routerIds: ['1303'],

      },
      children: [
        {
          path: 'allTry',
          component: _import('newBook/examine/allTry/index'),
          name: 'allTry',
          meta: {
            title: '三审管理',
            routerIds: ['130304'],
            /*keepAlive: true, //此组件需要被缓存
            isBack: false, //用于判断上一个页面是哪个*/
            goback: false,
          }
        },
        {
          path: 'examineView',
          component: _import('newBook/examine/view'),
          name: 'examineView',
          sideItem: true,
          hidden: true,
          meta: {
            title: '查看图书',
            routerIds: ['130304'],
            goback: true,
          }
        },

        {
          path: 'firstTry',
          component: _import('newBook/examine/firstTry/index'),
          name: 'firstTry',
          meta: {
            title: '一审作业',
            routerIds: ['130301'],
            /*keepAlive: true, //此组件需要被缓存
            isBack: false, //用于判断上一个页面是哪个*/
            goback: false,
          }
        },
        {
          path: 'secondTry',
          component: _import('newBook/examine/secondTry/index'),
          name: 'secondTry',
          meta: {
            title: '二审作业',
            routerIds: ['130302'],
            /*keepAlive: true, //此组件需要被缓存
            isBack: false, //用于判断上一个页面是哪个*/
            goback: false,
          }
        },
        {
          path: 'thirdTry',
          component: _import('newBook/examine/thirdTry/index'),
          name: 'thirdTry',
          meta: {
            title: '三审作业',
            routerIds: ['130303'],
            /*keepAlive: true, //此组件需要被缓存
            isBack: false, //用于判断上一个页面是哪个*/
            goback: false,
          }
        }
      ]
    }, {
      path: '/newBook/finance',
      component: _import('newBook/finance/index'),
      name: 'finance',
      sideItem: true,
      meta: {
        title: '财务管理',
        routerIds: ['1304']
      }
    }, {
      path: '/newBook/finance/view',
      component: _import('newBook/contract/view'),
      name: 'financeView',
      sideItem: true,
      hidden: true,
      meta: {
        title: '查看合同',
        goback: true,
        routerIds: ['1304']
      }
    }, {
      path: '/newBook/contract',
      component: _import('newBook/contract/index'),
      name: 'contract',
      sideItem: true,
      meta: {
        title: '合同管理',
        routerIds: ['1305']
      }
    }, {
      path: '/newBook/contract/view',
      component: _import('newBook/contract/view'),
      name: 'contractView',
      sideItem: true,
      hidden: true,
      meta: {
        title: '编辑合同',
        goback: true,
        routerIds: ['1305']
      }
    }, {
      path: '/newBook/contract/look',
      component: _import('newBook/contract/look'),
      name: 'contractLook',
      sideItem: true,
      hidden: true,
      meta: {
        title: '查看',
        goback: true,
        routerIds: ['1305']
      }
    }, {
      path: '/newBook/cip',
      component: _import('newBook/cip/index'),
      name: 'cip',
      sideItem: true,
      meta: {
        title: '书号/CIP管理',
        routerIds: ['1306']
      }
    }, {
      path: '/newBook/cip/view',
      component: _import('newBook/cip/view'),
      name: 'cipView',
      sideItem: true,
      hidden: true,
      meta: {
        title: '书号/CIP管理',
        goback: true,
        routerIds: ['1306']
      }
    }, {
      path: '/newBook/licensing',
      component: _import('newBook/licensing/index'),
      name: 'licensing',
      sideItem: true,
      meta: {
        title: '发排管理',
        routerIds: ['1307']
      }
    }, {
      path: '/newBook/licensing/view',
      component: _import('newBook/licensing/view'),
      name: 'licensingView',
      sideItem: true,
      hidden: true,
      meta: {
        title: '发排管理',
        goback: true,
        routerIds: ['1307']
      }
    }, {
      path: '/newBook/cover',
      component: _import('newBook/cover/index'),
      name: 'cover',
      sideItem: true,
      meta: {
        title: '封面设计管理',
        routerIds: ['1308']
      }
    }, {
      path: '/newBook/cover/view',
      component: _import('newBook/cover/view'),
      name: 'coverView',
      sideItem: true,
      hidden: true,
      meta: {
        title: '封面设计管理',
        goback: true,
        routerIds: ['1308']
      }
    }, {
      path: '/newBook/printing',
      component: _import('newBook/printing/index'),
      name: 'printing',
      sideItem: true,
      meta: {
        keepAlive: true,
        title: '图书印刷',
        routerIds: ['1309']
      }
    }, {
      path: '/newBook/printing/edit',
      component: _import('newBook/printing/edit'),
      name: 'printingEdit',
      sideItem: true,
      hidden: true,
      meta: {
        title: '图书印刷',
        goback: true,
        routerIds: ['1309']
      }
    }, {
      path: '/newBook/printing/look',
      component: _import('newBook/printing/look'),
      name: 'printingLook',
      sideItem: true,
      hidden: true,
      meta: {
        title: '图书印刷',
        goback: true,
        routerIds: ['1309']
      }
    }, {
      path: '/newBook/printing/overprint',
      component: _import('newBook/printing/overprint'),
      name: 'overprint',
      sideItem: true,
      hidden: true,
      meta: {
        title: '图书加印',
        goback: true,
        routerIds: ['1309']
      }
    }, {
      path: '/newBook/printing/secondEdition',
      component: _import('newBook/printing/secondEdition'),
      name: 'secondEdition',
      sideItem: true,
      hidden: true,
      meta: {
        title: '再版图书',
        goback: true,
        routerIds: ['1309']
      }
    }, {
      path: '/newBook/sampleBook',
      component: _import('newBook/sampleBook/index'),
      name: 'sampleBook',
      sideItem: true,
      meta: {
        title: '样书管理',
        routerIds: ['1310']
      }
    }, {
      path: '/newBook/sampleBook/view',
      component: _import('newBook/sampleBook/view'),
      name: 'sampleBookView',
      sideItem: true,
      hidden: true,
      meta: {
        title: '样书管理',
        goback: true,
        routerIds: ['1310']
      }
    }, {
      path: '/newBook/storageRoom',
      component: _import('newBook/storageRoom/index'),
      name: 'storageRoom',
      sideItem: true,
      meta: {
        keepAlive: true,
        title: '库房管理',
        routerIds: ['1311'],
      }
    }, {
      path: '/newBook/storageRoom/view',
      component: _import('newBook/storageRoom/view'),
      name: 'storageRoomView',
      sideItem: true,
      hidden: true,
      meta: {
        title: '入库信息',
        goback: true,
        routerIds: ['1311']
      }
    },]
  },
  {
    path: '/resource',
    component: Layout,
    redirect: '/resource/book_store',
    navItem: true,
    meta: {
      title: '资源',
      routerIds: ['01']
    },
    children: [{
      path: '/resource/book_store',
      component: _import('resource/book/bookIndex'),
      name: 'book_store',
      sideItem: true,
      meta: {
        title: '图书库',
        routerIds: ['0101'],
        noCache: false,
      }
    },
      {
        path: '/resource/book_store/addBookResource',
        component: _import('resource/book/addBookResource'),
        name: 'add_bookRes',
        hidden: true,
        meta: {
          title: '添加图书',
          routerIds: ['0101'],
          goback: true,
          noCache: true,

        }
      },
      {
        path: '/resource/book_store/relatedResource',
        component: _import('resource/book/relatedResource'),
        name: 'related_Res_Book',
        hidden: true,
        meta: {
          title: '关联资源',
          goback: true,
          routerIds: ['0101'],
          noCache: true,
        }
      },

      {
        path: '/resource/article',
        component: _import('resource/article/index'),
        name: 'article_page',
        sideItem: true,
        meta: {
          title: '文章库',
          routerIds: ['0102'],
          noCache: false
        }
      }, {
        path: '/resource/article/add_article',
        component: _import('resource/article/addArticleResource'),
        name: 'add_article',
        hidden: true,
        meta: {
          title: '添加文章',
          goback: true,
          routerIds: ['0102'],
          noCache: true,
        }
      }, {
        path: '/resource/article/relatedResource',
        component: _import('resource/article/relatedResource'),
        name: 'related_Res_Article',
        hidden: true,
        meta: {
          title: '关联资源',
          goback: true,
          routerIds: ['0102'],
          noCache: true,
        }
      }, {
        path: '/resource/picture_store',
        component: _import('resource/picture/picIndex'),
        name: 'picture_store',
        sideItem: true,
        meta: {
          title: '图片库',
          routerIds: ['0114'],
          noCache: false
        }
      },
      // }, {
      //     path: '/resource/pdf/relatedResource',
      //     component: _import('resource/pdf/relatedResource'),
      //     name: 'related_Res',
      //     hidden: true,
      //     meta: {
      //         title: '关联资源',
      //         routerIds: ['0114']
      //     }
      // },
      {
        path: '/resource/picture_store/add_pic',
        component: _import('resource/picture/addImgResource'),
        name: 'add_pic',
        hidden: true,
        meta: {
          title: '添加图片',
          goback: true,
          routerIds: ['0114'],
          noCache: true,
        }
      },
      {
        path: '/resource/picture_store/relatedResource',
        component: _import('resource/picture/relatedResource'),
        name: 'related_Res_Pic',
        hidden: true,
        meta: {
          title: '关联资源',
          goback: true,
          routerIds: ['0114'],
          noCache: true,
        }
      }, {
        path: '/resource/video_store',
        component: _import('resource/video/index'),
        name: 'video_store',
        sideItem: true,
        meta: {
          title: '视频库',
          routerIds: ['0104'],
          noCache: false,
        }
      },
      {
        path: '/resource/video_store/add_video',
        component: _import('resource/video/addVideoResource'),
        name: 'add_video',
        hidden: true,
        meta: {
          title: '添加视频',
          goback: true,
          routerIds: ['0104'],
          noCache: true,
        }
      }, {
        path: '/resource/video_store/relatedResource',
        component: _import('resource/video/relatedResource'),
        name: 'related_Res_Video',
        hidden: true,
        meta: {
          title: '关联资源',
          goback: true,
          routerIds: ['0104'],
          noCache: true,
        }
      }, {
        path: '/resource/audio_store',
        component: _import('resource/audio/index'),
        name: 'audio_store',
        sideItem: true,
        meta: {
          title: '音频库',
          routerIds: ['0116'],
          noCache: false
        }
      }, {
        path: '/resource/audio_store/add_audio',
        component: _import('resource/audio/addAudioResource'),
        name: 'add_audio',
        hidden: true,
        meta: {
          title: '添加音频',
          goback: true,
          routerIds: ['0116'],
          noCache: true,
        }
      }, {
        path: '/resource/audio_store/relatedResource',
        component: _import('resource/audio/relatedResource'),
        name: 'related_Res_Audio',
        hidden: true,
        meta: {
          title: '关联资源',
          goback: true,
          routerIds: ['0116'],
          noCache: true,
        }
      }, {
        path: '/resource/animation_store',
        component: _import('resource/animation/index'),
        name: 'animation_store',
        sideItem: true,
        meta: {
          title: '动画库',
          routerIds: ['0111'],
          noCache: false
        }
      }, {
        path: '/resource/animation_store/add_animation',
        component: _import('resource/animation/addAnimation'),
        name: 'add_Animation',
        hidden: true,
        meta: {
          title: '添加动画',
          goback: true,
          routerIds: ['0111'],
          noCache: true,
        }
      }, {
        path: '/resource/animation_store/relatedResource',
        component: _import('resource/animation/relatedResource'),
        name: 'related_Res_Animation',
        hidden: true,
        meta: {
          title: '关联动画',
          goback: true,
          routerIds: ['0111'],
          noCache: true,

        }
      },
      // {
      //     path: '/resource/courseware',
      //     component: _import('resource/courseware/index'),
      //     name: 'courseware',
      //     sideItem: true,
      //     meta: {
      //       title: '课件库',
      //       routerIds: ['0107']
      //     }
      //    },{
      //     path: '/resource/courseware/create',
      //     component: _import('resource/courseware/create'),
      //     name: 'create',
      //     hidden: true,
      //     meta: {
      //       title: '添加课件',
      //       routerIds: ['0107']
      //     }
      //    },{
      //     path: '/resource/courseware/relatedResource',
      //     component: _import('resource/courseware/relatedResource'),
      //     name: 'related_Res_Courseware',
      //     hidden: true,
      //     meta: {
      //       title: '关联课件',
      //       routerIds: ['0107']
      //     }
      //    },
      //    {
      //     path: '/resource/statute',
      //     component: _import('resource/statute/index'),
      //     name: 'statute',
      //     sideItem: true,
      //     meta: {
      //       title: '法规库',
      //       routerIds: ['0114'],
      //       noCache: false
      //     }
      //    },{
      //     path: '/resource/statute/create',
      //     component: _import('resource/statute/create'),
      //     name: 'statute_create',
      //     hidden: true,
      //     meta: {
      //       title: '添加法规',
      //       goback:true,
      //       routerIds: ['0114'],
      //       noCache: true,
      //     }
      //    },{
      //     path: '/resource/statute/relatedResource',
      //     component: _import('resource/statute/relatedResource'),
      //     name: 'related_Res_Statute',
      //     hidden: true,
      //     meta: {
      //       title: '关联法规',
      //       goback: true,
      //       routerIds: ['0114'],
      //       noCache: true,
      //     }
      //    },
      {
        path: '/resource/clause',
        component: _import('resource/clause/index'),
        name: 'clause',
        sideItem: true,
        meta: {
          title: '条文库',
          routerIds: ['0113'],
          noCache: false
        }
      }, {
        path: '/resource/clause/add_clause',
        component: _import('resource/clause/addClause'),
        name: 'add_clause',
        hidden: true,
        meta: {
          title: '添加条文',
          goback: true,
          routerIds: ['0113'],
          noCache: true,
        }
      }, , {
        path: '/resource/clause/related_res',
        component: _import('resource/clause/relatedResource'),
        name: 'related_Res_Clause',
        hidden: true,
        meta: {
          title: '关联条文',
          goback: true,
          routerIds: ['0113'],
          noCache: true,
        }
      }, {
        path: '/resource/expert',
        component: _import('resource/expert/index'),
        name: 'expert',
        sideItem: true,
        meta: {
          title: '专家库',
          routerIds: ['0106'],
          noCache: false
        }
      }, {
        path: '/resource/expert/create',
        component: _import('resource/expert/create'),
        name: 'create_expert',
        meta: {
          title: '添加专家',
          goback: true,
          routerIds: ['0106'],
          noCache: true,
        },
        hidden: true
      }, {
        path: '/resource/pdf',
        component: _import('resource/pdf/index'),
        name: 'pdf',
        sideItem: true,
        meta: {
          title: 'PDF库',
          routerIds: ['0109'],
          noCache: false
        }
      }, {
        path: '/resource/pdf/create',
        component: _import('resource/pdf/create'),
        name: 'create_pdf',
        meta: {
          title: '添加PDF',
          goback: true,
          routerIds: ['0109'],
          noCache: true,
        },
        hidden: true
      }, {
        path: '/resource/pdf/relatedResource',
        component: _import('resource/pdf/relatedResource'),
        name: 'related_Res_Pdf',
        hidden: true,
        meta: {
          title: '关联资源',
          goback: true,
          routerIds: ['0109'],
          noCache: true,
        }
      }, {
        path: '/resource/recycle_bin',
        component: _import('resource/recycle_bin/index'),
        name: 'recycle_bin',
        sideItem: true,
        meta: {
          title: '资源回收站',
          routerIds: ['0117'],
          noCache: false
        }
      }, {
        path: '/resource/recycle_bin/create',
        component: _import('resource/recycle_bin/create'),
        name: 'create_recycle_bin',
        hidden: true,
        meta: {
          title: '查看资源回收站',
          goback: true,
          routerIds: ['0117'],
          noCache: true,
        }
      }, {
        path: '/resource/recycle_bin/relatedResource',
        component: _import('resource/recycle_bin/relatedResource'),
        name: 'related_Res_Bin',
        hidden: true,
        meta: {
          title: '关联资源',
          goback: true,
          routerIds: ['0117'],
          noCache: true,
        }
      }, {
        path: '/resource/result',
        component: _import('resource/result/index'),
        name: 'result',
        sideItem: true,
        hidden: true,
        meta: {
          title: '成果库',
          routerIds: ['0116'],
          noCache: false,

        }
      }, {
        path: '/resource/result/add_result',
        component: _import('resource/result/addResultResource'),
        name: 'add_result',
        hidden: true,
        meta: {
          title: '添加成果',
          routerIds: ['0116'],
          noCache: true,
        }
      }, {
        path: '/resource/result/relatedResource',
        component: _import('resource/result/relatedResource'),
        name: 'related_Res_result',
        hidden: true,
        meta: {
          title: '关联资源',
          goback: true,
          routerIds: ['0116'],
          noCache: true,
        }
      }, {
        path: '/resource/patent',
        component: _import('resource/patent/index'),
        name: 'patent',
        sideItem: true,
        hidden: true,
        meta: {
          title: '专利库',
          routerIds: ['0112'],
          noCache: false,
        }
      }, {
        path: '/resource/patent/add_patent',
        component: _import('resource/patent/addPatentResource'),
        name: 'add_patent',
        hidden: true,
        meta: {
          title: '添加专利',
          routerIds: ['0112'],
          noCache: true,
        }
      }, {
        path: '/resource/patent/relatedResource',
        component: _import('resource/patent/relatedResource'),
        name: 'related_Res_patent',
        hidden: true,
        meta: {
          title: '关联资源',
          goback: true,
          routerIds: ['0112'],
          noCache: true,
        }
      }, {
        path: '/resource/standard',
        component: _import('resource/standard/index'),
        name: 'standard',
        sideItem: true,
        hidden: true,
        meta: {
          title: '标准库',
          routerIds: ['0115'],
          noCache: false,
        }
      }, {
        path: '/resource/standard/add_standard',
        component: _import('resource/standard/addStandardResource'),
        name: 'add_standard',
        hidden: true,
        meta: {
          title: '添加标准',
          routerIds: ['0115'],
          noCache: true,
        }
      }, {
        path: '/resource/standard/relatedResource',
        component: _import('resource/standard/relatedResource'),
        name: 'related_Re_standard',
        hidden: true,
        meta: {
          title: '关联资源',
          goback: true,
          routerIds: ['0115'],
          noCache: true,
        }
      }, {
        path: '/resource/annex/picture',
        component: _import('resource/annex/picture'),
        name: 'annexPicture',
        hidden: true,
        meta: {
          title: '图片详情',
          goback: true,
          routerIds: ['0115'],
          noCache: true
        }
      },
      {
        path: '/resource/annex/file',
        component: _import('resource/annex/file'),
        name: 'annexFile',
        hidden: true,
        meta: {
          title: '图片详情',
          goback: true,
          routerIds: ['0115']
        }
      }
    ]
  },
  {
    path: '/contentManagement',
    component: Layout,
    redirect: '/contentManagement/contentColumn',
    navItem: true,
    meta: {
      title: '内容',
      routerIds: ['03']
    },
    children: [{
      path: '/contentManagement/contentColumn',
      component: _import('contentManagement/contentColumn/index'),
      name: 'contentColumn',
      sideItem: true,
      meta: {
        title: '内容栏目',
        routerIds: ['0305']
      }
    }, {
      path: '/contentManagement/contentColumn/create',
      component: _import('contentManagement/contentColumn/create'),
      name: 'create',
      hidden: true,
      meta: {
        title: '添加栏目',
        routerIds: ['0305']
      }
    }, {
      path: '/contentManagement/contentManage',
      component: _import('contentManagement/contentManage/index'),
      name: 'contentManage',
      sideItem: true,
      meta: {
        title: '内容管理',
        routerIds: ['0302'],
        noCache: false
      }
    }, {
      path: '/contentManagement/contentManage/create',
      component: _import('contentManagement/contentManage/create'),
      name: 'create',
      hidden: true,
      meta: {
        title: '添加内容管理',
        goback: true,
        routerIds: ['0302'],
        noCache: true
      }
    }, {
      path: '/contentManagement/contentRecycle',
      component: _import('contentManagement/contentRecycle/index'),
      name: 'contentRecycle',
      sideItem: true,
      meta: {
        title: '内容回收站',
        routerIds: ['0303'],
        noCache: false
      }
    }, {
      path: '/contentManagement/contentRecycle/details',
      component: _import('contentManagement/contentRecycle/details'),
      name: 'details',
      hidden: true,
      meta: {
        title: '查看内容回收站',
        routerIds: ['0303'],
        noCache: true,
        goback: true
      }
    }, {
      path: '/contentManagement/contentSource',
      component: _import('contentManagement/contentSource/index'),
      name: 'contentSource',
      sideItem: true,
      meta: {
        title: '内容来源管理',
        routerIds: ['0304'],
        noCache: false
      }
    }, {
      path: '/contentManagement/contentSource/create',
      component: _import('contentManagement/contentSource/create'),
      name: 'create',
      hidden: true,
      meta: {
        title: '添加来源',
        routerIds: ['0304'],
        noCache: true
      }
    }]
  },
  {
    path: '/business',
    component: Layout,
    redirect: '/business/classify',
    navItem: true,
    meta: {
      title: '业务',
      routerIds: ['05']
    },
    children: [{
      path: '/business/classify',
      component: _import('business/classify/index'),
      name: 'classify',
      sideItem: true,
      meta: {
        title: '分类体系',
        routerIds: ['0501']
      },
    }, {
      path: '/business/label',
      component: _import('business/label/index'),
      name: 'label',
      sideItem: true,
      meta: {
        title: '标签管理',
        routerIds: ['0502']
      },
    },
      // {
      //     path: '/business/themeLexicon',
      //     component: _import('business/themeLexion/index'),
      //     name: 'themeLexicon',
      //     sideItem: true,
      //     meta: {
      //         title: '主题词库',
      //         routerIds: ['0506']
      //     },
      // },{
      //     path: '/business/themeLexicon/add',
      //     component: _import('business/themeLexion/add'),
      //     name: 'add_theme',
      //     hidden: true,
      //     meta: {
      //         title: '添加主题词',
      //         routerIds: ['0506']
      //     },
      // },
      {
        path: '/business/label/basics_theory',
        component: _import('business/label/basics_theory'),
        name: 'basics_theory',
        meta: {
          title: '标签内容',
          goback: true,
          routerIds: ['0502']
        },
        hidden: true
      },
      {
        path: '/business/copyright',
        component: _import('business/copyright/index'),
        name: 'copyrightIndex',
        sideItem: true,
        meta: {
          title: '版权管理',
          routerIds: ['0503']
        },
      },
      {
        path: '/business/copyright/add',
        component: _import('business/copyright/add'),
        name: 'copyrightAdd',
        hidden: true,
        meta: {
          title: '添加合同',
          routerIds: ['0503']
        },
      }, {
        path: '/business/publish',
        component: _import('business/publish/index'),
        name: 'publish',
        sideItem: true,
        meta: {
          title: '出版单位管理',
          routerIds: ['0504'],
          noCache: false
        },
      }, {
        path: '/business/publish/add',
        component: _import('business/publish/add'),
        name: 'add',
        hidden: true,
        meta: {
          title: '添加出版单位',
          routerIds: ['0504'],
          noCache: true
        },
      }, {
        path: '/business/books',
        component: _import('business/books/index'),
        name: 'books',
        sideItem: true,
        meta: {
          title: '丛书管理',
          routerIds: ['0505']
        },
      }
    ]
  },
  {
    path: '/count_manage',
    component: Layout,
    redirect: '/count_manage/index',
    navItem: true,
    meta: {
      title: '统计',
      routerIds: ['06']
    },
    children: [{
      path: '/count_manage/index',
      component: _import('count_manage/index'),
      name: 'numStatistic',
      sideItem: true,
      meta: {
        title: '资源数量统计',
        routerIds: ['0601']
      }
    }, {
      path: '/count_manage/User',
      component: _import('count_manage/User'),
      name: 'resourceStatistic',
      sideItem: true,
      meta: {
        title: '资源使用情况统计',
        routerIds: ['0602']
      }
    }]
  },
  {
    path: '/authorizationmanage',
    component: Layout,
    redirect: '/authorizationmanage/department_management',
    navItem: true,
    meta: {
      title: '系统',
      routerIds: ['04']
    },
    children: [{
      path: '/authorizationmanage/department_management',
      component: _import('authorizationmanage/department_management'),
      name: 'department_management',
      sideItem: true,
      meta: {
        title: '部门管理',
        routerIds: ['0401']
      }
    }, {
      path: '/authorizationmanage/role_management',
      component: _import('authorizationmanage/role_management'),
      name: 'role_management',
      sideItem: true,
      meta: {
        title: '角色管理',
        routerIds: ['0402']
      }
    }, {
      path: '/authorizationmanage/user_management',
      component: _import('authorizationmanage/user_management'),
      name: 'user_management',
      sideItem: true,
      meta: {
        title: '用户管理',
        routerIds: ['0403']
      }
    }, {
      path: '/authorizationmanage/module_management',
      component: _import('authorizationmanage/module_management'),
      name: 'module_management',
      sideItem: true,
      meta: {
        title: '模块管理',
        routerIds: ['0404']
      }
    }, {
      path: '/authorizationmanage/button_management',
      component: _import('authorizationmanage/button_management'),
      name: 'button_management',
      sideItem: true,
      meta: {
        title: '按钮管理',
        routerIds: ['0405']
      }
    }, {
      path: '/authorizationmanage/site_param',
      component: _import('authorizationmanage/site_param/index'),
      name: 'siteparam',
      sideItem: true,
      meta: {
        title: '系统参数设置',
        routerIds: ['0406']
      }
    }, {
      path: '/authorizationmanage/system_security',
      component: _import('authorizationmanage/system_security'),
      name: 'system_security',
      sideItem: true,
      meta: {
        title: '系统安全设置',
        routerIds: ['0407']
      }
    }, {
      path: '/authorizationmanage/data_dictionary',
      component: _import('authorizationmanage/data_dictionary'),
      name: 'data_dictionary',
      sideItem: true,
      meta: {
        title: '数据字典管理',
        routerIds: ['0414']
      }
    }, {
      path: '/authorizationmanage/updateSearch',
      component: _import('authorizationmanage/updateSearch'),
      name: 'updateSearch',
      sideItem: true,
      meta: {
        title: '更新索引',
        routerIds: ['0415']
      }
    }, {
      path: '/authorizationmanage/systemlog',
      component: _import('authorizationmanage/systemlog'),
      name: 'systemlog',
      sideItem: true,
      meta: {
        title: '系统日志管理',
        routerIds: ['0416']
      }
    }]
  },
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]


router.beforeEach((to, from, next) => {
  if (to.name=='subjectIndex'&&from.name=='subjectAdd'){  // 判断该路由是否需要登录权限

  }else{
    store.state.tagsView.isNewone=false;
  }

  if (to.name=='storageRoom'&&from.name=='storageRoomView'){

  }else{
    store.state.tagsView.isNewone=false;
  }
    next();
})

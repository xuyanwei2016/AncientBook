import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import  constantRouterMap  from '@/router'
NProgress.configure({ showSpinner: false }) // NProgress Configuration

// permissiom judge function
function hasPermission(roles, permissionRoles) {
    if (roles.indexOf('admin') >= 0) return true // admin permission passed directly
    if (!permissionRoles) return true
    return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login', '/authredirect', '/404'] // no redirect whitelist
router.beforeEach((to, from, next) => {
    NProgress.start() // start progress bar
    if (getToken()) { // determine if there has token
        /* has token*/
        if (to.path === '/dashboard') {
            next('/dashboard/home')
        }
        
        if (to.path === '/login' || to.path === '/') {
            next({ path: '/dashboard/home' })
            NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
        } else {
            if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
                store.dispatch('GetRouterList').then(res => { // 拉取user_info
                    if(res.data.data.mList.length==0){
                        res.data.data.mList=['401401401']
                    }
                    const routerIds = res.data.data.mList // res.data.roles note: roles must be a array! such as: ['editor','develop']                    
                    store.dispatch('GenerateRoutes', { routerIds }).then(() => { // 根据roles权限生成可访问的路由表
                        router.addRoutes(store.getters.addRouters) // 动态添加可访问路由表
                        if(routerIds[0]=='401401401'){
                            next({ path: '/401',replace: true})
                        }else{
                            next({...to, replace: true }) // hack方法 确保addRoutes已完成 ,set the replace: true so the navigation will not leave a history record
                        }
                       
                    })
                }).catch((err) => {
                    store.dispatch('FedLogOut').then(() => {
                        Message.error(err || 'Verification failed, please login again')
                        next({ path: '/login' })
                    })
                })
            } else {
                if (Object.prototype.toString.call(to.meta.routerIds) !== '[object Undefined]') {
                    store.dispatch('GetPageButtonList', to.meta.routerIds[0]).then(() => {
                        next()
                    })
                }
                if(to.path === '/401'){                  
                    next()                 
                }
            }
        }
        
    } else {
        /* has no token*/
        if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
            next()
        } else {
            next('/login') // 否则全部重定向到登录页
            NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
        }
    }
})

router.afterEach(() => {
    NProgress.done() // finish progress bar
})
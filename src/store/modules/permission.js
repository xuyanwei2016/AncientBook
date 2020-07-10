import { asyncRouterMap, constantRouterMap } from '@/router'

/**
 * 通过meta.routerId判断是否与当前用户权限匹配
 * @param routerIds
 * @param route
 */

function hasPermission(routerIds, route) {
  if (route.meta && route.meta.routerIds) {
    return routerIds.some(
      routerId => {
        return route.meta.routerIds.indexOf(routerId) >= 0
      }
    )
  } else {
    return false
  }
}

/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param asyncRouterMap
 * @param routerIds
 */

function filterAsyncRouter(asyncRouterMap, routerIds) {
  const accessedRouters = asyncRouterMap.filter(route => {
    if (hasPermission(routerIds, route)) {
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children, routerIds)
      }
      return true
    }
    return false
  })
  return accessedRouters
}

const permission = {
  state: {
    routers: constantRouterMap,
    addRouters: [],
    sideRouters: [],    
    sideCurIndex: 5
  },
  mutations: {
    SET_ROUTERS: (state, routers) => {
      state.addRouters = routers
      state.routers = constantRouterMap.concat(routers)
      state.sideRouters = state.routers[5].children
      state.sideCurIndex = 5
    },
    SET_SIDEROUTES: (state, data) => {        
      const {router,index} = data
      state.sideRouters = router
      state.sideCurIndex = index
    }
  },
  actions: {
    /* GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const accessedRouters = data.asyncRouterMap
        commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    } */
    GenerateRoutes({ commit }, data) {
      return new Promise(resolve => {
        const { routerIds } = data
        let accessedRouters = []
        // if (routerIds.indexOf('admin') >= 0) {
        //   accessedRouters = data.asyncRouterMap
        // } else {
        accessedRouters = filterAsyncRouter(asyncRouterMap, routerIds)
        // }
        commit('SET_ROUTERS', accessedRouters)
        // commit('SET_ROUTERS', accessedRouters)
        resolve()
      })
    },
    SwitchRoutes({ commit }, routes) {
      return new Promise(resolve => {
        commit('SET_SIDEROUTES',routes)
        resolve("I'm friends with the monster !")
      })
    }
  }
}

export default permission

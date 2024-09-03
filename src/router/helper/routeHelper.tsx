import IFramePage from '@/components/basic/iframe-page'
import router from '@/router'
import { rootRoute } from '@/router/routes'
import basic from '@/router/routes/basic'
import routeModules from '@/router/routes/modules'
import { warn } from '@/utils/log'
import { uniqueSlash } from '@/utils/urlUtils'
import { type RouteMeta, type RouteRecordNormalized, type RouteRecordRaw, type Router, createRouter, createWebHistory } from 'vue-router'
import { asyncRoutes } from '../asyncModules'

export const transformMenuToRoutes = (routeList: RouteRecordRaw[], parentRoute?: RouteRecordRaw) => {
  routeList.forEach((route) => {
    route.meta ||= {} as RouteMeta
    const { show = 1, type, isExt, extOpenMode } = route.meta
    const compPath = route.component as unknown as string

    // 是否在菜单中隐藏
    route.meta.hideInMenu ??= !show

    if (!isExt) {
      // 规范化路由路径
      route.path = route.path.startsWith('/') ? route.path : `/${route.path}`
      if (parentRoute?.path && !route.path.startsWith(parentRoute.path)) {
        route.path = uniqueSlash(`${parentRoute.path}/${route.path}`)
      }
    }
    // 以路由路径作为唯一的路由名称
    route.name = route.path

    if (type === 0) {
      route.component = null
      if (route.children?.length) {
        const redirectChild = route.children.find((n) => !n.meta?.isExt)
        if (!redirectChild) {
          Reflect.deleteProperty(route, 'redirect')
        } else {
          route.redirect ??= uniqueSlash(`/${route.path}/${redirectChild.path}`)
        }
      }
    } else if (type === 1) {
      // 内嵌页面
      if (isExt && extOpenMode === 2) {
        route.component = <IFramePage src={route.path} />
        route.path = route.path.replace(new RegExp('://'), '/')
      } else if (compPath) {
        route.component = asyncRoutes[compPath]
        // 前端 src/views 目录下无对应路由组件
        if (!route.component) {
          route.component = () => import('@/views/error/comp-not-found.vue')
          warn(`在src/views/下找不到 ${compPath}.vue 或 ${compPath}.tsx, 请自行创建!`)
        }
      }
    }

    if (route.children?.length) {
      transformMenuToRoutes(route.children, route)
    }
  })
  return routeList
}

export const generateDynamicRoutes = (menus: RouteRecordRaw[]) => {
  const routes = [...routeModules, ...transformMenuToRoutes(menus)]
  const allRoute = [...routes, ...basic]
  genNamePathForRoutes(allRoute)
  // const allRoutes = flatMultiLevelRoutes(allRoute)
  const allRoutes = flatMultiLevelRoutes(allRoute)
  rootRoute.children = allRoutes
  router.addRoute(rootRoute)
  return routes
}

import { cloneDeep, omit } from "lodash-es"
export const flatMultiLevelRoutes = (routes: RouteRecordRaw[]) => {
  const routesMirror = cloneDeep(routes)
  routesMirror.forEach((route) => {
    // 如果路由是三级及其以上路由，对其进行降级处理
    isMultipleRoute(route) && promoteRouteLevel(route)
  })
  return routesMirror
}

const isMultipleRoute = (route: RouteRecordRaw) => {
  const children = route.children
  if (children?.length) {
    // 只要有一个子路由的 children 长度大于 0，就说明是三级及其以上路由
    return children.some((child) => child.children?.length)
  }
  return false
}

const promoteRouteLevel = (route: RouteRecordRaw) => {
  // 创建 router 实例是为了获取到当前传入的 route 的所有路由信息
  let router: Router | null = createRouter({
    history: createWebHistory(import.meta.env.VITE_BASE_URL),
    routes: [route]
  })
  const routes = router.getRoutes()
  // 在 addToChildren 函数中使用上面获取到的路由信息来更新 route 的 children
  addToChildren(routes, route.children || [], route)
  router = null
  // 转为二级路由后，去除所有子路由中的 children
  route.children = route.children?.map((item) => omit(item, "children") as RouteRecordRaw)
}

/** 将给定的子路由添加到指定的路由模块中 */
const addToChildren = (routes: RouteRecordNormalized[], children: RouteRecordRaw[], routeModule: RouteRecordRaw) => {
  children.forEach((child) => {
    const route = routes.find((item) => item.name === child.name)
    if (route) {
      // 初始化 routeModule 的 children
      routeModule.children = routeModule.children || []
      // 如果 routeModule 的 children 属性中不包含该路由，则将其添加进去
      routeModule.children.forEach((item) => {
        if (route.name !== item.name) {
          routeModule.children?.push(route)
        }
      })
      // if (!routeModule.children.includes(route)) {
        
      // }
      // 如果该子路由还有自己的子路由，则递归调用此函数将它们也添加进去
      if (child.children?.length) {
        addToChildren(routes, child.children, routeModule)
      }
    }
  })
}

export const genNamePathForRoutes = (routes: RouteRecordRaw[], parentNamePath: string[] = []) => {
  routes.forEach((item) => {
    if (item.meta && typeof item.name === 'string') {
      item.meta.namePath = parentNamePath.concat(item.name)

      if (item.meta?.hideInMenu) {
        item.meta.activeMenu ||= parentNamePath.at(-1)
      }

      if (item.children?.length) {
        genNamePathForRoutes(item.children, item.meta.namePath)
      }
    }
  })
}

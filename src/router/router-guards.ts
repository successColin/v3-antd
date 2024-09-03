import { portalSystemUrl } from '@/constants/env'
import { useKeepAliveStore } from '@/store/modules/keepAlive'
import { useUserStore } from '@/store/modules/user'
import { to as _to } from '@/utils/awaitTo'
import { Modal } from 'ant-design-vue'
import NProgress from 'nprogress'
import type { RouteLocationNormalized, Router } from 'vue-router'
import { NavigationFailureType, isNavigationFailure } from 'vue-router'
import type { WhiteNameList } from './constant'
import { LOGIN_NAME, PAGE_NOT_FOUND_NAME, REDIRECT_NAME } from './constant'


NProgress.configure({ showSpinner: false })

const defaultRoutePath = '/home'

export function createRouterGuards(router: Router, whiteNameList: WhiteNameList) {
  router.beforeEach(async (to, from, next) => {
    if (!from.meta?.hideProgressBar || !to.meta?.hideProgressBar) {
      NProgress.start()
    }
    const userStore = useUserStore()
    type Token = {
      sso_token: string
    }
    const { sso_token } = to.query as Token
    if ((to.path === "/home" || to.path === "/") && sso_token) {
      userStore.clearLoginStatus()
      userStore.setToken(sso_token)
    }
    if (userStore.token) {
      if (to.name === LOGIN_NAME) {
        next({ path: defaultRoutePath })
      } else {
        const hasRoute = router.hasRoute(to.name!)
        if (userStore.menus.length === 0) {
          // 从后台获取菜单
          const [err] = await _to(userStore.afterLogin())
          if (err) {
            userStore.clearLoginStatus()
            Modal.destroyAll()
            return next({ name: LOGIN_NAME })
          }
          if (to.name === PAGE_NOT_FOUND_NAME) {
            let params = {
              path: to.fullPath,
              replace: true
            } as any
            if (!to.query.sso_token) {
              params.query = to.query
            }
            next(params)
          } else if (!hasRoute) {
            // 如果该路由不存在，可能是动态注册的路由，它还没准备好，需要再重定向一次到该路由
            next({ ...to, replace: true })
          } else {
            next()
          }
        } else {
          next()
        }
      }
    } else {
      if (whiteNameList.some((n) => n === to.name)) {
        next()
      } else {
        window.location.href = portalSystemUrl.toString()
        next(false)
      }
    }
  })

  /** 获取路由对应的组件名称 */
  const getComponentName = (route: RouteLocationNormalized): string[] => {
    return route.matched
      .map((n) => {
        if (!n.meta?.keepAlive) return
        const comp = n.components?.default
        return comp?.name ?? (comp as any)?.type?.name
      })
      .filter(Boolean)
  }

  router.afterEach((to, from, failure) => {
    // 跳过自己手动取消路由导航时的错误
    if (isNavigationFailure(failure, NavigationFailureType.aborted)) {
      NProgress.done()
      // console.error('failed navigation', failure);
      return
    }

    if (to.meta?.title) {
      // 设置网页标题
      document.title = to.meta.title
    }

    const keepAliveStore = useKeepAliveStore()

    // 在这里设置需要缓存的组件名称
    const toCompName = getComponentName(to)
    // 判断当前页面是否开启缓存，如果开启，则将当前页面的 componentName 信息存入 keep-alive 全局状态
    if (to.meta?.keepAlive) {
      // 需要缓存的组件
      if (toCompName) {
        keepAliveStore.add(toCompName)
      } else {
        console.warn(
          `${to.fullPath}页面组件的keepAlive为true但未设置组件名，会导致缓存失效，请检查`,
        )
      }
    } else {
      // 不需要缓存的组件
      if (toCompName) {
        keepAliveStore.remove(toCompName)
      }
    }
    // 如果进入的是 Redirect 页面，则也将离开页面的缓存清空(刷新页面的操作)
    if (to.name === REDIRECT_NAME) {
      const fromCompName = getComponentName(from)
      fromCompName && keepAliveStore.remove(fromCompName)
    }
    const userStore = useUserStore()
    // 如果用户已登出，则清空所有缓存的组件
    if (!userStore.token) {
      keepAliveStore.clear()
    }
    NProgress.done()
  })

  router.onError((error) => {
    console.error('路由错误', error)
  })
}

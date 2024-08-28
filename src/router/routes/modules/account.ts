import type { RouteRecordRaw } from 'vue-router'

const moduleName = 'account'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/account',
    redirect: '/account/settings',
    meta: {
      title: '个人中心',
      hideInMenu: true,
    },
    children: [
      {
        path: 'settings',
        name: `${moduleName}-settings`,
        component: () => import('@/views/account/settings.vue'),
        meta: { title: '个人设置', hideInMenu: true },
      },
    ],
  },
]

export default routes

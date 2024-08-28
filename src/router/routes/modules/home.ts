import type { RouteRecordRaw } from 'vue-router'

const moduleName = 'home'

const routes: Array<RouteRecordRaw> = [
  {
    path: `/${moduleName}`,
    name: moduleName,
    meta: {
      title: '首页',
      icon: 'ant-design:dashboard-outlined',
    },
    component: () => import('@/views/dashboard/welcome/index.vue'),
  },
]

export default routes

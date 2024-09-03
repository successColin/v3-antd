import type { RouteRecordRaw } from 'vue-router'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/home',
    name: 'home',
    meta: {
      title: '首页',
      icon: 'Home',
    },
    component: () => import('@/views/dashboard/welcome/index.vue'),
  },
]

export default routes

import type { RouteRecordRaw } from 'vue-router';

const moduleName = 'courseware'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/courseware',
    name: moduleName,
    redirect: { name: `${moduleName}-catalog` },
    meta: {
      title: '课件题库',
      icon: 'ant-design:desktop-outlined',
    },
    children: [
      {
        path: 'catalog',
        name: `${moduleName}-catalog`,
        meta: {
          title: '目录配置',
          keepAlive: true,
        },
        component: () => import('@/views/courseware/catalog.vue'),
      },
    ],
  },
];

export default routes

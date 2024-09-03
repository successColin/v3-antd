import type { RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/courseware',
    name: 'courseware',
    redirect: { name: 'courseware-textbook' },
    meta: {
      title: '课件题库',
      icon: 'Book',
    },
    children: [
      {
        path: '/courseware/textbook',
        name: 'courseware-textbook',
        meta: {
          title: '课本配置',
          keepAlive: true,
        },
        component: () => import('@/views/courseware/textbook.vue'),
        children: [
          {
            path: '/courseware/catalog',
            name: 'courseware-catalog',
            meta: {
              title: '目录配置',
              keepAlive: true,
              hideInMenu: true,
            },
            component: () => import('@/views/courseware/catalog.vue'),
          },
        ]
      },
      {
        path: '/courseware/config',
        name: `courseware-config`,
        meta: {
          title: '课件配置',
        },
        component: () => import('@/views/courseware/config.vue'),
      },
    ],
  },
];

export default routes

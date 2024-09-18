import type { RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
  {
    path: "/courseware",
    name: "courseware",
    redirect: { name: "courseware-textbook" },
    meta: {
      title: "课件题库",
      icon: "Book"
    },
    children: [
      {
        path: "/courseware/textbook",
        name: "courseware-textbook",
        meta: {
          title: "课本配置"
        },
        component: () => import("@/views/courseware/textbook.vue"),
        children: [
          {
            path: "/courseware/catalog",
            name: "courseware-catalog",
            meta: {
              title: "目录配置",
              hideInMenu: true
            },
            component: () => import("@/views/courseware/catalog.vue")
          }
        ]
      },
      {
        path: "/courseware/config",
        name: `courseware-config`,
        meta: {
          title: "课件配置"
        },
        component: () => import("@/views/courseware/config.vue"),
        children: [
          {
            path: "/courseware/configList",
            name: "courseware-configList",
            meta: {
              title: "配置列表",
              hideInMenu: true
            },
            component: () => import("@/views/courseware/configList.vue")
          }
        ]
      },
      {
        path: "/courseware/theoryConfig",
        name: `courseware-theoryConfig`,
        meta: {
          title: "理论题库配置"
        },
        component: () => import("@/views/courseware/theoryConfig.vue")
        // children: [
        //   {
        //     path: '/courseware/configList',
        //     name: 'courseware-configList',
        //     meta: {
        //       title: '配置列表',
        //       hideInMenu: true,
        //     },
        //     component: () => import('@/views/courseware/configList.vue'),
        //   },
        // ]
      }
    ]
  }
]

export default routes

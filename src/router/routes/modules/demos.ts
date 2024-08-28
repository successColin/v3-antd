import type { RouteRecordRaw } from 'vue-router';

const moduleName = 'demos';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/demos',
    name: moduleName,
    redirect: { name: `${moduleName}-custom-modal` },
    meta: {
      title: 'demo演示',
      icon: 'ant-design:desktop-outlined',
    },
    children: [
      {
        path: 'form',
        name: `${moduleName}-form`,
        meta: {
          title: '表单演示',
          icon: 'ant-design:desktop-outlined',
          keepAlive: false,
        },
        redirect: { name: `${moduleName}-form-basic` },
        children: [
          {
            path: 'basic',
            name: `${moduleName}-form-basic`,
            meta: {
              title: '基础表单',
              icon: 'ant-design:desktop-outlined',
              keepAlive: false,
            },
            component: () => import('@/views/demos/form/basic-form/index.vue'),
          },
          {
            path: 'rule',
            name: `${moduleName}-form-rule`,
            meta: {
              title: '表单校验',
              icon: 'ant-design:desktop-outlined',
              keepAlive: false,
            },
            component: () => import('@/views/demos/form/rule-form/index.vue'),
          },
          {
            path: 'dynamic',
            name: `${moduleName}-form-dynamic`,
            meta: {
              title: '动态表单',
              icon: 'ant-design:desktop-outlined',
              keepAlive: false,
            },
            component: () => import('@/views/demos/form/dynamic-form/index.vue'),
          },
          {
            path: 'useForm',
            name: `${moduleName}-form-use`,
            meta: {
              title: 'useForm',
              icon: 'ant-design:desktop-outlined',
              keepAlive: false,
            },
            component: () => import('@/views/demos/form/use-form/index.vue'),
          },
          {
            path: 'custom-form',
            name: `${moduleName}-form-custom`,
            meta: {
              title: '自定义表单组件',
              icon: 'ant-design:desktop-outlined',
              keepAlive: false,
            },
            component: () => import('@/views/demos/form/custom-form/index.vue'),
          },
        ],
      },
      {
        path: 'table',
        name: `${moduleName}-table`,
        meta: {
          title: '表格演示',
          icon: 'ant-design:desktop-outlined',
          keepAlive: false,
        },
        redirect: { name: `${moduleName}-table-wzry` },
        children: [
          {
            path: 'search-table',
            name: `${moduleName}-query-form`,
            meta: {
              title: '表格查询',
              icon: 'ant-design:desktop-outlined',
              keepAlive: false,
            },
            component: () => import('@/views/demos/tables/search-table/index.vue'),
          },
          {
            path: 'edit-row-table',
            name: `${moduleName}-edit-row-table`,
            meta: {
              title: '可编辑行',
              icon: 'ant-design:desktop-outlined',
              keepAlive: false,
            },
            component: () => import('@/views/demos/tables/edit-row-table/index.vue'),
          },
          {
            path: 'wzry',
            name: `${moduleName}-table-wzry`,
            meta: {
              title: '王者荣耀',
              icon: 'ant-design:desktop-outlined',
              keepAlive: false,
            },
            component: () => import('@/views/demos/tables/wzry-table/index.vue'),
          },
          {
            path: 'lol',
            name: `${moduleName}-table-lol`,
            meta: {
              title: '英雄联盟',
              icon: 'ant-design:desktop-outlined',
              keepAlive: false,
            },
            component: () => import('@/views/demos/tables/lol-table/index.vue'),
          },
          {
            path: 'lol/:id',
            name: `${moduleName}-table-lol-info`,
            meta: {
              title: '英雄详情',
              icon: 'ant-design:desktop-outlined',
              hideInMenu: true,
              keepAlive: false,
              activeMenu: `${moduleName}-table-lol`,
            },
            component: () => import('@/views/demos/tables/lol-table/heroInfo.vue'),
          },
        ],
      },
    ],
  },
];

export default routes;

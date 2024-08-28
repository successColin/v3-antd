// @ts-ignore
/* eslint-disable */

/**
 * 该文件为 @umijs/openapi 插件自动生成，请勿随意修改。如需修改请通过配置 openapi.config.ts 进行定制化。
 * */

import { request, type RequestOptions } from '@/utils/request';

// 
export async function accountLogout(options?: RequestOptions) {
  return request<any>('/api/account/logout', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取菜单列表 GET /api/account/menus */
export async function accountMenu(options?: RequestOptions) {
  return request<API.AccountMenus[]>('/api/account/menus', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 更改账户密码 POST /api/account/password */
export async function accountPassword(body: API.PasswordUpdateDto, options?: RequestOptions) {
  return request<any>('/api/account/password', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

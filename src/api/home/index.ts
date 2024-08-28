import { request } from '@/utils/request';

// 获取用户菜单权限 和 用户信息
export async function getUserPermission() {
  return request('user/permission', {
    method: 'get',
  });
}
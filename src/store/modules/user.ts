import Api from '@/api/';
import { getUserPermission } from '@/api/home';
import { resetRouter } from '@/router';
import { generateDynamicRoutes } from '@/router/helper/routeHelper';
import { store } from '@/store';
import { execDecrypt } from "@/utils/aes";
import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { RouteRecordRaw } from 'vue-router';
import { useLockscreenStore } from './lockscreen';
// import { useSSEStore } from './sse';


export const useUserStore = defineStore(
  'user',
  () => {
    // const sseStore = useSSEStore();
    const lockscreenStore = useLockscreenStore();
    const token = ref<string>();
    const perms = ref<string[]>([]);
    const menus = ref<RouteRecordRaw[]>([]);
    const menusAll = ref<RouteRecordRaw[]>([]);
    const userInfo = ref<Partial<API.UserEntity>>({});

    const sortMenus = (menus: RouteRecordRaw[] = []) => {
      return menus
        .filter((n) => {
          const flag = !n.meta?.hideInMenu;
          if (flag && n.children?.length) {
            n.children = sortMenus(n.children);
          }
          return flag;
        })
        .sort((a, b) => ~~Number(a.meta?.orderNo) - ~~Number(b.meta?.orderNo));
    };

    /** 清空登录态(token、userInfo...) */
    const clearLoginStatus = () => {
      token.value = '';
      perms.value = [];
      menus.value = [];
      menusAll.value = [];
      userInfo.value = {};
      resetRouter();
      setTimeout(() => {
        localStorage.clear();
      });
    };
    /** 登录成功保存token */
    const setToken = (_token: string) => {
      token.value = _token;
    };
    /** 登录 */
    const login = async (params: API.LoginDto) => {
      try {
        const data = await Api.auth.authLogin(params);
        setToken(data.token);
        await afterLogin();
        lockscreenStore.setLock(false);
        lockscreenStore.saveLoginPwd(params.password);
      } catch (error) {
        return Promise.reject(error);
      }
    };
    /** 登录成功之后, 获取用户信息以及生成权限路由 */
    const afterLogin = async () => {
      try {
        const userInfoData = await getUserPermission();
        const userInfoObj = userInfoData?.user;
        userInfoObj.nickName = execDecrypt(userInfoObj.nickName);
        userInfoObj.phonenumber = execDecrypt(userInfoObj.phonenumber);
        userInfoObj.userName = execDecrypt(userInfoObj.userName);
        userInfo.value = userInfoObj;
        await fetchPermsAndMenus();
        // sseStore.initServerMsgListener();
      } catch (error) {
        return Promise.reject(error);
      }
    };
    /** 获取权限及菜单 */
    const fetchPermsAndMenus = async () => {
      // const { accountPermissions } = Api.account; // accountMenu
      // accountMenu(), 
      // const wsStore = useWsStore();
      // const [permsData] = await Promise.all([accountPermissions()]); // menusData
      // perms.value = permsData;
      const result = generateDynamicRoutes([]);
      menusAll.value = JSON.parse(JSON.stringify(result));
      menus.value = sortMenus(result);
    };
    /** 登出 */
    const logout = async () => {
      await Api.account.accountLogout();
      // sseStore.closeEventSource();
      clearLoginStatus();
    };

    return {
      token,
      perms,
      menus,
      menusAll,
      userInfo,
      login,
      afterLogin,
      logout,
      setToken,
      clearLoginStatus,
      fetchPermsAndMenus,
    };
  },
  {
    persist: {
      paths: ['token'],
    },
  },
);

// 在组件setup函数外使用
export function useUserStoreWithOut() {
  return useUserStore(store);
}

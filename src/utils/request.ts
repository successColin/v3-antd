import { ResultEnum } from '@/enums/httpEnum';
import { useSSEStore } from '@/store/modules/sse';
import { useUserStore } from '@/store/modules/user';
import { message as $message, Modal } from 'ant-design-vue';
import type { AxiosResponse } from 'axios';
import axios, { CanceledError } from 'axios';
// import qs from 'qs';

const UNKNOWN_ERROR = '未知错误，请重试';
export const baseApiUrl = import.meta.env.VITE_BASE_API_URL;

const service = axios.create();
service.interceptors.request.use(
  (config) => {
    const userStore = useUserStore();
    const token = userStore.token;
    if (token && config.headers) {
      config.headers['authorization'] = `Bearer ${token}`;
    }
    console.log(config)
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);
service.interceptors.response.use(
  (response: AxiosResponse<BaseResponse>) => {
    const res = response.data;
    if (res.status !== ResultEnum.SUCCESS) {
      $message.error(res.message || UNKNOWN_ERROR);
      // Illegal token
      if ([1101, 1105].includes(res.status)) {
        // to re-login
        Modal.confirm({
          title: '警告',
          content: res.message || '账号异常，您可以取消停留在该页上，或重新登录',
          okText: '重新登录',
          cancelText: '取消',
          onOk: () => {
            localStorage.clear();
            window.location.reload();
          },
        });
      }
      const error = new Error(res.message || UNKNOWN_ERROR) as Error & { code: any };
      error.code = res.status;
      return Promise.reject(error);
    } else {
      const sseStore = useSSEStore();
      sseStore.setServerConnectStatus(true);
      return response;
    }
  },
  (error) => {
    if (!(error instanceof CanceledError)) {
      // 处理 422 或者 500 的错误异常提示
      const errMsg = error?.response?.data?.message ?? UNKNOWN_ERROR;
      $message.error({ content: errMsg, key: errMsg });
      error.message = errMsg;
    }
    return Promise.reject(error);
  },
);

type BaseResponse<T = any> = Omit<API.ResOp, 'data'> & {
  data: T;
};

export async function request(url: string, config: any = {}) {
  try {
    const { requestType, isReturnResult = true, ...rest } = config;
    console.log(`${baseApiUrl}/${url}`, (requestType === 'form' ? { 'Content-Type': 'multipart/form-data' } : {'Content-Type': 'application/json'}))
    const response = (await service.request({
      url: `${baseApiUrl}/${url}`,
      ...rest,
      headers: {
        ...(requestType === 'form' ? { 'Content-Type': 'multipart/form-data' } : {'Content-Type': 'application/json'}),
        ...rest.headers,
      },
      // paramsSerializer: params => {
      //   return qs.stringify(params, { arrayFormat: 'repeat' });
      // }
    })) as AxiosResponse<BaseResponse>;
    const { data } = response;
    const { status, message } = data || {};
    const hasSuccess = data && Reflect.has(data, 'status') && status === ResultEnum.SUCCESS;

    if (hasSuccess) {
      const { showSuccessMsg } = config;
      if (showSuccessMsg && message) {
        $message.success(message);
      }
    }
    if (!isReturnResult) {
      return data;
    } else {
      return data.data;
    }
  } catch (error: any) {
    return Promise.reject(error);
  }
}

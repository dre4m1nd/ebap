import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";

import type { ApiResponse } from "@ebap/shared";
import { showError } from "@/utils/showMessage";

const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL || "",
  timeout: 10000,
});

service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => config,
  (error: AxiosError) => Promise.reject(error),
);

service.interceptors.response.use(
  (response: AxiosResponse<ApiResponse<unknown>>) => response,
  async (error: AxiosError<ApiResponse<unknown>>) => {
    const responseData = error.response?.data;
    const message = responseData?.message || error.message || "服务异常";

    showError({ message });
    return Promise.reject(error);
  },
);

function request<T>(config: AxiosRequestConfig) {
  return service.request<T, AxiosResponse<T>>(config).then((response) => {
    const res = response.data as ApiResponse<unknown>;

    if (res.code === 200) {
      return response.data;
    }

    showError(res);
    return Promise.reject(res);
  });
}

export default request;

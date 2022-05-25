import axios from "axios";
import type { AxiosInstance } from "axios";
import type { ApiRequestConfig, ApiRequestInterceptors } from "./type";

import { DEAFULT_LOADING } from "./config";

import { ElLoading } from "element-plus";
import type { LoadingInstance } from "element-plus/es/components/loading/src/loading";
import "element-plus/es/components/loading/style/css";

class ApiRequest {
  instance: AxiosInstance;
  interceptors?: ApiRequestInterceptors;
  showLoading?: boolean;
  loadingInstance?: LoadingInstance;

  constructor(config: ApiRequestConfig) {
    // 創建axios instance
    this.instance = axios.create(config);

    // 取得內容
    this.interceptors = config.interceptors;
    this.showLoading = config.showLoading ?? DEAFULT_LOADING;

    // interceptor
    // 1.從外面config導入的interceptor
    this.instance.interceptors.request.use(
      this.interceptors?.requestInterceptor,
      this.interceptors?.requestInterceptorCatch
    );
    this.instance.interceptors.response.use(
      this.interceptors?.responseInterceptor,
      this.interceptors?.responseInterceptorCatch
    );

    // 2.每個instance都有的interceptor
    this.instance.interceptors.request.use(
      (config) => {
        //根據showLoading設置開關loading動畫
        if (this.showLoading) {
          this.loadingInstance = ElLoading.service({
            lock: true,
            background: "rgba(0, 0, 0, 0.9)",
          });
        }

        return config;
      },
      (err) => {
        return err;
      }
    );
    this.instance.interceptors.response.use(
      (res) => {
        // 將loading動畫關掉
        this.loadingInstance?.close();
        // 將data取出
        return res.data;
      },
      (err) => {
        // 將loading動畫關掉
        this.loadingInstance?.close();
        return err;
      }
    );
  }

  request<T>(config: ApiRequestConfig<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      // 如果外部有傳入interceptor，對config做處理
      if (config.interceptors?.requestInterceptor) {
        config = config.interceptors.requestInterceptor(config);
      }

      if (config.showLoading) {
        this.showLoading = config.showLoading;
      }

      this.instance
        .request<any, T, any>(config)
        .then((res) => {
          if (config.interceptors?.responseInterceptor) {
            res = config.interceptors.responseInterceptor(res);
          }
          this.showLoading = DEAFULT_LOADING;

          resolve(res);
        })
        .catch((err) => {
          this.showLoading = DEAFULT_LOADING;
          reject(err);
          return err;
        });
    });
  }

  get<T>(config: ApiRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: "GET" });
  }

  post<T>(config: ApiRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: "POST" });
  }

  delete<T>(config: ApiRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: "DELETE" });
  }

  patch<T>(config: ApiRequestConfig<T>): Promise<T> {
    return this.request({ ...config, method: "patch" });
  }
}

export default ApiRequest;

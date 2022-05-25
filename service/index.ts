import ApiRequest from "./request";
import { BASE_URL, TIME_OUT } from "./request/config";
import LocalStorage from "@/utils/localStorage";

const apiRequest = new ApiRequest({
  baseURL: BASE_URL,
  timeout: TIME_OUT,
  interceptors: {
    requestInterceptor: (config) => {
      // 透過攔截器添加token
      const token = LocalStorage.getItem("token");
      if (token) {
        const bearer_token = `Bearer ${token}`;
        config.headers = {
          Authorization: bearer_token,
        };
      }
      return config;
    },
    requestInterceptorCatch: (err) => {
      return err;
    },
    responseInterceptor: (config) => {
      return config;
    },
    responseInterceptorCatch: (err) => {
      return err;
    },
  },
});
export default apiRequest;

// apiRequest.request({
//   url: '/home/multidata',
//   method: 'GET',
//   headers: {},
//   interceptors: {
//     requestInterceptor: (config) => {
//       console.log('單獨攔截請求')
//       config.headers['token'] = '123'
//       return config
//     },
//     responseInterceptor: (res) => {
//       console.log('單獨攔截response')
//       return res
//     }
//   }
// })

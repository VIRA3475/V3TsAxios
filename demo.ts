import apiRequest from "./service";

interface DataType {
  success: boolean;
  result: any;
  message: string;
}

apiRequest.request<DataType>({
  showLoading: true,
  url: "/signup",
  method: "POST",
  interceptors: {
    requestInterceptor: (config) => {
      console.log("請求成功的攔截");
      return config;
    },
  },
  data: {
    email: "lovef2e@hexschool.com",
    password: "12345678",
  },
});

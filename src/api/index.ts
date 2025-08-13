import axios from "axios";
import { useChatStore } from "../store/store";

const apiClient = axios.create({
  baseURL: "http://localhost:8080/api", // 你的 Go 后端 API 地址
  headers: { "Content-Type": "application/json" },
});

// 使用请求拦截器(interceptors)，在每个请求头中自动附加 Authorization Token
//request在每个http请求发送之前被调用
/* 
config  
{
  url: '/login',              // 请求地址
  method: 'POST',            // 请求方法
  headers: {...},            // 请求头
  data: {...},               // 请求体数据
  timeout: 5000,             // 超时时间
  // ... 其他配置
}*/
apiClient.interceptors.request.use((config) => {
  const token = useChatStore.getState().token;
  //获取token,如果token存在且config.headers也存在
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;

//构建应用路由
import { Navigate, Outlet } from "react-router-dom";
import { useChatStore } from "../store/store";

const ProtectedRoute = () => {
  const token = useChatStore((state: { token: string | null }) => state.token);//从state中获得token
  // 如果没有 token，则重定向到登录页，否则渲染子页面
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};
export default ProtectedRoute;

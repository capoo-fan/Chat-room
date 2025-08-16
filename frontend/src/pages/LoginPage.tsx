import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useChatStore } from "../store/store";
import apiClient from "../api";
import type { LoginCredentials, User } from "../types";
import { AxiosError } from "axios";

// Material-UI 组件导入
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  FormControlLabel,
  Checkbox,
  Divider,
  Paper,
  Alert,
  Link as MuiLink,
} from "@mui/material";
import { Google, Facebook } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

// 深色主题配置
//createTheme 创建主题,通过 ThemeProvider 组件应用
const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#4A9EFF",
    },
    background: {
      default: "#0D1421",
      paper: "#1A2332",
    },
    text: {
      primary: "#ffffff",
      secondary: "#B0BEC5",
    },
  },
  components: {
    //MuiTextField 组件,前缀加上mui控制
    MuiTextField: {
      styleOverrides: {
        //root覆盖textfield中原本的样式
        root: {
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#3A4A5C",
            },
            "&:hover fieldset": {
              borderColor: "#4A9EFF",
            },
          },
        },
      },
    },
  },
});

// Sitemark Logo 组件
const SitemarkIcon = () => (
  <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
    <Box
      sx={{
        width: 24, // 宽度：24px
        height: 24, // 高度：24px
        borderRadius: "50%", // 边框圆角：50%（创建完美的圆形）
        background: "linear-gradient(45deg, #4A9EFF, #00C9FF)", // 渐变背景
        display: "flex", // 设置为 Flex 容器
        alignItems: "center", // 垂直居中对齐
        justifyContent: "center", // 水平居中对齐
        mr: 1, // 右边距：8px（Material-UI 中 1 = 8px）
      }}>
      {/* Typography用于显示文字 */}
      <Typography variant="h6" sx={{ color: "white", fontSize: "12px" }}>
        ⚡
      </Typography>
    </Box>
    <Typography variant="h6" sx={{ color: "#4A9EFF", fontWeight: "bold" }}>
      <RouterLink to="https://github.com/capoo-fan/Chat-room">
        Qian Fu's Chatroom
      </RouterLink>
    </Typography>
  </Box>
);

// 为社交登录按钮创建可复用的样式对象
const socialButtonStyle = {
  py: 1.5,
  borderColor: "#3A4A5C",
  color: "text.primary",
  textTransform: "none",
  "&:hover": {
    borderColor: "#4A9EFF",
    backgroundColor: "rgba(74, 158, 255, 0.04)",
  },
};

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setToken, setCurrentUser } = useChatStore();
  //声明 handleLogin 函数
  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); //阻止默认表单提交行为
    setError(""); //清空错误信息
    try {
      const credentials: LoginCredentials = {
        username: email, // 使用 email 作为 username
        password,
      };
      //apiClient 向服务器的 /login 发送 POST 请求
      const response = await apiClient.post<{ token: string; user: User }>(
        "/login", //请求的路径
        credentials //自动变成 .json 格式发送到后端
      ); //token 和 user 是期望的返回值

      const { token, user } = response.data;
      setToken(token);
      setCurrentUser(user);
      navigate("/chat"); //导航到聊天页面
    } catch (err) {
      console.error(err);
      // 检查错误是否是 AxiosError 的实例
      if (err instanceof AxiosError) {
        if (err.response) {
          // 服务器有响应，但状态码是错误的 (例如 401 Unauthorized)
          // 尝试使用后端返回的错误消息，否则使用通用消息
          setError(err.response.data.message || "登录失败，请检查您的邮箱和密码。");
        } else if (err.request) {
          // 请求已发出，但没有收到响应（通常是网络问题）
          setError("无法连接到服务器，请检查您的网络。");
        }
      }
      // 对于其他所有未知错误
      setError("登录失败，发生了一个未知错误。");
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      {" "}
      {/*所有组件自动应用主题 */}
      <Container
        component="main"
        maxWidth={false}
        disableGutters
        sx={{
          minHeight: "100vh", //设置最小高度为视口高度
          width: "100vw",
          backgroundImage:
            "radial-gradient(at 50% 50%, hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))",
          backgroundColor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2, // 添加一些内边距
        }}>
        <Paper
          elevation={3} ///设置 paper 的阴影
          sx={{
            p: 4,
            width: "400px",
            maxWidth: "90vw",
            backgroundColor: "background.paper",
            border: "1px solid #3A4A5C",
            borderRadius: 2,
          }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center", // 改为居中对齐
            }}>
            <Box sx={{ alignSelf: "flex-start", mb: 3 }}>
              {/* Logo 左对齐 */}
              <SitemarkIcon />
            </Box>

            <Typography
              component="h1"
              variant="h4"
              sx={{
                mb: 3,
                fontWeight: "bold",
                alignSelf: "flex-start", // 标题左对齐
                width: "100%",
              }}>
              Sign in
            </Typography>

            <Box component="form" onSubmit={handleLogin} sx={{ width: "100%" }}>
              <Typography
                variant="body2"
                sx={{ mb: 1, color: "text.secondary" }}>
                Email
              </Typography>
              <TextField
                required /* 表示必填 */
                fullWidth
                id="email"
                placeholder="your@email.com" /* 占位符文本 */
                name="email"
                autoComplete="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                slotProps={{
                  input: {
                    sx: {
                      backgroundColor: "#0A0E1A",
                      color: "white",
                    },
                  },
                }}
              />

              <Typography
                variant="body2"
                sx={{ mb: 1, color: "text.secondary" }}>
                Password
              </Typography>
              <TextField
                required
                fullWidth
                name="password"
                type="password"
                id="password"
                placeholder="••••••"
                autoComplete="current-password"
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ mb: 2 }}
                /*slotProps 表示传入的参数*/
                slotProps={{
                  input: {
                    sx: {
                      backgroundColor: "#0A0E1A",
                      color: "white",
                    },
                  },
                }}
              />

              {/* FormControlLabel  将一个控件和标签组合在一起 比如这里就是复选框和标签 */}
              <FormControlLabel
                /*control 表示表单控件 */
                control={
                  <Checkbox
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary"
                    sx={{ color: "text.secondary" }}
                  />
                }
                label="Remember me"
                sx={{ mb: 2, color: "text.secondary" }}
              />

              {error && (
                <Alert severity="error" sx={{ width: "100%", mb: 2 }}>
                  {error}
                </Alert>
              )} {/*如果error为假就会直接跳过,否则就会渲染后面的组件,Alert表示提示框 */}

              <Button
                type="submit"
                fullWidth
                variant="contained" /*contained 是填充按钮 */
                sx={{
                  mt: 1,
                  mb: 2,
                  py: 1.5,
                  backgroundColor: "#E5E7EB",
                  color: "#000",
                  "&:hover": {
                    backgroundColor: "#D1D5DB",
                  },
                  textTransform: "none", //取消转换大小写
                  fontWeight: "normal",
                }}>
                Sign in
              </Button>

              <Box sx={{ textAlign: "center", mb: 2 }}>
                <MuiLink
                  href="#"
                  variant="body2"
                  sx={{ color: "text.secondary", textDecoration: "none" }} //次要文字色, 取消下划线
                  onClick={(e) => e.preventDefault()}>
                  Forgot your password?
                </MuiLink>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", my: 2 }}>
                <Divider sx={{ flex: 1, borderColor: "#3A4A5C" }} />
                <Typography
                  variant="body2"
                  sx={{ mx: 2, color: "text.secondary" }}>
                  or
                </Typography>
                <Divider sx={{ flex: 1, borderColor: "#3A4A5C" }} />
              </Box>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Google />}
                sx={{ ...socialButtonStyle, mb: 1 }}>
                Sign in with Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook />}
                // 使用扩展运算符(...)应用基础样式，并覆盖 mb 属性
                sx={{ ...socialButtonStyle, mb: 3 }}>
                Sign in with Facebook
              </Button>

              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Don't have an account?{" "}
                  <MuiLink
                    component={RouterLink}
                    to="/register"
                    sx={{ color: "#4A9EFF", textDecoration: "none" }}>
                    Sign up
                  </MuiLink>
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default LoginPage;

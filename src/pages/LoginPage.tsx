import { useState } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useChatStore } from "../store/store";
import apiClient from "../api";
import type { LoginCredentials, User } from "../types";

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
    MuiTextField: {
      styleOverrides: {
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
        width: 24,
        height: 24,
        borderRadius: "50%",
        background: "linear-gradient(45deg, #4A9EFF, #00C9FF)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mr: 1,
      }}>
      <Typography variant="h6" sx={{ color: "white", fontSize: "12px" }}>
        ⚡
      </Typography>
    </Box>
    <Typography variant="h6" sx={{ color: "#4A9EFF", fontWeight: "bold" }}>
      Sitemark
    </Typography>
  </Box>
);

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setToken, setCurrentUser } = useChatStore();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");

    try {
      const credentials: LoginCredentials = {
        username: email, // 使用 email 作为 username
        password,
      };
      const response = await apiClient.post<{ token: string; user: User }>(
        "/login",
        credentials
      );

      const { token, user } = response.data;
      setToken(token);
      setCurrentUser(user);
      navigate("/chat");
    } catch (err) {
      setError("登录失败，请检查您的邮箱和密码。");
      console.error(err);
    }
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <Container
        component="main"
        maxWidth={false}
        disableGutters
        sx={{
          minHeight: "100vh",
          width: "100vw",
          backgroundColor: "background.default",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 2, // 添加一些内边距
        }}>
        <Paper
          elevation={3}
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
              {" "}
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
                required
                fullWidth
                id="email"
                placeholder="your@email.com"
                name="email"
                autoComplete="email"
                variant="outlined"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2 }}
                InputProps={{
                  sx: {
                    backgroundColor: "#0A0E1A",
                    color: "white",
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
                InputProps={{
                  sx: {
                    backgroundColor: "#0A0E1A",
                    color: "white",
                  },
                }}
              />

              <FormControlLabel
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
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 1,
                  mb: 2,
                  py: 1.5,
                  backgroundColor: "#E5E7EB",
                  color: "#000",
                  "&:hover": {
                    backgroundColor: "#D1D5DB",
                  },
                  textTransform: "none",
                  fontWeight: "normal",
                }}>
                Sign in
              </Button>

              <Box sx={{ textAlign: "center", mb: 2 }}>
                <MuiLink
                  href="#"
                  variant="body2"
                  sx={{ color: "text.secondary", textDecoration: "none" }}
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
                sx={{
                  mb: 1,
                  py: 1.5,
                  borderColor: "#3A4A5C",
                  color: "text.primary",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#4A9EFF",
                    backgroundColor: "rgba(74, 158, 255, 0.04)",
                  },
                }}>
                Sign in with Google
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<Facebook />}
                sx={{
                  mb: 3,
                  py: 1.5,
                  borderColor: "#3A4A5C",
                  color: "text.primary",
                  textTransform: "none",
                  "&:hover": {
                    borderColor: "#4A9EFF",
                    backgroundColor: "rgba(74, 158, 255, 0.04)",
                  },
                }}>
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

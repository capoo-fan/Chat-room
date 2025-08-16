import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useChatStore } from "../store/store";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { Box, Typography, Paper, Button, Chip } from "@mui/material";

const WEBSOCKET_URL = "ws://localhost:8080/ws";

const ChatPage = () => {
  const { token, addMessage, logout, currentUser } = useChatStore(); //从zustand获取状态

  //useWebSocket返回对象,包含多个属性,然后从中解构,赋值给对应的变量,
  const { sendMessage, lastMessage, readyState } = useWebSocket(WEBSOCKET_URL, {
    queryParams: { token: token || "" }, //结果：实际连接 URL 变成 ws://localhost:8080/ws?token=用户的token
    onOpen: () => console.log("WebSocket 连接已建立"),
    onClose: () => console.log("WebSocket 连接已断开"),
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastMessage !== null) {
      addMessage(JSON.parse(lastMessage.data));
    }
  }, [lastMessage, addMessage]);

  const handleSendMessage = (text: string) =>
    sendMessage(JSON.stringify({ text }));

  const connectionStatus = {
    [ReadyState.CONNECTING]: { label: "连接中...", color: "warning" as const },
    [ReadyState.OPEN]: { label: "已连接", color: "success" as const },
    [ReadyState.CLOSING]: { label: "关闭中...", color: "warning" as const },
    [ReadyState.CLOSED]: { label: "已断开", color: "error" as const },
    [ReadyState.UNINSTANTIATED]: {
      label: "未实例化",
      color: "default" as const,
    },
  }[readyState]; //ReadyState是枚举变量, readyState是当前连接状态,根据 ReadyState 为 connectionStatus 赋值

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        p: 2,
        boxSizing: "border-box",
      }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}>
        <Typography variant="h4">Go+React 聊天室</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Chip
            label={connectionStatus.label}
            color={connectionStatus.color}
            size="small"
          />
          <Typography variant="body1">
            欢迎,
            <Box component="span" sx={{ fontWeight: "bold" }}>
              {currentUser?.username}
            </Box>
            !
          </Typography>
          <Button variant="outlined" size="small" onClick={logout}>
            退出
          </Button>
        </Box>
      </Box>
      <Paper
        elevation={3}
        sx={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}>
        <MessageList />
        <MessageInput onSendMessage={handleSendMessage} />
      </Paper>
    </Box>
  );
};
export default ChatPage;

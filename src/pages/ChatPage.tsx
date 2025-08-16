import { useEffect } from "react";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { useChatStore } from "../store/store";
import MessageList from "../components/MessageList";
import MessageInput from "../components/MessageInput";
import { Box, Typography, Paper, Button, Chip } from "@mui/material";

const WEBSOCKET_URL = "ws://localhost:8080/ws";

const ChatPage = () => {
  const { token, addMessage, logout, currentUser } = useChatStore();

  const { sendMessage, lastMessage, readyState } = useWebSocket(WEBSOCKET_URL, {
    queryParams: { token: token || "" },
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
    [ReadyState.CONNECTING]: { label: "连接中...", color: "warning" },
    [ReadyState.OPEN]: { label: "已连接", color: "success" },
    [ReadyState.CLOSING]: { label: "关闭中...", color: "warning" },
    [ReadyState.CLOSED]: { label: "已断ក", color: "error" },
    [ReadyState.UNINSTANTIATED]: { label: "未实例化", color: "default" },
  }[readyState];

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
            color={connectionStatus.color as any}
            size="small"
          />
          <Typography variant="body1">
            欢迎, **{currentUser?.username}**!
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

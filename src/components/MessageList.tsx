import { useEffect, useRef } from "react";
import { useChatStore } from "../store/store";
import { Box, List, ListItem, ListItemText, Typography } from "@mui/material";

const MessageList = () => {
  const { messages, currentUser } = useChatStore();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box sx={{ flexGrow: 1, overflowY: "auto", p: 2 }}>
      <List>
        {messages.map((msg) => {
          const isMe = msg.user.id === currentUser?.id;
          return (
            <ListItem
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}>
              <Box
                sx={{
                  p: 1,
                  px: 2,
                  borderRadius: 3,
                  bgcolor: isMe ? "primary.main" : "grey.200",
                  color: isMe ? "primary.contrastText" : "text.primary",
                  maxWidth: "70%",
                }}>
                {!isMe && (
                  <Typography
                    variant="caption"
                    sx={{ display: "block", fontWeight: "bold" }}>
                    {msg.user.username}
                  </Typography>
                )}
                <ListItemText
                  primary={
                    <Typography sx={{ wordBreak: "break-word" }}>
                      {msg.text}
                    </Typography>
                  }
                />
              </Box>
            </ListItem>
          );
        })}
        <div ref={endOfMessagesRef} />
      </List>
    </Box>
  );
};
export default MessageList;

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Message, User } from "../types"; //导入创建好的类型

interface ChatState {
  messages: Message[];
  token: string | null;
  currentUser: User | null;
  addMessage: (message: Message) => void;
  setToken: (token: string) => void;
  setCurrentUser: (user: User) => void;
  logout: () => void;
} //建立一个全局消息调度中心

// 使用 persist 中间件将用户的登录状态（token 和用户信息）保存到 localStorage
// 这样即使用户刷新页面，也能保持登录状态

//create与persist中间件的搭配,实现持久化存储
export const useChatStore = create<ChatState>()(
  //persist(...)：它会拦截每一次状态变更，并自动将状态保存到一个存储位置（默认是 localStorage）
  persist(
    (set) => ({
      messages: [],
      token: null,
      currentUser: null,
      addMessage: (message: Message) =>
        set((state) => ({ messages: [...state.messages, message] })),
      setToken: (token: string) => set({ token }),
      setCurrentUser: (user: User) => set({ currentUser: user }),
      logout: () => set({ token: null, currentUser: null, messages: [] }),
    }),
    // persist 中间件的配置

    //第二个参数，它告诉 persist 如何去保存数据。
    {
      name: "chat-app-storage", // localStorage 中的键名
      // `partialize` 指定了只保存 token 和 currentUser
      partialize: (state: ChatState) => ({
        token: state.token,
        currentUser: state.currentUser,
      }),
    }
  )
);

/* persist 函数接收两个主要的参数：

参数一：状态初始化函数 (State Initializer Function)

作用：定义你的状态仓库“长什么样”，里面有什么数据（state）和什么操作（actions）。

本质：它就是你原本要传给 create 函数的那个函数。

参数二：配置对象 (Configuration Object)

作用：定制 persist 的行为，告诉它“如何”以及“在哪里”保存你的状态。

本质：一个包含各种可选配置项的普通 JavaScript 对象 */

//定义要用到的类型
// interface 定义接口
export interface User {
  id: string;
  username: string;
}

export interface Message {
  id: string;
  text: string;
  timestamp: string;
  user: User;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

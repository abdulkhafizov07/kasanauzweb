import { ReactNode } from "react";

export interface UserDisplay {
  first_name: string;
  last_name: string;
  pfp: string;
  purposes: string;
}

export interface Chat {
  guid: string;
  display: UserDisplay;
}

export interface Message {
  guid: string;
  type: "text" | "product" | "announcement";
  content: string;
  created_at: string;
  user: string;
}

export interface Product {
  title: string;
  image: string;
  price_discount: number;
  short_description: string;
}

export interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  activeChatId: string | null;
  chatHistory: Message[];
  loading: boolean;
  changeChat: (chatId: string) => void;
  sendMessage: (message: string, type?: "text" | "product") => void;
  fetchChatsData: (postFunction?: () => void) => void;
}

export interface ChatProviderProps {
  children: ReactNode;
}

export interface ProductMessageProps {
  message: Message;
}

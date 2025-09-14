"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "./AuthContext";

export interface MessageData {
  _id: string;
  roomId: string;
  sender: string;
  message: string;
  messageType: "text" | "image" | "audio";
  image?: {
    url: string;
    publicId: string;
  };
  seenStatus: boolean;
  seenAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface TypingData {
  roomId: string;
  userId: string;
}

export interface MessageSeenData {
  roomId: string;
  seenBy: string;
  messageIds: string[];
}

export interface OnlineUsersData {
  users: string[];
}

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: string[];

  connect: () => void;
  disconnect: () => void;

  joinRoom: (roomId: string) => void;
  leaveRoom: (roomId: string) => void;
  sendMessage: (
    roomId: string,
    message: string,
    messageType?: "text" | "image"
  ) => void;

  startTyping: (roomId: string) => void;
  stopTyping: (roomId: string) => void;

  onNewMessage: (callback: (data: MessageData) => void) => () => void;
  onMessagesSeen: (callback: (data: MessageSeenData) => void) => () => void;
  onUserTyping: (callback: (data: TypingData) => void) => () => void;
  onUserStoppedTyping: (callback: (data: TypingData) => void) => () => void;
  onOnlineUsers: (callback: (users: string[]) => void) => () => void;
}

const SocketContext = createContext<SocketContextType | null>(null);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

  const connect = useCallback(() => {
    if (!user?._id) return;

    if (socket?.connected) {
      return;
    }

    if (socket) {
      socket.disconnect();
    }

    const newSocket = io(BACKEND_URL, {
      query: { userId: user._id },
      transports: ["websocket", "polling"],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: maxReconnectAttempts,
      reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {
      setIsConnected(true);
      reconnectAttempts.current = 0;
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
      reconnectAttempts.current++;

      if (reconnectAttempts.current >= maxReconnectAttempts) {
        console.error("Max reconnection attempts reached");
        newSocket.disconnect();
      }
    });

    newSocket.on("getOnlineUser", (users: string[]) => {
      setOnlineUsers(users);
    });

    setSocket(newSocket);
  }, [user?._id, BACKEND_URL]);

  const disconnectSocket = useCallback(() => {
    setSocket((currentSocket) => {
      if (currentSocket) {
        currentSocket.disconnect();
        setIsConnected(false);
        setOnlineUsers([]);
        return null;
      }
      return currentSocket;
    });
  }, []);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      connect();
    } else {
      disconnectSocket();
    }

    return () => {
      disconnectSocket();
    };
  }, [isAuthenticated, user?._id]);

  const joinRoom = useCallback(
    (roomId: string) => {
      if (socket?.connected) {
        socket.emit("joinChat", roomId);
      }
    },
    [socket]
  );

  const leaveRoom = useCallback(
    (roomId: string) => {
      if (socket?.connected) {
        socket.emit("leaveChat", roomId);
      }
    },
    [socket]
  );

  const sendMessage = useCallback(
    (
      roomId: string,
      message: string,
      messageType: "text" | "image" = "text"
    ) => {
      if (socket?.connected && user?._id) {
        const messageData = {
          roomId,
          senderId: user._id,
          message: message,
          messageType,
        };
        socket.emit("sendMessage", messageData);
      }
    },
    [socket, user?._id]
  );

  const startTyping = useCallback(
    (roomId: string) => {
      if (socket?.connected && user?._id) {
        socket.emit("typing", { roomId, userId: user._id });
      } else {
        console.log("Cannot emit typing - socket not connected or no user:", {
          connected: socket?.connected,
          userId: user?._id,
        });
      }
    },
    [socket, user?._id]
  );

  const stopTyping = useCallback(
    (roomId: string) => {
      if (socket?.connected && user?._id) {
        socket.emit("stopTyping", { roomId, userId: user._id });
      } else {
        console.log(
          "Cannot emit stopTyping - socket not connected or no user:",
          {
            connected: socket?.connected,
            userId: user?._id,
          }
        );
      }
    },
    [socket, user?._id]
  );

  const onNewMessage = useCallback(
    (callback: (data: MessageData) => void) => {
      if (!socket) return () => {};

      socket.on("newMessage", callback);
      return () => socket.off("newMessage", callback);
    },
    [socket]
  );

  const onMessagesSeen = useCallback(
    (callback: (data: MessageSeenData) => void) => {
      if (!socket) return () => {};

      socket.on("messagesSeen", callback);
      return () => socket.off("messagesSeen", callback);
    },
    [socket]
  );

  const onUserTyping = useCallback(
    (callback: (data: TypingData) => void) => {
      if (!socket) return () => {};

      socket.on("userTyping", callback);
      return () => socket.off("userTyping", callback);
    },
    [socket]
  );

  const onUserStoppedTyping = useCallback(
    (callback: (data: TypingData) => void) => {
      if (!socket) return () => {};

      socket.on("userStoppedTyping", callback);
      return () => socket.off("userStoppedTyping", callback);
    },
    [socket]
  );

  const onOnlineUsers = useCallback(
    (callback: (users: string[]) => void) => {
      if (!socket) return () => {};

      const handler = (users: string[]) => {
        setOnlineUsers(users);
        callback(users);
      };

      socket.on("getOnlineUser", handler);
      return () => socket.off("getOnlineUser", handler);
    },
    [socket]
  );

  const contextValue: SocketContextType = {
    socket,
    isConnected,
    onlineUsers,
    connect,
    disconnect: disconnectSocket,
    joinRoom,
    leaveRoom,
    sendMessage,
    startTyping,
    stopTyping,
    onNewMessage,
    onMessagesSeen,
    onUserTyping,
    onUserStoppedTyping,
    onOnlineUsers,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export default SocketContext;

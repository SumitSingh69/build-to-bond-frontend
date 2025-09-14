"use client";

import { useState, useEffect, useCallback } from "react";
import { useSocket } from "@/context/SocketContext";
import { apiRequest } from "@/lib/api";
import { Chat, ChatUser, Message } from "@/app/(main)/chat/types";
import { toast } from "sonner";

interface CreateRoomResponse {
  success?: boolean;
  message: string;
  data?: { _id: string };
  roomId?: string;
}

interface GetChatsResponse {
  success: boolean;
  chats: Array<{
    chat: {
      _id: string;
      users: string[];
      createdAt: string;
      updatedAt: string;
      lastMessage?: string;
      unseenCount: number;
      isActive: boolean;
      currentUser: {
        id: string;
        role: "currentUser";
      };
      otherUser: {
        id: string;
        firstName: string;
        lastName: string;
        profilePhoto?: string;
        role: "otherUser";
      };
      profilePhoto?: string;
      firstName: string;
      lastName: string;
    };
  }>;
}

interface GetMessagesResponse {
  success?: boolean;
  message?: string;
  messages?: Array<{
    _id: string;
    sender: string;
    receiver?: string;
    message?: string;
    image?: {
      url: string;
      publicId: string;
    };
    messageType: "text" | "image" | "audio";
    createdAt: string;
    seenStatus: boolean;
    deliveredStatus: "sending" | "sent" | "delivered" | "failed";
  }>;
  room?: {
    id: string;
    currentUser: {
      id: string;
      role: "currentUser";
    };
    otherUser: {
      id: string;
      firstName: string;
      lastName: string;
      profilePicture?: string;
      role: "otherUser";
    };
  };
  user?: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePicture?: string;
    avatar?: string;
  };
}

// Types for sending messages
type OutgoingMessagePayload = {
  roomId: string;
  text?: string;
  messageType: 'text' | 'image' | 'audio';
  file?: unknown;
};

type ApiSendMessageResponse = {
  message: {
    _id: string;
    roomId: string;
    sender: string;
    message?: string;
    image?: { url: string; publicId: string };
    messageType: 'text' | 'image' | 'audio';
    createdAt: string | Date;
    seenStatus: boolean;
  };
  sender: string;
};

export const useChatData = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<ChatUser | null>(null);
  const { onNewMessage, onlineUsers, onOnlineUsers } = useSocket();

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const user = localStorage.getItem("user");
        if (user) {
          const userData = JSON.parse(user);
          setCurrentUser({
            id: userData._id,
            firstName: userData.firstName,
            lastName: userData.lastName,
            avatar: userData.avatar || userData.profilePicture,
            isOnline: true,
          });
        }
      } catch (error) {
        console.error("Error getting current user:", error);
      }
    };

    getCurrentUser();
  }, []);

  const transformChatData = useCallback(
    (
      backendChats: GetChatsResponse["chats"],
      currentUserId: string
    ): Chat[] => {
      return backendChats.map((item) => {
        const { chat } = item;

        const otherUser = chat.otherUser || {
          id: chat.users.find((id) => id !== currentUserId) || "",
          firstName: chat.firstName || "Unknown",
          lastName: chat.lastName || "User",
          profilePhoto: chat.profilePhoto,
          role: "otherUser" as const,
        };

        const currentUserInfo = chat.currentUser || {
          id: currentUserId,
          role: "currentUser" as const,
        };

        return {
          id: chat._id,
          roomId: chat._id,
          participants: [
            {
              id: currentUserInfo.id,
              firstName: currentUser?.firstName || "You",
              lastName: currentUser?.lastName || "",
              isOnline: true,
            },
            {
              id: otherUser.id,
              firstName: otherUser.firstName,
              lastName: otherUser.lastName,
              profilePicture: otherUser.profilePhoto || undefined,
              isOnline: false,
            },
          ],
          lastMessage: chat.lastMessage
            ? {
                id: "last-msg",
                text: chat.lastMessage,
                messageType: "text",
                senderId: otherUser.id,
                timestamp: new Date(chat.updatedAt),
                isOwn: false,
                status: "delivered",
              }
            : undefined,
          unreadCount: chat.unseenCount,
          isActive: chat.isActive,
          createdAt: new Date(chat.createdAt),
          updatedAt: new Date(chat.updatedAt),
        };
      });
    },
    [currentUser]
  );

  const transformMessageData = useCallback(
    (
      backendMessages: GetMessagesResponse["messages"],
      currentUserId: string
    ): Message[] => {
      if (!backendMessages) return [];

      return backendMessages.map((msg) => ({
        id: msg._id,
        text: msg.message || "",
        messageType:
          msg.messageType === "audio"
            ? "voice"
            : (msg.messageType as "text" | "image" | "voice"),
        senderId: msg.sender,
        timestamp: new Date(msg.createdAt),
        isOwn: msg.sender === currentUserId,
        status: msg.deliveredStatus,
        mediaUrl: msg.image?.url,
      }));
    },
    []
  );

  const fetchChats = useCallback(async () => {
    if (!currentUser) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<GetChatsResponse>("/chat/all", {
        method: "GET",
      });

      if (response.success && response.chats) {
        const transformedChats = transformChatData(
          response.chats,
          currentUser.id
        );
        setChats(transformedChats);
      }
    } catch (err) {
      console.error("Error fetching chats:", err);
      setError("Failed to load chats");
      toast.error("Failed to load chats");
    } finally {
      setLoading(false);
    }
  }, [currentUser, transformChatData]);

  const createOrGetChatRoom = useCallback(
    async (otherUserId: string): Promise<string | null> => {
      try {
        const response = await apiRequest<CreateRoomResponse>("/chat/new", {
          method: "POST",
          body: JSON.stringify({ receiverId: otherUserId }),
        });

        if (response.roomId) {
          return response.roomId;
        }

        if (response.data && response.data._id) {
          return response.data._id;
        }

        console.error("No room ID found in response:", response);
        toast.error("Failed to get room ID from response");
        return null;
      } catch (err) {
        console.error("Error creating/getting chat room:", err);
        toast.error("Failed to start chat");
        return null;
      }
    },
    []
  );

  const fetchMessages = useCallback(
    async (roomId: string): Promise<Message[]> => {
      if (!currentUser) return [];

      try {
        const response = await apiRequest<GetMessagesResponse>(
          `/chat/message/${roomId}`,
          {
            method: "GET",
          }
        );

        if (response.messages) {
          return transformMessageData(response.messages, currentUser.id);
        }
        return [];
      } catch (err) {
        console.error("Error fetching messages:", err);
        toast.error("Failed to load messages");
        return [];
      }
    },
    [currentUser, transformMessageData]
  );

  const fetchRoomWithMessages = useCallback(
    async (
      roomId: string
    ): Promise<{
      messages: Message[];
      user: ChatUser | null;
    }> => {
      if (!currentUser) return { messages: [], user: null };

      try {
        const response = await apiRequest<GetMessagesResponse>(
          `/chat/message/${roomId}`,
          {
            method: "GET",
          }
        );

        const messages = response.messages
          ? transformMessageData(response.messages, currentUser.id)
          : [];

        let user: ChatUser | null = null;

        if (response.room?.otherUser) {
          user = {
            id: response.room.otherUser.id,
            firstName: response.room.otherUser.firstName,
            lastName: response.room.otherUser.lastName,
            avatar: response.room.otherUser.profilePicture,
            profilePicture: response.room.otherUser.profilePicture,
            isOnline: false,
          };
        } else if (response.user) {
          user = {
            id: response.user._id,
            firstName: response.user.firstName,
            lastName: response.user.lastName,
            avatar: response.user.avatar || response.user.profilePicture,
            profilePicture: response.user.profilePicture,
            isOnline: false,
          };
        }

        setChats((prev) => {
          const idx = prev.findIndex((c) => c.roomId === roomId);
          if (idx === -1) return prev;
          const updated = { ...prev[idx], unreadCount: 0 };
          const copy = prev.slice();
          copy[idx] = updated;
          return copy;
        });

        try {
          window.dispatchEvent(
            new CustomEvent("chat:markRead", { detail: { roomId } })
          );
        } catch (e) {
          console.error("Error dispatching chat:markRead event:", e);
        }

        return { messages, user };
      } catch (err) {
        console.error("Error fetching room data:", err);
        toast.error("Failed to load chat data");
        return { messages: [], user: null };
      }
    },
    [currentUser, transformMessageData]
  );

  const markChatAsReadLocal = useCallback((roomId: string) => {
    setChats((prev) => {
      const idx = prev.findIndex((c) => c.roomId === roomId);
      if (idx === -1) return prev;
      const updated = { ...prev[idx], unreadCount: 0 };
      const copy = prev.slice();
      copy[idx] = updated;
      return copy;
    });
    try {
      window.dispatchEvent(
        new CustomEvent("chat:markRead", { detail: { roomId } })
      );
    } catch {}
  }, []);

  const sendMessage = useCallback(
    async (
      roomId: string,
      message: string,
      messageType: "text" | "image" | "voice" = "text",
      imageData?: unknown
    ) => {
      if (!currentUser) return false;

      setChats((prevChats) => {
        const chatIdx = prevChats.findIndex((c) => c.roomId === roomId);
        if (chatIdx === -1) return prevChats;

        const prevChat = prevChats[chatIdx];
        const now = new Date();
        const optimisticMessage = {
          id: `optimistic-${now.getTime()}`,
          text: message,
          messageType: messageType as
            | "text"
            | "image"
            | "voice"
            | "video"
            | "file",
          senderId: currentUser.id,
          timestamp: now,
          isOwn: true,
          status: "sending" as const,
        };

        const updatedChat = {
          ...prevChat,
          lastMessage: optimisticMessage,
          unreadCount: 0,
          updatedAt: now,
        };
        const newChats = [
          updatedChat,
          ...prevChats.filter((_, i) => i !== chatIdx),
        ];
        return newChats;
      });

      try {
        const messageData: OutgoingMessagePayload = {
          roomId,
          text: messageType === "text" ? message : undefined,
          messageType: messageType === "voice" ? "audio" : messageType,
        };

        if (messageType === "image" && imageData) {
          messageData.file = imageData;
        }

        console.log("Sending message data:", messageData);
        const response = await apiRequest<ApiSendMessageResponse>(
          "/chat/message",
          {
            method: "POST",
            body: JSON.stringify(messageData),
          }
        );

        if (response.message && response.sender) {
          // fetchChats();
          return true;
        }
        console.error(
          "API call succeeded but unexpected response format",
          response
        );
        return false;
      } catch (err) {
        console.error("Error sending message:", err);
        if (err instanceof Error) {
          console.error("Error message:", err.message);
          console.error("Error stack:", err.stack);
        }
        toast.error("Failed to send message");
        return false;
      }
    },
    [currentUser]
  );

  useEffect(() => {
    if (currentUser) {
      fetchChats();
    }
  }, [currentUser, fetchChats]);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribe = onNewMessage((data) => {
      setChats((prev) => {
        const idx = prev.findIndex((c) => c.roomId === data.roomId);
        if (idx === -1) return prev;
        const prevChat = prev[idx];
        const incomingLast = {
          id: data._id,
          text: data.message || "",
          messageType: (data.messageType === "audio"
            ? "voice"
            : data.messageType) as "text" | "image" | "voice",
          senderId: data.sender,
          timestamp: new Date((data.createdAt as unknown as string | number | Date) ?? Date.now()),
          isOwn: data.sender === currentUser.id,
          status: "delivered" as const,
          mediaUrl: data.image?.url,
        };

        const updated = {
          ...prevChat,
          lastMessage: incomingLast,
          unreadCount:
            data.sender !== currentUser.id ? prevChat.unreadCount + 1 : 0,
          updatedAt: new Date(),
        };

        const copy = prev.slice();
        copy.splice(idx, 1);
        return [updated, ...copy];
      });
    });

    return () => unsubscribe();
  }, [currentUser, onNewMessage]);

  useEffect(() => {
    if (!currentUser) return;
    setChats((prev) =>
      prev.map((chat) => ({
        ...chat,
        participants: chat.participants.map((p) => ({
          ...p,
          isOnline: p.id === currentUser.id ? true : onlineUsers.includes(p.id),
        })),
      }))
    );
  }, [onlineUsers, currentUser]);

  useEffect(() => {
    const unsubscribe = onOnlineUsers(() => {
      setChats((prev) =>
        prev.map((chat) => ({
          ...chat,
          participants: chat.participants.map((p) => ({
            ...p,
            isOnline:
              p.id === currentUser?.id ? true : onlineUsers.includes(p.id),
          })),
        }))
      );
    });
    return () => unsubscribe();
  }, [onOnlineUsers, onlineUsers, currentUser]);

  useEffect(() => {
    const handler = (evt: Event) => {
      const anyEvt = evt as CustomEvent<{ roomId: string }>;
      const rid = anyEvt?.detail?.roomId;
      if (!rid) return;
      setChats((prev) => {
        const idx = prev.findIndex((c) => c.roomId === rid);
        if (idx === -1) return prev;
        const updated = { ...prev[idx], unreadCount: 0 };
        const copy = prev.slice();
        copy[idx] = updated;
        return copy;
      });
    };
    window.addEventListener("chat:markRead", handler as EventListener);
    return () =>
      window.removeEventListener("chat:markRead", handler as EventListener);
  }, []);

  return {
    chats,
    loading,
    error,
    currentUser,
    fetchChats,
    fetchMessages,
    fetchRoomWithMessages,
    sendMessage,
    createOrGetChatRoom,
    refreshChats: fetchChats,
    markChatAsReadLocal,
  };
};

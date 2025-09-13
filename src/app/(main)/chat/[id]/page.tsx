"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useSocket, MessageData } from "@/context/SocketContext";
import {
  useTypingIndicator,
  useOnlineStatus,
} from "@/hooks/useChat";
import { useChatData } from "@/hooks/useChatData";
import ChatHeader from "../_components/ChatHeader";
import MessageList from "../_components/MessageList";
import MessageInput from "../_components/MessageInput";
import ConnectionStatus from "@/components/ConnectionStatus";
import { Message, ChatUser } from "../types";
import { Loader2 } from "lucide-react";

const ChatPage: React.FC = () => {
  const params = useParams();
  const { user } = useAuth();
  const { isConnected, onNewMessage, joinRoom, leaveRoom } = useSocket();
  const {
    fetchRoomWithMessages,
    sendMessage: sendApiMessage,
    chats,
  } = useChatData();

  const [message, setMessage] = useState("");
  const [chatUser, setChatUser] = useState<ChatUser | null>(null);
  const [showMobileBack, setShowMobileBack] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  const roomId = params.id as string;

  const { typingUsers, handleTyping, handleStopTyping } = useTypingIndicator(
    roomId || ""
  );
  const { onlineUsers } = useOnlineStatus();

  useEffect(() => {
    const loadChatData = async () => {
      if (!roomId || !user) return;

      setLoading(true);
      try {
        if (joinRoom) {
          joinRoom(roomId);
        }

        const { messages: roomMessages, user: roomUser } =
          await fetchRoomWithMessages(roomId);
        setMessages(roomMessages);

        if (roomUser) {
          setChatUser({
            ...roomUser,
            isOnline: onlineUsers.includes(roomUser.id),
          });
        } else {
          const currentChat = chats.find((chat) => chat.roomId === roomId);
          if (currentChat) {
            const otherUser = currentChat.participants.find(
              (p) => p.id !== user._id
            );
            if (otherUser) {
              setChatUser({
                ...otherUser,
                isOnline: onlineUsers.includes(otherUser.id),
              });
            }
          }
        }
      } catch (error) {
        console.error("Error loading chat data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadChatData();

    return () => {
      if (roomId && leaveRoom) {
        leaveRoom(roomId);
      }
    };
  }, [roomId, user, fetchRoomWithMessages, chats, joinRoom, leaveRoom]);

  useEffect(() => {
    if (!roomId || !user) return;

    console.log("Setting up real-time message listener for room:", roomId);

    const unsubscribe = onNewMessage((newMessageData: MessageData) => {
      console.log("Received new message via socket:", newMessageData);

      if (newMessageData.roomId === roomId) {
        const newMessage: Message = {
          id: newMessageData._id || Date.now().toString(),
          text: newMessageData.message || "",
          messageType:
            newMessageData.messageType === "audio"
              ? "voice"
              : (newMessageData.messageType as "text" | "image"),
          senderId: newMessageData.sender,
          timestamp: new Date(newMessageData.createdAt || Date.now()),
          isOwn: newMessageData.sender === user._id,
          status: "delivered",
          mediaUrl: newMessageData.image?.url,
        };

        setMessages((prev) => {
          const exists = prev.some((msg) => msg.id === newMessage.id);
          if (exists) {
            console.log("Message already exists, skipping duplicate");
            return prev;
          }
          console.log("Adding new message to state");
          return [...prev, newMessage];
        });
      }
    });

    return () => {
      console.log("Cleaning up real-time message listener");
      unsubscribe();
    };
  }, [roomId, user, onNewMessage]);

  useEffect(() => {
    if (chatUser) {
      setChatUser((prev) =>
        prev
          ? {
              ...prev,
              isOnline: onlineUsers.includes(prev.id),
            }
          : null
      );
    }
  }, [onlineUsers, chatUser?.id]);

  useEffect(() => {
    const checkMobile = () => {
      setShowMobileBack(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const handleSendMessage = async () => {
    if (!message.trim() || !user || !roomId || !isConnected) {
      return;
    }

    const messageText = message.trim();

    setMessage("");

    handleStopTyping();

    try {
      const success = await sendApiMessage(roomId, messageText, "text");

      if (!success) {
        setMessage(messageText);
        console.error("Failed to send message via API");
      }
    } catch (error) {
      console.error("Error sending message:", error);

      setMessage(messageText);
    }
  };

  const handleVoiceRecord = async (audioBlob: Blob) => {
    console.log("Voice recording received:", audioBlob);
  };

  const handleImageSelect = async (file: File) => {
    console.log("Image selected:", file);
  };

  const handleFileSelect = async (file: File) => {
    console.log("File selected:", file);
  };

  const handleBack = () => {
    window.history.back();
  };

  if (!user || loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
          <p className="text-gray-600">Loading chat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {!isConnected && (
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2">
          <ConnectionStatus />
        </div>
      )}

      <ChatHeader
        user={
          chatUser || {
            id: "unknown",
            firstName: "Loading",
            lastName: "...",
            isOnline: false,
          }
        }
        onBack={handleBack}
        showBackButton={showMobileBack}
        isConnected={isConnected}
        typingUsers={typingUsers.filter((userId) => userId !== user._id)}
        onVideoCall={() => console.log("Video call")}
        onMoreOptions={() => console.log("More options")}
      />

      <div className="flex-1 overflow-hidden">
        <MessageList
          messages={messages}
          currentUserId={user._id}
          className="h-full"
        />
      </div>

      <div className="border-t border-gray-200 bg-white p-3">
        <MessageInput
          message={message}
          onMessageChange={setMessage}
          onSendMessage={handleSendMessage}
          onVoiceRecord={handleVoiceRecord}
          onImageSelect={handleImageSelect}
          onFileSelect={handleFileSelect}
          onStartTyping={handleTyping}
          onStopTyping={handleStopTyping}
          disabled={!isConnected}
          placeholder={isConnected ? "Type a message..." : "Connecting..."}
        />
      </div>
    </div>
  );
};

export default ChatPage;

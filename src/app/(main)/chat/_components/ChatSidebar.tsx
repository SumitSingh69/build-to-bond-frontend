"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Search, MessageCircle } from "lucide-react";
import { Chat, ChatUser } from "../types";

interface ChatSidebarProps {
  chats: Chat[];
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
  currentUserId: string;
  className?: string;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  selectedChatId,
  onChatSelect,
  currentUserId,
  className = "",
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredChats = chats.filter((chat) => {
    const otherUser = chat.participants.find((p) => p.id !== currentUserId);
    const fullName =
      `${otherUser?.firstName} ${otherUser?.lastName}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase());
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return "now";
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
    }).format(date);
  };

  const getOtherUser = (chat: Chat): ChatUser | undefined => {
    return chat.participants.find((p) => p.id !== currentUserId);
  };

  return (
    <div
      className={`w-full sm:w-80 md:w-96 lg:w-[400px] border-r border-gray-200 bg-white flex flex-col h-full ${className}`}
    >
      <div className="px-3 py-2 md:p-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10 flex-shrink-0">
        <div className="relative flex-1 mr-3">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-white text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition-colors text-sm"
          />
        </div>

        <div className="flex items-center flex-shrink-0">
          <div className="flex items-center space-x-1">
            <span className="text-sm text-gray-500">{chats.length}</span>
            <MessageCircle className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredChats.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center">
            <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">
              {searchQuery ? "No conversations found" : "No messages yet"}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              {searchQuery
                ? "Try a different search term"
                : "Start a conversation to see it here"}
            </p>
          </div>
        ) : (
          filteredChats.map((chat) => {
            const otherUser = getOtherUser(chat);
            if (!otherUser) return null;

            return (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat.id)}
                className={`p-3 border-b border-gray-100 cursor-pointer transition-all duration-200 hover:bg-gray-50 relative group ${
                  selectedChatId === chat.id
                    ? "bg-primary-50 border-l-4 border-l-primary-500"
                    : ""
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="w-11 h-11 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center shadow-sm">
                      {otherUser.profilePicture ? (
                        <Image
                          src={otherUser.profilePicture}
                          alt={`${otherUser.firstName} ${otherUser.lastName}`}
                          width={44}
                          height={44}
                          className="w-11 h-11 rounded-full object-cover"
                        />
                      ) : (
                        <span className="font-semibold text-primary-700 text-sm">
                          {otherUser.firstName[0]}
                          {otherUser.lastName[0]}
                        </span>
                      )}
                    </div>
                    {otherUser.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-semibold text-gray-800 truncate text-sm">
                        {otherUser.firstName} {otherUser.lastName}
                      </h3>
                      {chat.lastMessage && (
                        <span className="text-xs text-gray-400 flex-shrink-0">
                          {formatTime(chat.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600 truncate pr-2">
                        {chat.lastMessage?.text || "No messages yet"}
                      </p>
                      {chat.unreadCount > 0 && (
                        <div className="bg-primary-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center flex-shrink-0 animate-pulse">
                          {chat.unreadCount > 9 ? "9+" : chat.unreadCount}
                        </div>
                      )}
                    </div>

                    <p className="text-xs text-gray-400 mt-0.5">
                      {otherUser.isOnline ? (
                        <span className="text-green-500">Online now</span>
                      ) : (
                        "Last seen recently"
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default ChatSidebar;

"use client";

import React from "react";
import Image from "next/image";
import { Video, MoreVertical, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatUser } from "../types";

interface ChatHeaderProps {
  user: ChatUser;
  onBack?: () => void;
  onCall?: () => void;
  onVideoCall?: () => void;
  onMoreOptions?: () => void;
  showBackButton?: boolean;
  isConnected?: boolean;
  typingUsers?: string[];
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  user,
  onBack,
  onVideoCall,
  onMoreOptions,
  showBackButton = false,
  isConnected = false,
  typingUsers = [],
}) => {
  return (
    <div className="px-3 py-2 md:p-[12.7px] border-b border-gray-200 bg-white/95 backdrop-blur-sm flex items-center justify-between sticky top-0 z-10">
      <div className="flex items-center space-x-2 md:space-x-3 flex-1 min-w-0">
        {showBackButton && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            className="md:hidden text-gray-600 hover:text-primary-600 hover:bg-primary-50 p-1.5 rounded-full flex-shrink-0"
            aria-label="Back to chat list"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        )}

        <div className="relative flex-shrink-0">
          <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center shadow-sm">
            {user.profilePicture ? (
              <Image
                src={user.profilePicture}
                alt={`${user.firstName} ${user.lastName}`}
                width={40}
                height={40}
                className="w-9 h-9 md:w-10 md:h-10 rounded-full object-cover"
              />
            ) : (
              <span className="font-semibold text-primary-700 text-xs md:text-sm">
                {user.firstName[0]}
                {user.lastName[0]}
              </span>
            )}
          </div>
          {user.isOnline && (
            <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 border-2 border-white rounded-full"></div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-gray-800 text-sm md:text-base truncate">
            {user.firstName} {user.lastName}
          </h3>
          <p className="text-xs md:text-sm text-gray-500 truncate">
            {typingUsers.length > 0 ? (
              <span className="text-blue-500">
                {typingUsers.length === 1
                  ? "Typing..."
                  : `${typingUsers.length} people typing...`}
              </span>
            ) : user.isOnline ? (
              <span className="text-green-500">
                {isConnected ? "Online now" : "Online (disconnected)"}
              </span>
            ) : (
              "Last seen recently"
            )}
          </p>
        </div>
      </div>

      <div className="flex items-center space-x-0.5 md:space-x-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onVideoCall}
          className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 p-1.5 md:p-2 rounded-full"
          aria-label="Video call"
        >
          <Video className="w-4 h-4 md:w-5 md:h-5" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={onMoreOptions}
          className="text-gray-600 hover:text-primary-600 hover:bg-primary-50 p-1.5 md:p-2 rounded-full"
          aria-label="More options"
        >
          <MoreVertical className="w-4 h-4 md:w-5 md:h-5" />
        </Button>
      </div>
    </div>
  );
};

export default ChatHeader;

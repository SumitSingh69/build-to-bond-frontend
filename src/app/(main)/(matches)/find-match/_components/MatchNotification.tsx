"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Heart, MessageCircle, X } from 'lucide-react';
import { MatchUser } from '../types';

interface MatchNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  matchedUser?: MatchUser | null;
  onSendMessage?: () => void;
  onKeepSwiping?: () => void;
}

export const MatchNotification: React.FC<MatchNotificationProps> = ({
  isOpen,
  onClose,
  matchedUser,
  onSendMessage,
  onKeepSwiping
}) => {
  if (!matchedUser) return null;

  const initials = `${matchedUser.firstName[0]}${matchedUser.lastName[0]}`.toUpperCase();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-pink-600">
            🎉 It&apos;s a Match!
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center space-y-6 py-6">
          {/* Match Animation */}
          <div className="relative">
            <div className="absolute inset-0 animate-ping">
              <div className="w-32 h-32 rounded-full border-4 border-pink-500 opacity-20"></div>
            </div>
            <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
              <AvatarImage
                src={matchedUser.profilePicture || matchedUser.avatar}
                alt={`${matchedUser.firstName} ${matchedUser.lastName}`}
              />
              <AvatarFallback className="bg-gradient-to-br from-pink-100 to-violet-200 text-gray-600 text-2xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            
            {/* Heart icon overlay */}
            <div className="absolute -top-2 -right-2 bg-pink-500 rounded-full p-2 shadow-lg animate-bounce">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
          </div>

          {/* User Info */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              {matchedUser.firstName} {matchedUser.lastName}
            </h3>
            {matchedUser.location?.city && (
              <p className="text-gray-600 text-sm">
                {matchedUser.location.city}
                {matchedUser.location.country && `, ${matchedUser.location.country}`}
              </p>
            )}
          </div>

          {/* Message */}
          <div className="text-center px-4">
            <p className="text-gray-700">
              You and {matchedUser.firstName} have liked each other!
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Start a conversation and get to know each other better.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col w-full space-y-3 px-4">
            <Button
              onClick={onSendMessage}
              className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-semibold py-3"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Send Message
            </Button>
            
            <Button
              variant="outline"
              onClick={onKeepSwiping}
              className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 py-3"
            >
              Keep Swiping
            </Button>
          </div>
        </div>

        {/* Close button */}
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-4 right-4 h-8 w-8 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </DialogContent>
    </Dialog>
  );
};
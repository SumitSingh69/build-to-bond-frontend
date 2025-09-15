"use client";

import React from "react";
import { Heart, X, MapPin, Briefcase, GraduationCap, Star } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MatchCardProps } from "../types";
import BioDisplay from "@/components/BioDisplay";


const MatchCard: React.FC<MatchCardProps> = ({
  user,
  onLike,
  onPass,
  onUserClick,
  className,
}) => {
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const displayLocation =
    user.location?.city && user.location?.country
      ? `${user.location.city}, ${user.location.country}`
      : user.location?.city || user.location?.country || "";

  const handleLike = () => {
    onLike?.(user._id);
  };

  const handlePass = () => {
    onPass?.(user._id);
  };

  const handleCardClick = () => {
    onUserClick?.(user._id);
  };

  const handleButtonClick = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  return (
    <div
      className={cn(
        "bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden",
        "transition-all duration-300 hover:shadow-xl hover:-translate-y-1",
        "cursor-pointer",
        className
      )}
      onClick={handleCardClick}
    >
      <div className="relative h-64">
        <Avatar className="w-full h-full rounded-none">
          <AvatarImage
            src={user.profilePicture || user.avatar}
            alt={`${user.firstName} ${user.lastName}`}
            className="object-cover"
          />
          <AvatarFallback className="w-full h-full rounded-none bg-gradient-to-br from-pink-100 to-rose-200 text-gray-600 text-4xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        {user.compatibility && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              {user.compatibility}% Match
            </Badge>
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xl font-bold text-primary">
            {user.firstName} {user.lastName}, {user.age}
          </h3>
        </div>

        {displayLocation && (
          <div className="flex items-center gap-1 text-gray-600 mb-3">
            <MapPin className="w-4 h-4 text-primary" />
            <span className="text-sm">{displayLocation}</span>
          </div>
        )}

        {user.occupation && (
          <div className="flex items-center gap-1 text-gray-600 mb-3">
            <Briefcase className="w-4 h-4 text-primary" />
            <span className="text-sm">{user.occupation}</span>
          </div>
        )}

        {user.education && (
          <div className="flex items-center gap-1 text-gray-600 mb-3">
            <GraduationCap className="w-4 h-4 text-primary" />
            <span className="text-sm capitalize">
              {user.education.replace("_", " ")}
            </span>
          </div>
        )}

        <BioDisplay 
          text={user.bio} 
          className="text-gray-700 text-sm mb-4"
        />

        {user.interests && user.interests.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 ">
              {user.interests.slice(0, 3).map((interest, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs text-primary bg-primary-100 border-gray-200 hover:bg-primary hover:text-primary-100"
                >
                  {interest}
                </Badge>
              ))}
              {user.interests.length > 3 && (
                <Badge
                  variant="outline"
                  className="text-xs text-primary bg-primary-100 border-gray-200 hover:bg-primary hover:text-primary-100"
                >
                  +{user.interests.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-3 mt-6">
          <Button
            variant="outline"
            size="lg"
            onClick={(e) => handleButtonClick(e, handlePass)}
            className="flex-1 border-gray-300 text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors"
          >
            <X className="w-5 h-5 mr-2" />
            Pass
          </Button>
          <Button
            size="lg"
            onClick={(e) => handleButtonClick(e, handleLike)}
            className="flex-1 bg-rose-500 hover:bg-rose-600 text-white shadow-md hover:shadow-lg transition-all"
          >
            <Heart className="w-5 h-5 mr-2" />
            Like
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;

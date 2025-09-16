"use client";

import React, { useState } from "react";
import { Heart, X, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { MatchCardProps } from "../types";
import BioDisplay from "@/components/BioDisplay";
import { useLike } from "@/hooks/useLike";
import { toast } from "sonner";


const MatchCard: React.FC<MatchCardProps> = ({
  user,
  onLike,
  onPass,
  onUserClick,
  className,
}) => {
  const [isPassing, setIsPassing] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { likeUser, loading: isLiking } = useLike();
  
  const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
  const displayLocation =
    user.location?.city && user.location?.country
      ? `${user.location.city}, ${user.location.country}`
      : user.location?.city || user.location?.country || "";

  // Helper function to get avatar URL with Dicebear fallback
  const getAvatarUrl = () => {
    // Check for profile picture
    if (user.profilePicture && user.profilePicture.trim()) {
      return user.profilePicture;
    }
    
    // Check for avatar field
    if (user.avatar && user.avatar.trim()) {
      return user.avatar;
    }
    
    // Fallback to Dicebear avatar using name as seed
    const seed = `${user.firstName}-${user.lastName}` || user._id || 'user';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  };

  const handleLike = async () => {
    if (isLiking || isLiked) return;
    
    console.log("Attempting to like user:", user._id);
    
    try {
      const result = await likeUser(user._id);
      console.log("Like result:", result);
      
      if (result?.success) {
        setIsLiked(true);
        console.log("Successfully liked user, updating UI state");
        
        // Call the original onLike callback if provided
        onLike?.(user._id);
      } else {
        console.log("Like operation failed or returned false");
      }
    } catch (error) {
      console.error("Failed to like user:", error);
    }
  };

  const handlePass = async () => {
    if (isPassing) return;
    
    setIsPassing(true);
    try {
      // For now, we'll just call the original onPass callback
      toast.info("👋 Passed", {
        description: "You passed on this user.",
        duration: 2000,
      });
      
      onPass?.(user._id);
    } catch (error) {
      console.error("Failed to pass user:", error);
      toast.error("Failed to pass user", {
        description: "Please try again later.",
        duration: 4000,
      });
    } finally {
      setIsPassing(false);
    }
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
            src={getAvatarUrl()}
            alt={`${user.firstName} ${user.lastName}`}
            className="object-cover"
            onError={(e) => {
              // If image fails to load, fallback to Dicebear
              const target = e.target as HTMLImageElement;
              const seed = `${user.firstName}-${user.lastName}` || user._id || 'user';
              target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
            }}
          />
          <AvatarFallback className="w-full h-full rounded-none bg-gradient-to-br from-pink-100 to-rose-200 text-gray-600 text-4xl font-bold">
            {initials}
          </AvatarFallback>
        </Avatar>

        {/* {user.compatibility && (
          <div className="absolute top-4 right-4">
            <Badge className="bg-green-100 text-green-700 border-green-200 flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              {user.compatibility}% Match
            </Badge>
          </div>
        )} */}
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
            disabled={isPassing}
            className="flex-1 border-gray-300 text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-50"
          >
            <X className="w-5 h-5 mr-2" />
            {isPassing ? "Passing..." : "Pass"}
          </Button>
          <Button
            size="lg"
            onClick={(e) => handleButtonClick(e, handleLike)}
            disabled={isLiking || isLiked}
            className={cn(
              "flex-1 shadow-md hover:shadow-lg transition-all disabled:opacity-50",
              isLiked 
                ? "bg-green-500 hover:bg-green-600 text-white" 
                : "bg-rose-500 hover:bg-rose-600 text-white"
            )}
          >
            <Heart className={cn("w-5 h-5 mr-2", isLiked && "fill-current")} />
            {isLiking ? "Liking..." : isLiked ? "Liked!" : "Like"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchCard;

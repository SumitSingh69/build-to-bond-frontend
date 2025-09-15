import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Briefcase, GraduationCap, Heart, X } from "lucide-react";
import { MatchUser } from "../types";
import BioDisplay from "@/components/BioDisplay";
import { cn } from "@/lib/utils";

interface RecommendedCarouselProps {
  recommendedUsers: MatchUser[];
  onUserClick: (userId: string) => void;
  onLike: (userId: string) => void;
  onPass: (userId: string) => void;
}

export const RecommendedCarousel: React.FC<RecommendedCarouselProps> = ({
  recommendedUsers,
  onUserClick,
  onLike,
  onPass,
}) => {
  if (!recommendedUsers || recommendedUsers.length === 0) {
    return null;
  }

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 bg-gradient-to-r from-pink-500 to-violet-500 rounded-full"></div>
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          ✨ AI Recommended For You
        </h2>
        <Badge variant="secondary" className="text-xs">
          {recommendedUsers.length} matches
        </Badge>
      </div>
      
      <div className="overflow-x-auto">
        <div className="flex gap-4 pb-4" style={{ width: "max-content" }}>
          {recommendedUsers.map((user) => {
            const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
            const displayLocation = user.location?.city && user.location?.country
              ? `${user.location.city}, ${user.location.country}`
              : user.location?.city || user.location?.country || "";

            return (
              <Card
                key={user._id}
                className={cn(
                  "flex-shrink-0 w-80 bg-white rounded-2xl shadow-lg border-2 border-gradient-to-r from-pink-500 to-violet-500",
                  "transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer overflow-hidden"
                )}
                onClick={() => onUserClick(user._id)}
              >
                <CardContent className="p-0">
                  {/* Profile Image Section */}
                  <div className="relative h-64">
                    <Avatar className="w-full h-full rounded-none">
                      <AvatarImage
                        src={user.profilePicture || user.avatar}
                        alt={`${user.firstName} ${user.lastName}`}
                        className="object-cover"
                      />
                      <AvatarFallback className="w-full h-full rounded-none bg-gradient-to-br from-pink-100 to-violet-200 text-gray-600 text-4xl font-bold">
                        {initials}
                      </AvatarFallback>
                    </Avatar>

{/*                     
                    {user.compatibility && (
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
                        <div className="flex flex-wrap gap-2">
                          {user.interests.slice(0, 3).map((interest: string, index: number) => (
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

                    {/* Full Action Buttons */}
                    <div className="flex gap-3 mt-6">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          onPass(user._id);
                        }}
                        className="flex-1 border-gray-300 text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600 transition-colors"
                      >
                        <X className="w-5 h-5 mr-2" />
                        Pass
                      </Button>
                      <Button
                        size="lg"
                        onClick={(e) => {
                          e.stopPropagation();
                          onLike(user._id);
                        }}
                        className="flex-1 bg-rose-500 hover:bg-rose-600 text-white shadow-md hover:shadow-lg transition-all"
                      >
                        <Heart className="w-5 h-5 mr-2" />
                        Like
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};
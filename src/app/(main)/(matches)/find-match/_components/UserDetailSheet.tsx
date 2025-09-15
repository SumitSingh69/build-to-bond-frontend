"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  Briefcase,
  GraduationCap,
  Heart,
  MessageCircle,
  Users,
  Star,
  X,
  Loader2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";
import { useChatData } from "@/hooks/useChatData";

interface UserDetailResponse {
  success: boolean;
  message: string;
  data: UserDetail;
}

interface UserDetail {
  _id: string;
  firstName: string;
  lastName: string;
  dob?: string;
  age?: number;
  profilePicture?: string;
  avatar?: string;
  bio?: string;
  location?: {
    city?: string;
    country?: string;
    state?: string;
  };
  occupation?: string;
  education?: string;
  interests?: string[];
  compatibility?: number;
  distance?: number;
  height?: number;
  relationshipGoals?: string;
  lookingFor?: string;
  smoking?: string;
  drinking?: string;
  relationshipStatus?: string;
  children?: string;
  languages?: string[];
  jobTitle?: string;
  company?: string;
  school?: string;
  verified?: boolean;
  isVerified?: boolean;
  profileCompleteness?: number;
  gender?: string;
  genderPreference?: string;
}

interface UserDetailSheetProps {
  userId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onLike?: (userId: string) => void;
  onPass?: (userId: string) => void;
}

export const UserDetailSheet: React.FC<UserDetailSheetProps> = ({
  userId,
  isOpen,
  onClose,
  onLike,
  onPass,
}) => {
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [startingChat, setStartingChat] = useState(false);
  const router = useRouter();
  const { createOrGetChatRoom } = useChatData();

  const fetchUserDetails = useCallback(async () => {
    if (!userId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await apiRequest<UserDetailResponse>(
        `/users/${userId}`,
        {
          method: "GET",
        }
      );

      if (response.success) {
        setUser(response.data);
      } else {
        setError(response.message || "Failed to fetch user details");
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
      setError("Failed to load user details");
      toast.error("Failed to load user details");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId && isOpen) {
      fetchUserDetails();
    }
  }, [userId, isOpen, fetchUserDetails]);

  const handleStartChat = async () => {
    if (!user) return;

    setStartingChat(true);
    try {
      const roomId = await createOrGetChatRoom(user._id);

      if (roomId) {
        router.push(`/chat/${roomId}`);
        onClose();
      } else {
        console.error("No room ID received");
        toast.error("Failed to start chat. Please try again.");
      }
    } catch (error) {
      console.error("Error starting chat:", error);
      toast.error("Failed to start chat. Please try again.");
    } finally {
      setStartingChat(false);
    }
  };

  const handleLike = () => {
    if (user && onLike) {
      onLike(user._id);
      onClose();
    }
  };

  const handlePass = () => {
    if (user && onPass) {
      onPass(user._id);
      onClose();
    }
  };

  const calculateAge = (dob: string): number => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

  const initials = user
    ? `${user.firstName[0]}${user.lastName[0]}`.toUpperCase()
    : "";
  const displayLocation = user?.location
    ? [user.location.city, user.location.state, user.location.country]
        .filter(Boolean)
        .join(", ")
    : "";

  const compatibilityColor = user?.compatibility
    ? user.compatibility >= 80
      ? "text-green-600"
      : user.compatibility >= 60
      ? "text-yellow-600"
      : "text-red-600"
    : "text-gray-600";

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 overflow-y-auto"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>
            {user
              ? `${user.firstName} ${user.lastName} Profile`
              : "User Profile"}
          </SheetTitle>
        </SheetHeader>
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary-600" />
              <p className="text-gray-600">Loading user details...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center p-6">
              <X className="w-12 h-12 mx-auto mb-4 text-red-500" />
              <p className="text-gray-600 mb-4">{error}</p>
              <Button onClick={fetchUserDetails} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        ) : user ? (
          <div className="flex flex-col">
            <div className="relative">
              <div className="h-80 bg-gradient-to-b from-primary-100 to-primary-200">
                <Avatar className="w-full h-full rounded-none">
                  <AvatarImage
                    src={user.profilePicture || user.avatar}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="object-contain"
                  />
                  <AvatarFallback className="w-full h-full rounded-none bg-gradient-to-br from-pink-100 to-rose-200 text-gray-600 text-6xl font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                <div className="text-white">
                  <h1 className="text-3xl font-bold mb-1">
                    {user.firstName} {user.lastName}
                  </h1>
                  <p className="text-lg opacity-90 mb-2">
                    {user.dob ? calculateAge(user.dob) : user.age || "N/A"}{" "}
                    years old
                  </p>
                  {displayLocation && (
                    <div className="flex items-center text-sm opacity-80">
                      <MapPin className="w-4 h-4 mr-1" />
                      {displayLocation}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {user.compatibility && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      Compatibility
                    </span>
                    <div className="flex items-center">
                      <Star
                        className={cn("w-4 h-4 mr-1", compatibilityColor)}
                      />
                      <span className={cn("font-bold", compatibilityColor)}>
                        {user.compatibility}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {user.bio && (
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-gray-800">
                    About
                  </h3>
                  <p className="text-gray-600 leading-relaxed">{user.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                {user.occupation && (
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {user.occupation}
                    </span>
                  </div>
                )}
                {user.education && (
                  <div className="flex items-center space-x-2">
                    <GraduationCap className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {user.education}
                    </span>
                  </div>
                )}
                {user.height && (
                  <div className="flex items-center space-x-2">
                    <Users className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {user.height} cm
                    </span>
                  </div>
                )}
                {user.distance && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="text-sm text-gray-600">
                      {user.distance} km away
                    </span>
                  </div>
                )}
              </div>

              {user.interests && user.interests.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-primary-100 text-primary-700 hover:bg-primary-200"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {user.lookingFor && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Looking For
                  </h3>
                  <div className="bg-blue-50 rounded-lg p-3">
                    <span className="text-blue-700 font-medium capitalize">
                      {user.lookingFor}
                    </span>
                  </div>
                </div>
              )}

              {/* Profile Completeness */}
              {/* {user.profileCompleteness && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Profile Completeness
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600">Progress</span>
                      <span className="font-semibold text-primary-600">
                        {user.profileCompleteness}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${user.profileCompleteness}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              )} */}

              {(user.smoking ||
                user.drinking ||
                user.relationshipStatus ||
                user.children) && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Lifestyle
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {user.smoking && (
                      <div className="text-sm">
                        <span className="text-gray-500">Smoking:</span>
                        <span className="ml-1 text-gray-700 capitalize">
                          {user.smoking}
                        </span>
                      </div>
                    )}
                    {user.drinking && (
                      <div className="text-sm">
                        <span className="text-gray-500">Drinking:</span>
                        <span className="ml-1 text-gray-700 capitalize">
                          {user.drinking}
                        </span>
                      </div>
                    )}
                    {user.relationshipStatus && (
                      <div className="text-sm">
                        <span className="text-gray-500">Status:</span>
                        <span className="ml-1 text-gray-700 capitalize">
                          {user.relationshipStatus}
                        </span>
                      </div>
                    )}
                    {user.children && (
                      <div className="text-sm">
                        <span className="text-gray-500">Children:</span>
                        <span className="ml-1 text-gray-700 capitalize">
                          {user.children.replace("_", " ")}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {user.languages && user.languages.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-gray-800">
                    Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.languages.map((language, index) => (
                      <Badge key={index} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <Separator />

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handlePass}
                  className="flex-1 border-gray-300 text-gray-600 hover:border-red-300 hover:bg-red-50 hover:text-red-600"
                >
                  <X className="w-5 h-5 mr-2" />
                  Pass
                </Button>
                <Button
                  size="lg"
                  onClick={handleLike}
                  className="flex-1 bg-rose-500 hover:bg-rose-600 text-white"
                >
                  <Heart className="w-5 h-5 mr-2" />
                  Like
                </Button>
              </div>

              <Button
                size="lg"
                onClick={handleStartChat}
                disabled={startingChat}
                className="w-full bg-primary-600 hover:bg-primary-700 text-white disabled:opacity-50"
              >
                {startingChat ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Starting Chat...
                  </>
                ) : (
                  <>
                    <MessageCircle className="w-5 h-5 mr-2" />
                    Start Chat
                  </>
                )}
              </Button>
            </div>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
};

export default UserDetailSheet;

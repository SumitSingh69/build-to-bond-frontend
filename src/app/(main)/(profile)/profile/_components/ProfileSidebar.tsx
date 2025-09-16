import React, { useState } from "react";
import Image from "next/image";
import { Edit, Camera } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User } from "@/types/auth.types";
import BioDisplay from "@/components/BioDisplay";
import { toast } from "sonner";

interface ProfileSidebarProps {
  profile: User | null;
  onEdit?: () => void;
  onProfilePictureChange?: (file: File) => Promise<void>;
  onRefresh?: () => void;
  isLoading?: boolean;
}

export default function ProfileSidebar({
  profile,
  onEdit,
  onProfilePictureChange,
  onRefresh,
  isLoading = false,
}: ProfileSidebarProps) {
  const [isUploading, setIsUploading] = useState(false);

  // Helper function to get avatar URL with fallback
  const getAvatarUrl = (profile: User) => {
    // First check if there's a profile picture in DB
    const profilePictureUrl = typeof profile.profilePicture === 'string' 
      ? profile.profilePicture 
      : profile.profilePicture?.url;
    
    if (profilePictureUrl && profilePictureUrl.trim()) {
      return profilePictureUrl;
    }
    
    // Fallback to avatar field if exists
    if (profile.avatar && profile.avatar.trim()) {
      return profile.avatar;
    }
    
    // Generate Dicebear avatar using email as seed
    const seed = profile.email || `${profile.firstName}-${profile.lastName}` || 'user';
    return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid file type. Please select a JPEG, PNG, or WebP image.');
      return;
    }

    // Validate file size (5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error('File size too large. Maximum size is 5MB.');
      return;
    }

    if (onProfilePictureChange) {
      setIsUploading(true);
      try {
        await onProfilePictureChange(file);
      } finally {
        setIsUploading(false);
        // Clear the input so same file can be selected again
        event.target.value = '';
      }
    }
  };

  if (!profile) return null;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const capitalizeFirst = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  return (
    <Card className="w-full lg:w-72 flex-shrink-0 lg:sticky lg:top-16 h-fit max-h-[calc(100vh-3rem)] overflow-y-auto scrollbar-hide">
      <CardContent className="p-4 lg:p-4">
        <div className="flex flex-col items-center mb-4 lg:mb-6">
          <div className="relative group">
            <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-full border-4 border-primary-100 shadow-lg overflow-hidden bg-gradient-to-br from-primary-200 to-primary-300 flex items-center justify-center">
              <Image
                src={getAvatarUrl(profile)}
                alt={
                  `${profile.firstName || ""} ${
                    profile.lastName || ""
                  }`.trim() || "Profile picture"
                }
                width={128}
                height={128}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  // If image fails to load, fallback to Dicebear
                  const target = e.target as HTMLImageElement;
                  const seed = profile.email || `${profile.firstName}-${profile.lastName}` || 'user';
                  target.src = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(seed)}`;
                }}
              />
            </div>

            <label
              htmlFor="profile-picture-upload"
              className={`absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity ${
                isUploading || isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              {isUploading ? (
                <div className="w-6 h-6 lg:w-8 lg:h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Camera className="w-6 h-6 lg:w-8 lg:h-8 text-white" />
              )}
            </label>

            <input
              id="profile-picture-upload"
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              className="hidden"
              onChange={handleFileChange}
              disabled={isUploading || isLoading}
            />
          </div>

          <h2 className="text-lg lg:text-xl font-bold text-gray-800 mt-3 lg:mt-4 text-center">
            {`${profile.firstName || ""} ${profile.lastName || ""}`.trim() ||
              "No name"}
          </h2>
          
          {/* Upload hint */}
          <p className="text-xs text-gray-400 text-center mt-1">
            {isUploading ? "Uploading..." : "Click photo to change"}
          </p>
        </div>

        <div className="space-y-3 lg:space-y-4">
          <div className="grid grid-cols-2 gap-3 lg:gap-4">
            <div>
              <label className="text-xs lg:text-sm font-medium text-gray-400">
                Age
              </label>
              <p className="text-base lg:text-md font-semibold text-gray-800">
                {profile.dob
                  ? new Date().getFullYear() -
                    new Date(profile.dob).getFullYear()
                  : 0}
              </p>
            </div>
            <div>
              <label className="text-xs lg:text-sm font-medium text-gray-400">
                Gender
              </label>
              <p className="text-base lg:text-md font-semibold text-gray-800">
                {capitalizeFirst(profile.gender || "other")}
              </p>
            </div>
          </div>

          <div>
            <label className="text-xs lg:text-sm font-medium text-gray-400">
              Preference
            </label>
            <p className="text-base lg:text-md font-semibold text-gray-800">
              {capitalizeFirst(profile.genderPreference || "any")}
            </p>
          </div>

          <div>
            <label className="text-xs lg:text-sm font-medium text-gray-400">
              Bio
            </label>
            <BioDisplay
              text={profile.bio}
              className="text-xs lg:text-sm text-gray-700 leading-relaxed"
            />
          </div>

          <div className="pt-3 lg:pt-4 border-t border-gray-200">
            <div className="grid grid-cols-2 gap-3 lg:gap-4 text-center">
              <div className="bg-primary-50 rounded-lg p-2 lg:p-3">
                <p className="text-xl lg:text-2xl font-bold text-primary-400">
                  {profile.matches?.length || 0}
                </p>
                <p className="text-xs text-gray-400">Matches</p>
              </div>
              <div className="bg-pink-50 rounded-lg p-2 lg:p-3">
                <p className="text-xl lg:text-2xl font-bold text-pink-400">
                  {profile.likes?.length || 0}
                </p>
                <p className="text-xs text-gray-400">Likes</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Button
              onClick={onEdit}
              className="w-full bg-primary-400 text-white hover:bg-primary-700"
              size="sm"
              disabled={isLoading}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>

            {onRefresh && (
              <Button
                onClick={onRefresh}
                variant="outline"
                className="w-full"
                size="sm"
                disabled={isLoading}
              >
                {isLoading ? "Refreshing..." : "Refresh Profile"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

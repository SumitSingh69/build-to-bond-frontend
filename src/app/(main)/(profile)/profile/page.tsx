"use client";

import React, {
  Suspense,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Skeleton } from "@/components/ui/skeleton";
import ClientOnly from "@/components/ClientOnly";
import ProfileSidebar from "./_components/ProfileSidebar";
import ProfileDetailsForm from "./_components/ProfileDetailsForm";
import NotificationsPanel from "./_components/NotificationsPanel";
import FloatingNotification from "./_components/FloatingNotification";
import EditProfileSheet from "./_components/Edit/EditProfileSheet";
import ProfileLoading from "./loading";
import { NotificationItem } from "./types";
import { useAuth } from "@/context/AuthContext";
import { User } from "@/types/auth.types";
import { apiRequest } from "@/lib/api";
import apiModule from "@/lib/api";
import { useNotifications } from "@/hooks/useNotifications";
import { toast } from "sonner";
import { handleProfileUpdateFlow } from "@/lib/profile-utils";
//import SystemAnnouncementTest from "./_components/SystemAnnouncementTest";

function ProfilePageContent() {
  const { user, updateProfile: updateAuthProfile, loading } = useAuth();
  const {
    notifications,
    markAsRead,
  } = useNotifications({ autoRefresh: true });
  
  const [isLoading, setIsLoading] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const hasRefreshed = useRef(false);

  useEffect(() => {
    if (user && !loading) {
      setDataLoaded(true);
    }
  }, [user, loading]);

  const handleRefreshProfile = useCallback(
    async (silent = false) => {
      if (!user) return;

      setIsLoading(true);
      try {
        const response = await apiRequest<{
          success: boolean;
          data: { user: User };
        }>("/users/refresh", {
          method: "GET",
        });

        if (response.success) {
          updateAuthProfile(response.data.user);

          if (typeof window !== "undefined") {
            localStorage.setItem("user", JSON.stringify(response.data.user));
          }

          if (!silent) {
            toast.success("Profile refreshed successfully!");
          }
        }
      } catch (error) {
        console.error("Profile refresh error:", error);
        if (!silent) {
          toast.error(
            error instanceof Error ? error.message : "Failed to refresh profile"
          );
        }
      } finally {
        setIsLoading(false);
      }
    },
    [user, updateAuthProfile]
  );

  useEffect(() => {
    if (user && !loading && dataLoaded && !hasRefreshed.current) {
      hasRefreshed.current = true;
      handleRefreshProfile(true);
    }
  }, [user, loading, dataLoaded, handleRefreshProfile]);

  const handleProfileSave = async (
    updatedData: Partial<User>,
    profilePicture?: File | null
  ) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Clean up social links - remove empty strings
      const cleanedSocialLinks = updatedData.socialLinks ? {
        ...Object.fromEntries(
          Object.entries(updatedData.socialLinks).filter(([, value]) => 
            value && typeof value === 'string' && value.trim() !== ""
          )
        )
      } : undefined;

      // Clean up location - remove empty strings but preserve non-string values
      const cleanedLocation = updatedData.location ? {
        ...Object.fromEntries(
          Object.entries(updatedData.location).filter(([, value]) => {
            if (typeof value === 'string') {
              return value.trim() !== "";
            }
            return value !== null && value !== undefined;
          })
        )
      } : undefined;

      const updatePayload: Partial<User> = {
        ...updatedData,
        socialLinks: cleanedSocialLinks,
        location: cleanedLocation,
        matches: undefined,
        likes: undefined,
        crushes: undefined,
        passedBy: undefined,
      };

      // Debug log to see the cleaned payload
      console.log("Cleaned payload:", JSON.stringify(updatePayload, null, 2));

      let response: {
        success: boolean;
        data?: { user: User };
        error?: boolean;
        errorCode?: string;
        errors?: Array<{ field: string; message: string }>;
        message?: string;
      };

      if (profilePicture) {
        response = (await apiModule.authAPI.updateProfile(
          updatePayload
        )) as {
          success: boolean;
          data?: { user: User };
          error?: boolean;
          errorCode?: string;
          errors?: Array<{ field: string; message: string }>;
          message?: string;
        };
      } else {
        response = await apiRequest<{
          success: boolean;
          data?: { user: User };
          error?: boolean;
          errorCode?: string;
          errors?: Array<{ field: string; message: string }>;
          message?: string;
        }>("/users/profile", {
          method: "PUT",
          body: JSON.stringify(updatePayload),
        });
      }

      if (response.errorCode === "VALIDATION_ERROR" && response.errors) {
        const fieldErrors = response.errors
          .map(
            (err: { field: string; message: string }) =>
              `${err.field.charAt(0).toUpperCase() + err.field.slice(1)}: ${
                err.message
              }`
          )
          .join("\n");

        toast.error(`Please fix the following errors:\n${fieldErrors}`);
        return;
      }

      await handleProfileUpdateFlow(
        response,
        updateAuthProfile,
        "Profile updated successfully!"
      );
    } catch (error) {
      console.error("Profile update error:", error);
      
      // Handle validation errors specifically
      if (error instanceof Error && error.message.includes("Invalid profile data")) {
        toast.error("Please check your profile data - some fields may contain invalid information. Make sure social media URLs are valid or leave them empty.");
      } else {
        toast.error(
          error instanceof Error ? error.message : "Failed to update profile"
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfileEdit = () => {
    setIsEditModalOpen(true);
  };

  const handleProfilePictureChange = async (file: File) => {
    if (!user) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error(
        "Invalid file type. Please select a JPEG, PNG, or WebP image."
      );
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File size too large. Maximum size is 5MB.");
      return;
    }

    setIsLoading(true);
    try {
      // Call the actual upload API
      const response = await apiModule.authAPI.uploadProfilePicture(file) as {
        success: boolean;
        data?: { user: User };
        error?: boolean;
        errorCode?: string;
        errors?: Array<{ field: string; message: string }>;
        message?: string;
      };

      await handleProfileUpdateFlow(
        response,
        updateAuthProfile,
        "Profile picture updated successfully!"
      );
    } catch (error) {
      console.error("Profile picture update error:", error);
      
      // Provide user-friendly error messages
      let errorMessage = "Failed to update profile picture";
      
      if (error instanceof Error) {
        const message = error.message.toLowerCase();
        
        if (message.includes("no image file") || message.includes("no file")) {
          errorMessage = "Please select an image file to upload";
        } else if (message.includes("file size") || message.includes("too large")) {
          errorMessage = "File size too large. Maximum size is 5MB";
        } else if (message.includes("invalid file type") || message.includes("format")) {
          errorMessage = "Invalid file type. Please select a JPEG, PNG, or WebP image";
        } else if (message.includes("cloud_name") || message.includes("cloudinary")) {
          errorMessage = "Image upload service temporarily unavailable. Please try again later";
        } else if (message.includes("network") || message.includes("fetch")) {
          errorMessage = "Network error. Please check your connection and try again";
        } else if (message.includes("unauthorized") || message.includes("authentication")) {
          errorMessage = "Session expired. Please log in again";
          // Optionally redirect to login
        } else if (error.message && error.message !== "Failed to update profile picture") {
          // Use the original error message if it's meaningful
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = (notification: NotificationItem) => {
    console.log("Notification clicked:", notification);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
      toast.error("Failed to mark notification as read");
    }
  };

  if (loading || !user || !dataLoaded) {
    return <ProfileLoading />;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-[288px_1fr_288px] gap-4">
        <div className="order-1lg:order-1 ">
          <ProfileSidebar
            profile={user}
            onEdit={handleProfileEdit}
            onProfilePictureChange={handleProfilePictureChange}
            onRefresh={handleRefreshProfile}
            isLoading={isLoading}
          />
        </div>

        <div className="order-2 lg:order-2">
          <ClientOnly
            fallback={
              <div className="space-y-4 lg:space-y-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg p-4 lg:p-6"
                  >
                    <Skeleton className="h-5 lg:h-6 w-32 lg:w-48 mb-3 lg:mb-4" />
                    <div className="space-y-3 lg:space-y-4">
                      <Skeleton className="h-8 lg:h-10 w-full" />
                      <Skeleton className="h-8 lg:h-10 w-full" />
                      <div className="grid grid-cols-2 gap-3 lg:gap-4">
                        <Skeleton className="h-8 lg:h-10" />
                        <Skeleton className="h-8 lg:h-10" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            }
          >
            <ProfileDetailsForm
              profile={user}
              onSave={handleProfileSave}
              isLoading={isLoading}
            />
          </ClientOnly>
        </div>

        <div className="order-3 hidden lg:block lg:sticky lg:top-16 h-fit">
          <ClientOnly
            fallback={
              <div className="w-full lg:w-72 p-4 lg:p-6 border border-gray-200 rounded-lg">
                <Skeleton className="h-5 lg:h-6 w-28 lg:w-32 mb-3 lg:mb-4" />
                <div className="space-y-2 lg:space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex items-start space-x-2 lg:space-x-3"
                    >
                      <Skeleton className="w-8 h-8 lg:w-10 lg:h-10 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-3 lg:h-4 w-3/4 mb-1 lg:mb-2" />
                        <Skeleton className="h-2 lg:h-3 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            }
          >
            <NotificationsPanel
              notifications={notifications}
              onNotificationClick={handleNotificationClick}
              onMarkAsRead={handleMarkAsRead}
            />
          </ClientOnly>
        </div>
      </div>

      <ClientOnly>
        <FloatingNotification
          notifications={notifications}
          onNotificationClick={handleNotificationClick}
          onMarkAsRead={handleMarkAsRead}
        />
      </ClientOnly>

      {/* Development tool for testing system notifications */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-4 left-4 z-50">
          {/* <SystemAnnouncementTest onRefreshNotifications={refreshNotifications} /> */}
        </div>
      )}

      {user && (
        <EditProfileSheet
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          user={user}
          onSave={handleProfileSave}
          isLoading={isLoading}
        />
      )}
    </>
  );
}

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<ProfileLoading />}>
        <ProfilePageContent />
      </Suspense>
    </div>
  );
}

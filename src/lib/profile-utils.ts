import { User } from "@/types/auth.types";
import apiModule from "./api";
import { toast } from "sonner";

/**
 * Handles the complete profile update flow:
 * 1. Get URL from response (already stored in database)
 * 2. Delete from local storage
 * 3. Refresh profile data from database
 * 4. Store refreshed data back to local storage
 */
export const handleProfileUpdateFlow = async (
  response: { success: boolean; data?: { user: User }; message?: string },
  updateAuthProfile: (user: User) => void,
  successMessage: string
): Promise<void> => {
  if (response.success && response.data) {
    // 1. Response contains the URL which is already stored in database
    console.log('Profile updated, URL stored in database:', response.data.user.profilePicture);
    
    // 2. Delete from local storage
    if (typeof window !== "undefined") {
      localStorage.removeItem("user");
      console.log('Cleared user data from local storage');
    }
    
    // 3. Refresh profile data from database
    try {
      const refreshResponse = await apiModule.authAPI.refreshProfile() as {
        success: boolean;
        data?: { user: User };
        message?: string;
      };
      
      if (refreshResponse.success && refreshResponse.data) {
        // 4. Store refreshed data back to local storage
        updateAuthProfile(refreshResponse.data.user);
        
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(refreshResponse.data.user));
          console.log('Stored refreshed user data back to local storage');
        }
        
        toast.success(successMessage);
      } else {
        // Fallback to original response data
        updateAuthProfile(response.data.user);
        if (typeof window !== "undefined") {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        toast.success(successMessage);
      }
    } catch (refreshError) {
      console.error("Profile refresh failed, using original response:", refreshError);
      // Fallback to original response data
      updateAuthProfile(response.data.user);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
      toast.success(successMessage);
    }
  } else {
    toast.error(response.message || "Failed to update profile");
  }
};

/**
 * Refreshes profile data from the database and updates local storage
 */
export const refreshProfileData = async (
  updateAuthProfile: (user: User) => void
): Promise<boolean> => {
  try {
    const refreshResponse = await apiModule.authAPI.refreshProfile() as {
      success: boolean;
      data?: { user: User };
      message?: string;
    };
    
    if (refreshResponse.success && refreshResponse.data) {
      updateAuthProfile(refreshResponse.data.user);
      
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(refreshResponse.data.user));
        console.log('Profile data refreshed and stored to local storage');
      }
      
      return true;
    }
    
    return false;
  } catch (error) {
    console.error("Profile refresh failed:", error);
    return false;
  }
};

/**
 * Clears user data from local storage and cookies
 */
export const clearLocalUserData = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user");
    console.log('Cleared user data from local storage');
  }
};

/**
 * Stores user data to local storage and cookies
 */
export const storeUserData = (user: User): void => {
  if (typeof window !== "undefined") {
    localStorage.setItem("user", JSON.stringify(user));
    console.log('Stored user data to local storage');
  }
};
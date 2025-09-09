import { User, LoginResponse } from "@/types/auth.types";
import { AuthStorage } from "@/lib/auth-storage";
import config from "@/lib/config";

export class AuthService {
  static async refreshTokens(refreshToken: string): Promise<{ user: User; accessToken: string; refreshToken: string } | null> {
    try {
      const response = await fetch(`${config.apiBaseUrl}/users/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.accessToken && data.data.refreshToken) {
          return {
            user: data.data.user,
            accessToken: data.data.accessToken,
            refreshToken: data.data.refreshToken,
          };
        }
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    return null;
  }

  static async initializeAuth(): Promise<{ success: boolean; user: User | null }> {
    const { token, user, refreshToken } = AuthStorage.getAuthData();

    if (!token || !user || !user._id) {
      return { success: false, user: null };
    }

    // Check if token is expired or about to expire
    if (AuthStorage.isTokenExpired(token)) {
      console.log("Token expired, attempting refresh...");
      
      if (refreshToken) {
        const refreshResult = await this.refreshTokens(refreshToken);
        if (refreshResult) {
          console.log("Token refresh successful");
          AuthStorage.setAuthData(refreshResult.user, refreshResult.accessToken, refreshResult.refreshToken);
          return { success: true, user: refreshResult.user };
        } else {
          console.log("Token refresh failed, clearing auth");
          AuthStorage.clearAuthData();
          return { success: false, user: null };
        }
      } else {
        console.log("No refresh token available, clearing auth");
        AuthStorage.clearAuthData();
        return { success: false, user: null };
      }
    }

    return { success: true, user };
  }

  static transformLoginResponseToUser(userData: LoginResponse['data']['user']): User {
    return {
      _id: userData._id,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      phone: userData.phone,
      dob: userData.dob,
      gender: userData.gender as "male" | "female" | "other" | undefined,
      bio: userData.bio,
      interests: userData.interests,
      profilePicture: userData.profilePicture,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.email}`,
      location: userData.location,
      agePreferences: userData.agePreferences,
      socialLinks: userData.socialLinks,
      privacy: userData.privacy as "public" | "private" | undefined,
      lookingFor: userData.lookingFor as "friendship" | "relationship" | "casual" | "other" | undefined,
      height: userData.height,
      occupation: userData.occupation,
      education: userData.education as "high_school" | "bachelor" | "master" | "phd" | "other" | undefined,
      smoking: userData.smoking as "never" | "sometimes" | "regularly" | "prefer_not_to_say" | undefined,
      drinking: userData.drinking as "never" | "socially" | "regularly" | "prefer_not_to_say" | undefined,
      relationshipStatus: userData.relationshipStatus as "single" | "divorced" | "widowed" | undefined,
      children: userData.children as "none" | "have_children" | "want_children" | "dont_want_children" | undefined,
      religion: userData.religion,
      languages: userData.languages,
      subscription: userData.subscription as "free" | "solara" | undefined,
      isActive: userData.isActive,
      profileCompleteness: userData.profileCompleteness,
      createdAt: userData.createdAt,
      lastActive: userData.lastActive,
    };
  }
}

import Cookies from "js-cookie";
import { User } from '@/types/auth.types';

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export class StorageSync {
  private static readonly SYNC_INTERVAL = 30000; // 30 seconds
  private static syncTimer: NodeJS.Timeout | null = null;

  /**
   * Synchronize auth data between localStorage and cookies
   */
  static syncAuthData(tokens: AuthTokens): void {
    if (typeof window === "undefined") return;

    const { accessToken, refreshToken, user } = tokens;

    // Update both localStorage and cookies
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("userId", user._id);

    Cookies.set("authToken", accessToken, { expires: 1, path: "/" });
    Cookies.set("refreshToken", refreshToken, { expires: 7, path: "/" });
    Cookies.set("user", JSON.stringify(user), { expires: 7, path: "/" });
    Cookies.set("userId", user._id, { expires: 7, path: "/" });
  }

  /**
   * Get auth data with fallback between localStorage and cookies
   */
  static getAuthData(): { token: string | null; refreshToken: string | null; user: User | null } {
    if (typeof window === "undefined") {
      return { token: null, refreshToken: null, user: null };
    }

    // Try localStorage first, then cookies as fallback
    const token = localStorage.getItem("authToken") || Cookies.get("authToken") || null;
    const refreshToken = localStorage.getItem("refreshToken") || Cookies.get("refreshToken") || null;
    const userStr = localStorage.getItem("user") || Cookies.get("user") || null;

    let user = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (error) {
        console.error("Error parsing user data:", error);
        this.clearAuthData();
        return { token: null, refreshToken: null, user: null };
      }
    }

    return { token, refreshToken, user };
  }

  /**
   * Clear all auth data from both storage mechanisms
   */
  static clearAuthData(): void {
    if (typeof window === "undefined") return;

    // Clear localStorage
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    // Clear cookies
    Cookies.remove("authToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    Cookies.remove("user", { path: "/" });
    Cookies.remove("userId", { path: "/" });
  }

  /**
   * Start periodic sync to ensure consistency between storage mechanisms
   */
  static startPeriodicSync(): void {
    if (typeof window === "undefined" || this.syncTimer) return;

    this.syncTimer = setInterval(() => {
      this.ensureStorageConsistency();
    }, this.SYNC_INTERVAL);
  }

  /**
   * Stop periodic sync
   */
  static stopPeriodicSync(): void {
    if (this.syncTimer) {
      clearInterval(this.syncTimer);
      this.syncTimer = null;
    }
  }

  /**
   * Ensure localStorage and cookies are in sync
   */
  private static ensureStorageConsistency(): void {
    if (typeof window === "undefined") return;

    const localToken = localStorage.getItem("authToken");
    const cookieToken = Cookies.get("authToken");

    // If tokens don't match, prefer localStorage (more reliable)
    if (localToken && localToken !== cookieToken) {
      const refreshToken = localStorage.getItem("refreshToken");
      const user = localStorage.getItem("user");

      if (refreshToken && user) {
        Cookies.set("authToken", localToken, { expires: 1, path: "/" });
        Cookies.set("refreshToken", refreshToken, { expires: 7, path: "/" });
        Cookies.set("user", user, { expires: 7, path: "/" });
        
        const userData = JSON.parse(user);
        Cookies.set("userId", userData._id, { expires: 7, path: "/" });
      }
    } else if (cookieToken && !localToken) {
      // If cookie exists but localStorage doesn't, restore from cookies
      const refreshToken = Cookies.get("refreshToken");
      const user = Cookies.get("user");
      const userId = Cookies.get("userId");

      if (refreshToken && user && userId) {
        localStorage.setItem("authToken", cookieToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("user", user);
        localStorage.setItem("userId", userId);
      }
    }
  }

  /**
   * Check if user is authenticated based on available tokens
   */
  static isAuthenticated(): boolean {
    const { token, user } = this.getAuthData();
    return !!(token && user && user._id);
  }

  /**
   * Check if a JWT token is expired or about to expire
   */
  static isTokenExpired(token: string, bufferSeconds: number = 300): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < (currentTime + bufferSeconds);
    } catch {
      return true; // If we can't parse the token, consider it expired
    }
  }
}

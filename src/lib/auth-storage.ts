import Cookies from "js-cookie";
import { User } from "@/types/auth.types";

const COOKIE_OPTIONS = {
  expires: 7,
  path: "/",
  secure: false,
  sameSite: "lax" as const,
};

export class AuthStorage {
  static setAuthData(user: User, accessToken: string, refreshToken?: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("authToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user._id);
      if (refreshToken) {
        localStorage.setItem("refreshToken", refreshToken);
      }
    }

    Cookies.set("authToken", accessToken, COOKIE_OPTIONS);
    Cookies.set("user", JSON.stringify(user), COOKIE_OPTIONS);
    Cookies.set("userId", user._id, COOKIE_OPTIONS);
    if (refreshToken) {
      Cookies.set("refreshToken", refreshToken, { ...COOKIE_OPTIONS, expires: 7 });
    }
  }

  static getAuthData(): { token: string | null; user: User | null; refreshToken: string | null } {
    if (typeof window === "undefined") {
      return { token: null, user: null, refreshToken: null };
    }

    const token = localStorage.getItem("authToken") || Cookies.get("authToken") || null;
    const refreshToken = localStorage.getItem("refreshToken") || Cookies.get("refreshToken") || null;
    const userStr = localStorage.getItem("user") || Cookies.get("user");

    let user = null;
    if (userStr) {
      try {
        user = JSON.parse(userStr);
      } catch (error) {
        console.error("Error parsing user data:", error);
        this.clearAuthData();
        return { token: null, user: null, refreshToken: null };
      }
    }

    return { token, user, refreshToken };
  }

  static clearAuthData(): void {
    if (typeof window !== "undefined") {
      localStorage.removeItem("authToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      localStorage.removeItem("userId");
    }

    Cookies.remove("authToken", { path: "/" });
    Cookies.remove("refreshToken", { path: "/" });
    Cookies.remove("user", { path: "/" });
    Cookies.remove("userId", { path: "/" });
  }

  static updateUserData(userData: Partial<User>): void {
    if (typeof window === "undefined") return;

    const currentUserStr = localStorage.getItem("user") || Cookies.get("user");
    if (!currentUserStr) return;

    try {
      const currentUser = JSON.parse(currentUserStr);
      const updatedUser = { ...currentUser, ...userData };
      
      localStorage.setItem("user", JSON.stringify(updatedUser));
      Cookies.set("user", JSON.stringify(updatedUser), COOKIE_OPTIONS);
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  }

  static isTokenExpired(token: string, bufferSeconds: number = 300): boolean {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Math.floor(Date.now() / 1000);
      return payload.exp < (currentTime + bufferSeconds);
    } catch {
      return true;
    }
  }
}

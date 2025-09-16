import Cookies from "js-cookie";
import config from "./config";
import { User } from "@/types/auth.types";

const API_BASE_URL = config.apiBaseUrl;

let isRefreshing = false;
let refreshPromise: Promise<boolean> | null = null;

const getAuthToken = (): string | null => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("authToken") || Cookies.get("authToken") || null
    );
  }
  return null;
};

const getRefreshToken = (): string | null => {
  if (typeof window !== "undefined") {
    return (
      localStorage.getItem("refreshToken") ||
      Cookies.get("refreshToken") ||
      null
    );
  }
  return null;
};

const setAuthTokens = (
  accessToken: string,
  refreshToken: string,
  user?: User
) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);

    Cookies.set("authToken", accessToken, { expires: 1 });
    Cookies.set("refreshToken", refreshToken, { expires: 7 });

    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("userId", user._id);
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
      Cookies.set("userId", user._id, { expires: 7 });
    }
  }
};

const clearAuthTokens = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("userId");

    Cookies.remove("authToken");
    Cookies.remove("refreshToken");
    Cookies.remove("user");
    Cookies.remove("userId");
  }
};

const isTokenExpired = (token: string): boolean => {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const currentTime = Math.floor(Date.now() / 1000);

    return payload.exp < currentTime + 300;
  } catch {
    return true;
  }
};

const refreshAccessToken = async (): Promise<boolean> => {
  if (isRefreshing) {
    if (refreshPromise) {
      return refreshPromise;
    }
  }

  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;

  isRefreshing = true;
  refreshPromise = (async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/users/refresh-token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ refreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.accessToken && data.data.refreshToken) {
          setAuthTokens(
            data.data.accessToken,
            data.data.refreshToken,
            data.data.user
          );

          if (typeof window !== "undefined") {
            window.dispatchEvent(
              new CustomEvent("tokenRefreshed", {
                detail: { user: data.data.user },
              })
            );
          }

          return true;
        }
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
    }

    return false;
  })();

  const result = await refreshPromise;
  isRefreshing = false;
  refreshPromise = null;
  return result;
};

const createHeaders = (includeAuth: boolean = true, isFormData: boolean = false): HeadersInit => {
  const headers: HeadersInit = {};

  // Only set Content-Type for non-FormData requests
  if (!isFormData) {
    headers["Content-Type"] = "application/json";
  }

  if (includeAuth) {
    const token = getAuthToken();
    if (token) {
      headers["Authorization"] = `Bearer ${token}`;
    }
  }

  return headers;
};

export const apiRequest = async <T = unknown>(
  endpoint: string,
  options: RequestInit = {},
  includeAuth: boolean = true,
  retryOnUnauthorized: boolean = true
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  // Check if the body is FormData
  const isFormData = options.body instanceof FormData;

  if (includeAuth && typeof window !== "undefined") {
    const token = getAuthToken();
    if (token && isTokenExpired(token)) {
      console.log("Token is about to expire, refreshing proactively...");
      const refreshSuccess = await refreshAccessToken();
      if (!refreshSuccess) {
        clearAuthTokens();
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        throw new Error("Authentication failed - please login again");
      }
    }
  }

  let response = await fetch(url, {
    ...options,
    headers: {
      ...createHeaders(includeAuth, isFormData),
      ...options.headers,
    },
  });

  if (
    response.status === 401 &&
    includeAuth &&
    retryOnUnauthorized &&
    typeof window !== "undefined"
  ) {
    console.log("Received 401, attempting token refresh...");
    const refreshSuccess = await refreshAccessToken();

    if (refreshSuccess) {
      console.log("Token refresh successful, retrying original request...");

      response = await fetch(url, {
        ...options,
        headers: {
          ...createHeaders(includeAuth, isFormData),
          ...options.headers,
        },
      });
    } else {
      console.log("Token refresh failed, redirecting to login...");

      clearAuthTokens();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
      throw new Error("Session expired - please login again");
    }
  }

  if (!response.ok) {
    if (response.status === 401 && typeof window !== "undefined") {
      clearAuthTokens();
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    let errorMessage = "An error occurred";
    let errorData: {
      errorCode?: string;
      errors?: unknown;
      message?: string;
      error?: string;
    } | null = null;

    try {
      errorData = await response.json();

      if (errorData?.errorCode === "VALIDATION_ERROR" && errorData.errors) {
        return {
          success: false,
          error: true,
          errorCode: "VALIDATION_ERROR",
          errors: errorData.errors,
          message: errorData.message || "Validation failed",
        } as T;
      } else {
        errorMessage = errorData?.message || errorData?.error || errorMessage;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }

    throw new Error(errorMessage);
  }

  return response.json();
};

export const authAPI = {
  login: (email: string, password: string) =>
    apiRequest(
      "/users/login",
      {
        method: "POST",
        body: JSON.stringify({ email, password }),
      },
      false
    ),

  signup: (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string
  ) =>
    apiRequest(
      "/users/register",
      {
        method: "POST",
        body: JSON.stringify({
          firstName,
          lastName,
          email,
          phone,
          password,
        }),
      },
      false
    ),

  getCurrentUser: () =>
    apiRequest("/users/profile", {
      method: "GET",
    }),

  refreshProfile: () =>
    apiRequest("/users/refresh", {
      method: "GET",
    }),

  updateProfile: (data: Record<string, unknown>) => {
    // For now, only handle regular JSON update (no file uploads)
    console.log('Frontend API - updateProfile called with:', data);
    return apiRequest("/users/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
  },

  changePassword: (currentPassword: string, newPassword: string) =>
    apiRequest("/users/change-password", {
      method: "PUT",
      body: JSON.stringify({ currentPassword, newPassword }),
    }),

  updateLocation: (location: Record<string, unknown>) =>
    apiRequest("/users/location", {
      method: "PUT",
      body: JSON.stringify(location),
    }),

  deactivateAccount: () =>
    apiRequest("/users/deactivate", {
      method: "PUT",
    }),

  logout: () =>
    apiRequest("/users/logout", {
      method: "POST",
    }),

  refreshToken: (refreshToken: string) =>
    apiRequest(
      "/users/refresh-token",
      {
        method: "POST",
        body: JSON.stringify({ refreshToken }),
      },
      false,
      false
    ),

  searchUsers: (name: string, page = 1, limit = 10) =>
    apiRequest(
      `/users/search?name=${encodeURIComponent(
        name
      )}&page=${page}&limit=${limit}`,
      {
        method: "GET",
      }
    ),

  // Like/Crush/Match functionality
  likeUser: (targetUserId: string) =>
    apiRequest("/users/like", {
      method: "POST",
      body: JSON.stringify({ targetUserId }),
    }),

  unlikeUser: (targetUserId: string) =>
    apiRequest("/users/unlike", {
      method: "POST",
      body: JSON.stringify({ targetUserId }),
    }),

  getLikes: () =>
    apiRequest("/users/likes", {
      method: "GET",
    }),

  getCrushes: () =>
    apiRequest("/users/crushes", {
      method: "GET",
    }),

  getMatches: () =>
    apiRequest("/users/matches", {
      method: "GET",
    }),

  checkLikeStatus: (targetUserId: string) =>
    apiRequest(`/users/like-status/${targetUserId}`, {
      method: "GET",
    }),
};

export const matchAPI = {
  recordAction: (
    targetUserId: string,
    action: "like" | "pass" | "super_like"
  ) =>
    apiRequest("/matches/action", {
      method: "POST",
      body: JSON.stringify({ targetUserId, action }),
    }),

  likeUser: (targetUserId: string) =>
    apiRequest(`/matches/like/${targetUserId}`, {
      method: "POST",
    }),

  passUser: (targetUserId: string) =>
    apiRequest(`/matches/pass/${targetUserId}`, {
      method: "POST",
    }),

  superLikeUser: (targetUserId: string) =>
    apiRequest(`/matches/super-like/${targetUserId}`, {
      method: "POST",
    }),

  getMatches: (page = 1, limit = 20) =>
    apiRequest(`/matches?page=${page}&limit=${limit}`, {
      method: "GET",
    }),

  getMatchHistory: (page = 1, limit = 20) =>
    apiRequest(`/matches/history?page=${page}&limit=${limit}`, {
      method: "GET",
    }),

  getLikes: (page = 1, limit = 20) =>
    apiRequest(`/matches/likes?page=${page}&limit=${limit}`, {
      method: "GET",
    }),

  checkUserAction: (targetUserId: string) =>
    apiRequest(`/matches/check/${targetUserId}`, {
      method: "GET",
    }),
};

const apiModule = { apiRequest, authAPI, matchAPI };
export default apiModule;

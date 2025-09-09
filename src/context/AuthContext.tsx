"use client";

import {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { authAPI } from "@/lib/api";
import { AuthContextType, LoginResponse, User } from "@/types/auth.types";
import { initialAuthState, authReducer } from "@/lib/auth-reducer";
import { AuthStorage } from "@/lib/auth-storage";
import { AuthService } from "@/lib/auth-service";
// import { useTokenRefresh } from "@/hooks/useTokenRefresh";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialAuthState);
  const router = useRouter();

  // Initialize authentication on app start
  useEffect(() => {
    const initializeAuth = async () => {
      const { success, user } = await AuthService.initializeAuth();
      
      if (success && user) {
        dispatch({ type: "LOGIN_SUCCESS", payload: user });
      } else {
        dispatch({ type: "LOGOUT" });
      }

      dispatch({ type: "INIT_COMPLETE" });
    };

    initializeAuth();

    // Listen for token refresh events from API layer
    const handleTokenRefresh = (event: CustomEvent) => {
      if (event.detail && event.detail.user) {
        dispatch({ type: "LOGIN_SUCCESS", payload: event.detail.user });
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener('tokenRefreshed', handleTokenRefresh as EventListener);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener('tokenRefreshed', handleTokenRefresh as EventListener);
      }
    };
  }, []);

  const login = async (email: string, password: string) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const response = await authAPI.login(email, password) as LoginResponse;
      const userData = response.data.user;
      const token = response.data.accessToken;

      if (!token) {
        throw new Error("No access token received");
      }

      const user = AuthService.transformLoginResponseToUser(userData);
      const refreshToken = response.data.refreshToken;
      
      AuthStorage.setAuthData(user, token, refreshToken);
      dispatch({ type: "LOGIN_SUCCESS", payload: user });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Login failed";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const signup = async (
    firstName: string,
    lastName: string,
    email: string,
    phone: string,
    password: string
  ) => {
    dispatch({ type: "LOGIN_START" });
    try {
      await authAPI.signup(firstName, lastName, email, phone, password);
      dispatch({ type: "CLEAR_ERROR" });
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Signup failed";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const logout = async (redirectTo: string = '/') => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error("Logout API call failed:", error);
    } finally {
      AuthStorage.clearAuthData();
      dispatch({ type: "LOGOUT" });
      router.push(redirectTo);
    }
  };

  const updateProfile = (data: Partial<User>) => {
    dispatch({ type: "UPDATE_PROFILE", payload: data });
    AuthStorage.updateUserData(data);
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const value: AuthContextType = {
    ...state,
    login,
    signup,
    logout,
    updateProfile,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

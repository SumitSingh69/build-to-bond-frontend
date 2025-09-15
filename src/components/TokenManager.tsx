"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTokenRefresh } from "@/hooks/useTokenRefresh";
import { User } from "@/types/auth.types";

export const TokenManager = () => {
  const { user, updateProfile } = useAuth();

  useTokenRefresh({
    refreshBeforeExpiry: 300,
    checkInterval: 60000,
    onRefreshSuccess: (updatedUser: User | null) => {
      console.log("Token refreshed successfully");

      if (updatedUser && user && updatedUser._id === user._id) {
        updateProfile(updatedUser);
      }
    },
    onRefreshFailure: (error: Error) => {
      console.error("Token refresh failed:", error);
    },
  });

  useEffect(() => {
    if (!user) return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === "visible") {
        console.log("App became visible, checking token status...");

        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("checkToken"));
        }
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [user]);

  useEffect(() => {
    if (!user) return;

    const handleOnline = () => {
      console.log("App came online, checking token status...");
      if (typeof window !== "undefined") {
        window.dispatchEvent(new CustomEvent("checkToken"));
      }
    };

    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("online", handleOnline);
    };
  }, [user]);

  return null;
};

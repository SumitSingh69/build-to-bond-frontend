"use client";

import { useEffect, useCallback, useRef } from 'react';
import { AuthStorage } from '@/lib/auth-storage';
import { AuthService } from '@/lib/auth-service';
import { User } from '@/types/auth.types';

interface UseTokenRefreshOptions {
  refreshBeforeExpiry?: number; // seconds before expiry to refresh
  checkInterval?: number; // milliseconds between checks
  onRefreshSuccess?: (user: User | null) => void;
  onRefreshFailure?: (error: Error) => void;
}

export const useTokenRefresh = (options: UseTokenRefreshOptions = {}) => {
  const {
    refreshBeforeExpiry = 300, // 5 minutes
    checkInterval = 60000, // 1 minute
    onRefreshSuccess,
    onRefreshFailure
  } = options;

  const refreshInProgress = useRef(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const refreshTokens = useCallback(async (): Promise<boolean> => {
    if (refreshInProgress.current) return false;
    
    try {
      refreshInProgress.current = true;
      const { refreshToken } = AuthStorage.getAuthData();
      
      if (!refreshToken) return false;

      const refreshResult = await AuthService.refreshTokens(refreshToken);
      
      if (refreshResult) {
        AuthStorage.setAuthData(
          refreshResult.user, 
          refreshResult.accessToken, 
          refreshResult.refreshToken
        );
        
        onRefreshSuccess?.(refreshResult.user);
        
        // Dispatch event for other components
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('tokenRefreshed', { 
            detail: { user: refreshResult.user } 
          }));
        }
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Token refresh failed:', error);
      onRefreshFailure?.(error as Error);
      return false;
    } finally {
      refreshInProgress.current = false;
    }
  }, [onRefreshSuccess, onRefreshFailure]);

  const checkAndRefreshToken = useCallback(async () => {
    const { token } = AuthStorage.getAuthData();
    
    if (!token) return;

    if (AuthStorage.isTokenExpired(token, refreshBeforeExpiry)) {
      console.log('Token check: refreshing expired token...');
      await refreshTokens();
    }
  }, [refreshTokens, refreshBeforeExpiry]);

  // Background refresh interval
  useEffect(() => {
    intervalRef.current = setInterval(checkAndRefreshToken, checkInterval);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [checkAndRefreshToken, checkInterval]);

  // Listen for manual token check events
  useEffect(() => {
    const handleCheckToken = () => {
      checkAndRefreshToken();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('checkToken', handleCheckToken);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('checkToken', handleCheckToken);
      }
    };
  }, [checkAndRefreshToken]);

  return {
    manualRefresh: refreshTokens,
    checkAndRefresh: checkAndRefreshToken,
  };
};
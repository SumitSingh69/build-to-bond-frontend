"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useTokenRefresh } from '@/hooks/useTokenRefresh';
import { User } from '@/types/auth.types';

export const TokenManager = () => {
  const { user, updateProfile } = useAuth();

  // Initialize token refresh with options
  useTokenRefresh({
    refreshBeforeExpiry: 300, // Refresh 5 minutes before expiry
    checkInterval: 60000, // Check every minute
    onRefreshSuccess: (updatedUser: User | null) => {
      console.log('Token refreshed successfully');
      // Update the user profile in context if user data was updated
      if (updatedUser && user && updatedUser._id === user._id) {
        updateProfile(updatedUser);
      }
    },
    onRefreshFailure: (error: Error) => {
      console.error('Token refresh failed:', error);
    }
  });

  // Handle app visibility changes - refresh token when app becomes active
  useEffect(() => {
    if (!user) return;

    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        console.log('App became visible, checking token status...');
        
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('checkToken'));
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [user]);

  // Handle online/offline events
  useEffect(() => {
    if (!user) return;

    const handleOnline = () => {
      console.log('App came online, checking token status...');
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('checkToken'));
      }
    };

    window.addEventListener('online', handleOnline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [user]);

  return null; // This component doesn't render anything
};

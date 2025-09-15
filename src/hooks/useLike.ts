"use client";

import { useState, useCallback } from 'react';
import apiModule from '@/lib/api';
import { toast } from 'sonner';

interface LikedUser {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture?: string;
  avatar?: string;
  bio?: string;
  isMatch: boolean;
}

interface LikesData {
  likes: LikedUser[];
  totalLikes: number;
}

interface CrushesData {
  crushes: LikedUser[];
  totalCrushes: number;
}

interface MatchesData {
  matches: LikedUser[];
  totalMatches: number;
}

interface LikeStatusData {
  hasLiked: boolean;
  isLikedBack: boolean;
  isMatch: boolean;
  targetUser: {
    _id: string;
    firstName: string;
    lastName: string;
  };
}

export const useLike = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const likeUser = useCallback(async (targetUserId: string): Promise<{ success: boolean; isMatch: boolean } | null> => {
    setLoading(true);
    setError(null);

    console.log("useLike: Attempting to like user:", targetUserId);

    try {
      const response = await apiModule.authAPI.likeUser(targetUserId) as any;
      console.log("useLike: API response:", response);
      
      if (response.success) {
        console.log("useLike: Success! Match status:", response.data?.isMatch);
        
        if (response.data?.isMatch) {
          toast.success("🎉 It's a Match!", {
            description: "You both liked each other! Start a conversation.",
            duration: 5000,
          });
        } else {
          toast.success("❤️ Liked!", {
            description: "Your like has been sent.",
            duration: 3000,
          });
        }
        
        return {
          success: true,
          isMatch: response.data?.isMatch || false
        };
      } else {
        console.log("useLike: API returned success: false");
        setError("Failed to like user");
        return null;
      }
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to like user';
      console.error('useLike: Error occurred:', err);
      setError(errorMessage);
      
      toast.error("Failed to like user", {
        description: "Please try again later.",
        duration: 4000,
      });
      
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const unlikeUser = useCallback(async (targetUserId: string): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.authAPI.unlikeUser(targetUserId) as any;
      
      if (response.success) {
        toast.success("User unliked successfully");
        return true;
      }
      
      return false;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to unlike user';
      setError(errorMessage);
      console.error('Unlike user error:', err);
      
      toast.error("Failed to unlike user", {
        description: "Please try again later.",
        duration: 4000,
      });
      
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const getLikes = useCallback(async (): Promise<LikesData | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.authAPI.getLikes() as any;
      
      if (response.success) {
        return response.data;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get likes';
      setError(errorMessage);
      console.error('Get likes error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get users who liked you (crushes)
  const getCrushes = useCallback(async (): Promise<CrushesData | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.authAPI.getCrushes() as any;
      
      if (response.success) {
        return response.data;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get crushes';
      setError(errorMessage);
      console.error('Get crushes error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get mutual matches
  const getMatches = useCallback(async (): Promise<MatchesData | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.authAPI.getMatches() as any;
      
      if (response.success) {
        return response.data;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get matches';
      setError(errorMessage);
      console.error('Get matches error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Check like status for a specific user
  const checkLikeStatus = useCallback(async (targetUserId: string): Promise<LikeStatusData | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.authAPI.checkLikeStatus(targetUserId) as any;
      
      if (response.success) {
        return response.data;
      }
      
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check like status';
      setError(errorMessage);
      console.error('Check like status error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Actions
    likeUser,
    unlikeUser,
    
    // Data fetchers
    getLikes,
    getCrushes,
    getMatches,
    checkLikeStatus,
    
    // State
    loading,
    error,
    clearError,
  };
};

export default useLike;
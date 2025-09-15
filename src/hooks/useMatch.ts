"use client";

import { useState, useCallback } from 'react';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

interface MatchUser {
  _id: string;
  firstName: string;
  lastName: string;
  age: number;
  profilePicture?: string;
  location?: {
    city?: string;
    country?: string;
  };
  occupation?: string;
  bio?: string;
  interests?: string[];
}

interface MatchHistoryItem {
  matchedUserId: MatchUser;
  compatibilityScore: number;
  status: 'pending' | 'liked' | 'passed' | 'super_liked' | 'matched' | 'expired';
  actionTakenAt?: string;
  generatedAt: string;
}

interface LikeItem {
  user: MatchUser;
  likedAt: string;
  isSuper: boolean;
  compatibilityScore: number;
}

interface MatchStats {
  totalMatches: number;
  totalLikes: number;
  totalPasses: number;
}

interface UserActionResult {
  action: string;
  targetUserId: string;
  isMatch: boolean;
  matchId: string;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

interface MatchApiResponse<T> extends ApiResponse<T> {
  pagination?: Pagination;
  stats?: MatchStats;
}

export const useMatch = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Record user action (like/pass/super_like)
  const recordAction = useCallback(async (
    targetUserId: string, 
    action: "like" | "pass" | "super_like"
  ): Promise<UserActionResult | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.matchAPI.recordAction(targetUserId, action) as ApiResponse<UserActionResult>;
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to record action';
      setError(errorMessage);
      console.error('Record action error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Like a user
  const likeUser = useCallback(async (targetUserId: string): Promise<UserActionResult | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.matchAPI.likeUser(targetUserId) as ApiResponse<UserActionResult>;
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to like user';
      setError(errorMessage);
      console.error('Like user error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Pass on a user
  const passUser = useCallback(async (targetUserId: string): Promise<UserActionResult | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.matchAPI.passUser(targetUserId) as ApiResponse<UserActionResult>;
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to pass user';
      setError(errorMessage);
      console.error('Pass user error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Super like a user
  const superLikeUser = useCallback(async (targetUserId: string): Promise<UserActionResult | null> => {
    if (!user) {
      setError('User not authenticated');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.matchAPI.superLikeUser(targetUserId) as ApiResponse<UserActionResult>;
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to super like user';
      setError(errorMessage);
      console.error('Super like user error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get mutual matches
  const getMatches = useCallback(async (page = 1, limit = 20) => {
    if (!user) {
      setError('User not authenticated');
      return { matches: [], pagination: null };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.matchAPI.getMatches(page, limit) as MatchApiResponse<MatchHistoryItem[]>;
      return {
        matches: result.data,
        pagination: result.pagination || null
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get matches';
      setError(errorMessage);
      console.error('Get matches error:', err);
      return { matches: [], pagination: null };
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get match history
  const getMatchHistory = useCallback(async (page = 1, limit = 20) => {
    if (!user) {
      setError('User not authenticated');
      return { matches: [], stats: null, pagination: null };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.matchAPI.getMatchHistory(page, limit) as MatchApiResponse<MatchHistoryItem[]>;
      return {
        matches: result.data,
        stats: result.stats || null,
        pagination: result.pagination || null
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get match history';
      setError(errorMessage);
      console.error('Get match history error:', err);
      return { matches: [], stats: null, pagination: null };
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Get users who liked you
  const getLikes = useCallback(async (page = 1, limit = 20) => {
    if (!user) {
      setError('User not authenticated');
      return { likes: [], pagination: null };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.matchAPI.getLikes(page, limit) as MatchApiResponse<LikeItem[]>;
      return {
        likes: result.data,
        pagination: result.pagination || null
      };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get likes';
      setError(errorMessage);
      console.error('Get likes error:', err);
      return { likes: [], pagination: null };
    } finally {
      setLoading(false);
    }
  }, [user]);

  // Check if user has already acted on target user
  const checkUserAction = useCallback(async (targetUserId: string) => {
    if (!user) {
      setError('User not authenticated');
      return { hasActed: false, action: null };
    }

    setLoading(true);
    setError(null);

    try {
      const result = await api.matchAPI.checkUserAction(targetUserId) as ApiResponse<{
        hasActed: boolean;
        action: string | null;
        actionTakenAt?: string;
      }>;
      return result.data;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to check user action';
      setError(errorMessage);
      console.error('Check user action error:', err);
      return { hasActed: false, action: null };
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    // Actions
    recordAction,
    likeUser,
    passUser,
    superLikeUser,
    
    // Data fetching
    getMatches,
    getMatchHistory,
    getLikes,
    checkUserAction,
    
    // State
    loading,
    error,
    clearError
  };
};
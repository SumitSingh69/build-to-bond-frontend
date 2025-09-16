"use client";

import { useState, useCallback } from 'react';
import apiModule from '@/lib/api';

interface DashboardStats {
  stats: {
    totalLikesGiven: number;
    totalLikesReceived: number;
    totalMatches: number;
    totalProfileViews: number;
    matchRate: number;
    engagementScore: number;
  };
  weeklyActivity: {
    date: string;
    displayDate: string;
    likes: number;
    matches: number;
    views: number;
    messages: number;
  }[];
  insights: {
    profileCompleteness: number;
    matchRate: number;
    engagementScore: number;
    recommendations: {
      type: string;
      title: string;
      description: string;
      priority: 'high' | 'medium' | 'low';
    }[];
  };
  activityPattern: {
    hour: number;
    displayHour: string;
    activity: number;
  }[];
  bestDay?: {
    date: Date;
    likesCount: number;
    matchesCount: number;
  };
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export const useStats = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Get comprehensive dashboard data
  const getDashboard = useCallback(async (): Promise<DashboardStats | null> => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.statsAPI.getDashboard() as ApiResponse<DashboardStats>;
      
      if (response.success) {
        return response.data;
      }
      
      setError("Failed to get dashboard data");
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get dashboard data';
      setError(errorMessage);
      console.error('Get dashboard error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get user's overall statistics
  const getOverview = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.statsAPI.getOverview() as ApiResponse<any>;
      
      if (response.success) {
        return response.data;
      }
      
      setError("Failed to get overview stats");
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get overview stats';
      setError(errorMessage);
      console.error('Get overview error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get weekly activity data
  const getWeeklyActivity = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.statsAPI.getWeeklyActivity() as ApiResponse<any>;
      
      if (response.success) {
        return response.data;
      }
      
      setError("Failed to get weekly activity");
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get weekly activity';
      setError(errorMessage);
      console.error('Get weekly activity error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get monthly trends
  const getMonthlyTrends = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.statsAPI.getMonthlyTrends() as ApiResponse<any>;
      
      if (response.success) {
        return response.data;
      }
      
      setError("Failed to get monthly trends");
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get monthly trends';
      setError(errorMessage);
      console.error('Get monthly trends error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get profile insights
  const getInsights = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.statsAPI.getInsights() as ApiResponse<any>;
      
      if (response.success) {
        return response.data;
      }
      
      setError("Failed to get insights");
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get insights';
      setError(errorMessage);
      console.error('Get insights error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Get activity pattern
  const getActivityPattern = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.statsAPI.getActivityPattern() as ApiResponse<any>;
      
      if (response.success) {
        return response.data;
      }
      
      setError("Failed to get activity pattern");
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to get activity pattern';
      setError(errorMessage);
      console.error('Get activity pattern error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Record user activity
  const recordActivity = useCallback(async (activityType: string, data?: any) => {
    try {
      const response = await apiModule.statsAPI.recordActivity(activityType, data) as ApiResponse<any>;
      
      if (response.success) {
        return response.data;
      }
      
      console.error('Failed to record activity:', response.message);
      return null;
    } catch (err) {
      console.error('Record activity error:', err);
      return null;
    }
  }, []);

  // Trigger stats aggregation
  const triggerAggregation = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.statsAPI.triggerAggregation() as ApiResponse<any>;
      
      if (response.success) {
        return response.data;
      }
      
      setError("Failed to trigger aggregation");
      return null;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to trigger aggregation';
      setError(errorMessage);
      console.error('Trigger aggregation error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    // Data fetchers
    getDashboard,
    getOverview,
    getWeeklyActivity,
    getMonthlyTrends,
    getInsights,
    getActivityPattern,
    
    // Actions
    recordActivity,
    triggerAggregation,
    
    // State
    loading,
    error,
    clearError,
  };
};

export default useStats;
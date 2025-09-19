import { useState, useEffect, useCallback } from 'react';
import apiModule from '@/lib/api';
import { NotificationItem } from '@/app/(main)/(profile)/profile/types';

interface UseNotificationsOptions {
  type?: 'system' | 'crush' | 'chat' | 'offers';
  autoRefresh?: boolean;
  refreshInterval?: number;
}

interface UseNotificationsReturn {
  notifications: NotificationItem[];
  unreadCounts: {
    system: number;
    crush: number;
    chat: number;
    offers: number;
    total: number;
  };
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  fetchNotifications: (page?: number, append?: boolean) => Promise<void>;
  fetchUnreadCounts: () => Promise<void>;
  markAsRead: (notificationId: string) => Promise<void>;
  markAllAsRead: (type?: string) => Promise<void>;
  deleteNotification: (notificationId: string) => Promise<void>;
  refresh: () => Promise<void>;
}

export const useNotifications = (options: UseNotificationsOptions = {}): UseNotificationsReturn => {
  const { type, autoRefresh = false, refreshInterval = 30000 } = options;
  
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCounts, setUnreadCounts] = useState({
    system: 0,
    crush: 0,
    chat: 0,
    offers: 0,
    total: 0
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchNotifications = useCallback(async (page: number = 1, append: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiModule.notificationAPI.getNotifications({
        type,
        page,
        limit: 20
      }) as {
        success: boolean;
        data: {
          notifications: NotificationItem[];
          pagination: {
            hasMore: boolean;
            currentPage: number;
          };
        };
      };

      if (response.success) {
        const newNotifications = response.data.notifications.map(notification => ({
          ...notification,
          timestamp: notification.timestamp instanceof Date 
            ? notification.timestamp 
            : new Date(notification.timestamp || Date.now())
        }));

        if (append) {
          setNotifications(prev => [...prev, ...newNotifications]);
        } else {
          setNotifications(newNotifications);
        }
        
        setHasMore(response.data.pagination.hasMore);
        setCurrentPage(response.data.pagination.currentPage);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, [type]);

  const fetchUnreadCounts = useCallback(async () => {
    try {
      const response = await apiModule.notificationAPI.getUnreadCounts() as {
        success: boolean;
        data: {
          system: number;
          crush: number;
          chat: number;
          offers: number;
          total: number;
        };
      };

      if (response.success) {
        setUnreadCounts(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch unread counts:', err);
    }
  }, []);

  const markAsRead = useCallback(async (notificationId: string) => {
    try {
      const response = await apiModule.notificationAPI.markAsRead(notificationId) as {
        success: boolean;
      };

      if (response.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            notification.id === notificationId 
              ? { ...notification, read: true }
              : notification
          )
        );
        
        // Refresh unread counts
        await fetchUnreadCounts();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  }, [fetchUnreadCounts]);

  const markAllAsRead = useCallback(async (filterType?: string) => {
    try {
      const response = await apiModule.notificationAPI.markAllAsRead(filterType) as {
        success: boolean;
      };

      if (response.success) {
        // Update local state
        setNotifications(prev => 
          prev.map(notification => 
            (!filterType || notification.type === filterType)
              ? { ...notification, read: true }
              : notification
          )
        );
        
        // Refresh unread counts
        await fetchUnreadCounts();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notifications as read');
    }
  }, [fetchUnreadCounts]);

  const deleteNotification = useCallback(async (notificationId: string) => {
    try {
      const response = await apiModule.notificationAPI.deleteNotification(notificationId) as {
        success: boolean;
      };

      if (response.success) {
        // Remove from local state
        setNotifications(prev => 
          prev.filter(notification => notification.id !== notificationId)
        );
        
        // Refresh unread counts
        await fetchUnreadCounts();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
    }
  }, [fetchUnreadCounts]);

  const refresh = useCallback(async () => {
    await Promise.all([
      fetchNotifications(1, false),
      fetchUnreadCounts()
    ]);
  }, [fetchNotifications, fetchUnreadCounts]);

  // Initial load
  useEffect(() => {
    refresh();
  }, [refresh]);

  // Auto refresh
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchUnreadCounts();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshInterval, fetchUnreadCounts]);

  return {
    notifications,
    unreadCounts,
    loading,
    error,
    hasMore,
    currentPage,
    fetchNotifications,
    fetchUnreadCounts,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refresh
  };
};
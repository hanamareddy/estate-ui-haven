
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { userAPI } from '@/services/api';
import mongoAuthService from '@/services/mongoAuthService';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  created_at: string;
  user_id: string;
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      const token = mongoAuthService.getToken();
      if (!token) {
        setNotifications([]);
        setUnreadCount(0);
        setLoading(false);
        return;
      }
      
      // Fetch notifications from API
      const response = await userAPI.getNotifications();
      const notificationsData = response.data;
      
      setNotifications(notificationsData);
      
      // Count unread notifications
      const unread = notificationsData.filter((notification: Notification) => !notification.read).length;
      setUnreadCount(unread);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load your notifications');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      // Make API call to mark notification as read
      await userAPI.markNotificationRead(notificationId);
      
      // Update local state
      setNotifications(currentNotifications => 
        currentNotifications.map(notification => 
          notification.id === notificationId 
            ? { ...notification, read: true } 
            : notification
        )
      );
      
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  };

  const markAllAsRead = async () => {
    try {
      // Make API call to mark all notifications as read
      await userAPI.markAllNotificationsRead();
      
      // Update local state
      setNotifications(currentNotifications => 
        currentNotifications.map(notification => ({ ...notification, read: true }))
      );
      
      setUnreadCount(0);
      
      toast({
        title: 'Success',
        description: 'All notifications marked as read',
      });
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notifications as read',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    // Only fetch notifications if user is authenticated
    if (mongoAuthService.isAuthenticated()) {
      fetchNotifications();
    }
    
    // Set up interval to periodically check for new notifications (every 2 minutes)
    const intervalId = setInterval(() => {
      if (mongoAuthService.isAuthenticated()) {
        fetchNotifications();
      }
    }, 2 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);

  return {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    refreshNotifications: fetchNotifications
  };
};

export default useNotifications;


import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { userAPI } from '@/services/api';
import mongoAuthService from '@/services/mongoAuthService';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  priority?: 'high' | 'medium' | 'low'; 
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
      
      // Assign default priority if not present
      const processedNotifications = notificationsData.map((notification: Notification) => ({
        ...notification,
        priority: notification.priority || 
                 (notification.type === 'alert' ? 'high' : 
                 notification.type === 'update' ? 'medium' : 'low')
      }));
      
      setNotifications(processedNotifications);
      
      // Count unread notifications
      const unread = processedNotifications.filter((notification: Notification) => !notification.read).length;
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
        duration: 3000,
      });
      
      return true;
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      toast({
        title: 'Error',
        description: 'Failed to mark notifications as read',
        variant: 'destructive',
        duration: 5000, // Longer duration for error messages
      });
      return false;
    }
  };

  // Function to display notification as toast based on priority
  const showNotification = (notification: Notification) => {
    const duration = notification.priority === 'high' ? 10000 : // 10 seconds for high priority
                      notification.priority === 'medium' ? 5000 : // 5 seconds for medium priority
                      3000; // 3 seconds for low priority
    
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.priority === 'high' ? 'destructive' : 'default',
      duration: duration,
    });
    
    // Automatically mark as read after showing
    markAsRead(notification.id);
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
    showNotification,
    refreshNotifications: fetchNotifications
  };
};

export default useNotifications;

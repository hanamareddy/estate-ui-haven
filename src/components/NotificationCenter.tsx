
import React, { useCallback, memo } from 'react';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import NotificationIndicator from './NotificationIndicator';
import { Bell, Check, Trash2 } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import useNotifications from '@/hooks/useNotifications';
import { formatDistanceToNow } from 'date-fns';

export interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

// Use memo to prevent unnecessary re-renders
const NotificationCenter: React.FC<NotificationCenterProps> = memo(({ isOpen, onClose }) => {
  const { 
    notifications, 
    loading, 
    error, 
    markAllAsRead, 
    markAsRead,
    unreadCount 
  } = useNotifications();

  const handleMarkAllAsRead = useCallback(async () => {
    await markAllAsRead();
  }, [markAllAsRead]);

  const handleNotificationClick = useCallback(async (id: string) => {
    await markAsRead(id);
  }, [markAsRead]);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center">
              <Bell className="mr-2 h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">{unreadCount}</Badge>
              )}
            </SheetTitle>
            {unreadCount > 0 && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleMarkAllAsRead}
                className="text-xs"
              >
                <Check className="mr-1 h-3 w-3" />
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>
        
        <div className="mt-4 flex flex-col space-y-4 max-h-[80vh] overflow-y-auto pr-2">
          {loading ? (
            Array(3).fill(0).map((_, i) => (
              <div key={i} className="flex gap-4 items-start">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))
          ) : error ? (
            <div className="text-center py-4 text-red-500">
              Failed to load notifications.
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Bell className="mx-auto h-10 w-10 opacity-20 mb-2" />
              <p>You don't have any notifications yet.</p>
            </div>
          ) : (
            notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-lg border ${notification.read ? 'bg-background' : 'bg-accent/5 border-accent/20'}`}
                onClick={() => !notification.read && handleNotificationClick(notification.id)}
              >
                <div className="flex justify-between items-start">
                  <h4 className={`text-sm font-medium ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                    {notification.title}
                  </h4>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                  </span>
                </div>
                <p className={`text-xs mt-1 ${notification.read ? 'text-muted-foreground' : 'text-foreground'}`}>
                  {notification.message}
                </p>
              </div>
            ))
          )}
        </div>
        
        {notifications.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <Button variant="outline" size="sm" className="w-full">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Notifications
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
});

NotificationCenter.displayName = 'NotificationCenter';

export default NotificationCenter;

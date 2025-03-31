
import React, { useState } from 'react';
import { useNotifications, Notification } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/button';
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from '@/components/ui/popover';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Bell, CheckCheck, Loader2, MailOpen } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const { 
    notifications, 
    unreadCount, 
    loading, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const handleMarkAsRead = async (id: string) => {
    await markAsRead(id);
  };

  const handleMarkAllAsRead = async () => {
    await markAllAsRead();
    setOpen(false);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'message':
        return <MailOpen className="h-5 w-5 text-accent" />;
      case 'property':
        return <Bell className="h-5 w-5 text-green-500" />;
      case 'alert':
        return <Bell className="h-5 w-5 text-orange-500" />;
      default:
        return <Bell className="h-5 w-5 text-accent" />;
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 min-w-5 h-5 p-0 flex items-center justify-center">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="end">
        <Card className="border-0">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Notifications</CardTitle>
              {unreadCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleMarkAllAsRead} 
                  className="h-8"
                >
                  <CheckCheck className="h-4 w-4 mr-1" />
                  Mark all read
                </Button>
              )}
            </div>
            <CardDescription>
              {unreadCount === 0 
                ? "You're all caught up" 
                : `You have ${unreadCount} unread notification${unreadCount > 1 ? 's' : ''}`}
            </CardDescription>
          </CardHeader>
          <Separator />
          {loading ? (
            <CardContent className="h-64 flex items-center justify-center">
              <Loader2 className="h-6 w-6 animate-spin" />
            </CardContent>
          ) : notifications.length === 0 ? (
            <CardContent className="h-64 flex flex-col items-center justify-center text-center p-6">
              <Bell className="h-12 w-12 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground">
                You don't have any notifications yet
              </p>
            </CardContent>
          ) : (
            <ScrollArea className="h-[300px]">
              {notifications.map((notification: Notification) => (
                <div key={notification.id} className="border-b last:border-0">
                  <CardContent className={`p-3 ${!notification.read ? 'bg-accent/5' : ''}`}>
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <h4 className="text-sm font-medium">{notification.title}</h4>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                        {!notification.read && (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleMarkAsRead(notification.id)} 
                            className="mt-2 h-7 text-xs"
                          >
                            Mark as read
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </div>
              ))}
            </ScrollArea>
          )}
          <CardFooter className="p-2 pt-0">
            <Button variant="outline" size="sm" className="w-full text-xs">
              View all notifications
            </Button>
          </CardFooter>
        </Card>
      </PopoverContent>
    </Popover>
  );
};

export default NotificationCenter;

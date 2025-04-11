
import React, { useEffect } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import useNotifications from '@/hooks/useNotifications';
import { memo } from 'react';
import mongoAuthService from '@/services/mongoAuthService';

interface NotificationIndicatorProps {
  onClick: () => void;
}

const NotificationIndicator: React.FC<NotificationIndicatorProps> = memo(({ onClick }) => {
  const { unreadCount, refreshNotifications } = useNotifications();
  
  useEffect(() => {
    // Only refresh if authenticated
    if (mongoAuthService.isAuthenticated()) {
      refreshNotifications();
    }
    // Don't set up interval polling anymore as we're using WebSockets
  }, [refreshNotifications]);

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      className="relative" 
      onClick={onClick}
    >
      <Bell size={20} />
      {unreadCount > 0 && (
        <Badge 
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] flex items-center justify-center bg-red-500 text-white text-xs p-0"
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </Badge>
      )}
    </Button>
  );
});

NotificationIndicator.displayName = 'NotificationIndicator';

export default NotificationIndicator;

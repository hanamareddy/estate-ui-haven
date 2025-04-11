import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Phone, MoreVertical, ExternalLink, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SellerInquiry } from '@/types/propertyInquiry';
import { cn } from '@/lib/utils';

interface InquiryListItemProps {
  inquiry: SellerInquiry;
  onViewDetail: (inquiryId: string) => void;
  onViewProperty: (propertyId: string) => void;
  onCloseInquiry: (inquiryId: string) => void;
}

const InquiryListItem: React.FC<InquiryListItemProps> = ({
  inquiry,
  onViewDetail,
  onViewProperty,
  onCloseInquiry,
}) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'responded':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      case 'closed':
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
      default:
        return 'bg-blue-100 text-blue-800 hover:bg-blue-200';
    }
  };

  const makePhoneCall = () => {
    if (inquiry.user.phone) {
      window.location.href = `tel:${inquiry.user.phone}`;
    }
  };

  const sendEmail = () => {
    if (inquiry.user.email) {
      const subject = `RE: Your inquiry about ${inquiry.property.title}`;
      const body = `Hello ${inquiry.user.name},\n\nThank you for your interest in ${inquiry.property.title}. I am writing in response to your inquiry.\n\nBest regards,\nProperty Owner`;
      window.location.href = `mailto:${inquiry.user.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    }
  };

  return (
    <div className="flex justify-between items-start p-3 border rounded-md mb-2 bg-white hover:bg-gray-50 transition-colors">
      {/* Left: User Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center space-x-2">
          <span className="font-medium truncate">{inquiry.user.name}</span>
          <Badge className={cn("text-xs", getStatusBadgeColor(inquiry.status))}>
            {inquiry.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate mt-1">
          {inquiry.property.title}
        </p>
      </div>

      {/* Right: Action Buttons + Timestamp */}
      <div className="flex flex-col items-end space-y-1 ml-4">
        <div className="flex items-center space-x-1">
          {inquiry.user.phone && (
            <Button
              variant="ghost"
              size="icon"
              className="text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={makePhoneCall}
              title={`Call ${inquiry.user.name}`}
            >
              <Phone className="h-4 w-4" />
              <span className="sr-only">Call</span>
            </Button>
          )}

          {inquiry.user.email && (
            <Button
              variant="ghost"
              size="icon"
              className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
              onClick={sendEmail}
              title={`Email ${inquiry.user.name}`}
            >
              <Mail className="h-4 w-4" />
              <span className="sr-only">Email</span>
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More options</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onViewDetail(inquiry.id)}>
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onViewProperty(inquiry.property.id)}>
                <ExternalLink className="h-4 w-4 mr-2" />
                View property
              </DropdownMenuItem>
              {inquiry.status !== 'closed' && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => onCloseInquiry(inquiry.id)}
                    className="text-red-600 focus:text-red-600"
                  >
                    Close inquiry
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Timestamp */}
        <div className="flex items-center text-xs text-muted-foreground mt-1">
          <Clock className="h-3 w-3 mr-1" />
          {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
        </div>
      </div>
    </div>
  );
};

export default InquiryListItem;

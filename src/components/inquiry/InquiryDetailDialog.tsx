
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Mail, Phone, ExternalLink } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { SellerInquiry } from '@/types/propertyInquiry';
import { toast } from '@/hooks/use-toast';
import { inquiryAPI } from "@/services/api";

interface InquiryDetailDialogProps {
  inquiry: SellerInquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onPropertyClick: (propertyId: string) => void;
  onUpdateSuccess: () => void;
}

const InquiryDetailDialog: React.FC<InquiryDetailDialogProps> = ({
  inquiry,
  isOpen,
  onClose,
  onPropertyClick,
  onUpdateSuccess
}) => {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!inquiry) return null;

  const handleSendResponse = async () => {
    if (!response.trim()) return;
    
    setIsSubmitting(true);
    try {
      await inquiryAPI.respondToInquiry(inquiry.id, response);
      setResponse('');
      toast({
        title: 'Response Sent',
        description: 'Your response has been sent to the buyer.',
      });
      onUpdateSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error sending response:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to send response',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseInquiry = async () => {
    setIsSubmitting(true);
    try {
      await inquiryAPI.updateInquiryStatus(inquiry.id, 'closed');
      toast({
        title: 'Inquiry Closed',
        description: 'The inquiry has been marked as closed.',
      });
      onUpdateSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error closing inquiry:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to close inquiry',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            <span>Inquiry Details</span>
            <Badge className={`
              ${inquiry.status === 'responded' ? 'bg-green-100 text-green-800' : 
                inquiry.status === 'closed' ? 'bg-gray-100 text-gray-800' : 
                'bg-yellow-100 text-yellow-800'}
            `}>
              {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="bg-muted/30 p-3 rounded-md">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h4 className="font-medium">{inquiry.property.title}</h4>
                <p className="text-sm text-muted-foreground">{inquiry.property.location}</p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                className="flex items-center gap-1"
                onClick={() => onPropertyClick(inquiry.property.id)}
              >
                <ExternalLink className="h-3 w-3" />
                <span>View</span>
              </Button>
            </div>
            <p className="text-sm">
              <span className="text-muted-foreground">Price:</span> ₹{inquiry.property.price.toLocaleString('en-IN')}
            </p>
          </div>
          
          <div className="border-l-2 border-primary pl-3 py-1">
            <h4 className="font-medium mb-1">Buyer Information</h4>
            <div className="space-y-1">
              <p className="text-sm">Name: {inquiry.user.name}</p>
              <div className="flex items-center gap-2">
                {inquiry.user.email && (
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground mr-1">Email:</span> 
                    <span>{inquiry.user.email}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 ml-1 text-primary"
                      onClick={sendEmail}
                    >
                      <Mail className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
                {inquiry.user.phone && (
                  <div className="flex items-center text-sm">
                    <span className="text-muted-foreground mr-1">Phone:</span> 
                    <span>{inquiry.user.phone}</span>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-6 w-6 ml-1 text-green-600"
                      onClick={makePhoneCall}
                    >
                      <Phone className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-1">Inquiry Message</h4>
            <div className="border rounded-md p-3 bg-background">
              <p className="text-sm">{inquiry.message}</p>
              <p className="text-xs text-muted-foreground mt-2 text-right">
                Received {formatDistanceToNow(new Date(inquiry.createdAt))} ago
              </p>
            </div>
          </div>
          
          {inquiry.sellerResponse && (
            <div>
              <h4 className="font-medium mb-1">Your Response</h4>
              <div className="border rounded-md p-3 bg-green-50 border-green-200">
                <p className="text-sm">{inquiry.sellerResponse}</p>
                <p className="text-xs text-muted-foreground mt-2 text-right">
                  Sent {inquiry.updatedAt ? formatDistanceToNow(new Date(inquiry.updatedAt)) : 'some time'} ago
                </p>
              </div>
            </div>
          )}
          
          {inquiry.status !== 'closed' && !inquiry.sellerResponse && (
            <div>
              <h4 className="font-medium mb-1">Your Response</h4>
              <Textarea
                value={response}
                onChange={(e) => setResponse(e.target.value)}
                placeholder="Write your response here..."
                rows={4}
              />
            </div>
          )}
        </div>
        
        <DialogFooter className="flex-col sm:flex-row gap-2 sm:justify-between sm:items-center">
          {inquiry.status === 'closed' ? (
            <p className="text-sm text-muted-foreground">This inquiry has been closed.</p>
          ) : inquiry.sellerResponse ? (
            <Button 
              variant="outline" 
              onClick={handleCloseInquiry}
              disabled={isSubmitting}
            >
              Mark as Closed
            </Button>
          ) : (
            <Button 
              onClick={handleSendResponse}
              disabled={!response.trim() || isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Response'}
            </Button>
          )}
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InquiryDetailDialog;

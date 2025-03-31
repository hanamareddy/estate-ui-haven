
import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { authAPI } from "@/services/api";
import { usePropertyInquiries } from "@/hooks/usePropertyInquiries";

interface PropertyContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  propertyId: string;
  onSuccess?: () => void;
}

const PropertyContactDialog = ({
  isOpen,
  onOpenChange,
  title,
  propertyId,
  onSuccess
}: PropertyContactDialogProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [userDetails, setUserDetails] = useState<{
    name: string;
    email: string;
    phone?: string;
  } | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { createInquiry } = usePropertyInquiries();

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authAPI.verifyToken();
      
      if (user) {
        setIsAuthenticated(true);
        setUserDetails({
          name: user.name || '',
          email: user.email || '',
          phone: user.phone || ''
        });
      } else {
        setIsAuthenticated(false);
        setUserDetails(null);
      }
    };
    
    if (isOpen) {
      checkAuth();
    }
  }, [isOpen]);

  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      if (isAuthenticated && userDetails) {
        // For authenticated users
        const success = await createInquiry(propertyId, contactMessage);
        
        if (success) {
          onOpenChange(false);
          if (onSuccess) onSuccess();
        }
      } else {
        // For non-authenticated users
        if (!contactName || !contactEmail) {
          toast({
            title: "Missing Information",
            description: "Please provide your name and email.",
            variant: "destructive"
          });
          return;
        }
        
        const success = await createInquiry(
          propertyId, 
          contactMessage,
          {
            name: contactName,
            email: contactEmail,
            phone: contactPhone
          }
        );
        
        if (success) {
          onOpenChange(false);
          if (onSuccess) onSuccess();
        }
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact about {title}</DialogTitle>
          <DialogDescription>
            {isAuthenticated 
              ? "Your contact details will be shared with the seller."
              : "Submit your details and the seller will get in touch with you."}
          </DialogDescription>
        </DialogHeader>
        
        {isAuthenticated && userDetails ? (
          <div className="py-4">
            <div className="space-y-4 text-sm">
              <p>You will be contacting the seller with these details:</p>
              <div className="grid grid-cols-4 items-center">
                <span className="text-right font-medium mr-4">Name:</span>
                <span className="col-span-3">{userDetails.name}</span>
              </div>
              <div className="grid grid-cols-4 items-center">
                <span className="text-right font-medium mr-4">Email:</span>
                <span className="col-span-3">{userDetails.email}</span>
              </div>
              {userDetails.phone && (
                <div className="grid grid-cols-4 items-center">
                  <span className="text-right font-medium mr-4">Phone:</span>
                  <span className="col-span-3">{userDetails.phone}</span>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="message-logged-in" className="text-right font-medium mr-4">
                  Message
                </label>
                <Textarea
                  id="message-logged-in"
                  value={contactMessage}
                  onChange={(e) => setContactMessage(e.target.value)}
                  className="col-span-3"
                  placeholder="Tell the seller why you're interested (optional)"
                />
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="name" className="text-right">
                Name
              </label>
              <Input
                id="name"
                value={contactName}
                onChange={(e) => setContactName(e.target.value)}
                className="col-span-3"
                placeholder="Your name"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="email" className="text-right">
                Email
              </label>
              <Input
                id="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="col-span-3"
                placeholder="Your email"
                type="email"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="phone" className="text-right">
                Phone (Optional)
              </label>
              <Input
                id="phone"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="col-span-3"
                placeholder="Your phone number"
                type="tel"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="message" className="text-right">
                Message
              </label>
              <Textarea
                id="message"
                value={contactMessage}
                onChange={(e) => setContactMessage(e.target.value)}
                className="col-span-3"
                placeholder="Tell the seller why you're interested (optional)"
              />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Sending..." : (isAuthenticated ? "Send Interest" : "Submit Interest")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyContactDialog;

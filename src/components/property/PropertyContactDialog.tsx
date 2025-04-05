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
import usePropertyInquiries from "@/hooks/usePropertyInquiries";

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
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const { createInquiry } = usePropertyInquiries();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await authAPI.verifyToken();
        
        if (response.data) {
          setIsAuthenticated(true);
          setUserDetails({
            name: response.data.name || '',
            email: response.data.email || '',
            phone: response.data.phone || ''
          });
          // Set default message for authenticated users
          setContactMessage("Hello, I'm interested in this property and would like to know more details.");
          setShowConfirmation(true);
        } else {
          setIsAuthenticated(false);
          setUserDetails(null);
          setShowConfirmation(false);
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUserDetails(null);
        setShowConfirmation(false);
      }
    };
    
    if (isOpen) {
      checkAuth();
    } else {
      // Reset form when dialog closes
      setContactMessage('');
      setContactName('');
      setContactEmail('');
      setContactPhone('');
      setShowConfirmation(false);
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
          setLoading(false);
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

  const handleNext = () => {
    if (!isAuthenticated) {
      // For non-authenticated users, show confirmation after collecting contact info
      if (!contactName || !contactEmail) {
        toast({
          title: "Missing Information",
          description: "Please provide your name and email.",
          variant: "destructive"
        });
        return;
      }
      setShowConfirmation(true);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Contact about {title}</DialogTitle>
          <DialogDescription>
            {isAuthenticated 
              ? "Please confirm that you'd like to share your contact details with the seller."
              : showConfirmation 
                ? "Please review and confirm your interest in this property."
                : "Submit your details and message to express interest in this property."}
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
        ) : !showConfirmation ? (
          // Contact information form for non-authenticated users
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
        ) : (
          // Confirmation view for non-authenticated users
          <div className="py-4">
            <div className="space-y-4 text-sm">
              <p>Please confirm the details you're sharing with the seller:</p>
              <div className="grid grid-cols-4 items-center">
                <span className="text-right font-medium mr-4">Name:</span>
                <span className="col-span-3">{contactName}</span>
              </div>
              <div className="grid grid-cols-4 items-center">
                <span className="text-right font-medium mr-4">Email:</span>
                <span className="col-span-3">{contactEmail}</span>
              </div>
              {contactPhone && (
                <div className="grid grid-cols-4 items-center">
                  <span className="text-right font-medium mr-4">Phone:</span>
                  <span className="col-span-3">{contactPhone}</span>
                </div>
              )}
              {contactMessage && (
                <div className="grid grid-cols-4 items-center">
                  <span className="text-right font-medium mr-4">Message:</span>
                  <span className="col-span-3">{contactMessage}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <DialogFooter>
          {!isAuthenticated && showConfirmation ? (
            <>
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Sending..." : "Confirm & Send"}
              </Button>
            </>
          ) : !isAuthenticated ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleNext}>
                Next
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)} disabled={loading}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Sending..." : "Send Interest"}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyContactDialog;

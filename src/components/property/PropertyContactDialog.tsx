import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import { inquiryAPI } from '@/services/api';
import mongoAuthService from '@/services/mongoAuthService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface PropertyContactDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  propertyId: string;
  sellerInfo?: {
    id?: string;
    name?: string;
  };
  propertyTitle: string;
  title?: string;
  onSuccess?: () => void;
}

const PropertyContactDialog = ({ 
  isOpen, 
  onOpenChange, 
  propertyId,
  sellerInfo,
  propertyTitle,
  title,
  onSuccess
}: PropertyContactDialogProps) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoggedInUser, setIsLoggedInUser] = useState(false);
  const navigate = useNavigate();
  
  const displayTitle = propertyTitle || title || '';
  
  useEffect(() => {
    const currentUser = mongoAuthService.getCurrentUser();
    if (currentUser) {
      setIsLoggedInUser(true);
      setName(currentUser.name || '');
      setEmail(currentUser.email || '');
      setPhone(currentUser.phone || '');
      
      if (!message) {
        setMessage(`Hi, I'm interested in this property: ${displayTitle}. Please contact me for more information.`);
      }
    }
  }, [displayTitle, message]);
  
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!name.trim()) newErrors.name = 'Name is required';
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (phone && !/^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/.test(phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    if (!message.trim()) newErrors.message = 'Message is required';
    if (message.trim().length < 10) newErrors.message = 'Message is too short (minimum 10 characters)';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const isValid = validateForm();
    if (!isValid) return;

    const currentUser = mongoAuthService.getCurrentUser();
    
    if (currentUser && sellerInfo && currentUser.id === sellerInfo.id) {
      toast({
        title: "Cannot contact your own listing",
        description: "You cannot send an inquiry for your own property.",
        variant: "destructive"
      });
      return;
    }
    
    if (currentUser && currentUser.isseller && !currentUser.isbuyer) {
      toast({
        title: "Seller account restriction",
        description: "Your seller account cannot send inquiries. Please switch to a buyer account.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      if (currentUser) {
        await inquiryAPI.createInquiry(propertyId, message);
      } else {
        await inquiryAPI.createInquiry(propertyId, message, { name, email, phone });
      }
      
      toast({
        title: "Inquiry Sent",
        description: "Your message has been sent to the property owner. They will contact you soon.",
      });
      
      onOpenChange(false);
      
      if (!currentUser) {
        setName('');
        setEmail('');
        setPhone('');
      }
      setMessage('');
      
      if (onSuccess) {
        onSuccess();
      }
      
    } catch (error) {
      console.error("Error sending inquiry:", error);
      toast({
        title: "Failed to Send",
        description: "There was an error sending your inquiry. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleLoginClick = () => {
    onOpenChange(false);
    navigate('/auth');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Contact Property Owner</DialogTitle>
        </DialogHeader>
        
        {!isLoggedInUser && (
          <Alert className="mb-4">
            <AlertCircle className="h-4 w-4 mr-2" />
            <AlertDescription>
              <div className="flex flex-col gap-2">
                <p>For a faster response, consider logging in.</p>
                <Button variant="outline" size="sm" onClick={handleLoginClick}>
                  Log in / Sign up
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input 
              id="name" 
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              placeholder="Enter your name"
              disabled={isLoggedInUser}
              className={errors.name ? "border-red-500" : ""}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="Enter your email address"
              disabled={isLoggedInUser}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number (optional)</Label>
            <Input 
              id="phone" 
              type="tel" 
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              placeholder="Enter your phone number"
              disabled={isLoggedInUser}
              className={errors.phone ? "border-red-500" : ""}
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Your Message</Label>
            <Textarea 
              id="message" 
              value={message} 
              onChange={(e) => setMessage(e.target.value)} 
              placeholder="I'm interested in this property..."
              rows={4}
              className={errors.message ? "border-red-500" : ""}
            />
            {errors.message && <p className="text-red-500 text-sm">{errors.message}</p>}
          </div>
          
          <DialogFooter>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyContactDialog;

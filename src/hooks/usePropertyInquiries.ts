
import { useState, useEffect, useCallback } from 'react';
import { inquiryAPI } from '@/services/api';
import mongoAuthService from '@/services/mongoAuthService';
import { toast } from '@/components/ui/use-toast';

export interface PropertyInquiry {
  id: string;
  property_id: string;
  property_title?: string;
  property_image?: string;
  user_id: string;
  user_name: string;
  user_email: string;
  user_phone?: string;
  message: string;
  status: 'new' | 'responded' | 'closed';
  seller_response?: string;
  created_at: string;
  updated_at: string;
}

export interface UsePropertyInquiriesResult {
  inquiries: PropertyInquiry[];
  loading: boolean;
  error: string | null;
  refreshUserInquiries: () => Promise<void>;
  refreshSellerInquiries: () => Promise<void>;
  respondToInquiry: (inquiryId: string, response: string) => Promise<boolean>;
  createInquiry: (propertyId: string, message: string, contactDetails?: {
    name: string;
    email: string;
    phone?: string;
  }) => Promise<boolean>;
}

export const usePropertyInquiries = (): UsePropertyInquiriesResult => {
  const [inquiriesList, setInquiriesList] = useState<PropertyInquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUserInquiries = useCallback(async () => {
    // Skip if not authenticated
    if (!mongoAuthService.isAuthenticated()) {
      setInquiriesList([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await inquiryAPI.getUserInquiries();
      setInquiriesList(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user inquiries:', err);
      setError('Failed to load your property inquiries');
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshSellerInquiries = useCallback(async () => {
    // Skip if not authenticated or not a seller
    const user = mongoAuthService.getCurrentUser();
    if (!user || !user.isseller) {
      setInquiriesList([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await inquiryAPI.getSellerInquiries();
      setInquiriesList(response.data);
      setError(null);
    } catch (err) {
      console.error('Error fetching seller inquiries:', err);
      setError('Failed to load inquiries for your properties');
    } finally {
      setLoading(false);
    }
  }, []);

  const respondToInquiry = useCallback(async (inquiryId: string, response: string): Promise<boolean> => {
    try {
      await inquiryAPI.respondToInquiry(inquiryId, response);
      
      // Update local state
      setInquiriesList(prev => prev.map(inquiry => 
        inquiry.id === inquiryId 
          ? { ...inquiry, status: 'responded', seller_response: response } 
          : inquiry
      ));
      
      return true;
    } catch (err) {
      console.error('Error responding to inquiry:', err);
      setError('Failed to send your response');
      return false;
    }
  }, []);

  const createInquiry = useCallback(async (
    propertyId: string, 
    message: string, 
    contactDetails?: {
      name: string;
      email: string;
      phone?: string;
    }
  ): Promise<boolean> => {
    try {
      // Check if user is authenticated
      const token = mongoAuthService.getToken();
      
      if (!token && (!contactDetails?.name || !contactDetails?.email)) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to contact property owners or provide your contact details',
          variant: 'destructive',
        });
        return false;
      }
      
      // Create inquiry with API
      await inquiryAPI.createInquiry(propertyId, message, !token ? contactDetails : undefined);
      
      toast({
        title: 'Inquiry Sent',
        description: 'Your message has been sent to the property owner',
      });
      
      // Refresh inquiries if user is logged in
      if (token) {
        refreshUserInquiries();
      }
      
      return true;
    } catch (error) {
      console.error('Error creating property inquiry:', error);
      toast({
        title: 'Error',
        description: 'Failed to send your inquiry. Please try again',
        variant: 'destructive',
      });
      return false;
    }
  }, [refreshUserInquiries]);

  // On mount, check if user is a seller and load appropriate inquiries
  useEffect(() => {
    const user = mongoAuthService.getCurrentUser();
    if (user) {
      if (user.isseller) {
        refreshSellerInquiries();
      } else {
        refreshUserInquiries();
      }
    } else {
      setLoading(false);
    }
  }, [refreshSellerInquiries, refreshUserInquiries]);

  return {
    inquiries: inquiriesList,
    loading,
    error,
    refreshUserInquiries,
    refreshSellerInquiries,
    respondToInquiry,
    createInquiry
  };
};

export default usePropertyInquiries;

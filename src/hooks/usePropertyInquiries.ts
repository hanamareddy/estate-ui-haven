
import { useState, useEffect, useCallback } from 'react';
import { inquiries } from '@/services/api';
import mongoAuthService from '@/services/mongoAuthService';

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
      const response = await inquiries.getUserInquiries();
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
      const response = await inquiries.getSellerInquiries();
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
      await inquiries.respondToInquiry(inquiryId, response);
      
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
    respondToInquiry
  };
};

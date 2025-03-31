
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { inquiryAPI } from '@/services/api';
import mongoAuthService from '@/services/mongoAuthService';

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  property_title?: string;
  property_address?: string;
  property_price?: number;
  property_image?: string;
  message: string;
  seller_response: string | null;
  status: "new" | "responded" | "closed";
  created_at: string;
  updated_at: string;
  buyerInfo?: {
    name: string;
    email: string;
    phone: string;
  };
}

export const usePropertyInquiries = () => {
  const [inquiries, setInquiries] = useState<PropertyInquiry[]>([]);
  const [sellerInquiries, setSellerInquiries] = useState<PropertyInquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      if (!mongoAuthService.isAuthenticated()) {
        setInquiries([]);
        setLoading(false);
        return;
      }
      
      // Fetch inquiries from backend API
      const response = await inquiryAPI.getUserInquiries();
      setInquiries(response.data || []);
    } catch (error) {
      console.error('Error fetching property inquiries:', error);
      setError('Failed to load your property inquiries');
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerInquiries = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated and is a seller
      if (!mongoAuthService.isAuthenticated() || !mongoAuthService.isSeller()) {
        setSellerInquiries([]);
        setLoading(false);
        return;
      }
      
      // Fetch seller inquiries from backend API
      const response = await inquiryAPI.getSellerInquiries();
      setSellerInquiries(response.data || []);
    } catch (error) {
      console.error('Error fetching seller inquiries:', error);
      setError('Failed to load property inquiries');
    } finally {
      setLoading(false);
    }
  };

  const createInquiry = async (propertyId: string, message: string, contactDetails?: {
    name: string;
    email: string;
    phone?: string;
  }) => {
    try {
      // Check if user is authenticated
      const isAuthenticated = mongoAuthService.isAuthenticated();
      
      if (!isAuthenticated && (!contactDetails?.name || !contactDetails?.email)) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to contact property owners or provide your contact details',
          variant: 'destructive',
        });
        return false;
      }
      
      // Create inquiry with API
      await inquiryAPI.createInquiry(propertyId, message, !isAuthenticated ? contactDetails : undefined);
      
      toast({
        title: 'Inquiry Sent',
        description: 'Your message has been sent to the property owner',
      });
      
      // Refresh inquiries if user is logged in
      if (isAuthenticated) {
        fetchUserInquiries();
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
  };

  const respondToInquiry = async (inquiryId: string, response: string) => {
    try {
      await inquiryAPI.respondToInquiry(inquiryId, response);
      
      toast({
        title: 'Response Sent',
        description: 'Your response has been sent to the interested buyer',
      });
      
      // Refresh seller inquiries
      fetchSellerInquiries();
      
      return true;
    } catch (error) {
      console.error('Error responding to inquiry:', error);
      toast({
        title: 'Error',
        description: 'Failed to send your response. Please try again',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    // Only fetch inquiries if there's an auth token
    if (mongoAuthService.isAuthenticated()) {
      fetchUserInquiries();
      if (mongoAuthService.isSeller()) {
        fetchSellerInquiries();
      }
    }
  }, []);

  return {
    inquiries,
    sellerInquiries,
    loading,
    error,
    createInquiry,
    respondToInquiry,
    refreshUserInquiries: fetchUserInquiries,
    refreshSellerInquiries: fetchSellerInquiries
  };
};

export default usePropertyInquiries;

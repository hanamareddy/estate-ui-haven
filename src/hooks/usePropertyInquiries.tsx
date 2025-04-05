
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { inquiryAPI } from '@/services/api';

export interface PropertyInquiry {
  id: string;
  propertyId: string;
  propertyTitle?: string;
  propertyAddress?: string;
  propertyPrice?: number;
  propertyImage?: string;
  message: string;
  sellerResponse: string | null;
  status: string;
  createdAt: string;
  updatedAt: string;
  buyerInfo?: {
    name: string;
    email: string;
    phone?: string;
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
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setInquiries([]);
        setLoading(false);
        return;
      }
      
      // Fetch inquiries from backend API
      const response = await inquiryAPI.getUserInquiries();
      setInquiries(response.data);
    } catch (error: any) {
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
      const token = localStorage.getItem('auth_token');
      
      if (!token) {
        setSellerInquiries([]);
        setLoading(false);
        return;
      }
      
      // Fetch seller inquiries from backend API
      const response = await inquiryAPI.getSellerInquiries();
      setSellerInquiries(response.data);
    } catch (error: any) {
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
      const token = localStorage.getItem('auth_token');
      
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
        fetchUserInquiries();
      }
      
      return true;
    } catch (error: any) {
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
    } catch (error: any) {
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
    if (localStorage.getItem('auth_token')) {
      fetchUserInquiries();
      fetchSellerInquiries();
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

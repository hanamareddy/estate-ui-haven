import { useState } from 'react';
import mongoAuthService from '@/services/mongoAuthService';
import { toast } from '@/components/ui/use-toast';
import { inquiryAPI, authAPI } from '@/services/api';
import { UserInquiry, SellerInquiry } from '@/types/propertyInquiry';

const usePropertyInquiries = () => {
  const [userInquiries, setUserInquiries] = useState<UserInquiry[]>([]);
  const [sellerInquiries, setSellerInquiries] = useState<SellerInquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUserInquiries = async () => {
    setLoading(true);
    setError(null);

    try {
      const token = mongoAuthService.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await inquiryAPI.getUserInquiries();

      if (response.status !== 200) {
        throw new Error('Failed to fetch inquiries');
      }

      const data = response.data;
      setUserInquiries(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching user inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSellerInquiries = async () => {
    // Only fetch seller inquiries if the user is a seller
    const currentUser = mongoAuthService.getCurrentUser();
    if (!currentUser || !currentUser.isseller) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = mongoAuthService.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await inquiryAPI.getSellerInquiries();

      if (response.status !== 200) {
        throw new Error('Failed to fetch seller inquiries');
      }

      const data = response.data;
      setSellerInquiries(data);
    } catch (err: any) {
      setError(err.message);
      console.error('Error fetching seller inquiries:', err);
    } finally {
      setLoading(false);
    }
  };

  const createInquiry = async (propertyId: string, message: string, contactDetails?: any) => {
    setLoading(true);
    setError(null);

    try {
      const token = mongoAuthService.getToken();
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };

      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await inquiryAPI.createInquiry(propertyId, message, contactDetails);

      if (response.status !== 201) {
        throw new Error('Failed to send inquiry');
      }

      const data = response.data;
      
      // Refresh the inquiries list after creating a new one
      fetchUserInquiries();
      
      toast({
        title: 'Inquiry Sent',
        description: 'Your inquiry has been sent to the property owner.',
      });

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error creating inquiry:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to send inquiry',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const respondToInquiry = async (inquiryId: string, response: string) => {
    // Only sellers can respond to inquiries
    const currentUser = mongoAuthService.getCurrentUser();
    if (!currentUser || !currentUser.isseller) {
      toast({
        title: 'Error',
        description: 'Only sellers can respond to inquiries',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const token = mongoAuthService.getToken();
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const apiResponse = await inquiryAPI.respondToInquiry(inquiryId, response);

      if (apiResponse.status !== 200) {
        throw new Error('Failed to send response');
      }

      const data = apiResponse.data;
      
      // Refresh the inquiries list after responding
      fetchSellerInquiries();
      
      toast({
        title: 'Response Sent',
        description: 'Your response has been sent to the user.',
      });

      return data;
    } catch (err: any) {
      setError(err.message);
      console.error('Error responding to inquiry:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to send response',
        variant: 'destructive',
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    userInquiries,
    sellerInquiries,
    loading,
    error,
    fetchUserInquiries,
    fetchSellerInquiries,
    createInquiry,
    respondToInquiry
  };
};

export default usePropertyInquiries;

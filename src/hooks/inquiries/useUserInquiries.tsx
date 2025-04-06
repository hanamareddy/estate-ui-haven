
import { useState, useEffect } from 'react';
import { UserInquiry } from '@/types/propertyInquiry';
import { inquiryAPI } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

const useUserInquiries = () => {
  const [inquiries, setInquiries] = useState<UserInquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await inquiryAPI.getUserInquiries();
      setInquiries(response.data);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch inquiries';
      setError(errorMsg);
      console.error('Error fetching user inquiries:', err);
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createInquiry = async (propertyId: string, message: string, contactDetails?: any) => {
    try {
      await inquiryAPI.createInquiry(propertyId, message, contactDetails);
      await fetchInquiries(); // Refresh the list
      
      toast({
        title: 'Inquiry Sent',
        description: 'Your inquiry has been sent to the property owner.',
      });
      return true;
    } catch (err: any) {
      console.error('Error creating inquiry:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to send inquiry',
        variant: 'destructive',
      });
      return false;
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, []);

  return {
    inquiries,
    loading,
    error,
    fetchInquiries,
    createInquiry
  };
};

export default useUserInquiries;

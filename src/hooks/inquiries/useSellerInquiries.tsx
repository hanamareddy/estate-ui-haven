
import { useState, useEffect } from 'react';
import { SellerInquiry } from '@/types/propertyInquiry';
import { inquiryAPI } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

const useSellerInquiries = () => {
  const [inquiries, setInquiries] = useState<SellerInquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const fetchInquiries = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await inquiryAPI.getSellerInquiries();
      setInquiries(response.data);
    } catch (err: any) {
      const errorMsg = err.message || 'Failed to fetch inquiries';
      setError(errorMsg);
      console.error('Error fetching seller inquiries:', err);
      toast({
        title: 'Error',
        description: errorMsg,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const respondToInquiry = async (inquiryId: string, response: string) => {
    try {
      await inquiryAPI.respondToInquiry(inquiryId, response);
      await fetchInquiries(); // Refresh the list
      
      toast({
        title: 'Response Sent',
        description: 'Your response has been sent to the buyer.',
      });
      return true;
    } catch (err: any) {
      console.error('Error sending response:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to send response',
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
    respondToInquiry
  };
};

export default useSellerInquiries;

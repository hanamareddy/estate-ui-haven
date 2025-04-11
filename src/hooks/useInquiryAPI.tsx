
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { inquiryAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';

export const useInquiryAPI = () => {
  const queryClient = useQueryClient();

  // Get all inquiries for the current user
  const useUserInquiries = () => {
    return useQuery({
      queryKey: ['userInquiries'],
      queryFn: async () => {
        const response = await inquiryAPI.getUserInquiries();
        return response.data;
      },
    });
  };

  // Get all inquiries for the seller's properties
  const useSellerInquiries = () => {
    return useQuery({
      queryKey: ['sellerInquiries'],
      queryFn: async () => {
        const response = await inquiryAPI.getSellerInquiries();
        return response.data;
      },
    });
  };

  // Create a new inquiry
  const useCreateInquiry = () => {
    return useMutation({
      mutationFn: ({ propertyId, message, contactDetails }: { propertyId: string; message: string; contactDetails?: any }) => 
        inquiryAPI.createInquiry(propertyId, message, contactDetails),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userInquiries'] });
        toast({
          title: "Inquiry Sent",
          description: "Your inquiry has been sent to the seller.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to send inquiry",
          variant: "destructive",
        });
      }
    });
  };

  // Respond to an inquiry
  const useRespondToInquiry = () => {
    return useMutation({
      mutationFn: ({ inquiryId, response }: { inquiryId: string; response: string }) => 
        inquiryAPI.respondToInquiry(inquiryId, response),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sellerInquiries'] });
        toast({
          title: "Response Sent",
          description: "Your response has been sent to the buyer.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to send response",
          variant: "destructive",
        });
      }
    });
  };

  // Update inquiry status
  const useUpdateInquiryStatus = () => {
    return useMutation({
      mutationFn: ({ inquiryId, status }: { inquiryId: string; status: string }) => 
        inquiryAPI.updateInquiryStatus(inquiryId, status),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['sellerInquiries'] });
        toast({
          title: "Status Updated",
          description: "The inquiry status has been updated.",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error",
          description: error.response?.data?.message || "Failed to update status",
          variant: "destructive",
        });
      }
    });
  };

  return {
    useUserInquiries,
    useSellerInquiries,
    useCreateInquiry,
    useRespondToInquiry,
    useUpdateInquiryStatus,
    // Direct API methods for non-hook usage
    createInquiry: inquiryAPI.createInquiry,
    getUserInquiries: inquiryAPI.getUserInquiries,
    getSellerInquiries: inquiryAPI.getSellerInquiries,
    respondToInquiry: inquiryAPI.respondToInquiry,
    updateInquiryStatus: inquiryAPI.updateInquiryStatus,
  };
};

export default useInquiryAPI;


import useUserInquiries from './inquiries/useUserInquiries';
import useSellerInquiries from './inquiries/useSellerInquiries'; 
import mongoAuthService from '@/services/mongoAuthService';

const usePropertyInquiries = () => {
  const userInquiriesHook = useUserInquiries();
  const sellerInquiriesHook = useSellerInquiries();
  
  const currentUser = mongoAuthService.getCurrentUser();
  const isSeller = currentUser?.isseller || false;

  return {
    // User inquiries (buyer side)
    userInquiries: userInquiriesHook.inquiries,
    fetchUserInquiries: userInquiriesHook.fetchInquiries,
    createInquiry: userInquiriesHook.createInquiry,
    
    // Seller inquiries
    sellerInquiries: isSeller ? sellerInquiriesHook.inquiries : [],
    fetchSellerInquiries: sellerInquiriesHook.fetchInquiries,
    respondToInquiry: sellerInquiriesHook.respondToInquiry,
    
    // Common properties
    loading: userInquiriesHook.loading || sellerInquiriesHook.loading,
    error: userInquiriesHook.error || sellerInquiriesHook.error
  };
};

export default usePropertyInquiries;

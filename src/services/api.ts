import axios from 'axios';
import mongoAuthService from './mongoAuthService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create an axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = mongoAuthService.getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API endpoints for Auth
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  forgotPassword: (email: string) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token: string, password: string) => api.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token: string) => api.get(`/auth/verify-email/${token}`),
  resendEmailVerification: (email: string) => api.post('/auth/resend-verification', { email }),
  googleSignIn: (credential: string) => api.post('/auth/google', { credential }),
  verifyPhoneOtp: (email: string, otp: string) => api.post('/auth/verify-phone', { email, otp }),
  resendPhoneOtp: (email: string) => api.post('/auth/resend-phone-otp', { email }),
  verifyToken: () => api.get('/auth/verify'),
};

// API endpoints for User
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data: any) => api.put('/users/profile', data),
  getNotifications: () => api.get('/users/notifications'),
  markNotificationRead: (id: string) => api.put(`/users/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/users/notifications/read-all'),
  getFavorites: () => api.get('/users/favorites'),
  addToFavorites: (propertyId: string) => api.post(`/users/favorites/${propertyId}`),
  removeFromFavorites: (propertyId: string) => api.delete(`/users/favorites/${propertyId}`),
  checkFavorite: (propertyId: string) => api.get(`/users/favorites/check/${propertyId}`),
  getSavedSearches: () => api.get('/users/saved-searches'),
  createSavedSearch: (searchData: any) => api.post('/users/saved-searches', searchData),
  updateSavedSearch: (id: string, searchData: any) => api.put(`/users/saved-searches/${id}`, searchData),
  deleteSavedSearch: (id: string) => api.delete(`/users/saved-searches/${id}`),
  toggleSearchNotifications: (id: string, enabled: boolean) => 
    api.put(`/users/saved-searches/${id}/notifications`, { enabled }),
  deleteSearch: (id: string) => api.delete(`/users/saved-searches/${id}`),
};

// API endpoints for Properties
export const propertyAPI = {
  getProperties: (filters: any) => api.get('/properties', { params: filters }),
  getProperty: (id: string) => api.get(`/properties/${id}`),
  createProperty: (propertyData: any) => api.post('/properties', propertyData),
  updateProperty: (id: string, propertyData: any) => api.put(`/properties/${id}`, propertyData),
  deleteProperty: (id: string) => api.delete(`/properties/${id}`),
  getSellerProperties: () => api.get('/properties/myseller/properties'),
  // Update analytics endpoint to match the backend route
  getAnalytics: (propertyId?: string) => api.get('/properties/analytics/data', { params: { propertyId } }),
};

// Property inquiries API functions
export const inquiryAPI = {
  // Create a new inquiry
  createInquiry: async (propertyId, message, contactDetails = {}) => {
    return await api.post('/inquiries', {
      propertyId,
      message,
      ...contactDetails
    });
  },
  
  // Get all inquiries for the current user
  getUserInquiries: async () => {
    return await api.get('/inquiries/user');
  },
  
  // Get all inquiries for the seller's properties
  getSellerInquiries: async () => {
    return await api.get('/inquiries/seller');
  },
  
  // Respond to an inquiry
  respondToInquiry: async (inquiryId, response) => {
    return await api.post(`/inquiries/${inquiryId}/respond`, { response });
  },
  
  // Update inquiry status
  updateInquiryStatus: async (inquiryId, status) => {
    return await api.put(`/inquiries/${inquiryId}/status`, { status });
  }
};

// Export the default API client
export default api;

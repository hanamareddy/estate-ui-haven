
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
const authAPI = {
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
const userAPI = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data: any) => api.put('/user/profile', data),
  getNotifications: () => api.get('/user/notifications'),
  markNotificationRead: (id: string) => api.put(`/user/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/user/notifications/read-all'),
  getFavorites: () => api.get('/user/favorites'),
  addToFavorites: (propertyId: string) => api.post(`/user/favorites/${propertyId}`),
  removeFromFavorites: (propertyId: string) => api.delete(`/user/favorites/${propertyId}`),
  checkFavorite: (propertyId: string) => api.get(`/user/favorites/check/${propertyId}`),
  getSavedSearches: () => api.get('/user/saved-searches'),
  createSavedSearch: (searchData: any) => api.post('/user/saved-searches', searchData),
  updateSavedSearch: (id: string, searchData: any) => api.put(`/user/saved-searches/${id}`, searchData),
  deleteSavedSearch: (id: string) => api.delete(`/user/saved-searches/${id}`),
  toggleSearchNotifications: (id: string, enabled: boolean) => 
    api.put(`/user/saved-searches/${id}/notifications`, { enabled }),
  deleteSearch: (id: string) => api.delete(`/user/saved-searches/${id}`),
};

// API endpoints for Properties
const propertyAPI = {
  getProperties: (filters: any) => api.get('/properties', { params: filters }),
  getProperty: (id: string) => api.get(`/properties/${id}`),
  createProperty: (propertyData: any) => api.post('/properties', propertyData),
  updateProperty: (id: string, propertyData: any) => api.put(`/properties/${id}`, propertyData),
  deleteProperty: (id: string) => api.delete(`/properties/${id}`),
  getSellerProperties: () => api.get('/properties/seller'),
};

// API endpoints for Inquiries
const inquiryAPI = {
  createInquiry: (propertyId: string, message: string, contactDetails?: any) => 
    api.post('/inquiries', { propertyId, message, contactDetails }),
  getUserInquiries: () => api.get('/inquiries/user'),
  getSellerInquiries: () => api.get('/inquiries/seller'),
  respondToInquiry: (inquiryId: string, response: string) => 
    api.post(`/inquiries/${inquiryId}/respond`, { response }),
};

// Export all API services
export {
  api as default,
  api,
  authAPI,
  userAPI,
  propertyAPI,
  inquiryAPI,
};

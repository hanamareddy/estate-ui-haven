
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
const auth = {
  register: (userData) => api.post('/auth/register', userData),
  login: (email, password) => api.post('/auth/login', { email, password }),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.post(`/auth/reset-password/${token}`, { password }),
  verifyEmail: (token) => api.get(`/auth/verify-email/${token}`),
  resendEmailVerification: (email) => api.post('/auth/resend-verification', { email }),
  googleSignIn: (credential) => api.post('/auth/google', { credential }),
  verifyPhoneOtp: (email, otp) => api.post('/auth/verify-phone', { email, otp }),
  resendPhoneOtp: (email) => api.post('/auth/resend-phone-otp', { email }),
};

// API endpoints for User
const user = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (data) => api.put('/user/profile', data),
  getNotifications: () => api.get('/user/notifications'),
  markNotificationRead: (id) => api.put(`/user/notifications/${id}/read`),
  markAllNotificationsRead: () => api.put('/user/notifications/read-all'),
  getFavorites: () => api.get('/user/favorites'),
  addToFavorites: (propertyId) => api.post(`/user/favorites/${propertyId}`),
  removeFromFavorites: (propertyId) => api.delete(`/user/favorites/${propertyId}`),
  checkFavorite: (propertyId) => api.get(`/user/favorites/check/${propertyId}`),
  getSavedSearches: () => api.get('/user/saved-searches'),
  createSavedSearch: (searchData) => api.post('/user/saved-searches', searchData),
  updateSavedSearch: (id, searchData) => api.put(`/user/saved-searches/${id}`, searchData),
  deleteSavedSearch: (id) => api.delete(`/user/saved-searches/${id}`),
  toggleSearchNotifications: (id, enabled) => 
    api.put(`/user/saved-searches/${id}/notifications`, { enabled }),
};

// API endpoints for Properties
const propertyAPI = {
  getProperties: (filters) => api.get('/properties', { params: filters }),
  getProperty: (id) => api.get(`/properties/${id}`),
  createProperty: (propertyData) => api.post('/properties', propertyData),
  updateProperty: (id, propertyData) => api.put(`/properties/${id}`, propertyData),
  deleteProperty: (id) => api.delete(`/properties/${id}`),
  getSellerProperties: () => api.get('/properties/seller'),
};

// API endpoints for Inquiries
const inquiries = {
  createInquiry: (inquiryData) => api.post('/inquiries', inquiryData),
  getUserInquiries: () => api.get('/inquiries/user'),
  getSellerInquiries: () => api.get('/inquiries/seller'),
  respondToInquiry: (id, response) => api.post(`/inquiries/${id}/respond`, { response }),
};

// Export all API services
export {
  api,
  auth,
  user as userAPI,
  propertyAPI,
  inquiries,
};

export default api;


import axios from 'axios';

const BASE_URL = process.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base configuration
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include token in requests
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle common errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_profile');
      
      // Only redirect to login if not already on auth page
      if (!window.location.pathname.includes('/auth')) {
        window.location.href = '/auth';
      }
    }
    return Promise.reject(error);
  }
);

// API service with specific endpoint handlers
export const api = {
  // Auth related endpoints
  auth: {
    register: (userData) => axiosInstance.post('/auth/register', userData),
    login: (email, password) => axiosInstance.post('/auth/login', { email, password }),
    verifyPhoneOtp: (email, otp) => axiosInstance.post('/auth/verify-phone-otp', { email, otp }),
    resendPhoneOtp: (email) => axiosInstance.post('/auth/resend-phone-otp', { email }),
    verifyEmail: (token) => axiosInstance.get(`/auth/verify-email/${token}`),
    resendEmailVerification: (email) => axiosInstance.post('/auth/resend-email-verification', { email }),
    forgotPassword: (email) => axiosInstance.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => axiosInstance.post('/auth/reset-password', { token, password }),
    googleSignIn: (credential) => axiosInstance.post('/auth/google', { credential }),
  },
  
  // User/profile related endpoints
  user: {
    getProfile: () => axiosInstance.get('/user/profile'),
    updateProfile: (profileData) => axiosInstance.put('/user/profile', profileData),
    updatePassword: (data) => axiosInstance.put('/user/password', data),
  },
  
  // Property related endpoints
  property: {
    getAllProperties: (filters) => axiosInstance.get('/properties', { params: filters }),
    getPropertyById: (id) => axiosInstance.get(`/properties/${id}`),
    createProperty: (propertyData) => axiosInstance.post('/properties', propertyData),
    updateProperty: (id, propertyData) => axiosInstance.put(`/properties/${id}`, propertyData),
    deleteProperty: (id) => axiosInstance.delete(`/properties/${id}`),
    getSellerProperties: () => axiosInstance.get('/properties/seller'),
    getNearbyProperties: (lat, lng, radius) => 
      axiosInstance.get('/properties/nearby', { params: { lat, lng, radius } }),
  },
  
  // Favorites related endpoints
  favorites: {
    getFavorites: () => axiosInstance.get('/favorites'),
    addFavorite: (propertyId) => axiosInstance.post('/favorites', { propertyId }),
    removeFavorite: (propertyId) => axiosInstance.delete(`/favorites/${propertyId}`),
  },
  
  // Property inquiries related endpoints
  inquiries: {
    createInquiry: (propertyId, inquiryData) => 
      axiosInstance.post(`/inquiries/${propertyId}`, inquiryData),
    getUserInquiries: () => axiosInstance.get('/inquiries/user'),
    getSellerInquiries: () => axiosInstance.get('/inquiries/seller'),
    updateInquiryStatus: (inquiryId, status) => 
      axiosInstance.put(`/inquiries/${inquiryId}/status`, { status }),
    respondToInquiry: (inquiryId, message) => 
      axiosInstance.post(`/inquiries/${inquiryId}/response`, { message }),
  },
  
  // Notifications related endpoints
  notifications: {
    getNotifications: () => axiosInstance.get('/notifications'),
    markAsRead: (notificationId) => 
      axiosInstance.put(`/notifications/${notificationId}/read`),
    markAllAsRead: () => axiosInstance.put('/notifications/read-all'),
    deleteNotification: (notificationId) => 
      axiosInstance.delete(`/notifications/${notificationId}`),
  },
  
  // Upload related endpoints
  upload: {
    uploadImage: (formData) => 
      axiosInstance.post('/upload/image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    uploadMultipleImages: (formData) => 
      axiosInstance.post('/upload/images', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      }),
    deleteImage: (publicId) => axiosInstance.delete(`/upload/image/${publicId}`),
  }
};

// Direct axios instance for any custom API calls
export default axiosInstance;

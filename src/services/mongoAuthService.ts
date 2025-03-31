
import { api } from './api';

const mongoAuthService = {
  /**
   * Register a new user
   * @param userData User registration data
   * @returns Promise with registration response
   */
  registerUser: async (userData) => {
    try {
      const response = await api.auth.register(userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Login with email and password
   * @param email User email
   * @param password User password
   * @returns Promise with login response including JWT token
   */
  loginWithEmailPassword: async (email, password) => {
    try {
      const response = await api.auth.login(email, password);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        
        // Store user profile for quick access
        if (response.data.user) {
          localStorage.setItem('user_profile', JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Sign in with Google
   * @param credential Google ID token
   * @returns Promise with Google sign-in response
   */
  signInWithGoogle: async (credential) => {
    try {
      const response = await api.auth.googleSignIn(credential);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        
        // Store user profile for quick access
        if (response.data.user) {
          localStorage.setItem('user_profile', JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Verify phone OTP
   * @param email User email
   * @param otp OTP code
   * @returns Promise with verification response
   */
  verifyPhoneOtp: async (email, otp) => {
    try {
      const response = await api.auth.verifyPhoneOtp(email, otp);
      
      // If verified and token provided, store it
      if (response.data.token) {
        localStorage.setItem('auth_token', response.data.token);
        
        // Store user profile for quick access
        if (response.data.user) {
          localStorage.setItem('user_profile', JSON.stringify(response.data.user));
        }
      }
      
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Resend phone OTP
   * @param email User email
   * @returns Promise with resend response
   */
  resendPhoneOtp: async (email) => {
    try {
      const response = await api.auth.resendPhoneOtp(email);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Request password reset
   * @param email User email
   * @returns Promise with reset request response
   */
  requestPasswordReset: async (email) => {
    try {
      const response = await api.auth.forgotPassword(email);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Reset password using token
   * @param token Reset token
   * @param password New password
   * @returns Promise with reset response
   */
  resetPassword: async (token, password) => {
    try {
      const response = await api.auth.resetPassword(token, password);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Sign out the current user
   */
  signOut: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
    // No need to call API endpoint for signout as we're using JWTs
  },

  /**
   * Get the current signed-in user
   * @returns User object or null if not signed in
   */
  getCurrentUser: () => {
    const userStr = localStorage.getItem('user_profile');
    return userStr ? JSON.parse(userStr) : null;
  },

  /**
   * Check if user is authenticated
   * @returns Boolean indicating if user is authenticated
   */
  isAuthenticated: () => {
    return !!localStorage.getItem('auth_token');
  },

  /**
   * Get authentication token
   * @returns JWT token or null
   */
  getToken: () => {
    return localStorage.getItem('auth_token');
  },

  /**
   * Verify email address
   * @param token Verification token
   * @returns Promise with verification response
   */
  verifyEmail: async (token) => {
    try {
      const response = await api.auth.verifyEmail(token);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  /**
   * Resend email verification
   * @param email User email
   * @returns Promise with resend response
   */
  resendEmailVerification: async (email) => {
    try {
      const response = await api.auth.resendEmailVerification(email);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default mongoAuthService;

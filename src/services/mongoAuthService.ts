
class MongoAuthService {
  private user: any | null = null;
  private token: string | null = null;

  constructor() {
    this.loadUserFromStorage();
  }

  async login(email: string, password: string) {
    try {
      const response = await authAPI.login(email, password);
      const { token, user, verificationStatus } = response.data;
      
      this.setAuthData(token, user);
      
      // Return user data with verification status
      return {
        ...user,
        verificationStatus
      };
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  async register(userData: any) {
    try {
      const response = await authAPI.register(userData);
      const { token, user } = response.data;
      
      if (token && user) {
        this.setAuthData(token, user);
      }
      return response.data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  async loginWithGoogle(credential: string) {
    try {
      const response = await authAPI.googleSignIn(credential);
      const { token, user, verificationStatus } = response.data;
      
      if (token && user) {
        this.setAuthData(token, user);
      }
      return {
        ...response.data,
        verificationStatus
      };
    } catch (error) {
      console.error('Google login failed:', error);
      throw error;
    }
  }

  async resetPassword(token: string, newPassword: string) {
    try {
      const response = await authAPI.resetPassword(token, newPassword);
      return response.data;
    } catch (error) {
      console.error('Password reset failed:', error);
      throw error;
    }
  }

  async forgotPassword(email: string) {
    try {
      const response = await authAPI.forgotPassword(email);
      return response.data;
    } catch (error) {
      console.error('Forgot password request failed:', error);
      throw error;
    }
  }

  async verifyEmail(token: string) {
    try {
      const response = await authAPI.verifyEmail(token);
      return response.data;
    } catch (error) {
      console.error('Email verification failed:', error);
      throw error;
    }
  }

  async resendVerificationEmail(email: string) {
    try {
      const response = await authAPI.resendEmailVerification(email);
      return response.data;
    } catch (error) {
      console.error('Resend verification email failed:', error);
      throw error;
    }
  }

  async verifyPhoneOtp(email: string, otp: string) {
    try {
      const response = await authAPI.verifyPhoneOtp(email, otp);
      const { token, user } = response.data;
      
      if (token && user) {
        this.setAuthData(token, user);
      }
      return response.data;
    } catch (error) {
      console.error('Phone OTP verification failed:', error);
      throw error;
    }
  }

  async resendPhoneOtp(email: string) {
    try {
      const response = await authAPI.resendPhoneOtp(email);
      return response.data;
    } catch (error) {
      console.error('Resend phone OTP failed:', error);
      throw error;
    }
  }

  logout() {
    this.user = null;
    this.token = null;
    localStorage.removeItem('auth_user');
    localStorage.removeItem('auth_token');
  }

  getCurrentUser() {
    return this.user;
  }

  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }

  isSeller() {
    return this.user && this.user.isseller === true;
  }
  
  getUserType() {
    if (!this.user) return null;
    return this.user.isseller ? 'seller' : 'buyer';
  }

  setAuthData(token: string, user: any) {
    this.token = token;
    this.user = user;
    
    localStorage.setItem('auth_token', token);
    localStorage.setItem('auth_user', JSON.stringify(user));
  }

  private loadUserFromStorage() {
    const token = localStorage.getItem('auth_token');
    const userJson = localStorage.getItem('auth_user');
    
    if (token && userJson) {
      this.token = token;
      try {
        this.user = JSON.parse(userJson);
      } catch (error) {
        console.error('Error parsing user data from localStorage', error);
        this.logout(); // Clear invalid data
      }
    }
  }

  async refreshUserData() {
    try {
      if (!this.isAuthenticated()) {
        return null;
      }
      
      const response = await authAPI.verifyToken();
      const user = response.data;
      
      if (user) {
        this.user = user;
        localStorage.setItem('auth_user', JSON.stringify(user));
      }
      
      return user;
    } catch (error) {
      console.error('Error refreshing user data:', error);
      this.logout();
      throw error;
    }
  }
}

// Import needed here to avoid circular dependencies
import { authAPI } from './api';

const mongoAuthService = new MongoAuthService();
export default mongoAuthService;

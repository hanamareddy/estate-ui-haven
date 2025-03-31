
import { authAPI } from './api';
import mongoAuthService from './mongoAuthService';

export async function signInWithGoogle(token: string) {
  try {
    const response = await authAPI.googleSignIn(token);
    
    if (response.data.token && response.data.user) {
      // Store user session using mongoAuthService
      mongoAuthService.setAuthData(response.data.token, response.data.user);
    }
    
    return response.data;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function signOut() {
  mongoAuthService.logout();
}

export async function getSession() {
  if (mongoAuthService.isAuthenticated()) {
    return {
      user: mongoAuthService.getCurrentUser(),
      token: mongoAuthService.getToken(),
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    };
  }
  return null;
}

export async function getCurrentUser() {
  // First try to get from mongoAuthService
  const user = mongoAuthService.getCurrentUser();
  if (user) return user;
  
  // If no user in service, try to verify token with API
  try {
    const response = await authAPI.verifyToken();
    const userData = response.data;
    if (userData) {
      mongoAuthService.setAuthData(mongoAuthService.getToken() || '', userData);
    }
    return userData;
  } catch (error) {
    return null;
  }
}

export async function getCurrentProfile() {
  const user = await getCurrentUser();
  return user;
}

export async function isUserSeller() {
  const user = await getCurrentUser();
  return user?.isseller || false;
}

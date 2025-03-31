
import { authAPI } from './api';

export async function signInWithGoogle(token: string) {
  try {
    const response = await authAPI.googleSignIn(token);
    
    // Store user in session
    localStorage.setItem('user_session', JSON.stringify({
      user: response.user,
      token: response.token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days
    }));
    
    return response;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function signOut() {
  authAPI.signOut();
  localStorage.removeItem('user_session');
}

export async function getSession() {
  const sessionStr = localStorage.getItem('user_session');
  if (!sessionStr) return null;
  
  try {
    const session = JSON.parse(sessionStr);
    // Check if session is expired
    if (new Date(session.expires_at) < new Date()) {
      localStorage.removeItem('user_session');
      return null;
    }
    return session;
  } catch (error) {
    localStorage.removeItem('user_session');
    return null;
  }
}

export async function getCurrentUser() {
  // First try to get from session
  const session = await getSession();
  if (session?.user) return session.user;
  
  // If no session, try to verify token with API
  try {
    return await authAPI.verifyToken();
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

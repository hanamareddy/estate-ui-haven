
import { connectToDatabase, collections, normalizeId } from '@/integrations/mongodb/client';

// Simple interface for Google auth payload
export interface GoogleAuthPayload {
  sub: string;
  email: string;
  name: string;
  picture?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  picture?: string;
  phone?: string;
  companyName?: string;
  reraId?: string; // Real Estate Regulatory Authority ID
  isseller?: boolean;
  created_at?: string;
  updated_at?: string;
}

// In browser environments, we can't use OAuth2Client directly
// so we'll use a simplified approach for frontend verification
export async function verifyGoogleToken(token: string) {
  try {
    // In a production app, we would send this token to our backend for verification
    // For this demo, we'll decode and trust the JWT token directly
    // WARNING: In production, always verify tokens server-side!
    const tokenParts = token.split('.');
    if (tokenParts.length !== 3) throw new Error("Invalid token format");
    
    const payload = JSON.parse(atob(tokenParts[1]));
    if (!payload) throw new Error("Invalid token payload");
    
    return payload;
  } catch (error) {
    console.error("Error verifying Google token:", error);
    throw new Error("Invalid Google token");
  }
}

export async function signInWithGoogle(token: string) {
  try {
    const payload = await verifyGoogleToken(token);
    const db = await connectToDatabase();
    
    // Check if user exists
    const usersCollection = db.collection(collections.users);
    const profilesCollection = db.collection(collections.profiles);
    
    let user = await usersCollection.findOne({ email: payload.email });
    
    if (!user) {
      // Create new user
      const newUser = {
        email: payload.email,
        googleId: payload.sub,
        created_at: new Date().toISOString()
      };
      
      const result = await usersCollection.insertOne(newUser);
      user = { ...newUser, _id: result.insertedId };
      
      // Create profile
      const newProfile = {
        user_id: result.insertedId,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
        isseller: false,
        created_at: new Date().toISOString()
      };
      
      await profilesCollection.insertOne(newProfile);
    }
    
    // Get profile
    const profile = await profilesCollection.findOne({ user_id: user._id });
    
    // Generate a session
    const session = {
      user: normalizeId(user),
      profile: normalizeId(profile),
      token: token,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
    };
    
    // Store session in localStorage
    localStorage.setItem('user_session', JSON.stringify(session));
    
    return session;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
}

export async function signOut() {
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
  const session = await getSession();
  return session?.user || null;
}

export async function getCurrentProfile() {
  const session = await getSession();
  return session?.profile || null;
}

export async function isUserSeller() {
  const profile = await getCurrentProfile();
  return profile?.isseller || false;
}

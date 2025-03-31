
import { supabase } from "@/integrations/supabase/client";

export const getUserSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  
  if (error) {
    console.error("Error getting session:", error);
    return null;
  }
  
  return data.session;
};

export const getUserProfile = async (userId: string) => {
  if (!userId) return null;
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  
  if (error) {
    console.error("Error getting user profile:", error);
    return null;
  }
  
  return data;
};

export const isUserLoggedIn = async () => {
  const session = await getUserSession();
  return !!session;
};

export const isUserSeller = async () => {
  const session = await getUserSession();
  if (!session) return false;
  
  const profile = await getUserProfile(session.user.id);
  return profile?.isseller || false;
};

export const redirectToAppropriateHome = async (navigate) => {
  const session = await getUserSession();
  if (!session) {
    navigate("/");
    return;
  }
  
  const profile = await getUserProfile(session.user.id);
  if (profile?.isseller) {
    navigate("/seller/dashboard");
  } else {
    navigate("/buyer/dashboard");
  }
};

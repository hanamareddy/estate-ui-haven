
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error during auth callback:', error);
        navigate('/auth');
        return;
      }
      
      if (data?.session) {
        // Get user profile
        try {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.session.user.id)
            .single();

          // Store user data in localStorage
          localStorage.setItem('user', JSON.stringify({
            ...data.session.user,
            profile: profileData
          }));
          
          // Redirect based on user role
          if (profileData?.isseller) {
            navigate('/seller/dashboard');
          } else {
            navigate('/');
          }
        } catch (profileError) {
          console.error('Error fetching profile:', profileError);
          navigate('/');
        }
      } else {
        navigate('/auth');
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Completing authentication...</h2>
        <p className="text-muted-foreground">Please wait while we log you in.</p>
      </div>
    </div>
  );
};

export default AuthCallback;

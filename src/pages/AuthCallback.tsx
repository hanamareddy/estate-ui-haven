
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import mongoAuthService from '@/services/mongoAuthService';

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      // Check if user is authenticated via token
      const user = mongoAuthService.getCurrentUser();
      
      if (user) {
        // Redirect based on user role
        if (user.isseller) {
          navigate('/seller/dashboard');
        } else {
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

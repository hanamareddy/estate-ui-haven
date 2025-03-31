
import React, { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import mongoAuthService from "@/services/mongoAuthService";
import { useNavigate } from 'react-router-dom';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, config: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

interface GoogleAuthButtonProps {
  isLoading: boolean;
  setIsLoading: (isLoading: boolean) => void;
  buttonText?: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({ 
  isLoading, 
  setIsLoading,
  buttonText = "Sign in with Google" 
}) => {
  const navigate = useNavigate();
  const googleButtonRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load the Google Identity script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google && googleButtonRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '123456789012-example.apps.googleusercontent.com',
          callback: handleGoogleResponse
        });

        window.google.accounts.id.renderButton(googleButtonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: 280
        });
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleGoogleResponse = async (response: any) => {
    setIsLoading(true);
    
    try {
      // Send the ID token to the backend
      const result = await mongoAuthService.loginWithGoogle(response.credential);
      
      // Handle the response based on whether it requires further verification or is a full login
      if (result.phoneVerificationRequired) {
        // If phone verification is required, redirect to the verification page
        navigate('/verify-phone', { state: { email: result.user.email } });
        
        toast({
          title: "One more step",
          description: "Please verify your phone number to complete sign in",
        });
      } else if (result.token && result.user) {
        // Successful login with token
        toast({
          title: "Signed in successfully",
          description: "Welcome to EstateHub India!",
        });
        
        // Redirect based on user role
        if (result.user.isseller) {
          navigate('/seller/dashboard');
        } else {
          navigate('/');
        }
      }
    } catch (error) {
      console.error('Google sign-in error:', error);
      toast({
        title: "Sign in failed",
        description: "Unable to sign in with Google. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Custom button that triggers Google sign-in
  const handleGoogleButtonClick = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    }
  };

  return (
    <>
      <div ref={googleButtonRef} className="hidden"></div>
      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={handleGoogleButtonClick}
        disabled={isLoading}
      >
        <svg viewBox="0 0 24 24" className="mr-2 h-4 w-4">
          <path
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            fill="#4285F4"
          />
          <path
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            fill="#34A853"
          />
          <path
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            fill="#FBBC05"
          />
          <path
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            fill="#EA4335"
          />
        </svg>
        {buttonText}
      </Button>
    </>
  );
};

export default GoogleAuthButton;

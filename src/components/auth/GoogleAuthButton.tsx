
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import mongoAuthService from "@/services/mongoAuthService";

// Define window with google property for TypeScript
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
  setIsLoading: (loading: boolean) => void;
  buttonText?: string;
}

const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  isLoading,
  setIsLoading,
  buttonText = "Sign in with Google"
}) => {
  const navigate = useNavigate();
  const buttonRef = React.useRef<HTMLDivElement>(null);

  const handleGoogleResponse = async (response: any) => {
    try {
      setIsLoading(true);
      
      // Send the ID token to your server for verification
      const result = await mongoAuthService.signInWithGoogle(response.credential);
      
      toast({
        title: "Welcome!",
        description: `You've successfully signed in with Google`,
      });
      
      // Check if phone verification is required
      if (result.phoneVerificationRequired) {
        // Handle phone verification flow
        return;
      }
      
      // Redirect based on user role
      if (result.user.isseller) {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error("Google auth error:", error);
      toast({
        title: "Sign In Failed",
        description: error.response?.data?.message || "Failed to authenticate with Google",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Load the Google Sign-In API script
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = initializeGoogleSignIn;
      
      return () => {
        document.body.removeChild(script);
      };
    } else {
      initializeGoogleSignIn();
    }
  }, []);

  const initializeGoogleSignIn = () => {
    if (window.google && buttonRef.current) {
      try {
        window.google.accounts.id.initialize({
          // Use environment variable for client ID
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || '1031747281129-ekvc1o4v9dq99oljr1dq8f9d5q1ejclt.apps.googleusercontent.com',
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'left',
          width: buttonRef.current.offsetWidth,
        });
        
        console.log("Google Sign-In button initialized");
      } catch (error) {
        console.error("Failed to initialize Google Sign-In:", error);
      }
    }
  };

  // Custom button implementation as a fallback
  const handleManualGoogleLogin = () => {
    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      toast({
        title: "Google Sign-In Not Available",
        description: "Please try again later or use another sign-in method",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full">
      <div ref={buttonRef} id="googleSignInButton" className="w-full"></div>
      
      {!window.google && (
        <Button
          type="button"
          variant="outline"
          className="w-full flex items-center justify-center gap-2 mt-2"
          onClick={handleManualGoogleLogin}
          disabled={isLoading}
        >
          <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
          </svg>
          <span>{buttonText}</span>
        </Button>
      )}
    </div>
  );
};

export default GoogleAuthButton;


import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import api from '@/services/api';
import { CheckCircle2, XCircle } from 'lucide-react';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (!token) {
          setError('Invalid verification link');
          setIsVerifying(false);
          return;
        }

        await api.get(`/api/auth/verify-email/${token}`);
        setIsSuccess(true);
        setIsVerifying(false);
        
        toast({
          title: "Email Verified",
          description: "Your email has been successfully verified! You can now login.",
        });
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/auth');
        }, 3000);
      } catch (error) {
        console.error('Email verification error:', error);
        setError('Invalid or expired verification link');
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Email Verification</CardTitle>
          <CardDescription>
            EstateHub India - Verify your email address
          </CardDescription>
        </CardHeader>
        
        <CardContent className="flex flex-col items-center justify-center space-y-4 py-8">
          {isVerifying ? (
            <div className="text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
              <p className="mt-4 text-lg">Verifying your email address...</p>
            </div>
          ) : isSuccess ? (
            <div className="text-center">
              <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Email Verified Successfully!</h3>
              <p className="mt-1 text-sm text-gray-500">
                Your email has been verified. You will be redirected to the login page shortly.
              </p>
              <Button 
                className="mt-6"
                onClick={() => navigate('/auth')}
              >
                Go to Login
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <XCircle className="mx-auto h-16 w-16 text-red-500" />
              <h3 className="mt-4 text-lg font-medium text-gray-900">Verification Failed</h3>
              <p className="mt-1 text-sm text-gray-500">{error}</p>
              <Button 
                className="mt-6"
                onClick={() => navigate('/auth')}
              >
                Go to Login
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VerifyEmail;

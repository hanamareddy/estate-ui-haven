
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import mongoAuthService from "@/services/mongoAuthService";

export interface OtpVerificationFormProps {
  email: string;
  onVerificationSuccess: (data: any) => void;
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({ 
  email, 
  onVerificationSuccess 
}) => {
  const [otp, setOtp] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtp(e.target.value);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsVerifying(true);
    
    try {
      // Verify OTP with API
      const result = await mongoAuthService.verifyPhoneOtp(email, otp);
      
      onVerificationSuccess(result);
      
      toast({
        title: "Verification Successful",
        description: "Your phone number has been verified.",
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      
      toast({
        title: "Verification Failed",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    
    try {
      // Request new OTP
      await mongoAuthService.resendPhoneOtp(email);
      
      toast({
        title: "OTP Sent",
        description: "A new verification code has been sent to your phone.",
      });
    } catch (error) {
      console.error('Resend OTP error:', error);
      
      toast({
        title: "Failed to Resend OTP",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  return (
    <form onSubmit={handleVerifyOtp}>
      <CardContent className="space-y-4">
        <div className="space-y-2 text-center">
          <h3 className="text-lg font-medium">Phone Verification</h3>
          <p className="text-sm text-muted-foreground">
            Enter the verification code sent to your phone
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="otp">Verification Code</Label>
          <Input
            id="otp"
            value={otp}
            onChange={handleOtpChange}
            placeholder="123456"
            className="text-center text-lg tracking-widest"
            minLength={6}
            maxLength={6}
            required
          />
        </div>
        <div className="text-center">
          <button
            type="button"
            onClick={handleResendOtp}
            className="text-xs text-accent underline-offset-4 hover:underline"
            disabled={isResending}
          >
            {isResending ? "Sending..." : "Didn't receive a code? Resend"}
          </button>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          disabled={isVerifying || otp.length < 6}
        >
          {isVerifying ? "Verifying..." : "Verify"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default OtpVerificationForm;


import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import mongoAuthService from "@/services/mongoAuthService";

interface OTPInput {
  value: string;
  ref: React.RefObject<HTMLInputElement>;
}

interface OtpVerificationFormProps {
  email: string;
  onVerificationSuccess: (data: any) => void;
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({ 
  email,
  onVerificationSuccess
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes countdown
  
  // Create an array of 6 OTP inputs with refs
  const otpInputs: OTPInput[] = Array(6).fill(0).map(() => ({
    value: '',
    ref: useRef<HTMLInputElement>(null)
  }));
  
  // Start countdown timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);
  
  // Format time as MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Handle input change
  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    const digit = value.replace(/\D/g, '');
    
    // Update the value
    otpInputs[index].value = digit;
    
    // Force re-render
    setIsLoading(prev => prev);
    
    // Move to next input if we have a digit
    if (digit && index < otpInputs.length - 1) {
      otpInputs[index + 1].ref.current?.focus();
    }
  };
  
  // Handle key down events
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otpInputs[index].value && index > 0) {
      otpInputs[index - 1].ref.current?.focus();
    }
  };
  
  // Handle paste event
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, otpInputs.length);
    
    if (!pasteData) return;
    
    // Fill inputs with pasted data
    [...pasteData].forEach((char, i) => {
      if (i < otpInputs.length) {
        otpInputs[i].value = char;
        // Force re-render
        setIsLoading(prev => prev);
      }
    });
    
    // Focus on the next empty input or the last one
    const nextEmptyIndex = pasteData.length < otpInputs.length ? pasteData.length : otpInputs.length - 1;
    otpInputs[nextEmptyIndex].ref.current?.focus();
  };
  
  // Handle verify button click
  const handleVerify = async () => {
    const otp = otpInputs.map(input => input.value).join('');
    
    if (otp.length !== otpInputs.length) {
      toast({
        title: "Incomplete OTP",
        description: "Please enter the complete verification code",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await mongoAuthService.verifyPhoneOTP(email, otp);
      onVerificationSuccess(response);
    } catch (error: any) {
      console.error('OTP verification error:', error);
      toast({
        title: "Verification Failed",
        description: error.response?.data?.message || "Invalid verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle resend button click
  const handleResend = async () => {
    setIsLoading(true);
    
    try {
      await mongoAuthService.resendPhoneOTP(email);
      
      // Reset timer
      setTimeLeft(180);
      
      toast({
        title: "OTP Resent",
        description: "A new verification code has been sent to your phone",
      });
    } catch (error: any) {
      console.error('Resend OTP error:', error);
      toast({
        title: "Resend Failed",
        description: error.response?.data?.message || "Failed to resend verification code. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div>
      <CardContent className="space-y-4 py-4">
        <div className="text-center mb-6">
          <h3 className="text-lg font-medium">Verify Your Phone</h3>
          <p className="text-sm text-muted-foreground">
            We've sent a verification code to your phone number
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="otp-input">Enter Verification Code</Label>
          <div className="flex justify-between gap-2">
            {otpInputs.map((input, index) => (
              <Input
                key={index}
                ref={input.ref}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{1}"
                maxLength={1}
                className="w-12 h-12 text-center text-lg"
                value={input.value}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
              />
            ))}
          </div>
        </div>
        
        <div className="flex justify-center items-center text-sm">
          <div className="flex flex-col items-center">
            {timeLeft > 0 ? (
              <span className="text-muted-foreground">Resend code in {formatTime()}</span>
            ) : (
              <button
                type="button"
                className="text-primary underline-offset-4 hover:underline"
                onClick={handleResend}
                disabled={isLoading}
              >
                Resend Verification Code
              </button>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleVerify}
          disabled={isLoading || otpInputs.some(input => !input.value)}
        >
          {isLoading ? "Verifying..." : "Verify"}
        </Button>
      </CardFooter>
    </div>
  );
};

export default OtpVerificationForm;

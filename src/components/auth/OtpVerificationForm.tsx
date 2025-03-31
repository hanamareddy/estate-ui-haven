import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { authAPI as authService } from "@/services/api";

interface OtpVerificationFormProps {
  email: string;
  redirectTo?: string;
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({ email, redirectTo }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [activeInput, setActiveInput] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resendCountdown, setResendCountdown] = useState(60); // Countdown in seconds
  const navigate = useNavigate();
  const { toast } = useToast();
  const location = useLocation();

  useEffect(() => {
    // Start countdown timer
    if (resendCountdown > 0) {
      const timer = setTimeout(() => {
        setResendCountdown(resendCountdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [resendCountdown]);

  const handleChange = (index: number, value: string) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      setActiveInput(index + 1);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1);
    }
  };

  // Fix the method names in the OTP verification functions
  const handleVerifyPhone = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");

    try {
      // Instead of verifyPhoneOTP, use verifyPhoneOtp (corrected case)
      const result = await authService.verifyPhoneOtp(email, otp.join(""));
      
      if (result) {
        toast({
          title: "Phone Verified",
          description: "Your phone number has been successfully verified.",
        });
        
        // The navigate path might need to be adjusted based on your app's flow
        if (redirectTo) {
          navigate(redirectTo);
        } else {
          navigate("/auth-callback");
        }
      }
    } catch (error: any) {
      console.error("Failed to verify phone:", error);
      setErrorMsg(error.response?.data?.message || "Failed to verify OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    setErrorMsg("");
    
    try {
      // Instead of resendPhoneOTP, use resendPhoneOtp (corrected case)
      await authService.resendPhoneOtp(email);
      
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your phone number.",
      });
      
      // Reset countdown timer
      setResendCountdown(60);
    } catch (error: any) {
      console.error("Failed to resend OTP:", error);
      setErrorMsg(error.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Verify Phone Number</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Enter the 6-digit code we sent to your phone number.
        </p>
        {errorMsg && (
          <p className="text-sm text-red-500 mt-2">{errorMsg}</p>
        )}
        <form onSubmit={handleVerifyPhone} className="space-y-4">
          <div className="flex justify-center items-center space-x-2 mt-4">
            {otp.map((digit, index) => (
              <Input
                key={index}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center rounded-md border border-input bg-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:opacity-50"
                disabled={isSubmitting}
                ref={(inputElement) => {
                  if (inputElement && activeInput === index) {
                    inputElement.focus();
                  }
                }}
              />
            ))}
          </div>
          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? "Verifying..." : "Verify Code"}
          </Button>
        </form>
        <div className="text-center mt-4">
          {resendCountdown > 0 ? (
            <p className="text-sm text-muted-foreground">
              Resend code in {resendCountdown} seconds
            </p>
          ) : (
            <Button
              variant="link"
              onClick={handleResendOtp}
              disabled={isResending}
            >
              {isResending ? "Resending..." : "Resend Code"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default OtpVerificationForm;

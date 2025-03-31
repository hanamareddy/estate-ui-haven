
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/components/ui/use-toast";
import { Lock, Eye, EyeOff, CheckCircle, XCircle } from "lucide-react";
import mongoAuthService from "@/services/mongoAuthService";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  const { token } = useParams();
  const navigate = useNavigate();
  
  // Validate token format
  useEffect(() => {
    if (!token || token.length < 10) {
      setIsError(true);
      setErrorMessage("Invalid password reset token. Please request a new password reset link.");
    }
  }, [token]);

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords match
    if (password !== confirmPassword) {
      toast({
        title: "Passwords Don't Match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    // Validate password strength
    if (password.length < 8) {
      toast({
        title: "Password Too Weak",
        description: "Password must be at least 8 characters long.",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      await mongoAuthService.resetPassword(token, password);
      setIsSuccess(true);
      
      toast({
        title: "Password Reset Successful",
        description: "Your password has been reset. You can now login with your new password.",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      setIsError(true);
      setErrorMessage(error.response?.data?.message || "Failed to reset password. The link may be expired or invalid.");
      
      toast({
        title: "Password Reset Failed",
        description: error.response?.data?.message || "Failed to reset password. The link may be expired or invalid.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6 space-y-4 text-center">
            <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
            <CardTitle className="text-xl">Password Reset Successful</CardTitle>
            <CardDescription>
              Your password has been reset successfully. You can now login with your new password.
            </CardDescription>
            <div className="pt-4">
              <Button onClick={() => navigate("/auth")}>
                Go to Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md shadow-lg">
          <CardContent className="pt-6 space-y-4 text-center">
            <XCircle className="mx-auto h-16 w-16 text-red-500" />
            <CardTitle className="text-xl">Password Reset Failed</CardTitle>
            <CardDescription>
              {errorMessage}
            </CardDescription>
            <div className="pt-4">
              <Button onClick={() => navigate("/forgot-password")}>
                Request New Reset Link
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your new password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                />
                <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute right-3 top-2.5 text-muted-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="pl-10"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  minLength={8}
                />
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Password must be at least 8 characters long.
            </p>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Resetting Password..." : "Reset Password"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ResetPassword;

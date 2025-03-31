
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import OtpVerificationForm from "./OtpVerificationForm";
import GoogleAuthButton from "./GoogleAuthButton";
import mongoAuthService from "@/services/mongoAuthService";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  
  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleVerificationSuccess = (data) => {
    // If login successful after verification
    if (data.token) {
      toast({
        title: "Login Successful",
        description: "Welcome back to EstateHub India!",
      });
      
      // Redirect based on user role
      if (data.user.isseller) {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } else {
      // If email verification still needed
      setShowOtpVerification(false);
      
      toast({
        title: "Phone Verified",
        description: "Your phone has been verified. Please verify your email to complete login.",
      });
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await mongoAuthService.login(loginForm.email, loginForm.password);
      
      // Login successful
      toast({
        title: "Login Successful",
        description: "Welcome back to EstateHub India!",
      });
      
      // Redirect based on user role
      if (response.isseller) {
        navigate('/seller/dashboard');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Login error:', error);
      
      // Handle phone verification required
      if (error.response?.status === 401 && error.response?.data?.phoneVerificationRequired) {
        setShowOtpVerification(true);
        
        toast({
          title: "Phone Verification Required",
          description: "Please verify your phone number to continue",
        });
      }
      // Handle email verification required
      else if (error.response?.status === 401 && error.response?.data?.emailVerificationRequired) {
        toast({
          title: "Email Verification Required",
          description: "Please check your email for a verification link",
          variant: "destructive",
        });
      }
      // Handle other errors
      else {
        toast({
          title: "Login Failed",
          description: error.response?.data?.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (showOtpVerification) {
    return (
      <OtpVerificationForm 
        email={loginForm.email} 
        onVerificationSuccess={handleVerificationSuccess} 
      />
    );
  }

  return (
    <form onSubmit={handleLoginSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="you@example.com"
              className="pl-10"
              value={loginForm.email}
              onChange={handleLoginChange}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="password">Password</Label>
            <Link
              to="/forgot-password"
              className="text-sm text-accent underline-offset-4 hover:underline"
            >
              Forgot password?
            </Link>
          </div>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10"
              value={loginForm.password}
              onChange={handleLoginChange}
              required
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
        
        <div className="relative flex items-center justify-center">
          <div className="absolute border-t border-gray-300 w-full"></div>
          <div className="relative px-4 bg-white text-sm text-gray-500">Or continue with</div>
        </div>
        
        <GoogleAuthButton isLoading={isLoading} setIsLoading={setIsLoading} />
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Processing..." : "Sign In"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default LoginForm;


import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Building, User, Mail, Lock, Phone, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CardContent, CardFooter } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import OtpVerificationForm from "./OtpVerificationForm";
import GoogleAuthButton from "./GoogleAuthButton";
import mongoAuthService from "@/services/mongoAuthService";

const SignupForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    isseller: false,
    companyName: "",
    reraId: "", // Real Estate Regulatory Authority ID
  });
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [registrationComplete, setRegistrationComplete] = useState(false);

  const navigate = useNavigate();

  const toggleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSignupChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSignupForm({ 
      ...signupForm, 
      [name]: type === "checkbox" ? checked : value 
    });
  };

  const handleVerificationSuccess = (data) => {
    toast({
      title: "Phone Verified",
      description: "Your phone number has been verified. Please check your email to complete registration.",
    });
    
    setShowOtpVerification(false);
    setRegistrationComplete(true);
  };

  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Format phone number if needed
      const formattedPhone = signupForm.phone.startsWith('+') ? signupForm.phone : `+${signupForm.phone}`;
      
      const response = await mongoAuthService.registerUser({
        ...signupForm,
        phone: formattedPhone
      });
      
      // Check if phone verification is required
      if (response.phoneVerificationRequired) {
        setShowOtpVerification(true);
        
        toast({
          title: "Registration Initiated",
          description: "Please verify your phone number to continue. An OTP has been sent to your phone.",
        });
      } else {
        setRegistrationComplete(true);
        
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please check your email for verification.",
        });
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      toast({
        title: "Registration Failed",
        description: error.response?.data?.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (showOtpVerification) {
    return (
      <OtpVerificationForm 
        email={signupForm.email} 
        onVerificationSuccess={handleVerificationSuccess} 
      />
    );
  }

  if (registrationComplete) {
    return (
      <CardContent className="space-y-4 py-8">
        <div className="text-center">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h3 className="mt-4 text-lg font-medium">Registration Successful!</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account has been created. Please check your email for verification.
          </p>
          <Button 
            className="mt-6"
            onClick={() => navigate('/auth')}
          >
            Go to Login
          </Button>
        </div>
      </CardContent>
    );
  }

  return (
    <form onSubmit={handleSignupSubmit}>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="name"
              name="name"
              placeholder="John Doe"
              className="pl-10"
              value={signupForm.name}
              onChange={handleSignupChange}
              required
            />
          </div>
        </div>
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
              value={signupForm.email}
              onChange={handleSignupChange}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              className="pl-10"
              value={signupForm.password}
              onChange={handleSignupChange}
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
        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 9876543210"
              className="pl-10"
              value={signupForm.phone}
              onChange={handleSignupChange}
              required
            />
          </div>
          <p className="text-xs text-muted-foreground">Include country code (e.g., +91 for India)</p>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="isseller"
            name="isseller"
            checked={signupForm.isseller}
            onCheckedChange={(checked) => 
              setSignupForm({
                ...signupForm,
                isseller: checked === true
              })
            }
          />
          <label
            htmlFor="isseller"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Register as a Property Seller/Agent
          </label>
        </div>

        {signupForm.isseller && (
          <>
            <div className="space-y-2">
              <Label htmlFor="companyName">Company/Agency Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="companyName"
                  name="companyName"
                  placeholder="Your Company Name"
                  className="pl-10"
                  value={signupForm.companyName}
                  onChange={handleSignupChange}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reraId">RERA ID</Label>
              <Input
                id="reraId"
                name="reraId"
                placeholder="RERA Registration Number"
                value={signupForm.reraId}
                onChange={handleSignupChange}
              />
              <p className="text-xs text-muted-foreground">
                Real Estate Regulatory Authority registration number
              </p>
            </div>
          </>
        )}

        <Separator />
        
        <GoogleAuthButton isLoading={isLoading} setIsLoading={setIsLoading} buttonText="Sign up with Google" />

        <div className="text-xs text-muted-foreground">
          By signing up, you agree to our{" "}
          <Link
            to="/terms"
            className="text-accent underline-offset-4 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            to="/privacy"
            className="text-accent underline-offset-4 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </div>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </CardFooter>
    </form>
  );
};

export default SignupForm;

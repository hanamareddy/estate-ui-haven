
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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
import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import mongoAuthService from "@/services/mongoAuthService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await mongoAuthService.requestPasswordReset(email);
      setIsSuccess(true);
      
      toast({
        title: "Reset Link Sent",
        description: "If the email exists in our system, you will receive a password reset link",
      });
    } catch (error) {
      console.error("Password reset error:", error);
      
      // We don't reveal if the email exists or not for security reasons
      toast({
        title: "Reset Link Sent",
        description: "If the email exists in our system, you will receive a password reset link",
      });
      
      setIsSuccess(true);
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
            <CardTitle className="text-xl">Check Your Email</CardTitle>
            <CardDescription>
              We've sent a password reset link to {email}. Please check your inbox and follow the instructions.
            </CardDescription>
            <p className="text-sm text-muted-foreground">
              Didn't receive an email? Check your spam folder or make sure the email address is correct.
            </p>
            <div className="pt-4">
              <Button onClick={() => navigate("/auth")}>
                Return to Login
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
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 mr-2"
              onClick={() => navigate("/auth")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Back</span>
            </Button>
            <CardTitle className="text-2xl">Forgot Password</CardTitle>
          </div>
          <CardDescription>
            Enter your email address and we'll send you a link to reset your password
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? "Sending Reset Link..." : "Send Reset Link"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default ForgotPassword;

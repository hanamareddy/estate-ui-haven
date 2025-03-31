
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import mongoAuthService from "@/services/mongoAuthService";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await mongoAuthService.forgotPassword(email);
      
      setIsComplete(true);
      toast({
        title: "Reset Link Sent",
        description: "Please check your email for password reset instructions.",
      });
    } catch (error) {
      console.error("Password reset request error:", error);
      toast({
        title: "Failed to Send Reset Link",
        description: "There was an error processing your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
          <CardDescription>
            {isComplete
              ? "Reset link has been sent to your email address."
              : "Enter your email address and we'll send you a password reset link."}
          </CardDescription>
        </CardHeader>
        
        {!isComplete ? (
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
            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Reset Link"}
              </Button>
              <Link to="/auth" className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to login
              </Link>
            </CardFooter>
          </form>
        ) : (
          <CardFooter className="flex flex-col space-y-4">
            <p className="text-center text-muted-foreground text-sm mb-4">
              If your email is registered with us, you should receive a password reset link shortly. Please check your inbox and spam folder.
            </p>
            <Link to="/auth" className="flex items-center justify-center text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to login
            </Link>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default ForgotPassword;

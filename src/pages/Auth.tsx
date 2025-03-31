
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LoginForm from "@/components/auth/LoginForm";
import SignupForm from "@/components/auth/SignupForm";
import mongoAuthService from "@/services/mongoAuthService";

const Auth = () => {
  const navigate = useNavigate();
  
  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const user = mongoAuthService.getCurrentUser();
      if (user) {
        // Redirect based on user role
        if (user.isseller) {
          navigate('/seller/dashboard');
        } else {
          navigate('/');
        }
      }
    };
    
    checkAuth();
  }, [navigate]);
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">EstateHub India</CardTitle>
          <CardDescription>
            Your trusted platform for Indian real estate
          </CardDescription>
        </CardHeader>
        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default Auth;

import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import SellerDashboard from "./pages/SellerDashboard";
import PropertyEdit from "./pages/PropertyEdit";
import PropertyUpload from "./pages/PropertyUpload";
import MarketTrends from "./components/MarketTrends";
import Auth from "./pages/Auth";
import UserProfile from "./pages/UserProfile";
import BuyerDashboard from "./pages/BuyerDashboard";
import NearbyProperties from "./pages/NearbyProperties";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import mongoAuthService from "./services/mongoAuthService";
import MobileNavBar from "./components/MobileNavBar";

const queryClient = new QueryClient();

// Protected route component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const user = mongoAuthService.getCurrentUser();
      
      if (user) {
        setIsAuthenticated(true);
        
        if (requiredRole) {
          if (requiredRole === 'seller' && user.isseller) {
            setIsAuthorized(true);
          } else if (requiredRole === 'buyer' && !user.isseller) {
            setIsAuthorized(true);
          } else if (requiredRole === 'any') {
            setIsAuthorized(true);
          }
        } else {
          setIsAuthorized(true);
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, [requiredRole]);
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }
  
  if (requiredRole && !isAuthorized) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/verify-email/:token" element={<VerifyEmail />} />
            <Route path="/market-trends" element={<MarketTrends />} />
            <Route path="/property/nearby" element={<NearbyProperties />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            
            <Route 
              path="/seller/dashboard" 
              element={
                <ProtectedRoute requiredRole="seller">
                  <SellerDashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/seller/property/add" 
              element={
                <ProtectedRoute requiredRole="seller">
                  <PropertyUpload />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/seller/property/edit/:id" 
              element={
                <ProtectedRoute requiredRole="seller">
                  <PropertyEdit />
                </ProtectedRoute>
              } 
            />
            
            <Route
              path="/buyer/dashboard"
              element={
                <ProtectedRoute requiredRole="buyer">
                  <BuyerDashboard />
                </ProtectedRoute>
              }
            />
            
            <Route
              path="/profile"
              element={
                <ProtectedRoute requiredRole="any">
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

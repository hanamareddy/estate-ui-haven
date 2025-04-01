import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyForm from "@/components/property/PropertyForm";
import { toast } from "@/components/ui/use-toast";
import { propertyAPI } from "@/services/api";
import mongoAuthService from "@/services/mongoAuthService";

const PropertyUpload = () => {
  const navigate = useNavigate();  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check if user is a seller
  useEffect(() => {
    const checkSellerStatus = async () => {
      const currentUser = mongoAuthService.getCurrentUser();

      if (!currentUser) {
        toast({
          title: "Authentication Required",
          description: "Please log in to list properties",
          variant: "destructive",
        });
        navigate("/auth");
      } else if (!currentUser.isseller) {
        toast({
          title: "Seller Account Required",
          description: "You need a seller account to list properties",
          variant: "destructive",
        });
        navigate("/");
      }
    };

    checkSellerStatus();
  }, [navigate]);

  // Handle form submission
  const handleSubmit = async (formData) => {
    setIsSubmitting(true);

    try {
      // Send data to the API
      const newProperty = await propertyAPI.createProperty(formData);

      toast({
        title: "Property Added",
        description: `Successfully added property: ${newProperty.title}`,
      });

      navigate("/seller/dashboard");
    } catch (error) {
      console.error("Error creating property:", error);
      toast({
        title: "Error",
        description: "Failed to add property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="gap-2 mb-4"
          onClick={() => navigate("/seller/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>

        <h1 className="text-3xl font-bold">Add New Property</h1>
        <p className="text-muted-foreground mt-1">
          Fill in the details below to list your property in the Indian real estate market
        </p>
      </div>

      <PropertyForm 
        onSubmit={handleSubmit}
        isLoading={isSubmitting}
      />
    </div>
  );
};

export default PropertyUpload;

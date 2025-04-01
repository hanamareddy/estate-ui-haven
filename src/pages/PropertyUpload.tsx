import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyForm from "@/components/property/PropertyForm";
import { toast } from "@/components/ui/use-toast";
import usePropertyAPI from "@/hooks/usePropertyAPI";

const PropertyUpload = () => {
  const navigate = useNavigate();
  const { useCreateProperty } = usePropertyAPI();
  const createPropertyMutation = useCreateProperty();
  
  // Handle form submission
  const handleSubmit = async (formData: any) => {
    try {
      await createPropertyMutation.mutateAsync(formData);
      // Navigation will be handled by the mutation's onSuccess callback
    } catch (error) {
      // Error handling is already implemented in the mutation
      console.error("Error creating property:", error);
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
        isLoading={createPropertyMutation.isPending}
      />
    </div>
  );
};

export default PropertyUpload;

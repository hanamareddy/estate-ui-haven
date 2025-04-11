
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PropertyForm from "@/components/property/PropertyForm";
import { toast } from "@/hooks/use-toast";
import usePropertyAPI from "@/hooks/usePropertyAPI";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import MobileNavBar from '@/components/MobileNavBar';
import mongoAuthService from "@/services/mongoAuthService";

const PropertyUpload = () => {
  const navigate = useNavigate();
  const { useCreateProperty } = usePropertyAPI();
  const createPropertyMutation = useCreateProperty();
  
  const handleSubmit = async (formData: any) => {
    try {
      const user = mongoAuthService.getCurrentUser();
      if (!user) {
        toast({
          title: 'Error',
          description: 'You must be logged in to upload a property.',
          variant: 'destructive',
        });
        return;
      }
      
      // Process form data for API
      const propertyData = {
        ...formData,
        bedrooms: Number(formData.bedrooms),
        bathrooms: Number(formData.bathrooms),
        sqft: Number(formData.size),
        price: Number(formData.price),
        constructionYear: formData.yearbuilt,
        sellerId: user.id,
        sellerContact: user.phone || '',
        sellerEmail: user.email || '',
      };
      
      await createPropertyMutation.mutateAsync(propertyData);
      toast({
        title: "Success",
        description: "Property created successfully!",
      });
      navigate('/seller/dashboard');
    } catch (error) {
      console.error("Error creating property:", error);
      toast({
        title: "Error",
        description: "Failed to create property",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add New Property</h1>
          <p className="text-muted-foreground mt-2">
            Create a new property listing with all the details
          </p>
        </div>
        
        <PropertyForm 
          onSubmit={handleSubmit}
          isSubmitting={createPropertyMutation.isPending}
          submitButtonText="Create Property"
          cancelButtonText="Cancel"
          onCancel={() => navigate('/seller/dashboard')}
        />
      </div>
      <MobileNavBar />
    </div>
  );
};

export default PropertyUpload;

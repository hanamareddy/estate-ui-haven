
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import PropertyForm from "@/components/property/PropertyForm";
import { toast } from "@/components/ui/use-toast";
import usePropertyAPI from "@/hooks/usePropertyAPI";
import { useState } from 'react';
import Navbar from '@/components/Navbar';
import MobileNavBar from '@/components/MobileNavBar';

const PropertyUpload = () => {
  const navigate = useNavigate();
  const { useCreateProperty } = usePropertyAPI();
  const createPropertyMutation = useCreateProperty();
  
  const handleSubmit = async (formData: any) => {
    try {
      await createPropertyMutation.mutateAsync(formData);
    } catch (error) {
      console.error("Error creating property:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Add New Property</h1>
        </div>
        
        <PropertyForm 
          onSubmit={handleSubmit}
          isLoading={createPropertyMutation.isPending}
        />
      </div>
      <MobileNavBar />
    </div>
  );
};

export default PropertyUpload;

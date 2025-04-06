
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import PropertyEdit from '@/components/PropertyEdit';
import { toast } from '@/hooks/use-toast';
import MobileNavBar from '@/components/MobileNavBar';

const PropertyEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  if (!id) {
    toast({
      title: 'Error',
      description: 'Property ID is missing.',
      variant: 'destructive',
    });
    navigate('/seller/dashboard');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-16 md:pb-0">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Edit Property</h1>
          <p className="text-muted-foreground mt-2">
            Update your property listing details and images
          </p>
        </div>
        
        <PropertyEdit
          propertyId={id}
          onSuccess={() => {
            navigate('/seller/dashboard');
          }}
          onCancel={() => {
            navigate('/seller/dashboard');
          }}
        />
      </div>
      <MobileNavBar />
    </div>
  );
};

export default PropertyEditPage;

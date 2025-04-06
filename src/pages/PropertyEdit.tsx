
import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import PropertyEdit from '@/components/PropertyEdit';
import { toast } from '@/hooks/use-toast';
import MobileNavBar from '@/components/MobileNavBar';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const PropertyEditPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const idRef = useRef(id);
  
  // Store ID in ref to prevent unnecessary re-renders
  useEffect(() => {
    if (id) {
      idRef.current = id;
    }
  }, [id]);
  
  if (!idRef.current) {
    toast({
      title: 'Error',
      description: 'Property ID is missing.',
      variant: 'destructive',
    });
    navigate('/seller/dashboard');
    return null;
  }

  const handleSuccess = () => {
    navigate('/seller/dashboard');
  };

  const handleCancel = () => {
    navigate('/seller/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-0">
      <Navbar />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-4 sm:mb-6 flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="mr-3" 
            onClick={() => navigate('/seller/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Edit Property</h1>
            <p className="text-muted-foreground text-sm sm:text-base mt-1">
              Update your property listing details and images
            </p>
          </div>
        </div>
        
        <PropertyEdit
          propertyId={idRef.current}
          onSuccess={handleSuccess}
          onCancel={handleCancel}
        />
      </div>
      <MobileNavBar />
    </div>
  );
};

export default PropertyEditPage;

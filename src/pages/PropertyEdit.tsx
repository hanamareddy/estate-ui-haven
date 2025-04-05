
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import PropertyForm from '@/components/property/PropertyForm';
import { toast } from '@/components/ui/use-toast';
import MobileNavBar from '@/components/MobileNavBar';
import usePropertyAPI from '@/hooks/usePropertyAPI';
import mongoAuthService from '@/services/mongoAuthService';
import { Loader2 } from 'lucide-react';

const PropertyEdit = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { useUpdateProperty, getProperty } = usePropertyAPI();
  const updateMutation = useUpdateProperty();
  
  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        toast({
          title: 'Error',
          description: 'Property ID is missing.',
          variant: 'destructive',
        });
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const response = await getProperty(id);
        if (response && response.data) {
          setProperty(response.data);
        } else {
          toast({
            title: 'Error',
            description: 'Property not found.',
            variant: 'destructive',
          });
          navigate('/seller/dashboard');
        }
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load property details.',
          variant: 'destructive',
        });
        console.error(error);
        navigate('/seller/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate, getProperty]);

  const handlePropertyUpdate = async (updatedData) => {
    try {
      // Ensure user is authenticated
      const user = mongoAuthService.getCurrentUser();
      if (!user || !user.isseller) {
        toast({
          title: 'Permission Denied',
          description: 'Only sellers can update properties.',
          variant: 'destructive',
        });
        return;
      }

      // Update the property
      await updateMutation.mutateAsync({ 
        id, 
        data: {
          ...updatedData,
          updatedAt: new Date().toISOString(),
          seller: user.id
        }
      });

      toast({
        title: 'Success',
        description: 'Property updated successfully!',
      });
      
      navigate('/seller/dashboard');
    } catch (error) {
      console.error('Error updating property:', error);
      toast({
        title: 'Update Failed',
        description: error.response?.data?.message || 'An error occurred while updating the property.',
        variant: 'destructive',
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!property) {
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
        
        <PropertyForm 
          onSubmit={handlePropertyUpdate} 
          isLoading={updateMutation.isPending}
          property={property}
        />
      </div>
      <MobileNavBar />
    </div>
  );
};

export default PropertyEdit;

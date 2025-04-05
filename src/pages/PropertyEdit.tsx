
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import PropertyForm from '@/components/property/PropertyForm';
import usePropertyAPI from '@/hooks/usePropertyAPI';

import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import MobileNavBar from '@/components/MobileNavBar';

const PropertyEdit = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { useUpdateProperty,useProperty} = usePropertyAPI();

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
         const { data: data, isLoading, error } = useProperty(id || '');

        if (error) {
          throw error;
        }

        if (data) {
          setProperty(data);
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
        console.log(error.message);
        navigate('/seller/dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
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
        </div>
        
        <PropertyForm 
          onSubmit={(data) => console.log(data)} 
          isLoading={false}
          property={property}
        />
      </div>
      <MobileNavBar />
    </div>
  );
};

export default PropertyEdit;

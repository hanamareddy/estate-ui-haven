
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import PropertyForm from '@/components/property/PropertyForm';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import BackToHomeButton from '@/components/BackToHomeButton';

const PropertyEdit = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
        const { data, error } = await supabase
          .from('properties')
          .select('*')
          .eq('id', id)
          .single();

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
          description: error.message || 'Failed to load property details.',
          variant: 'destructive',
        });
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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Edit Property</h1>
          <div className="flex gap-4">
            <BackToHomeButton />
          </div>
        </div>
        
        <PropertyForm 
          onSubmit={(data) => console.log(data)} 
          isLoading={false}
          property={property}
        />
      </div>
    </div>
  );
};

export default PropertyEdit;

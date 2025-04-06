
import React from 'react';
import { usePropertyAPI } from '@/hooks/usePropertyAPI';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Property } from '@/types/databaseModels';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Loader2, Save, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PropertyForm from '@/components/property/PropertyForm';

interface PropertyEditProps {
  propertyId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PropertyEdit = ({ propertyId, onSuccess, onCancel }: PropertyEditProps) => {
  const { getProperty, useUpdateProperty } = usePropertyAPI();
  const updateMutation = useUpdateProperty();
  const navigate = useNavigate();
  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchProperty = async () => {
      setIsLoading(true);
      try {
        const response = await getProperty(propertyId);
        if (response && response.data) {
          setProperty(response.data);
        } else {
          throw new Error("Property not found");
        }
      } catch (err) {
        console.error("Error fetching property:", err);
        setError(err as Error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, getProperty]);

  const handleSubmit = async (data: any) => {
    try {
      const updatedData = {
        ...data,
        // Convert string values to numbers where needed
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        sqft: Number(data.size),
        price: Number(data.price),
        constructionYear: data.yearbuilt
      };
      
      await updateMutation.mutateAsync({ id: propertyId, data: updatedData });
      toast({
        title: "Success",
        description: "Property updated successfully",
        duration: 2000,
      });
      if (onSuccess) onSuccess();
      else navigate(`/property/${propertyId}`);
    } catch (error) {
      console.error("Error updating property:", error);
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleCancel = () => {
    if (onCancel) onCancel();
    else navigate(`/property/${propertyId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error || !property) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>
            Property not found or you don't have permission to edit it.
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleCancel} variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Convert property data to match the PropertyForm's expected format
  const formattedProperty = {
    title: property.title,
    description: property.description,
    address: property.address,
    location: property.address, // Using address as location
    city: property.city,
    state: property.state,
    zipcode: property.pincode,
    type: property.type.toLowerCase(),
    bedrooms: String(property.bedrooms),
    bathrooms: String(property.bathrooms),
    size: String(property.sqft),
    price: String(property.price),
    yearbuilt: property.constructionYear ? String(property.constructionYear) : "",
    amenities: Array.isArray(property.amenities) ? property.amenities.join(", ") : "",
    status: property.status,
    images: Array.isArray(property.images) 
      ? property.images.map(img => {
          // Check if img is already an object with url and public_id
          if (typeof img === 'object' && img !== null && 'url' in img && 'public_id' in img) {
            return { id: img.public_id, url: img.url };
          }
          // Fallback for string-based images (unlikely but handling it)
          return { id: `img-${Math.random().toString(36).substr(2, 9)}`, url: img.toString() };
        }) 
      : []
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Property: {property.title}</CardTitle>
        <CardDescription>
          Update property details to keep your listing accurate and attractive to potential buyers
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <PropertyForm 
          initialData={formattedProperty}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isSubmitting={updateMutation.isPending}
          submitButtonText="Save Changes"
          cancelButtonText="Cancel"
        />
      </CardContent>
    </Card>
  );
};

export default PropertyEdit;

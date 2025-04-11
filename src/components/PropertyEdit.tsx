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
import { Loader2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import PropertyForm from '@/components/property/PropertyForm';
import cloudinaryService from '@/services/cloudinaryService';

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
  const dataLoaded = useRef(false);

  useEffect(() => {
    if (!dataLoaded.current) {
      const fetchProperty = async () => {
        setIsLoading(true);
        try {
          const response = await getProperty(propertyId);
          if (response && response.data) {
            setProperty(response.data);
            dataLoaded.current = true;
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
    }
  }, [propertyId, getProperty]);

  const handleSubmit = async (data: any) => {
    try {
      let processedImages = [];
      
      if (data.images && Array.isArray(data.images)) {
        for (const image of data.images) {
          if (image.file) {
            try {
              const uploadResult = await cloudinaryService.uploadImage(image.file);
              processedImages.push({
                url: uploadResult.imageUrl,
                public_id: uploadResult.public_id
              });
            } catch (uploadError) {
              console.error("Error uploading image:", uploadError);
              toast({
                title: "Warning",
                description: "Failed to upload one or more images",
                variant: "destructive",
              });
            }
          } else if (image.url && image.id) {
            processedImages.push({
              url: image.url,
              public_id: image.id
            });
          }
        }
      }
      
      const updatedData = {
        title: data.title,
        description: data.description,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.zipcode,
        type: data.type,
        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        sqft: Number(data.size),
        price: Number(data.price),
        constructionYear: data.yearbuilt,
        amenities: data.amenities,
        status: data.status,
        images: processedImages
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
      <Card className="shadow-md">
        <CardContent className="flex justify-center items-center p-8">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error || !property) {
    return (
      <Card className="shadow-md">
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

  const formattedProperty = {
    title: property.title,
    description: property.description,
    address: property.address,
    location: property.address,
    city: property.city,
    state: property.state,
    zipcode: property.pincode,
    type: property.type.toLowerCase(),
    bedrooms: Number(property.bedrooms),
    bathrooms: Number(property.bathrooms),
    size: String(property.sqft),
    sqft: Number(property.sqft),
    price: Number(property.price),
    yearbuilt: property.constructionYear ? String(property.constructionYear) : "",
    amenities: Array.isArray(property.amenities) ? property.amenities.join(", ") : "",
    status: property.status,
    images: Array.isArray(property.images) 
      ? property.images.map(img => {
          if (!img) {
            return { id: `img-${Math.random().toString(36).substr(2, 9)}`, url: '' };
          }
          
          if (typeof img === 'object' && img !== null) {
            const imgObj = img as any;
            const url = imgObj.url || '';
            const id = imgObj.public_id || `img-${Math.random().toString(36).substr(2, 9)}`;
            return { id, url };
          }
          
          return { 
            id: `img-${Math.random().toString(36).substr(2, 9)}`, 
            url: String(img || '') 
          };
        }) 
      : []
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="bg-gray-50 border-b">
        <CardTitle className="text-xl sm:text-2xl">Edit Property: {property.title}</CardTitle>
        <CardDescription className="mt-1 text-sm sm:text-base">
          Update property details to keep your listing accurate and attractive to potential buyers
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 sm:p-6">
        <PropertyForm 
          property={formattedProperty}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={updateMutation.isPending}
        />
      </CardContent>
    </Card>
  );
};

export default PropertyEdit;

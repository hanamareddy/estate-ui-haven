
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

  const handleSubmit = async (data: Partial<Property>) => {
    try {
      await updateMutation.mutateAsync({ id: propertyId, data });
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Property: {property.title}</CardTitle>
        <CardDescription>
          Update property details to keep your listing accurate and attractive to potential buyers
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        {/* This is a placeholder for the actual form - you would implement a full form here */}
        <div className="space-y-4">
          <p>Property ID: {property._id}</p>
          <p>Last Updated: {new Date(property.updatedAt || Date.now()).toLocaleDateString()}</p>
          
          <div className="flex justify-end gap-4 mt-6">
            <Button variant="outline" onClick={handleCancel} disabled={updateMutation.isPending}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button 
              onClick={() => handleSubmit({...property, updatedAt: new Date().toISOString()})}
              disabled={updateMutation.isPending}
            >
              {updateMutation.isPending ? 
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...</> : 
                <><Save className="mr-2 h-4 w-4" /> Save Changes</>
              }
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PropertyEdit;

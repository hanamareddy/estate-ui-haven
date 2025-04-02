
import React from 'react';
import { usePropertyAPI } from '@/hooks/usePropertyAPI';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { Property } from '@/types/databaseModels';

interface PropertyEditProps {
  propertyId: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const PropertyEdit = ({ propertyId, onSuccess, onCancel }: PropertyEditProps) => {
  const { useProperty, useUpdateProperty } = usePropertyAPI();
  const { data: property, isLoading } = useProperty(propertyId);
  const updateMutation = useUpdateProperty();

  const handleSubmit = async (data: Partial<Property>) => {
    try {
      await updateMutation.mutateAsync({ id: propertyId, data });
      toast({
        title: "Success",
        description: "Property updated successfully",
        duration: 3000,
      });
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error updating property:", error);
      toast({
        title: "Error",
        description: "Failed to update property",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="p-6 text-center">
        <p>Property not found or you don't have permission to edit it.</p>
        <Button onClick={onCancel} className="mt-4">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Edit Property: {property.title}</h2>
      
      {/* This is a placeholder for the actual form - you would implement a full form here */}
      <div className="space-y-4">
        <p>Property details would be editable here</p>
        
        <div className="flex justify-end gap-4 mt-6">
          <Button variant="outline" onClick={onCancel}>Cancel</Button>
          <Button 
            onClick={() => handleSubmit({...property, updatedAt: new Date().toISOString()})}
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PropertyEdit;

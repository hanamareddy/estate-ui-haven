
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyAPI } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

export const usePropertyAPI = () => {
  const queryClient = useQueryClient();
  
  // Get all properties with optional filters
  const useProperties = (filters = {}) => {
    return useQuery({
      queryKey: ['properties', filters],
      queryFn: () => propertyAPI.getProperties(filters),
    });
  };
  
  // Get a single property by ID
  const useProperty = (id: string) => {
    return useQuery({
      queryKey: ['property', id],
      queryFn: () => propertyAPI.getProperty(id),
      enabled: !!id,
    });
  };
  
  // Create a new property
  const useCreateProperty = () => {
    return useMutation({
      mutationFn: (propertyData: any) => propertyAPI.createProperty(propertyData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['properties'] });
        toast({
          title: "Property Created",
          description: "Your property has been created successfully!",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error Creating Property",
          description: error.response?.data?.message || "An error occurred while creating the property",
          variant: "destructive"
        });
      }
    });
  };
  
  // Update an existing property
  const useUpdateProperty = () => {
    return useMutation({
      mutationFn: ({ id, data }: { id: string; data: any }) => 
        propertyAPI.updateProperty(id, data),
      onSuccess: (_, { id }) => {
        queryClient.invalidateQueries({ queryKey: ['properties'] });
        queryClient.invalidateQueries({ queryKey: ['property', id] });
        toast({
          title: "Property Updated",
          description: "Your property has been updated successfully!",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error Updating Property",
          description: error.response?.data?.message || "An error occurred while updating the property",
          variant: "destructive"
        });
      }
    });
  };
  
  // Delete a property
  const useDeleteProperty = () => {
    return useMutation({
      mutationFn: (id: string) => propertyAPI.deleteProperty(id),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['properties'] });
        toast({
          title: "Property Deleted",
          description: "Your property has been deleted successfully!",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error Deleting Property",
          description: error.response?.data?.message || "An error occurred while deleting the property",
          variant: "destructive"
        });
      }
    });
  };
  
  // Get properties for the current authenticated seller
  const useSellerProperties = () => {
    return useQuery({
      queryKey: ['sellerProperties'],
      queryFn: () => propertyAPI.getSellerProperties(),
    });
  };
  
  return {
    useProperties,
    useProperty,
    useCreateProperty,
    useUpdateProperty,
    useDeleteProperty,
    useSellerProperties,
  };
};

export default usePropertyAPI;

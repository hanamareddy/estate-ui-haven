
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { propertyAPI } from '@/services/api';
import { toast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

export const usePropertyAPI = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  
  // Get all properties with optional filters
  const useProperties = (filters = {}) => {
    return useQuery({
      queryKey: ['properties', filters],
      queryFn: async () => {
        const response = await propertyAPI.getProperties(filters);
        return response.data; // Return the data property which contains properties array
      },
    });
  };
  
  // Get a single property by ID
  const useProperty = (id: string) => {
    return useQuery({
      queryKey: ['property', id],
      queryFn: async () => {
        const response = await propertyAPI.getProperty(id);
        return response.data;
      },
      enabled: !!id,
    });
  };
  
  // Create a new property
  const useCreateProperty = () => {
    return useMutation({
      mutationFn: (propertyData: any) => propertyAPI.createProperty(propertyData),
      onSuccess: (response) => {
        queryClient.invalidateQueries({ queryKey: ['properties'] });
        queryClient.invalidateQueries({ queryKey: ['sellerProperties'] });
        toast({
          title: "Property Created",
          description: `Your property has been created successfully!`,
        });
        navigate("/seller/dashboard");
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
        queryClient.invalidateQueries({ queryKey: ['sellerProperties'] });
        toast({
          title: "Property Updated",
          description: "Your property has been updated successfully!",
        });
        navigate("/seller/dashboard");
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
        queryClient.invalidateQueries({ queryKey: ['sellerProperties'] });
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
      queryFn: async () => {
        const response = await propertyAPI.getSellerProperties();
        return response.data; // Return data directly
      },
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

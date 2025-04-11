
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
  
  // Get a single property by ID - as a hook
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
  
  // Get a single property - as a function (not a hook)
  const getProperty = async (id: string) => {
    try {
      const response = await propertyAPI.getProperty(id);
      return response;
    } catch (error) {
      console.error("Error fetching property:", error);
      throw error;
    }
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
        console.log("Fetching seller properties..."); // Debug: Start of API call
        const response = await propertyAPI.getSellerProperties(); // API call to get seller's properties
        console.log("Seller properties fetched:", response.data); // Debug: Log the fetched data
        return response.data; // Return data directly
      },
    });
  };

  // Get analytics data for properties
  const usePropertyAnalytics = () => {
    return useQuery({
      queryKey: ['propertyAnalytics'],
      queryFn: async () => {
        const response = await propertyAPI.getAnalytics();
        return response.data;
      },
    });
  };

  return {
    useProperties,
    useProperty,
    getProperty,
    useCreateProperty,
    useUpdateProperty,
    useDeleteProperty,
    useSellerProperties,
    usePropertyAnalytics,
  };
};

export default usePropertyAPI;

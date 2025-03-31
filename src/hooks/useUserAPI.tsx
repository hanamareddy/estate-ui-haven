
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '@/services/api';
import { toast } from '@/components/ui/use-toast';

export const useUserAPI = () => {
  const queryClient = useQueryClient();
  
  // Get current user profile
  const useProfile = () => {
    return useQuery({
      queryKey: ['userProfile'],
      queryFn: () => userAPI.getProfile(),
    });
  };
  
  // Update user profile
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: (profileData: any) => userAPI.updateProfile(profileData),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userProfile'] });
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully!",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error Updating Profile",
          description: error.response?.data?.message || "An error occurred while updating your profile",
          variant: "destructive"
        });
      }
    });
  };
  
  // Get user's favorite properties
  const useFavorites = () => {
    return useQuery({
      queryKey: ['favorites'],
      queryFn: () => userAPI.getFavorites(),
    });
  };
  
  // Add property to favorites
  const useAddToFavorites = () => {
    return useMutation({
      mutationFn: (propertyId: string) => userAPI.addToFavorites(propertyId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        toast({
          title: "Added to Favorites",
          description: "Property has been added to your favorites!",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error Adding to Favorites",
          description: error.response?.data?.message || "An error occurred while adding to favorites",
          variant: "destructive"
        });
      }
    });
  };
  
  // Remove property from favorites
  const useRemoveFromFavorites = () => {
    return useMutation({
      mutationFn: (propertyId: string) => userAPI.removeFromFavorites(propertyId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['favorites'] });
        toast({
          title: "Removed from Favorites",
          description: "Property has been removed from your favorites!",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Error Removing from Favorites",
          description: error.response?.data?.message || "An error occurred while removing from favorites",
          variant: "destructive"
        });
      }
    });
  };
  
  // Check if property is in favorites
  const useCheckIsFavorite = (propertyId: string) => {
    return useQuery({
      queryKey: ['isFavorite', propertyId],
      queryFn: () => userAPI.checkIsFavorite(propertyId),
      enabled: !!propertyId,
    });
  };
  
  return {
    useProfile,
    useUpdateProfile,
    useFavorites,
    useAddToFavorites,
    useRemoveFromFavorites,
    useCheckIsFavorite,
  };
};

export default useUserAPI;

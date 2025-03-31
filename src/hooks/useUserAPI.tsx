
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userAPI } from '@/services/api';
import { toast } from '@/components/ui/use-toast';
import mongoAuthService from '@/services/mongoAuthService';

export const useUserAPI = () => {
  const queryClient = useQueryClient();
  
  // Get user profile
  const useGetProfile = () => {
    return useQuery({
      queryKey: ['userProfile'],
      queryFn: async () => {
        const response = await userAPI.getProfile();
        return response.data;
      },
      enabled: mongoAuthService.isAuthenticated(),
    });
  };
  
  // Update user profile
  const useUpdateProfile = () => {
    return useMutation({
      mutationFn: (profileData: any) => userAPI.updateProfile(profileData),
      onSuccess: (response) => {
        queryClient.setQueryData(['userProfile'], response.data);
        
        // Also update the user in auth service
        const currentUser = mongoAuthService.getCurrentUser();
        if (currentUser) {
          const updatedUser = { ...currentUser, ...response.data };
          mongoAuthService.setAuthData(mongoAuthService.getToken() || '', updatedUser);
        }
        
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully",
        });
      },
      onError: (error: any) => {
        toast({
          title: "Update Failed",
          description: error.response?.data?.message || "Failed to update profile",
          variant: "destructive"
        });
      }
    });
  };
  
  // Get user notifications
  const useGetNotifications = () => {
    return useQuery({
      queryKey: ['userNotifications'],
      queryFn: async () => {
        const response = await userAPI.getNotifications();
        return response.data;
      },
      enabled: mongoAuthService.isAuthenticated(),
    });
  };
  
  // Mark notification as read
  const useMarkNotificationRead = () => {
    return useMutation({
      mutationFn: (notificationId: string) => userAPI.markNotificationRead(notificationId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
      }
    });
  };
  
  // Mark all notifications as read
  const useMarkAllNotificationsRead = () => {
    return useMutation({
      mutationFn: () => userAPI.markAllNotificationsRead(),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userNotifications'] });
        
        toast({
          title: "Notifications Cleared",
          description: "All notifications marked as read",
        });
      }
    });
  };
  
  // Get user's favorite properties
  const useGetFavorites = () => {
    return useQuery({
      queryKey: ['userFavorites'],
      queryFn: async () => {
        const response = await userAPI.getFavorites();
        return response.data;
      },
      enabled: mongoAuthService.isAuthenticated(),
    });
  };
  
  // Add property to favorites
  const useAddToFavorites = () => {
    return useMutation({
      mutationFn: (propertyId: string) => userAPI.addToFavorites(propertyId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
      }
    });
  };
  
  // Remove property from favorites
  const useRemoveFromFavorites = () => {
    return useMutation({
      mutationFn: (propertyId: string) => userAPI.removeFromFavorites(propertyId),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['userFavorites'] });
      }
    });
  };
  
  // Check if property is in favorites
  const useCheckFavorite = (propertyId: string) => {
    return useQuery({
      queryKey: ['favoriteCheck', propertyId],
      queryFn: async () => {
        const response = await userAPI.checkFavorite(propertyId);
        return response.data?.isFavorite || false;
      },
      enabled: mongoAuthService.isAuthenticated() && !!propertyId,
    });
  };
  
  return {
    useGetProfile,
    useUpdateProfile,
    useGetNotifications,
    useMarkNotificationRead,
    useMarkAllNotificationsRead,
    useGetFavorites,
    useAddToFavorites,
    useRemoveFromFavorites,
    useCheckFavorite
  };
};

export default useUserAPI;

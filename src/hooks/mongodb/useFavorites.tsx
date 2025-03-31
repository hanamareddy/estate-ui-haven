
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { userAPI } from '@/services/api';
import mongoAuthService from '@/services/mongoAuthService';
import { Property } from '@/types/databaseModels';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!mongoAuthService.isAuthenticated()) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      
      // Get favorites from API
      const response = await userAPI.getFavorites();
      setFavorites(response.data || []);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load your favorite properties');
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (propertyId: string) => {
    try {
      await userAPI.addToFavorites(propertyId);
      
      toast({
        title: 'Success',
        description: 'Property added to favorites',
      });
      
      // Refresh favorites
      fetchFavorites();
      return true;
    } catch (error) {
      console.error('Error adding favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to add property to favorites',
        variant: 'destructive',
      });
      return false;
    }
  };

  const removeFavorite = async (propertyId: string) => {
    try {
      await userAPI.removeFromFavorites(propertyId);
      
      toast({
        title: 'Success',
        description: 'Property removed from favorites',
      });
      
      // Update local state
      setFavorites(currentFavorites => 
        currentFavorites.filter(property => property.id !== propertyId)
      );
      
      return true;
    } catch (error) {
      console.error('Error removing favorite:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove property from favorites',
        variant: 'destructive',
      });
      return false;
    }
  };

  const checkIsFavorite = async (propertyId: string) => {
    try {
      if (!mongoAuthService.isAuthenticated()) {
        return false;
      }
      
      const response = await userAPI.checkFavorite(propertyId);
      return response.data?.isFavorite || false;
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchFavorites();
    
    // Check for authentication changes
    const authToken = localStorage.getItem('auth_token');
    const handleStorageChange = () => {
      const newAuthToken = localStorage.getItem('auth_token');
      if (newAuthToken !== authToken) {
        fetchFavorites();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  return {
    favorites,
    loading,
    error,
    addFavorite,
    removeFavorite,
    checkIsFavorite,
    refreshFavorites: fetchFavorites
  };
};

export default useFavorites;

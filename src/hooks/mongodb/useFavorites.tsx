
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { userAPI } from '@/services/api';
import { Property } from '@/types/databaseModels';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get favorites from API
      const favoriteProperties = await userAPI.getFavorites();
      setFavorites(favoriteProperties);
    } catch (error) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load your favorite properties');
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (propertyId: string) => {
    try {
      const result = await userAPI.addToFavorites(propertyId);
      
      if (result) {
        toast({
          title: 'Success',
          description: 'Property added to favorites',
        });
        
        // Refresh favorites
        fetchFavorites();
        return true;
      } else {
        throw new Error('Failed to add to favorites');
      }
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
      const result = await userAPI.removeFromFavorites(propertyId);
      
      if (result) {
        toast({
          title: 'Success',
          description: 'Property removed from favorites',
        });
        
        // Update local state
        setFavorites(currentFavorites => 
          currentFavorites.filter(property => property.id !== propertyId)
        );
        
        return true;
      } else {
        throw new Error('Failed to remove from favorites');
      }
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
      return await userAPI.checkIsFavorite(propertyId);
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

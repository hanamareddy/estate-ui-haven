
import { useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { userAPI } from '@/services/api';

export interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  status: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  images?: string[];
  latitude?: number;
  longitude?: number;
  userId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Check if user is authenticated
      const token = localStorage.getItem('auth_token');
      if (!token) {
        setFavorites([]);
        setLoading(false);
        return;
      }
      
      // Get favorites from API
      const favoriteProperties = await userAPI.getFavorites();
      setFavorites(favoriteProperties);
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
      setError('Failed to load your favorite properties');
    } finally {
      setLoading(false);
    }
  };

  const addFavorite = async (propertyId: string) => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('auth_token');
      if (!token) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to save favorite properties',
          variant: 'destructive',
        });
        return false;
      }
      
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
    } catch (error: any) {
      console.error('Error adding favorite:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to add property to favorites',
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
    } catch (error: any) {
      console.error('Error removing favorite:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to remove property from favorites',
        variant: 'destructive',
      });
      return false;
    }
  };

  const checkIsFavorite = async (propertyId: string) => {
    try {
      // Check if user is authenticated
      const token = localStorage.getItem('auth_token');
      if (!token) return false;
      
      return await userAPI.checkIsFavorite(propertyId);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      return false;
    }
  };

  useEffect(() => {
    // Only fetch favorites if user is authenticated
    if (localStorage.getItem('auth_token')) {
      fetchFavorites();
    }
    
    // Event listener for auth token changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'auth_token') {
        if (e.newValue) {
          fetchFavorites();
        } else {
          setFavorites([]);
        }
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

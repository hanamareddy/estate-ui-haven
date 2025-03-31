
import { useState, useEffect, useCallback } from 'react';
import { userAPI } from '@/services/api';
import mongoAuthService from '@/services/mongoAuthService';

const useFavorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const refreshFavorites = useCallback(async () => {
    // Skip if not authenticated
    if (!mongoAuthService.isAuthenticated()) {
      setFavorites([]);
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const data = await userAPI.getFavorites();
      setFavorites(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError('Failed to load favorites');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshFavorites();
  }, [refreshFavorites]);

  const addToFavorites = useCallback(async (propertyId) => {
    try {
      await userAPI.addToFavorites(propertyId);
      refreshFavorites();
      return true;
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError('Failed to add to favorites');
      return false;
    }
  }, [refreshFavorites]);

  const removeFromFavorites = useCallback(async (propertyId) => {
    try {
      await userAPI.removeFromFavorites(propertyId);
      refreshFavorites();
      return true;
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError('Failed to remove from favorites');
      return false;
    }
  }, [refreshFavorites]);

  const checkIsFavorite = useCallback(async (propertyId) => {
    if (!mongoAuthService.isAuthenticated()) {
      return false;
    }
    
    try {
      const { isFavorite } = await userAPI.checkFavorite(propertyId);
      return isFavorite;
    } catch (err) {
      console.error('Error checking favorite status:', err);
      return false;
    }
  }, []);

  return {
    favorites,
    loading,
    error,
    refreshFavorites,
    addToFavorites,
    removeFromFavorites,
    checkIsFavorite
  };
};

export default useFavorites;

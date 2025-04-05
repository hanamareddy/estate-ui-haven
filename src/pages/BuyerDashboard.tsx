
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyCard from '@/components/PropertyCard';
import { useNavigate } from 'react-router-dom';
import SavedSearches from '@/components/SavedSearches';
import MobileNavBar from '@/components/MobileNavBar';
import { userAPI } from '@/services/api';
import useUserAPI from '@/hooks/useUserAPI';
import { toast } from '@/components/ui/use-toast';
import mongoAuthService from '@/services/mongoAuthService';

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState('saved-searches');
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { useGetFavorites } = useUserAPI();
  
  // Get favorites using the React Query hook
  const { 
    data: favorites, 
    isLoading: favoritesLoading, 
    error: favoritesError 
  } = useGetFavorites();

  useEffect(() => {
    // Check if user is authenticated
    const token = mongoAuthService.getToken();
    if (!token) {
      toast({
        title: "Authentication Required",
        description: "Please login to access your dashboard",
        variant: "destructive",
      });
      navigate('/auth');
    }
    
    // Set favorites from the API response
    if (favorites) {
      setFavoriteProperties(favorites);
    }
  }, [navigate, favorites]);

  return (
    <div className="min-h-screen bg-background pb-16 md:pb-0">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
          <p className="text-muted-foreground mt-2">
            Manage your saved searches, favorite properties, and account settings
          </p>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="saved-searches">Saved Searches</TabsTrigger>
            <TabsTrigger value="favorite-properties">Favorite Properties</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="saved-searches">
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Saved Searches</h2>
              <SavedSearches />
            </div>
          </TabsContent>
          
          <TabsContent value="favorite-properties">
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Favorite Properties</h2>
              {favoritesLoading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
                </div>
              ) : favoritesError ? (
                <div className="text-center py-12">
                  <p className="text-red-500">Failed to load favorites. Please try again.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favoriteProperties.map((property: any) => (
                    <PropertyCard 
                      key={property._id || property.id} 
                      propertyData={{
                        _id: property._id || property.id,
                        title: property.title,
                        address: property.address,
                        price: property.price,
                        bedrooms: property.bedrooms,
                        bathrooms: property.bathrooms,
                        sqft: property.area || property.sqft,
                        images: property.images?.length ? 
                          property.images.map((img: string) => ({ url: img })) : 
                          [{ url: '/placeholder.svg' }],
                        type: property.type,
                        status: property.status
                      }} 
                    />
                  ))}
                  
                  {favoriteProperties.length === 0 && (
                    <div className="col-span-full text-center py-12">
                      <p className="text-muted-foreground">You haven't saved any favorites yet.</p>
                      <button 
                        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                        onClick={() => navigate('/')}
                      >
                        Browse Properties
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="settings">
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Account Settings</h2>
              <div className="bg-card p-6 rounded-lg border border-border">
                <p className="text-muted-foreground">
                  Manage your account settings, notification preferences, and more.
                </p>
                <button 
                  className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
                  onClick={() => navigate('/profile')}
                >
                  Update Profile
                </button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <MobileNavBar />
    </div>
  );
};

export default BuyerDashboard;

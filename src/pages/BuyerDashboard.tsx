
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyCard from '@/components/PropertyCard';
import BackToHomeButton from '@/components/BackToHomeButton';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
// Fix: Import SavedSearches properly
import SavedSearches from '@/components/SavedSearches';

interface SavedSearch {
  id: string;
  name: string;
  filters?: any;
  criteria?: any;
  location?: string;
}

const BuyerDashboard = () => {
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([]);
  const [favoriteProperties, setFavoriteProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSavedSearches = async () => {
      try {
        const { data, error } = await supabase
          .from('saved_searches')
          .select('*');

        if (error) {
          console.error('Error fetching saved searches:', error);
        } else {
          // Map the data to match SavedSearch interface
          const mappedSearches = (data || []).map(item => ({
            id: item.id,
            name: item.name,
            filters: item.criteria, // Using criteria as filters
            location: item.location
          }));
          
          setSavedSearches(mappedSearches);
        }
      } catch (error) {
        console.error('Error fetching saved searches:', error);
      }
    };

    const fetchFavoriteProperties = async () => {
      try {
        // Query user_favorites table which connects users to properties
        const { data: favoriteData, error: favoriteError } = await supabase
          .from('user_favorites')
          .select('property_id');

        if (favoriteError) {
          console.error('Error fetching favorite properties:', favoriteError);
          return;
        }

        if (favoriteData && favoriteData.length > 0) {
          // Get the property IDs from favorites
          const propertyIds = favoriteData.map(fav => fav.property_id);
          
          // Now fetch the actual property data
          const { data: propertiesData, error: propertiesError } = await supabase
            .from('properties')
            .select('*')
            .in('id', propertyIds);

          if (propertiesError) {
            console.error('Error fetching properties:', propertiesError);
          } else {
            setFavoriteProperties(propertiesData || []);
          }
        } else {
          setFavoriteProperties([]);
        }
      } catch (error) {
        console.error('Error fetching favorite properties:', error);
      }
    };

    fetchSavedSearches();
    fetchFavoriteProperties();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
          <BackToHomeButton />
        </div>
        
        <Tabs defaultValue="saved-searches" className="w-full">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteProperties.map((property) => (
                  <PropertyCard 
                    key={property.id} 
                    propertyData={{
                      _id: property.id,
                      title: property.title,
                      address: property.address,
                      price: property.price,
                      bedrooms: property.bedrooms,
                      bathrooms: property.bathrooms,
                      sqft: property.area,
                      images: property.images ? [{url: property.images[0]}] : [{url: '/placeholder.svg'}],
                      type: property.type,
                      status: property.status
                    }} 
                  />
                ))}
              </div>
              {favoriteProperties.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">You haven't saved any favorites yet.</p>
                </div>
              )}
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Settings</h2>
              <div>
                {/* Add settings content here */}
                <p>User settings and preferences can be managed here.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BuyerDashboard;

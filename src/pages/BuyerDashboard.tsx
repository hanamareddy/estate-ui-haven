import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PropertyCard from '@/components/PropertyCard';
import BackToHomeButton from '@/components/BackToHomeButton';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
// Fix: Import SavedSearches properly
import { SavedSearches } from '@/components/SavedSearches';

interface SavedSearch {
  id: string;
  name: string;
  filters: any;
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
          setSavedSearches(data || []);
        }
      } catch (error) {
        console.error('Error fetching saved searches:', error);
      }
    };

    const fetchFavoriteProperties = async () => {
      try {
        // Assuming you have a table for favorite properties
        const { data, error } = await supabase
          .from('favorite_properties')
          .select('*');

        if (error) {
          console.error('Error fetching favorite properties:', error);
        } else {
          setFavoriteProperties(data || []);
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
        
        <Tabs defaultvalue="saved-searches" className="w-full">
          <TabsList>
            <TabsTrigger value="saved-searches">Saved Searches</TabsTrigger>
            <TabsTrigger value="favorite-properties">Favorite Properties</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="saved-searches">
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Saved Searches</h2>
              {/* Fix: Use SavedSearches component properly */}
              <SavedSearches />
            </div>
          </TabsContent>
          <TabsContent value="favorite-properties">
            <div className="mt-8">
              <h2 className="text-xl font-bold mb-4">Favorite Properties</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {favoriteProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
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

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { Calendar, Home, Heart, Bell, MessageSquare, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import BackToHomeButton from '@/components/BackToHomeButton';
import { toast } from '@/hooks/use-toast';
import { userAPI } from '@/services/api';
import { useUserAPI } from '@/hooks/useUserAPI';
import { usePropertyInquiries } from '@/hooks/usePropertyInquiries';
import { PropertyInquiry } from '@/hooks/usePropertyInquiries';
import { formatCurrency } from '@/utils/formatters';
import SavedSearches from '@/components/SavedSearches';

const BuyerDashboard = () => {
  const navigate = useNavigate();

  // State variables
  const [savedSearchCount, setSavedSearchCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Get user favorites
  const { useGetFavorites } = useUserAPI();
  const { data: favorites = [], isLoading: favoritesLoading, error: favoritesError, refetch: refreshFavorites } = useGetFavorites();

  // Use the property inquiries hook
  const { inquiries, loading: inquiriesLoading, error: inquiriesError, refreshUserInquiries } = usePropertyInquiries();

  useEffect(() => {
    // Get saved searches count from API
    const fetchSavedSearchesCount = async () => {
      try {
        setIsLoading(true);
        const response = await userAPI.getSavedSearches();
        setSavedSearchCount((response.data || []).length);
      } catch (error) {
        console.error("Error fetching saved searches count:", error);
        setSavedSearchCount(0);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSavedSearchesCount();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
          <BackToHomeButton />
        </div>
        
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="favorites" className="flex items-center">
              <Heart className="mr-2 h-4 w-4" />
              <span>Favorites</span>
              {favorites.length > 0 && (
                <Badge variant="secondary" className="ml-2">{favorites.length}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="searches" className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Saved Searches</span>
              {savedSearchCount > 0 && (
                <Badge variant="secondary" className="ml-2">{savedSearchCount}</Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="inquiries" className="flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              <span>Inquiries</span>
              {inquiries.length > 0 && (
                <Badge variant="secondary" className="ml-2">{inquiries.length}</Badge>
              )}
            </TabsTrigger>
          </TabsList>
          
          {/* Favorites Tab */}
          <TabsContent value="favorites">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Favorite Properties</h2>
                <Button 
                  variant="outline" 
                  onClick={() => refreshFavorites()}
                >
                  Refresh
                </Button>
              </div>
              
              {favoritesLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Loading your favorite properties...</p>
                </div>
              ) : favoritesError ? (
                <div className="text-center py-8 text-red-500">
                  <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                  <p>Failed to load favorites. Please try again.</p>
                </div>
              ) : favorites.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <Heart className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No favorites yet</h3>
                  <p className="text-gray-500 mb-4">
                    Add properties to your favorites to track them easily
                  </p>
                  <Button onClick={() => navigate('/')}>Browse Properties</Button>
                </div>
              ) : (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((property) => (
                    <Card key={property._id || property.id} className="overflow-hidden">
                      <div className="relative">
                        <img 
                          src={(property.images && property.images.length > 0) 
                            ? (property.images[0].url || property.images[0]) 
                            : '/placeholder.svg'} 
                          alt={property.title} 
                          className="w-full h-48 object-cover"
                        />
                      </div>
                      <CardContent className="p-6">
                        <CardTitle className="text-xl font-medium">{property.title}</CardTitle>
                        <CardDescription className="text-gray-600 mb-4">{property.address}</CardDescription>
                        <div className="flex justify-between items-center">
                          <div>
                            <span className="text-gray-800 font-medium">₹{formatCurrency(property.price)}</span>
                            <span className="text-gray-500 ml-2 text-sm">{property.bedrooms} beds | {property.bathrooms} baths</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => navigate(`/property/${property._id || property.id}`)}
                          >
                            View
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
          
          {/* Saved Searches Tab */}
          <TabsContent value="searches">
            {isLoading ? (
              <div className="text-center py-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Loading your saved searches...</p>
              </div>
            ) : (
              <SavedSearches />
            )}
          </TabsContent>
          
          {/* Inquiries Tab */}
          <TabsContent value="inquiries">
            <div className="grid gap-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Property Inquiries</h2>
                <Button 
                  variant="outline" 
                  onClick={refreshUserInquiries}
                >
                  Refresh
                </Button>
              </div>
              
              {inquiriesLoading ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                  <p>Loading your inquiries...</p>
                </div>
              ) : inquiriesError ? (
                <div className="text-center py-8 text-red-500">
                  <AlertCircle className="mx-auto h-8 w-8 mb-2" />
                  <p>Failed to load inquiries. Please try again.</p>
                </div>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <MessageSquare className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No inquiries yet</h3>
                  <p className="text-gray-500 mb-4">
                    Send inquiries to property owners to get more information
                  </p>
                  <Button onClick={() => navigate('/')}>Browse Properties</Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry: PropertyInquiry) => (
                    <Card key={inquiry.id} className="overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-1/4 h-48 md:h-auto relative">
                          <img 
                            src={inquiry.propertyImage || '/placeholder.svg'} 
                            alt={inquiry.propertyTitle || 'Property'} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex justify-between mb-4">
                            <h3 className="text-xl font-medium">{inquiry.propertyTitle || 'Property'}</h3>
                            <Badge 
                              variant={
                                inquiry.status === 'responded' ? 'secondary' : 
                                inquiry.status === 'closed' ? 'secondary' : 'default'
                              }
                            >
                              {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">{inquiry.propertyAddress || 'Address information'}</p>
                          
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <span className="text-gray-800 font-medium">
                                {inquiry.propertyPrice ? `₹${formatCurrency(inquiry.propertyPrice)}` : 'Price information'}
                              </span>
                              <span className="text-gray-500 ml-2 text-sm">
                                Inquiry sent on {format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}
                              </span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-md mb-4">
                            <h4 className="font-medium mb-2">Your Message:</h4>
                            <p className="text-gray-600">{inquiry.message}</p>
                          </div>
                          
                          {inquiry.sellerResponse && (
                            <div className="bg-blue-50 p-4 rounded-md">
                              <h4 className="font-medium mb-2">Seller Response:</h4>
                              <p className="text-gray-600">{inquiry.sellerResponse}</p>
                            </div>
                          )}
                          
                          <div className="mt-4 flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/property/${inquiry.propertyId}`)}
                            >
                              View Property
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BuyerDashboard;

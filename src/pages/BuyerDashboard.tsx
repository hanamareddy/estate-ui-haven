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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from 'date-fns';
import { Calendar, Home, Heart, Bell, MessageSquare, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import SavedSearches from '@/components/SavedSearches';
import { useToast } from '@/components/ui/use-toast';
import { userAPI } from '@/services/api';
import useFavorites from '@/hooks/useFavorites';
import { usePropertyInquiries } from '@/hooks/usePropertyInquiries';
import { PropertyInquiry } from '@/hooks/usePropertyInquiries';
import { formatCurrency } from '@/utils/formatters';
import { CalendarDateRangePicker } from "@/components/ui/date-range-picker";

const BuyerDashboard = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // State variables
  const [savedSearchCount, setSavedSearchCount] = useState(0);

  // Favorites hook
  const { favorites, loading: favoritesLoading, error: favoritesError, refreshFavorites } = useFavorites();
  const favoritesCount = favorites.length;

  // Use the property inquiries hook
  const { inquiries, loading: inquiriesLoading, error: inquiriesError, refreshUserInquiries } = usePropertyInquiries();

  useEffect(() => {
    // Mock saved searches count
    setSavedSearchCount(5);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage your property interests and saved searches</p>
          </div>
          <Button 
            onClick={() => navigate('/')}
            className="mt-4 md:mt-0"
            variant="default"
          >
            Browse Properties
          </Button>
        </div>
        
        <Tabs defaultValue="favorites" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="favorites" className="flex items-center">
              <Heart className="mr-2 h-4 w-4" />
              <span>Favorites</span>
              {favoritesCount > 0 && (
                <Badge variant="secondary" className="ml-2">{favoritesCount}</Badge>
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
                  onClick={refreshFavorites}
                >
                  Refresh
                </Button>
              </div>
              
              {favoritesLoading ? (
                <div className="text-center py-8">Loading your favorite properties...</div>
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
                    <Card key={property.id} className="overflow-hidden">
                      <div className="relative">
                        <img 
                          src={property.images && property.images.length > 0 ? property.images[0] : '/placeholder.svg'} 
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
                            onClick={() => navigate(`/property/${property.id}`)}
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
            <SavedSearches />
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
                <div className="text-center py-8">Loading your inquiries...</div>
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
                            src={inquiry.property_image || '/placeholder.svg'} 
                            alt={inquiry.property_title || 'Property'} 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 p-6">
                          <div className="flex justify-between mb-4">
                            <h3 className="text-xl font-medium">{inquiry.property_title || 'Property'}</h3>
                            <Badge 
                              variant={
                                inquiry.status === 'responded' ? 'secondary' : 
                                inquiry.status === 'closed' ? 'secondary' : 'default'
                              }
                            >
                              {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-2">Address information</p>
                          
                          <div className="flex justify-between items-center mb-4">
                            <div>
                              <span className="text-gray-800 font-medium">Price information</span>
                              <span className="text-gray-500 ml-2 text-sm">Inquiry sent on {format(new Date(inquiry.created_at), 'MMM dd, yyyy')}</span>
                            </div>
                          </div>
                          
                          <div className="bg-gray-50 p-4 rounded-md mb-4">
                            <h4 className="font-medium mb-2">Your Message:</h4>
                            <p className="text-gray-600">{inquiry.message}</p>
                          </div>
                          
                          {inquiry.seller_response && (
                            <div className="bg-blue-50 p-4 rounded-md">
                              <h4 className="font-medium mb-2">Seller Response:</h4>
                              <p className="text-gray-600">{inquiry.seller_response}</p>
                            </div>
                          )}
                          
                          <div className="mt-4 flex justify-end">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => navigate(`/property/${inquiry.property_id}`)}
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
      </main>
    </div>
  );
};

export default BuyerDashboard;

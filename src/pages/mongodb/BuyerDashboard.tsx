
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Building, Heart, BellRing, MessageSquare, IndianRupee, Search } from "lucide-react";
import { useFavorites } from "@/hooks/useFavorites";
import { useNotifications } from "@/hooks/useNotifications";
import { usePropertyInquiries } from "@/hooks/usePropertyInquiries";
import { getCurrentUser, getCurrentProfile } from "@/services/authService";
import { toast } from "@/components/ui/use-toast";
import PropertyCard from "@/components/PropertyCard"; 
import { Link } from "react-router-dom";
import { formatCurrency } from "@/utils/formatters";

const MongoBuyerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("favorites");
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const { 
    favorites, 
    loading: favoritesLoading, 
    error: favoritesError 
  } = useFavorites();
  
  const { 
    notifications, 
    unreadCount, 
    loading: notificationsLoading, 
    error: notificationsError, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();
  
  const { 
    inquiries, 
    loading: inquiriesLoading, 
    error: inquiriesError 
  } = usePropertyInquiries();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);
        const currentUser = await getCurrentUser();
        const userProfile = await getCurrentProfile();
        
        if (!currentUser) {
          navigate("/auth");
          return;
        }
        
        setUser(currentUser);
        setProfile(userProfile);
      } catch (error) {
        console.error("Auth check error:", error);
        toast({
          title: "Authentication Error",
          description: "Please sign in again",
          variant: "destructive",
        });
        navigate("/auth");
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Welcome, {profile?.name || "User"}</h1>
          <p className="text-muted-foreground">Manage your real estate activities</p>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate("/property/nearby")}>
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Find Properties</span>
          </Button>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => navigate("/market-trends")}>
            <IndianRupee className="h-4 w-4" />
            <span className="hidden sm:inline">Market Trends</span>
          </Button>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 md:w-[400px]">
          <TabsTrigger value="favorites" className="flex items-center gap-2">
            <Heart className="h-4 w-4" />
            <span>Favorites</span>
          </TabsTrigger>
          <TabsTrigger value="inquiries" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            <span>Inquiries</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2 relative">
            <BellRing className="h-4 w-4" />
            <span>Alerts</span>
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="favorites">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-500" />
                Your Favorite Properties
              </CardTitle>
              <CardDescription>
                Properties you've saved to revisit later
              </CardDescription>
            </CardHeader>
            <CardContent>
              {favoritesLoading ? (
                <p>Loading your favorites...</p>
              ) : favoritesError ? (
                <p className="text-red-500">{favoritesError}</p>
              ) : favorites.length === 0 ? (
                <div className="text-center py-12">
                  <Building className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">No favorites yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Properties you save will appear here.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate("/")}
                  >
                    Explore Properties
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {favorites.map((property) => (
                    <PropertyCard 
                      key={property.id}
                      id={property.id}
                      title={property.title || 'Unnamed Property'}
                      address={property.address || 'Unknown Address'}
                      price={property.price || 0}
                      bedrooms={property.bedrooms || 0}
                      bathrooms={property.bathrooms || 0}
                      area={property.area || 0}
                      imageUrl={property.images?.[0] || '/placeholder.svg'}
                      type={property.type as any || 'house'}
                      status={property.status as any || 'for-sale'}
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inquiries">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-blue-500" />
                Your Property Inquiries
              </CardTitle>
              <CardDescription>
                Messages you've sent to property owners
              </CardDescription>
            </CardHeader>
            <CardContent>
              {inquiriesLoading ? (
                <p>Loading your inquiries...</p>
              ) : inquiriesError ? (
                <p className="text-red-500">{inquiriesError}</p>
              ) : inquiries.length === 0 ? (
                <div className="text-center py-12">
                  <MessageSquare className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">No inquiries yet</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Messages you send to property owners will appear here.
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate("/")}
                  >
                    Browse Properties
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row gap-4">
                        {inquiry.propertyImage && (
                          <div className="w-full md:w-48 h-32 flex-shrink-0">
                            <img 
                              src={inquiry.propertyImage} 
                              alt={inquiry.propertyTitle || 'Property'} 
                              className="w-full h-full object-cover rounded-md"
                            />
                          </div>
                        )}
                        <div className="flex-grow">
                          <h4 className="font-medium">
                            {inquiry.propertyTitle || 'Property Inquiry'}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {inquiry.propertyAddress || 'Address not available'}
                          </p>
                          {inquiry.propertyPrice && (
                            <p className="text-sm font-medium mt-1 flex items-center">
                              <IndianRupee className="h-3 w-3 mr-1" />
                              {formatCurrency(inquiry.propertyPrice)}
                            </p>
                          )}
                          <Separator className="my-3" />
                          <div className="text-sm">
                            <p className="font-medium">Your message:</p>
                            <p className="mt-1">{inquiry.message}</p>
                          </div>
                          {inquiry.sellerResponse && (
                            <div className="mt-3 p-3 bg-gray-50 rounded-md text-sm">
                              <p className="font-medium">Response:</p>
                              <p className="mt-1">{inquiry.sellerResponse}</p>
                            </div>
                          )}
                          <div className="mt-3 flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              {new Date(inquiry.createdAt).toLocaleDateString('en-IN', { 
                                year: 'numeric', 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              inquiry.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                              inquiry.status === 'responded' ? 'bg-green-100 text-green-800' : 
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {inquiry.status === 'pending' ? 'Awaiting Response' : 
                               inquiry.status === 'responded' ? 'Responded' : 
                               inquiry.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BellRing className="h-5 w-5 text-yellow-500" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Stay updated with property alerts
                </CardDescription>
              </div>
              {notifications.length > 0 && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => markAllAsRead()}
                >
                  Mark all as read
                </Button>
              )}
            </CardHeader>
            <CardContent>
              {notificationsLoading ? (
                <p>Loading notifications...</p>
              ) : notificationsError ? (
                <p className="text-red-500">{notificationsError}</p>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12">
                  <BellRing className="h-12 w-12 mx-auto text-gray-300" />
                  <h3 className="mt-4 text-lg font-medium">No notifications</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    You don't have any notifications at the moment.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification) => (
                    <div 
                      key={notification.id} 
                      className={`p-4 border rounded-lg transition-colors ${
                        notification.read ? 'bg-white' : 'bg-blue-50'
                      }`}
                      onClick={() => !notification.read && markAsRead(notification.id)}
                    >
                      <div className="flex justify-between">
                        <h4 className="font-medium">{notification.title}</h4>
                        {!notification.read && (
                          <span className="inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                        )}
                      </div>
                      <p className="text-sm mt-1">{notification.message}</p>
                      <div className="mt-2 flex justify-between items-center text-xs text-muted-foreground">
                        <span>
                          {new Date(notification.created_at).toLocaleDateString('en-IN', { 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                        <span className={`px-2 py-1 rounded-full ${
                          notification.type === 'property' ? 'bg-green-100 text-green-800' : 
                          notification.type === 'inquiry' ? 'bg-blue-100 text-blue-800' : 
                          notification.type === 'alert' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {notification.type}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MongoBuyerDashboard;

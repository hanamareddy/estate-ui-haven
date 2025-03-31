
import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Eye, MessageSquare, Home, Search, Clock, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import SavedSearches from "@/components/SavedSearches";
import useFavorites from "@/hooks/useFavorites";
import usePropertyInquiries, { PropertyInquiry } from "@/hooks/usePropertyInquiries";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import mongoAuthService from "@/services/mongoAuthService";
import { formatPrice } from "@/lib/utils";

const BuyerDashboard = () => {
  const [activeTab, setActiveTab] = useState("favorites");
  const [user, setUser] = useState<any>(null);
  const { favorites, loading: favoritesLoading, error: favoritesError } = useFavorites();
  const { 
    inquiries, 
    loading: inquiriesLoading, 
    error: inquiriesError,
    refreshUserInquiries
  } = usePropertyInquiries();

  // Get current user details
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentUser = mongoAuthService.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    };

    fetchCurrentUser();
  }, []);

  // Refresh inquiries when tab changes
  useEffect(() => {
    if (activeTab === "inquiries") {
      refreshUserInquiries();
    }
  }, [activeTab, refreshUserInquiries]);

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // Get badge color for inquiry status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return <Badge variant="default">New</Badge>;
      case "responded":
        return <Badge variant="secondary">Responded</Badge>;
      case "closed":
        return <Badge variant="outline">Closed</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Buyer Dashboard</h1>
        <p className="text-muted-foreground">Manage your property search, favorites, and inquiries</p>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>
                {user?.name || "Buyer"}
              </CardTitle>
              <CardDescription>{user?.email}</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <nav className="flex flex-col space-y-1">
                <Button 
                  variant={activeTab === "favorites" ? "default" : "ghost"} 
                  className="justify-start"
                  onClick={() => handleTabChange("favorites")}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Favorite Properties
                </Button>
                <Button 
                  variant={activeTab === "searches" ? "default" : "ghost"} 
                  className="justify-start"
                  onClick={() => handleTabChange("searches")}
                >
                  <Search className="mr-2 h-4 w-4" />
                  Saved Searches
                </Button>
                <Button 
                  variant={activeTab === "inquiries" ? "default" : "ghost"} 
                  className="justify-start"
                  onClick={() => handleTabChange("inquiries")}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Property Inquiries
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="h-full">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="h-full">
              {/* Tab Navigation */}
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {activeTab === "favorites" && "Favorite Properties"}
                    {activeTab === "searches" && "Saved Searches"}
                    {activeTab === "inquiries" && "Property Inquiries"}
                  </CardTitle>
                  <TabsList>
                    <TabsTrigger value="favorites">Favorites</TabsTrigger>
                    <TabsTrigger value="searches">Searches</TabsTrigger>
                    <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
                  </TabsList>
                </div>
                <CardDescription>
                  {activeTab === "favorites" && "Properties you've saved for future reference"}
                  {activeTab === "searches" && "Search criteria you've saved for notifications"}
                  {activeTab === "inquiries" && "Communications with property sellers"}
                </CardDescription>
              </CardHeader>

              {/* Favorites Tab */}
              <TabsContent value="favorites" className="h-[calc(100%-60px)]">
                <CardContent>
                  {favoritesLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <p>Loading favorites...</p>
                    </div>
                  ) : favoritesError ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <p className="text-red-500 mb-2">Error loading favorites</p>
                      <p className="text-muted-foreground">{favoritesError}</p>
                    </div>
                  ) : favorites.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <p className="text-muted-foreground mb-4">You haven't saved any properties yet</p>
                      <Link to="/">
                        <Button>Browse Properties</Button>
                      </Link>
                    </div>
                  ) : (
                    <ScrollArea className="h-[calc(100vh-250px)]">
                      <div className="grid gap-4 sm:grid-cols-2">
                        {favorites.map((property) => (
                          <Card key={property.id} className="overflow-hidden">
                            <div className="relative aspect-video">
                              <img 
                                src={property.images?.[0] || "/placeholder-property.jpg"} 
                                alt={property.title} 
                                className="object-cover w-full h-full"
                              />
                              <div className="absolute bottom-2 right-2">
                                <Badge variant="secondary">
                                  {property.type || "Residential"}
                                </Badge>
                              </div>
                            </div>
                            <CardContent className="p-4">
                              <h3 className="font-semibold truncate">{property.title}</h3>
                              <p className="text-sm text-muted-foreground truncate">{property.location?.address}</p>
                              <div className="flex justify-between items-center mt-2">
                                <p className="font-bold">{formatPrice(property.price)}</p>
                                <Link to={`/properties/${property.id}`}>
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-4 w-4 mr-1" /> View
                                  </Button>
                                </Link>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </TabsContent>

              {/* Saved Searches Tab */}
              <TabsContent value="searches" className="h-[calc(100%-60px)]">
                <CardContent>
                  <SavedSearches />
                </CardContent>
              </TabsContent>

              {/* Inquiries Tab */}
              <TabsContent value="inquiries" className="h-[calc(100%-60px)]">
                <CardContent>
                  {inquiriesLoading ? (
                    <div className="flex items-center justify-center h-40">
                      <p>Loading inquiries...</p>
                    </div>
                  ) : inquiriesError ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <p className="text-red-500 mb-2">Error loading inquiries</p>
                      <p className="text-muted-foreground">{inquiriesError}</p>
                    </div>
                  ) : inquiries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center">
                      <p className="text-muted-foreground mb-4">You haven't made any property inquiries yet</p>
                      <Link to="/">
                        <Button>Browse Properties</Button>
                      </Link>
                    </div>
                  ) : (
                    <ScrollArea className="h-[calc(100vh-250px)]">
                      <div className="space-y-4">
                        {inquiries.map((inquiry: PropertyInquiry) => (
                          <Card key={inquiry.id} className="p-4">
                            <div className="flex gap-4">
                              <div className="w-24 h-24 rounded overflow-hidden shrink-0">
                                <img 
                                  src={inquiry.property_image || "/placeholder-property.jpg"} 
                                  alt="Property" 
                                  className="object-cover w-full h-full"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start">
                                  <h3 className="font-semibold">{inquiry.property_title || "Property Inquiry"}</h3>
                                  {getStatusBadge(inquiry.status)}
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {inquiry.property_address || "Property location"}
                                </p>
                                <p className="text-sm font-medium">
                                  {formatPrice(inquiry.property_price || 0)}
                                </p>
                                <div className="mt-2 text-sm">
                                  <p className="font-semibold">Your message:</p>
                                  <p className="text-muted-foreground">{inquiry.message}</p>
                                </div>
                                {inquiry.seller_response && (
                                  <div className="mt-2 text-sm bg-muted p-2 rounded">
                                    <p className="font-semibold">Seller response:</p>
                                    <p>{inquiry.seller_response}</p>
                                  </div>
                                )}
                                <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                                  <span>
                                    {formatDistanceToNow(new Date(inquiry.created_at), { addSuffix: true })}
                                  </span>
                                  <div>
                                    {inquiry.status === "new" && (
                                      <Badge variant="outline" className="ml-2">Awaiting response</Badge>
                                    )}
                                    {inquiry.status === "responded" && (
                                      <Badge variant="secondary" className="ml-2">Seller responded</Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;

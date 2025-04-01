import React, { useState } from "react";
import { Link } from "react-router-dom";
import { PlusCircle, Package, User, Home, BarChart3, Settings, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import SellerPropertyCard from "@/components/SellerPropertyCard";
import mongoAuthService from "@/services/mongoAuthService";
import { toast } from "@/components/ui/use-toast";
import usePropertyAPI from "@/hooks/usePropertyAPI";

const SellerDashboard = () => {
  const [activeTab, setActiveTab] = useState("properties");
  const { useSellerProperties, useDeleteProperty } = usePropertyAPI();
  const { data: properties, isLoading, error, refetch } = useSellerProperties();
  const deletePropertyMutation = useDeleteProperty();
  
  // Get user profile information
  const user = mongoAuthService.getUser();
  const firstName = user?.name?.split(' ')[0] || 'Seller';
  
  const handleLogout = () => {
    mongoAuthService.logout();
    window.location.href = '/';
  };
  
  const handleDeleteProperty = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this property? This action cannot be undone.")) {
      try {
        await deletePropertyMutation.mutateAsync(id);
        refetch(); // Refresh the property list
      } catch (error) {
        console.error("Error deleting property:", error);
      }
    }
  };
  
  const activeProperties = Array.isArray(properties)
    ? properties.filter(property => property.status === 'active')
    : [];
  
  const inactiveProperties = Array.isArray(properties)
    ? properties.filter(property => property.status !== 'active')
    : [];
  
  return (
    <div className="bg-secondary/10 min-h-screen">
      {/* Dashboard header */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your real estate listings</p>
          </div>
          <div className="flex gap-4">
            <Button
              as={Link}
              to="/seller/property/add"
              className="gap-2"
              variant="default"
            >
              <PlusCircle className="h-4 w-4" />
              Add New Property
            </Button>
          </div>
        </div>
      </div>

      {/* Main dashboard content */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
            <div className="flex items-center gap-4">
              <Avatar className="h-14 w-14">
                <AvatarImage src={user?.avatar || ""} alt={user?.name || "User"} />
                <AvatarFallback>
                  {(user?.name?.charAt(0) || "S") + (user?.name?.split(" ")[1]?.charAt(0) || "")}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-lg">Hello, {firstName}</h2>
                <p className="text-sm text-muted-foreground">Seller Account</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <nav className="flex flex-col">
              <button 
                className={`flex items-center gap-3 px-6 py-4 hover:bg-secondary transition-colors ${activeTab === 'properties' ? 'border-l-4 border-primary bg-secondary/50' : ''}`} 
                onClick={() => setActiveTab("properties")}
              >
                <Home className="h-4 w-4" />
                <span>My Properties</span>
              </button>
              <button 
                className={`flex items-center gap-3 px-6 py-4 hover:bg-secondary transition-colors ${activeTab === 'inquiries' ? 'border-l-4 border-primary bg-secondary/50' : ''}`} 
                onClick={() => setActiveTab("inquiries")}
              >
                <Package className="h-4 w-4" />
                <span>Inquiries</span>
              </button>
              <button 
                className={`flex items-center gap-3 px-6 py-4 hover:bg-secondary transition-colors ${activeTab === 'analytics' ? 'border-l-4 border-primary bg-secondary/50' : ''}`} 
                onClick={() => setActiveTab("analytics")}
              >
                <BarChart3 className="h-4 w-4" />
                <span>Analytics</span>
              </button>
              <button 
                className={`flex items-center gap-3 px-6 py-4 hover:bg-secondary transition-colors ${activeTab === 'profile' ? 'border-l-4 border-primary bg-secondary/50' : ''}`} 
                onClick={() => setActiveTab("profile")}
              >
                <User className="h-4 w-4" />
                <span>Profile</span>
              </button>
              <button 
                className={`flex items-center gap-3 px-6 py-4 hover:bg-secondary transition-colors ${activeTab === 'settings' ? 'border-l-4 border-primary bg-secondary/50' : ''}`} 
                onClick={() => setActiveTab("settings")}
              >
                <Settings className="h-4 w-4" />
                <span>Settings</span>
              </button>
              <button 
                className="flex items-center gap-3 px-6 py-4 text-red-500 hover:bg-red-50 transition-colors"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </nav>
          </div>
        </div>
        
        {/* Main content area */}
        <div className="md:col-span-3">
          <TabsContent value="properties" className="m-0" active={activeTab === "properties"}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">My Properties</h2>
              <Link to="/seller/property/add">
                <Button size="sm" className="gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add New
                </Button>
              </Link>
            </div>
            
            <Tabs defaultValue="active" className="mb-6">
              <TabsList>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="inactive">Inactive</TabsTrigger>
                <TabsTrigger value="all">All Properties</TabsTrigger>
              </TabsList>
              
              <div className="mt-6">
                <TabsContent value="active">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="spinner h-8 w-8 mb-4 mx-auto border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-muted-foreground">Loading your properties...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12 bg-destructive/10 rounded-lg">
                      <p className="text-destructive">Failed to load your properties</p>
                      <Button variant="outline" className="mt-4" onClick={() => refetch()}>Retry</Button>
                    </div>
                  ) : activeProperties.length === 0 ? (
                    <div className="text-center py-12 bg-secondary/30 rounded-lg">
                      <p className="text-muted-foreground mb-4">You don't have any active properties</p>
                      <Link to="/seller/property/add">
                        <Button>Add Your First Property</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {activeProperties.map((property) => (
                        <SellerPropertyCard 
                          key={property._id} 
                          property={property} 
                          onDelete={() => handleDeleteProperty(property._id)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="inactive">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="spinner h-8 w-8 mb-4 mx-auto border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-muted-foreground">Loading your properties...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12 bg-destructive/10 rounded-lg">
                      <p className="text-destructive">Failed to load your properties</p>
                      <Button variant="outline" className="mt-4" onClick={() => refetch()}>Retry</Button>
                    </div>
                  ) : inactiveProperties.length === 0 ? (
                    <div className="text-center py-12 bg-secondary/30 rounded-lg">
                      <p className="text-muted-foreground">You don't have any inactive properties</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {inactiveProperties.map((property) => (
                        <SellerPropertyCard 
                          key={property._id} 
                          property={property} 
                          onDelete={() => handleDeleteProperty(property._id)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
                
                <TabsContent value="all">
                  {isLoading ? (
                    <div className="text-center py-12">
                      <div className="spinner h-8 w-8 mb-4 mx-auto border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      <p className="text-muted-foreground">Loading your properties...</p>
                    </div>
                  ) : error ? (
                    <div className="text-center py-12 bg-destructive/10 rounded-lg">
                      <p className="text-destructive">Failed to load your properties</p>
                      <Button variant="outline" className="mt-4" onClick={() => refetch()}>Retry</Button>
                    </div>
                  ) : Array.isArray(properties) && properties.length === 0 ? (
                    <div className="text-center py-12 bg-secondary/30 rounded-lg">
                      <p className="text-muted-foreground mb-4">You haven't added any properties yet</p>
                      <Link to="/seller/property/add">
                        <Button>Add Your First Property</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {Array.isArray(properties) && properties.map((property) => (
                        <SellerPropertyCard 
                          key={property._id} 
                          property={property} 
                          onDelete={() => handleDeleteProperty(property._id)}
                        />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </div>
            </Tabs>
          </TabsContent>
          
          {/* Other tab contents would go here but are not shown to keep the code concise */}
          <TabsContent value="inquiries" className="m-0" active={activeTab === "inquiries"}>
            <Card>
              <CardHeader>
                <CardTitle>Property Inquiries</CardTitle>
                <CardDescription>Manage inquiries from potential buyers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p>Inquiries module coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="m-0" active={activeTab === "analytics"}>
            <Card>
              <CardHeader>
                <CardTitle>Property Analytics</CardTitle>
                <CardDescription>View performance metrics for your listings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p>Analytics module coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="m-0" active={activeTab === "profile"}>
            <Card>
              <CardHeader>
                <CardTitle>Profile Management</CardTitle>
                <CardDescription>Update your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p>Profile editing coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="m-0" active={activeTab === "settings"}>
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>Manage your account preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <p>Settings module coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </div>
    </div>
  );
};

export default SellerDashboard;

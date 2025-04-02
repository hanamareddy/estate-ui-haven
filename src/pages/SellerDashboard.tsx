import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, PlusCircle, BarChart2, Bell, User, Settings, 
  List, Grid, Search, Filter, X, ChevronRight, LogOut 
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import SellerPropertyCard from '@/components/SellerPropertyCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import mongoAuthService from '@/services/mongoAuthService';
import usePropertyAPI from '@/hooks/usePropertyAPI';
import { useUserAPI } from '@/hooks/useUserAPI';
import Navbar from '@/components/Navbar';
import BackToHomeButton from '@/components/BackToHomeButton';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');
  
  const currentUser = mongoAuthService.getCurrentUser();
  
  const { useSellerProperties, useDeleteProperty, useUpdateProperty } = usePropertyAPI();
  const { data: sellerPropertiesData, isLoading: isLoadingProperties, error: propertiesError, refetch } = useSellerProperties();
  const deletePropertyMutation = useDeleteProperty();
  const updatePropertyMutation = useUpdateProperty();

  const allProperties = sellerPropertiesData?.properties || [];
  
  const filteredProperties = allProperties
    .filter(property => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          property.title.toLowerCase().includes(query) ||
          property.address.toLowerCase().includes(query) ||
          property.description?.toLowerCase().includes(query)
        );
      }
      return true;
    })
    .filter(property => {
      if (activeFilter === 'all') return true;
      return property.status === activeFilter;
    });
    
  const activeProperties = filteredProperties.filter(p => p.status === 'active');
  const inactiveProperties = filteredProperties.filter(p => p.status === 'inactive');
  const draftProperties = filteredProperties.filter(p => p.status === 'draft');
  const pendingProperties = filteredProperties.filter(p => p.status === 'pending');
    
  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await deletePropertyMutation.mutateAsync(propertyId);
        toast({
          title: "Success",
          description: "Property has been deleted successfully",
        });
        refetch();
      } catch (error) {
        console.error('Error deleting property:', error);
        toast({
          title: "Error",
          description: "Failed to delete property. Please try again.",
          variant: "destructive"
        });
      }
    }
  };
  
  const handleToggleStatus = async (propertyId) => {
    const property = allProperties.find(p => p._id === propertyId);
    if (!property) return;
    
    const newStatus = property.status === 'active' ? 'inactive' : 'active';
    
    try {
      await updatePropertyMutation.mutateAsync({
        id: propertyId,
        data: { status: newStatus }
      });
      
      refetch();
    } catch (error) {
      console.error('Error updating property status:', error);
      toast({
        title: "Error",
        description: "Failed to update property status. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleEditProperty = (propertyId) => {
    navigate(`/seller/property/edit/${propertyId}`);
  };
  
  if (!currentUser || !currentUser.isseller) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Seller Dashboard</h1>
          <BackToHomeButton />
        </div>
        
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <h2 className="text-2xl font-bold">
                Hello, {currentUser.name || 'Seller'}
              </h2>
              
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    placeholder="Search properties..." 
                    className="pl-9" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      className="absolute right-3 top-1/2 transform -translate-y-1/2"
                      onClick={() => setSearchQuery('')}
                    >
                      <X size={16} className="text-muted-foreground" />
                    </button>
                  )}
                </div>
                
                <Button 
                  variant="outline" 
                  size="icon" 
                  onClick={() => setFilterVisible(!filterVisible)}
                >
                  <Filter size={20} />
                </Button>
                
                <div className="flex border rounded-md overflow-hidden">
                  <Button 
                    variant={viewMode === 'grid' ? 'default' : 'ghost'} 
                    size="icon"
                    className="rounded-none"
                    onClick={() => setViewMode('grid')}
                  >
                    <Grid size={18} />
                  </Button>
                  <Button 
                    variant={viewMode === 'list' ? 'default' : 'ghost'} 
                    size="icon"
                    className="rounded-none"
                    onClick={() => setViewMode('list')}
                  >
                    <List size={18} />
                  </Button>
                </div>
              </div>
            </div>
            
            {filterVisible && (
              <div className="mt-4 flex flex-wrap gap-2">
                <Button 
                  variant={activeFilter === 'all' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveFilter('all')}
                >
                  All
                </Button>
                <Button 
                  variant={activeFilter === 'active' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveFilter('active')}
                >
                  Active
                </Button>
                <Button 
                  variant={activeFilter === 'inactive' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveFilter('inactive')}
                >
                  Inactive
                </Button>
                <Button 
                  variant={activeFilter === 'draft' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveFilter('draft')}
                >
                  Draft
                </Button>
                <Button 
                  variant={activeFilter === 'pending' ? 'default' : 'outline'} 
                  size="sm"
                  onClick={() => setActiveFilter('pending')}
                >
                  Pending
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Tabs defaultValue="properties" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          
          <TabsContent value="properties" className="space-y-6">
            {isLoadingProperties ? (
              <div className="text-center p-12">
                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                <p>Loading your properties...</p>
              </div>
            ) : propertiesError ? (
              <div className="text-center p-12">
                <p className="text-red-500 mb-4">Failed to load properties</p>
                <Button onClick={() => refetch()}>Try Again</Button>
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="text-center p-12 bg-secondary/30 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">No properties found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchQuery || activeFilter !== 'all'
                    ? "No properties match your search criteria. Try adjusting your filters."
                    : "You haven't added any properties yet."}
                </p>
                <Link to="/seller/property/add">
                  <Button>Add Your First Property</Button>
                </Link>
              </div>
            ) : (
              <div className={viewMode === 'grid' 
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                : 'space-y-4'
              }>
                {filteredProperties.map(property => (
                  <SellerPropertyCard
                    key={property._id}
                    property={{
                      id: property._id,
                      title: property.title,
                      address: property.address,
                      price: property.price,
                      type: property.type,
                      bedrooms: property.bedrooms,
                      bathrooms: property.bathrooms,
                      sqft: property.sqft || 0,
                      images: property.images || ['https://via.placeholder.com/400x300?text=No+Image'],
                      status: property.status,
                      interestedUsers: property.interestedUsers || 0,
                      viewCount: property.viewCount || 0,
                      favoriteCount: property.favoriteCount || 0,
                      created: property.createdAt || new Date().toISOString()
                    }}
                    onToggleStatus={handleToggleStatus}
                    onEdit={handleEditProperty}
                    onDelete={handleDeleteProperty}
                  />
                ))}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="inquiries" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Inquiries</CardTitle>
                <CardDescription>
                  Manage and respond to inquiries about your listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  No inquiries to show at the moment
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Property Analytics</CardTitle>
                <CardDescription>
                  View performance metrics for your properties
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-center py-8 text-muted-foreground">
                  Analytics feature coming soon
                </p>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
                <CardDescription>
                  Manage your seller account and preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">Company Name</p>
                    <Input value={currentUser.companyName || ''} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">RERA ID</p>
                    <Input value={currentUser.reraId || ''} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">Email</p>
                    <Input value={currentUser.email || ''} readOnly />
                  </div>
                  <div className="grid gap-2">
                    <p className="text-sm font-medium">Phone</p>
                    <Input value={currentUser.phone || ''} readOnly />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Link to="/profile" className="w-full">
                  <Button className="w-full">Edit Profile</Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;

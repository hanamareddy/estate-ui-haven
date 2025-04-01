
import React, { useState } from 'react';
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

  // Prepare properties data
  const allProperties = sellerPropertiesData?.properties || [];
  
  // Filter properties
  const filteredProperties = allProperties
    .filter(property => {
      // Search filter
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
      // Status filter
      if (activeFilter === 'all') return true;
      return property.status === activeFilter;
    });
    
  // Group properties by status
  const activeProperties = filteredProperties.filter(p => p.status === 'active');
  const inactiveProperties = filteredProperties.filter(p => p.status === 'inactive');
  const draftProperties = filteredProperties.filter(p => p.status === 'draft');
  const pendingProperties = filteredProperties.filter(p => p.status === 'pending');
    
  // Handle property deletion
  const handleDeleteProperty = async (propertyId) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      try {
        await deletePropertyMutation.mutateAsync(propertyId);
        toast({
          title: "Success",
          description: "Property has been deleted successfully",
        });
        // Refetch properties
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
  
  // Handle property status toggle
  const handleToggleStatus = async (propertyId) => {
    // Find property to toggle
    const property = allProperties.find(p => p._id === propertyId);
    if (!property) return;
    
    // Toggle status
    const newStatus = property.status === 'active' ? 'inactive' : 'active';
    
    try {
      await updatePropertyMutation.mutateAsync({
        id: propertyId,
        data: { status: newStatus }
      });
      
      // Refetch properties
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
  
  // Handle property edit
  const handleEditProperty = (propertyId) => {
    navigate(`/seller/property/edit/${propertyId}`);
  };
  
  // If no user or not a seller, redirect to auth
  if (!currentUser || !currentUser.isseller) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="flex min-h-screen bg-secondary/20">
      {/* Sidebar */}
      <div className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
        <div className="px-6 py-8">
          <Link to="/" className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center mr-2">
              <span className="text-primary-foreground font-semibold text-sm">RE</span>
            </div>
            <span className="font-medium text-lg">EstateHub</span>
          </Link>
        </div>
        
        <div className="flex-1 px-4 py-2">
          <div className="space-y-1">
            <Link to="/seller/dashboard">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <Home size={18} />
                Dashboard
              </Button>
            </Link>
            <Link to="/seller/property/add">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <PlusCircle size={18} />
                Add Property
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <BarChart2 size={18} />
              Analytics
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Bell size={18} />
              Notifications
            </Button>
          </div>
          
          <Separator className="my-4" />
          
          <div className="space-y-1">
            <Link to="/profile">
              <Button variant="ghost" className="w-full justify-start gap-2">
                <User size={18} />
                Profile
              </Button>
            </Link>
            <Button variant="ghost" className="w-full justify-start gap-2">
              <Settings size={18} />
              Settings
            </Button>
            <Button variant="ghost" className="w-full justify-start gap-2" onClick={() => {
              mongoAuthService.logout();
              navigate('/');
            }}>
              <LogOut size={18} />
              Logout
            </Button>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        {/* Top navigation */}
        <header className="bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-4 lg:py-0">
            <div className="flex items-center flex-1">
              <h1 className="text-xl font-semibold">Seller Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Link to="/profile">
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <User size={20} />
                </Button>
              </Link>
              <Link to="/seller/property/add">
                <Button size="sm" className="hidden lg:flex gap-1">
                  <PlusCircle size={16} />
                  Add Property
                </Button>
                <Button size="icon" className="lg:hidden">
                  <PlusCircle size={20} />
                </Button>
              </Link>
            </div>
          </div>
        </header>
        
        {/* Content area */}
        <div className="p-4 lg:p-6">
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
    </div>
  );
};

export default SellerDashboard;

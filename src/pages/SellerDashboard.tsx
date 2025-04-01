
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Eye, EyeOff, Users, Home, Star, ClipboardList, 
  ArrowLeft, Filter, Mail, Bell, Plus, Trash2, Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { SellerPropertyCard } from "@/components/SellerPropertyCard";
import { SidebarProvider, Sidebar, SidebarContent, SidebarHeader, SidebarGroup, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter } from "@/components/ui/sidebar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import ActionButton from "@/components/ActionButton";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "@/hooks/use-toast";
import usePropertyAPI from "@/hooks/usePropertyAPI";
import { inquiryAPI } from "@/services/api";

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"all" | "active" | "inactive">("all");
  const [userFilter, setUserFilter] = useState<"all" | "new" | "contacted">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [interestedUsers, setInterestedUsers] = useState([]);
  const [interestedUsersLoading, setInterestedUsersLoading] = useState(true);
  
  // Get seller properties
  const { useSellerProperties, useDeleteProperty, useUpdateProperty } = usePropertyAPI();
  const { data: properties = [], isLoading: propertiesLoading, error: propertiesError, refetch: refreshProperties } = useSellerProperties();
  const deletePropertyMutation = useDeleteProperty();
  const updatePropertyMutation = useUpdateProperty();

  useEffect(() => {
    // Fetch interested buyers/inquiries
    const fetchInquiries = async () => {
      try {
        setInterestedUsersLoading(true);
        const response = await inquiryAPI.getSellerInquiries();
        setInterestedUsers(response.data || []);
      } catch (error) {
        console.error("Error fetching inquiries:", error);
        toast({
          title: "Error",
          description: "Failed to load interested buyers.",
          variant: "destructive"
        });
        setInterestedUsers([]);
      } finally {
        setInterestedUsersLoading(false);
      }
    };
    
    fetchInquiries();
  }, []);

  // Filter properties based on view mode
  const filteredProperties = Array.isArray(properties) ? properties.filter(property => {
    if (viewMode === "all") return true;
    if (viewMode === "active") return property.status === "active";
    if (viewMode === "inactive") return property.status !== "active";
    return true;
  }) : [];
  
  // Filter interested users based on user filter and search query
  const filteredUsers = Array.isArray(interestedUsers) ? interestedUsers.filter(user => {
    const matchesFilter = userFilter === "all" || user.status === userFilter;
    const matchesSearch = searchQuery === "" || 
      user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.propertyId?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  }) : [];

  // Toggle property status (active/inactive)
  const togglePropertyStatus = async (propertyId: string) => {
    try {
      const property = properties.find(p => p._id === propertyId || p.id === propertyId);
      if (!property) return;
      
      const newStatus = property.status === "active" ? "inactive" : "active";
      
      await updatePropertyMutation.mutateAsync({
        id: propertyId,
        data: { status: newStatus }
      });
      
    } catch (error) {
      console.error("Error toggling property status:", error);
    }
  };

  // Mark user as contacted
  const markUserAsContacted = async (userId: string) => {
    try {
      // Find the inquiry
      const inquiry = interestedUsers.find(user => user.id === userId);
      if (!inquiry) return;
      
      // Mark as contacted by sending a placeholder response
      await inquiryAPI.respondToInquiry(userId, "Your inquiry has been received. We will contact you soon.");
      
      // Refresh the inquiries
      const response = await inquiryAPI.getSellerInquiries();
      setInterestedUsers(response.data || []);
      
      toast({
        title: "Contact Status Updated",
        description: "User has been marked as contacted",
      });
    } catch (error) {
      console.error("Error marking user as contacted:", error);
      toast({
        title: "Error",
        description: "Failed to update contact status",
        variant: "destructive"
      });
    }
  };

  const handleEditProperty = (propertyId: string) => {
    navigate(`/seller/property/edit/${propertyId}`);
  };

  const handleDeleteClick = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = async () => {
    if (propertyToDelete) {
      try {
        await deletePropertyMutation.mutateAsync(propertyToDelete);
        setShowDeleteDialog(false);
        setPropertyToDelete(null);
        // Refresh properties will happen automatically due to queryClient invalidation
      } catch (error) {
        console.error("Error deleting property:", error);
      }
    }
  };

  // Calculate stats for the dashboard
  const totalProperties = filteredProperties.length;
  const totalInterested = filteredUsers.length;
  const totalViews = filteredProperties.reduce((sum, prop) => sum + (prop.viewCount || 0), 0);
  const newInquiries = filteredUsers.filter(u => u.status === "new").length;

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-secondary/30">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b">
            <div className="flex items-center gap-2 px-2 py-4">
              <Home className="h-6 w-6 text-accent" />
              <h1 className="text-xl font-semibold">RealEstate Pro</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Dashboard">
                    <Link to="/seller/dashboard" className="font-medium text-accent">
                      <ClipboardList />
                      <span>Dashboard</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Properties">
                    <Link to="/seller/dashboard">
                      <Home />
                      <span>Properties</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Add Property">
                    <Link to="/seller/property/add">
                      <Plus />
                      <span>Add Property</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Interested Buyers">
                    <Link to="/seller/dashboard">
                      <Users />
                      <span>Interested Buyers</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Analytics">
                    <Link to="/seller/dashboard">
                      <Star />
                      <span>Analytics</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter className="border-t">
            <div className="p-4">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Website
                </Link>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>
        
        <div className="flex-1 p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your properties and interested buyers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Properties
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalProperties}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Interested Buyers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalInterested}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{totalViews}</div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="properties" className="space-y-4">
            <TabsList>
              <TabsTrigger value="properties">My Properties</TabsTrigger>
              <TabsTrigger value="interested">Interested Buyers</TabsTrigger>
            </TabsList>
            
            <TabsContent value="properties" className="space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-2">
                  <ActionButton 
                    variant={viewMode === "all" ? "accent" : "default"}
                    active={viewMode === "all"}
                    onClick={() => setViewMode("all")}
                  >
                    All
                  </ActionButton>
                  <ActionButton 
                    variant={viewMode === "active" ? "accent" : "default"}
                    active={viewMode === "active"}
                    onClick={() => setViewMode("active")}
                  >
                    Active
                  </ActionButton>
                  <ActionButton 
                    variant={viewMode === "inactive" ? "accent" : "default"}
                    active={viewMode === "inactive"}
                    onClick={() => setViewMode("inactive")}
                  >
                    Inactive
                  </ActionButton>
                </div>
                <Button onClick={() => navigate("/seller/property/add")}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add New Property
                </Button>
              </div>
              
              {propertiesLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
                  <p>Loading your properties...</p>
                </div>
              ) : propertiesError ? (
                <div className="text-center py-12 text-red-500">
                  <p>Error loading properties. Please try again.</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => refreshProperties()}
                  >
                    Retry
                  </Button>
                </div>
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <Home className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No properties found</h3>
                  <p className="text-gray-500 mb-4">
                    {viewMode === "all" 
                      ? "You haven't added any properties yet" 
                      : `No ${viewMode} properties found`}
                  </p>
                  <Button onClick={() => navigate("/seller/property/add")}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New Property
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {filteredProperties.map(property => (
                    <SellerPropertyCard 
                      key={property._id || property.id}
                      property={{
                        id: property._id || property.id,
                        title: property.title,
                        address: property.address,
                        price: property.price,
                        type: property.type,
                        bedrooms: property.bedrooms,
                        bathrooms: property.bathrooms,
                        sqft: property.sqft,
                        images: property.images && property.images.length > 0 
                          ? property.images.map(img => img.url || img) 
                          : ['/placeholder.svg'],
                        status: property.status,
                        interestedUsers: property.interestedUsers || 0,
                        viewCount: property.viewCount || 0,
                        favoriteCount: property.favoriteCount || 0,
                        created: property.createdAt || new Date().toISOString()
                      }}
                      onToggleStatus={togglePropertyStatus}
                      onEdit={handleEditProperty}
                      onDelete={handleDeleteClick}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="interested" className="space-y-4">
              <div className="flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center">
                <div className="flex gap-2">
                  <ActionButton 
                    variant={userFilter === "all" ? "accent" : "default"}
                    active={userFilter === "all"}
                    onClick={() => setUserFilter("all")}
                  >
                    All
                  </ActionButton>
                  <ActionButton 
                    variant={userFilter === "new" ? "accent" : "default"}
                    active={userFilter === "new"}
                    badge={newInquiries.toString()}
                    onClick={() => setUserFilter("new")}
                  >
                    New
                  </ActionButton>
                  <ActionButton 
                    variant={userFilter === "contacted" ? "accent" : "default"}
                    active={userFilter === "contacted"}
                    onClick={() => setUserFilter("contacted")}
                  >
                    Contacted
                  </ActionButton>
                </div>
                <div className="relative w-full sm:w-auto">
                  <Input
                    className="pl-10 w-full sm:w-[250px]"
                    placeholder="Search buyers..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              {interestedUsersLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
                  <p>Loading interested buyers...</p>
                </div>
              ) : filteredUsers.length === 0 ? (
                <div className="text-center py-12 border rounded-lg bg-gray-50">
                  <Users className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No interested buyers found</h3>
                  <p className="text-gray-500 mb-4">
                    When buyers inquire about your properties, they'll appear here
                  </p>
                </div>
              ) : (
                <div className="rounded-lg border bg-card">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact Info</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredUsers.map(user => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>
                            <div>{user.email}</div>
                            <div className="text-muted-foreground">{user.phone}</div>
                          </TableCell>
                          <TableCell>
                            {new Date(user.contactDate || user.createdAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <Badge className={user.status === "new" ? "bg-accent" : "bg-muted"}>
                              {user.status === "new" ? "New" : "Contacted"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                              >
                                <Mail className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                disabled={user.status !== "new"}
                                onClick={() => markUserAsContacted(user.id)}
                              >
                                <Bell className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will permanently delete this property listing and cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </SidebarProvider>
  );
};

export default SellerDashboard;

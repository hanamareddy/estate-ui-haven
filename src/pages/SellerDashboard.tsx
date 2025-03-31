import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Eye, EyeOff, Users, Home, Star, ClipboardList, 
  ArrowLeft, Filter, Mail, Bell, Plus, Trash2
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
import { toast } from "@/components/ui/use-toast";

const MOCK_PROPERTIES = [
  {
    id: "prop001",
    title: "Modern Family Home",
    address: "123 Main St, Boston, MA",
    price: 450000,
    type: "House",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 2200,
    images: ["/placeholder.svg"],
    status: "active",
    interestedUsers: 7,
    viewCount: 124,
    favoriteCount: 18,
    created: "2023-10-15"
  },
  {
    id: "prop002",
    title: "Downtown Apartment",
    address: "456 Urban Ave, Boston, MA",
    price: 320000,
    type: "Apartment",
    bedrooms: 2,
    bathrooms: 1,
    sqft: 1100,
    images: ["/placeholder.svg"],
    status: "active",
    interestedUsers: 5,
    viewCount: 87,
    favoriteCount: 12,
    created: "2023-11-05"
  },
  {
    id: "prop003",
    title: "Suburban Land Plot",
    address: "789 Meadow Lane, Concord, MA",
    price: 180000,
    type: "Land",
    sqft: 8500,
    images: ["/placeholder.svg"],
    status: "inactive",
    interestedUsers: 2,
    viewCount: 45,
    favoriteCount: 4,
    created: "2023-12-20"
  }
];

const MOCK_INTERESTED_USERS = [
  {
    id: "user001",
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "617-555-1234",
    propertyId: "prop001",
    contactDate: "2024-01-15",
    message: "I'm interested in scheduling a viewing this weekend.",
    status: "new"
  },
  {
    id: "user002",
    name: "Emily Johnson",
    email: "emily.j@example.com",
    phone: "617-555-5678",
    propertyId: "prop001",
    contactDate: "2024-01-12",
    message: "Is this property still available? I'd like to know more about the neighborhood.",
    status: "contacted"
  },
  {
    id: "user003",
    name: "Michael Chen",
    email: "m.chen@example.com",
    phone: "617-555-9012",
    propertyId: "prop002",
    contactDate: "2024-01-10",
    message: "I'm pre-approved for a mortgage and would like to see this apartment.",
    status: "new"
  },
  {
    id: "user004",
    name: "Sarah Williams",
    email: "s.williams@example.com",
    phone: "617-555-3456",
    propertyId: "prop001",
    contactDate: "2024-01-08",
    message: "Are utilities included in the asking price? Looking to schedule a visit.",
    status: "contacted"
  },
  {
    id: "user005",
    name: "Robert Davis",
    email: "r.davis@example.com",
    phone: "617-555-7890",
    propertyId: "prop002",
    contactDate: "2024-01-05",
    message: "Is there parking available? I'm very interested in this property.",
    status: "new"
  }
];

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<"all" | "active" | "inactive">("all");
  const [userFilter, setUserFilter] = useState<"all" | "new" | "contacted">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);

  const filteredProperties = MOCK_PROPERTIES.filter(property => {
    if (viewMode === "all") return true;
    return property.status === viewMode;
  });

  const filteredUsers = MOCK_INTERESTED_USERS.filter(user => {
    const matchesFilter = userFilter === "all" || user.status === userFilter;
    const matchesSearch = searchQuery === "" || 
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.propertyId.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const togglePropertyStatus = (propertyId: string) => {
    console.log(`Toggled visibility for property: ${propertyId}`);
    toast({
      title: "Status Updated",
      description: "Property visibility has been updated successfully",
    });
  };

  const markUserAsContacted = (userId: string) => {
    console.log(`Marked user ${userId} as contacted`);
    toast({
      title: "Contact Status Updated",
      description: "User has been marked as contacted",
    });
  };

  const handleEditProperty = (propertyId: string) => {
    navigate(`/seller/property/edit/${propertyId}`);
  };

  const handleDeleteClick = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (propertyToDelete) {
      console.log(`Deleting property: ${propertyToDelete}`);
      toast({
        title: "Property Deleted",
        description: "The property has been successfully removed",
      });
      setShowDeleteDialog(false);
      setPropertyToDelete(null);
    }
  };

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
                <div className="text-3xl font-bold">{MOCK_PROPERTIES.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Interested Buyers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{MOCK_INTERESTED_USERS.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {MOCK_PROPERTIES.reduce((sum, prop) => sum + prop.viewCount, 0)}
                </div>
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
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {filteredProperties.map(property => (
                  <SellerPropertyCard 
                    key={property.id}
                    property={property}
                    onToggleStatus={togglePropertyStatus}
                    onEdit={handleEditProperty}
                    onDelete={handleDeleteClick}
                  />
                ))}
              </div>
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
                    badge={MOCK_INTERESTED_USERS.filter(u => u.status === "new").length.toString()}
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
                          {new Date(user.contactDate).toLocaleDateString()}
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
                              disabled={user.status === "contacted"}
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

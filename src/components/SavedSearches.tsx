
import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  BellOff, 
  Edit2, 
  Trash2, 
  Map, 
  Check,
  Loader2,
  Plus 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { SavedSearch } from '@/types/savedSearch';

export const SavedSearches = () => {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreatingSearch, setIsCreatingSearch] = useState(false);
  const [newSearchName, setNewSearchName] = useState('');
  const [newSearchLocation, setNewSearchLocation] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  
  // Criteria states
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [propertyType, setPropertyType] = useState('');
  const [bedrooms, setBedrooms] = useState('');
  
  useEffect(() => {
    fetchSavedSearches();
  }, []);
  
  const fetchSavedSearches = async () => {
    try {
      setLoading(true);
      
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        // Mock data for demonstration if user is not logged in
        setSearches([
          {
            id: '1',
            name: 'Mumbai Apartments',
            location: 'Mumbai',
            criteria: {
              minPrice: 5000000,
              maxPrice: 15000000,
              propertyType: 'Apartment',
              bedrooms: 2
            },
            notifications_enabled: true,
            user_id: 'demo-user'
          },
          {
            id: '2',
            name: 'Bangalore Villas',
            location: 'Bangalore',
            criteria: {
              minPrice: 20000000,
              maxPrice: 50000000,
              propertyType: 'Villa',
              bedrooms: 4
            },
            notifications_enabled: false,
            user_id: 'demo-user'
          },
          {
            id: '3',
            name: 'Delhi Budget Homes',
            location: 'Delhi NCR',
            criteria: {
              minPrice: 3000000,
              maxPrice: 8000000,
              propertyType: 'House',
              bedrooms: 3
            },
            notifications_enabled: true,
            user_id: 'demo-user'
          }
        ]);
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('saved_searches')
        .select('*')
        .eq('user_id', session.session.user.id)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setSearches(data || []);
    } catch (error) {
      console.error('Error fetching saved searches:', error);
      toast({
        title: 'Error',
        description: 'Failed to load your saved searches',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  const toggleNotifications = async (searchId: string, currentStatus: boolean) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to manage notification settings',
          variant: 'destructive',
        });
        return;
      }
      
      const { error } = await supabase
        .from('saved_searches')
        .update({ notifications_enabled: !currentStatus })
        .eq('id', searchId)
        .eq('user_id', session.session.user.id);
      
      if (error) throw error;
      
      // Update the UI
      setSearches(prevSearches => 
        prevSearches.map(search => 
          search.id === searchId 
            ? { ...search, notifications_enabled: !currentStatus } 
            : search
        )
      );
      
      toast({
        title: 'Success',
        description: `Notifications ${!currentStatus ? 'enabled' : 'disabled'} for this search.`,
      });
    } catch (error) {
      console.error('Error toggling notifications:', error);
      toast({
        title: 'Error',
        description: 'Failed to update notification settings',
        variant: 'destructive',
      });
    }
  };
  
  const deleteSearch = async (searchId: string) => {
    try {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        // For demo, just remove from local state
        setSearches(prevSearches => 
          prevSearches.filter(search => search.id !== searchId)
        );
        
        toast({
          title: 'Search Deleted',
          description: 'Your saved search has been deleted.',
        });
        return;
      }
      
      const { error } = await supabase
        .from('saved_searches')
        .delete()
        .eq('id', searchId)
        .eq('user_id', session.session.user.id);
      
      if (error) throw error;
      
      // Update the UI
      setSearches(prevSearches => 
        prevSearches.filter(search => search.id !== searchId)
      );
      
      toast({
        title: 'Search Deleted',
        description: 'Your saved search has been deleted.',
      });
    } catch (error) {
      console.error('Error deleting saved search:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete search',
        variant: 'destructive',
      });
    }
  };
  
  const createNewSearch = async () => {
    try {
      setIsCreatingSearch(true);
      
      if (!newSearchName || !newSearchLocation) {
        toast({
          title: 'Missing Information',
          description: 'Please provide a name and location for your search.',
          variant: 'destructive',
        });
        return;
      }
      
      // Get current user
      const { data: session } = await supabase.auth.getSession();
      
      if (!session?.session) {
        toast({
          title: 'Authentication Required',
          description: 'Please log in to save searches.',
          variant: 'destructive',
        });
        return;
      }
      
      // Create criteria object
      const criteria = {
        minPrice: minPrice ? parseInt(minPrice) : null,
        maxPrice: maxPrice ? parseInt(maxPrice) : null,
        propertyType: propertyType || null,
        bedrooms: bedrooms ? parseInt(bedrooms) : null,
      };
      
      // Save to database
      const { data, error } = await supabase
        .from('saved_searches')
        .insert({
          user_id: session.session.user.id,
          name: newSearchName,
          location: newSearchLocation,
          criteria: criteria,
          notifications_enabled: notificationsEnabled
        })
        .select('*')
        .single();
      
      if (error) throw error;
      
      // Update UI
      setSearches(prevSearches => [data as SavedSearch, ...prevSearches]);
      
      // Reset form
      setNewSearchName('');
      setNewSearchLocation('');
      setMinPrice('');
      setMaxPrice('');
      setPropertyType('');
      setBedrooms('');
      setNotificationsEnabled(true);
      
      toast({
        title: 'Search Saved',
        description: 'Your search has been saved successfully.',
      });
    } catch (error) {
      console.error('Error creating saved search:', error);
      toast({
        title: 'Error',
        description: 'Failed to save your search. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreatingSearch(false);
    }
  };
  
  // Format criteria for display
  const formatCriteria = (criteria: any) => {
    if (!criteria) return 'All Properties';
    
    const parts = [];
    
    if (criteria.propertyType) {
      parts.push(criteria.propertyType);
    }
    
    if (criteria.bedrooms) {
      parts.push(`${criteria.bedrooms} BHK`);
    }
    
    if (criteria.minPrice && criteria.maxPrice) {
      parts.push(`₹${criteria.minPrice/100000}L - ₹${criteria.maxPrice/100000}L`);
    } else if (criteria.minPrice) {
      parts.push(`>₹${criteria.minPrice/100000}L`);
    } else if (criteria.maxPrice) {
      parts.push(`<₹${criteria.maxPrice/100000}L`);
    }
    
    return parts.length > 0 ? parts.join(', ') : 'All Properties';
  };
  
  return (
    <section className="py-6">
      <div className="container mx-auto px-4">
        <div className="md:flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold mb-2 md:mb-0">Saved Searches</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Plus className="h-4 w-4" />
                Save New Search
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Save a New Search</DialogTitle>
                <DialogDescription>
                  Create a new saved search to track properties that match your criteria.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input 
                    id="name" 
                    value={newSearchName} 
                    onChange={(e) => setNewSearchName(e.target.value)} 
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="location" className="text-right">
                    Location
                  </Label>
                  <Input 
                    id="location" 
                    value={newSearchLocation} 
                    onChange={(e) => setNewSearchLocation(e.target.value)} 
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="minPrice" className="text-right">
                    Min Price
                  </Label>
                  <Input
                    type="number"
                    id="minPrice"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Minimum Price"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="maxPrice" className="text-right">
                    Max Price
                  </Label>
                  <Input
                    type="number"
                    id="maxPrice"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Maximum Price"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="propertyType" className="text-right">
                    Property Type
                  </Label>
                  <Input
                    type="text"
                    id="propertyType"
                    value={propertyType}
                    onChange={(e) => setPropertyType(e.target.value)}
                    placeholder="Apartment, House, etc."
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="bedrooms" className="text-right">
                    Bedrooms
                  </Label>
                  <Input
                    type="number"
                    id="bedrooms"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(e.target.value)}
                    placeholder="Number of Bedrooms"
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="notifications" className="text-right">
                    Notifications
                  </Label>
                  <Switch 
                    id="notifications" 
                    checked={notificationsEnabled}
                    onCheckedChange={(checked) => setNotificationsEnabled(checked)}
                    className="col-span-3 justify-start"
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary">Cancel</Button>
                </DialogClose>
                <Button type="submit" onClick={createNewSearch} disabled={isCreatingSearch}>
                  {isCreatingSearch ? (
                    <>
                      Saving <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                    </>
                  ) : (
                    "Save Search"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-accent" />
            <span className="ml-2">Loading saved searches...</span>
          </div>
        ) : searches.length === 0 ? (
          <div className="text-center py-12">
            <Map className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No Saved Searches</h3>
            <p className="text-muted-foreground">
              Save your search criteria to quickly find properties that match your needs.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searches.map((search) => (
              <Card key={search.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{search.name}</CardTitle>
                    <Badge variant="secondary">
                      {formatCriteria(search.criteria)}
                    </Badge>
                  </div>
                  <CardDescription>
                    <span className="flex items-center gap-1">
                      <Map className="h-4 w-4" />
                      {search.location}
                    </span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Additional search details could go here */}
                </CardContent>
                <CardFooter className="flex justify-between items-center">
                  <Button variant="ghost" size="sm">
                    <Edit2 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <div className="flex items-center space-x-2">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => toggleNotifications(search.id, search.notifications_enabled)}
                    >
                      {search.notifications_enabled ? (
                        <>
                          <Bell className="h-4 w-4 mr-2" />
                          Disable
                        </>
                      ) : (
                        <>
                          <BellOff className="h-4 w-4 mr-2" />
                          Enable
                        </>
                      )}
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => deleteSearch(search.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SavedSearches;

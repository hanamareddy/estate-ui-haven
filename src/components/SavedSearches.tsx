
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, BellOff, Edit, Trash, MoreVertical, Clock } from "lucide-react";
import { SavedSearch } from "@/types/savedSearch";
import { toast } from "@/hooks/use-toast";
import { userAPI } from "@/services/api";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SavedSearchesProps {
  userId?: string;
}

const SavedSearches: React.FC<SavedSearchesProps> = ({ userId }) => {
  const [searches, setSearches] = useState<SavedSearch[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSavedSearches = async () => {
      try {
        setLoading(true);
        const response = await userAPI.getSavedSearches();
        setSearches(response.data || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching saved searches:", err);
        setError("Unable to load saved searches. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchSavedSearches();
  }, [userId]);

  const handleToggleNotifications = async (searchId: string, currentState: boolean) => {
    try {
      await userAPI.toggleSearchNotifications(searchId, !currentState);
      
      // Update local state
      setSearches(searches.map(search => 
        search.id === searchId 
          ? {...search, notifications_enabled: !currentState} 
          : search
      ));

      toast({
        title: `Notifications ${!currentState ? 'enabled' : 'disabled'}`,
        description: `You'll ${!currentState ? 'now' : 'no longer'} receive alerts for this search.`,
      });
    } catch (err) {
      console.error("Error toggling notifications:", err);
      toast({
        title: "Error",
        description: "Failed to update notification settings. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleDeleteSearch = async (searchId: string) => {
    try {
      await userAPI.deleteSearch(searchId);
      
      // Update local state
      setSearches(searches.filter(search => search.id !== searchId));

      toast({
        title: "Search deleted",
        description: "Your saved search has been deleted successfully.",
      });
    } catch (err) {
      console.error("Error deleting search:", err);
      toast({
        title: "Error",
        description: "Failed to delete search. Please try again.",
        variant: "destructive",
        duration: 3000
      });
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="text-center text-red-500 p-4">
            <p>{error}</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (searches.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saved Searches</CardTitle>
          <CardDescription>
            You haven't saved any property searches yet.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center p-6 border-2 border-dashed rounded-md">
            <p className="text-muted-foreground mb-4">
              Save your search filters to get notified when new properties matching your criteria become available.
            </p>
            <Button onClick={() => window.location.href = "/#properties"}>
              Start Searching
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saved Searches</CardTitle>
        <CardDescription>
          Receive notifications when new properties match your criteria
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {searches.map((search) => (
            <div 
              key={search.id} 
              className="border rounded-lg overflow-hidden hover:border-primary/50 transition-colors duration-200"
            >
              <div className="flex items-center justify-between p-4 bg-background">
                <div className="space-y-1">
                  <div className="flex items-center">
                    <h3 className="font-medium">{search.name}</h3>
                    {search.notifications_enabled && (
                      <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
                        Alerts On
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {search.location || 'Any location'}
                  </p>
                </div>
                <div className="flex items-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleToggleNotifications(search.id, search.notifications_enabled)}
                    title={search.notifications_enabled ? "Disable notifications" : "Enable notifications"}
                  >
                    {search.notifications_enabled ? (
                      <Bell className="h-4 w-4 text-primary" />
                    ) : (
                      <BellOff className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem 
                        onClick={() => window.location.href = `/properties?search=${search.id}`}
                        className="cursor-pointer"
                      >
                        <Edit className="mr-2 h-4 w-4" />
                        Run Search
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDeleteSearch(search.id)}
                        className="cursor-pointer text-red-600 focus:text-red-600"
                      >
                        <Trash className="mr-2 h-4 w-4" />
                        Delete Search
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
              
              <div className="px-4 py-2 bg-muted/40 border-t text-xs text-muted-foreground flex items-center">
                <Clock className="h-3 w-3 mr-1" />
                <span>Last updated: {formatDate(search.updated_at)}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SavedSearches;

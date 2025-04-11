
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import SellerPropertyCard from '@/components/SellerPropertyCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';
import { useState } from 'react';

interface Property {
  _id: string;
  title: string;
  address: string;
  price: number;
  type: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  images?: string[];
  status: string;
  interestedUsers?: number;
  viewCount?: number;
  favoriteCount?: number;
  createdAt?: string;
}

interface PropertiesTabContentProps {
  isLoading: boolean;
  error: any;
  filteredProperties: Property[];
  viewMode: string;
  handleToggleStatus: (propertyId: string) => void;
  handleEditProperty: (propertyId: string) => void;
  handleDeleteProperty: (propertyId: string) => void;
  handleViewAnalytics?: (propertyId: string) => void;
  refetch: () => void;
  searchQuery: string;
  activeFilter: string;
}

const PropertiesTabContent = ({
  isLoading,
  error,
  filteredProperties,
  viewMode,
  handleToggleStatus,
  handleEditProperty,
  handleDeleteProperty,
  handleViewAnalytics,
  refetch,
  searchQuery,
  activeFilter
}: PropertiesTabContentProps) => {
  const navigate = useNavigate();
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);

  // Handle delete confirmation
  const openDeleteConfirmation = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setConfirmDialogOpen(true);
  };

  const confirmDelete = () => {
    if (propertyToDelete) {
      handleDeleteProperty(propertyToDelete);
      setConfirmDialogOpen(false);
      setPropertyToDelete(null);
    }
  };

  const cancelDelete = () => {
    setConfirmDialogOpen(false);
    setPropertyToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="rounded-lg border overflow-hidden">
            <Skeleton className="h-[200px] w-full" />
            <div className="p-4 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
              <div className="grid grid-cols-2 gap-2 mt-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
              <Skeleton className="h-10 w-full mt-2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-12 bg-destructive/10 rounded-lg">
        <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <p className="text-destructive font-medium mb-4">Failed to load properties</p>
        <p className="text-muted-foreground mb-6">
          There was an error loading your properties. This could be due to a network issue or a server problem.
        </p>
        <Button onClick={refetch}>Try Again</Button>
      </div>
    );
  }

  if (filteredProperties.length === 0) {
    return (
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
    );
  }

  const defaultViewAnalytics = (propertyId: string) => {
    navigate(`/seller/dashboard?tab=analytics&property=${propertyId}`);
  };

  console.log("filteredProperties  ",filteredProperties);
  return (
    <>
      <div
        className={
          viewMode === 'grid'
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            : 'space-y-4'
        }
      >
        
        {filteredProperties.map((property,index) => (
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
              images: property.images|| ['https://via.placeholder.com/400x300?text=No+Image'],
              status: property.status,
              interestedUsers: property.interestedUsers || 0,
              viewCount: property.viewCount || 0,
              favoriteCount: property.favoriteCount || 0,
              created: property.createdAt || new Date().toISOString()
            }}
            onToggleStatus={handleToggleStatus}
            onEdit={handleEditProperty}
            onDelete={openDeleteConfirmation}
            onViewAnalytics={handleViewAnalytics || defaultViewAnalytics}
          />
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-destructive flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Confirm Deletion
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this property? This action cannot be undone, and all data associated with this property will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 sm:space-x-0">
            <Button variant="outline" onClick={cancelDelete}>Cancel</Button>
            <Button variant="destructive" onClick={confirmDelete}>Delete Property</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default PropertiesTabContent;

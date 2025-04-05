
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import mongoAuthService from '@/services/mongoAuthService';
import usePropertyAPI from '@/hooks/usePropertyAPI';
import Navbar from '@/components/Navbar';
import DashboardHeader from '@/components/seller/DashboardHeader';
import PropertiesTabContent from '@/components/seller/PropertiesTabContent';
import InquiriesTabContent from '@/components/seller/InquiriesTabContent';
import AnalyticsTabContent from '@/components/seller/AnalyticsTabContent';
import SettingsTabContent from '@/components/seller/SettingsTabContent';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('properties');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [viewMode, setViewMode] = useState('grid');

  const currentUser = mongoAuthService.getCurrentUser();

  const { useSellerProperties, useDeleteProperty, useUpdateProperty } = usePropertyAPI();
  const { 
    data: sellerPropertiesData, 
    isLoading: isLoadingProperties, 
    error: propertiesError, 
    refetch 
  } = useSellerProperties();

  const deletePropertyMutation = useDeleteProperty();
  const updatePropertyMutation = useUpdateProperty();
  
  const allProperties = sellerPropertiesData || [];
  
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
        <DashboardHeader
          userName={currentUser.name}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filterVisible={filterVisible}
          setFilterVisible={setFilterVisible}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />

        <Tabs defaultValue="properties" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="properties">Properties</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="properties" className="space-y-6">
            <PropertiesTabContent
              isLoading={isLoadingProperties}
              error={propertiesError}
              filteredProperties={filteredProperties}
              viewMode={viewMode}
              handleToggleStatus={handleToggleStatus}
              handleEditProperty={handleEditProperty}
              handleDeleteProperty={handleDeleteProperty}
              refetch={refetch}
              searchQuery={searchQuery}
              activeFilter={activeFilter}
            />
          </TabsContent>

          <TabsContent value="inquiries" className="space-y-6">
            <InquiriesTabContent />
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <AnalyticsTabContent />
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <SettingsTabContent currentUser={currentUser} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SellerDashboard;

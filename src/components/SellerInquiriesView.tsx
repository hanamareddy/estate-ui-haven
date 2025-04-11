
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { inquiryAPI } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { Loader2, Filter } from 'lucide-react';
import { SellerInquiry } from '@/types/propertyInquiry';
import { useNavigate } from 'react-router-dom';
import InquiryStatusFilter from './InquiryStatusFilter';
import InquiryListItem from './inquiry/InquiryListItem';
import InquiryDetailDialog from './inquiry/InquiryDetailDialog';

const SellerInquiriesView = () => {
  const [sellerInquiries, setSellerInquiries] = useState<SellerInquiry[]>([]);
  const [filteredInquiries, setFilteredInquiries] = useState<SellerInquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedInquiry, setSelectedInquiry] = useState<SellerInquiry | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  // Count inquiries by status
  const inquiryCounts = {
    all: sellerInquiries.length,
    pending: sellerInquiries.filter(inq => inq.status === 'pending').length,
    responded: sellerInquiries.filter(inq => inq.status === 'responded').length,
    closed: sellerInquiries.filter(inq => inq.status === 'closed').length
  };

  useEffect(() => {
    fetchSellerInquiries();
  }, []);

  // Apply filter when status filter or inquiries change
  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredInquiries(sellerInquiries);
    } else {
      setFilteredInquiries(sellerInquiries.filter(inq => inq.status === statusFilter));
    }
  }, [statusFilter, sellerInquiries]);

  const fetchSellerInquiries = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await inquiryAPI.getSellerInquiries();
      // Ensure we have valid data before setting state
      if (response && response.data && Array.isArray(response.data)) {
        // Map the API response to match our SellerInquiry type structure
        const formattedInquiries = response.data.map(inquiry => {
          const property = inquiry.property || {
            _id: inquiry.propertyId,
            title: inquiry.propertyTitle,
            address: inquiry.propertyAddress,
            price: inquiry.propertyPrice,
            city: inquiry.propertyCity,
            state: inquiry.propertyState,
            images: inquiry.propertyImages || [],
            type: inquiry.propertyType,
            status: inquiry.propertyStatus,
          };
        
          if (!property || !property.title) {
            console.error('Missing property data in inquiry:', inquiry);
            return null;
          }
        
          return {
            id: inquiry._id || inquiry.id,
            property: {
              id: property._id || inquiry.propertyId || 'unknown',
              title: property.title || 'Property',
              location: property.address || 'Unknown location',
              price: property.price || 0,
              city: property.city || '',
              state: property.state || '',
              images: Array.isArray(property.images)
                ? property.images.map(img => (typeof img === 'object' ? img.url : img))
                : [],
              type: property.type || 'unknown',
              status: property.status || 'unknown',
            },
            user: {
              id: inquiry.user?._id || inquiry.user?.id || inquiry.buyerInfo?.id || 'unknown',
              name: inquiry.user?.name || inquiry.buyerInfo?.name || inquiry.contactName || 'Unknown user',
              email: inquiry.user?.email || inquiry.buyerInfo?.email || inquiry.contactEmail || 'No email provided',
              phone: inquiry.user?.phone || inquiry.buyerInfo?.phone || inquiry.contactPhone || 'Not provided'
            },
            message: inquiry.message || '',
            sellerResponse: inquiry.sellerResponse || null,
            status: inquiry.status || 'pending',
            createdAt: inquiry.createdAt || new Date().toISOString(),
            updatedAt: inquiry.updatedAt || inquiry.createdAt || new Date().toISOString()
          };
        }).filter(Boolean) as SellerInquiry[];
        
        setSellerInquiries(formattedInquiries);
        setFilteredInquiries(formattedInquiries);
      } else {
        throw new Error('Invalid response data format');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to fetch inquiries');
      console.error('Error fetching seller inquiries:', err);
      toast({
        title: 'Error',
        description: 'Failed to load inquiries. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filter: string) => {
    setStatusFilter(filter);
  };

  const handleViewProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };

  const handleCloseInquiry = async (inquiryId: string) => {
    try {
      await inquiryAPI.updateInquiryStatus(inquiryId, 'closed');
      toast({
        title: 'Inquiry Closed',
        description: 'The inquiry has been marked as closed.',
      });
      fetchSellerInquiries();
    } catch (err: any) {
      console.error('Error closing inquiry:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to close inquiry',
        variant: 'destructive',
      });
    }
  };

  const handleViewInquiryDetail = (inquiryId: string) => {
    const inquiry = sellerInquiries.find(inq => inq.id === inquiryId);
    if (inquiry) {
      setSelectedInquiry(inquiry);
      setIsDetailDialogOpen(true);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading inquiries...</span>
      </div>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardContent>
            {error}
          </CardContent>
        </CardHeader>
        <CardContent>
          <Button onClick={fetchSellerInquiries}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6 mx-2 mt-8">
      <h2 className="text-xl sm:text-2xl font-bold">Property Inquiries from Buyers</h2>
      
      <InquiryStatusFilter 
        activeFilter={statusFilter}
        onFilterChange={handleFilterChange}
        counts={inquiryCounts}
      />
      
      {filteredInquiries.length === 0 ? (
        <Card className="text-center p-8">
          <CardContent className="pt-6">
            <Filter className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
            <p className="text-lg font-medium mb-2">No {statusFilter} inquiries found</p>
            <p className="text-muted-foreground">
              There are no inquiries with the selected status. Try changing your filter.
            </p>
          </CardContent>
          <div className="flex justify-center pt-4">
            <Button variant="outline" onClick={() => setStatusFilter('all')}>Show All Inquiries</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-1">
          {filteredInquiries.map((inquiry) => (
            <InquiryListItem
              key={inquiry.id}
              inquiry={inquiry}
              onViewDetail={handleViewInquiryDetail}
              onViewProperty={handleViewProperty}
              onCloseInquiry={handleCloseInquiry}
            />
          ))}
        </div>
      )}

      {selectedInquiry && (
        <InquiryDetailDialog
          inquiry={selectedInquiry}
          isOpen={isDetailDialogOpen}
          onClose={() => setIsDetailDialogOpen(false)}
          onPropertyClick={handleViewProperty}
          onUpdateSuccess={fetchSellerInquiries}
        />
      )}
    </div>
  );
};

export default SellerInquiriesView;

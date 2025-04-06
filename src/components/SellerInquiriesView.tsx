
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { inquiryAPI } from "@/services/api";
import { toast } from "@/hooks/use-toast";
import { formatDistanceToNow } from 'date-fns';
import { Loader2, ExternalLink } from 'lucide-react';
import { SellerInquiry } from '@/types/propertyInquiry';
import { useNavigate } from 'react-router-dom';
import { useIsMobile } from '@/hooks/use-mobile';

const SellerInquiriesView = () => {
  const [sellerInquiries, setSellerInquiries] = useState<SellerInquiry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [responding, setResponding] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  useEffect(() => {
    fetchSellerInquiries();
  }, []);

  const fetchSellerInquiries = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await inquiryAPI.getSellerInquiries();
      // Ensure we have valid data before setting state
      if (response && response.data && Array.isArray(response.data)) {
        // Map the API response to match our SellerInquiry type structure
        const formattedInquiries = response.data.map(inquiry => {
          // Make sure property exists before accessing its properties
          if (!inquiry.property) {
            console.error('Missing property data in inquiry:', inquiry);
            return null;
          }
          
          return {
            id: inquiry._id || inquiry.id,
            property: {
              id: inquiry.property._id || inquiry.propertyId,
              title: inquiry.property.title || inquiry.propertyTitle || 'Property',
              location: inquiry.property.address || inquiry.propertyAddress || 'Unknown location',
              price: inquiry.property.price || 0,
              city: inquiry.property.city || '',
              state: inquiry.property.state || '',
              images: Array.isArray(inquiry.property.images) 
                ? inquiry.property.images.map(img => (typeof img === 'object' ? img.url : img)) 
                : [],
              type: inquiry.property.type || 'unknown',
              status: inquiry.property.status || 'unknown',
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

  const handleResponseChange = (inquiryId: string, value: string) => {
    setResponses(prev => ({ ...prev, [inquiryId]: value }));
  };

  const handleSendResponse = async (inquiryId: string) => {
    if (!responses[inquiryId]?.trim()) return;
    
    setResponding(prev => ({ ...prev, [inquiryId]: true }));
    
    try {
      await inquiryAPI.respondToInquiry(inquiryId, responses[inquiryId]);
      // Clear response field after successful submission
      setResponses(prev => ({ ...prev, [inquiryId]: '' }));
      
      // Refresh inquiries after response
      fetchSellerInquiries();
      
      toast({
        title: 'Response Sent',
        description: 'Your response has been sent to the buyer.',
      });
    } catch (err: any) {
      console.error('Error sending response:', err);
      toast({
        title: 'Error',
        description: err.message || 'Failed to send response',
        variant: 'destructive',
      });
    } finally {
      setResponding(prev => ({ ...prev, [inquiryId]: false }));
    }
  };

  const handleViewProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
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
          <CardDescription>
            {error}
          </CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={fetchSellerInquiries}>Try Again</Button>
        </CardFooter>
      </Card>
    );
  }

  if (sellerInquiries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Property Inquiries</CardTitle>
          <CardDescription>
            You haven't received any property inquiries yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl sm:text-2xl font-bold">Property Inquiries from Buyers</h2>
      <div className="grid gap-4">
        {sellerInquiries.map((inquiry) => (
          <Card key={inquiry.id} className="overflow-hidden">
            <CardHeader className="pb-2 px-4 sm:px-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                <div>
                  <CardTitle className="text-lg line-clamp-1">{inquiry.property.title}</CardTitle>
                  <CardDescription className="text-sm">{inquiry.property.location}</CardDescription>
                </div>
                <Badge
                  className={`self-start ${
                    inquiry.status === 'responded'
                      ? 'bg-green-500'
                      : inquiry.status === 'closed'
                      ? 'bg-gray-500'
                      : 'bg-yellow-500'
                  }`}
                >
                  {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="px-4 sm:px-6">
              <div className="space-y-4">
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="text-sm font-medium">Buyer Information:</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1 text-sm">
                    <p>Name: <span className="font-medium">{inquiry.user.name}</span></p>
                    <p>Email: <span className="font-medium break-all">{inquiry.user.email}</span></p>
                    {inquiry.user.phone && (
                      <p>Phone: <span className="font-medium">{inquiry.user.phone}</span></p>
                    )}
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Inquiry:</p>
                  <p className="text-sm border-l-2 border-muted pl-3 py-1">{inquiry.message}</p>
                </div>
                
                {inquiry.sellerResponse ? (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Your response:</p>
                    <p className="text-sm border-l-2 border-green-500 bg-green-50 pl-3 py-2 rounded">
                      {inquiry.sellerResponse}
                    </p>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm font-medium mb-1">Respond to inquiry:</p>
                    <Textarea
                      value={responses[inquiry.id] || ''}
                      onChange={(e) => handleResponseChange(inquiry.id, e.target.value)}
                      placeholder="Type your response here..."
                      className="mb-2 resize-none"
                      rows={isMobile ? 3 : 4}
                    />
                    <Button 
                      size="sm"
                      onClick={() => handleSendResponse(inquiry.id)}
                      disabled={!responses[inquiry.id]?.trim() || responding[inquiry.id]}
                      className="w-full sm:w-auto"
                    >
                      {responding[inquiry.id] ? 'Sending...' : 'Send Response'}
                    </Button>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground text-right">
                  Received {formatDistanceToNow(new Date(inquiry.createdAt))} ago
                </p>
              </div>
            </CardContent>
            <CardFooter className="px-4 sm:px-6 pt-0">
              <Button 
                variant="outline" 
                size="sm" 
                className="ml-auto gap-2"
                onClick={() => handleViewProperty(inquiry.property.id)}
              >
                <ExternalLink className="h-4 w-4" />
                <span className="hidden sm:inline">View Property</span>
                <span className="sm:hidden">View</span>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SellerInquiriesView;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from 'date-fns';
import { Loader2, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useUserInquiries from '@/hooks/inquiries/useUserInquiries';

const UserInquiriesView = () => {
  const { inquiries, loading, error, fetchInquiries } = useUserInquiries();
  const navigate = useNavigate();
  
  const handleViewProperty = (propertyId: string) => {
    navigate(`/property/${propertyId}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading your inquiries...</span>
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
        <CardContent>
          <Button onClick={fetchInquiries}>Try Again</Button>
        </CardContent>
      </Card>
    );
  }
  
  if (inquiries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Property Inquiries</CardTitle>
          <CardDescription>
            You haven't sent any inquiries to property owners yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Your Property Inquiries</h2>
      <div className="grid gap-4">
        {inquiries.map((inquiry) => (
          <Card key={inquiry.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{inquiry.property.title}</CardTitle>
                  <CardDescription>{inquiry.property.location}</CardDescription>
                </div>
                <Badge
                  className={
                    inquiry.status === 'responded'
                      ? 'bg-green-500'
                      : inquiry.status === 'closed'
                      ? 'bg-gray-500'
                      : 'bg-yellow-500'
                  }
                >
                  {inquiry.status.charAt(0).toUpperCase() + inquiry.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your inquiry:</p>
                  <p className="text-sm border-l-2 border-muted pl-3 py-1">{inquiry.message}</p>
                </div>
                
                {inquiry.sellerResponse && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Seller's response:</p>
                    <p className="text-sm border-l-2 border-green-500 bg-green-50 pl-3 py-2 rounded">
                      {inquiry.sellerResponse}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-between items-center">
                  <p className="text-xs text-muted-foreground">
                    Sent {formatDistanceToNow(new Date(inquiry.createdAt))} ago
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleViewProperty(inquiry.property.id)}
                  >
                    <Eye className="h-4 w-4 mr-1" /> View Property
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserInquiriesView;

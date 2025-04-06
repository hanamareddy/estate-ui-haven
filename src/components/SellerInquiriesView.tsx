
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import usePropertyInquiries from "@/hooks/usePropertyInquiries";
import { formatDistanceToNow } from 'date-fns';

const SellerInquiriesView = () => {
  const { sellerInquiries, fetchSellerInquiries, respondToInquiry, loading } = usePropertyInquiries();
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [responding, setResponding] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchSellerInquiries();
    console.log()
  }, []);

  const handleResponseChange = (inquiryId: string, value: string) => {
    setResponses(prev => ({ ...prev, [inquiryId]: value }));
  };

  const handleSendResponse = async (inquiryId: string) => {
    if (!responses[inquiryId]?.trim()) return;
    
    setResponding(prev => ({ ...prev, [inquiryId]: true }));
    
    try {
      await respondToInquiry(inquiryId, responses[inquiryId]);
      // Clear response field after successful submission
      setResponses(prev => ({ ...prev, [inquiryId]: '' }));
    } finally {
      setResponding(prev => ({ ...prev, [inquiryId]: false }));
    }
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading inquiries...</div>;
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
      <h2 className="text-2xl font-bold">Property Inquiries from Buyers</h2>
      <div className="grid gap-4">
        {sellerInquiries.map((inquiry) => (
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
                <div className="bg-muted/30 p-3 rounded-md">
                  <p className="text-sm font-medium">Buyer Information:</p>
                  <div className="grid grid-cols-2 gap-2 mt-1 text-sm">
                    <p>Name: <span className="font-medium">{inquiry.user.name}</span></p>
                    <p>Email: <span className="font-medium">{inquiry.user.email}</span></p>
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
                      className="mb-2"
                    />
                    <Button 
                      size="sm"
                      onClick={() => handleSendResponse(inquiry.id)}
                      disabled={!responses[inquiry.id]?.trim() || responding[inquiry.id]}
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
            <CardFooter>
              <Button variant="outline" size="sm" className="ml-auto">
                View Property
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default SellerInquiriesView;

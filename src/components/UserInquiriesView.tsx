
import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import usePropertyInquiries from "@/hooks/usePropertyInquiries";
import { formatDistanceToNow } from 'date-fns';

const UserInquiriesView = () => {
  const { userInquiries, fetchUserInquiries, loading } = usePropertyInquiries();

  useEffect(() => {
    fetchUserInquiries();
  }, []);

  if (loading) {
    return <div className="flex justify-center p-8">Loading inquiries...</div>;
  }

  if (userInquiries.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>My Property Inquiries</CardTitle>
          <CardDescription>
            You haven't sent any inquiries about properties yet.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">My Property Inquiries</h2>
      <div className="grid gap-4">
        {userInquiries.map((inquiry) => (
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
              <div className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your message:</p>
                  <p className="text-sm border-l-2 border-muted pl-3 py-1">{inquiry.message}</p>
                </div>
                
                {inquiry.sellerResponse && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Seller response:</p>
                    <p className="text-sm border-l-2 border-green-500 bg-green-50 pl-3 py-2 rounded">
                      {inquiry.sellerResponse}
                    </p>
                  </div>
                )}
                
                <p className="text-xs text-muted-foreground text-right mt-2">
                  Sent {formatDistanceToNow(new Date(inquiry.createdAt))} ago
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

export default UserInquiriesView;

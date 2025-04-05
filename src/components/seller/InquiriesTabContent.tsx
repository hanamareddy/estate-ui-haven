
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const InquiriesTabContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Inquiries</CardTitle>
        <CardDescription>
          Manage and respond to inquiries about your listings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center py-8 text-muted-foreground">
          No inquiries to show at the moment
        </p>
      </CardContent>
    </Card>
  );
};

export default InquiriesTabContent;

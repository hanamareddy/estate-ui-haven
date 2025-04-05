
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';

const AnalyticsTabContent = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Analytics</CardTitle>
        <CardDescription>
          View performance metrics for your properties
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-center py-8 text-muted-foreground">
          Analytics feature coming soon
        </p>
      </CardContent>
    </Card>
  );
};

export default AnalyticsTabContent;

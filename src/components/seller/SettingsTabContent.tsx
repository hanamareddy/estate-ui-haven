
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface SettingsTabContentProps {
  currentUser: {
    companyName?: string;
    reraId?: string;
    email?: string;
    phone?: string;
  };
}

const SettingsTabContent = ({ currentUser }: SettingsTabContentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>
          Manage your seller account and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid gap-2">
            <p className="text-sm font-medium">Company Name</p>
            <Input value={currentUser.companyName || ''} readOnly />
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium">RERA ID</p>
            <Input value={currentUser.reraId || ''} readOnly />
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium">Email</p>
            <Input value={currentUser.email || ''} readOnly />
          </div>
          <div className="grid gap-2">
            <p className="text-sm font-medium">Phone</p>
            <Input value={currentUser.phone || ''} readOnly />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Link to="/profile" className="w-full">
          <Button className="w-full">Edit Profile</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default SettingsTabContent;

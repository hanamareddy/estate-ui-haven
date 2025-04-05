
import React, { useState, useEffect } from 'react';
import MortgageCalculator from '../MortgageCalculator';
import { Link } from 'react-router-dom';
import { Button } from '../ui/button';
import { 
  IndianRupee, 
  MapPin, 
  Upload, 
  Building, 
  BarChart2, 
  Calendar, 
  FileText, 
  BellRing 
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from '../ui/card';
import mongoAuthService from "@/services/mongoAuthService";
import { useUserAPI } from "@/hooks/useUserAPI";

const PropertyToolbar = () => {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [showSellerTools, setShowSellerTools] = useState(false);

  const { useGetProfile } = useUserAPI();
  const { data: profileData, error: profileError, isLoading: profileLoading } = useGetProfile();

  useEffect(() => {
    const currentUser = mongoAuthService.getCurrentUser();

    if (currentUser) {
      setUser(currentUser);
    }

    if (profileData) {
      setUserProfile(profileData);
      setShowSellerTools(profileData?.isseller || false);
    }
  }, [profileData]);

  if (!user) {
    return null; // Or show login prompt
  }

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      <MortgageCalculator />
      
      <Link to="/market-trends">
        <Button variant="outline" className="gap-2">
          <IndianRupee className="h-4 w-4" />
          Market Trends
        </Button>
      </Link>
      
      <Link to="/property/nearby">
        <Button variant="outline" className="gap-2">
          <MapPin className="h-4 w-4" />
          Nearby Properties
        </Button>
      </Link>

      {showSellerTools ? (
        <>
          <Link to="/seller/property/add">
            <Button variant="outline" className="gap-2 bg-accent text-white hover:bg-accent/90">
              <Upload className="h-4 w-4" />
              List Property
            </Button>
          </Link>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Building className="h-4 w-4" />
                Seller Tools
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Seller Management Tools</DialogTitle>
                <DialogDescription>
                  Manage your properties and track your sales performance
                </DialogDescription>
              </DialogHeader>
              
              <Tabs defaultValue="tools" className="mt-4">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="tools">Quick Tools</TabsTrigger>
                  <TabsTrigger value="reports">Reports</TabsTrigger>
                </TabsList>
                
                <TabsContent value="tools" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <Link to="/seller/schedule" className="flex flex-col items-center text-center gap-2">
                          <Calendar className="h-8 w-8 text-accent" />
                          <span className="font-medium">Property Viewings</span>
                          <span className="text-xs text-muted-foreground">Manage your property viewing schedule</span>
                        </Link>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <Link to="/seller/notifications" className="flex flex-col items-center text-center gap-2">
                          <BellRing className="h-8 w-8 text-accent" />
                          <span className="font-medium">Notifications</span>
                          <span className="text-xs text-muted-foreground">Property inquiries and leads</span>
                        </Link>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <Link to="/seller/leads" className="flex flex-col items-center text-center gap-2">
                          <Building className="h-8 w-8 text-accent" />
                          <span className="font-medium">Lead Management</span>
                          <span className="text-xs text-muted-foreground">Track and convert interested buyers</span>
                        </Link>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <Link to="/seller/documents" className="flex flex-col items-center text-center gap-2">
                          <FileText className="h-8 w-8 text-accent" />
                          <span className="font-medium">Documents</span>
                          <span className="text-xs text-muted-foreground">Manage property documents</span>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="reports" className="space-y-4 mt-4">
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-6">
                        <Link to="/seller/analytics" className="flex flex-col items-center text-center gap-2">
                          <BarChart2 className="h-8 w-8 text-accent" />
                          <span className="font-medium">Performance Analytics</span>
                          <span className="text-xs text-muted-foreground">Track your property views and interest</span>
                        </Link>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardContent className="pt-6">
                        <Link to="/seller/roi" className="flex flex-col items-center text-center gap-2">
                          <IndianRupee className="h-8 w-8 text-accent" />
                          <span className="font-medium">ROI Calculator</span>
                          <span className="text-xs text-muted-foreground">Calculate your investment returns</span>
                        </Link>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </DialogContent>
          </Dialog>
        </>
      ) : user ? (
        <Link to="/buyer/dashboard">
          <Button variant="outline" className="gap-2">
            <Building className="h-4 w-4" />
            Buyer Dashboard
          </Button>
        </Link>
      ) : (
        <Link to="/auth">
          <Button variant="outline" className="gap-2 bg-accent text-white hover:bg-accent/90">
            <Upload className="h-4 w-4" />
            Become a Seller
          </Button>
        </Link>
      )}
    </div>
  );
};

export default PropertyToolbar;

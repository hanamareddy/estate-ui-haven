
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";
import { Loader2, User } from "lucide-react";
import { useUserAPI } from "@/hooks/useUserAPI";
import mongoAuthService from "@/services/mongoAuthService";

const UserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    isseller: false,
    companyName: "",
    reraId: ""
  });

  const { useGetProfile, useUpdateProfile } = useUserAPI();
  const { data: profileData, isLoading: profileLoading, error: profileError, refetch: refreshProfile } = useGetProfile();
  const updateProfileMutation = useUpdateProfile();

  useEffect(() => {
    // Check if the user is authenticated
    const currentUser = mongoAuthService.getCurrentUser();
    if (!currentUser) {
      navigate("/auth");
      return;
    }
    
    setUser(currentUser);
    
    // If profile data is loaded, update the state
    if (profileData) {
      setProfile({
        name: profileData.name || currentUser.name || "",
        email: profileData.email || currentUser.email || "",
        phone: profileData.phone || "",
        isseller: profileData.isseller || currentUser.isseller || false,
        companyName: profileData.companyName || "",
        reraId: profileData.reraId || ""
      });
      setLoading(false);
    }
  }, [navigate, profileData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Use the update profile mutation
      await updateProfileMutation.mutateAsync({
        name: profile.name,
        phone: profile.phone,
        companyName: profile.isseller ? profile.companyName : null,
        reraId: profile.isseller ? profile.reraId : null
      });
      
      // Success is handled by the mutation
    } catch (error) {
      console.error("Error updating profile:", error);
      // Error is handled by the mutation
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4" />
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  
  if (profileError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <p className="text-red-500 mb-4">Failed to load profile data</p>
          <Button onClick={() => refreshProfile()}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Your Profile</h1>
        <p className="text-muted-foreground">Manage your account information</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-6">
        <TabsList>
          <TabsTrigger value="personal">Personal Information</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">
                      Full Name
                    </label>
                    <Input
                      id="name"
                      name="name"
                      value={profile.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">
                      Email (cannot be changed)
                    </label>
                    <Input
                      id="email"
                      name="email"
                      value={profile.email || user?.email}
                      disabled
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="phone" className="block text-sm font-medium">
                      Phone Number
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      value={profile.phone}
                      onChange={handleInputChange}
                      placeholder="+91 XXXXX XXXXX"
                    />
                  </div>
                </div>

                {profile.isseller && (
                  <>
                    <Separator className="my-4" />
                    <h3 className="text-lg font-medium mb-4">Seller Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="companyName" className="block text-sm font-medium">
                          Company Name
                        </label>
                        <Input
                          id="companyName"
                          name="companyName"
                          value={profile.companyName}
                          onChange={handleInputChange}
                          placeholder="Your Real Estate Company"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="reraId" className="block text-sm font-medium">
                          RERA ID
                        </label>
                        <Input
                          id="reraId"
                          name="reraId"
                          value={profile.reraId}
                          onChange={handleInputChange}
                          placeholder="RERA ID Number"
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button type="submit" disabled={updateProfileMutation.isPending}>
                  {updateProfileMutation.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Security</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-lg font-medium mb-2">Change Password</h3>
                <p className="text-muted-foreground mb-4">
                  Update your password to keep your account secure
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    navigate("/forgot-password");
                    toast({
                      title: "Password reset",
                      description: "You will be redirected to reset your password",
                    });
                  }}
                >
                  Reset Password
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserProfile;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";
import { User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const UserProfile = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    isseller: false,
    companyname: "",
    reraid: ""
  });

  useEffect(() => {
    const checkAuth = async () => {
      const { data: session } = await supabase.auth.getSession();
      
      if (!session.session) {
        navigate("/auth");
        return;
      }

      setUser(session.session.user);

      // Fetch user profile
      const { data: profileData, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.session.user.id)
        .single();
      
      if (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load your profile",
          variant: "destructive",
        });
        return;
      }

      if (profileData) {
        setProfile({
          name: profileData.name || "",
          email: profileData.email || "",
          phone: profileData.phone || "",
          isseller: profileData.isseller || false,
          companyname: profileData.companyname || "",
          reraid: profileData.reraid || ""
        });
      }
      
      setLoading(false);
    };

    checkAuth();
  }, [navigate]);

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
      const { error } = await supabase
        .from("profiles")
        .update({
          name: profile.name,
          phone: profile.phone,
          companyname: profile.isseller ? profile.companyname : null,
          reraid: profile.isseller ? profile.reraid : null
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading profile...</p>
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
                      value={profile.email || user.email}
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
                        <label htmlFor="companyname" className="block text-sm font-medium">
                          Company Name
                        </label>
                        <Input
                          id="companyname"
                          name="companyname"
                          value={profile.companyname}
                          onChange={handleInputChange}
                          placeholder="Your Real Estate Company"
                        />
                      </div>

                      <div className="space-y-2">
                        <label htmlFor="reraid" className="block text-sm font-medium">
                          RERA ID
                        </label>
                        <Input
                          id="reraid"
                          name="reraid"
                          value={profile.reraid}
                          onChange={handleInputChange}
                          placeholder="RERA ID Number"
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Save Changes"}
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
                    supabase.auth.resetPasswordForEmail(user.email, {
                      redirectTo: `${window.location.origin}/reset-password`,
                    });
                    toast({
                      title: "Password reset email sent",
                      description: "Check your email for a link to reset your password",
                    });
                  }}
                >
                  Send Reset Password Email
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

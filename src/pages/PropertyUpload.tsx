
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { propertyAPI } from "@/services/api";
import mongoAuthService from "@/services/mongoAuthService";

const PropertyUpload = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [property, setProperty] = useState({
    title: "",
    description: "",
    price: "",
    category: "residential",
    type: "apartment",
    bedrooms: "",
    bathrooms: "",
    area: "",
    features: {
      parking: false,
      garden: false,
      balcony: false,
      swimming_pool: false,
      gym: false,
      security: false,
    },
    location: {
      address: "",
      city: "",
      state: "",
      pincode: "",
    },
    // Images would be handled via a file upload component
    images: [],
  });

  // Check if user is a seller
  useEffect(() => {
    const checkSellerStatus = async () => {
      const currentUser = mongoAuthService.getCurrentUser();
      
      if (!currentUser) {
        toast({
          title: "Authentication Required",
          description: "Please log in to list properties",
          variant: "destructive",
        });
        navigate("/auth");
      } else if (!currentUser.isseller) {
        toast({
          title: "Seller Account Required",
          description: "You need a seller account to list properties",
          variant: "destructive",
        });
        navigate("/");
      }
    };
    
    checkSellerStatus();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setProperty({
      ...property,
      location: { ...property.location, [name]: value },
    });
  };

  const handleFeatureChange = (feature, checked) => {
    setProperty({
      ...property,
      features: { ...property.features, [feature]: checked },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Format data for API
      const formattedData = {
        ...property,
        price: parseFloat(property.price),
        bedrooms: parseInt(property.bedrooms, 10) || 0,
        bathrooms: parseInt(property.bathrooms, 10) || 0,
        area: parseFloat(property.area) || 0,
      };
      
      const response = await propertyAPI.createProperty(formattedData);
      
      toast({
        title: "Property Listed",
        description: `"${property.title}" has been listed successfully.`,
      });
      
      // Redirect to the property page or seller dashboard
      navigate(`/properties/${response.data.id}`);
    } catch (error) {
      console.error("Property listing error:", error);
      toast({
        title: "Listing Failed",
        description: "There was an error listing your property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card className="border border-border shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl">List Your Property</CardTitle>
          <CardDescription>
            Fill out the details below to list your property on EstateHub
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Property Title</Label>
                  <Input
                    id="title"
                    name="title"
                    value={property.title}
                    onChange={handleInputChange}
                    placeholder="3BHK Apartment in South Mumbai"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Price (₹)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    value={property.price}
                    onChange={handleInputChange}
                    placeholder="5000000"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={property.description}
                  onChange={handleInputChange}
                  placeholder="Describe your property in detail..."
                  className="min-h-[120px]"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select
                    name="category"
                    value={property.category}
                    onValueChange={(value) => setProperty({...property, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="residential">Residential</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="agricultural">Agricultural</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Property Type</Label>
                  <Select
                    name="type"
                    value={property.type}
                    onValueChange={(value) => setProperty({...property, type: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="office">Office Space</SelectItem>
                      <SelectItem value="shop">Shop/Retail</SelectItem>
                      <SelectItem value="land">Land/Plot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="area">Area (sq ft)</Label>
                  <Input
                    id="area"
                    name="area"
                    type="number"
                    value={property.area}
                    onChange={handleInputChange}
                    placeholder="1200"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bedrooms">Bedrooms</Label>
                  <Input
                    id="bedrooms"
                    name="bedrooms"
                    type="number"
                    value={property.bedrooms}
                    onChange={handleInputChange}
                    placeholder="3"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="bathrooms">Bathrooms</Label>
                  <Input
                    id="bathrooms"
                    name="bathrooms"
                    type="number"
                    value={property.bathrooms}
                    onChange={handleInputChange}
                    placeholder="2"
                  />
                </div>
              </div>
            </div>
            
            {/* Location */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Location</h3>
              
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  name="address"
                  value={property.location.address}
                  onChange={handleLocationChange}
                  placeholder="Enter property address"
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={property.location.city}
                    onChange={handleLocationChange}
                    placeholder="Mumbai"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Input
                    id="state"
                    name="state"
                    value={property.location.state}
                    onChange={handleLocationChange}
                    placeholder="Maharashtra"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="pincode">PIN Code</Label>
                  <Input
                    id="pincode"
                    name="pincode"
                    value={property.location.pincode}
                    onChange={handleLocationChange}
                    placeholder="400001"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Features</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="parking"
                    checked={property.features.parking}
                    onCheckedChange={(checked) => handleFeatureChange("parking", checked)}
                  />
                  <Label htmlFor="parking">Parking</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="garden"
                    checked={property.features.garden}
                    onCheckedChange={(checked) => handleFeatureChange("garden", checked)}
                  />
                  <Label htmlFor="garden">Garden</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="balcony"
                    checked={property.features.balcony}
                    onCheckedChange={(checked) => handleFeatureChange("balcony", checked)}
                  />
                  <Label htmlFor="balcony">Balcony</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="swimming_pool"
                    checked={property.features.swimming_pool}
                    onCheckedChange={(checked) => handleFeatureChange("swimming_pool", checked)}
                  />
                  <Label htmlFor="swimming_pool">Swimming Pool</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="gym"
                    checked={property.features.gym}
                    onCheckedChange={(checked) => handleFeatureChange("gym", checked)}
                  />
                  <Label htmlFor="gym">Gym</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="security"
                    checked={property.features.security}
                    onCheckedChange={(checked) => handleFeatureChange("security", checked)}
                  />
                  <Label htmlFor="security">24/7 Security</Label>
                </div>
              </div>
            </div>
            
            {/* Images - would be handled via a file upload component */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Images</h3>
              <p className="text-sm text-muted-foreground">
                Image upload functionality coming soon. For now, your property will be listed with placeholder images.
              </p>
            </div>
            
            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Listing Property..." : "List Property"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyUpload;

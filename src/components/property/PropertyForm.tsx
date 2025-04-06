import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Upload, Plus, X, Home, MapPin, DollarSign, Bed, Bath, SquareCode, Info, Zap, Hammer, Landmark, Check, ParkingCircle, Droplets, Trees, PanelTop, Wifi, Wind, Flame, Shield, Warehouse, ArrowUpDown, ImagePlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import cloudinaryService from "@/services/cloudinaryService";

const propertyFormSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  address: z.string().min(5, "Address is required"),
  price: z.coerce.number().positive("Price must be greater than 0"),
  bedrooms: z.coerce.number().int().min(0, "Number of bedrooms must be 0 or greater"),
  bathrooms: z.coerce.number().min(0, "Number of bathrooms must be 0 or greater"),
  sqft: z.coerce.number().positive("Area must be greater than 0"),
  type: z.enum(["House", "Apartment", "Land", "Villa", "Builder Floor", "Farmhouse", "PG"]),
  status: z.enum(["active", "inactive"]),
  propertyStatus: z.enum(["Ready to Move", "Under Construction", "Resale"]),
  description: z.string().optional(),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  pincode: z.string().min(6, "Pincode must be at least 6 characters"),
  furnished: z.enum(["Fully Furnished", "Semi Furnished", "Unfurnished"]).optional(),
  constructionYear: z.string().optional(),
  sellerContact: z.string().min(10, "Contact number is required"),
  sellerEmail: z.string().email("Invalid email address").optional(),
});

type PropertyFormValues = z.infer<typeof propertyFormSchema>;

interface PropertyImage {
  url: string;
  public_id: string;
}

interface PropertyFormProps {
  property?: {
    id?: string;
    title: string;
    address: string;
    price: number;
    bedrooms?: number;
    bathrooms?: number;
    sqft: number;
    images?: PropertyImage[] | string[];
    type: string;
    status: string;
    propertyStatus?: string;
    description?: string;
    state?: string;
    city?: string;
    pincode?: string;
    furnished?: string;
    constructionYear?: string;
    sellerContact?: string;
    sellerEmail?: string;
    amenities?: string[];
  };
  onSubmit: (data: PropertyFormValues & { images: PropertyImage[]; amenities: string[] }) => void;
  isLoading?: boolean;
}

const PropertyForm = ({ property, onSubmit, isLoading = false }: PropertyFormProps) => {
  const normalizeImages = (images?: PropertyImage[] | string[]): PropertyImage[] => {
    if (!images) return [];

    return images.map(img => {
      if (typeof img === 'string') {
        return {
          url: img,
          public_id: `legacy_${Math.random().toString(36).substring(2, 15)}`
        };
      }
      return img as PropertyImage;
    });
  };

  const [images, setImages] = useState<PropertyImage[]>(normalizeImages(property?.images));
  const [uploadingImage, setUploadingImage] = useState(false);
  const [amenities, setAmenities] = useState<string[]>(property?.amenities || []);
  const [removedImages, setRemovedImages] = useState<string[]>([]);

  const form = useForm<PropertyFormValues>({
    resolver: zodResolver(propertyFormSchema),
    defaultValues: property ? {
      title: property.title || "",
      address: property.address || "",
      price: property.price || undefined,
      bedrooms: property.bedrooms || undefined,
      bathrooms: property.bathrooms || undefined,
      sqft: property.sqft || undefined,
      type: property.type as "House" | "Apartment" | "Land" | "Villa" | "Builder Floor" | "Farmhouse" | "PG",
      status: property.status as "active" | "inactive",
      propertyStatus: (property.propertyStatus as "Ready to Move" | "Under Construction" | "Resale") || "Ready to Move",
      description: property.description || `${property.bedrooms}-BHK, ${property.type || "apartment"} with ${property.sqft} sq ft area located in ${property.city || "great neighborhood"}, offering comfortable living and quality amenities.`,
      state: property.state || "",
      city: property.city || "",
      pincode: property.pincode || "",
      furnished: (property.furnished as "Fully Furnished" | "Semi Furnished" | "Unfurnished") || "Unfurnished",
      constructionYear: property.constructionYear || "",
      sellerContact: property.sellerContact || "",
      sellerEmail: property.sellerEmail || "",
    } : {
      title: "",
      address: "",
      price: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      sqft: 1,
      type: "House",
      status: "active",
      propertyStatus: "Ready to Move",
      description: "Apartment with good rating and living conditions waiting for your stays",
      state: "",
      city: "",
      pincode: "",
      furnished: "Unfurnished",
      constructionYear: "",
      sellerContact: "",
      sellerEmail: "",
    }
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImage(true);

    try {
      const fileArray = Array.from(files);

      const uploadedImages = await cloudinaryService.uploadImages(fileArray);

      setImages(prev => [...prev, ...uploadedImages]);
      toast({
        title: "Images uploaded",
        description: `${uploadedImages.length} image(s) successfully uploaded`,
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your images",
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];

    if (imageToRemove.public_id && !imageToRemove.public_id.startsWith('legacy_')) {
      setRemovedImages(prev => [...prev, imageToRemove.public_id]);
    }

    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const commonAmenities = [
    { name: 'Lift', icon: <ArrowUpDown className="w-3.5 h-3.5 mr-1" /> },
    { name: 'Car Parking', icon: <ParkingCircle className="w-3.5 h-3.5 mr-1" /> },
    { name: 'Swimming Pool', icon: <Droplets className="w-3.5 h-3.5 mr-1" /> },
    { name: 'Garden', icon: <Trees className="w-3.5 h-3.5 mr-1" /> },
    { name: 'Balcony', icon: <PanelTop className="w-3.5 h-3.5 mr-1" /> },
    { name: 'Power Backup', icon: <Zap className="w-3.5 h-3.5 mr-1" /> },
    { name: 'Air Conditioning', icon: <Wind className="w-3.5 h-3.5 mr-1" /> },
    { name: 'Gym', icon: <ArrowUpDown className="w-3.5 h-3.5 mr-1" /> },
    { name: 'Wifi', icon: <Wifi className="w-3.5 h-3.5 mr-1" /> },
    { name: 'Two Wheeler Parking', icon: <ParkingCircle className="w-3.5 h-3.5 mr-1" /> },
    { name: 'Security', icon: <Shield className="w-3.5 h-3.5 mr-1" /> },
    { name: 'Fireplace', icon: <Flame className="w-3.5 h-3.5 mr-1" /> },
    { name: 'Storage', icon: <Warehouse className="w-3.5 h-3.5 mr-1" /> },
    { name: '24x7 Water Supply', icon: <Droplets className="w-3.5 h-3.5 mr-1" /> }
  ];


  const toggleAmenity = (amenity: string) => {
    setAmenities(prev =>
      prev.includes(amenity)
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  const handleSubmit = async (values: PropertyFormValues) => {
    if (images.length === 0) {
      toast({
        title: "Error",
        description: "Please add at least one image",
        variant: "destructive",
      });
      return;
    }

    onSubmit({
      ...values,
      images,
      amenities,
      ...(property?.id && removedImages.length > 0 ? { removedImages } : {})
    });
  };

  const getCitiesByState = (state: string) => {
    const cityMap: Record<string, string[]> = {
      'delhi': ['New Delhi', 'Delhi NCR'],
      'maharashtra': ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Navi Mumbai'],
      'karnataka': ['Bangalore', 'Mysore', 'Mangalore', 'Hubli'],
      'tamil-nadu': ['Chennai', 'Coimbatore', 'Madurai', 'Salem'],
      'telangana': ['Hyderabad', 'Secunderabad', 'Warangal'],
      'kerala': ['Kochi', 'Trivandrum', 'Kozhikode', 'Thrissur'],
      'gujarat': ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot'],
      'uttar-pradesh': ['Noida', 'Ghaziabad', 'Lucknow', 'Kanpur', 'Agra'],
      'punjab': ['Chandigarh', 'Ludhiana', 'Amritsar', 'Jalandhar'],
      'west-bengal': ['Kolkata', 'Howrah', 'Durgapur', 'Siliguri'],
      'rajasthan': ['Jaipur', 'Jodhpur', 'Udaipur', 'Kota'],
    };

    return cityMap[state] || ['Other'];
  };

  const selectedState = form.watch('state');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Info className="h-5 w-5 text-muted-foreground" />
              Basic Information
            </h3>

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Title</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-10" placeholder="e.g. Modern 3BHK Apartment in Powai" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="delhi">Delhi</SelectItem>
                        <SelectItem value="maharashtra">Maharashtra</SelectItem>
                        <SelectItem value="karnataka">Karnataka</SelectItem>
                        <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
                        <SelectItem value="telangana">Telangana</SelectItem>
                        <SelectItem value="kerala">Kerala</SelectItem>
                        <SelectItem value="gujarat">Gujarat</SelectItem>
                        <SelectItem value="uttar-pradesh">Uttar Pradesh</SelectItem>
                        <SelectItem value="punjab">Punjab</SelectItem>
                        <SelectItem value="west-bengal">West Bengal</SelectItem>
                        <SelectItem value="rajasthan">Rajasthan</SelectItem>
                        <SelectItem value="other">Other States</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {selectedState && getCitiesByState(selectedState).map(city => (
                          <SelectItem key={city} value={city.toLowerCase()}>
                            {city}
                          </SelectItem>
                        ))}
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN Code</FormLabel>
                    <FormControl>
                      <Input type="text" placeholder="e.g. 400001" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Address</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input className="pl-10" placeholder="e.g. 123, ABC Society, XYZ Road" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Price (₹)</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" type="number" placeholder="e.g. 100000"{...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="House">House</SelectItem>
                        <SelectItem value="Apartment">Apartment</SelectItem>
                        <SelectItem value="Villa">Villa</SelectItem>
                        <SelectItem value="Builder Floor">Builder Floor</SelectItem>
                        <SelectItem value="Farmhouse">Farmhouse</SelectItem>
                        <SelectItem value="PG">PG/Hostel</SelectItem>
                        <SelectItem value="Land">Land</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Listing Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="inactive">Inactive</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="propertyStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Property Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select property status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ready to Move">Ready to Move</SelectItem>
                      <SelectItem value="Under Construction">Under Construction</SelectItem>
                      <SelectItem value="Resale">Resale</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="space-y-4 md:col-span-2">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Home className="h-5 w-5 text-muted-foreground" />
              Property Details
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="bedrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bedrooms</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Bed className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-10"
                          type="number"
                          min="0"
                          placeholder="Number of bedrooms"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="bathrooms"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bathrooms</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Bath className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input
                          className="pl-10"
                          type="number"
                          min="0"
                          step="0.5"
                          placeholder="Number of bathrooms"
                          {...field}
                          value={field.value ?? ''}
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sqft"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel></FormLabel>
                    <FormControl>
                      <div className="relative">
                        <SquareCode className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" type="number" placeholder="e.g. 1200" min="0" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="furnished"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Furnishing Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select furnishing status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Fully Furnished">Fully Furnished</SelectItem>
                        <SelectItem value="Semi Furnished">Semi Furnished</SelectItem>
                        <SelectItem value="Unfurnished">Unfurnished</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="constructionYear"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Year of Construction</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Landmark className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        <Input className="pl-10" type="text" placeholder="e.g. 2020" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter property description..."
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div>
            <FormLabel>Amenities</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
              {commonAmenities.map((amenity) => (
                <button
                  key={amenity.name}
                  type="button"
                  onClick={() => toggleAmenity(amenity.name)}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm transition ${amenities.includes(amenity.name)
                      ? 'bg-accent/10 text-accent border border-accent/20'
                      : 'border border-border text-foreground hover:bg-secondary'
                    }`}
                >
                  {amenities.includes(amenity.name) ? (
                    <Check className="w-3.5 h-3.5 mr-1.5" />
                  ) : (
                    amenity.icon
                  )}
                  {amenity.name}
                </button>
              ))}
            </div>

          </div>


          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Hammer className="h-5 w-5 text-muted-foreground" />
              Seller Information
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sellerContact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Number</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="e.g. 9876543210" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sellerEmail"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email (Optional)</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="e.g. seller@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Upload className="h-5 w-5 text-muted-foreground" />
              Property Images
            </h3>

            <div className="border-2 border-dashed border-input rounded-lg p-4">
              <div className="flex flex-col items-center justify-center gap-2 py-4">
                <Upload className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground text-sm text-center">
                  Drag &amp; drop your images here, or click to browse
                </p>
                <Button
                  variant="outline"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  type="button"
                  disabled={uploadingImage}
                >
                  {uploadingImage ? "Uploading..." : "Select Images"}
                </Button>
                <input
                  id="image-upload"
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                  disabled={uploadingImage}
                />
              </div>
            </div>

            {images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {images.map((img, index) => (
                  <div key={index} className="relative group rounded-md overflow-hidden aspect-square">
                    <img src={img.url} alt={`Property ${index + 1}`} className="object-cover w-full h-full" />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-1 right-1 bg-background/80 text-destructive p-1 rounded-full group-hover:opacity-100 transition-opacity"
                    >
                      <X className="h-10 w-10" />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => document.getElementById('image-upload')?.click()}
                  className="flex flex-col items-center justify-center border-2 border-dashed border-input rounded-md aspect-square hover:bg-secondary/50 transition-colors"
                >
                  <Plus className="h-6 w-6 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground mt-1">Add More</span>
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={() => window.history.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Saving..." : property?.id ? "Update Property" : "Add Property"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PropertyForm;

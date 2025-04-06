
import React, { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, X, ParkingCircle, Droplets, Trees, PanelTop, Wifi, Wind, Flame, Shield, Warehouse, Zap, ArrowUpDown } from 'lucide-react';
import { toast } from "@/hooks/use-toast"

const formSchema = z.object({
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().optional(),
  address: z.string().min(2, {
    message: "Address must be at least 2 characters.",
  }),
  location: z.string().min(2, {
    message: "Location must be at least 2 characters.",
  }),
  city: z.string().min(2, {
    message: "City must be at least 2 characters.",
  }),
  state: z.string().min(2, {
    message: "State must be at least 2 characters.",
  }),
  zipcode: z.string().min(5, {
    message: "Zipcode must be at least 5 characters.",
  }),
  type: z.string().min(2, {
    message: "Type must be at least 2 characters.",
  }),
  bedrooms: z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Bedrooms must be a number.",
  }),
  bathrooms:  z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Bathrooms must be a number.",
  }),
  size:  z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Size must be a number.",
  }),
  price:  z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Price must be a number.",
  }),
  yearbuilt:  z.string().refine((val) => !isNaN(parseInt(val)), {
    message: "Year Built must be a number.",
  }),
  amenities: z.string().optional(),
  status: z.string().optional(),
});

interface PropertyFormProps {
  initialData?: any;
  onSubmit: (values: any) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
  submitButtonText?: string;
  cancelButtonText?: string;
}

const PropertyForm = ({ 
  initialData, 
  onSubmit, 
  isSubmitting = false,
  submitButtonText = "Submit",
  onCancel,
  cancelButtonText = "Cancel"
}: PropertyFormProps) => {
  const [images, setImages] = useState<{ id: string; url: string }[]>(initialData?.images || []);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(
    initialData?.amenities ? 
      (typeof initialData.amenities === 'string' ? 
        initialData.amenities.split(',').map(a => a.trim()) : 
        initialData.amenities) : 
      []
  );
  
  // Convert property fields to strings for form inputs
  const defaultBedrooms = initialData?.bedrooms ? String(initialData.bedrooms) : "";
  const defaultBathrooms = initialData?.bathrooms ? String(initialData.bathrooms) : "";
  const defaultSize = initialData?.size ? String(initialData.size) : "";
  const defaultPrice = initialData?.price ? String(initialData.price) : "";
  const defaultYearBuilt = initialData?.yearbuilt ? String(initialData.yearbuilt) : "";

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: initialData?.title || "",
      description: initialData?.description || "",
      address: initialData?.address || "",
      location: initialData?.location || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipcode: initialData?.zipcode || "",
      type: initialData?.type || "",
      bedrooms: defaultBedrooms,
      bathrooms: defaultBathrooms,
      size: defaultSize,
      price: defaultPrice,
      yearbuilt: defaultYearBuilt,
      amenities: selectedAmenities.join(", "),
      status: initialData?.status || "active",
    },
  });

  // Handle file uploads manually for now
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files).map((file, index) => {
        const id = `local-${Date.now()}-${index}`;
        const url = URL.createObjectURL(file);
        return { id, url, file };
      });
      
      setImages((prevImages) => [...prevImages, ...newImages]);
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setImages(images.filter((image) => image.id !== imageId));
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(a => a !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
    
    // Update the form field
    const newAmenities = selectedAmenities.includes(amenity)
      ? selectedAmenities.filter(a => a !== amenity)
      : [...selectedAmenities, amenity];
    
    form.setValue('amenities', newAmenities.join(", "));
  };

  // Common Indian amenities with icons
  const commonAmenities = [
    {name: 'Lift', icon: <ArrowUpDown className="w-3.5 h-3.5 mr-1" />},
    {name: 'Car Parking', icon: <ParkingCircle className="w-3.5 h-3.5 mr-1" />},
    {name: 'Swimming Pool', icon: <Droplets className="w-3.5 h-3.5 mr-1" />},
    {name: 'Garden', icon: <Trees className="w-3.5 h-3.5 mr-1" />},
    {name: 'Balcony', icon: <PanelTop className="w-3.5 h-3.5 mr-1" />},
    {name: 'Power Backup', icon: <Zap className="w-3.5 h-3.5 mr-1" />},
    {name: 'Air Conditioning', icon: <Wind className="w-3.5 h-3.5 mr-1" />},
    {name: 'Gym', icon: <ArrowUpDown className="w-3.5 h-3.5 mr-1" />},
    {name: 'Wifi', icon: <Wifi className="w-3.5 h-3.5 mr-1" />},
    {name: 'Two Wheeler Parking', icon: <ParkingCircle className="w-3.5 h-3.5 mr-1" />},
    {name: 'Security', icon: <Shield className="w-3.5 h-3.5 mr-1" />},
    {name: 'Fireplace', icon: <Flame className="w-3.5 h-3.5 mr-1" />},
    {name: 'Storage', icon: <Warehouse className="w-3.5 h-3.5 mr-1" />},
    {name: '24x7 Water Supply', icon: <Droplets className="w-3.5 h-3.5 mr-1" />}
  ];

  const onSubmitHandler = async (values: z.infer<typeof formSchema>) => {
    // Add the amenities and images to the form data
    const formData = {
      ...values,
      amenities: selectedAmenities,
      images: images
    };
    
    await onSubmit(formData);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Property Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl>
                  <Input placeholder="123 Main St" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Downtown" {...field} />
                </FormControl>
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
                <FormControl>
                  <Input placeholder="New York" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input placeholder="NY" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="zipcode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Zipcode</FormLabel>
                <FormControl>
                  <Input placeholder="10001" {...field} />
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
                <FormLabel>Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="house">House</SelectItem>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="condo">Condo</SelectItem>
                      <SelectItem value="townhouse">Townhouse</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="plot">Plot</SelectItem>
                      <SelectItem value="commercial">Commercial</SelectItem>
                      <SelectItem value="farmhouse">Farmhouse</SelectItem>
                      <SelectItem value="land">Land</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="inactive">Inactive</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sold">Sold</SelectItem>
                      <SelectItem value="rented">Rented</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="bedrooms"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bedrooms</FormLabel>
                <FormControl>
                  <Input placeholder="2" type="number" {...field} />
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
                  <Input placeholder="1" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="size"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Size (sq ft)</FormLabel>
                <FormControl>
                  <Input placeholder="1200" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Price</FormLabel>
                <FormControl>
                  <Input placeholder="250000" type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="yearbuilt"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Year Built</FormLabel>
                <FormControl>
                  <Input placeholder="1990" type="number" {...field} />
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
                  placeholder="Tell us about your property"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Amenities Selection */}
        <div>
          <FormLabel>Amenities</FormLabel>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
            {commonAmenities.map((amenity) => (
              <button 
                key={amenity.name}
                type="button"
                onClick={() => toggleAmenity(amenity.name)}
                className={`inline-flex items-center px-3 py-2 rounded-md text-sm ${
                  selectedAmenities.includes(amenity.name)
                    ? 'bg-accent/10 text-accent border border-accent/20'
                    : 'border border-border text-foreground hover:bg-secondary'
                }`}
              >
                {selectedAmenities.includes(amenity.name) ? (
                  <Check className="w-3.5 h-3.5 mr-1.5" />
                ) : amenity.icon}
                {amenity.name}
              </button>
            ))}
          </div>

          {/* Hidden field to store amenities for form submission */}
          <input 
            type="hidden" 
            {...form.register('amenities')} 
            value={selectedAmenities.join(", ")} 
          />
        </div>

        {/* Image Upload */}
        <div>
          <FormLabel>Images</FormLabel>
          <Card>
            <CardContent className="flex flex-col space-y-4 p-4 mt-2">
              <div className="flex flex-wrap gap-2">
                {images.map((image) => (
                  <div key={image.id} className="relative">
                    <img
                      src={image.url}
                      alt="Property"
                      className="h-32 w-32 rounded-md object-cover"
                    />
                    <Button
                      variant="destructive"
                      size="icon"
                      className="absolute -top-2 -right-2 rounded-full opacity-75 transition hover:opacity-100"
                      type="button"
                      onClick={() => handleRemoveImage(image.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <div className="flex flex-col items-center p-4 border-2 border-dashed rounded-md">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer flex flex-col items-center justify-center w-full"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg
                      className="w-8 h-8 mb-4 text-gray-500"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 16"
                    >
                      <path
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                      />
                    </svg>
                    <p className="mb-2 text-sm text-gray-500">
                      <span className="font-semibold">Click to upload</span> or drag and drop
                    </p>
                    <p className="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
                  </div>
                  <input
                    id="image-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button variant="outline" onClick={onCancel} disabled={isSubmitting}>
              {cancelButtonText}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PropertyForm;

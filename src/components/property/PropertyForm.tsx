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
import { X } from 'lucide-react';
import { toast } from "@/hooks/use-toast"
import { useUploadThing } from "@/lib/uploadthing";
import { UploadButton } from "@/lib/uploadthing";
import { FileRejection } from 'react-dropzone';

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
  initialData?: z.infer<typeof formSchema> & { images?: { id: string; url: string }[] };
  onSubmit: (values: z.infer<typeof formSchema> & { images: { id: string; url: string }[] }) => Promise<void>;
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
  const [uploadedImages, setUploadedImages] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  
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
      amenities: initialData?.amenities || "",
      status: initialData?.status || "active",
    },
  })

  const { startUpload } = useUploadThing({
    endpoint: "imageUploader",
    onClientUploadComplete: (res) => {
      // Do something with the response
      console.log("Files: ", res);
      if (res) {
        const newImages = res.map((image) => ({ id: image.key, url: image.url }));
        setImages((prevImages) => [...prevImages, ...newImages]);
        toast({
          title: "Upload Complete",
          description: "Your images have been uploaded.",
        })
      }
      setUploading(false);
    },
    onUploadError: (error: Error) => {
      // Do something with the error.
      setUploadError(error.message);
      setUploading(false);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your images.",
        variant: "destructive",
      })
    },
  });

  const onSubmitHandler = async (values: z.infer<typeof formSchema>) => {
    const imagesData = images.map(image => ({ id: image.id, url: image.url }));
    await onSubmit({ ...values, images: imagesData });
  }

  const onDrop = useCallback(async (acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (fileRejections.length) {
      toast({
        title: "Upload Failed",
        description: "Please upload valid image files.",
        variant: "destructive",
      })
      return;
    }

    setUploading(true);
    setUploadError(null);
    setUploadedImages(acceptedFiles);

    try {
      await startUpload(acceptedFiles);
    } catch (error) {
      setUploadError(error.message);
      toast({
        title: "Upload Failed",
        description: "There was an error uploading your images.",
        variant: "destructive",
      })
    } finally {
      setUploading(false);
    }
  }, [startUpload]);

  const handleRemoveImage = (imageId: string) => {
    setImages(images.filter((image) => image.id !== imageId));
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

        <FormField
          control={form.control}
          name="amenities"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Amenities</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="List any amenities"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div>
          <FormLabel>Images</FormLabel>
          <Card>
            <CardContent className="flex flex-col space-y-4">
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
              <UploadButton
                content={{ label: "Upload images" }}
                onDrop={onDrop}
                // className="border rounded-md p-4 bg-secondary text-secondary-foreground"
              />
              {uploading && <div>Uploading...</div>}
              {uploadError && <div className="text-red-500">{uploadError}</div>}
            </CardContent>
          </Card>
        </div>

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} disabled={isSubmitting}>
              {cancelButtonText}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PropertyForm;

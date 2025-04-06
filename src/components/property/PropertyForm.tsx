import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Loader2, Upload, X, Plus, Image as ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { validatePropertyForm } from '@/utils/validationUtils';
import axios from 'axios';

interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  address: string;
  type: string;
  status: string;
  bedrooms?: number;
  bathrooms?: number;
  sqft?: number;
  amenities?: string[];
  images?: string[];
  [key: string]: any;
}

interface PropertyFormProps {
  onSubmit: (data: PropertyFormData) => void;
  isLoading: boolean;
  property?: any;
}

const PropertyForm = ({ onSubmit, isLoading, property }: PropertyFormProps) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    address: '',
    type: 'house',
    status: 'active',
    bedrooms: 0,
    bathrooms: 0,
    sqft: 0,
    amenities: [],
    images: [],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [uploadingImages, setUploadingImages] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (property) {
      setFormData({
        title: property.title || '',
        description: property.description || '',
        price: property.price || 0,
        address: property.address || '',
        type: property.type || 'house',
        status: property.status || 'active',
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        sqft: property.sqft || 0,
        amenities: property.amenities || [],
        images: property.images?.map((img: any) => typeof img === 'string' ? img : img.url) || [],
      });
      
      if (property.images && property.images.length > 0) {
        const imageUrls = property.images.map((img: any) => 
          typeof img === 'string' ? img : img.url
        );
        setPreviewImages(imageUrls);
      }
    }
  }, [property]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let parsedValue = value;
    
    if (type === 'number') {
      parsedValue = value === '' ? 0 : parseFloat(value);
    }
    
    setFormData(prev => ({ ...prev, [name]: parsedValue }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData(prev => ({ ...prev, [name]: checked ? 'active' : 'inactive' }));
  };

  const handleAmenityToggle = (amenity: string) => {
    setFormData(prev => {
      const amenities = prev.amenities || [];
      
      if (amenities.includes(amenity)) {
        return { ...prev, amenities: amenities.filter(a => a !== amenity) };
      } else {
        return { ...prev, amenities: [...amenities, amenity] };
      }
    });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const validFiles: File[] = [];
    const invalidFiles: string[] = [];
    
    Array.from(e.target.files).forEach(file => {
      if (!file.type.startsWith('image/')) {
        invalidFiles.push(`${file.name} (not an image)`);
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} (exceeds 5MB)`);
        return;
      }
      
      validFiles.push(file);
    });
    
    if (invalidFiles.length > 0) {
      toast({
        title: "Invalid files",
        description: `${invalidFiles.join(', ')} cannot be uploaded.`,
        variant: "destructive"
      });
    }
    
    setImageFiles(prev => [...prev, ...validFiles]);
    
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const uploadImages = async () => {
    if (imageFiles.length === 0) return [];
    
    setUploadingImages(true);
    
    try {
      const formData = new FormData();
      imageFiles.forEach(file => {
        formData.append('images', file);
      });
      
      const response = await axios.post(`${API_URL}/upload/multiple`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setImageFiles([]);
        return response.data.images.map((img: { url: string }) => img.url);
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        title: "Upload Failed",
        description: "Failed to upload images. Please try again.",
        variant: "destructive"
      });
      return [];
    } finally {
      setUploadingImages(false);
    }
  };

  const removeImage = (index: number) => {
    setPreviewImages(prev => prev.filter((_, i) => i !== index));
    
    if (index < (formData.images?.length || 0)) {
      setFormData(prev => ({
        ...prev,
        images: (prev.images || []).filter((_, i) => i !== index)
      }));
    }
    
    if (index >= (formData.images?.length || 0)) {
      const adjustedIndex = index - (formData.images?.length || 0);
      setImageFiles(prev => prev.filter((_, i) => i !== adjustedIndex));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validation = validatePropertyForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      
      const firstErrorField = Object.keys(validation.errors)[0];
      const errorElement = document.querySelector(`[name="${firstErrorField}"]`);
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive"
      });
      
      return;
    }
    
    try {
      let allImages = [...(formData.images || [])];
      
      if (imageFiles.length > 0) {
        const uploadedImageUrls = await uploadImages();
        allImages = [...allImages, ...uploadedImageUrls];
      }
      
      const finalFormData = {
        ...formData,
        images: allImages
      };
      
      await onSubmit(finalFormData);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "There was an error submitting the form. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-10">
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Property Title <span className="text-red-500">*</span></Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Modern 3 Bedroom Apartment"
                className={errors.title ? "border-red-500" : ""}
              />
              {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your property in detail..."
                rows={5}
                className={errors.description ? "border-red-500" : ""}
              />
              {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Property Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price (USD) <span className="text-red-500">*</span></Label>
              <Input
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                placeholder="e.g. 250000"
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && <p className="text-red-500 text-sm">{errors.price}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="address">Property Address <span className="text-red-500">*</span></Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter full address"
                className={errors.address ? "border-red-500" : ""}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Property Type <span className="text-red-500">*</span></Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleSelectChange('type', value)}
              >
                <SelectTrigger id="type" className={errors.type ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="condo">Condo</SelectItem>
                  <SelectItem value="land">Land</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                </SelectContent>
              </Select>
              {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">
                <div className="flex items-center space-x-2">
                  <span>Active Listing</span>
                  <Switch
                    id="status"
                    checked={formData.status === 'active'}
                    onCheckedChange={(checked) => handleSwitchChange('status', checked)}
                  />
                </div>
              </Label>
              <p className="text-sm text-muted-foreground">
                {formData.status === 'active' 
                  ? 'Your property will be visible to all users' 
                  : 'Your property will be hidden from public view'}
              </p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                name="bedrooms"
                type="number"
                value={formData.bedrooms}
                onChange={handleChange}
                min="0"
                step="1"
                className={errors.bedrooms ? "border-red-500" : ""}
              />
              {errors.bedrooms && <p className="text-red-500 text-sm">{errors.bedrooms}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                name="bathrooms"
                type="number"
                value={formData.bathrooms}
                onChange={handleChange}
                min="0"
                step="0.5"
                className={errors.bathrooms ? "border-red-500" : ""}
              />
              {errors.bathrooms && <p className="text-red-500 text-sm">{errors.bathrooms}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="sqft">Square Footage</Label>
              <Input
                id="sqft"
                name="sqft"
                type="number"
                value={formData.sqft}
                onChange={handleChange}
                min="0"
                step="1"
                className={errors.sqft ? "border-red-500" : ""}
              />
              {errors.sqft && <p className="text-red-500 text-sm">{errors.sqft}</p>}
            </div>
          </div>
          
          <Separator className="my-6" />
          
          <div className="space-y-4">
            <Label>Amenities</Label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                'Air Conditioning', 'Heating', 'Parking', 'Swimming Pool', 'Gym',
                'Security System', 'Backyard', 'Fireplace', 'Furnished', 'Washer/Dryer'
              ].map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`amenity-${amenity}`}
                    checked={(formData.amenities || []).includes(amenity)}
                    onChange={() => handleAmenityToggle(amenity)}
                    className="rounded text-primary focus:ring-primary"
                  />
                  <label htmlFor={`amenity-${amenity}`} className="text-sm">
                    {amenity}
                  </label>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-semibold mb-4">Property Images</h3>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {previewImages.map((src, index) => (
                <div key={index} className="relative aspect-square rounded-md overflow-hidden border border-border">
                  <img src={src} alt={`Property ${index + 1}`} className="w-full h-full object-cover" />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-7 w-7"
                    type="button"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              
              <label className="cursor-pointer border-2 border-dashed border-border rounded-md flex flex-col items-center justify-center aspect-square hover:bg-secondary/50 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <Plus className="h-8 w-8 text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">Add Images</span>
                <span className="text-xs text-muted-foreground mt-1">(Max 5MB each)</span>
              </label>
            </div>
            
            {previewImages.length === 0 && (
              <div className="text-center p-6 bg-secondary/30 rounded-lg">
                <ImageIcon className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
                <h4 className="font-medium">No Images Yet</h4>
                <p className="text-sm text-muted-foreground mb-4">
                  Properties with images get more views
                </p>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" className="mt-2 mx-auto">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Images
                  </Button>
                </label>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-between">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate('/seller/dashboard')}
        >
          Cancel
        </Button>
        
        <Button 
          type="submit" 
          disabled={isLoading || uploadingImages}
        >
          {(isLoading || uploadingImages) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {property ? 'Update Property' : 'Add Property'}
        </Button>
      </div>
    </form>
  );
};

export default PropertyForm;

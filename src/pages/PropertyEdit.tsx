
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import PropertyForm from "@/components/property/PropertyForm";
import { toast } from "@/components/ui/use-toast";
import { propertyAPI } from "@/services/api";

const PropertyEdit = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [property, setProperty] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch property data if editing an existing property
  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    
    const fetchProperty = async () => {
      try {
        const data = await propertyAPI.getProperty(id);
        setProperty(data);
      } catch (err) {
        console.error("Error fetching property:", err);
        setError("Failed to load property data");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProperty();
  }, [id]);
  
  const isNewProperty = !id;
  
  // Handle form submission
  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    
    try {
      if (isNewProperty) {
        // Create new property
        await propertyAPI.createProperty(formData);
        toast({
          title: "Property Added",
          description: `Successfully added property: ${formData.title}`
        });
      } else {
        // Update existing property
        await propertyAPI.updateProperty(id!, formData);
        toast({
          title: "Property Updated",
          description: `Successfully updated property: ${formData.title}`
        });
      }
      
      // Navigate back to the dashboard
      navigate("/seller/dashboard");
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: `Failed to ${isNewProperty ? 'add' : 'update'} property. Please try again.`,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="container max-w-5xl py-8">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <div className="spinner h-8 w-8 mb-4 mx-auto border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            <p className="text-muted-foreground">Loading property data...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-5xl py-8">
      <div className="mb-8">
        <Button
          variant="ghost"
          className="gap-2 mb-4"
          onClick={() => navigate("/seller/dashboard")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        
        <h1 className="text-3xl font-bold">
          {isNewProperty ? "Add New Property" : "Edit Property"}
        </h1>
        <p className="text-muted-foreground mt-1">
          {isNewProperty 
            ? "Fill in the details below to list a new property in the Indian market" 
            : "Update the property information for the Indian real estate market"
          }
        </p>
      </div>
      
      {error ? (
        <div className="bg-destructive/10 p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <Button onClick={() => navigate("/seller/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      ) : (property || isNewProperty) ? (
        <PropertyForm 
          property={property}
          onSubmit={handleSubmit}
          isLoading={isSubmitting}
        />
      ) : (
        <div className="bg-secondary/30 p-8 rounded-lg text-center">
          <h2 className="text-xl font-semibold mb-2">Property Not Found</h2>
          <p className="text-muted-foreground mb-4">
            The property you're looking for could not be found.
          </p>
          <Button onClick={() => navigate("/seller/dashboard")}>
            Return to Dashboard
          </Button>
        </div>
      )}
    </div>
  );
};

export default PropertyEdit;


import React, { useState } from 'react';
import { Check, ParkingCircle, Droplets, Trees, PanelTop, Wifi, Wind, Flame, Shield, Warehouse, Zap, Thermometer, Plus } from 'lucide-react';
import { ArrowUpDown, Dumbbell } from '../icons';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

interface AmenitiesFilterProps {
  selectedAmenities: string[];
  toggleAmenity: (amenity: string) => void;
}

const AmenitiesFilter = ({ selectedAmenities, toggleAmenity }: AmenitiesFilterProps) => {
  const [customAmenity, setCustomAmenity] = useState('');
  const [showCustomField, setShowCustomField] = useState(false);

  const addCustomAmenity = () => {
    if (customAmenity.trim() !== '') {
      toggleAmenity(customAmenity.trim());
      setCustomAmenity('');
      setShowCustomField(false);
    }
  };

  // Common Indian amenities
  const commonAmenities = [
    {name: 'Lift', icon: <ArrowUpDown className="w-3.5 h-3.5 mr-1" />},
    {name: 'Car Parking', icon: <ParkingCircle className="w-3.5 h-3.5 mr-1" />},
    {name: 'Swimming Pool', icon: <Droplets className="w-3.5 h-3.5 mr-1" />},
    {name: 'Garden', icon: <Trees className="w-3.5 h-3.5 mr-1" />},
    {name: 'Balcony', icon: <PanelTop className="w-3.5 h-3.5 mr-1" />},
    {name: 'Power Backup', icon: <Zap className="w-3.5 h-3.5 mr-1" />},
    {name: 'Air Conditioning', icon: <Wind className="w-3.5 h-3.5 mr-1" />},
    {name: 'Gym', icon: <Dumbbell className="w-3.5 h-3.5 mr-1" />},
    {name: 'Wifi', icon: <Wifi className="w-3.5 h-3.5 mr-1" />},
    {name: 'Two Wheeler Parking', icon: <ParkingCircle className="w-3.5 h-3.5 mr-1" />},
    {name: 'Security', icon: <Shield className="w-3.5 h-3.5 mr-1" />},
    {name: 'Fireplace', icon: <Flame className="w-3.5 h-3.5 mr-1" />},
    {name: 'Storage', icon: <Warehouse className="w-3.5 h-3.5 mr-1" />},
    {name: '24x7 Water Supply', icon: <Droplets className="w-3.5 h-3.5 mr-1" />}
  ];

  return (
    <div className="mb-6">
      <label className="text-sm font-medium flex items-center mb-3">
        <span className="text-accent mr-1.5">✦</span>
        Amenities
      </label>
      <div className="grid grid-cols-2 gap-2">
        {commonAmenities.map((amenity) => (
          <button 
            key={amenity.name}
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

        {/* Custom amenity button */}
        <button
          onClick={() => setShowCustomField(!showCustomField)}
          className="inline-flex items-center px-3 py-2 rounded-md text-sm border border-dashed border-accent/50 text-accent hover:bg-accent/5"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Add Custom
        </button>
      </div>

      {/* Custom amenity input field */}
      {showCustomField && (
        <div className="mt-3 flex gap-2">
          <Input
            type="text"
            value={customAmenity}
            onChange={(e) => setCustomAmenity(e.target.value)}
            placeholder="Enter amenity name"
            className="flex-1"
          />
          <Button size="sm" onClick={addCustomAmenity}>Add</Button>
        </div>
      )}

      {/* Display custom amenities */}
      {selectedAmenities.filter(item => !commonAmenities.map(a => a.name).includes(item)).length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-muted-foreground mb-2">Custom Amenities:</p>
          <div className="flex flex-wrap gap-2">
            {selectedAmenities
              .filter(item => !commonAmenities.map(a => a.name).includes(item))
              .map(amenity => (
                <span 
                  key={amenity} 
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-secondary"
                >
                  {amenity}
                  <button 
                    onClick={() => toggleAmenity(amenity)} 
                    className="ml-1 text-muted-foreground hover:text-destructive"
                  >
                    ×
                  </button>
                </span>
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AmenitiesFilter;

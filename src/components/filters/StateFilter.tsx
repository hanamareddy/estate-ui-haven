
import React from 'react';
import { MapPin } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StateFilterProps {
  selectedState: string;
  onStateChange: (state: string) => void;
}

export const StateFilter = ({ selectedState, onStateChange }: StateFilterProps) => {
  // List of Indian states
  const indianStates = [
    { value: 'andhra-pradesh', label: 'Andhra Pradesh' },
    { value: 'arunachal-pradesh', label: 'Arunachal Pradesh' },
    { value: 'assam', label: 'Assam' },
    { value: 'bihar', label: 'Bihar' },
    { value: 'chhattisgarh', label: 'Chhattisgarh' },
    { value: 'delhi', label: 'Delhi' },
    { value: 'goa', label: 'Goa' },
    { value: 'gujarat', label: 'Gujarat' },
    { value: 'haryana', label: 'Haryana' },
    { value: 'himachal-pradesh', label: 'Himachal Pradesh' },
    { value: 'jammu-kashmir', label: 'Jammu & Kashmir' },
    { value: 'jharkhand', label: 'Jharkhand' },
    { value: 'karnataka', label: 'Karnataka' },
    { value: 'kerala', label: 'Kerala' },
    { value: 'madhya-pradesh', label: 'Madhya Pradesh' },
    { value: 'maharashtra', label: 'Maharashtra' },
    { value: 'manipur', label: 'Manipur' },
    { value: 'meghalaya', label: 'Meghalaya' },
    { value: 'mizoram', label: 'Mizoram' },
    { value: 'nagaland', label: 'Nagaland' },
    { value: 'odisha', label: 'Odisha' },
    { value: 'punjab', label: 'Punjab' },
    { value: 'rajasthan', label: 'Rajasthan' },
    { value: 'sikkim', label: 'Sikkim' },
    { value: 'tamil-nadu', label: 'Tamil Nadu' },
    { value: 'telangana', label: 'Telangana' },
    { value: 'tripura', label: 'Tripura' },
    { value: 'uttar-pradesh', label: 'Uttar Pradesh' },
    { value: 'uttarakhand', label: 'Uttarakhand' },
    { value: 'west-bengal', label: 'West Bengal' },
  ];

  return (
    <div className="mb-6">
      <label className="text-sm font-medium flex items-center mb-3">
        <MapPin className="w-4 h-4 mr-1.5 text-accent" />
        State
      </label>
      <Select value={selectedState} onValueChange={onStateChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="All States" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All States</SelectItem>
          {indianStates.map(state => (
            <SelectItem key={state.value} value={state.value}>{state.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

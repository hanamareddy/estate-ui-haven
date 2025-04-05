import React, { useEffect, useState } from 'react';
import ActionButton from '../ActionButton';
import axios from 'axios';

interface StatusFilterProps {
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

export const StatusFilter = ({ activeStatus, onStatusChange }: StatusFilterProps) => {
  const [availableStatuses, setAvailableStatuses] = useState([
    { id: 'all', label: 'All' },
    { id: 'for-sale', label: 'For Sale' },
    { id: 'for-rent', label: 'For Rent' }
  ]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
        const response = await axios.get(`${API_BASE_URL}/properties/statuses`);
        
        if (response.data && response.data.length > 0) {
          const formattedStatuses = response.data.map(status => ({
            id: status.value,
            label: status.label
          }));
          
          // Add "All" option if it doesn't exist
          if (!formattedStatuses.some(s => s.id === 'all')) {
            setAvailableStatuses([
              { id: 'all', label: 'All' },
              ...formattedStatuses
            ]);
          } else {
            setAvailableStatuses(formattedStatuses);
          }
        }
      } catch (error) {
        console.error('Error fetching property statuses:', error);
        // Keep default statuses if fetch fails
      }
    };
    
    fetchStatuses();
  }, []);

  return (
    <div className="flex flex-wrap items-center space-x-2">
      <span className="text-sm font-medium text-muted-foreground mr-1">Status:</span>
      {availableStatuses.map((status) => (
        <ActionButton
          key={status.id}
          active={activeStatus === status.id}
          activeColor="bg-accent text-white"
          onClick={() => onStatusChange(status.id)}
        >
          {status.label}
        </ActionButton>
      ))}
    </div>
  );
};

export default StatusFilter;

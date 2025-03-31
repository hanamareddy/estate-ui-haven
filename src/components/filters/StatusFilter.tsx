
import React from 'react';
import ActionButton from '../ActionButton';

interface StatusFilterProps {
  activeStatus: string;
  onStatusChange: (status: string) => void;
}

export const StatusFilter = ({ activeStatus, onStatusChange }: StatusFilterProps) => {
  return (
    <div className="flex flex-wrap items-center space-x-2">
      <span className="text-sm font-medium text-muted-foreground mr-1">Status:</span>
      <ActionButton
        active={activeStatus === 'all'}
        activeColor="bg-accent text-white"
        onClick={() => onStatusChange('all')}
      >
        All
      </ActionButton>
      <ActionButton
        active={activeStatus === 'for-sale'}
        activeColor="bg-accent text-white"
        onClick={() => onStatusChange('for-sale')}
      >
        For Sale
      </ActionButton>
      <ActionButton
        active={activeStatus === 'for-rent'}
        activeColor="bg-accent text-white"
        onClick={() => onStatusChange('for-rent')}
      >
        For Rent
      </ActionButton>
    </div>
  );
};

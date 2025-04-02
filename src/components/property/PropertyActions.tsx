
import React from 'react';
import { ExternalLink, X } from 'lucide-react';
import ActionButton from '../ActionButton';
import { Button } from '@/components/ui/button';

interface PropertyActionsProps {
  onInterestClick: () => void;
  onViewDetails: () => void;
  onCompare?: () => void;
  isCompared?: boolean;
  onClose?: () => void;
  showCloseButton?: boolean;
}

const PropertyActions = ({
  onInterestClick,
  onViewDetails,
  onCompare,
  isCompared = false,
  onClose,
  showCloseButton = false
}: PropertyActionsProps) => {
  return (
    <div className="mt-4 flex space-x-3">
      <Button 
        className="flex-1 btn-primary"
        onClick={onInterestClick}
      >
        I'm interested
      </Button>
      <div className="flex gap-1">
        {onCompare && (
          <ActionButton
            icon={<div className={`w-4 h-4 grid place-items-center font-bold ${isCompared ? 'text-accent' : ''}`}>⊞</div>}
            variant="outline"
            aria-label={isCompared ? "Remove from comparison" : "Add to comparison"}
            onClick={onCompare}
            className={isCompared ? "border-accent text-accent" : ""}
          />
        )}
        <ActionButton
          icon={<ExternalLink className="w-4 h-4" />}
          variant="outline"
          aria-label="View details"
          onClick={onViewDetails}
          className="block md:block" // Ensure visible on all devices
        />
        {showCloseButton && onClose && (
          <ActionButton
            icon={<X className="w-4 h-4" />}
            variant="outline"
            aria-label="Close"
            onClick={onClose}
            className="block" // Ensure visible on all devices
          />
        )}
      </div>
    </div>
  );
};

export default PropertyActions;

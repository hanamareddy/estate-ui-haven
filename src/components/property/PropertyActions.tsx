
import React from 'react';
import { ExternalLink } from 'lucide-react';
import ActionButton from '../ActionButton';

interface PropertyActionsProps {
  onInterestClick: () => void;
  onViewDetails: () => void;
  onCompare?: () => void;
  isCompared?: boolean;
}

const PropertyActions = ({
  onInterestClick,
  onViewDetails,
  onCompare,
  isCompared = false
}: PropertyActionsProps) => {
  return (
    <div className="mt-4 flex space-x-3">
      <button 
        className="flex-1 btn-primary"
        onClick={onInterestClick}
      >
        I'm interested
      </button>
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
        />
      </div>
    </div>
  );
};

export default PropertyActions;

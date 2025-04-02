
import { Home } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

interface BackToHomeButtonProps {
  className?: string;
}

const BackToHomeButton = ({ className = '' }: BackToHomeButtonProps) => {
  return (
    <Link to="/">
      <Button variant="outline" className={`flex items-center gap-2 ${className}`} size="sm">
        <Home className="h-4 w-4" />
        <span>Back to Home</span>
      </Button>
    </Link>
  );
};

export default BackToHomeButton;

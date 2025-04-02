
import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Search, Heart, User } from 'lucide-react';

const MobileNavBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border py-2 px-4 md:hidden z-50">
      <div className="flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center p-2">
          <Home className="h-5 w-5 text-primary" />
          <span className="text-xs mt-1">Home</span>
        </Link>
        <Link to="/property/nearby" className="flex flex-col items-center p-2">
          <Search className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs mt-1">Search</span>
        </Link>
        <Link to="/buyer/dashboard" className="flex flex-col items-center p-2">
          <Heart className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs mt-1">Favorites</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center p-2">
          <User className="h-5 w-5 text-muted-foreground" />
          <span className="text-xs mt-1">Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavBar;

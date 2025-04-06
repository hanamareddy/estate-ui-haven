
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Heart, User } from 'lucide-react';

const MobileNavBar = () => {
  const location = useLocation();
  const path = location.pathname;
  
  const isActive = (route: string) => {
    if (route === '/' && path === '/') return true;
    if (route !== '/' && path.startsWith(route)) return true;
    return false;
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border py-2 px-4 md:hidden z-50 shadow-lg">
      <div className="flex justify-around items-center">
        <Link to="/" className="flex flex-col items-center p-2">
          <div className={`rounded-full p-1.5 ${isActive('/') ? 'bg-primary/10' : ''}`}>
            <Home className={`h-5 w-5 ${isActive('/') ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <span className={`text-xs mt-1 ${isActive('/') ? 'font-medium text-primary' : 'text-muted-foreground'}`}>Home</span>
        </Link>
        <Link to="/property/nearby" className="flex flex-col items-center p-2">
          <div className={`rounded-full p-1.5 ${isActive('/property/nearby') ? 'bg-primary/10' : ''}`}>
            <Search className={`h-5 w-5 ${isActive('/property/nearby') ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <span className={`text-xs mt-1 ${isActive('/property/nearby') ? 'font-medium text-primary' : 'text-muted-foreground'}`}>Search</span>
        </Link>
        <Link to="/buyer/dashboard" className="flex flex-col items-center p-2">
          <div className={`rounded-full p-1.5 ${isActive('/buyer/dashboard') ? 'bg-primary/10' : ''}`}>
            <Heart className={`h-5 w-5 ${isActive('/buyer/dashboard') ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <span className={`text-xs mt-1 ${isActive('/buyer/dashboard') ? 'font-medium text-primary' : 'text-muted-foreground'}`}>Favorites</span>
        </Link>
        <Link to="/profile" className="flex flex-col items-center p-2">
          <div className={`rounded-full p-1.5 ${isActive('/profile') ? 'bg-primary/10' : ''}`}>
            <User className={`h-5 w-5 ${isActive('/profile') ? 'text-primary' : 'text-muted-foreground'}`} />
          </div>
          <span className={`text-xs mt-1 ${isActive('/profile') ? 'font-medium text-primary' : 'text-muted-foreground'}`}>Profile</span>
        </Link>
      </div>
    </div>
  );
};

export default MobileNavBar;

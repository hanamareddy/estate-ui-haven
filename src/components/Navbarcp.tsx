
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search, User, Bell, ChevronDown, Home } from 'lucide-react';
import { Button } from './ui/button';
import { Sheet, SheetTrigger, SheetContent } from './ui/sheet';
import NotificationCenter from './NotificationCenter';
import { FilterSidebar } from './filters/FilterSidebar';
import mongoAuthService from '@/services/mongoAuthService';
import useNotifications from '@/hooks/useNotifications';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

interface NavbarProps {
  activeStatus?: string;
  activeType?: string;
  priceRange?: { min: string; max: string };
  bedrooms?: string;
  bathrooms?: string;
  areaRange?: { min: string; max: string };
  selectedAmenities?: string[];
  onStatusChange?: (status: string) => void;
  onTypeChange?: (type: string) => void;
  handlePriceChange?: (type: 'min' | 'max', value: string) => void;
  setBedrooms?: (value: string) => void;
  setBathrooms?: (value: string) => void;
  handleAreaChange?: (type: 'min' | 'max', value: string) => void;
  toggleAmenity?: (amenity: string) => void;
  resetFilters?: () => void;
}

const Navbar = ({
  activeStatus = 'all',
  activeType = 'all',
  priceRange = { min: '', max: '' },
  bedrooms = '',
  bathrooms = '',
  areaRange = { min: '', max: '' },
  selectedAmenities = [],
  onStatusChange = () => {},
  onTypeChange = () => {},
  handlePriceChange = () => {},
  setBedrooms = () => {},
  setBathrooms = () => {},
  handleAreaChange = () => {},
  toggleAmenity = () => {},
  resetFilters = () => {}
}: NavbarProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const isAuthenticated = mongoAuthService.isAuthenticated();
  const userType = isAuthenticated ? mongoAuthService.getCurrentUser()?.isseller ? 'seller' : 'buyer' : null;
  const { unreadCount = 0 } = useNotifications();
  
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  const handleLogout = () => {
    mongoAuthService.logout();
    window.location.href = '/';
  };
  
  const closeFilters = () => {
    // Apply filters logic here
    setIsFilterOpen(false);
  };

  // Get user initials for avatar
  const getUserInitials = () => {
    const user = mongoAuthService.getCurrentUser();
    if (!user || !user.name) return 'U';
    
    const nameParts = user.name.split(' ');
    if (nameParts.length > 1) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
  };

  return (
    <header 
      className={`sticky top-0 z-40 w-full transition-all duration-200 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-semibold text-sm">RE</span>
            </div>
            <span className="font-medium text-lg">EstateHub</span>
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-foreground hover:text-accent transition-colors">Home</Link>
            <Link to="/" className="text-foreground hover:text-accent transition-colors">Properties</Link>
            <div className="relative group">
              <button className="flex items-center text-foreground hover:text-accent transition-colors">
                Services <ChevronDown className="ml-1 h-4 w-4" />
              </button>
              <div className="absolute z-50 left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2 hidden group-hover:block">
                <Link to="/market-trends" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Market Trends</Link>
                <Link to="/property/nearby" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Nearby Properties</Link>
              </div>
            </div>
          </nav>
          
          {/* Right side - Auth & Search */}
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="icon" onClick={() => setIsFilterOpen(true)}>
              <Search className="h-4 w-4" />
            </Button>
            
            {isAuthenticated ? (
              <>
                <Sheet open={notificationOpen} onOpenChange={setNotificationOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" size="icon" className="relative">
                      <Bell className="h-4 w-4" />
                      {unreadCount > 0 && (
                        <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs w-4 h-4 rounded-full flex items-center justify-center">
                          {unreadCount}
                        </span>
                      )}
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <NotificationCenter />
                  </SheetContent>
                </Sheet>
                
                <div className="relative group">
                  <Button variant="ghost" size="icon" className="rounded-full p-0 h-9 w-9 overflow-hidden">
                    <Avatar>
                      <AvatarImage src={mongoAuthService.getCurrentUser()?.avatar || ''} />
                      <AvatarFallback>{getUserInitials()}</AvatarFallback>
                    </Avatar>
                  </Button>
                  <div className="absolute z-50 right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 p-2 hidden group-hover:block">
                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Profile</Link>
                    
                    {userType === 'buyer' && (
                      <Link to="/buyer/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Buyer Dashboard</Link>
                    )}
                    
                    {userType === 'seller' && (
                      <>
                        <Link to="/seller/dashboard" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Seller Dashboard</Link>
                        <Link to="/seller/property/add" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md">Add Property</Link>
                      </>
                    )}
                    
                    <button 
                      onClick={handleLogout} 
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link to="/auth">
                <Button>Login / Register</Button>
              </Link>
            )}
            
            {/* Mobile menu button */}
            <Button variant="outline" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>
        
        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Home</Link>
              <Link to="/" className="text-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Properties</Link>
              <Link to="/market-trends" className="text-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Market Trends</Link>
              <Link to="/property/nearby" className="text-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Nearby Properties</Link>
              {isAuthenticated && (
                <>
                  <Link to="/profile" className="text-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Profile</Link>
                  {userType === 'seller' && (
                    <>
                      <Link to="/seller/dashboard" className="text-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Seller Dashboard</Link>
                      <Link to="/seller/property/add" className="text-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Add Property</Link>
                    </>
                  )}
                  {userType === 'buyer' && (
                    <Link to="/buyer/dashboard" className="text-foreground hover:text-accent transition-colors" onClick={() => setMobileMenuOpen(false)}>Buyer Dashboard</Link>
                  )}
                  <button 
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }} 
                    className="text-left text-foreground hover:text-accent transition-colors"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Filter sidebar */}
      <FilterSidebar
        isFilterOpen={isFilterOpen}
        setIsFilterOpen={setIsFilterOpen}
        priceRange={priceRange}
        handlePriceChange={handlePriceChange}
        bedrooms={bedrooms}
        setBedrooms={setBedrooms}
        bathrooms={bathrooms}
        setBathrooms={setBathrooms}
        areaRange={areaRange}
        handleAreaChange={handleAreaChange}
        selectedAmenities={selectedAmenities}
        toggleAmenity={toggleAmenity}
        resetFilters={resetFilters}
        closeFilters={closeFilters}
        activeStatus={activeStatus}
        activeType={activeType}
        onStatusChange={onStatusChange}
        onTypeChange={onTypeChange}
      />
    </header>
  );
};

export default Navbar;

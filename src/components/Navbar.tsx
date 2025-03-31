import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Menu, X, User, Heart, LogIn, Bell, Search, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ActionButton from "./ActionButton";
import { supabase } from "@/integrations/supabase/client";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check for user in localStorage first for immediate UI update
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setUserProfile(parsedUser.profile);
      } catch (error) {
        console.error("Error parsing user from localStorage:", error);
      }
    }

    // Then verify with Supabase
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session) {
          // Get user profile from the database
          const { data: profileData, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          setUser(session.user);
          setUserProfile(profileData);
          
          // Update localStorage
          localStorage.setItem('user', JSON.stringify({
            ...session.user,
            profile: profileData
          }));
        } else {
          setUser(null);
          setUserProfile(null);
          localStorage.removeItem('user');
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    
    if (error) {
      toast({
        title: "Error signing out",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setUser(null);
      setUserProfile(null);
      localStorage.removeItem('user');
      
      toast({
        title: "Signed out",
        description: "You have been signed out successfully",
      });
      
      navigate("/");
    }
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleDashboardClick = () => {
    if (userProfile?.isseller) {
      navigate("/seller/dashboard");
    } else {
      navigate("/buyer/dashboard");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
          <div className="bg-accent rounded-md p-1">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span>EstateHub</span>
        </Link>

        {/* Search Bar on Desktop */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-muted-foreground" />
            </div>
            <input 
              type="text" 
              placeholder="Search for properties in India..." 
              className="w-full py-2 pl-10 pr-4 rounded-full border border-border bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-accent/20"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex md:gap-6 items-center">
          <Link
            to="/"
            className="text-sm font-medium transition-colors hover:text-accent"
          >
            Home
          </Link>
          <Link
            to="/#properties"
            className="text-sm font-medium transition-colors hover:text-accent"
          >
            Properties
          </Link>
          {userProfile?.isseller && (
            <Link
              to="/seller/dashboard"
              className="text-sm font-medium transition-colors hover:text-accent"
            >
              Seller Dashboard
            </Link>
          )}
          <div className="flex items-center gap-2">
            <ActionButton icon={<Bell className="h-5 w-5" />} variant="ghost" />
            <ActionButton icon={<Heart className="h-5 w-5" />} variant="ghost" badge="2" />
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url} />
                      <AvatarFallback>{getInitials(userProfile?.name || user.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{userProfile?.name || user.email}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleProfileClick}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDashboardClick}>
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    <span>Dashboard</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" size="sm" className="gap-2" onClick={() => navigate("/auth")}>
                <User className="h-4 w-4" />
                <span>Sign In</span>
              </Button>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[80vw] px-6">
            <div className="flex flex-col gap-6 mt-8">
              {/* User Profile on Mobile */}
              {user && (
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={user.user_metadata?.avatar_url} />
                    <AvatarFallback>{getInitials(userProfile?.name || user.email)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{userProfile?.name || user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              )}
            
              {/* Search Bar on Mobile */}
              <div className="relative w-full mb-4">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Search className="w-4 h-4 text-muted-foreground" />
                </div>
                <input 
                  type="text" 
                  placeholder="Search for properties in India..." 
                  className="w-full py-2 pl-10 pr-4 rounded-full border border-border bg-secondary/30 focus:outline-none focus:ring-1 focus:ring-accent/20"
                />
              </div>

              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium hover:text-accent"
              >
                Home
              </Link>
              <Link
                to="/#properties"
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium hover:text-accent"
              >
                Properties
              </Link>
              {userProfile?.isseller && (
                <Link
                  to="/seller/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="text-lg font-medium hover:text-accent"
                >
                  Seller Dashboard
                </Link>
              )}
              <div className="flex flex-col gap-4 mt-2">
                <Button 
                  className="gap-2 w-full justify-center" 
                  variant="outline"
                  onClick={() => {
                    setIsOpen(false);
                    navigate("/favorites");
                  }}
                >
                  <Heart className="h-4 w-4" />
                  <span>Favorites</span>
                </Button>
                
                {user ? (
                  <>
                    <Button 
                      className="gap-2 w-full justify-center" 
                      variant="outline"
                      onClick={() => {
                        setIsOpen(false);
                        handleDashboardClick();
                      }}
                    >
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Button>
                    <Button 
                      className="gap-2 w-full justify-center" 
                      variant="default"
                      onClick={() => {
                        setIsOpen(false);
                        handleLogout();
                      }}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </Button>
                  </>
                ) : (
                  <Button 
                    className="gap-2 w-full justify-center" 
                    variant="default"
                    onClick={() => {
                      setIsOpen(false);
                      navigate("/auth");
                    }}
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Sign In</span>
                  </Button>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;

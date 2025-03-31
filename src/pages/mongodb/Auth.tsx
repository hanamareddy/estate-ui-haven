
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Eye, EyeOff, Building, User, Mail, Lock, Phone } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";
import GoogleAuthButton from "@/components/auth/GoogleAuthButton";
import { connectToDatabase, collections } from "@/integrations/mongodb/client";
import { getSession } from "@/services/authService";

const MongoAuth = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const checkAuth = async () => {
      const session = await getSession();
      if (session) {
        navigate("/");
      }
    };
    
    checkAuth();
  }, [navigate]);

  const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [loginForm, setLoginForm] = useState({
      email: "",
      password: "",
    });

    const toggleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    const handleLoginChange = (e) => {
      const { name, value } = e.target;
      setLoginForm({ ...loginForm, [name]: value });
    };

    const handleLoginSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      
      try {
        const db = await connectToDatabase();
        const usersCollection = db.collection(collections.users);
        
        // In a real app, you would use bcrypt to hash passwords
        const user = await usersCollection.findOne({ 
          email: loginForm.email,
          password: loginForm.password // This is simplified - use proper password hashing in production
        });
        
        if (!user) {
          throw new Error("Invalid email or password");
        }
        
        const profilesCollection = db.collection(collections.profiles);
        const profile = await profilesCollection.findOne({ user_id: user._id });
        
        // Create session
        const session = {
          user: {
            id: user._id.toString(),
            email: user.email,
          },
          profile: profile ? {
            id: profile._id.toString(),
            name: profile.name,
            email: profile.email,
            isseller: profile.isseller || false,
          } : null,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        };
        
        localStorage.setItem('user_session', JSON.stringify(session));
        
        toast({
          title: "Login Successful",
          description: "Welcome back to EstateHub India!",
        });
        
        navigate("/");
      } catch (error) {
        console.error("Login error:", error);
        toast({
          title: "Login Failed",
          description: error.message || "Invalid credentials. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <form onSubmit={handleLoginSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link
                to="/forgot-password"
                className="text-sm text-accent underline-offset-4 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-2.5 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          
          <div className="relative flex items-center justify-center">
            <div className="absolute border-t border-gray-300 w-full"></div>
            <div className="relative px-4 bg-white text-sm text-gray-500">Or continue with</div>
          </div>
          
          <GoogleAuthButton 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
          />
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
        </CardFooter>
      </form>
    );
  };

  const SignupForm = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [signupForm, setSignupForm] = useState({
      name: "",
      email: "",
      password: "",
      phone: "",
      isseller: false,
      companyName: "",
      reraId: "", // Real Estate Regulatory Authority ID
    });

    const toggleShowPassword = () => {
      setShowPassword((prev) => !prev);
    };

    const handleSignupChange = (e) => {
      const { name, value, type, checked } = e.target;
      setSignupForm({ 
        ...signupForm, 
        [name]: type === "checkbox" ? checked : value 
      });
    };

    const handleSignupSubmit = async (e) => {
      e.preventDefault();
      setIsLoading(true);
      
      try {
        const db = await connectToDatabase();
        const usersCollection = db.collection(collections.users);
        const profilesCollection = db.collection(collections.profiles);
        
        // Check if email already exists
        const existingUser = await usersCollection.findOne({ email: signupForm.email });
        if (existingUser) {
          throw new Error("Email already registered. Please sign in instead.");
        }
        
        // Create user
        const newUser = {
          email: signupForm.email,
          password: signupForm.password, // In a real app, hash this password
          created_at: new Date().toISOString()
        };
        
        const result = await usersCollection.insertOne(newUser);
        
        // Create profile
        const newProfile = {
          user_id: result.insertedId,
          name: signupForm.name,
          email: signupForm.email,
          phone: signupForm.phone.startsWith('+') ? signupForm.phone : `+${signupForm.phone}`,
          isseller: signupForm.isseller,
          companyName: signupForm.companyName,
          reraId: signupForm.reraId,
          created_at: new Date().toISOString()
        };
        
        await profilesCollection.insertOne(newProfile);
        
        toast({
          title: "Registration Successful",
          description: "Your account has been created. Please sign in.",
        });
        
        // Switch to login tab
        setActiveTab("login");
      } catch (error) {
        console.error("Registration error:", error);
        toast({
          title: "Registration Failed",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <form onSubmit={handleSignupSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                placeholder="John Doe"
                className="pl-10"
                value={signupForm.name}
                onChange={handleSignupChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                className="pl-10"
                value={signupForm.email}
                onChange={handleSignupChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="pl-10"
                value={signupForm.password}
                onChange={handleSignupChange}
                required
              />
              <button
                type="button"
                onClick={toggleShowPassword}
                className="absolute right-3 top-2.5 text-muted-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+91 9876543210"
                className="pl-10"
                value={signupForm.phone}
                onChange={handleSignupChange}
                required
              />
            </div>
            <p className="text-xs text-muted-foreground">Include country code (e.g., +91 for India)</p>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isseller"
              name="isseller"
              checked={signupForm.isseller}
              onCheckedChange={(checked) => 
                setSignupForm({
                  ...signupForm,
                  isseller: checked === true
                })
              }
            />
            <label
              htmlFor="isseller"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Register as a Property Seller/Agent
            </label>
          </div>

          {signupForm.isseller && (
            <>
              <div className="space-y-2">
                <Label htmlFor="companyName">Company/Agency Name</Label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="companyName"
                    name="companyName"
                    placeholder="Your Company Name"
                    className="pl-10"
                    value={signupForm.companyName}
                    onChange={handleSignupChange}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reraId">RERA ID</Label>
                <Input
                  id="reraId"
                  name="reraId"
                  placeholder="RERA Registration Number"
                  value={signupForm.reraId}
                  onChange={handleSignupChange}
                />
                <p className="text-xs text-muted-foreground">
                  Real Estate Regulatory Authority registration number
                </p>
              </div>
            </>
          )}

          <Separator />
          
          <GoogleAuthButton 
            isLoading={isLoading} 
            setIsLoading={setIsLoading} 
          />

          <div className="text-xs text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link
              to="/terms"
              className="text-accent underline-offset-4 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="text-accent underline-offset-4 hover:underline"
            >
              Privacy Policy
            </Link>
            .
          </div>
        </CardContent>
        <CardFooter>
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </Button>
        </CardFooter>
      </form>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/10 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">EstateHub India</CardTitle>
          <CardDescription>
            Your trusted platform for Indian real estate
          </CardDescription>
        </CardHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <LoginForm />
          </TabsContent>

          <TabsContent value="signup">
            <SignupForm />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};

export default MongoAuth;

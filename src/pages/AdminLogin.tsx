
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useMobile } from "@/hooks/use-mobile";

const AdminLogin = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const isMobile = useMobile();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple admin validation (in a real app, use proper authentication)
    if (username === "admin" && password === "admin123") {
      // Store admin status in localStorage
      localStorage.setItem("isAdmin", "true");
      localStorage.setItem("isLoggedIn", "true");
      
      toast({
        title: "Admin login successful",
        description: "Welcome to Eye Town Vision Care Admin Dashboard!",
        duration: 3000,
      });
      
      navigate("/admin/dashboard");
    } else {
      toast({
        title: "Login failed",
        description: "Invalid admin credentials. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 md:pt-20">
        <div className="container mx-auto px-4 py-6 md:py-12">
          <div className="max-w-sm md:max-w-md mx-auto bg-white rounded-lg shadow-sm p-6 md:p-8">
            <div className="text-center mb-6 md:mb-8">
              <div className="flex justify-center mb-3 md:mb-4">
                <div className="bg-primary/10 p-2 md:p-3 rounded-full">
                  <ShieldAlert size={isMobile ? 20 : 24} className="text-primary" />
                </div>
              </div>
              <h1 className="text-xl md:text-2xl font-medium mb-1 md:mb-2">Admin Login</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Sign in to the Eye Town Vision Care admin dashboard
              </p>
            </div>
            
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-3 md:space-y-4">
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="username" className="text-sm md:text-base">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="h-9 md:h-10"
                  />
                </div>
                
                <div className="space-y-1 md:space-y-2">
                  <Label htmlFor="password" className="text-sm md:text-base">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-9 md:h-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={isMobile ? 14 : 16} /> : <Eye size={isMobile ? 14 : 16} />}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full h-9 md:h-10 text-sm md:text-base">
                  Sign In
                </Button>
              </div>
            </form>
            
            <div className="mt-6 md:mt-8 text-center text-xs md:text-sm text-muted-foreground">
              <p>Admin credentials (for demo):</p>
              <p>Username: admin</p>
              <p>Password: admin123</p>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default AdminLogin;

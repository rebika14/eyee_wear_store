
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { ShoppingBag, Menu, X, LogOut, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { useMobile } from "@/hooks/use-mobile";

const Navbar = () => {
  const location = useLocation();
  const isMobile = useMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);

  // Add scroll listener
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    closeMenu();
  }, [location.pathname]);

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-white shadow-sm py-2" : "bg-transparent py-4"}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold">
            <span className="text-primary">Eye</span>Town
          </Link>
          
          {/* Desktop Navigation */}
          {!isMobile && (
            <nav className="hidden md:flex space-x-6">
              <NavLink to="/" label="Home" />
              <NavLink to="/store" label="Store" />
              <NavLink to="/men" label="Men" />
              <NavLink to="/women" label="Women" />
              <NavLink to="/about" label="About Us" />
            </nav>
          )}
          
          {/* Desktop Right Actions */}
          {!isMobile && (
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <Button variant="ghost" size="sm" className="flex items-center gap-2" onClick={() => signOut()}>
                  <LogOut size={16} />
                  <span>Log Out</span>
                </Button>
              ) : (
                <Button variant="ghost" size="sm" className="flex items-center gap-2" asChild>
                  <Link to="/login">
                    <UserRound size={16} />
                    <span>Log In</span>
                  </Link>
                </Button>
              )}
              <Button variant="outline" size="sm" className="flex items-center gap-2" asChild>
                <Link to="/cart">
                  <ShoppingBag size={16} />
                  <span>Cart</span>
                </Link>
              </Button>
            </div>
          )}
          
          {/* Mobile Menu Button */}
          {isMobile && (
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="text-foreground">
                <ShoppingBag size={20} />
              </Link>
              <button 
                onClick={toggleMenu}
                className="text-foreground"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isMobile && (
        <div 
          className={`fixed inset-0 bg-background z-40 transition-transform duration-300 transform ${isMenuOpen ? "translate-x-0" : "translate-x-full"}`}
          style={{ top: "60px" }}
        >
          <div className="container mx-auto px-4 py-6">
            <nav className="flex flex-col space-y-4">
              <MobileNavLink to="/" label="Home" />
              <MobileNavLink to="/store" label="Store" />
              <MobileNavLink to="/men" label="Men" />
              <MobileNavLink to="/women" label="Women" />
              <MobileNavLink to="/about" label="About Us" />
              
              <div className="h-px bg-muted my-2"></div>
              
              {user ? (
                <button 
                  onClick={() => {
                    signOut();
                    closeMenu();
                  }}
                  className="flex items-center py-2 text-foreground hover:text-primary transition-colors"
                >
                  <LogOut size={20} className="mr-3" />
                  <span>Log Out</span>
                </button>
              ) : (
                <div className="flex items-center py-2 text-foreground hover:text-primary transition-colors">
                  <Link to="/login" className="flex items-center" onClick={closeMenu}>
                    <UserRound size={20} className="mr-3" />
                    <span>Log In</span>
                  </Link>
                </div>
              )}
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

const NavLink = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== "/" && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`text-sm font-medium hover:text-primary transition-colors ${isActive ? "text-primary" : "text-foreground"}`}
    >
      {label}
    </Link>
  );
};

const MobileNavLink = ({ to, label }: { to: string; label: string }) => {
  const location = useLocation();
  const isActive = location.pathname === to || 
    (to !== "/" && location.pathname.startsWith(to));
  
  return (
    <Link 
      to={to} 
      className={`flex items-center py-2 text-lg ${isActive ? "text-primary font-medium" : "text-foreground"} hover:text-primary transition-colors`}
    >
      {label}
    </Link>
  );
};

export default Navbar;

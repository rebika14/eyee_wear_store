
import { Link } from "react-router-dom";
import { Eye, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white pt-16 pb-12 border-t border-gray-100">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Eye size={24} strokeWidth={1.5} />
              <span className="font-semibold text-xl">Eye Town</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs">
              Crafting premium eyewear that balances style and functionality for your perfect vision experience.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" aria-label="Facebook" className="text-muted-foreground hover:text-primary transition-colors">
                <Facebook size={18} strokeWidth={1.5} />
              </a>
              <a href="#" aria-label="Instagram" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram size={18} strokeWidth={1.5} />
              </a>
              <a href="#" aria-label="Twitter" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter size={18} strokeWidth={1.5} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold mb-4 tracking-wider">Shop</h3>
            <div className="flex flex-col space-y-3">
              <FooterLink to="/store">All Eyewear</FooterLink>
              <FooterLink to="/men">Men's Collection</FooterLink>
              <FooterLink to="/women">Women's Collection</FooterLink>
              <FooterLink to="/store">New Arrivals</FooterLink>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 tracking-wider">About</h3>
            <div className="flex flex-col space-y-3">
              <FooterLink to="#">Our Story</FooterLink>
              <FooterLink to="#">Locations</FooterLink>
              <FooterLink to="#">Careers</FooterLink>
              <FooterLink to="#">Contact Us</FooterLink>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 tracking-wider">Customer Service</h3>
            <div className="flex flex-col space-y-3">
              <FooterLink to="#">Shipping & Returns</FooterLink>
              <FooterLink to="#">FAQs</FooterLink>
              <FooterLink to="#">Privacy Policy</FooterLink>
              <FooterLink to="#">Terms of Service</FooterLink>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-100 mt-12 pt-8">
          <p className="text-sm text-muted-foreground text-center">
            © {currentYear} Eye Town Vision Care. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

const FooterLink = ({ to, children }: { to: string; children: React.ReactNode }) => {
  return (
    <Link
      to={to}
      className="text-muted-foreground hover:text-primary transition-colors text-sm"
    >
      {children}
    </Link>
  );
};

export default Footer;

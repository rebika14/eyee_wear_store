
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = () => {
  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="pt-20 md:pt-0 md:h-screen flex items-center relative overflow-hidden bg-gradient-to-r from-gray-50 to-gray-100">
          <div className="container mx-auto px-4 py-20 md:py-0 grid md:grid-cols-2 gap-8 items-center">
            <div className="fade-in">
              <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                Premium Eyewear Collection
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight mb-6">
                See the world with clarity and style
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Discover our curated collection of premium eyewear that combines timeless design with superior craftsmanship.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="rounded-md">
                  <Link to="/store">
                    Shop Collection
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-md">
                  <Link to="/store">
                    Explore Frames
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="relative slide-up">
              <div className="aspect-square max-w-md mx-auto rounded-3xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1625591340248-6d695581bdf8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
                  alt="Premium Eyewear" 
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Floating card */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-lg hidden md:block animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Eye size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Premium Materials</p>
                    <p className="text-xs text-muted-foreground">Handcrafted frames</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-medium mb-4">Shop by Category</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Explore our diverse range of eyewear styles for every face shape and personality.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Men's Category */}
              <CategoryCard 
                title="Men's Collection"
                description="Sophisticated frames for the modern man"
                image="https://images.unsplash.com/photo-1584036562087-6a49deb551c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
                link="/men"
              />
              
              {/* Women's Category */}
              <CategoryCard 
                title="Women's Collection"
                description="Elegant designs with a contemporary edge"
                image="https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2574&q=80"
                link="/women"
              />
              
              {/* Sunglasses Category */}
              <CategoryCard 
                title="Sunglasses"
                description="UV protection with uncompromising style"
                image="https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
                link="/store"
              />
            </div>
          </div>
        </section>
        
        {/* About Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="relative">
                <div className="aspect-[3/4] rounded-lg overflow-hidden">
                  <img 
                    src="https://images.unsplash.com/photo-1577031698511-9a5b5a94d44a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80" 
                    alt="About Eye Town Vision Care" 
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Accent element */}
                <div className="absolute -bottom-6 -right-6 w-1/2 aspect-square bg-primary/10 rounded-lg -z-10"></div>
              </div>
              
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  Our Story
                </div>
                <h2 className="text-3xl font-medium mb-6">Crafting vision solutions since 2005</h2>
                <p className="text-muted-foreground mb-6">
                  At Eye Town Vision Care, we believe that eyewear is more than just a vision correction tool—it's an expression of your unique personality and style. Our journey began with a simple mission: to create exceptional eyewear that combines superior craftsmanship with timeless design.
                </p>
                <p className="text-muted-foreground mb-8">
                  Each frame in our collection is thoughtfully designed and crafted using premium materials to ensure comfort, durability, and style. We work with skilled artisans who share our passion for quality and attention to detail.
                </p>
                <Button variant="outline" className="rounded-md">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-medium mb-4">Why Choose Eye Town</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                We're committed to providing an exceptional eyewear experience at every step.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard 
                title="Premium Materials"
                description="Ethically sourced, high-quality materials for durability and comfort"
              />
              <FeatureCard 
                title="Expert Craftsmanship"
                description="Each frame crafted with meticulous attention to detail"
              />
              <FeatureCard 
                title="Perfect Fit Guarantee"
                description="Free adjustments to ensure your frames fit perfectly"
              />
              <FeatureCard 
                title="30-Day Returns"
                description="Try your new glasses risk-free with our easy return policy"
              />
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-end mb-10">
              <div>
                <div className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
                  Featured
                </div>
                <h2 className="text-3xl font-medium">Best Sellers</h2>
              </div>
              
              <Link 
                to="/store" 
                className="flex items-center text-sm font-medium hover:text-primary transition-colors"
              >
                View All
                <ChevronRight size={16} className="ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <FeaturedProductCard 
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  image={product.image}
                />
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

const CategoryCard = ({ 
  title, 
  description, 
  image, 
  link 
}: { 
  title: string; 
  description: string; 
  image: string; 
  link: string; 
}) => {
  return (
    <Link 
      to={link}
      className="group block relative rounded-lg overflow-hidden bg-gray-900 aspect-[4/5] transition-transform hover:scale-[1.01]"
    >
      <img 
        src={image} 
        alt={title} 
        className="absolute inset-0 w-full h-full object-cover opacity-70 transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
        <h3 className="text-xl font-medium text-white mb-2">{title}</h3>
        <p className="text-gray-200 text-sm mb-4">{description}</p>
        <div className="flex items-center text-white text-sm font-medium">
          <span>Explore Collection</span>
          <ChevronRight size={16} className="ml-1 transition-transform group-hover:translate-x-0.5" />
        </div>
      </div>
    </Link>
  );
};

const FeatureCard = ({ 
  title, 
  description 
}: { 
  title: string; 
  description: string;
}) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 transition-transform hover:scale-[1.02]">
      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4">
        <Eye size={20} className="text-primary" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  );
};

const FeaturedProductCard = ({ 
  id, 
  name, 
  price, 
  image 
}: { 
  id: number; 
  name: string; 
  price: number; 
  image: string;
}) => {
  return (
    <Link to={`/product/${id}`} className="group block">
      <div className="bg-white rounded-lg overflow-hidden shadow-sm transition-shadow group-hover:shadow-md">
        <div className="aspect-square relative overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm mt-1 font-medium">Rs. {price.toFixed(2)}</p>
        </div>
      </div>
    </Link>
  );
};

// Sample featured products data
const featuredProducts = [
  {
    id: 1,
    name: "Classic Round",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1574258495973-f010dfbb5371?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
  },
  {
    id: 2,
    name: "Modern Square",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2670&q=80"
  },
  {
    id: 3,
    name: "Aviator Gold",
    price: 169.99,
    image: "https://images.unsplash.com/photo-1625591339971-4c9a87a66871?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=987&q=80"
  }
];

export default Index;


import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ReviewBox from "@/components/ReviewBox";
import { useCart } from "@/contexts/CartContext";
import { useRealTimeProducts } from "@/hooks/useRealTimeProducts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMobile } from "@/hooks/use-mobile";
import { Loader2 } from "lucide-react";

const Store = () => {
  const location = useLocation();
  const { addItem } = useCart();
  const [category, setCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("featured");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const isMobile = useMobile();
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);
  
  // Use real-time products from database instead of hardcoded data
  const { products, isLoading } = useRealTimeProducts();

  // Apply filters
  useEffect(() => {
    let result = [...products];
    
    // Filter by category
    if (category !== "all") {
      result = result.filter(product => product.category.toLowerCase() === category.toLowerCase());
    }
    
    // Sort products
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result.sort((a, b) => b.price - a.price);
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        // "featured" sorting is the default order
        break;
    }
    
    setFilteredProducts(result);
  }, [products, category, sortBy]);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Handle product selection for review
  const handleProductSelect = (productId: number) => {
    setSelectedProductId(productId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 pt-16 md:pt-20 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin" />
            <p className="text-muted-foreground">Loading products...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-16 md:pt-20">
        {/* Banner */}
        <div className="bg-gray-50 py-8 md:py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-2xl md:text-4xl font-medium mb-3 md:mb-4">Our Eyewear Collection</h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
              Discover our carefully curated selection of premium eyewear for every style and occasion.
            </p>
          </div>
        </div>
        
        {/* Filters and Products */}
        <section className="py-6 md:py-12 bg-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 space-y-4 md:space-y-0">
              {/* Tabs for category filtering */}
              <Tabs 
                defaultValue="all" 
                value={category} 
                onValueChange={setCategory}
                className="w-full md:w-auto"
              >
                <TabsList className={`grid ${isMobile ? "grid-cols-3" : "grid-cols-4"} w-full md:w-auto`}>
                  <TabsTrigger value="all" className="text-xs md:text-sm">All</TabsTrigger>
                  <TabsTrigger value="optical" className="text-xs md:text-sm">Optical</TabsTrigger>
                  <TabsTrigger value="sunglasses" className="text-xs md:text-sm">Sunglasses</TabsTrigger>
                  {!isMobile && <TabsTrigger value="accessories" className="text-xs md:text-sm">Accessories</TabsTrigger>}
                </TabsList>
              </Tabs>
              
              {/* Sort options */}
              <div className="w-full md:w-64">
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="name">Name</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            {/* Products display */}
            <div className="animate-fade-in">
              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="animate-slide-in">
                      <ProductCard 
                        product={product}
                        onAddToCart={addItem}
                      />
                      <div className="mt-2 text-center">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleProductSelect(product.id)}
                          className="text-xs w-full"
                        >
                          Write a Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 md:py-12">
                  <p className="text-lg mb-4">No products available yet.</p>
                  <p className="text-muted-foreground">Products added by the admin will appear here.</p>
                </div>
              )}
            </div>
          </div>
        </section>
        
        {/* Reviews Section */}
        {selectedProductId && (
          <section className="py-8 md:py-12 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-xl md:text-2xl font-medium mb-6 text-center">
                Write a Review
              </h2>
              <ReviewBox 
                productId={selectedProductId} 
                onClose={() => setSelectedProductId(null)}
                productName={filteredProducts.find(p => p.id === selectedProductId)?.name || ""}
              />
            </div>
          </section>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Store;

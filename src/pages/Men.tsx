
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useRealTimeProducts } from "@/hooks/useRealTimeProducts";
import { Loader2 } from "lucide-react";

const Men = () => {
  const location = useLocation();
  const { addItem } = useCart();
  const { products, isLoading } = useRealTimeProducts();
  const [menProducts, setMenProducts] = useState<any[]>([]);

  // Filter products for men
  useEffect(() => {
    const filtered = products.filter(product => 
      product.gender === "men" || product.gender === "unisex"
    );
    setMenProducts(filtered);
  }, [products]);

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

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
            <h1 className="text-2xl md:text-4xl font-medium mb-3 md:mb-4">Men's Eyewear</h1>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm md:text-base">
              Discover our premium collection of men's optical glasses and sunglasses.
            </p>
          </div>
        </div>
        
        {/* Products */}
        <section className="py-6 md:py-12 bg-white">
          <div className="container mx-auto px-4">
            {menProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                {menProducts.map((product) => (
                  <div key={product.id}>
                    <ProductCard 
                      product={product}
                      onAddToCart={addItem}
                    />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 md:py-12">
                <p className="text-lg mb-4">No men's products available yet.</p>
                <p className="text-muted-foreground">Products added by the admin will appear here.</p>
              </div>
            )}
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Men;

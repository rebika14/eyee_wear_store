
import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Star, ShoppingCart, CreditCard } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { products } from "@/data/products";
import { Product } from "@/components/ProductCard";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import ReviewBox from "@/components/ReviewBox";

// Sample customer reviews data
const sampleReviews = [
  {
    id: 1,
    name: "Aarav Sharma",
    rating: 5,
    date: "2023-04-15",
    comment: "These glasses are perfect! The build quality is excellent and they fit comfortably all day.",
  },
  {
    id: 2,
    name: "Priya Patel",
    rating: 4,
    date: "2023-03-22",
    comment: "Very stylish design and good quality. Shipping was quick too.",
  },
  {
    id: 3,
    name: "Rohan Gupta",
    rating: 5,
    date: "2023-05-10",
    comment: "I've tried many eyewear brands but these are by far the most comfortable. Will definitely buy again!",
  },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [quantity, setQuantity] = useState(1);
  const [isReviewBoxOpen, setIsReviewBoxOpen] = useState(false);
  
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  // Find product by ID
  useEffect(() => {
    if (id) {
      const foundProduct = products.find(p => p.id === parseInt(id));
      if (foundProduct) {
        setProduct(foundProduct);
        setSelectedColor(foundProduct.colors[0]);
      }
    }
  }, [id]);
  
  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <h1 className="text-2xl font-medium mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-6">
              The product you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => navigate("/store")}>
              Back to Store
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  const handleAddToCart = () => {
    addItem(product);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };
  
  const handleBuyNow = () => {
    addItem(product);
    navigate("/cart");
  };
  
  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Product Detail Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-12 md:mb-16">
            {/* Product Image */}
            <div className="bg-gray-50 rounded-lg overflow-hidden aspect-square">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
              />
            </div>
            
            {/* Product Info */}
            <div className="flex flex-col space-y-4 md:space-y-6">
              <div>
                <p className="text-sm text-muted-foreground mb-2">
                  {product.category} / {product.gender.charAt(0).toUpperCase() + product.gender.slice(1)}
                </p>
                <h1 className="text-xl md:text-3xl font-medium mb-4">{product.name}</h1>
                
                <div className="flex items-center mb-4 md:mb-6">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className="h-4 w-4 md:h-5 md:w-5 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground ml-2">
                    ({sampleReviews.length} reviews)
                  </span>
                </div>
                
                <p className="text-xl md:text-2xl font-semibold mb-4">
                  Rs. {product.price.toFixed(2)}
                </p>
                
                <Separator className="my-4 md:my-6" />
                
                {/* Color Selection */}
                <div className="mb-4 md:mb-6">
                  <h3 className="text-sm font-medium mb-3">Color</h3>
                  <div className="flex space-x-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`w-8 h-8 rounded-full transition-transform ${
                          selectedColor === color ? "ring-2 ring-primary ring-offset-2 scale-110" : ""
                        }`}
                        style={{ backgroundColor: color }}
                        aria-label={`Select ${color} color`}
                      />
                    ))}
                  </div>
                </div>
                
                {/* Quantity Selection */}
                <div className="mb-6 md:mb-8">
                  <h3 className="text-sm font-medium mb-3">Quantity</h3>
                  <div className="flex items-center w-32">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                    >
                      -
                    </Button>
                    <span className="flex-1 text-center">{quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleQuantityChange(quantity + 1)}
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>
              
              {/* Add to Cart and Buy Now buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-auto">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Add to Cart
                </Button>
                <Button
                  className="flex-1"
                  onClick={handleBuyNow}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Buy Now
                </Button>
              </div>
            </div>
          </div>
          
          {/* Reviews Section */}
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <h2 className="text-xl font-medium">Customer Reviews</h2>
              <Button onClick={() => setIsReviewBoxOpen(true)}>
                Write a Review
              </Button>
            </div>
            
            <div className="space-y-6">
              {sampleReviews.map((review) => (
                <div key={review.id} className="bg-white shadow-sm rounded-lg p-4 md:p-6">
                  <div className="flex flex-col sm:flex-row justify-between mb-2 gap-2">
                    <h3 className="font-medium">{review.name}</h3>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                  </div>
                  
                  <div className="flex mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 ${
                          star <= review.rating ? "fill-primary text-primary" : "text-gray-200"
                        }`}
                      />
                    ))}
                  </div>
                  
                  <p className="text-gray-700">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
      
      {/* Review Modal */}
      {isReviewBoxOpen && product && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <ReviewBox
              productId={product.id}
              productName={product.name}
              onClose={() => setIsReviewBoxOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;


import { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface Product {
  id: number;
  name: string;
  category: string;
  gender: "men" | "women" | "unisex";
  price: number;
  image: string;
  colors: string[];
}

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  const { toast } = useToast();
  const [isHovered, setIsHovered] = useState(false);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    onAddToCart(product);
    
    toast({
      title: "Added to cart",
      description: `${product.name} has been added to your cart.`,
      duration: 3000,
    });
  };

  return (
    <div 
      className="group relative block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-50">
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full h-full object-cover object-center transition-transform duration-700 ease-out",
              isHovered && "scale-105"
            )}
          />
          
          {/* Add to cart button */}
          <div 
            className={cn(
              "absolute inset-0 flex items-center justify-center bg-black/5 opacity-0 transition-opacity duration-300",
              isHovered && "opacity-100"
            )}
          >
            <Button 
              variant="secondary" 
              size="sm" 
              className="shadow-md"
              onClick={handleAddToCart}
            >
              <ShoppingCart size={16} className="mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-4">
        <div className="text-xs text-muted-foreground tracking-wide mb-1">
          {product.category}
        </div>
        <Link to={`/product/${product.id}`}>
          <h3 className="font-medium text-base mb-1 tracking-tight hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex justify-between items-center mt-2">
          <span className="font-medium">Rs. {product.price.toFixed(2)}</span>
          
          {/* Color options */}
          <div className="flex items-center space-x-1">
            {product.colors.map((color) => (
              <button
                key={color}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(color);
                }}
                className={cn(
                  "w-4 h-4 rounded-full transition-transform",
                  selectedColor === color && "ring-2 ring-primary ring-offset-2"
                )}
                style={{ backgroundColor: color }}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;

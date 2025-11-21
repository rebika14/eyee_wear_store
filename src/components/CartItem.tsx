
import { useState } from "react";
import { Link } from "react-router-dom";
import { Trash2, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Product } from "./ProductCard";

interface CartItemProps {
  item: Product & { quantity: number };
  onUpdateQuantity: (id: number, quantity: number) => void;
  onRemove: (id: number) => void;
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setQuantity(newQuantity);
    onUpdateQuantity(item.id, newQuantity);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-4 py-4 sm:py-6 border-b last:border-b-0">
      {/* Product image */}
      <div className="flex-shrink-0">
        <Link 
          to={`/product/${item.id}`} 
          className="block w-full sm:w-20 md:w-24 h-20 md:h-24 bg-gray-50 rounded-md overflow-hidden"
        >
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-300"
          />
        </Link>
      </div>
      
      {/* Product info and controls */}
      <div className="flex-1 flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex-1 min-w-0">
          <Link 
            to={`/product/${item.id}`} 
            className="block hover:text-primary transition-colors"
          >
            <h3 className="text-base font-medium truncate">{item.name}</h3>
          </Link>
          <p className="text-sm text-muted-foreground mt-1">{item.category}</p>
          <p className="text-sm mt-2 font-medium">Rs. {item.price.toFixed(2)}</p>
        </div>
        
        {/* Quantity controls and actions */}
        <div className="flex items-center justify-between sm:justify-end gap-4">
          <div className="flex items-center border rounded-md">
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none border-r"
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1}
            >
              <Minus size={14} />
            </Button>
            <span className="w-12 text-center text-sm py-2">{quantity}</span>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 rounded-none border-l"
              onClick={() => handleQuantityChange(quantity + 1)}
            >
              <Plus size={14} />
            </Button>
          </div>
          
          {/* Remove button */}
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(item.id)}
          >
            <Trash2 size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;

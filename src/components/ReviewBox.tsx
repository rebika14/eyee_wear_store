
import { useState } from "react";
import { X } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ReviewBoxProps {
  productId: number;
  productName: string;
  onClose: () => void;
}

const ReviewBox = ({ productId, productName, onClose }: ReviewBoxProps) => {
  const { toast } = useToast();
  const [rating, setRating] = useState<number>(5);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [review, setReview] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically submit the review to your backend
    console.log({
      productId,
      rating,
      name,
      email,
      review
    });
    
    // Show success toast
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
      duration: 3000,
    });
    
    // Close the review box
    onClose();
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4" 
          onClick={onClose}
        >
          <X size={18} />
        </Button>
        <CardTitle className="text-lg md:text-xl">
          Review for {productName}
        </CardTitle>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="rating" className="block mb-2">
              Rating
            </Label>
            <div className="flex space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <Button
                  key={star}
                  type="button"
                  variant="outline"
                  size="sm"
                  className={`${
                    rating >= star ? "bg-primary text-primary-foreground" : ""
                  } h-10 w-10 p-0`}
                  onClick={() => setRating(star)}
                >
                  {star}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Your Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="review">Your Review</Label>
            <Textarea
              id="review"
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Share your thoughts about this product..."
              className="min-h-[120px]"
              required
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button type="submit" className="w-full md:w-auto">
            Submit Review
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default ReviewBox;

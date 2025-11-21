
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import KhaltiCheckout from "@/components/KhaltiCheckout";
import { useOrderCreation } from "@/hooks/useOrderCreation";

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, totalPrice, clearCart } = useCart();
  const { createOrder } = useOrderCreation();
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: ""
  });

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (items.length === 0) {
      navigate("/cart");
      toast({
        title: "Your cart is empty",
        description: "Please add items to your cart before checkout",
      });
    }
  }, [items, navigate, toast]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validate form
    const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'address', 'city'];
    const emptyFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (emptyFields.length > 0) {
      toast({
        title: "Please fill all required fields",
        description: `Missing: ${emptyFields.join(', ')}`,
        variant: "destructive"
      });
      return;
    }

    // Form is valid, proceed to payment
    document.getElementById("payment-section")?.scrollIntoView({ behavior: "smooth" });
  };

  const onPaymentSuccess = async (payload: any) => {
    console.log("Payment Success", payload);
    
    try {
      // Create order in database
      const orderItems = items.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price // No conversion needed, prices are already in Rs.
      }));

      await createOrder({
        customerInfo: {
          name: `${formData.firstName} ${formData.lastName}`,
          email: formData.email,
          phone: formData.phone
        },
        items: orderItems,
        total: totalPrice + 100, // Total in Rs. with shipping
        paymentData: payload
      });

      toast({
        title: "Payment Successful!",
        description: "Your order has been confirmed.",
      });
      
      // Clear cart
      clearCart();
      
      // Navigate to success page will be handled by Khalti redirect
    } catch (error) {
      console.error("Error creating order:", error);
      toast({
        title: "Order Error",
        description: "Payment successful but there was an issue saving your order. Please contact support.",
        variant: "destructive"
      });
    }
  };

  const onPaymentError = (error: any) => {
    console.error("Payment Error", error);
    toast({
      title: "Payment Failed",
      description: "Please try again or use a different payment method",
      variant: "destructive"
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <h1 className="text-2xl md:text-3xl font-medium mb-6 md:mb-8 text-center">Checkout</h1>
          
          <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h2 className="text-lg font-medium mb-4">Shipping Information</h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input 
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input 
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input 
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input 
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address *</Label>
                    <Input 
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="city">City *</Label>
                      <Input 
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        className="w-full"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="postalCode">Postal Code</Label>
                      <Input 
                        id="postalCode"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleInputChange}
                        className="w-full"
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full mt-6">
                    Continue to Payment
                  </Button>
                </form>
              </div>
              
              <div id="payment-section" className="bg-white rounded-lg shadow-sm p-4 md:p-6">
                <h2 className="text-lg font-medium mb-4">Payment Method</h2>
                
                <div className="space-y-6">
                  <KhaltiCheckout 
                    amount={totalPrice + 100} 
                    onSuccess={onPaymentSuccess}
                    onError={onPaymentError}
                    customerInfo={{
                      name: `${formData.firstName} ${formData.lastName}`,
                      email: formData.email,
                      phone: formData.phone
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 sticky top-24">
                <h2 className="text-lg font-medium mb-4">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  {items.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="flex gap-2">
                        <span className="text-muted-foreground">{item.quantity}x</span>
                        <span className="truncate">{item.name}</span>
                      </span>
                      <span className="font-medium">Rs. {(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                  
                  <Separator />
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>Rs. {totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>Rs. 100.00</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-medium text-lg">
                    <span>Total</span>
                    <span>Rs. {(totalPrice + 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Checkout;

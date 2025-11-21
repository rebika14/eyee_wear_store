import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Plus, Trash2, Package, Home, LogOut, Users, ShoppingCart, RefreshCw, Search, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { useRealTimeOrders } from "@/hooks/useRealTimeOrders";
import { useRealTimeCustomers } from "@/hooks/useRealTimeCustomers";
import { useRealTimeProducts } from "@/hooks/useRealTimeProducts";
import { updateOrderStatus } from "@/utils/orderUtils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Custom hook for admin authentication
const useAdminAuth = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  
  useEffect(() => {
    const adminStatus = localStorage.getItem("isAdmin");
    if (adminStatus !== "true") {
      navigate("/admin/login");
    } else {
      setIsAdmin(true);
    }
  }, [navigate]);
  
  return isAdmin;
};

// Types for our database entries
interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

interface Order {
  id: number;
  customer_id: number | null;
  total: number;
  status: string;
  created_at: string;
  customer?: Customer;
}

// This type is for the product data as it comes from the database
type DbProduct = {
  id: number;
  name: string;
  category: string;
  gender: string;
  price: number;
  image: string;
  colors: string[];
  created_at: string;
};

interface OrderItem {
  id: number;
  order_id: number | null;
  product_id: number | null;
  quantity: number;
  price: number;
  product?: DbProduct;
}

const AdminDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isAdmin = useAdminAuth();
  
  // Use real-time hooks
  const { orders, isLoading: ordersLoading, refetch: refetchOrders } = useRealTimeOrders();
  const { customers, isLoading: customersLoading, refetch: refetchCustomers } = useRealTimeCustomers();
  const { products, isLoading: productsLoading, refetch: refetchProducts } = useRealTimeProducts();
  
  // Dashboard state
  const [activeTab, setActiveTab] = useState("products");
  const [isLoading, setIsLoading] = useState(false);
  
  // Product state
  const [productName, setProductName] = useState("");
  const [category, setCategory] = useState("Optical");
  const [gender, setGender] = useState<"men" | "women" | "unisex">("unisex");
  const [price, setPrice] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [colors, setColors] = useState("#000000");
  
  // Edit product state
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editProductName, setEditProductName] = useState("");
  const [editCategory, setEditCategory] = useState("Optical");
  const [editGender, setEditGender] = useState<"men" | "women" | "unisex">("unisex");
  const [editPrice, setEditPrice] = useState("");
  const [editImageUrl, setEditImageUrl] = useState("");
  const [editColors, setEditColors] = useState("#000000");
  
  // Customer state
  const [customerSearch, setCustomerSearch] = useState("");
  
  // Order state
  const [orderDetails, setOrderDetails] = useState<OrderItem[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  
  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Convert database product to app Product type
  const mapDbProductToProduct = (dbProduct: DbProduct): Product => {
    return {
      id: dbProduct.id,
      name: dbProduct.name,
      category: dbProduct.category,
      gender: dbProduct.gender as "men" | "women" | "unisex",
      price: dbProduct.price,
      image: dbProduct.image,
      colors: dbProduct.colors
    };
  };

  // Open edit dialog and populate form
  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setEditProductName(product.name);
    setEditCategory(product.category);
    setEditGender(product.gender);
    setEditPrice(product.price.toString());
    setEditImageUrl(product.image);
    setEditColors(product.colors.join(", "));
    setIsEditDialogOpen(true);
  };

  // Close edit dialog and reset form
  const closeEditDialog = () => {
    setIsEditDialogOpen(false);
    setEditingProduct(null);
    setEditProductName("");
    setEditCategory("Optical");
    setEditGender("unisex");
    setEditPrice("");
    setEditImageUrl("");
    setEditColors("#000000");
  };

  // Handle edit product submission
  const handleEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!editingProduct || !editProductName || !editPrice || !editImageUrl) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editProductName,
          category: editCategory,
          gender: editGender,
          price: parseFloat(editPrice),
          image: editImageUrl,
          colors: editColors.split(",").map(c => c.trim()),
        })
        .eq('id', editingProduct.id);
      
      if (error) throw error;
      
      closeEditDialog();
      
      toast({
        title: "Product updated",
        description: `${editProductName} has been updated successfully.`,
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error updating product:', error);
      toast({
        title: "Error updating product",
        description: error.message || "Failed to update product",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch order details
  const fetchOrderDetails = async (orderId: number) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          *,
          products(*)
        `)
        .eq('order_id', orderId);
      
      if (error) throw error;
      
      if (data && Array.isArray(data)) {
        console.log('Fetched order details:', data);
        const transformedOrderItems = data.map((item: any) => ({
          ...item,
          product: item.products
        })) as OrderItem[];
        setOrderDetails(transformedOrderItems);
      }
    } catch (error: any) {
      console.error('Error fetching order details:', error);
      toast({
        title: "Error fetching order details",
        description: error.message || "Failed to load order details",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // View order details
  const viewOrderDetails = (order: Order) => {
    setSelectedOrder(order);
    fetchOrderDetails(order.id);
    setIsOrderDetailOpen(true);
  };

  // Update order status
  const handleUpdateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast({
        title: "Order status updated",
        description: `Order #${orderId} status changed to ${newStatus}`,
      });
    } catch (error: any) {
      toast({
        title: "Error updating order status",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    localStorage.removeItem("isLoggedIn");
    
    toast({
      title: "Logged out",
      description: "You have been logged out successfully.",
      duration: 3000,
    });
    
    navigate("/");
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!productName || !price || !imageUrl) {
      toast({
        title: "Missing fields",
        description: "Please fill in all required fields.",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: productName,
            category,
            gender,
            price: parseFloat(price),
            image: imageUrl,
            colors: colors.split(",").map(c => c.trim()),
          }
        ])
        .select();
      
      if (error) throw error;
      
      // Reset form
      setProductName("");
      setCategory("Optical");
      setGender("unisex");
      setPrice("");
      setImageUrl("");
      setColors("#000000");
      
      toast({
        title: "Product added",
        description: `${productName} has been added to the store.`,
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error adding product:', error);
      toast({
        title: "Error adding product",
        description: error.message || "Failed to add product",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    setIsLoading(true);
    
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Product deleted",
        description: "The product has been removed from the store.",
        duration: 3000,
      });
    } catch (error: any) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error deleting product",
        description: error.message || "Failed to delete product",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If not admin, don't render anything
  if (!isAdmin) {
    return null;
  }

  // Filter customers based on search
  const filteredCustomers = customerSearch
    ? customers.filter(customer => 
        customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
        customer.email.toLowerCase().includes(customerSearch.toLowerCase()) ||
        (customer.phone && customer.phone.includes(customerSearch))
      )
    : customers;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-64 space-y-2">
              <div className="bg-primary/10 p-4 rounded-lg mb-4">
                <h2 className="font-medium">Admin Dashboard</h2>
                <p className="text-sm text-muted-foreground">Real-time management</p>
              </div>
              
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${activeTab === "dashboard" ? "bg-secondary" : ""}`}
                onClick={() => setActiveTab("dashboard")}
              >
                <Home className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
              
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${activeTab === "products" ? "bg-secondary" : ""}`}
                onClick={() => setActiveTab("products")}
              >
                <Package className="mr-2 h-4 w-4" />
                Products
              </Button>
              
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${activeTab === "orders" ? "bg-secondary" : ""}`}
                onClick={() => setActiveTab("orders")}
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Orders
              </Button>
              
              <Button 
                variant="ghost" 
                className={`w-full justify-start ${activeTab === "customers" ? "bg-secondary" : ""}`}
                onClick={() => setActiveTab("customers")}
              >
                <Users className="mr-2 h-4 w-4" />
                Customers
              </Button>
              
              <Separator className="my-4" />
              
              <Button variant="ghost" className="w-full justify-start text-red-500" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
              </Button>
            </div>
            
            {/* Main content */}
            <div className="flex-1">
              {/* Dashboard Overview */}
              {activeTab === "dashboard" && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-medium">Dashboard Overview</h1>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live Updates Active
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                        <CardDescription>Store inventory</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{products.length}</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 text-xs" 
                          onClick={() => setActiveTab("products")}
                        >
                          View all products
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <CardDescription>Real-time orders</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{orders.length}</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 text-xs" 
                          onClick={() => setActiveTab("orders")}
                        >
                          View all orders
                        </Button>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium">Total Customers</CardTitle>
                        <CardDescription>Live customer count</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{customers.length}</div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="mt-2 text-xs" 
                          onClick={() => setActiveTab("customers")}
                        >
                          View all customers
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Latest orders with real-time updates</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {orders.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Order ID</TableHead>
                              <TableHead>Customer</TableHead>
                              <TableHead>Date</TableHead>
                              <TableHead>Status</TableHead>
                              <TableHead>Total</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {orders.slice(0, 5).map((order) => (
                              <TableRow key={order.id}>
                                <TableCell>#{order.id}</TableCell>
                                <TableCell>{order.customer?.name || 'Unknown'}</TableCell>
                                <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                                <TableCell>
                                  <Select
                                    value={order.status}
                                    onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                                  >
                                    <SelectTrigger className="w-32">
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="pending">Pending</SelectItem>
                                      <SelectItem value="processing">Processing</SelectItem>
                                      <SelectItem value="completed">Completed</SelectItem>
                                      <SelectItem value="cancelled">Cancelled</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </TableCell>
                                <TableCell>Rs. {order.total.toFixed(2)}</TableCell>
                                <TableCell>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => viewOrderDetails(order)}
                                  >
                                    View Details
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-4 text-muted-foreground">
                          <p>No orders found.</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
              
              {/* Product Management */}
              {activeTab === "products" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-medium">Product Management</h1>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Real-time sync
                    </div>
                  </div>
                  
                  <Tabs defaultValue="products">
                    <TabsList className="mb-6">
                      <TabsTrigger value="products">All Products</TabsTrigger>
                      <TabsTrigger value="add">Add Product</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="products" className="space-y-6">
                      <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-medium">Products ({products.length})</h2>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={refetchProducts}
                          disabled={productsLoading}
                        >
                          <RefreshCw size={16} className={`mr-2 ${productsLoading ? 'animate-spin' : ''}`} />
                          Refresh
                        </Button>
                      </div>
                      
                      {products.length > 0 ? (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Image</TableHead>
                              <TableHead>Name</TableHead>
                              <TableHead>Category</TableHead>
                              <TableHead>Gender</TableHead>
                              <TableHead>Price</TableHead>
                              <TableHead>Actions</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {products.map((product) => (
                              <TableRow key={product.id}>
                                <TableCell>
                                  <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                                    <img 
                                      src={product.image} 
                                      alt={product.name} 
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                </TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.category}</TableCell>
                                <TableCell className="capitalize">{product.gender}</TableCell>
                                <TableCell>Rs. {product.price.toFixed(2)}</TableCell>
                                <TableCell>
                                  <div className="flex items-center gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      onClick={() => openEditDialog(product)}
                                      disabled={isLoading}
                                    >
                                      <Edit size={16} />
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-500"
                                      onClick={() => handleDeleteProduct(product.id)}
                                      disabled={isLoading}
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      ) : (
                        <div className="text-center py-8 text-muted-foreground">
                          <p>No products found. Add your first product!</p>
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="add">
                      <div className="bg-white rounded-lg shadow-sm p-6">
                        <h2 className="text-lg font-medium mb-4">Add New Product</h2>
                        
                        <form onSubmit={handleAddProduct}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="productName">Product Name *</Label>
                              <Input
                                id="productName"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                placeholder="Classic Round"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="category">Category *</Label>
                              <Select value={category} onValueChange={setCategory}>
                                <SelectTrigger id="category">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="Optical">Optical</SelectItem>
                                  <SelectItem value="Sunglasses">Sunglasses</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="gender">Gender *</Label>
                              <Select 
                                value={gender} 
                                onValueChange={(value: "men" | "women" | "unisex") => setGender(value)}
                              >
                                <SelectTrigger id="gender">
                                  <SelectValue placeholder="Select gender" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="men">Men</SelectItem>
                                  <SelectItem value="women">Women</SelectItem>
                                  <SelectItem value="unisex">Unisex</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="price">Price (Rs.) *</Label>
                              <Input
                                id="price"
                                type="number"
                                step="0.01"
                                min="0"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                placeholder="1499.99"
                                required
                              />
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="imageUrl">Image URL *</Label>
                              <Input
                                id="imageUrl"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                                placeholder="https://example.com/image.jpg"
                                required
                              />
                              <p className="text-xs text-muted-foreground">
                                Enter a URL for the product image
                              </p>
                            </div>
                            
                            <div className="space-y-2 md:col-span-2">
                              <Label htmlFor="colors">Colors (Hex codes, comma-separated) *</Label>
                              <Input
                                id="colors"
                                value={colors}
                                onChange={(e) => setColors(e.target.value)}
                                placeholder="#000000, #ff0000, #0000ff"
                                required
                              />
                              <div className="flex items-center gap-2 mt-2">
                                {colors.split(",").map((color, index) => (
                                  <div
                                    key={index}
                                    className="w-6 h-6 rounded-full"
                                    style={{ backgroundColor: color.trim() }}
                                  />
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="mt-8">
                            <Button 
                              type="submit" 
                              className="w-full sm:w-auto"
                              disabled={isLoading}
                            >
                              {isLoading ? (
                                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                              ) : (
                                <Plus className="mr-2 h-4 w-4" />
                              )}
                              Add Product
                            </Button>
                          </div>
                        </form>
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>
              )}
              
              {/* Customer Management */}
              {activeTab === "customers" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-medium">Customer Management</h1>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Real-time updates
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center mb-6">
                    <div className="relative max-w-md">
                      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search customers..."
                        className="pl-8"
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                      />
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={refetchCustomers}
                      disabled={customersLoading}
                    >
                      <RefreshCw size={16} className={`mr-2 ${customersLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                  
                  {customers.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredCustomers.map((customer) => (
                          <TableRow key={customer.id}>
                            <TableCell>{customer.name}</TableCell>
                            <TableCell>{customer.email}</TableCell>
                            <TableCell>{customer.phone || 'N/A'}</TableCell>
                            <TableCell>{new Date(customer.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No customers found.</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Order Management */}
              {activeTab === "orders" && (
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-medium">Order Management</h1>
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      Live order tracking
                    </div>
                  </div>
                  
                  <div className="flex justify-end mb-6">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={refetchOrders}
                      disabled={ordersLoading}
                    >
                      <RefreshCw size={16} className={`mr-2 ${ordersLoading ? 'animate-spin' : ''}`} />
                      Refresh
                    </Button>
                  </div>
                  
                  {orders.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Order ID</TableHead>
                          <TableHead>Customer</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Total</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {orders.map((order) => (
                          <TableRow key={order.id}>
                            <TableCell>#{order.id}</TableCell>
                            <TableCell>{order.customer?.name || 'Unknown'}</TableCell>
                            <TableCell>{new Date(order.created_at).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Select
                                value={order.status}
                                onValueChange={(value) => handleUpdateOrderStatus(order.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="pending">Pending</SelectItem>
                                  <SelectItem value="processing">Processing</SelectItem>
                                  <SelectItem value="completed">Completed</SelectItem>
                                  <SelectItem value="cancelled">Cancelled</SelectItem>
                                </SelectContent>
                              </Select>
                            </TableCell>
                            <TableCell>Rs. {order.total.toFixed(2)}</TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => viewOrderDetails(order)}
                              >
                                View Details
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      <p>No orders found.</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>
              Update the product details below.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleEditProduct}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
              <div className="space-y-2">
                <Label htmlFor="editProductName">Product Name *</Label>
                <Input
                  id="editProductName"
                  value={editProductName}
                  onChange={(e) => setEditProductName(e.target.value)}
                  placeholder="Classic Round"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editCategory">Category *</Label>
                <Select value={editCategory} onValueChange={setEditCategory}>
                  <SelectTrigger id="editCategory">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Optical">Optical</SelectItem>
                    <SelectItem value="Sunglasses">Sunglasses</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editGender">Gender *</Label>
                <Select 
                  value={editGender} 
                  onValueChange={(value: "men" | "women" | "unisex") => setEditGender(value)}
                >
                  <SelectTrigger id="editGender">
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="men">Men</SelectItem>
                    <SelectItem value="women">Women</SelectItem>
                    <SelectItem value="unisex">Unisex</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="editPrice">Price (Rs.) *</Label>
                <Input
                  id="editPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  value={editPrice}
                  onChange={(e) => setEditPrice(e.target.value)}
                  placeholder="1499.99"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="editImageUrl">Image URL *</Label>
                <Input
                  id="editImageUrl"
                  value={editImageUrl}
                  onChange={(e) => setEditImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  required
                />
              </div>
              
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="editColors">Colors (Hex codes, comma-separated) *</Label>
                <Input
                  id="editColors"
                  value={editColors}
                  onChange={(e) => setEditColors(e.target.value)}
                  placeholder="#000000, #ff0000, #0000ff"
                  required
                />
                <div className="flex items-center gap-2 mt-2">
                  {editColors.split(",").map((color, index) => (
                    <div
                      key={index}
                      className="w-6 h-6 rounded-full"
                      style={{ backgroundColor: color.trim() }}
                    />
                  ))}
                </div>
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeEditDialog}>
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : null}
                Update Product
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailOpen} onOpenChange={setIsOrderDetailOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order #{selectedOrder?.id} Details</DialogTitle>
            <DialogDescription>
              {selectedOrder?.customer?.name} - {new Date(selectedOrder?.created_at || '').toLocaleDateString()}
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4">
            <div className="bg-muted/40 p-4 rounded-md mb-4">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Status:</span>
                <Select
                  value={selectedOrder?.status}
                  onValueChange={(value) => selectedOrder && handleUpdateOrderStatus(selectedOrder.id, value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="processing">Processing</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Total Amount:</span>
                <span>Rs. {selectedOrder ? selectedOrder.total.toFixed(2) : '0.00'}</span>
              </div>
            </div>
            
            <h4 className="font-medium mb-2">Items</h4>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderDetails.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {item.product?.image && (
                          <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden">
                            <img 
                              src={item.product.image} 
                              alt={item.product?.name || ''} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <span>{item.product?.name || 'Unknown Product'}</span>
                      </div>
                    </TableCell>
                    <TableCell>Rs. {item.price.toFixed(2)}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>Rs. {(item.price * item.quantity).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setIsOrderDetailOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default AdminDashboard;

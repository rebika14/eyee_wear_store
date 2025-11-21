
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/components/ProductCard';

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

export const useRealTimeProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  // Fetch initial products
  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const mappedProducts = data.map((product: any) => mapDbProductToProduct(product as DbProduct));
        setProducts(mappedProducts);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchProducts();

    // Set up real-time subscription
    const channel = supabase
      .channel('public:products')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products'
        },
        (payload) => {
          console.log('Products real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newProduct = mapDbProductToProduct(payload.new as DbProduct);
            setProducts(prev => [newProduct, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedProduct = mapDbProductToProduct(payload.new as DbProduct);
            setProducts(prev => 
              prev.map(product => 
                product.id === updatedProduct.id ? updatedProduct : product
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedProduct = payload.old as DbProduct;
            setProducts(prev => 
              prev.filter(product => product.id !== deletedProduct.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { products, isLoading, refetch: fetchProducts };
};

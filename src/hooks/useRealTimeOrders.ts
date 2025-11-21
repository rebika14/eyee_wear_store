
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useRealTimeOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial orders
  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          customers(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        const transformedOrders = data.map((order: any) => ({
          ...order,
          customer: order.customers
        })) as Order[];
        setOrders(transformedOrders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchOrders();

    // Set up real-time subscription for orders
    const ordersChannel = supabase
      .channel('public:orders')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders'
        },
        (payload) => {
          console.log('Orders real-time update:', payload);
          // Refetch orders to get complete data with relationships
          fetchOrders();
        }
      )
      .subscribe();

    // Set up real-time subscription for customers (affects order display)
    const customersChannel = supabase
      .channel('public:customers')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers'
        },
        (payload) => {
          console.log('Customers real-time update affecting orders:', payload);
          // Refetch orders to get updated customer data
          fetchOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(ordersChannel);
      supabase.removeChannel(customersChannel);
    };
  }, []);

  return { orders, isLoading, refetch: fetchOrders };
};

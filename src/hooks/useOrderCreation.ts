
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface OrderItem {
  product_id: number;
  quantity: number;
  price: number;
}

interface CreateOrderParams {
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  items: OrderItem[];
  total: number;
  paymentData?: any;
}

export const useOrderCreation = () => {
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const createOrder = async ({ customerInfo, items, total, paymentData }: CreateOrderParams) => {
    setIsCreating(true);
    try {
      // First, create or get customer
      let { data: existingCustomer } = await supabase
        .from('customers')
        .select('id')
        .eq('email', customerInfo.email)
        .single();

      let customerId;

      if (existingCustomer) {
        customerId = existingCustomer.id;
      } else {
        const { data: newCustomer, error: customerError } = await supabase
          .from('customers')
          .insert({
            name: customerInfo.name,
            email: customerInfo.email,
            phone: customerInfo.phone
          })
          .select('id')
          .single();

        if (customerError) throw customerError;
        customerId = newCustomer.id;
      }

      // Create the order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          customer_id: customerId,
          total: total,
          status: paymentData ? 'completed' : 'pending'
        })
        .select('id')
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = items.map(item => ({
        order_id: order.id,
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      console.log('Order created successfully:', order.id);
      
      toast({
        title: "Order Created",
        description: `Order #${order.id} has been created successfully.`,
      });

      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      toast({
        title: "Order Creation Failed",
        description: "There was an error creating your order. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  return { createOrder, isCreating };
};

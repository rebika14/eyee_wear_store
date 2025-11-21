
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/components/ProductCard';

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor: string;
}

export interface CustomerInfo {
  name: string;
  email: string;
  phone: string;
}

export const createOrder = async (
  customerInfo: CustomerInfo,
  cartItems: CartItem[],
  total: number
) => {
  try {
    console.log('Creating order for:', customerInfo);
    
    // First, create or get the customer
    let customer;
    
    // Check if customer already exists
    const { data: existingCustomer } = await supabase
      .from('customers')
      .select('*')
      .eq('email', customerInfo.email)
      .single();

    if (existingCustomer) {
      customer = existingCustomer;
      console.log('Found existing customer:', customer);
    } else {
      // Create new customer
      const { data: newCustomer, error: customerError } = await supabase
        .from('customers')
        .insert([{
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone
        }])
        .select()
        .single();

      if (customerError) {
        console.error('Error creating customer:', customerError);
        throw customerError;
      }
      customer = newCustomer;
      console.log('Created new customer:', customer);
    }

    // Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert([{
        customer_id: customer.id,
        total: total,
        status: 'pending'
      }])
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      throw orderError;
    }

    console.log('Created order:', order);

    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product.id,
      quantity: item.quantity,
      price: item.product.price
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      throw itemsError;
    }

    console.log('Created order items for order:', order.id);

    // Broadcast real-time update for new order
    const channel = supabase.channel('order-updates');
    channel.send({
      type: 'broadcast',
      event: 'new_order',
      payload: { order, customer }
    });

    return { order, customer };
  } catch (error) {
    console.error('Error in createOrder:', error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: number, status: string) => {
  try {
    console.log('Updating order status:', orderId, status);
    
    const { data, error } = await supabase
      .from('orders')
      .update({ status })
      .eq('id', orderId)
      .select(`
        *,
        customers(*)
      `)
      .single();

    if (error) {
      console.error('Error updating order status:', error);
      throw error;
    }

    console.log('Order status updated:', data);

    // Broadcast real-time update for status change
    const channel = supabase.channel('order-updates');
    channel.send({
      type: 'broadcast',
      event: 'order_status_update',
      payload: { order: data }
    });

    return data;
  } catch (error) {
    console.error('Error updating order status:', error);
    throw error;
  }
};

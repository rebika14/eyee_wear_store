
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
}

export const useRealTimeCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch initial customers
  const fetchCustomers = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      if (data) {
        setCustomers(data as Customer[]);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Fetch initial data
    fetchCustomers();

    // Set up real-time subscription
    const channel = supabase
      .channel('public:customers')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'customers'
        },
        (payload) => {
          console.log('Customers real-time update:', payload);
          
          if (payload.eventType === 'INSERT') {
            const newCustomer = payload.new as Customer;
            setCustomers(prev => [newCustomer, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            const updatedCustomer = payload.new as Customer;
            setCustomers(prev => 
              prev.map(customer => 
                customer.id === updatedCustomer.id ? updatedCustomer : customer
              )
            );
          } else if (payload.eventType === 'DELETE') {
            const deletedCustomer = payload.old as Customer;
            setCustomers(prev => 
              prev.filter(customer => customer.id !== deletedCustomer.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { customers, isLoading, refetch: fetchCustomers };
};

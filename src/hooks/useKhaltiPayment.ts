
import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { createKhaltiPayload } from "@/utils/khaltiConfig";
import { supabase } from "@/integrations/supabase/client";

interface UseKhaltiPaymentProps {
  onSuccess: (payload: any) => void;
  onError: (error: any) => void;
}

export const useKhaltiPayment = ({ onSuccess, onError }: UseKhaltiPaymentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const initiatePayment = useCallback(async (
    amount: number,
    customerInfo: { name: string; email: string; phone: string },
    productName = "Eyewear Order"
  ) => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      toast({
        title: "Missing Information",
        description: "Please fill all required customer details",
        variant: "destructive"
      });
      return false;
    }

    try {
      setIsLoading(true);
      
      const payload = createKhaltiPayload(amount, customerInfo, productName);
      
      console.log("Initiating Khalti payment with payload:", payload);

      const { data, error } = await supabase.functions.invoke('khalti-payment', {
        body: {
          action: 'initiate',
          ...payload
        }
      });

      console.log("Supabase function response:", { data, error });

      if (error) {
        console.error("Supabase function error:", error);
        throw new Error(`Payment initiation failed: ${error.message}`);
      }

      if (data.error) {
        console.error("Khalti API error:", data.error);
        throw new Error(data.error);
      }
      
      if (data.payment_url) {
        // Store transaction details in localStorage for verification after return
        localStorage.setItem('khalti_transaction', JSON.stringify({
          pidx: data.pidx,
          amount: amount,
          customerInfo: customerInfo,
          timestamp: Date.now()
        }));
        
        toast({
          title: "Redirecting to Payment",
          description: "You will be redirected to Khalti payment gateway...",
        });
        
        // Redirect to Khalti payment page
        window.location.href = data.payment_url;
        return true;
      } else {
        throw new Error('No payment URL received from Khalti');
      }
    } catch (error) {
      setIsLoading(false);
      console.error("Error initiating Khalti payment:", error);
      toast({
        title: "Payment Error",
        description: error instanceof Error ? error.message : "Failed to initialize payment. Please try again.",
        variant: "destructive"
      });
      onError(error);
      return false;
    }
  }, [onSuccess, onError, toast]);

  const verifyPayment = useCallback(async (pidx: string) => {
    try {
      console.log("Verifying payment with pidx:", pidx);
      
      const { data, error } = await supabase.functions.invoke('khalti-payment', {
        body: {
          action: 'verify',
          pidx: pidx
        }
      });

      console.log("Payment verification response:", { data, error });

      if (error) {
        console.error("Supabase function error during verification:", error);
        throw new Error(`Payment verification failed: ${error.message}`);
      }

      if (data.error) {
        console.error("Khalti verification error:", data.error);
        throw new Error(data.error);
      }

      return data;
    } catch (error) {
      console.error("Error verifying Khalti payment:", error);
      throw error;
    }
  }, []);

  return {
    initiatePayment,
    verifyPayment,
    isLoading
  };
};

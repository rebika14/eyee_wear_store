
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useKhaltiPayment } from "@/hooks/useKhaltiPayment";
import { CreditCard, Shield, Clock, ExternalLink } from "lucide-react";

interface KhaltiCheckoutProps {
  amount: number;
  customerInfo: {
    name: string;
    email: string;
    phone: string;
  };
  onSuccess: (payload: any) => void;
  onError: (error: any) => void;
}

const KhaltiCheckout = ({ amount, customerInfo, onSuccess, onError }: KhaltiCheckoutProps) => {
  const { toast } = useToast();

  const handlePaymentSuccess = (payload: any) => {
    toast({
      title: "Payment Successful!",
      description: `Transaction completed successfully.`,
    });
    onSuccess(payload);
  };

  const handlePaymentError = (error: any) => {
    console.error("Payment error in component:", error);
    toast({
      title: "Payment Failed",
      description: "Your payment could not be processed. Please try again.",
      variant: "destructive"
    });
    onError(error);
  };

  const { initiatePayment, isLoading } = useKhaltiPayment({
    onSuccess: handlePaymentSuccess,
    onError: handlePaymentError
  });

  const handlePayment = async () => {
    console.log("Starting payment process with:", { amount, customerInfo });
    await initiatePayment(amount, customerInfo);
  };

  const isFormValid = customerInfo.name && customerInfo.email && customerInfo.phone;

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-600 rounded-full p-2">
            <CreditCard className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-semibold text-purple-900">Khalti Payment Gateway</h3>
          <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">TEST MODE</span>
        </div>
        
        <p className="text-purple-700 mb-4">
          Pay securely using Khalti - Nepal's leading digital wallet and payment gateway.
          You will be redirected to Khalti's secure payment page.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <Shield className="h-4 w-4" />
            <span>Bank Grade Security</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <Clock className="h-4 w-4" />
            <span>Instant Processing</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-purple-600">
            <ExternalLink className="h-4 w-4" />
            <span>Secure Redirect</span>
          </div>
        </div>

        <div className="bg-white rounded-lg p-4 border border-purple-100 mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Amount to Pay:</span>
            <span className="text-xl font-bold text-purple-900">रू {amount.toFixed(2)}</span>
          </div>
          <div className="text-sm text-gray-500">
            Supports: Khalti Wallet, Banking, Mobile Banking, Connect IPS
          </div>
        </div>

        {!isFormValid && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-yellow-800 text-sm">
              Please fill in all customer details above before proceeding with payment.
            </p>
          </div>
        )}

        <Button
          onClick={handlePayment}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 text-base"
          disabled={isLoading || !isFormValid}
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
              Redirecting to Khalti...
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span>Pay with Khalti</span>
              <ExternalLink className="h-4 w-4" />
            </div>
          )}
        </Button>

        <div className="mt-4 text-xs text-gray-500 text-center">
          <p>
            <strong>Test Mode:</strong> This is a test transaction. No real money will be charged.
            Use test credentials provided by Khalti for testing.
          </p>
        </div>
      </div>
    </div>
  );
};

export default KhaltiCheckout;

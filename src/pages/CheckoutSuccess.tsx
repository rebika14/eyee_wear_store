
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useKhaltiPayment } from "@/hooks/useKhaltiPayment";
import { useCart } from "@/contexts/CartContext";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const CheckoutSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const [verificationStatus, setVerificationStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [transactionData, setTransactionData] = useState<any>(null);

  const { verifyPayment } = useKhaltiPayment({
    onSuccess: () => {},
    onError: () => {}
  });

  useEffect(() => {
    const verifyTransaction = async () => {
      const pidx = searchParams.get('pidx');
      const status = searchParams.get('status');
      const transactionId = searchParams.get('transaction_id');
      const tidx = searchParams.get('tidx');
      const amount = searchParams.get('amount');
      const mobile = searchParams.get('mobile');

      console.log("Payment callback params:", { pidx, status, transactionId, tidx, amount, mobile });

      if (!pidx) {
        setVerificationStatus('error');
        toast({
          title: "Payment Error",
          description: "Invalid payment response. Missing transaction ID.",
          variant: "destructive"
        });
        return;
      }

      try {
        // Verify payment with Khalti
        const verificationResult = await verifyPayment(pidx);
        console.log("Payment verification result:", verificationResult);

        if (verificationResult.status === 'Completed') {
          setVerificationStatus('success');
          setTransactionData({
            pidx,
            status,
            transactionId,
            tidx,
            amount: verificationResult.total_amount,
            mobile
          });

          // Clear the stored transaction data
          localStorage.removeItem('khalti_transaction');
          
          // Clear cart after successful payment
          clearCart();

          toast({
            title: "Payment Successful!",
            description: `Your payment has been processed successfully.`,
          });
        } else {
          throw new Error(`Payment verification failed. Status: ${verificationResult.status}`);
        }
      } catch (error) {
        console.error("Payment verification error:", error);
        setVerificationStatus('error');
        toast({
          title: "Payment Verification Failed",
          description: "Could not verify your payment. Please contact support.",
          variant: "destructive"
        });
      }
    };

    verifyTransaction();
  }, [searchParams, verifyPayment, toast, clearCart]);

  const handleContinue = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-20">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-md mx-auto">
            <Card>
              <CardHeader className="text-center">
                {verificationStatus === 'loading' && (
                  <>
                    <Loader2 className="h-16 w-16 mx-auto text-blue-500 animate-spin mb-4" />
                    <CardTitle>Verifying Payment</CardTitle>
                    <CardDescription>
                      Please wait while we verify your payment...
                    </CardDescription>
                  </>
                )}
                
                {verificationStatus === 'success' && (
                  <>
                    <CheckCircle className="h-16 w-16 mx-auto text-green-500 mb-4" />
                    <CardTitle className="text-green-700">Payment Successful!</CardTitle>
                    <CardDescription>
                      Your order has been confirmed and payment processed successfully.
                    </CardDescription>
                  </>
                )}
                
                {verificationStatus === 'error' && (
                  <>
                    <XCircle className="h-16 w-16 mx-auto text-red-500 mb-4" />
                    <CardTitle className="text-red-700">Payment Failed</CardTitle>
                    <CardDescription>
                      There was an issue processing your payment. Please try again or contact support.
                    </CardDescription>
                  </>
                )}
              </CardHeader>

              {verificationStatus === 'success' && transactionData && (
                <CardContent className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                    <h3 className="font-medium text-gray-900">Transaction Details</h3>
                    <div className="text-sm text-gray-600 space-y-1">
                      {transactionData.transactionId && (
                        <p><span className="font-medium">Transaction ID:</span> {transactionData.transactionId}</p>
                      )}
                      <p><span className="font-medium">Amount:</span> Rs. {(transactionData.amount / 100).toFixed(2)}</p>
                      <p><span className="font-medium">Payment ID:</span> {transactionData.pidx}</p>
                      {transactionData.mobile && (
                        <p><span className="font-medium">Mobile:</span> {transactionData.mobile}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              )}

              <CardContent>
                <Button 
                  onClick={handleContinue} 
                  className="w-full"
                  disabled={verificationStatus === 'loading'}
                >
                  {verificationStatus === 'success' ? 'Continue Shopping' : 'Back to Home'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutSuccess;

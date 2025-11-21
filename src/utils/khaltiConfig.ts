
export const createKhaltiPayload = (
  amount: number,
  customerInfo: { name: string; email: string; phone: string },
  productName = "Eyewear Order"
) => {
  // Convert amount to paisa (multiply by 100) for Khalti
  const amountInPaisa = Math.round(amount * 100);
  
  // Generate unique purchase order ID
  const purchaseOrderId = `eyewear-order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    return_url: `${window.location.origin}/checkout/success`,
    website_url: window.location.origin,
    amount: amountInPaisa,
    purchase_order_id: purchaseOrderId,
    purchase_order_name: productName,
    customer_info: {
      name: customerInfo.name,
      email: customerInfo.email,
      phone: customerInfo.phone
    }
  };
};

export const KHALTI_CONFIG = {
  publicKey: "test_public_key_dc74e0fd57cb46cd93832aee0a390234",
  productionUrl: "https://khalti.com/payment/confirmation/",
  testUrl: "https://test-pay.khalti.com/payment/confirmation/"
};

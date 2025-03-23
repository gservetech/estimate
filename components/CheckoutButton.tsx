"use client";

import { Button } from "@/components/ui/button";
import useCartStore from "@/store";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import toast from "react-hot-toast";

interface ShippingData {
  street: string;
  city: string;
  provinceId: number;
  provinceName: string;
  postalCode: string;
  countryId: number;
  countryName: string;
}

interface CheckoutButtonProps {
  shippingData: ShippingData;
  totalAmount: number;
  currency: string;
}

export default function CheckoutButton({
  shippingData,
  totalAmount,
  currency,
}: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const { userId } = useAuth();
  const { getGroupedItems } = useCartStore();

  const handleCheckout = async () => {
    if (!userId) {
      toast.error("Please login to continue");
      return;
    }

    setLoading(true);
    try {
      console.log("Starting checkout process...");
      const cartItems = getGroupedItems();

      const orderData = {
        clerkId: userId,
        totalPrice: totalAmount,
        currencyCode: currency,
        amountDiscount: 0,
        orderStatusId: 1,
        trackingNumber: `TRK-${Date.now()}`,
        deliveryDate: new Date(
          Date.now() + 3 * 24 * 60 * 60 * 1000
        ).toISOString(),
        ...shippingData,
        products: cartItems.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity,
          unitPrice: item.product.price,
        })),
      };

      console.log("Initiating PayPal order with data:", orderData);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/paypal/init`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const data = await response.json();
      console.log("PayPal init response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      // Store order information
      const orderNumber = data.order.orderNumber;
      const paypalToken = data.paypal.id; // or wherever the token is in the response

      console.log("Storing order info:", { orderNumber, paypalToken });

      sessionStorage.setItem("pendingOrderNumber", orderNumber);
      sessionStorage.setItem("paypalToken", paypalToken);

      // Find the PayPal approval URL
      const approvalUrl = data.paypal.links.find(
        (link: { rel: string }) => link.rel === "approve"
      )?.href;

      if (!approvalUrl) {
        throw new Error("PayPal approval URL not found");
      }

      // Construct the return URL with all necessary parameters
      const returnUrl = new URL("/success", window.location.origin);
      returnUrl.searchParams.set("orderNumber", orderNumber);
      returnUrl.searchParams.set("token", paypalToken);

      // Add return URL to PayPal URL
      const finalUrl = new URL(approvalUrl);
      finalUrl.searchParams.set("returnUrl", returnUrl.toString());

      console.log("Redirecting to PayPal URL:", finalUrl.toString());

      // Redirect to PayPal
      window.location.href = finalUrl.toString();
    } catch (error) {
      console.error("Checkout error:", error);
      toast.error("Failed to process checkout");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      onClick={handleCheckout}
      disabled={loading}
      className="w-full"
      size="lg"
    >
      {loading ? "Processing..." : "Pay with PayPal"}
    </Button>
  );
}

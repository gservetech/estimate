"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import useOrderStore from "@/store/orderStore";
import useCartStore from "@/store";
import { getClientOrders } from "@/lib/getClientOrders";

interface PayPalButtonProps {
  amount: string;
}

export function PayPalButton({ amount }: PayPalButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const { userId } = useAuth();
  const { setOrders } = useOrderStore();
  const { resetCart } = useCartStore();

  const createOrder = async (): Promise<string> => {
    if (!userId) {
      throw new Error("User must be logged in to create order");
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/paypal/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ amount, userId }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create order");
      }

      return data.orderID;
    } catch (error) {
      console.error("Create order error:", error);
      setMessage("Failed to create order");
      throw error;
    }
  };

  const onApprove = async (data: { orderID: string }) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/paypal/orders/${data.orderID}`,
        {
          method: "POST",
        }
      );

      const captureData = await response.json();

      console.log("Capture data:", captureData);

      if (!response.ok) {
        throw new Error(captureData.error || "Payment capture failed");
      }

      if (captureData.status === "COMPLETED") {
        // After successful payment, fetch the updated orders list
        if (userId) {
          try {
            const { orders, error } = await getClientOrders(userId);
            if (!error && orders.length > 0) {
              // Update the orders in the store
              setOrders(orders);
            } else if (error) {
              console.error("Error fetching updated orders:", error);
            }
          } catch (error) {
            console.error("Error fetching updated orders:", error);
          }
        }

        // Reset the cart after successful order
        resetCart();

        router.push(`/success?orderId=${data.orderID}`);
        toast.success("Payment successful");
      }
    } catch (error) {
      console.error("Capture order error:", error);
      toast.error("Payment failed");
      setMessage("Payment failed");
    }
  };

  if (!userId) {
    return <div>Please log in to make a purchase</div>;
  }

  return (
    <div className="paypal-container">
      {isPending && <div>Loading PayPal...</div>}
      {message && <div className="error">{message}</div>}
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </div>
  );
}

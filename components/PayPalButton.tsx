"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import useOrderStore from "@/store/orderStore";
import useCartStore from "@/store";
import { getClientOrders } from "@/lib/getClientOrders";
import useLocationStore from "@/store/locationStore";

interface PayPalButtonProps {
  amount: string;
}

export function PayPalButton({ amount }: PayPalButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const { userId } = useAuth();
  const { setOrders, setUserId } = useOrderStore();
  const { resetCart } = useCartStore();
  const { country } = useLocationStore();

  const currency = country === "CA" ? "CAD" : "USD";

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
          body: JSON.stringify({ amount, userId, currency }),
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
      // Get cart items before making the request
      const cartItems = useCartStore.getState().getGroupedItems();

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/paypal/orders/${data.orderID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ cartItems }),
        }
      );

      const captureData = await response.json();

      if (!response.ok) {
        throw new Error(captureData.error || "Payment capture failed");
      }

      // Clear the cart after successful order
      // useCartStore.getState().resetCart();

      if (captureData.status === "COMPLETED") {
        if (userId) {
          try {
            setUserId(userId);
            const { orders, error } = await getClientOrders(userId);
            if (!error && orders.length > 0) {
              setOrders(orders);
              setTimeout(() => {
                router.push(`/success?orderNumber=${captureData.orderNumber}`);
                toast.success("Payment successful");
                resetCart();
              }, 100);
            } else if (error) {
              router.push(`/success?orderNumber=${captureData.orderNumber}`);
              toast.success("Payment successful");
              resetCart();
            }
          } catch (error) {
            router.push(`/success?orderNumber=${captureData.orderNumber}`);
            toast.success("Payment successful");
            console.error("Error fetching orders:", error);
            resetCart();
          }
        } else {
          router.push(`/success?orderNumber=${captureData.orderNumber}`);
          toast.success("Payment successful");
          resetCart();
        }
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

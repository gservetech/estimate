"use client";

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
// import { Order } from "@/types/order.types";
import { useAuth } from "@clerk/nextjs";

interface PayPalButtonProps {
  amount: string;
  // currency: string;
}

export function PayPalButton({ amount }: PayPalButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer();
  const [message, setMessage] = useState<string>("");
  const router = useRouter();
  const { userId } = useAuth();

  const createOrder = async (): Promise<string> => {
    try {
      const response = await fetch("/api/paypal/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount, userId }),
      });

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
      const response = await fetch(`/api/paypal/orders/${data.orderID}`, {
        method: "POST",
      });

      const captureData = await response.json();

      console.log("Capture data:", captureData);

      if (captureData.status === "COMPLETED") {
        const orderNumber = crypto.randomUUID();

        // TODO: Call the api to create an order in the database
        // Shipping address of the user, userId, orderNumber, and the products in the cart, total amount
        // const order: Order = {
        //     merchantCheckoutSessionId: ,
        //     orderNumber,
        //     totalPrice: Number(amount),
        //     status: 'COMPLETED',
        //     userId: 'user_id',
        //     products: [
        //         {
        //             id: 'product_id',
        //             name: 'product_name',
        //             price: 'product_price',
        //             quantity: 1,
        //         },
        //     ],
        // }

        router.push(
          `/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${orderNumber}`
        );
        toast.success("Payment successful");
      }
    } catch (error) {
      console.error("Capture order error:", error);
      setMessage("Payment failed");
    }
  };

  return (
    <div className="paypal-container">
      {isPending && <div>Loading PayPal...</div>}
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={createOrder}
        onApprove={onApprove}
      />
      {message && <div className="message">{message}</div>}
    </div>
  );
}

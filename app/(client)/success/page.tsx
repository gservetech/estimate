"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useCartStore from "@/store";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetCart } = useCartStore();

  useEffect(() => {
    const token = searchParams.get("token");
    const orderNumber = sessionStorage.getItem("pendingOrderNumber");

    if (!token || !orderNumber) {
      router.push("/");
      return;
    }

    const completeOrder = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/paypal/complete`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              token,
              orderNumber,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to complete order");
        }

        // Clear cart
        resetCart();
        sessionStorage.removeItem("pendingOrderNumber");

        toast.success("Payment completed successfully");
        router.push(`/orders/${orderNumber}`);
      } catch (error) {
        console.error("Error completing order:", error);
        toast.error("Failed to complete payment");
        router.push("/cart");
      } finally {
        setLoading(false);
      }
    };

    completeOrder();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">
            Completing your order...
          </h1>
          <p>Please wait while we process your payment.</p>
        </div>
      </div>
    );
  }

  return null;
}

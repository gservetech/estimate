"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import useCartStore from "@/store";
import toast from "react-hot-toast";

export default function SuccessPage() {
  const [loading, setLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const { resetCart } = useCartStore();

  useEffect(() => {
    const orderNumber = searchParams.get("orderNumber");
    const token = searchParams.get("token");

    console.log("Success page params:", { orderNumber, token });

    if (!orderNumber || !token) {
      console.error("Missing parameters:", { orderNumber, token });
      setError("Invalid payment information");
      setLoading(false);
      return;
    }

    const capturePayment = async () => {
      try {
        console.log("Attempting to capture payment for order:", orderNumber);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/${orderNumber}/capture`,
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
        console.log("Capture response:", data);

        if (!response.ok) {
          throw new Error(data.error || "Failed to capture payment");
        }

        // Clear cart and storage after successful capture
        resetCart();
        sessionStorage.removeItem("pendingOrderNumber");
        sessionStorage.removeItem("paypalToken");

        // Set order details for display
        setOrderDetails(data);
        toast.success("Payment completed successfully");
      } catch (error) {
        console.error("Payment capture error:", error);
        setError("Failed to complete payment");
        setTimeout(() => router.push("/cart"), 3000);
      } finally {
        setLoading(false);
      }
    };

    capturePayment();
  }, [searchParams, router, resetCart]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4">
            Completing your payment...
          </h1>
          <p>
            Please don&apos;t close this window while we process your payment.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-semibold mb-4 text-red-600">
            Payment Error
          </h1>
          <p>{error}</p>
          <p className="mt-4">Redirecting to cart...</p>
        </div>
      </div>
    );
  }

  if (orderDetails) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="max-w-md w-full mx-4 bg-white p-8 rounded-lg shadow-lg">
          <div className="text-center">
            <div className="mb-4">
              <svg
                className="w-16 h-16 text-green-500 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Order Successful!
            </h1>
            <p className="text-gray-600 mb-6">
              Thank you for your purchase. Your order has been confirmed.
            </p>
            <div className="text-left bg-gray-50 p-4 rounded-lg mb-6">
              <p className="mb-2">
                <span className="font-semibold">Order Number:</span>{" "}
                {orderDetails.orderNumber}
              </p>
              {orderDetails.amount && (
                <p className="mb-2">
                  <span className="font-semibold">Amount Paid:</span> $
                  {orderDetails.amount}
                </p>
              )}
            </div>
            <div className="flex gap-4">
              <button
                onClick={() =>
                  router.push(`/orders/${orderDetails.orderNumber}`)
                }
                className="flex-1 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                View Order
              </button>
              <button
                onClick={() => router.push("/")}
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

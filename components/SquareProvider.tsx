"use client";

import { useState, useEffect, useCallback } from "react";
import Script from "next/script";
import { useRouter } from "next/navigation";
import useCartStore from "@/store";
import { PaymentStatus } from "./PaymentStatus";
import { useAuth } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useRefreshOrders } from "@/lib/useRefreshOrders";
import useOrderStore from "@/store/orderStore";

// Square SDK type definitions
interface SquareCardOptions {
  /** Postal code collection options */
  postalCode?: boolean | "auto";
}

interface SquareCard {
  attach: (element: HTMLElement | string) => Promise<void>;
  tokenize: () => Promise<{
    status: string;
    token?: string;
    errors?: Array<{ message: string }>;
  }>;
  destroy: () => void;
}

interface SquarePayments {
  card: (options?: SquareCardOptions) => SquareCard;
}

interface SquareProviderProps {
  amount: number;
  currency: string;
  shippingData: {
    street: string;
    city: string;
    provinceId: string | null;
    provinceName: string;
    postalCode: string;
    countryId: string | null;
    countryName: string;
  };
}

export default function SquareProvider({
  amount,
  currency,
  shippingData,
}: SquareProviderProps) {
  const router = useRouter();
  const { userId } = useAuth();
  const { resetCart, getGroupedItems } = useCartStore();
  const refreshOrders = useRefreshOrders();
  const [squareLoaded, setSquareLoaded] = useState(false);
  const [card, setCard] = useState<SquareCard | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [statusMessage, setStatusMessage] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [squareScriptLoaded, setSquareScriptLoaded] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // Initialize Square Web Payment SDK
  const initializeSquarePayment = useCallback(async () => {
    if (!window.Square || squareLoaded) return;

    try {
      const applicationId = process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID!;
      const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID!;

      console.log("Initializing Square with:", { applicationId, locationId });

      if (!applicationId || !locationId) {
        throw new Error("Square application ID or location ID is missing");
      }

      // Create the Square payments instance
      const payments = window.Square.payments(applicationId, locationId);

      // Create a card payment method
      const card = await payments.card({
        postalCode: "auto",
      });

      // Attach the card to the container
      try {
        await card.attach("#card-container");
        console.log("Card attached to container successfully");
      } catch (attachError) {
        console.error("Error attaching card:", attachError);
        throw attachError;
      }

      setCard(card);
      setSquareLoaded(true);
      setLoadingTimeout(false);
      console.log("Square payment form initialized successfully");
    } catch (error) {
      console.error("Error initializing Square:", error);
      setPaymentStatus("error");
      setStatusMessage(
        `Failed to initialize payment form: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
    }
  }, [squareLoaded]);

  // Initialize when script is loaded
  useEffect(() => {
    if (squareScriptLoaded && typeof window !== "undefined" && window.Square) {
      // Set a timeout to track slow loading
      const timeoutId = setTimeout(() => {
        setLoadingTimeout(true);
      }, 5000); // 5 seconds timeout

      initializeSquarePayment();

      return () => clearTimeout(timeoutId);
    }
  }, [squareScriptLoaded, initializeSquarePayment]);

  // Add an automatic retry mechanism if loading takes too long
  useEffect(() => {
    if (loadingTimeout && !squareLoaded) {
      console.log("Square SDK loading timeout, attempting to reload...");
      setSquareScriptLoaded(false);

      // Try to reload the Square SDK
      const reloadTimeoutId = setTimeout(() => {
        setSquareScriptLoaded(true);
      }, 1000);

      return () => clearTimeout(reloadTimeoutId);
    }
  }, [loadingTimeout, squareLoaded]);

  // Clean up card instance on unmount
  useEffect(() => {
    return () => {
      if (card) {
        try {
          card.destroy();
        } catch (error) {
          console.error("Error destroying card instance:", error);
        }
      }
    };
  }, [card]);

  // Generate a tracking number in the format TRK-XXXX-XXXXXXXXXX
  const generateTrackingNumber = () => {
    // Extract first 4 digits from address or use random 4 digits
    const addressDigits = shippingData.street
      .split("")
      .filter((char) => !isNaN(parseInt(char)))
      .join("")
      .substring(0, 4)
      .padEnd(4, "0");

    const randomChars =
      currency +
      Array(10)
        .fill(0)
        .map(() => String.fromCharCode(65 + Math.floor(Math.random() * 26)))
        .join("");

    return `TRK-${addressDigits}-${randomChars}`;
  };

  const handlePaymentMethodSubmit = async () => {
    if (!card) {
      setPaymentStatus("error");
      setStatusMessage(
        "Payment form is not properly loaded. Please refresh the page."
      );
      return;
    }

    try {
      setLoading(true);
      setPaymentStatus("loading");

      // Tokenize the card
      const result = await card.tokenize();
      console.log("Tokenization result:", result);

      // Ensure amount is properly formatted (should be in cents)
      console.log(`Sending payment with amount: $${amount}`);

      // Convert dollars to cents (multiply by 100)
      const amountInCents = Math.round(amount * 100);
      console.log(`Amount in cents: ${amountInCents}`);

      // Process payment with the token
      const paymentResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/direct-payment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sourceId: result.token,
            amount: amountInCents,
            currency: currency,
          }),
        }
      );

      const paymentData = await paymentResponse.json();

      if (!paymentResponse.ok) {
        throw new Error(paymentData.error || "Payment processing failed");
      }

      console.log("Payment successful:", paymentData);
      setPaymentStatus("success");
      toast.success("Payment processed successfully!");

      // If payment was successful, create an order in the backend
      if (!userId) {
        console.error("User ID not available. Cannot create order.");
        setStatusMessage(
          "Payment successful, but order creation failed. Please contact support."
        );
        return;
      }

      // Get cart items
      const cartItems = getGroupedItems();

      // Map cart items to the expected product format
      const products = cartItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
      }));

      // Generate tracking number
      const trackingNumber = generateTrackingNumber();

      // Tomorrow's date for delivery
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(12, 0, 0, 0);

      // Create order payload
      const orderPayload = {
        clerkId: userId,
        totalPrice: amount,
        currencyCode: currency,
        amountDiscount: 0,
        orderStatusId: 1,
        trackingNumber: trackingNumber,
        deliveryDate: tomorrow.toISOString(),
        street: shippingData.street,
        city: shippingData.city,
        provinceId: shippingData.provinceId
          ? parseInt(shippingData.provinceId)
          : null,
        provinceName: shippingData.provinceName,
        stateId: null,
        stateName: null,
        postalCode: shippingData.postalCode,
        countryId: shippingData.countryId
          ? parseInt(shippingData.countryId)
          : null,
        countryName: shippingData.countryName,
        products: products,
      };

      console.log("Creating order with payload:", orderPayload);

      // Call the backend API to create the order
      try {
        const orderResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(orderPayload),
          }
        );

        const orderData = await orderResponse.json();

        if (!orderResponse.ok) {
          console.error("Failed to create order:", orderData);
          toast.error("Order creation failed. Please contact support.");
          throw new Error(orderData.error || "Order creation failed");
        }

        console.log("Order created successfully:", orderData);
        toast.success("Order placed successfully!");

        // Refresh orders to update the header count
        await refreshOrders();

        // Also directly add the order to the store to ensure immediate updates
        if (orderData && orderData.order) {
          try {
            // Get the current order store and use the addOrder function
            const orderStore = useOrderStore.getState();
            orderStore.addOrder(orderData.order);
            console.log("Directly added new order to store using addOrder");

            // Dispatch a custom event to notify the header component
            if (typeof window !== "undefined") {
              window.dispatchEvent(new Event("order-updated"));
              console.log("Dispatched order-updated event");
            }
          } catch (err) {
            console.error("Error directly updating order store:", err);
          }
        }

        // Reset cart and redirect after successful order creation
        setTimeout(() => {
          resetCart();
          router.push(`/success?orderNumber=${orderData.orderNumber}`);
        }, 2000);
      } catch (orderError) {
        console.error("Order creation error:", orderError);
        // Still show success for payment, but notify about order issues
        setStatusMessage(
          "Payment successful, but there was an issue creating your order. Please contact support."
        );
        toast.error(
          "Payment successful, but there was an issue creating your order. Please contact support."
        );
      }
    } catch (error) {
      console.error("Payment processing error:", error);
      setPaymentStatus("error");
      setStatusMessage(
        error instanceof Error ? error.message : "Payment processing failed"
      );
      toast.error(
        error instanceof Error ? error.message : "Payment processing failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col">
      <Script
        src="https://sandbox.web.squarecdn.com/v1/square.js"
        strategy="afterInteractive"
        onReady={() => {
          console.log("Square SDK script is ready to be used");
          setSquareScriptLoaded(true);
        }}
        onLoad={() => {
          console.log("Square SDK script loaded");
        }}
        onError={(e) => {
          console.error("Error loading Square SDK:", e);
          setPaymentStatus("error");
          setStatusMessage(
            "Failed to load payment SDK. Please refresh the page."
          );
        }}
      />

      {/* Card container */}
      <div className="mb-6 w-full">
        <div
          id="card-container"
          className="min-h-[150px] bg-white border border-gray-200 rounded-md shadow-sm relative"
        >
          {!squareLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-50 bg-opacity-70 z-10">
              <div className="flex flex-col items-center">
                <svg
                  className="animate-spin h-6 w-6 text-blue-500 mb-2"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <p className="text-sm text-gray-600">Loading payment form...</p>

                {/* Show an additional message and reload button if loading takes too long */}
                {loadingTimeout && (
                  <div className="mt-3 text-center">
                    <p className="text-xs text-amber-700 mb-2">
                      Loading is taking longer than expected
                    </p>
                    <button
                      onClick={() => {
                        setSquareScriptLoaded(false);
                        setTimeout(() => setSquareScriptLoaded(true), 500);
                      }}
                      className="text-xs px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                    >
                      Reload Form
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment button */}
      <div className="w-full mb-6">
        {paymentStatus !== "idle" ? (
          <PaymentStatus
            paymentStatus={paymentStatus}
            message={statusMessage}
          />
        ) : (
          <button
            id="card-button"
            disabled={!card || loading}
            onClick={handlePaymentMethodSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md py-3 px-4 flex items-center justify-center font-medium transition-colors disabled:bg-blue-300 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing
              </>
            ) : (
              <>Pay ${Number(amount).toFixed(2)}</>
            )}
          </button>
        )}
      </div>

      {/* Security message */}
      <div className="flex items-center justify-center text-xs text-gray-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 mr-1"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
            clipRule="evenodd"
          />
        </svg>
        Secure payment processing by Square
      </div>

      {/* <div className="mt-1 text-center text-xs text-gray-400">
        <a
          href="https://developer.squareup.com/docs/testing/test-values"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-gray-500"
        >
          View sandbox test cards
        </a>
      </div> */}
    </div>
  );
}

// Add type definition for Square
declare global {
  interface Window {
    Square?: {
      payments: (applicationId: string, locationId: string) => SquarePayments;
    };
  }
}

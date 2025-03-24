"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

interface PaymentLinkButtonProps {
  productName: string;
  amount: number;
  currencyCode: string;
  userId: string;
}

export default function SquarePaymentLinkButton({
  productName,
  amount,
  currencyCode,
  userId,
}: PaymentLinkButtonProps) {
  const [loading, setLoading] = useState(false);
  const [paymentLink, setPaymentLink] = useState<string | null>(null);

  const handleCreatePaymentLink = async () => {
    if (!userId) {
      toast.error("Please login to continue");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/square/payment-link`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productName,
            amount,
            currencyCode,
            clerkId: userId,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create payment link");
      }

      setPaymentLink(data.paymentLink.url);
      toast.success("Payment link created successfully!");
    } catch (error) {
      console.error("Error creating payment link:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to create payment link"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      {!paymentLink ? (
        <button
          onClick={handleCreatePaymentLink}
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 transition-colors disabled:bg-gray-400"
        >
          {loading ? "Creating Link..." : "Create Payment Link"}
        </button>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-gray-600">
            Share this payment link with your customer:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={paymentLink}
              readOnly
              className="flex-1 p-2 border rounded-md"
            />
            <button
              onClick={() => {
                navigator.clipboard.writeText(paymentLink);
                toast.success("Link copied to clipboard!");
              }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
            >
              Copy
            </button>
          </div>
          <a
            href={paymentLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-center bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
          >
            Open Link
          </a>
        </div>
      )}
    </div>
  );
}

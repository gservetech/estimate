import { NextRequest, NextResponse } from "next/server";
import { Client, Environment } from "square";
import crypto from "crypto";

// Add JSON serialization for BigInt
// This allows BigInt to be properly serialized when converting to JSON
// @ts-expect-error: BigInt.prototype augmentation
BigInt.prototype.toJSON = function () {
  return this.toString();
};

// Square API error interfaces
interface SquareError {
  category?: string;
  code?: string;
  detail?: string;
  field?: string;
  message?: string;
}

interface SquareApiError extends Error {
  statusCode?: number;
  errors?: SquareError[];
}

// Initialize Square client
const squareClient = new Client({
  accessToken: process.env.SQUARE_ACCESS_TOKEN,
  environment: Environment.Sandbox,
});

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json();
    const { sourceId, amount } = body;

    // Validate required parameters
    if (!sourceId || amount === undefined) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: sourceId and amount are required",
        },
        { status: 400 }
      );
    }

    // Validate amount is a valid number
    if (isNaN(amount) || amount <= 0) {
      return NextResponse.json(
        { error: "Amount must be a positive number" },
        { status: 400 }
      );
    }

    console.log(
      `Processing payment with amount: ${amount}, type: ${typeof amount}`
    );

    // The amount is already in cents from the frontend
    const amountInCents = Math.round(Number(amount));
    console.log(`Amount in cents for Square API: ${amountInCents}`);

    // Generate a random idempotency key
    const idempotencyKey = crypto.randomUUID();

    // Create payment request with properly formatted amount
    const paymentResponse = await squareClient.paymentsApi.createPayment({
      sourceId,
      idempotencyKey,
      amountMoney: {
        currency: "USD",
        amount: BigInt(amountInCents), // Convert to BigInt after ensuring it's an integer
      },
      // Location ID is required for processing payments
      locationId: process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID,
      // Optional fields below
      referenceId: crypto.randomUUID().slice(0, 8), // Reference for your internal systems
      note: "Payment from website checkout",
    });

    console.log("Payment successful:", paymentResponse.result);

    // Return successful response
    return NextResponse.json({
      success: true,
      paymentId: paymentResponse.result.payment?.id,
      status: paymentResponse.result.payment?.status,
      amount: paymentResponse.result.payment?.amountMoney,
      createdAt: paymentResponse.result.payment?.createdAt,
    });
  } catch (error: unknown) {
    console.error("Error processing payment:", error);

    // Handle Square-specific errors
    if (typeof error === "object" && error !== null && "statusCode" in error) {
      const squareError = error as SquareApiError;

      return NextResponse.json(
        {
          error: "Payment processing failed",
          details:
            squareError.errors?.map((e) => e.detail).join(", ") ||
            "Unknown error",
        },
        { status: squareError.statusCode || 500 }
      );
    }

    // Handle general errors
    return NextResponse.json(
      {
        error: "Payment processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

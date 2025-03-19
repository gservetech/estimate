import { NextResponse } from "next/server";
import * as checkoutServerSdk from "@paypal/checkout-server-sdk";
import paypalClient, { CreateOrderResponse } from "@/lib/paypal";

interface CreateOrderRequest {
  amount: string;
  userId?: string;
  currency: string;
}

export async function POST(request: Request) {
  try {
    const { amount, userId, currency }: CreateOrderRequest =
      await request.json();

    if (!amount || isNaN(parseFloat(amount))) {
      return NextResponse.json(
        {
          error: "Amount is required and must be a number",
        },
        { status: 400 }
      );
    }

    // Ensure the amount is positive number
    if (parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: "Amount must be greater than 0" },
        { status: 400 }
      );
    }

    // Create PayPal order
    const paypalRequest = new checkoutServerSdk.orders.OrdersCreateRequest();
    paypalRequest.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "CAD",
            value: Number(amount).toFixed(2),
          },
          custom_id: userId,
        },
      ],
    });

    const requestBody = paypalRequest.body; // Access the body of the request

    // Check if custom_id exists in purchase_units
    const purchaseUnits = requestBody.purchase_units;
    if (purchaseUnits && purchaseUnits[0] && purchaseUnits[0].custom_id) {
    } else {
      console.error("custom_id is missing in purchase_units");
      return NextResponse.json(
        { error: "Missing custom_id in request" },
        { status: 400 }
      );
    }

    const response = await paypalClient().execute(paypalRequest);

    return NextResponse.json<CreateOrderResponse>({
      orderID: response.result.id,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        error: "Failed to create order",
      },
      { status: 500 }
    );
  }
}

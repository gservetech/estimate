import { NextResponse } from "next/server";
import * as checkoutServerSdk from "@paypal/checkout-server-sdk";
import paypalClient, { CaptureOrderResponse } from "@/lib/paypal";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  const captureRequest = new checkoutServerSdk.orders.OrdersCaptureRequest(
    orderId
  );
  // captureRequest.requestBody({});

  try {
    const response = await paypalClient().execute(captureRequest);

    const result = response.result;
    const purcahseUnits = result.purchase_units;

    console.log("result", result);
    console.log("purchase units", purcahseUnits);

    const customId = result.purchase_units[0].payments.captures[0].custom_id;

    console.log("Clerk userId from PayPal response", customId);

    console.log("Capture response:", JSON.stringify(response));
    return NextResponse.json<CaptureOrderResponse>({
      status: response.result.status,
      id: response.result.id,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Payment capture failed" },
      { status: 500 }
    );
  }
}

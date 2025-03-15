import { NextResponse } from "next/server";
import * as checkoutServerSdk from "@paypal/checkout-server-sdk";
import paypalClient from "@/lib/paypal";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const orderId = searchParams.get("orderId");

  if (!orderId) {
    return NextResponse.json({ error: "Missing orderId" }, { status: 400 });
  }

  try {
    const paypalRequest = new checkoutServerSdk.orders.OrdersGetRequest(
      orderId
    );
    const response = await paypalClient().execute(paypalRequest);
    const order = response.result;

    // Extract relevant order details
    const orderDetails = {
      id: order.id,
      status: order.status,
      customId:
        order.purchase_units[0].payments?.captures?.[0]?.custom_id ||
        order.purchase_units[0].custom_id,
      amount:
        order.purchase_units[0].payments?.captures?.[0]?.amount.value ||
        order.purchase_units[0].amount.value,
      currency:
        order.purchase_units[0].payments?.captures?.[0]?.amount.currency_code ||
        order.purchase_units[0].amount.currency_code,
      payerEmail: order.payer?.email_address,
      createdAt: order.create_time,
    };

    return NextResponse.json({ order: orderDetails });
  } catch (error) {
    console.error("Error fetching order details:", error);
    return NextResponse.json(
      { error: "Failed to fetch order details" },
      { status: 500 }
    );
  }
}

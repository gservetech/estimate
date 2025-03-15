import { NextResponse } from "next/server";
import * as checkoutServerSdk from "@paypal/checkout-server-sdk";
import paypalClient, { CaptureOrderResponse } from "@/lib/paypal";
import {
  // createOrderRequest,
  generateTrackingNumber,
  getCountryId,
  getProvinceId,
} from "@/lib/createOrder";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;

  try {
    // First verify the order details
    const orderDetailsRequest = new checkoutServerSdk.orders.OrdersGetRequest(
      orderId
    );
    const orderDetailsResponse = await paypalClient().execute(
      orderDetailsRequest
    );
    const orderDetails = orderDetailsResponse.result;

    // Get the custom_id (clerk_id) from the original order
    const customId = orderDetails.purchase_units[0].custom_id;

    if (!customId) {
      return NextResponse.json(
        { error: "Invalid order: missing customer ID" },
        { status: 400 }
      );
    }

    const captureRequest = new checkoutServerSdk.orders.OrdersCaptureRequest(
      orderId
    );
    const response = await paypalClient().execute(captureRequest);
    const result = response.result;
    const purchaseUnits = result.purchase_units;

    if (result.status === "COMPLETED") {
      const payment = purchaseUnits[0].payments.captures[0];
      const shipping = purchaseUnits[0].shipping?.address;

      // Get country ID based on country code
      const countryCode = shipping?.country_code || "US";
      const { id: countryId, name: countryName } = getCountryId(countryCode);

      // Get province ID based on admin_area_1 (state/province code) and country
      const provinceCode = shipping?.admin_area_1 || null;
      const { id: provinceId, name: provinceName } = getProvinceId(
        provinceCode,
        countryId
      );

      // Create dates with proper ISO format
      const currentDate = new Date();
      const deliveryDate = new Date(
        currentDate.getTime() + 3 * 24 * 60 * 60 * 1000
      );

      const orderData = {
        clerkId: customId,
        totalPrice: parseFloat(payment.amount.value),
        currencyCode: payment.amount.currency_code,
        amountDiscount: 0,
        orderStatusId: 3,
        orderDate: currentDate.toISOString().slice(0, 19),
        trackingNumber: generateTrackingNumber(),
        deliveryDate: deliveryDate.toISOString().slice(0, 19),
        shippingAddressId: 1,
        street: shipping?.address_line_1 || "",
        city: shipping?.admin_area_2 || "",
        provinceId,
        provinceName: provinceName,
        countryId,
        countryName: countryName,
        postalCode: shipping?.postal_code || "",
        products: [
          {
            productId: 1,
            quantity: 1,
            unitPrice: parseFloat(payment.amount.value),
          },
        ],
      };

      console.log(
        "Creating order with data:",
        JSON.stringify(orderData, null, 2)
      );

      // Make the request directly to the backend server
      const orderResponse = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(orderData),
        }
      );

      const orderResult = await orderResponse.json();

      console.log("Order creation result:", orderResult);

      if (!orderResponse.ok) {
        console.error("Failed to create order:", orderResult);
        return NextResponse.json(
          { error: orderResult.error || "Failed to create order in system" },
          { status: 500 }
        );
      }

      return NextResponse.json<CaptureOrderResponse>({
        status: result.status,
        id: result.id,
        orderNumber: orderResult.orderNumber,
      });
    }

    return NextResponse.json(
      { error: "Payment not completed" },
      { status: 400 }
    );
  } catch (error) {
    console.error("PayPal capture error:", error);
    return NextResponse.json(
      { error: "Payment capture failed" },
      { status: 500 }
    );
  }
}

import { NextResponse } from "next/server";
import * as checkoutServerSdk from "@paypal/checkout-server-sdk";
import paypalClient, { CaptureOrderResponse } from "@/lib/paypal";
import {
  // createOrderRequest,
  generateTrackingNumber,
  getCountryId,
  getProvinceId,
} from "@/lib/createOrder";
import { Product } from "@/types/product.types";
import { formatDate } from "@/lib/utils";

interface CartItem {
  product: Product;
  unitPrice: number;
  quantity: number;
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ orderId: string }> }
) {
  const { orderId } = await params;
  const { cartItems } = await request.json();

  console.log("cartItems", cartItems);

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

    console.log("result when creating the order", result);

    const purchaseUnits = result.purchase_units;

    if (result.status === "COMPLETED") {
      const payment = purchaseUnits[0].payments.captures[0];
      const shipping = purchaseUnits[0].shipping?.address;
      const payer = result.payer;

      console.log("payment", payment);
      console.log("shipping", shipping);

      // Transform cart items into order products with proper typing
      const orderProducts = cartItems.map((item: CartItem) => ({
        productId: item.product.id,
        quantity: item.quantity,
        unitPrice: item.product.price,
      }));

      // Calculate total price from cart items
      // const totalPrice = orderProducts.reduce(
      //   (sum: number, item: CartItem) => sum + item.unitPrice * item.quantity,
      //   0
      // );

      // Get country and province/state IDs
      const countryCode = shipping?.country_code || "US";
      const { id: countryId, name: countryName } = getCountryId(countryCode);
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

      // Check if address exists for the user
      let shippingAddressId;
      let existingAddressId = 0;

      try {
        const addressCheckResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/clerk/${customId}/address`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (addressCheckResponse.ok) {
          const existingAddress = await addressCheckResponse.json();
          console.log("existingAddress", existingAddress);
          existingAddressId = existingAddress.id;

          // Check if the address details match
          const addressMatches =
            existingAddress.street === (shipping?.address_line_1 || "") &&
            existingAddress.city === (shipping?.admin_area_2 || "") &&
            existingAddress.province?.id === provinceId &&
            existingAddress.province?.name === provinceName &&
            existingAddress.country?.id === countryId &&
            existingAddress.country?.name === countryName &&
            existingAddress.postal_code === (shipping?.postal_code || "");

          if (addressMatches) {
            shippingAddressId = existingAddress.id;
          } else {
            shippingAddressId = existingAddressId + 1;
          }
        }
      } catch (error) {
        console.error("Error checking existing address:", error);
      }

      // Create the order data based on whether address matched or not
      let orderData;
      if (shippingAddressId === existingAddressId) {
        // Use existing address
        orderData = {
          clerkId: customId,
          totalPrice: payment.amount.value,
          currencyCode: payment.amount.currency_code,
          amountDiscount: 0,
          orderStatusId: 3,
          orderDate: currentDate.toISOString().slice(0, 19),
          trackingNumber: generateTrackingNumber(),
          deliveryDate: deliveryDate.toISOString().slice(0, 19),
          shippingAddressId,
          products: orderProducts,
        };
      } else {
        // Create new address
        orderData = {
          clerkId: customId,
          totalPrice: payment.amount.value,
          currencyCode: payment.amount.currency_code,
          amountDiscount: 0,
          orderStatusId: 3,
          orderDate: currentDate.toISOString().slice(0, 19),
          trackingNumber: generateTrackingNumber(),
          deliveryDate: deliveryDate.toISOString().slice(0, 19),
          shippingAddressId,
          street: shipping?.address_line_1 || "",
          city: shipping?.admin_area_2 || "",
          provinceId,
          provinceName,
          countryId,
          countryName,
          postalCode: shipping?.postal_code || "",
          products: orderProducts,
        };
      }

      console.log("orderDataa", orderData);

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

      console.log(orderResult);

      if (!orderResponse.ok) {
        console.error("Failed to create order:", orderResult);
        return NextResponse.json(
          { error: orderResult.error || "Failed to create order in system" },
          { status: 500 }
        );
      }

      // Send confirmation email
      try {
        const emailData = {
          email: payer.email_address,
          orderNumber: orderResult.orderNumber,
          orderDate: formatDate(new Date()),
          items: cartItems.map((item: CartItem) => ({
            quantity: item.quantity,
            name: item.product.name,
            price: item.product.price,
          })),
          total: payment.amount.value,
          customerName:
            payer.name.given_name || payer.name.surname || "Valued Customer",
          shippingAddress: `${shipping?.address_line_1}\n${shipping?.admin_area_2}, ${shipping?.admin_area_1}\n${shipping?.postal_code}\n${shipping?.country_code}`,
        };

        console.log("emailData", emailData);

        const emailResponse = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/sendEmail`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(emailData),
          }
        );

        if (!emailResponse.ok) {
          console.error(
            "Failed to send confirmation email:",
            await emailResponse.json()
          );
        }
      } catch (emailError) {
        console.error("Error sending confirmation email:", emailError);
        // Don't return here - we still want to return the successful order creation
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

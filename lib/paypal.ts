import "server-only";
import checkoutNodeJssdk from "@paypal/checkout-server-sdk";

export interface CreateOrderResponse {
  orderID: string;
}

export interface CaptureOrderResponse {
  status: string;
  id: string;
  orderNumber: string;
}

const configureEnvironment = function () {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("PayPal credentials are not properly configured");
  }

  try {
    return process.env.PAYPAL_ENV === "sandbox"
      ? new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret)
      : new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret);
  } catch (error) {
    console.error("PayPal environment configuration error:", error);
    throw error;
  }
};

const paypalClient = function () {
  try {
    return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment());
  } catch (error) {
    console.error("PayPal client creation error:", error);
    throw error;
  }
};

export default paypalClient;

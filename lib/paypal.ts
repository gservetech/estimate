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
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET!;

  return process.env.NODE_ENV === "production"
    ? new checkoutNodeJssdk.core.LiveEnvironment(clientId, clientSecret)
    : new checkoutNodeJssdk.core.SandboxEnvironment(clientId, clientSecret);
};

const paypalClient = function () {
  return new checkoutNodeJssdk.core.PayPalHttpClient(configureEnvironment());
};

export default paypalClient;

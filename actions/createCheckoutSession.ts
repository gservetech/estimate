"use server";

import stripe from "@/lib/stripe";
import Stripe from "stripe";
 
import { CartItem } from "@/store";
import { log } from "console";

export interface Metadata {
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  clerkUserId: string;
}

export interface GroupedCartItems {
  product: CartItem["product"];
  quantity: number;
}

export async function createCheckoutSession(
  items: GroupedCartItems[],
  metadata: Metadata
) {
  try {
    // Validate if any grouped items don't have a price
    const itemsWithoutPrice = items.filter((item) => !item.product.price);
    if (itemsWithoutPrice.length > 0) {
      throw new Error("Some items do not have a price");
    }

    // Retrieve existing customer or create a new one
    const customers = await stripe.customers.list({
      email: metadata.customerEmail,
      limit: 1,
    });

    const customerId = customers.data.length > 0 ? customers.data[0].id : "";

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      metadata: {
        orderNumber: metadata.orderNumber,
        customerName: metadata.customerName,
        customerEmail: metadata.customerEmail,
        clerkUserId: metadata.clerkUserId,
      },
      mode: "payment",
      allow_promotion_codes: true,
      payment_method_types: ["card"],
      success_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || `http://${process.env.VERCEL_URL}`
      }/success?session_id={CHECKOUT_SESSION_ID}&orderNumber=${metadata.orderNumber}`,
      cancel_url: `${
        process.env.NEXT_PUBLIC_BASE_URL || `http://${process.env.VERCEL_URL}`
      }/cart`,
      line_items: items.map((item) => ({
        price_data: {
          currency: "USD",
          unit_amount: Math.round(item.product.price! * 100), // Convert to cents
          product_data: {
            name: item.product.name || "Unnamed Product",
            description: Array.isArray(item.product.description) 
            ? item.product.description.join(", ") // Convert array to string
            : item.product.description || "", // Ensure it's a string
            metadata: { id: item.product.id },
            images: item.product.images
              ? [item.product.images[0]]
              : undefined,
          },
        },
        quantity: item.quantity,
      })),
    };

    // Conditionally add customer or customer_email
    if (customerId) {
      sessionPayload.customer = customerId;
    } else {
      sessionPayload.customer_email = metadata.customerEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionPayload);
    console.log();
    
    return session.url;
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw error;
  }
}

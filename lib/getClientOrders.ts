import { Order } from "@/types/order.types";

interface GetClientOrdersResponse {
  orders: Order[];
  error: string | null;
}

export async function getClientOrders(
  clerkId: string | null | undefined
): Promise<GetClientOrdersResponse> {
  try {
    if (!clerkId) {
      return { orders: [], error: "Clerk ID is required" };
    }

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/clerk/${clerkId}`,
      {
        cache: "no-store",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status === 404) {
      // No orders found, return empty array
      console.log("No orders found for user:", clerkId);
      return { orders: [], error: null };
    } else if (!response.ok) {
      throw new Error("Failed to fetch orders");
    }

    const orders = await response.json();
    return { orders, error: null };
  } catch (error) {
    console.error("Error fetching client orders:", error);
    return {
      orders: [],
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

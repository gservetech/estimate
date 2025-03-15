import { Order } from "@/types/order.types";

interface GetClientOrdersResponse {
  orders: Order[];
  error: string | null;
}

export async function getClientOrders(
  clerkId: string
): Promise<GetClientOrdersResponse> {
  try {
    if (!clerkId) {
      throw new Error("Clerk ID is required");
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

    if (!response.ok) {
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

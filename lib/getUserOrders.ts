import { auth, currentUser } from "@clerk/nextjs/server";

import { Order } from "@/types/order.types";
import { User } from "@/types/user.types";

interface GetUserOrdersResponse {
  user: User | null;
  orders: Order[];
  loading: boolean;
  error: string | null;
}

export async function getUserOrders(): Promise<GetUserOrdersResponse> {
  try {
    const clerkUser = await currentUser();
    const { userId } = await auth();

    let orders: Order[] = [];
    if (userId) {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/orders/clerk/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      orders = await response.json();
    }

    const user = clerkUser
      ? {
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          name: `${clerkUser.firstName || ""} ${
            clerkUser.lastName || ""
          }`?.trim(),
          profile_image_url: clerkUser.imageUrl,
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
          firstName: clerkUser.firstName || null,
          lastName: clerkUser.lastName || null,
          middleName: null,
          clerkId: clerkUser.id,
        }
      : null;

    return { user, orders, loading: false, error: null };
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return {
      user: null,
      orders: [],
      loading: false,
      error:
        error instanceof Error ? error.message : "An unknown error occurred",
    };
  }
}

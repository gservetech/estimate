import { getClientOrders } from "@/lib/getClientOrders";
import useOrderStore from "@/store/orderStore";
import { useAuth } from "@clerk/nextjs";
import { useCallback } from "react";

/**
 * Custom hook to refresh orders from the API and update the order store
 * @returns Function to refresh orders
 */
export function useRefreshOrders() {
  const { userId } = useAuth();
  const { setOrders, setUserId } = useOrderStore();

  const refreshOrders = useCallback(async () => {
    if (!userId) {
      console.log("Cannot refresh orders: No user ID available");
      return { success: false, message: "No user ID available" };
    }

    try {
      // Update the user ID in the store (ensures consistency)
      setUserId(userId);

      // Fetch the latest orders from the API
      const { orders, error } = await getClientOrders(userId);

      if (error) {
        console.error("Error refreshing orders:", error);
        return { success: false, message: error };
      }

      if (orders) {
        // Update the orders in the store - this should trigger header update
        setOrders(orders);

        // Force a store update by dispatching a state change
        const currentState = useOrderStore.getState();
        useOrderStore.setState({
          ...currentState,
          orders: [...orders],
        });

        console.log(`Successfully refreshed orders (${orders.length})`);
        return { success: true, count: orders.length };
      }

      return { success: true, count: 0 };
    } catch (error) {
      console.error("Exception while refreshing orders:", error);
      return {
        success: false,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  }, [userId, setOrders, setUserId]);

  return refreshOrders;
}

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order } from "@/types/order.types";

interface OrderState {
  userId: string | null;
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  setUserId: (userId: string | null) => void;
  addOrder: (order: Order) => void;
  getOrdersCount: () => number;
  clearOrders: () => void;
}

const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      userId: null,
      orders: [],
      setUserId: (userId) => set({ userId }),
      setOrders: (orders) => set({ orders }),
      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),
      getOrdersCount: () => {
        const state = get();
        // Always return the actual number of orders
        return state.orders.length;
      },
      clearOrders: () => set({ orders: [], userId: null }),
    }),
    { name: "order-store" }
  )
);

export default useOrderStore;

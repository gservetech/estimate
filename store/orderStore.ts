import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Order } from "@/types/order.types";

interface OrderState {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  addOrder: (order: Order) => void;
  getOrdersCount: () => number;
  clearOrders: () => void;
}

const useOrderStore = create<OrderState>()(
  persist(
    (set, get) => ({
      orders: [],
      setOrders: (orders) => set({ orders }),
      addOrder: (order) =>
        set((state) => ({
          orders: [...state.orders, order],
        })),
      getOrdersCount: () => get().orders.length,
      clearOrders: () => set({ orders: [] }),
    }),
    { name: "order-store" }
  )
);

export default useOrderStore;
